"""
Auto-Apply Engine — Week 3 orchestrator.

Flow per job:
  1. confidence_scorer  → veto check + score (0–100)
  2. score >= 70        → generate summary → authenticity gate → browser apply → screenshot
  3. score 50–69        → pending_review queue
  4. score < 50 / veto  → skipped, logged
  5. Any unhandled exc  → dead-letter queue + Slack alert

APPLY_DRY_RUN=true (env) fills forms but does NOT click Submit — safe for testing.
"""
from __future__ import annotations

import os
import tempfile
import structlog
from datetime import datetime, timezone

from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel
from services.supabase_client import supa
from services.confidence_scorer import (
    score as confidence_score,
    AUTO_THRESHOLD, REVIEW_THRESHOLD,
)
from services.application_summary import generate as gen_summary, AUTHENTICITY_FLOOR
from services.authenticity_gate import check as auth_check, GATE_THRESHOLD
from services.browser_pool import get_pool
from services.greenhouse_applier import apply as gh_apply
from services.screenshot_uploader import upload as upload_screenshot, ensure_bucket
from services.dead_letter import enqueue as dlq
from services.slack_alerts import alert

log = structlog.get_logger()
router = APIRouter(prefix="/api/apply", tags=["apply"])

DRY_RUN = os.environ.get("APPLY_DRY_RUN", "true").lower() == "true"


# ── Request models ─────────────────────────────────────────────────────────────

class ApplyRequest(BaseModel):
    candidate_id: str
    dry_run: bool | None = None  # overrides env var when set


# ── Endpoints ──────────────────────────────────────────────────────────────────

@router.post("/candidate")
async def auto_apply_candidate(req: ApplyRequest, bg: BackgroundTasks):
    """Trigger auto-apply for one candidate (runs in background)."""
    _verify_candidate(req.candidate_id)
    dry = req.dry_run if req.dry_run is not None else DRY_RUN
    bg.add_task(_run_for_candidate, req.candidate_id, dry)
    return {"status": "apply_started", "candidate_id": req.candidate_id, "dry_run": dry}


@router.post("/all")
async def auto_apply_all(bg: BackgroundTasks):
    """Trigger auto-apply for ALL active candidates (runs in background)."""
    bg.add_task(_run_for_all, DRY_RUN)
    return {"status": "apply_started_for_all", "dry_run": DRY_RUN}


@router.get("/status/{candidate_id}")
async def apply_status(candidate_id: str):
    """Return application counts by status for a candidate."""
    _verify_candidate(candidate_id)
    res = supa().table("applications").select("status").eq("candidate_id", candidate_id).execute()
    rows = res.data or []
    counts: dict[str, int] = {}
    for r in rows:
        counts[r["status"]] = counts.get(r["status"], 0) + 1
    return {"candidate_id": candidate_id, "counts": counts, "total": len(rows)}


