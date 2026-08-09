import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .routes import solve

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger("codesnap")


@asynccontextmanager
async def lifespan(_: FastAPI):
    logger.info("CodeSnap AI backend starting")
    yield
    logger.info("CodeSnap AI backend shutting down")


settings = get_settings()

app = FastAPI(
    title="CodeSnap AI API",
    description="Photo-to-code solver powered by the Gemini multimodal API.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(solve.router, prefix="/api")


@app.get("/")
async def root():
    return {
        "service": "codesnap-ai",
        "status": "ok",
        "docs": "/docs",
        "endpoint": "POST /api/solve",
    }


@app.get("/api/health")
async def health():
    s = get_settings()
    return {
        "status": "ok",
        "service": "codesnap-ai",
        "model": s.gemini_model,
        "gemini_configured": bool(s.gemini_api_key),
        "sandbox_enabled": bool(s.sandbox_enabled),
    }
