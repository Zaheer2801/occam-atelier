"""
Onboarding API — Week 1

POST /api/onboarding/geo-check          check if request IP is US-based
POST /api/onboarding/career-paths       step 2 — generate career path options
POST /api/onboarding/skills-gap         step 3 — skills gap analysis
POST /api/onboarding/market-reality     step 4 — market demand reality check
POST /api/onboarding/generate-variants  step 1b — generate 3 resume variants
POST /api/onboarding/complete           step 6 — save attestation, mark complete
"""
from __future__ import annotations

import os
import json
import uuid
from typing import Optional

import httpx
from fastapi import APIRouter, Request, HTTPException, Form, File, UploadFile
from pydantic import BaseModel

from models.schemas import ProfileJSON
from services.career_explorer import get_career_paths, get_skills_gap, get_market_reality
from services.variant_generator import generate_variants
from services.format_export_agent import export_all

router = APIRouter(prefix="/api/onboarding", tags=["onboarding"])

EU_EEA_UK_CODES = {
    "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE",
    "IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE",
    "IS","LI","NO","CH","GB","UK",
}


# ── Geo check ───────────────────────────────────────────────────────────────

@router.post("/geo-check")
async def geo_check(request: Request):
    ip = request.headers.get("x-forwarded-for", request.client.host).split(",")[0].strip()
    # Localhost / private IPs pass through (dev)
    if ip in ("127.0.0.1", "::1") or ip.startswith("192.168.") or ip.startswith("10."):
        return {"allowed": True, "country": "US", "ip": ip}

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(f"http://ip-api.com/json/{ip}?fields=status,country,countryCode")
            data = resp.json()
    except Exception:
        # If geo check fails, allow through — don't block on infra failure
        return {"allowed": True, "country": "unknown", "ip": ip}

    country_code = data.get("countryCode", "")
    if country_code in EU_EEA_UK_CODES:
        return {
            "allowed": False,
            "country": data.get("country", ""),
            "country_code": country_code,
            "message": "OCAS Atelier is currently US-only. Join our EU waitlist.",
        }
    return {"allowed": True, "country": data.get("country", ""), "country_code": country_code, "ip": ip}


# ── Step 2: Career paths ─────────────────────────────────────────────────────

class CareerPathsRequest(BaseModel):
    skills: list[str]
    experience_years: float = 0.0
    problems: str = ""
    energising: str = ""
    industries: str = ""
    target_location: Optional[str] = None


@router.post("/career-paths")
async def career_paths(body: CareerPathsRequest):
    try:
        paths = await get_career_paths(
            skills=body.skills,
            experience_years=body.experience_years,
            exploration_answers={
                "problems": body.problems,
                "energising": body.energising,
                "industries": body.industries,
            },
            target_location=body.target_location,
        )
        return {"paths": paths}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Career path generation failed: {exc}")


# ── Step 3: Skills gap ───────────────────────────────────────────────────────

class SkillsGapRequest(BaseModel):
    candidate_skills: list[str]
    target_role: str
    target_location: Optional[str] = None


@router.post("/skills-gap")
async def skills_gap(body: SkillsGapRequest):
    try:
        gap = await get_skills_gap(
            candidate_skills=body.candidate_skills,
            target_role=body.target_role,
            target_location=body.target_location,
        )
        return gap
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Skills gap analysis failed: {exc}")


# ── Step 4: Market reality ───────────────────────────────────────────────────

class MarketRealityRequest(BaseModel):
    target_role: str
    target_location: Optional[str] = None


@router.post("/market-reality")
async def market_reality(body: MarketRealityRequest):
    try:
        data = await get_market_reality(
            target_role=body.target_role,
            target_location=body.target_location,
        )
        return data
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Market reality fetch failed: {exc}")


# ── Step 1b: Generate 3 resume variants ──────────────────────────────────────

class GenerateVariantsRequest(BaseModel):
    profile_json: ProfileJSON
    target_role: Optional[str] = None
    candidate_id: Optional[str] = None


@router.post("/generate-variants")
async def generate_resume_variants(body: GenerateVariantsRequest):
    try:
        resume_id = body.candidate_id or str(uuid.uuid4())
        variants = await generate_variants(
            profile=body.profile_json,
            target_role=body.target_role,
        )

        results = {}
        for variant_name, content in variants.items():
            formats = await export_all(
                resume_id=f"{resume_id}_{variant_name}",
                profile=body.profile_json,
                content=content,
                target_role=body.target_role,
            )
            results[variant_name] = {
                "content": content.model_dump(),
                "pdf_ats_path": formats.pdf_ats_path,
                "pdf_designed_path": formats.pdf_designed_path,
                "pdf_modern_path": formats.pdf_modern_path,
                "docx_path": formats.docx_path,
            }

        return {"resume_id": resume_id, "variants": results}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Variant generation failed: {exc}")


# ── Step 6: Complete onboarding + attestation ────────────────────────────────

class AttestationRequest(BaseModel):
    candidate_id: str
    profile_json: ProfileJSON
    preferences: dict
    confirmed_accurate: bool
    confirmed_authorised: bool
    confirmed_understands_mechanical: bool
    confirmed_responsibility: bool
    target_paths: list[str] = []


@router.post("/complete")
async def complete_onboarding(body: AttestationRequest, request: Request):
    if not all([
        body.confirmed_accurate,
        body.confirmed_authorised,
        body.confirmed_understands_mechanical,
        body.confirmed_responsibility,
    ]):
        raise HTTPException(status_code=422, detail="All four attestation checkboxes must be checked")

    ip = request.headers.get("x-forwarded-for", request.client.host).split(",")[0].strip()
    user_agent = request.headers.get("user-agent", "")

    # Merge profile + preferences into updated profile_json
    updated_profile = body.profile_json.model_dump()
    updated_profile["preferences"] = body.preferences
    updated_profile["target_paths"] = body.target_paths

    try:
        from services.supabase_client import supa
        supa().table("candidates").update({
            "profile_json": updated_profile,
            "consent_given_at": "now()",
            "consent_ip": ip,
            "consent_user_agent": user_agent,
            "onboarding_complete": True,
            "onboarding_step": 6,
        }).eq("id", body.candidate_id).execute()
    except Exception as exc:
        # Log but don't fail — attestation data is captured in request
        import structlog
        structlog.get_logger().error("supabase_update_failed", error=str(exc))

    return {
        "success": True,
        "candidate_id": body.candidate_id,
        "consent_recorded_at": "now",
        "consent_ip": ip,
        "message": "Onboarding complete. Discovery will begin within 6 hours.",
    }
