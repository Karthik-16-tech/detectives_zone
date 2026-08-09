"""POST /api/solve - receive a photo of a coding question, solve it with Gemini.

Pipeline: upload -> validate -> Gemini multimodal -> structured JSON ->
verification -> optional correction pass -> response.
"""

import asyncio
import io
import logging
import time
from collections import defaultdict, deque

logger = logging.getLogger(__name__)

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile

from ..config import Settings, get_settings
from ..schemas.solution import SampleCase, SolutionResponse, VerificationResult
from ..services.gemini import GeminiError, gemini_service
from ..services.sandbox import Sandbox
from ..services import validator

router = APIRouter(tags=["solve"])

ALLOWED_LANGUAGES = {"C++", "Python", "Java", "JavaScript"}
ALLOWED_MIME = {"image/jpeg", "image/png", "image/webp"}

# ---- in-memory sliding-window rate limiter ---------------------------------
_hits: dict[str, deque[float]] = defaultdict(deque)
_rate_lock = asyncio.Lock()


async def _check_rate_limit(ip: str, limit: int) -> None:
    now = time.monotonic()
    async with _rate_lock:
        bucket = _hits[ip]
        while bucket and now - bucket[0] > 60.0:
            bucket.popleft()
        if len(bucket) >= limit:
            raise HTTPException(status_code=429, detail="Too many requests. Wait a moment and retry.")
        bucket.append(now)
        if len(_hits) > 10_000:
            _hits.clear()


def detect_image_mime(raw: bytes, declared: str | None) -> str:
    """Validate the payload really is an image and return a MIME type."""
    try:
        from PIL import Image

        with Image.open(io.BytesIO(raw)) as im:
            fmt = (im.format or "").upper()
        mapping = {"JPEG": "image/jpeg", "PNG": "image/png", "WEBP": "image/webp"}
        if fmt in mapping:
            return mapping[fmt]
    except Exception:
        pass
    if declared in ALLOWED_MIME:
        return declared
    if raw[:3] == b"\xff\xd8\xff":
        return "image/jpeg"
    if raw[:8] == b"\x89PNG\r\n\x1a\n":
        return "image/png"
    if raw[:4] == b"RIFF" and raw[8:12] == b"WEBP":
        return "image/webp"
    raise HTTPException(status_code=422, detail="Unsupported image. Use JPG, JPEG, PNG or WEBP.")


def _samples_from(solution: dict) -> list[SampleCase]:
    out: list[SampleCase] = []
    for item in solution.get("samples") or []:
        if isinstance(item, dict):
            out.append(
                SampleCase(input=str(item.get("input") or ""), output=str(item.get("output") or ""))
            )
    return out[:6]


async def _verify_solution(
    settings: Settings, sandbox: Sandbox, solution: dict, language: str, samples: list[SampleCase]
) -> VerificationResult:
    errors = validator.structure_errors(solution, language)
    warnings = validator.complexity_warnings(solution)
    if errors:
        message = "; ".join(errors)
        if warnings:
            message += " | " + "; ".join(warnings)
        return VerificationResult(executed=False, passed=False, message=message, samples=[])

    messages: list[str] = list(warnings)
    executed = False
    passed = True
    result_samples: list[SampleCase] = []

    if settings.sandbox_enabled and sandbox.available() and samples:
        executed = True
        for case in samples:
            if not case.input and not case.output:
                continue
            run = await sandbox.run(language, solution.get("code") or "", case.input)
            if run.error:
                messages.append(f"Sandbox error: {run.error}")
                executed = False
                break
            if run.timed_out:
                passed = False
                messages.append("Execution timed out.")
                result_samples.append(
                    SampleCase(input=case.input, output=case.output, actual="", passed=False)
                )
                continue
            ok = run.returncode == 0 and validator.compare_output(run.stdout, case.output)
            result_samples.append(
                SampleCase(input=case.input, output=case.output, actual=run.stdout, passed=ok)
            )
            if not ok:
                passed = False
                if run.stderr.strip():
                    messages.append(f"stderr: {run.stderr.strip()[:300]}")
        if executed and not result_samples:
            messages.append("No sample cases available to execute.")
        if executed:
            failed = [s for s in result_samples if not s.passed]
            if failed:
                messages.append(f"{len(failed)} of {len(result_samples)} sample case(s) failed.")
    elif settings.sandbox_enabled and sandbox.available():
        messages.append("No sample cases were extracted; sample execution skipped.")

    return VerificationResult(
        executed=executed,
        passed=passed,
        message="; ".join(messages),
        samples=result_samples,
    )


@router.post("/solve", response_model=SolutionResponse)
async def solve_question(
    request: Request,
    image: UploadFile = File(...),
    language: str = Form("C++"),
) -> SolutionResponse:
    settings = get_settings()
    ip = request.client.host if request.client else "unknown"
    await _check_rate_limit(ip, settings.rate_limit_per_minute)

    if language not in ALLOWED_LANGUAGES:
        raise HTTPException(
            status_code=422,
            detail=f"Unsupported language '{language}'. Use C++, Python, Java or JavaScript.",
        )

    raw = await image.read()
    if not raw:
        raise HTTPException(status_code=422, detail="The uploaded file is empty.")
    if len(raw) > settings.max_image_size_mb * 1024 * 1024:
        raise HTTPException(
            status_code=413, detail=f"Image exceeds the {settings.max_image_size_mb} MB limit."
        )

    mime = detect_image_mime(raw, image.content_type)

    started = time.perf_counter()
    try:
        solution = await asyncio.wait_for(
            gemini_service.solve(raw, mime, language),
            timeout=settings.gemini_timeout_seconds + 5,
        )
    except asyncio.TimeoutError:
        raise HTTPException(status_code=504, detail="AI service timed out. Try again.")
    except GeminiError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    status = solution.get("status")
    samples = _samples_from(solution)
    verification: VerificationResult | None = None

    if status == "ready":
        sandbox = Sandbox(settings)
        verification = await _verify_solution(settings, sandbox, solution, language, samples)

        needs_correction = (
            verification is not None
            and not verification.passed
            and bool(verification.message)
        )
        if needs_correction:
            try:
                corrected = await asyncio.wait_for(
                    gemini_service.correct(raw, mime, language, solution, verification.message),
                    timeout=settings.gemini_timeout_seconds + 5,
                )
            except (asyncio.TimeoutError, GeminiError):
                logger.error("Correction pass failed; returning original solution.")
                corrected = None
            if corrected and corrected.get("status") == "ready":
                solution = corrected
                samples = _samples_from(corrected)
                verification = await _verify_solution(
                    settings, sandbox, corrected, language, samples
                )

    elapsed_ms = int((time.perf_counter() - started) * 1000)

    if status not in ("ready", "unclear"):
        status = "error"

    confidence_raw = solution.get("confidence")
    confidence = 0.0
    try:
        confidence = max(0.0, min(1.0, float(confidence_raw or 0)))
    except (TypeError, ValueError):
        confidence = 0.0

    return SolutionResponse(
        status=status,
        problem=str(solution.get("problem") or ""),
        language=language,
        algorithm=str(solution.get("algorithm") or ""),
        code=str(solution.get("code") or ""),
        time_complexity=str(solution.get("time_complexity") or ""),
        space_complexity=str(solution.get("space_complexity") or ""),
        confidence=confidence,
        error=solution.get("error") if isinstance(solution.get("error"), str) else None,
        samples=samples,
        verification=verification,
        elapsed_ms=elapsed_ms,
    )