@router.get("/queue")
async def reviewer_queue(queue_type: str = "pending_review", limit: int = 50):
    """Return items in the reviewer queue (for manager/employee dashboards)."""
    res = (
        supa()
        .table("reviewer_queue")
        .select("id, candidate_id, job_id, queue_type, payload, created_at")
        .eq("queue_type", queue_type)
        .is_("resolved_at", "null")
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return {"items": res.data or [], "queue_type": queue_type}


# ── Core logic ────────────────────────────────────────────────────────────────

def _verify_candidate(candidate_id: str) -> None:
    res = supa().table("candidates").select("id").eq("id", candidate_id).maybeSingle().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Candidate not found")


async def _run_for_all(dry_run: bool) -> None:
    res = supa().table("candidates").select("id").eq("onboarding_complete", True).execute()
    for cand in res.data or []:
        await _run_for_candidate(cand["id"], dry_run)


async def _run_for_candidate(candidate_id: str, dry_run: bool) -> None:
    log.info("apply_run_start", candidate=candidate_id, dry_run=dry_run)

    # Load candidate
    cand_res = supa().table("candidates").select("profile_json, preferences").eq("id", candidate_id).maybeSingle().execute()
    if not cand_res.data:
        return
    profile: dict = cand_res.data.get("profile_json") or {}
    prefs: dict   = cand_res.data.get("preferences") or {}

    # Load active resume PDF URL
    resume_url = _get_resume_url(candidate_id)

    # Load DNC companies
    dnc_res = supa().table("dnc_list").select("company_id").eq("candidate_id", candidate_id).execute()
    dnc_company_ids = {r["company_id"] for r in (dnc_res.data or [])}

    # Load already-applied job IDs
    applied_res = supa().table("applications").select("job_id").eq("candidate_id", candidate_id).execute()
    applied_job_ids = {r["job_id"] for r in (applied_res.data or [])}

    # Get high-fit jobs (fit_score >= 0.65 to cast wide enough net for scorer)
    jobs_res = (
        supa().table("jobs")
        .select("id, title, source_url, source_company_name, company_id, ats_type, "
                "ats_detected_confidence, fit_score, is_remote, salary_min, salary_max, "
                "requires_video, requires_portfolio, requires_work_sample, "
                "requires_assessment_first, form_field_count")
        .eq("is_active", True)
        .gte("fit_score", 0.65)
        .order("fit_score", desc=True)
        .limit(20)
        .execute()
    )
    jobs = jobs_res.data or []

    counts = {"auto_applied": 0, "pending_review": 0, "skipped": 0, "failed": 0}

    for job in jobs:
        job_id  = job["id"]
        job_url = job.get("source_url") or ""

        # Only auto-apply to Greenhouse for now
        ats = job.get("ats_type") or ""
        if not job_url or (ats != "greenhouse" and ats != ""):
            pass  # score still, but won't launch browser for non-greenhouse

        on_dnc = job.get("company_id") in dnc_company_ids

        conf, factors, veto = confidence_score(
            job, {"preferences": prefs}, already_applied=job_id in applied_job_ids, on_dnc=on_dnc
        )

        if veto:
            await _log_application(candidate_id, job_id, None, "skipped", conf, factors, veto)
            counts["skipped"] += 1
            continue

        if conf < REVIEW_THRESHOLD:
            await _log_application(candidate_id, job_id, None, "skipped", conf, factors, None)
            counts["skipped"] += 1
            continue

        if conf < AUTO_THRESHOLD:
            app_id = await _log_application(candidate_id, job_id, None, "pending_review", conf, factors, None)
            await _enqueue_review(candidate_id, job_id, app_id, "pending_review", {"confidence": conf})
            counts["pending_review"] += 1
            continue

        # Score >= AUTO_THRESHOLD — attempt auto-apply (Greenhouse only)
        if ats != "greenhouse" or not job_url:
            app_id = await _log_application(candidate_id, job_id, None, "pending_review", conf, factors, None)
            await _enqueue_review(candidate_id, job_id, app_id, "pending_review", {"reason": "non_greenhouse_ats"})
            counts["pending_review"] += 1
            continue

        app_id = await _log_application(candidate_id, job_id, None, "pending_review", conf, factors, None)

        try:
            # Generate cover paragraph
            cover_text, auth_summary, slot_data = await gen_summary(profile, prefs, job)

            # Authenticity gate
            auth_score, auth_flags = await auth_check(cover_text, profile, job)

            if auth_score < GATE_THRESHOLD or auth_summary < AUTHENTICITY_FLOOR:
                await _update_application(app_id, "manual_required", auth_score, auth_flags)
                await _enqueue_review(candidate_id, job_id, app_id, "manual_required",
                                      {"auth_score": auth_score, "flags": auth_flags})
                counts["pending_review"] += 1
                continue

            # Download resume to temp file
            resume_path = await _download_resume(resume_url)

            # Browser apply
            pool = get_pool()
            async with pool.acquire() as ctx:
                screenshot_bytes, form_data = await gh_apply(
                    ctx, job_url, profile, resume_path or "", cover_text, dry_run=dry_run
                )

            # Upload screenshot
            ensure_bucket()
            screenshot_url = await upload_screenshot(screenshot_bytes, candidate_id, job_id)

            status = "auto_applied" if (form_data.get("submitted") or dry_run) else "pending_review"
            await _update_application(
                app_id, status, auth_score, auth_flags,
                screenshot_url=screenshot_url,
                form_data=form_data,
                applied_by="bot" if not dry_run else "bot_dry_run",
            )

            if dry_run:
                log.info("apply_dry_run_complete", job=job.get("title"), candidate=candidate_id)
            else:
                log.info("apply_submitted", job=job.get("title"), candidate=candidate_id)
                await alert(
                    f"✅ Applied: {job.get('title')} at {job.get('source_company_name')} "
                    f"(score {conf:.0f}, auth {auth_score:.2f})",
                    level="info",
                )

            counts["auto_applied"] += 1

            # Clean up temp file
            if resume_path:
                try:
                    os.unlink(resume_path)
                except Exception:
                    pass

        except Exception as exc:
            log.error("apply_job_failed", job=job_id, error=str(exc)[:200])
            await dlq(candidate_id, job_id, app_id, str(exc), {"job_url": job_url})
            await _update_application(app_id, "pending_review", None, [str(exc)[:200]])
            counts["failed"] += 1

    log.info("apply_run_done", candidate=candidate_id, **counts)


# ── Helpers ────────────────────────────────────────────────────────────────────

async def _log_application(
    candidate_id: str,
    job_id: str,
    resume_id: str | None,
    status: str,
    confidence_score_val: float,
    factors: dict,
    veto: str | None,
) -> str:
    now = datetime.now(timezone.utc).isoformat()
    row = {
        "candidate_id":    candidate_id,
        "job_id":          job_id,
        "resume_id":       resume_id,
        "status":          status,
        "confidence_score": confidence_score_val,
        "confidence_factors": factors,
        "veto_applied":    veto,
        "applied_at":      now if status == "auto_applied" else None,
        "applied_by":      "bot" if status == "auto_applied" else None,
    }
    try:
        res = supa().table("applications").insert(row).execute()
        return (res.data or [{}])[0].get("id", "")
    except Exception as exc:
        log.error("application_insert_failed", error=str(exc)[:80])
        return ""


async def _update_application(
    app_id: str,
    status: str,
    auth_score: float | None,
    auth_flags: list | None,
    screenshot_url: str = "",
    form_data: dict | None = None,
    applied_by: str | None = None,
) -> None:
    if not app_id:
        return
    updates: dict = {
        "status": status,
        "authenticity_score": auth_score,
        "authenticity_flags": auth_flags,
    }
    if screenshot_url:
        updates["screenshot_url"] = screenshot_url
    if form_data:
        updates["form_data_submitted"] = form_data
    if applied_by:
        updates["applied_by"] = applied_by
    if status == "auto_applied":
        updates["applied_at"] = datetime.now(timezone.utc).isoformat()
    try:
        supa().table("applications").update(updates).eq("id", app_id).execute()
    except Exception as exc:
        log.error("application_update_failed", error=str(exc)[:80])


async def _enqueue_review(
    candidate_id: str,
    job_id: str,
    application_id: str,
    queue_type: str,
    payload: dict,
) -> None:
    try:
        supa().table("reviewer_queue").insert({
            "candidate_id":   candidate_id,
            "job_id":         job_id,
            "application_id": application_id,
            "queue_type":     queue_type,
            "payload":        payload,
        }).execute()
    except Exception as exc:
        log.error("queue_insert_failed", error=str(exc)[:80])


def _get_resume_url(candidate_id: str) -> str:
    """Get the active resume's PDF URL for a candidate."""
    try:
        res = (
            supa().table("resumes")
            .select("pdf_url")
            .eq("candidate_id", candidate_id)
            .eq("is_active", True)
            .limit(1)
            .execute()
        )
        return (res.data or [{}])[0].get("pdf_url") or ""
    except Exception:
        return ""


async def _download_resume(url: str) -> str | None:
    """Download resume PDF to a temp file. Returns temp file path or None."""
    if not url:
        return None
    try:
        import httpx
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.get(url)
            if resp.status_code != 200:
                return None
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        tmp.write(resp.content)
        tmp.close()
        return tmp.name
    except Exception as exc:
        log.warning("resume_download_failed", error=str(exc)[:80])
        return None
