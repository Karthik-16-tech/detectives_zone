"""Gemini multimodal integration.

The image is sent DIRECTLY to Gemini's multimodal model as inline data.
There is no separate OCR step. Responses are requested as strict JSON and
parsed defensively.
"""

import asyncio
import json
import logging
import re
from typing import Any

from ..config import Settings, get_settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an expert competitive-programming problem solver.

The user provides an image containing a programming problem.

Analyze the COMPLETE image before solving.

Extract:
* Problem statement
* Input format
* Output format
* Constraints
* Examples
* Required programming language if visible

Then:
1. Understand the problem.
2. Determine the optimal algorithm.
3. Consider the constraints.
4. Generate submission-ready code.
5. Check edge cases.
6. Check input parsing.
7. Check output formatting.
8. Check integer overflow.
9. Check time complexity.
10. Check space complexity.
11. Verify the sample cases mentally.
12. Correct the solution if verification reveals an issue.

ACCURACY RULES:
* Never invent missing information.
* Never guess unreadable text.
* Follow the exact problem requirements.
* Match the required input/output format.
* Handle hidden test cases.
* Prefer the simplest correct algorithm satisfying the constraints.
* Return complete executable code.
* Do not include unnecessary explanations.

Return ONLY valid JSON.
"""

USER_PROMPT_TEMPLATE = """Solve the programming problem shown in the image.

Required output language: {language}

Return ONLY valid JSON with this exact schema:
{{
  "status": "ready",
  "problem": "short problem description",
  "language": "{language}",
  "algorithm": "short algorithm description",
  "code": "complete executable code",
  "time_complexity": "O(...)",
  "space_complexity": "O(...)",
  "confidence": 0.95,
  "samples": [{{"input": "sample input exactly as shown", "output": "expected sample output exactly as shown"}}]
}}

If the image is unreadable, return:
{{
  "status": "unclear",
  "problem": "",
  "language": "",
  "algorithm": "",
  "code": "",
  "time_complexity": "",
  "space_complexity": "",
  "confidence": 0,
  "samples": [],
  "error": "Explain exactly what cannot be read."
}}

Extract every sample test case visible in the image and include it in "samples".
"""

CORRECTION_PROMPT_TEMPLATE = """The previous solution failed verification.

The image still shows the same programming problem.
Required language: {language}

Previous solution produced by you:
<code>
{code}
</code>

Verification report:
{report}

Fix the code so it satisfies the report, passes the sample cases, and follows
the exact input/output format. Return the COMPLETE corrected solution as valid
JSON using the exact same schema as before.
"""


class GeminiError(Exception):
    """Raised when the Gemini service cannot produce a usable result."""


def _extract_json(text: str) -> dict[str, Any]:
    text = (text or "").strip()
    if text.startswith("```"):
        text = re.sub(r"^```[A-Za-z]*\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict):
            return parsed
    except (json.JSONDecodeError, TypeError):
        pass
    start = text.find("{")
    if start == -1:
        raise GeminiError("The AI response contained no JSON object.")
    depth = 0
    for i in range(start, len(text)):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                chunk = text[start : i + 1]
                try:
                    parsed = json.loads(chunk)
                    if isinstance(parsed, dict):
                        return parsed
                except json.JSONDecodeError:
                    break
    raise GeminiError("The AI response could not be parsed as JSON.")


class GeminiService:
    def __init__(self, settings: Settings | None = None):
        self._settings = settings or get_settings()
        self._client: Any = None

    def _ensure_client(self) -> Any:
        if self._client is not None:
            return self._client
        if not self._settings.gemini_api_key:
            raise GeminiError(
                "Gemini API key is not configured on the server. "
                "Add GEMINI_API_KEY to backend/.env and restart."
            )
        try:
            from google import genai  # noqa: F401
            from google.genai import types
        except ImportError:
            raise GeminiError(
                "The google-genai SDK is not installed on the server. "
                "Run: pip install -r requirements.txt"
            ) from None
        try:
            self._client = genai.Client(
                api_key=self._settings.gemini_api_key,
                http_options=types.HttpOptions(
                    timeout=self._settings.gemini_timeout_seconds * 1000
                ),
            )
        except Exception:
            logger.warning("Client init with http_options failed; retrying plain.", exc_info=True)
            self._client = genai.Client(api_key=self._settings.gemini_api_key)
        return self._client

    async def _generate(self, image_bytes: bytes, mime_type: str, system: str, user: str) -> str:
        client = self._ensure_client()
        try:
            from google.genai import types
        except ImportError:
            raise GeminiError("The google-genai SDK is not installed on the server.") from None
        try:
            response = await client.aio.models.generate_content(
                model=self._settings.gemini_model,
                config=types.GenerateContentConfig(
                    system_instruction=system,
                    temperature=0.1,
                    max_output_tokens=8192,
                    response_mime_type="application/json",
                ),
                contents=[
                    types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                    user,
                ],
            )
        except asyncio.CancelledError:
            raise
        except Exception as exc:
            logger.exception("Gemini generate_content failed")
            raise GeminiError("AI service temporarily unavailable. Try again.") from exc
        text = getattr(response, "text", None)
        if not text or not text.strip():
            raise GeminiError("AI service returned an empty response. Try again.")
        return text.strip()

    async def solve(self, image_bytes: bytes, mime_type: str, language: str) -> dict[str, Any]:
        user = USER_PROMPT_TEMPLATE.format(language=language)
        text = await self._generate(image_bytes, mime_type, system=SYSTEM_PROMPT, user=user)
        return _extract_json(text)

    async def correct(
        self,
        image_bytes: bytes,
        mime_type: str,
        language: str,
        previous: dict[str, Any],
        report: str,
    ) -> dict[str, Any]:
        user = CORRECTION_PROMPT_TEMPLATE.format(
            language=language, code=previous.get("code", ""), report=report
        )
        text = await self._generate(image_bytes, mime_type, system=SYSTEM_PROMPT, user=user)
        return _extract_json(text)


gemini_service = GeminiService()
