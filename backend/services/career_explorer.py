"""
Career exploration service — onboarding steps 2, 3, 4.

Lightcast not available at launch. Uses:
  Step 2 (career paths):   free AI cascade → BLS SOC code mapping
  Step 3 (skills gap):     free AI cascade → gap analysis vs target role
  Step 4 (market reality): free AI cascade → demand synthesis from BLS + levels.fyi context

All calls go through provider_router.route() — never call AI providers directly.
"""
from __future__ import annotations

import json
from typing import Optional

from services.provider_router import route


# ── Step 2: Career Paths ────────────────────────────────────────────────────

CAREER_PATHS_SYSTEM = """You are a labor market analyst for OCAS Atelier. Map candidate skills
to realistic career paths using BLS occupational data. Be honest about market conditions.
Return valid JSON only — no markdown, no preamble."""


async def get_career_paths(
    skills: list[str],
    experience_years: float,
    exploration_answers: dict,  # answers to the 3 career exploration questions
    target_location: Optional[str] = None,
) -> list[dict]:
    """
    Returns list of 3-5 career path dicts, each with:
      title, bls_soc_code, demand_score (0-100), median_salary_usd,
      skill_overlap_pct, missing_skills (top 3), demand_trend
    """
    prompt = f"""Given this candidate profile, identify 3-5 realistic career paths.

Skills: {json.dumps(skills)}
Years of experience: {experience_years}
Location preference: {target_location or 'US (flexible)'}

Career exploration answers:
- Problems they enjoy solving: {exploration_answers.get('problems', 'not specified')}
- Energising aspects of past work: {exploration_answers.get('energising', 'not specified')}
- Industries of interest: {exploration_answers.get('industries', 'not specified')}

Using BLS occupational data and current US job market knowledge, return a JSON array of career paths:
[
  {{
    "title": "Software Engineer",
    "bls_soc_code": "15-1252",
    "demand_score": 82,
    "median_salary_usd": 120000,
    "salary_range_low": 90000,
    "salary_range_high": 160000,
    "skill_overlap_pct": 75,
    "missing_skills": ["Kubernetes", "Terraform", "Go"],
    "demand_trend": "growing",
    "rationale": "1-2 sentences explaining fit"
  }}
]

demand_trend must be one of: "growing" | "stable" | "declining"
demand_score is 0-100 based on BLS employment projections.
Return JSON array only."""

    text, _ = await route(prompt, CAREER_PATHS_SYSTEM, task_type="career_paths")
    raw = text.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw)


# ── Step 3: Skills Gap ──────────────────────────────────────────────────────

SKILLS_GAP_SYSTEM = """You are a skills analyst for OCAS Atelier. Compare candidate skills
against target role requirements. Be honest — do not sugarcoat gaps.
Return valid JSON only."""


async def get_skills_gap(
    candidate_skills: list[str],
    target_role: str,
    target_location: Optional[str] = None,
) -> dict:
    """
    Returns dict with four categories + gap closure plan.
    """
    prompt = f"""Analyse the skills gap for this candidate targeting the role of '{target_role}' in {target_location or 'the US'}.

Candidate's current skills: {json.dumps(candidate_skills)}

Return a JSON object:
{{
  "strong_match": ["skill1", "skill2"],
  "declining_demand": ["skill3"],
  "missing_critical": ["skill4", "skill5", "skill6"],
  "differentiators": ["skill7"],
  "gap_closure_plan": [
    {{
      "skill": "Kubernetes",
      "priority": "high",
      "resource": "Certified Kubernetes Administrator (CNCF) — ~$395, 3 months",
      "free_alternative": "Kubernetes the Hard Way (GitHub, free)"
    }}
  ]
}}

Be realistic. missing_critical should include skills that appear in >60% of {target_role} job postings.
Return JSON only."""

    text, _ = await route(prompt, SKILLS_GAP_SYSTEM, task_type="skills_gap")
    raw = text.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw)


# ── Step 4: Market Reality ──────────────────────────────────────────────────

MARKET_REALITY_SYSTEM = """You are a labor market analyst for OCAS Atelier. Provide honest,
data-grounded market reality using BLS, levels.fyi, and Glassdoor data patterns.
Never soften bad news. Surface it clearly. Return valid JSON only."""


async def get_market_reality(
    target_role: str,
    target_location: Optional[str] = None,
) -> dict:
    """
    Returns market reality dict. Uses BLS + levels.fyi context as knowledge base.
    """
    prompt = f"""Provide a market reality report for '{target_role}' in {target_location or 'the US (major metros)'}.

Using BLS occupational employment statistics, levels.fyi salary data, and current hiring patterns, return:
{{
  "open_roles_estimate": 12500,
  "median_salary_usd": 115000,
  "salary_range_low": 80000,
  "salary_range_high": 165000,
  "top_hiring_companies": ["Google", "Meta", "Stripe", "Shopify", "Databricks"],
  "demand_trend": "growing",
  "demand_trend_12mo_pct": 8.5,
  "competitive_density": "high",
  "avg_applicants_per_role": 180,
  "time_to_hire_days": 35,
  "market_assessment": "honest 2-3 sentence summary — if market is soft, say so clearly",
  "honest_warning": null
}}

honest_warning: if the market has serious headwinds (layoffs, saturation, AI displacement),
set this to a direct 1-2 sentence statement. Otherwise null.
competitive_density: "low" | "medium" | "high" | "extreme"
Return JSON only."""

    text, _ = await route(prompt, MARKET_REALITY_SYSTEM, task_type="market_reality")
    raw = text.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw)
