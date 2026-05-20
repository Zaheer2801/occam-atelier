"""
Semantic job-fit scorer using the free AI cascade (provider_router).
Returns a score in [0.0, 1.0] and a brief reason string.
"""
from __future__ import annotations

import json
import re
import structlog
from .provider_router import route

log = structlog.get_logger()

_JSON_RE = re.compile(r'\{[^{}]+\}')


async def score_job(
    profile: dict,
    prefs: dict,
    job: dict,
) -> tuple[float, str]:
    """
    Returns (score, reason).  Score is clamped to [0.0, 1.0].
    Falls back to 0.5 on any parsing failure.
    """
    skills: list[str] = profile.get("skills") or []
    exp_years: int    = profile.get("total_years_experience") or 0
    target_roles      = prefs.get("target_roles") or []
    target_title      = target_roles[0] if target_roles else profile.get("job_title", "")

    salary_floor      = prefs.get("salary_floor_usd") or 0
    work_arr          = prefs.get("work_arrangement", "flexible")
    job_min_sal       = job.get("salary_min") or 0
    job_is_remote     = job.get("is_remote", False)

    desc_snippet = (job.get("description_text") or "")[:800]

    prompt = f"""Candidate: {exp_years} years experience, targeting "{target_title}", skills: {", ".join(skills[:15])}.
Salary floor: ${salary_floor:,}. Prefers: {work_arr}.

Job: "{job.get("title")}" at {job.get("company")} — {job.get("location")}.
Remote: {job_is_remote}. Salary: ${job_min_sal:,}+.
Description: {desc_snippet}

Return ONLY valid JSON (no markdown, no extra text):
{{"score": 0.85, "reason": "brief 1-sentence reason"}}

Scoring guide: 1.0=perfect fit, 0.9+=excellent, 0.7-0.9=good, 0.5-0.7=partial, <0.5=poor.
Penalise if salary below candidate floor or work arrangement incompatible."""

    try:
        text, provider = await route(prompt, "You are a precise job-fit scorer. Return ONLY JSON.", "fit_score")
        m = _JSON_RE.search(text)
        if m:
            data = json.loads(m.group())
            score = float(data.get("score", 0.5))
            reason = str(data.get("reason", ""))[:200]
            score = max(0.0, min(1.0, score))
            log.debug("fit_scored", job=job.get("title"), score=score, provider=provider)
            return score, reason
    except Exception as exc:
        log.warning("fit_score_parse_error", error=str(exc)[:80])

    return 0.5, "Score unavailable"
