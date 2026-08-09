from typing import Literal

from pydantic import BaseModel, Field


class SampleCase(BaseModel):
    input: str = ""
    output: str = ""
    actual: str | None = None
    passed: bool | None = None


class VerificationResult(BaseModel):
    executed: bool = False
    passed: bool = False
    message: str = ""
    samples: list[SampleCase] = Field(default_factory=list)


class SolutionResponse(BaseModel):
    status: Literal["ready", "unclear", "error"]
    problem: str = ""
    language: str = ""
    algorithm: str = ""
    code: str = ""
    time_complexity: str = ""
    space_complexity: str = ""
    confidence: float = 0.0
    error: str | None = None
    samples: list[SampleCase] = Field(default_factory=list)
    verification: VerificationResult | None = None
    elapsed_ms: int = 0
