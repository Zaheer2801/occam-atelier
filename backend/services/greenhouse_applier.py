"""
Greenhouse ATS auto-apply.
Detects standard + custom form fields, fills them, uploads resume, submits.
Returns (screenshot_bytes, form_data_submitted).
"""
from __future__ import annotations

import structlog
from playwright.async_api import BrowserContext, Page  # type: ignore

log = structlog.get_logger()

# Standard Greenhouse field selectors (ordered by specificity)
_FIELDS = {
    "first_name":   ["input[name='first_name']",     "input[id='first_name']",    "input[autocomplete='given-name']"],
    "last_name":    ["input[name='last_name']",       "input[id='last_name']",     "input[autocomplete='family-name']"],
    "email":        ["input[type='email']",           "input[name='email']",       "input[id='email']"],
    "phone":        ["input[type='tel']",             "input[name='phone']",       "input[id='phone']"],
    "cover_letter": ["textarea[name='cover_letter']", "textarea[id*='cover']",     "textarea[placeholder*='over letter']"],
    "linkedin":     ["input[name='linkedin_url']",    "input[id*='linkedin']",     "input[placeholder*='LinkedIn']"],
    "website":      ["input[name='website']",         "input[id*='website']",      "input[placeholder*='website']"],
    "resume":       ["input[type='file']"],
    "submit":       [
        "button[data-qa='btn-submit']",
        "input[type='submit'][value*='Submit']",
        "button[type='submit']",
        "button:text('Submit Application')",
        "button:text('Submit')",
    ],
}


async def apply(
    context: BrowserContext,
    job_url: str,
    profile: dict,
    resume_path: str,
    cover_text: str,
    dry_run: bool = False,
) -> tuple[bytes, dict]:
    """
    Fills and submits a Greenhouse application form.
    dry_run=True fills the form but does not click Submit.
    Returns (screenshot_png_bytes, form_data_submitted_dict).
    """
    page = await context.new_page()
    form_data: dict = {}

    try:
        await page.goto(job_url, wait_until="networkidle", timeout=30_000)
        log.info("gh_page_loaded", url=job_url)

        # If not already on the form, look for an Apply button
        has_form = await page.query_selector("form#application_form, div#application, form[action*='greenhouse']") is not None
        if not has_form:
            for sel in ["a:text('Apply Now')", "a:text('Apply')", "a[href*='greenhouse']"]:
                btn = await page.query_selector(sel)
                if btn:
                    await btn.click()
                    await page.wait_for_load_state("networkidle", timeout=15_000)
                    break

        # ── Standard fields ────────────────────────────────────────────────
        name_parts = (profile.get("full_name") or "").split(" ", 1)
        first_name = name_parts[0] if name_parts else ""
        last_name  = name_parts[1] if len(name_parts) > 1 else ""

        await _fill(page, _FIELDS["first_name"], first_name,                form_data, "first_name")
        await _fill(page, _FIELDS["last_name"],  last_name,                 form_data, "last_name")
        await _fill(page, _FIELDS["email"],      profile.get("email", ""),  form_data, "email")
        await _fill(page, _FIELDS["phone"],      profile.get("phone", ""),  form_data, "phone")
        await _fill(page, _FIELDS["cover_letter"], cover_text,              form_data, "cover_letter")
        await _fill(page, _FIELDS["linkedin"],   profile.get("linkedin_url", ""), form_data, "linkedin")

        # ── Resume upload ──────────────────────────────────────────────────
        if resume_path:
            for sel in _FIELDS["resume"]:
                try:
                    el = await page.query_selector(sel)
                    if el:
                        await el.set_input_files(resume_path)
                        form_data["resume_uploaded"] = True
                        log.info("gh_resume_uploaded")
                        break
                except Exception:
                    continue

        # ── Custom questions (text areas, selects) ─────────────────────────
        await _handle_custom_questions(page, profile, form_data)

        # ── Screenshot before submit ───────────────────────────────────────
        screenshot = await page.screenshot(full_page=True)

        if not dry_run:
            submitted = False
            for sel in _FIELDS["submit"]:
                try:
                    btn = await page.query_selector(sel)
                    if btn and await btn.is_visible():
                        await btn.click()
                        await page.wait_for_load_state("networkidle", timeout=20_000)
                        submitted = True
                        form_data["submitted"] = True
                        log.info("gh_submitted", url=job_url)
                        break
                except Exception:
                    continue
            if not submitted:
                log.warning("gh_submit_btn_not_found", url=job_url)
            # Final screenshot (confirmation page)
            screenshot = await page.screenshot(full_page=True)
        else:
            form_data["dry_run"] = True
            log.info("gh_dry_run", url=job_url)

        return screenshot, form_data

    finally:
        await page.close()


async def _fill(page: Page, selectors: list[str], value: str, out: dict, key: str) -> None:
    if not value:
        return
    for sel in selectors:
        try:
            el = await page.query_selector(sel)
            if el and await el.is_visible():
                await el.fill(value)
                out[key] = value
                return
        except Exception:
            continue


async def _handle_custom_questions(page: Page, profile: dict, form_data: dict) -> None:
    """Answer free-text custom questions using the AI cascade."""
    from services.provider_router import route  # type: ignore

    # Grab all textareas that aren't the cover letter
    textareas = await page.query_selector_all(
        "textarea:not([name='cover_letter']):not([id*='cover'])"
    )
    for ta in textareas[:5]:
        try:
            if not await ta.is_visible():
                continue
            label = await _label_for(page, ta)
            if not label:
                continue
            skills = profile.get("skills") or []
            prompt = (
                f"Answer this job application question truthfully using ONLY facts "
                f"from the candidate's profile.\n"
                f"Profile: skills={skills[:10]}, title={profile.get('job_title','')}, "
                f"{profile.get('total_years_experience',0)} years experience.\n"
                f"Question: {label}\n"
                f"Answer in 2-3 sentences. Be specific and honest. No filler phrases."
            )
            answer, _ = await route(prompt, "You fill job application forms honestly.", "custom_question")
            await ta.fill(answer[:1000])
            form_data[f"custom_{label[:30]}"] = answer
        except Exception as exc:
            log.warning("gh_custom_question_error", error=str(exc)[:80])


async def _label_for(page: Page, element) -> str:
    try:
        el_id = await element.get_attribute("id")
        if el_id:
            lbl = await page.query_selector(f"label[for='{el_id}']")
            if lbl:
                return (await lbl.inner_text()).strip()
        placeholder = await element.get_attribute("placeholder")
        return (placeholder or "").strip()
    except Exception:
        return ""
