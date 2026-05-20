"""
Resume API routes.

POST /api/resume/generate
  multipart/form-data:
    profile_json      (str, required)     — JSON-serialised ProfileJSON
    target_role       (str, optional)
    target_industry   (str, optional)     — corporate|tech|creative|healthcare
    headshot_requested (bool, optional)   — default false
    gender            (str, conditional)  — required if headshot_requested
    headshot_industry (str, conditional)  — defaults to target_industry
    reference_photo   (file, conditional) — required if headshot_requested

GET /api/resume/{resume_id}/download/{format}
  format: pdf_ats | pdf_designed | docx | txt
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Form, File, UploadFile, HTTPException
from fastapi.responses import FileResponse, PlainTextResponse

from models.schemas import (
    ProfileJSON, HeadshotConfig, Industry, Gender, OrchestratorResult,
)
from services import resume_orchestrator

router = APIRouter(prefix="/api/resume", tags=["resume"])


@router.post("/generate", response_model=OrchestratorResult)
async def generate_resume(
    profile_json:       str           = Form(...),
    target_role:        Optional[str] = Form(None),
    target_industry:    str           = Form("tech"),
    headshot_requested: bool          = Form(False),
    use_photo_as_is:    bool          = Form(False),
    gender:             Optional[str] = Form(None),
    headshot_industry:  Optional[str] = Form(None),
    reference_photo:    Optional[UploadFile] = File(None),
):
    # Parse and validate profile
    try:
        profile_data = json.loads(profile_json)
        profile = ProfileJSON(**profile_data)
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Invalid profile_json: {exc}")

    # Resolve industry
    try:
        industry = Industry(target_industry)
    except ValueError:
        raise HTTPException(status_code=422, detail=f"Unknown industry: {target_industry}")

    # Headshot / photo config
    headshot_config: Optional[HeadshotConfig] = None
    reference_bytes: Optional[bytes] = None
    reference_mime = "image/jpeg"

    if headshot_requested or use_photo_as_is:
        if reference_photo is None:
            raise HTTPException(status_code=422, detail="reference_photo is required when a photo is requested")
        reference_bytes = await reference_photo.read()
        reference_mime = reference_photo.content_type or "image/jpeg"
        if len(reference_bytes) > 10 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="Reference photo must be under 10MB")

        # AI generation mode: also needs gender + headshot config
        if headshot_requested and not use_photo_as_is:
            if not gender:
                raise HTTPException(status_code=422, detail="gender is required for AI headshot generation")
            try:
                gen = Gender(gender)
            except ValueError:
                raise HTTPException(status_code=422, detail=f"Unknown gender: {gender}. Use male|female|nonbinary")
            hs_industry = Industry(headshot_industry) if headshot_industry else industry
            headshot_config = HeadshotConfig(gender=gen, industry=hs_industry)

    from services.face_anchor_agent import FaceAnchorError
    try:
        result = await resume_orchestrator.run(
            profile=profile,
            target_role=target_role,
            target_industry=industry,
            headshot_requested=headshot_requested,
            use_photo_as_is=use_photo_as_is,
            headshot_config=headshot_config,
            reference_bytes=reference_bytes,
            reference_mime=reference_mime,
        )
    except FaceAnchorError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    return result


@router.get("/{resume_id}/download/{fmt}")
async def download_resume(resume_id: str, fmt: str):
    from services.format_export_agent import OUTPUT_DIR

    allowed = {"pdf_ats", "pdf_designed", "pdf_modern", "docx", "txt"}
    if fmt not in allowed:
        raise HTTPException(status_code=400, detail=f"Format must be one of: {', '.join(allowed)}")

    out_dir = OUTPUT_DIR / resume_id
    if not out_dir.exists():
        raise HTTPException(status_code=404, detail="Resume not found")

    file_map = {
        "pdf_ats":      out_dir / "resume_ats.pdf",
        "pdf_designed": out_dir / "resume_designed.pdf",
        "pdf_modern":   out_dir / "resume_modern.pdf",
        "docx":         out_dir / "resume.docx",
        "txt":          out_dir / "resume.txt",
    }

    media_map = {
        "pdf_ats":      "application/pdf",
        "pdf_designed": "application/pdf",
        "pdf_modern":   "application/pdf",
        "docx":         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "txt":          "text/plain",
    }

    path = file_map[fmt]
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"Format '{fmt}' not yet generated")

    return FileResponse(
        path=str(path),
        media_type=media_map[fmt],
        filename=f"resume_{resume_id[:8]}.{fmt.split('_')[0]}",
    )


@router.get("/{resume_id}/preview/{template}")
async def preview_resume(resume_id: str, template: str):
    from services.format_export_agent import OUTPUT_DIR
    from fastapi.responses import HTMLResponse

    allowed = {"ats", "designed", "modern"}
    if template not in allowed:
        raise HTTPException(status_code=400, detail=f"Template must be one of: {', '.join(allowed)}")

    html_path = OUTPUT_DIR / resume_id / f"resume_{template}.html"
    if not html_path.exists():
        raise HTTPException(status_code=404, detail="Preview not available — regenerate the resume")

    html = html_path.read_text(encoding="utf-8")
    # Inject height reporter so the parent frame can auto-size the iframe
    script = (
        "<script>"
        "function _sendH(){"
        "window.parent.postMessage({iframeHeight:Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)},'*');"
        "}"
        "if(document.readyState==='complete'){_sendH();}"
        "else{window.addEventListener('load',_sendH);}"
        "setTimeout(_sendH,400);"
        "</script>"
    )
    html = html.replace("</body>", script + "</body>")

    # Replace file:// image paths with base64 data URIs so browser can render them
    import re, base64 as _b64
    def _embed_file(m):
        path = m.group(1)
        try:
            data = open(path, "rb").read()
            b64 = _b64.b64encode(data).decode()
            return f"data:image/jpeg;base64,{b64}"
        except Exception:
            return m.group(0)
    html = re.sub(r'file://([^\s"\']+)', _embed_file, html)
    return HTMLResponse(content=html)


@router.get("/{resume_id}/headshot")
async def download_headshot(resume_id: str):
    from services.format_export_agent import OUTPUT_DIR

    path = OUTPUT_DIR / resume_id / "headshot.jpg"
    if not path.exists():
        raise HTTPException(status_code=404, detail="Headshot not found for this resume")

    return FileResponse(
        path=str(path),
        media_type="image/jpeg",
        filename=f"headshot_{resume_id[:8]}.jpg",
    )
