"""
Job discovery via python-jobspy (Indeed, Google Jobs).
Optionally uses SerpApi for richer Google Jobs data.
"""
from __future__ import annotations

import asyncio
import os
import structlog
from .supabase_client import supa

log = structlog.get_logger()


async def discover_jobs_for_candidate(candidate_id: str) -> list[dict]:
    """
    Pulls candidate preferences, runs JobSpy, returns raw job dicts.
    Returns [] on any error so the caller can continue with other candidates.
    """
    res = supa().table("candidates").select("profile_json, preferences").eq("id", candidate_id).maybeSingle().execute()
    if not res.data:
        log.warning("discover_no_candidate", candidate=candidate_id)
        return []

    profile: dict = res.data.get("profile_json") or {}
    prefs: dict   = res.data.get("preferences") or {}

    target_roles: list[str] = prefs.get("target_roles") or [profile.get("job_title", "Software Engineer")]
    target_locations: list[str] = prefs.get("target_locations") or ["United States"]
    work_arr: str = prefs.get("work_arrangement", "flexible")
    is_remote = work_arr in ("remote", "flexible")

    all_jobs: list[dict] = []

    # ── JobSpy ────────────────────────────────────────────────────────────
    try:
        from jobspy import scrape_jobs  # type: ignore

        for role in target_roles[:3]:
            for loc in (target_locations if not is_remote else ["United States"])[:2]:
                try:
                    df = await asyncio.to_thread(
                        scrape_jobs,
                        site_name=["indeed", "google"],
                        search_term=role,
                        location=loc,
                        is_remote=is_remote,
                        results_wanted=25,
                        hours_old=72,
                    )
                    for _, row in df.iterrows():
                        all_jobs.append(_row_to_dict(row))
                except Exception as exc:
                    log.warning("jobspy_role_error", role=role, loc=loc, error=str(exc)[:120])

    except ImportError:
        log.warning("jobspy_not_installed", hint="pip install python-jobspy")
    except Exception as exc:
        log.error("jobspy_fatal", error=str(exc)[:200])

    # ── SerpApi (optional) ────────────────────────────────────────────────
    serpapi_key = os.environ.get("SERPAPI_KEY")
    if serpapi_key and not all_jobs:
        try:
            all_jobs.extend(await _serpapi_jobs(serpapi_key, target_roles, target_locations, is_remote))
        except Exception as exc:
            log.warning("serpapi_error", error=str(exc)[:120])

    log.info("discovery_raw_jobs", candidate=candidate_id, count=len(all_jobs))
    return all_jobs


def _row_to_dict(row) -> dict:  # type: ignore[override]
    return {
        "title": str(row.get("title") or ""),
        "company": str(row.get("company") or ""),
        "location": str(row.get("location") or ""),
        "is_remote": bool(row.get("is_remote", False)),
        "salary_min": _safe_int(row.get("min_amount")),
        "salary_max": _safe_int(row.get("max_amount")),
        "description_text": str(row.get("description") or "")[:5000],
        "source_url": str(row.get("job_url") or ""),
        "source": str(row.get("site") or "").lower(),
        "posted_at": str(row.get("date_posted") or ""),
    }


def _safe_int(val) -> int | None:
    try:
        return int(val) if val and float(val) > 0 else None
    except (TypeError, ValueError):
        return None


async def _serpapi_jobs(key: str, roles: list[str], locations: list[str], is_remote: bool) -> list[dict]:
    import httpx
    jobs = []
    async with httpx.AsyncClient(timeout=20) as client:
        for role in roles[:2]:
            loc = "remote" if is_remote else (locations[0] if locations else "United States")
            resp = await client.get(
                "https://serpapi.com/search",
                params={"engine": "google_jobs", "q": role, "location": loc, "api_key": key},
            )
            data = resp.json()
            for j in data.get("jobs_results", [])[:15]:
                jobs.append({
                    "title": j.get("title", ""),
                    "company": j.get("company_name", ""),
                    "location": j.get("location", ""),
                    "is_remote": is_remote,
                    "salary_min": None, "salary_max": None,
                    "description_text": j.get("description", "")[:5000],
                    "source_url": (j.get("related_links") or [{}])[0].get("link", ""),
                    "source": "google_jobs",
                    "posted_at": "",
                })
    return jobs
