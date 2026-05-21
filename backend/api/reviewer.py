"""
Reviewer queue management.
Employees/managers use this to process pending_review and manual_required items.
Handle time is tracked from first open to resolve.
"""
from __future__ import annotations

import os
from datetime import datetime, timezone

from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel

from services.supabase_client import supa
from services.slack_alerts import alert
import structlog

log = structlog.get_logger()
router = APIRouter(prefix="/api/reviewer", tags=["reviewer"])

CAPACITY_THRESHOLD = int(os.environ.get("QUEUE_CAPACITY_THRESHOLD", "50"))
_NOW = lambda: datetime.now(timezone.utc).isoformat()


# ── Models ─────────────────────────────────────────────────────────────────────

class ApproveBody(BaseModel):
    reviewer_id: str

class SkipBody(BaseModel):
    reviewer_id: str
    reason: str | None = None

class UpdateCoverBody(BaseModel):
    cover_text: str
    reviewer_id: str

class CompleteBody(BaseModel):
    reviewer_id: str
    notes: str | None = None


# ── Queue listing ──────────────────────────────────────────────────────────────

@router.get("/queue")
async def list_queue(
    queue_type: str = "pending_review",
    limit: int = 50,
    reviewer_id: str | None = None,
):
    """
    Return reviewer queue items with candidate + job details.
    Optionally filter to items assigned to a specific reviewer.
    """
    query = (
        supa()
        .table("reviewer_queue")
        .select(
            "id, queue_type, payload, created_at, started_at, resolved_at, assigned_to, "
            "candidate_id, job_id, application_id, "
            "jobs(title, source_company_name, fit_score, source_url, ats_type), "
            "candidates(profile_json, preferences)"
        )
        .eq("queue_type", queue_type)
        .is_("resolved_at", "null")
        .order("created_at", desc=False)  # oldest first
        .limit(limit)
    )
    if reviewer_id:
        query = query.eq("assigned_to", reviewer_id)

    res = query.execute()
    items = res.data or []

    # Flatten for frontend convenience
    for item in items:
        cand = item.pop("candidates", None) or {}
        job  = item.pop("jobs", None) or {}
        profile = cand.get("profile_json") or {}
        item["candidate_name"] = profile.get("full_name", "—")
        item["job_title"]      = job.get("title", "—")
        item["company"]        = job.get("source_company_name", "—")
        item["fit_score"]      = job.get("fit_score")
        item["job_url"]        = job.get("source_url", "")
        item["ats_type"]       = job.get("ats_type", "")
        item["cover_text"]     = (item.get("payload") or {}).get("cover_text", "")
        item["auth_score"]     = (item.get("payload") or {}).get("auth_score")
        item["confidence"]     = (item.get("payload") or {}).get("confidence")
        minutes_waiting = 0
        try:
            created = datetime.fromisoformat(item["created_at"].replace("Z", "+00:00"))
            minutes_waiting = int((datetime.now(timezone.utc) - created).total_seconds() / 60)
        except Exception:
            pass
        item["minutes_waiting"] = minutes_waiting

    return {"items": items, "count": len(items)}


@router.get("/stats")
async def queue_stats():
    """Return queue counts per type. Fires capacity alert if over threshold."""
    types = ["pending_review", "manual_required", "failed"]
    counts: dict[str, int] = {}
    total = 0
    for qt in types:
        res = supa().table("reviewer_queue").select("id", count="exact", head=True) \
                    .eq("queue_type", qt).is_("resolved_at", "null").execute()
        counts[qt] = res.count or 0
        total += counts[qt]

    if total >= CAPACITY_THRESHOLD:
        await alert(
            f"⚠️ Reviewer queue at capacity: {total} items pending "
            f"(threshold: {CAPACITY_THRESHOLD}). Assign more reviewers.",
            level="warn",
        )

    return {"counts": counts, "total": total, "capacity_threshold": CAPACITY_THRESHOLD}


# ── Item lifecycle ─────────────────────────────────────────────────────────────

@router.post("/start/{item_id}")
async def start_item(item_id: str, body: ApproveBody):
    """
    Mark item as started (sets started_at, assigns reviewer).
    Begins handle time tracking.
    """
    _get_item(item_id)
    supa().table("reviewer_queue").update({
        "started_at":  _NOW(),
        "assigned_to": body.reviewer_id,
    }).eq("id", item_id).execute()
    return {"status": "started"}


