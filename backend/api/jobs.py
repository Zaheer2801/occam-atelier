from __future__ import annotations

from fastapi import APIRouter, BackgroundTasks, HTTPException, Query
from pydantic import BaseModel
from services.supabase_client import supa
from services.discovery_scheduler import run_discovery

router = APIRouter(prefix="/api/jobs", tags=["jobs"])


class DiscoverRequest(BaseModel):
    candidate_id: str


@router.get("/feed")
async def job_feed(
    candidate_id: str = Query(..., description="Candidate UUID"),
    limit: int = Query(20, ge=1, le=100),
    min_score: float = Query(0.0, ge=0.0, le=1.0),
):
    """
    Return discovered jobs ordered by fit_score DESC.
    Optionally filter by minimum fit score.
    """
    cand = supa().table("candidates").select("id").eq("id", candidate_id).maybeSingle().execute()
    if not cand.data:
        raise HTTPException(status_code=404, detail="Candidate not found")

    query = (
        supa()
        .table("jobs")
        .select("id, title, location, is_remote, salary_min, salary_max, fit_score, "
                "source_url, source, discovered_at, source_company_name, "
                "companies(canonical_name)")
        .eq("is_active", True)
        .order("fit_score", desc=True)
        .limit(limit)
    )
    if min_score > 0:
        query = query.gte("fit_score", min_score)

    res = query.execute()
    jobs = res.data or []

    # Flatten company name for convenience
    for j in jobs:
        co = j.pop("companies", None)
        j["company_name"] = (co or {}).get("canonical_name") or j.get("source_company_name", "")

    return {"jobs": jobs, "total": len(jobs)}


@router.get("/notifications")
async def candidate_notifications(
    candidate_id: str = Query(...),
    limit: int = Query(10, ge=1, le=50),
    unread_only: bool = Query(False),
):
    """Return recent notifications for a candidate."""
    query = (
        supa()
        .table("notifications")
        .select("id, type, priority, title, body, metadata, created_at, read_at")
        .eq("candidate_id", candidate_id)
        .order("created_at", desc=True)
        .limit(limit)
    )
    if unread_only:
        query = query.is_("read_at", "null")

    res = query.execute()
    return {"notifications": res.data or []}


@router.post("/notifications/{notif_id}/read")
async def mark_notification_read(notif_id: str):
    """Mark a notification as read."""
    from datetime import datetime, timezone
    supa().table("notifications").update({"read_at": datetime.now(timezone.utc).isoformat()}).eq("id", notif_id).execute()
    return {"ok": True}


@router.post("/discover/run")
async def trigger_discovery(req: DiscoverRequest, background_tasks: BackgroundTasks):
    """Manually trigger a discovery run for one candidate."""
    cand = supa().table("candidates").select("id").eq("id", req.candidate_id).maybeSingle().execute()
    if not cand.data:
        raise HTTPException(status_code=404, detail="Candidate not found")
    background_tasks.add_task(run_discovery)
    return {"status": "discovery_started", "candidate_id": req.candidate_id}


@router.post("/discover/all")
async def trigger_all_discovery(background_tasks: BackgroundTasks):
    """Trigger discovery for all active candidates (admin use)."""
    background_tasks.add_task(run_discovery)
    return {"status": "discovery_started_for_all"}
