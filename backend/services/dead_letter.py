"""
Dead-letter queue backed by the reviewer_queue table (queue_type='failed').
Failed applications land here; Slack is alerted immediately.
"""
from __future__ import annotations

import structlog
from datetime import datetime, timezone

from services.supabase_client import supa   # type: ignore
from services.slack_alerts import alert     # type: ignore

log = structlog.get_logger()


async def enqueue(
    candidate_id: str,
    job_id: str | None,
    application_id: str | None,
    error: str,
    context: dict | None = None,
) -> None:
    """
    Insert a failed-apply record into reviewer_queue and fire a Slack alert.
    Never raises — dead-letter failures must not crash the caller.
    """
    payload = {
        "error": error[:500],
        "context": context or {},
        "failed_at": datetime.now(timezone.utc).isoformat(),
    }
    try:
        supa().table("reviewer_queue").insert({
            "candidate_id": candidate_id,
            "job_id":       job_id,
            "application_id": application_id,
            "queue_type":   "failed",
            "payload":      payload,
        }).execute()
        log.error("dlq_enqueued", candidate=candidate_id, job=job_id, error=error[:80])
    except Exception as db_exc:
        log.error("dlq_insert_failed", db_error=str(db_exc)[:80], original_error=error[:80])

    await alert(
        f"Auto-apply failure\n"
        f"Candidate: `{candidate_id}`\n"
        f"Job: `{job_id}`\n"
        f"Error: {error[:200]}",
        level="error",
    )
