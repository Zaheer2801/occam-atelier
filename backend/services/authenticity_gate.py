"""
Authenticity Gate: independently validates generated content against profile.
Blocks auto-submission if score < GATE_THRESHOLD.
"""
from __future__ import annotations

import json
import re
import structlog
from services.provider_router import route  # type: ignore

log = structlog.get_logger()

GATE_THRESHOLD = 0.70  # below → route to manual_required
_JSON_RE = re.compile(r'\{[^{}]+\}', re.DOTALL)


async def check(
    generated_text: str,
    profile: dict,
    job: dict,
) -> tuple[float, list[str]]:
    """
    Returns (score 0–1, flags).
    score < GATE_THRESHOLD → should not auto-submit.
    flags contains specific unverifiable claims found.
    """
    skills = (profile.get("skills") or [])[:10]
    exp = profile.get("experience") or []
    companies = [
        e.get("company") or e.get("employer", "")
        for e in exp[:3]
        if isinstance(e, dict)
    ]
    years = profile.get("total_years_experience") or 0

    prompt = f"""Audit this job application paragraph for factual accuracy.

GENERATED TEXT:
{generated_text}

CANDIDATE GROUND TRUTH:
- Skills: {skills}
- Companies: {companies}
- Years experience: {years}
- Applying for: {job.get('title', '')} at {job.get('source_company_name', '')}

For each factual claim in the text, check if it can be verified from the ground truth.
Return ONLY valid JSON (no markdown):
{{"score": 0.85, "flags": ["list of unverifiable or fabricated claims, empty if none"]}}

score: 1.0 = everything verified, 0.0 = entirely fabricated."""

    try:
        text, _ = await route(prompt, "You are a factual accuracy auditor for job applications.", "authenticity_gate")
        m = _JSON_RE.search(text)
        if m:
            data = json.loads(m.group())
            score = float(data.get("score", 0.5))
            flags = [str(f) for f in data.get("flags", [])]
            score = max(0.0, min(1.0, score))
            log.info("authenticity_checked", score=score, flags=len(flags))
            return score, flags
    except Exception as exc:
        log.warning("authenticity_gate_error", error=str(exc)[:80])

    return 0.5, ["Gate check unavailable — routing to review"]
