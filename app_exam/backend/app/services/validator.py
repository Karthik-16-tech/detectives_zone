"""Lightweight offline verification of generated solutions.

Structural checks run on every "ready" solution. Sample-case execution only
happens through the Sandbox when the operator explicitly enables it.
"""

from __future__ import annotations

import re
from typing import Any

LANGUAGE_MARKERS: dict[str, tuple[str, ...]] = {
    "C++": ("#include", "int main", "using namespace"),
    "Python": ("def ", "input(", "print(", "__name__"),
    "Java": ("public class", "public static void main", "import java"),
    "JavaScript": ("function ", "console.log", "readline", "process.stdin", "const ", "let "),
}

PLACEHOLDERS = (
    "...",
    "your code here",
    "write your code",
    "insert code",
    "todo",
    "implementation omitted",
)


def structure_errors(solution: dict[str, Any], language: str) -> list[str]:
    errors: list[str] = []
    code = (solution.get("code") or "").strip()
    if not code:
        errors.append("The model returned no code.")
        return errors
    if len(code) < 20:
        errors.append("The returned code is suspiciously short.")
    low = code.lower()
    for marker in PLACEHOLDERS:
        if marker in low:
            errors.append(f"The code contains an incomplete placeholder: '{marker}'.")
            break
    markers = LANGUAGE_MARKERS.get(language)
    if markers and not any(m in code for m in markers):
        errors.append(f"The generated code does not look like {language}.")
    for opening, closing in (("{", "}"), ("(", ")"), ("[", "]")):
        if code.count(opening) != code.count(closing):
            errors.append(f"Unbalanced '{opening}' brackets.")
            break
    return errors


def complexity_warnings(solution: dict[str, Any]) -> list[str]:
    warnings: list[str] = []
    tc = (solution.get("time_complexity") or "").lower()
    text = f"{solution.get('problem', '')} {solution.get('algorithm', '')}".lower()
    if re.search(r"10\s?\^\s?\d+|1e\d+|\d{5,}", text):
        if "n^2" in tc or "n2" in tc.replace(" ", "") or "n²" in tc:
            warnings.append(
                "Time complexity looks quadratic — it may be too slow for the stated constraints."
            )
    return warnings


def normalize_output(text: str) -> str:
    return "\n".join(line.strip() for line in (text or "").splitlines()).strip()


def compare_output(actual: str, expected: str) -> bool:
    return normalize_output(actual) == normalize_output(expected)
