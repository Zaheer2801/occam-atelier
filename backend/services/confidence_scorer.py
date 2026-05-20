"""
Confidence scorer: veto logic + additive scoring (0–100).
Score >= 70  → auto-apply
Score 50–69  → pending_review queue
Score < 50   → skip
Any veto     → hard block (score = 0)
"""
from __future__ import annotations

# ── Veto reasons ──────────────────────────────────────────────────────────────
VETO_VIDEO          = "requires_video"
VETO_PORTFOLIO      = "requires_portfolio"
VETO_WORK_SAMPLE    = "requires_work_sample"
VETO_ASSESSMENT     = "requires_assessment_first"
VETO_COMPLEX_FORM   = "form_too_complex"
VETO_LOW_FIT        = "fit_score_below_threshold"
VETO_DNC            = "company_on_dnc"
VETO_DUPLICATE      = "already_applied"

AUTO_THRESHOLD    = 70.0
REVIEW_THRESHOLD  = 50.0
FIT_FLOOR         = 0.50
MAX_FORM_FIELDS   = 50


def score(
    job: dict,
    candidate: dict,
    already_applied: bool = False,
    on_dnc: bool = False,
) -> tuple[float, dict, str | None]:
    """
    Returns (score 0–100, factors dict, veto_reason | None).
    If veto_reason is set, score is 0 and no application should be submitted.
    """
    # ── Hard vetoes (order matters — cheapest checks first) ───────────────
    if already_applied:
        return 0.0, {}, VETO_DUPLICATE
    if on_dnc:
        return 0.0, {}, VETO_DNC
    if job.get("requires_video"):
        return 0.0, {}, VETO_VIDEO
    if job.get("requires_portfolio"):
        return 0.0, {}, VETO_PORTFOLIO
    if job.get("requires_work_sample"):
        return 0.0, {}, VETO_WORK_SAMPLE
    if job.get("requires_assessment_first"):
        return 0.0, {}, VETO_ASSESSMENT
    if (job.get("form_field_count") or 0) > MAX_FORM_FIELDS:
        return 0.0, {}, VETO_COMPLEX_FORM
    if (job.get("fit_score") or 0.0) < FIT_FLOOR:
        return 0.0, {}, VETO_LOW_FIT

    # ── Additive scoring ───────────────────────────────────────────────────
    prefs: dict = candidate.get("preferences") or {}
    total = 0.0
    factors: dict = {}

    # Fit score: up to 40 pts
    fit_pts = (job.get("fit_score") or 0.0) * 40
    factors["fit_score"] = round(fit_pts, 1)
    total += fit_pts

    # Salary match: +20 pts (pass if no salary data, or if salary_max >= floor)
    floor = prefs.get("salary_floor_usd") or 0
    sal_max = job.get("salary_max") or 0
    sal_min = job.get("salary_min") or 0
    sal_match = (floor == 0) or (sal_max >= floor) or (sal_min == 0 and sal_max == 0)
    factors["salary"] = 20 if sal_match else 0
    total += factors["salary"]

    # Remote / work arrangement: +15 pts
    work_arr = prefs.get("work_arrangement", "flexible")
    is_remote_job = job.get("is_remote", False)
    loc_match = (
        (work_arr in ("remote", "flexible") and is_remote_job)
        or (work_arr in ("onsite", "hybrid") and not is_remote_job)
        or work_arr == "flexible"
    )
    factors["location"] = 15 if loc_match else 0
    total += factors["location"]

    # ATS type confidence: +15 pts (Greenhouse preferred for Week 3)
    ats_type = job.get("ats_type") or ""
    ats_conf = job.get("ats_detected_confidence") or 0.0
    ats_pts = 15 if (ats_type == "greenhouse" and ats_conf >= 0.7) else (8 if ats_type == "greenhouse" else 0)
    factors["ats"] = ats_pts
    total += ats_pts

    # Title match: +10 pts (keyword overlap)
    target_roles: list[str] = prefs.get("target_roles") or []
    job_title = (job.get("title") or "").lower()
    title_match = any(
        r.lower() in job_title or job_title in r.lower()
        for r in target_roles
    )
    factors["title"] = 10 if title_match else 0
    total += factors["title"]

    return min(100.0, total), factors, None
