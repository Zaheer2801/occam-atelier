from __future__ import annotations

import os
import structlog
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv(override=True)

# Ensure output directory exists on startup
Path(os.getenv("OUTPUT_DIR", "./outputs")).mkdir(parents=True, exist_ok=True)

log = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    from services.discovery_scheduler import start_scheduler, stop_scheduler
    start_scheduler()
    log.info("autoapply_backend_start")
    yield
    stop_scheduler()
    log.info("autoapply_backend_stop")


app = FastAPI(
    title="AutoApply AI — Resume & Headshot Service",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from api.resume import router as resume_router
from api.parse import router as parse_router
from api.onboarding import router as onboarding_router
from api.jobs import router as jobs_router
app.include_router(resume_router)
app.include_router(parse_router)
app.include_router(onboarding_router)
app.include_router(jobs_router)


@app.get("/health")
async def health():
    return {"status": "ok"}