@router.post("/approve/{item_id}")
async def approve_item(item_id: str, body: ApproveBody, bg: BackgroundTasks):
    """
    Approve a pending_review item.
    Triggers actual Greenhouse apply in background.
    """
    item = _get_item(item_id)
    candidate_id = item["candidate_id"]
    job_id       = item["job_id"]
    app_id       = item["application_id"]

    # Resolve handle time
    handle_secs = _handle_time(item)

    supa().table("reviewer_queue").update({
        "resolved_at":          _NOW(),
        "assigned_to":          body.reviewer_id,
        "handle_time_seconds":  handle_secs,
    }).eq("id", item_id).execute()

    # Update application to approved-for-submit
    if app_id:
        supa().table("applications").update({
            "status":     "pending_review",  # will flip to auto_applied after bot runs
            "applied_by": "bot_approved_by_human",
        }).eq("id", app_id).execute()

    # Re-trigger apply for just this candidate (will pick up the approved job)
    if candidate_id:
        from api.apply import _run_for_candidate  # type: ignore
        bg.add_task(_run_for_candidate, candidate_id, False)

    log.info("queue_item_approved", item=item_id, reviewer=body.reviewer_id)
    return {"status": "approved", "handle_seconds": handle_secs}


@router.post("/skip/{item_id}")
async def skip_item(item_id: str, body: SkipBody):
    """Skip / reject a queue item without applying."""
    item = _get_item(item_id)
    handle_secs = _handle_time(item)

    supa().table("reviewer_queue").update({
        "resolved_at":         _NOW(),
        "assigned_to":         body.reviewer_id,
        "handle_time_seconds": handle_secs,
        "payload": {**(item.get("payload") or {}), "skip_reason": body.reason},
    }).eq("id", item_id).execute()

    if item.get("application_id"):
        supa().table("applications").update({"status": "skipped"}).eq("id", item["application_id"]).execute()

    log.info("queue_item_skipped", item=item_id, reason=body.reason)
    return {"status": "skipped", "handle_seconds": handle_secs}


@router.put("/cover/{item_id}")
async def update_cover(item_id: str, body: UpdateCoverBody):
    """Update the generated cover text on a pending_review item."""
    item = _get_item(item_id)
    payload = {**(item.get("payload") or {}), "cover_text": body.cover_text, "cover_edited_by": body.reviewer_id}
    supa().table("reviewer_queue").update({
        "payload":     payload,
        "started_at":  item.get("started_at") or _NOW(),
        "assigned_to": body.reviewer_id,
    }).eq("id", item_id).execute()
    return {"status": "cover_updated"}


@router.post("/complete/{item_id}")
async def complete_manual(item_id: str, body: CompleteBody):
    """Mark a manual_required item as manually completed."""
    item = _get_item(item_id)
    handle_secs = _handle_time(item)

    supa().table("reviewer_queue").update({
        "resolved_at":         _NOW(),
        "assigned_to":         body.reviewer_id,
        "handle_time_seconds": handle_secs,
        "payload": {**(item.get("payload") or {}), "completion_notes": body.notes},
    }).eq("id", item_id).execute()

    if item.get("application_id"):
        supa().table("applications").update({
            "status":     "auto_applied",
            "applied_by": "human",
            "applied_at": _NOW(),
        }).eq("id", item["application_id"]).execute()

    log.info("manual_item_completed", item=item_id, reviewer=body.reviewer_id)
    return {"status": "completed", "handle_seconds": handle_secs}


# ── Helpers ────────────────────────────────────────────────────────────────────

def _get_item(item_id: str) -> dict:
    res = supa().table("reviewer_queue").select("*").eq("id", item_id).maybeSingle().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Queue item not found")
    return res.data


def _handle_time(item: dict) -> int:
    """Seconds between started_at (or created_at) and now."""
    try:
        start_str = item.get("started_at") or item.get("created_at")
        start = datetime.fromisoformat(start_str.replace("Z", "+00:00"))
        return int((datetime.now(timezone.utc) - start).total_seconds())
    except Exception:
        return 0
