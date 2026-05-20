"""
Company normalisation: clean → fuzzy match against companies table → create if new.
Uses rapidfuzz for in-process matching instead of pg_trgm RPC to keep it simple.
"""
from __future__ import annotations

import re
import structlog
from .supabase_client import supa

log = structlog.get_logger()

_SUFFIX = re.compile(
    r"\b(inc|llc|ltd|corp|corporation|co|company|group|holdings|"
    r"technologies|tech|labs|solutions|services|international|global|worldwide)\b\.?,?\s*$",
    re.IGNORECASE,
)


def clean_name(raw: str) -> str:
    name = _SUFFIX.sub("", raw.strip()).strip().rstrip(".,- ").strip()
    return name if name else raw.strip()


async def resolve_company(raw_name: str) -> str:
    """
    Returns the companies.id UUID, creating a new row if no match found
    above the 80% similarity threshold.
    """
    canonical = clean_name(raw_name)

    try:
        from rapidfuzz import fuzz, process  # type: ignore
    except ImportError:
        log.warning("rapidfuzz_not_installed", hint="pip install rapidfuzz")
        return await _create_company(canonical, raw_name)

    try:
        res = supa().table("companies").select("id, canonical_name").execute()
        companies = res.data or []
    except Exception as exc:
        log.error("company_fetch_error", error=str(exc)[:120])
        return await _create_company(canonical, raw_name)

    if companies:
        names = [c["canonical_name"] for c in companies]
        match = process.extractOne(canonical, names, scorer=fuzz.token_sort_ratio)
        if match and match[1] >= 80:
            idx = names.index(match[0])
            return companies[idx]["id"]

    return await _create_company(canonical, raw_name)


async def _create_company(canonical: str, raw: str) -> str:
    aliases = [raw] if raw != canonical else []
    try:
        res = supa().table("companies").insert({
            "canonical_name": canonical,
            "aliases": aliases,
        }).execute()
        cid = res.data[0]["id"]
        log.info("company_created", canonical=canonical)
        return cid
    except Exception as exc:
        log.error("company_create_error", error=str(exc)[:120])
        return "00000000-0000-0000-0000-000000000000"
