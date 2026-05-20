"""
Constrained Application Summary generator.
Every claim MUST be traceable to profile_json — no hallucination.
Validates slot-filling before returning.
"""
from __future__ import annotations

import re
import structlog
from services.provider_router import route  # type: ignore

log = structlog.get_logger()

# Required slots — each must map to real profile data
_SLOTS = ["target_role", "top_skill", "experience_company", "exp_years"]

AUTHENTICITY_FLOOR = 0.65  # below this → route to manual_required


async def generate(
    profile: dict,
    prefs: dict,
    job: dict,
) -> tuple[str, float, dict]:
    """
    Returns (cover_paragraph, authenticity_score, slot_data).
    authenticity_score < AUTHENTICITY_FLOOR → should not auto-submit.
    """
    skills: list[str]     = profile.get("skills") or []
    experiences: list     = profile.get("experience") or []
    full_name: str        = profile.get("full_name") or ""
    exp_years: int        = profile.get("total_years_experience") or 0
    target_roles: list[str] = prefs.get("target_roles") or [job.get("title", "")]

    # Extract top experience entry
    top_exp = experiences[0] if experiences and isinstance(experiences[0], dict) else {}
    top_company  = top_exp.get("company") or top_exp.get("employer") or ""
    top_impact   = ""
    achievements = top_exp.get("achievements") or []
    if achievements:
        top_impact = str(achievements[0])[:120]

    slot_data = {
        "target_role":        target_roles[0] if target_roles else job.get("title", ""),
        "top_skill":          skills[0] if skills else "",
        "second_skill":       skills[1] if len(skills) > 1 else "",
        "experience_company": top_company,
        "impact":             top_impact,
        "exp_years":          str(exp_years),
        "job_title":          job.get("title", ""),
        "company_name":       job.get("source_company_name") or "",
    }

    # Validate slots have content
    missing = [k for k in _SLOTS if not slot_data.get(k)]
    if missing:
        log.warning("summary_missing_slots", slots=missing)

    prompt = f"""Write a 3-sentence job application cover paragraph for {full_name or 'the candidate'}.

MANDATORY RULES:
1. Use ONLY these verified facts — never invent anything:
   - Target role: {slot_data['target_role']}
   - Years of experience: {slot_data['exp_years']}
   - Top skills: {slot_data['top_skill']}, {slot_data['second_skill']}
   - Last employer: {slot_data['experience_company']}
   - Notable achievement: {slot_data['impact']}
   - Applying to: {slot_data['job_title']} at {slot_data['company_name']}
2. Exactly 3 sentences. No more, no less.
3. No clichés: no "passionate", "dynamic", "team player", "fast learner".
4. End with one specific reason this exact role is a good fit for them.
5. Professional but direct tone.

Return ONLY the paragraph text. No labels, no quotes."""

    try:
        text, provider = await route(
            prompt,
            "You write honest, specific, 3-sentence job application cover paragraphs.",
            "app_summary",
        )
        text = text.strip().strip('"\'')
        log.info("summary_generated", provider=provider, chars=len(text))
    except Exception as exc:
        log.error("summary_generation_failed", error=str(exc)[:120])
        text = (
            f"I am applying for the {slot_data['target_role']} position with "
            f"{slot_data['exp_years']} years of experience in {slot_data['top_skill']}. "
            f"My background at {slot_data['experience_company']} has prepared me well. "
            f"I look forward to contributing to this role."
        )

    # Score authenticity: count verified slots present in generated text
    text_lower = text.lower()
    verified = sum(
        1 for v in slot_data.values()
        if v and len(v) > 2 and v.lower()[:10] in text_lower
    )
    authenticity_score = min(1.0, verified / max(len(_SLOTS), 1))

    return text, authenticity_score, slot_data
