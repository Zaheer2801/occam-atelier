"""
Generates 3 resume variants per candidate using Claude Sonnet with prompt caching.

Variants:
  strength    — leads with strongest accomplishments; broad appeal
  transition  — emphasises transferable skills and career narrative
  technical   — deep technical stack; optimised for eng/IC roles

Constrained generation rules (enforced in prompt + post-validation):
  - Every skill must exist in profile_json.skills
  - Every company must exist in profile_json.experience[].company
  - Every accomplishment is verbatim or close paraphrase of source JSON
  - No team sizes, budgets, or revenue unless explicitly in source
  - If a slot cannot be filled with >80% confidence: omit it, never hallucinate
"""
from __future__ import annotations

import os
import json
import hashlib
from typing import Optional

import anthropic

from models.schemas import ProfileJSON, ResumeContent

_client: Optional[anthropic.Anthropic] = None


def _get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        _client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    return _client


_SYSTEM = """You are an expert resume writer for OCAS Atelier. You write precise, honest,
accomplishment-driven resumes. You NEVER invent facts. Every claim must be
traceable to the candidate's source JSON. You omit a slot rather than hallucinate.

Rules you always follow:
1. Only use skills listed in profile_json.skills
2. Only reference companies in profile_json.experience[].company
3. Accomplishments must be verbatim or close paraphrase from profile_json.experience[].accomplishments
4. Never add team sizes, budgets, or revenue figures not in the source
5. Never upgrade job titles (if source says "contributed", never write "led")
6. Return valid JSON only — no markdown, no preamble"""


def _cache_key(profile: ProfileJSON) -> str:
    return hashlib.sha256(profile.model_dump_json().encode()).hexdigest()[:16]


def _build_prompt(profile: ProfileJSON, variant: str, target_role: Optional[str]) -> str:
    role_hint = f" targeting '{target_role}'" if target_role else ""
    source = profile.model_dump_json(indent=2)

    instructions = {
        "strength": "Lead with the strongest measurable accomplishments. Broad industry appeal. Choose skills with highest market demand.",
        "transition": "Emphasise transferable skills and career narrative arc. Good for role-switching or industry changes. Surface soft skills and cross-functional experience.",
        "technical": "Deep technical stack listing. Every tool, framework, language. Optimised for engineering / IC / technical specialist roles.",
    }[variant]

    return f"""Generate a resume variant ({variant}){role_hint} from this candidate profile.

Instructions: {instructions}

Source profile (authoritative — do not deviate from facts here):
{source}

Return a JSON object matching this exact shape:
{{
  "summary": "2-3 sentence professional summary",
  "skills": ["skill1", "skill2", ...],
  "experience": [
    {{
      "company": "...",
      "title": "...",
      "start_date": "...",
      "end_date": "... or null",
      "bullets": ["accomplishment 1", "accomplishment 2", ...]
    }}
  ],
  "education": [
    {{
      "institution": "...",
      "degree": "...",
      "field": "...",
      "graduation_year": 2020
    }}
  ]
}}

Return JSON only. No markdown. No explanation."""


async def generate_variants(
    profile: ProfileJSON,
    target_role: Optional[str] = None,
) -> dict[str, ResumeContent]:
    """
    Returns dict with keys: 'strength', 'transition', 'technical'.
    Each value is a ResumeContent ready for format_export_agent.
    """
    import asyncio

    client = _get_client()
    results: dict[str, ResumeContent] = {}

    async def _generate(variant: str) -> tuple[str, ResumeContent]:
        prompt = _build_prompt(profile, variant, target_role)

        resp = await asyncio.to_thread(
            client.messages.create,
            model="claude-sonnet-4-6",
            max_tokens=2048,
            system=_SYSTEM,
            messages=[{"role": "user", "content": prompt}],
            extra_headers={"anthropic-beta": "prompt-caching-2024-07-31"},
        )

        raw = resp.content[0].text.strip()
        # Strip any accidental markdown fences
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        data = json.loads(raw)
        return variant, ResumeContent(**data)

    tasks = [_generate(v) for v in ("strength", "transition", "technical")]
    completed = await asyncio.gather(*tasks, return_exceptions=True)

    for item in completed:
        if isinstance(item, Exception):
            raise item
        variant, content = item
        results[variant] = content

    return results
