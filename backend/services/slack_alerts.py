"""Slack webhook alerts for critical failures and high-priority events."""
from __future__ import annotations

import os
import httpx
import structlog

log = structlog.get_logger()


async def alert(message: str, level: str = "error") -> None:
    """
    Post message to Slack webhook. Fails silently if SLACK_WEBHOOK_URL not set.
    level: 'error' | 'warn' | 'info'
    """
    webhook = os.environ.get("SLACK_WEBHOOK_URL")
    if not webhook:
        log.debug("slack_no_webhook_configured", message=message[:80])
        return

    icon = {"error": "🔴", "warn": "🟡", "info": "🟢"}.get(level, "🔴")
    payload = {"text": f"{icon} *OCAS Atelier* | {message}"}

    try:
        async with httpx.AsyncClient(timeout=5) as client:
            resp = await client.post(webhook, json=payload)
            if resp.status_code != 200:
                log.warning("slack_alert_non_200", status=resp.status_code)
    except Exception as exc:
        log.warning("slack_alert_failed", error=str(exc)[:80])
