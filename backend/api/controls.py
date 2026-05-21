"""
Candidate safety controls: pause, emergency stop, withdraw, DNC, hired.
All mutating operations are logged to audit_log.
"""
from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.supabase_client import supa
from services.slack_alerts import alert
import structlog

log = structlog.get_logger()
router = APIRouter(prefix="/api/controls", tags=["controls"])

_NOW = lambda: datetime.now(timezone.utc).isoformat()


# ── Request models ─────────────────────────────────────────────────────────────

class CandidateBody(BaseModel):
    candidate_id: str

class WithdrawBody(BaseModel):
    candidate_id: str
    application_id: str

class DNCBody(BaseModel):
    candidate_id: str
    company_name: str

class HiredBody(BaseModel):
    candidate_id: str
    hired_company: str | None = None


# ── Helpers ────────────────────────────────────────────────────────────────────

def _get_candidate(candidate_id: str) -> dict:
    res = supa().table("candidates").select("id, is_paused, hired_at").eq("id", candidate_id).maybeSingle().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return res.data


def _audit(candidate_id: str, action: str, meta: dict | None = None) -> None:
    try:
        supa().table("audit_log").insert({
            "actor_id":   candidate_id,
            "action":     action,
            "entity_type": "candidate",
            "entity_id":   candidate_id,
            "metadata":    meta or {},
        }).execute()
    except Exception as exc:
        log.warning("audit_insert_failed", error=str(exc)[:80])


# ── Status ─────────────────────────────────────────────────────────────────────

@router.get("/status/{candidate_id}")
async def get_status(candidate_id: str):
    """Return pause/hired/DNC status for a candidate."""
    c = _get_candidate(candidate_id)
    dnc_res = supa().table("dnc_list").select("id, company_id, companies(canonical_name)") \
                    .eq("candidate_id", candidate_id).execute()
    return {
        "is_paused": c.get("is_paused", False),
        "is_hired": bool(c.get("hired_at")),
        "dnc_list": dnc_res.data or [],
    }


# ── Pause / Unpause ────────────────────────────────────────────────────────────

@router.post("/pause")
async def pause(body: CandidateBody):
    """Pause all auto-apply activity for this candidate."""
    _get_candidate(body.candidate_id)
    supa().table("candidates").update({"is_paused": True, "paused_at": _NOW()}).eq("id", body.candidate_id).execute()
    _audit(body.candidate_id, "candidate_paused")
    log.info("candidate_paused", candidate=body.candidate_id)
    return {"status": "paused"}


@router.post("/unpause")
async def unpause(body: CandidateBody):
    """Resume auto-apply activity for this candidate."""
    _get_candidate(body.candidate_id)
    supa().table("candidates").update({"is_paused": False, "paused_at": None}).eq("id", body.candidate_id).execute()
    _audit(body.candidate_id, "candidate_unpaused")
    log.info("candidate_unpaused", candidate=body.candidate_id)
    return {"status": "active"}


@router.post("/emergency-stop")
async def emergency_stop(body: CandidateBody):
    """
    Emergency stop: pauses candidate AND alerts Slack.
    Use when something unexpected is happening with submissions.
    """
    _get_candidate(body.candidate_id)
    supa().table("candidates").update({
        "is_paused": True,
        "paused_at": _NOW(),
        "emergency_stopped_at": _NOW(),
    }).eq("id", body.candidate_id).execute()
    _audit(body.candidate_id, "emergency_stop")
    await alert(f"🚨 Emergency stop triggered for candidate `{body.candidate_id}`", level="error")
    log.warning("emergency_stop", candidate=body.candidate_id)
    return {"status": "emergency_stopped"}


# ── Withdraw ───────────────────────────────────────────────────────────────────

@router.post("/withdraw")
async def withdraw(body: WithdrawBody):
    """Mark a specific application as withdrawn."""
    _get_candidate(body.candidate_id)
    res = supa().table("applications").select("id, status") \
                .eq("id", body.application_id) \
                .eq("candidate_id", body.candidate_id) \
                .maybeSingle().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Application not found")
    if res.data["status"] == "withdrawn":
        return {"status": "already_withdrawn"}

    supa().table("applications").update({
        "status": "withdrawn",
        "outcome_status": "withdrawn",
        "outcome_at": _NOW(),
    }).eq("id", body.application_id).execute()
    _audit(body.candidate_id, "application_withdrawn", {"application_id": body.application_id})
    return {"status": "withdrawn"}


# ── DNC ────────────────────────────────────────────────────────────────────────

@router.post("/dnc")
async def add_dnc(body: DNCBody):
    """Add a company to the candidate's Do-Not-Contact list."""
    _get_candidate(body.candidate_id)
    # Resolve or create company
    from services.company_normalizer import resolve_company  # type: ignore
    company_id = await resolve_company(body.company_name)

    # Check not already on DNC
    existing = supa().table("dnc_list").select("id") \
                     .eq("candidate_id", body.candidate_id) \
                     .eq("company_id", company_id).maybeSingle().execute()
    if existing.data:
        return {"status": "already_on_dnc", "company_id": company_id}

    supa().table("dnc_list").insert({
        "candidate_id": body.candidate_id,
        "company_id":   company_id,
        "reason":       "candidate_request",
    }).execute()
    _audit(body.candidate_id, "dnc_added", {"company": body.company_name})
    return {"status": "added", "company_id": company_id}


@router.get("/dnc/{candidate_id}")
async def list_dnc(candidate_id: str):
    """Return all DNC entries for a candidate."""
    _get_candidate(candidate_id)
    res = supa().table("dnc_list").select("id, company_id, reason, created_at, companies(canonical_name)") \
                .eq("candidate_id", candidate_id).execute()
    return {"dnc_list": res.data or []}


@router.delete("/dnc")
async def remove_dnc(candidate_id: str, company_id: str):
    """Remove a company from the candidate's DNC list."""
    _get_candidate(candidate_id)
    supa().table("dnc_list").delete().eq("candidate_id", candidate_id).eq("company_id", company_id).execute()
    _audit(candidate_id, "dnc_removed", {"company_id": company_id})
    return {"status": "removed"}


# ── Hired ──────────────────────────────────────────────────────────────────────

@router.post("/hired")
async def mark_hired(body: HiredBody):
    """
    Candidate is hired. Stops all activity and marks open applications withdrawn.
    """
    _get_candidate(body.candidate_id)
    now = _NOW()
    supa().table("candidates").update({
        "is_paused":     True,
        "paused_at":     now,
        "hired_at":      now,
        "hired_company": body.hired_company,
    }).eq("id", body.candidate_id).execute()

    # Withdraw all non-terminal applications
    supa().table("applications").update({
        "status":         "withdrawn",
        "outcome_status": "candidate_hired",
        "outcome_at":      now,
    }).eq("candidate_id", body.candidate_id) \
      .in_("status", ["auto_applied", "pending_review", "manual_required"]).execute()

    # Congratulations notification
    try:
        supa().table("notifications").insert({
            "candidate_id": body.candidate_id,
            "type":         "hired",
            "priority":     "high",
            "title":        "Congratulations — you got the job! 🎉",
            "body":         f"All active applications have been withdrawn. Best of luck at {body.hired_company or 'your new role'}!",
        }).execute()
    except Exception:
        pass

    _audit(body.candidate_id, "candidate_hired", {"company": body.hired_company})
    await alert(f"🎉 Candidate `{body.candidate_id}` marked as hired at `{body.hired_company}`", level="info")
    return {"status": "hired"}
