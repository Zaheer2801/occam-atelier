"""
Upload Playwright screenshot bytes to Supabase Storage.
Returns the public URL, or empty string on failure.
"""
from __future__ import annotations

import uuid
import structlog
from services.supabase_client import supa  # type: ignore

log = structlog.get_logger()

BUCKET = "screenshots"


async def upload(
    screenshot_bytes: bytes,
    candidate_id: str,
    job_id: str,
) -> str:
    """Upload PNG screenshot and return its public URL."""
    filename = f"{candidate_id}/{job_id}/{uuid.uuid4().hex}.png"
    try:
        supa().storage.from_(BUCKET).upload(
            path=filename,
            file=screenshot_bytes,
            file_options={"content-type": "image/png"},
        )
        url: str = supa().storage.from_(BUCKET).get_public_url(filename)
        log.info("screenshot_uploaded", url=url[:80])
        return url
    except Exception as exc:
        log.error("screenshot_upload_failed", error=str(exc)[:120])
        return ""


def ensure_bucket() -> None:
    """Create the screenshots bucket if it doesn't already exist."""
    try:
        supa().storage.create_bucket(BUCKET, options={"public": True})
        log.info("storage_bucket_created", bucket=BUCKET)
    except Exception:
        pass  # bucket already exists
