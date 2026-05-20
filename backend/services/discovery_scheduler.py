"""
APScheduler heartbeat: discovery every 6 hours, daily digest at 08:00 UTC.
Import start_scheduler() / stop_scheduler() from main.py lifespan.
"""
from __future__ import annotations

import hashlib
import structlog
from datetime import datetime, timedelta, timezone

from apscheduler.schedulers.asyncio import AsyncIOScheduler  # type: ignore
from apscheduler.triggers.cron import CronTrigger            # type: ignore

# US Eastern Time — where the job market operates
_ET = "America/New_York"

from .job_discoverer import discover_jobs_for_candidate
from .company_normalizer import resolve_company
from .fit_scorer import score_job
from .supabase_client import supa

log = structlog.get_logger()

_scheduler = AsyncIOScheduler(timezone="UTC")

HIGH_FIT_THRESHOLD = 0.92


def _dedup_hash(title: str, company: str, location: str) -> str:
    raw = f"{title.lower().strip()}|{company.lower().strip()}|{location.lower().strip()}"
    return hashlib.sha256(raw.encode()).hexdigest()[:32]


async def run_discovery() -> dict:
    """Main discovery loop — called every 6 hours."""
    log.info("discovery_run_start")
    result = {"candidates": 0, "inserted": 0, "high_fit": 0, "errors": 0}

    try:
        res = supa().table("candidates").select("id, profile_json, preferences") \
                    .eq("onboarding_complete", True).execute()
        candidates = res.data or []
    except Exception as exc:
        log.error("discovery_fetch_candidates_failed", error=str(exc))
        return result

    result["candidates"] = len(candidates)

    for cand in candidates:
        cid: str  = cand["id"]
        profile: dict = cand.get("profile_json") or {}
        prefs: dict   = cand.get("preferences") or {}

        try:
            jobs = await discover_jobs_for_candidate(cid)
            inserted = 0
            high_fit_notifs: list[dict] = []

            for job in jobs:
                if not job.get("title") or not job.get("company"):
                    continue

                dedup = _dedup_hash(job["title"], job["company"], job.get("location", ""))

                # Skip duplicates
                dup_res = supa().table("jobs").select("id").eq("dedup_hash", dedup).maybeSingle().execute()
                if dup_res.data:
                    continue

                company_id = await resolve_company(job["company"])
                score, reason = await score_job(profile, prefs, job)

                posted_at = None
                if job.get("posted_at"):
                    try:
                        from datetime import date
                        posted_at = str(job["posted_at"])[:10]
                    except Exception:
                        pass

                row = {
                    "company_id": company_id,
                    "source": job.get("source") or "unknown",
                    "source_url": job.get("source_url") or None,
                    "source_company_name": job["company"],
                    "title": job["title"],
                    "location": job.get("location") or None,
                    "is_remote": job.get("is_remote", False),
                    "salary_min": job.get("salary_min"),
                    "salary_max": job.get("salary_max"),
                    "description_text": job.get("description_text") or None,
                    "fit_score": score,
                    "dedup_hash": dedup,
                    "is_active": True,
                    "posted_at": posted_at,
                }
                try:
                    supa().table("jobs").insert(row).execute()
                    inserted += 1
                    result["inserted"] += 1

                    if score >= HIGH_FIT_THRESHOLD:
                        high_fit_notifs.append({
                            "title": job["title"],
                            "company": job["company"],
                            "score": score,
                            "reason": reason,
                        })
                except Exception as exc:
                    log.warning("job_insert_error", dedup=dedup, error=str(exc)[:80])

            # Fire high-fit notifications (cap at 5 per run per candidate)
            for hf in high_fit_notifs[:5]:
                try:
                    supa().table("notifications").insert({
                        "candidate_id": cid,
                        "type": "high_fit_job",
                        "priority": "high",
                        "title": f"Excellent match: {hf['title']} at {hf['company']}",
                        "body": hf["reason"],
                        "metadata": hf,
                    }).execute()
                    result["high_fit"] += 1
                except Exception as exc:
                    log.warning("notification_insert_error", error=str(exc)[:80])

            log.info("discovery_candidate_done", cid=cid, inserted=inserted, high_fit=len(high_fit_notifs))

        except Exception as exc:
            log.error("discovery_candidate_error", cid=cid, error=str(exc)[:200])
            result["errors"] += 1

    log.info("discovery_run_done", **result)
    return result


async def run_daily_digest() -> None:
    """Send daily digest notification to every active candidate."""
    since = (datetime.now(timezone.utc) - timedelta(hours=24)).isoformat()

    try:
        new_count_res = supa().table("jobs").select("id", count="exact", head=True) \
                              .gte("discovered_at", since).eq("is_active", True).execute()
        total_new: int = new_count_res.count or 0

        if total_new == 0:
            return

        cands_res = supa().table("candidates").select("id").eq("onboarding_complete", True).execute()
        for cand in cands_res.data or []:
            supa().table("notifications").insert({
                "candidate_id": cand["id"],
                "type": "daily_digest",
                "priority": "medium",
                "title": f"Daily digest: {total_new} new job{'' if total_new == 1 else 's'} found",
                "body": f"We discovered {total_new} new jobs in the last 24 hours. Check your dashboard for top matches.",
                "metadata": {"new_jobs_count": total_new},
            }).execute()
    except Exception as exc:
        log.error("daily_digest_error", error=str(exc))


def start_scheduler() -> None:
    if _scheduler.running:
        return

    # ── Job discovery: every 90 min, 5am–5pm ET ───────────────────────────
    # 90-min intervals from 05:00 → 17:00 ET split into two cron patterns:
    #   on-hour  slots: 05:00, 08:00, 11:00, 14:00, 17:00
    #   half-hour slots: 06:30, 09:30, 12:30, 15:30
    _scheduler.add_job(
        run_discovery,
        CronTrigger(hour="5,8,11,14,17", minute="0", timezone=_ET),
        id="job_discovery_on_hour",
        replace_existing=True,
    )
    _scheduler.add_job(
        run_discovery,
        CronTrigger(hour="6,9,12,15", minute="30", timezone=_ET),
        id="job_discovery_half_hour",
        replace_existing=True,
    )

    # ── Daily digest: 5pm ET (end-of-market summary) ──────────────────────
    _scheduler.add_job(
        run_daily_digest,
        CronTrigger(hour=17, minute=5, timezone=_ET),
        id="daily_digest",
        replace_existing=True,
    )

    _scheduler.start()
    log.info("scheduler_started", discovery_slots=9, window_et="05:00-17:00")


def stop_scheduler() -> None:
    if _scheduler.running:
        _scheduler.shutdown(wait=False)
        log.info("scheduler_stopped")
