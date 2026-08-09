"""Isolated execution of generated code.

Two modes:
* docker   (recommended) - runs in a throwaway container with --network none,
  CPU/memory caps and a tmpfs. Docker must be installed.
* subprocess - only for interpreted languages (Python / JavaScript); applies
  a hard timeout, a throwaway temp filesystem and a stripped environment.

Nothing is executed unless the operator sets SANDBOX_ENABLED=true.
"""

from __future__ import annotations

import asyncio
import os
import shutil
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from ..config import Settings

DOCKER_IMAGES: dict[str, str] = {
    "Python": "python:3.11-slim",
    "JavaScript": "node:20-alpine",
    "C++": "gcc:13",
    "Java": "openjdk:21-slim",
}

DOCKER_COMMANDS: dict[str, list[str]] = {
    "Python": ["python", "main.py"],
    "JavaScript": ["node", "main.js"],
    "C++": ["sh", "-c", "g++ -O2 -std=c++17 main.cpp -o main && ./main"],
    "Java": ["sh", "-c", "javac Main.java && java Main"],
}

EXTENSIONS: dict[str, str] = {
    "Python": "main.py",
    "JavaScript": "main.js",
    "C++": "main.cpp",
    "Java": "Main.java",
}

SUBPROCESS_LANGUAGES = {"Python", "JavaScript"}


@dataclass
class RunResult:
    returncode: int | None = None
    stdout: str = ""
    stderr: str = ""
    timed_out: bool = False
    error: str | None = None


class Sandbox:
    def __init__(self, settings: Settings):
        self._settings = settings
        self._docker_bin = shutil.which("docker")

    def available(self) -> bool:
        if not self._settings.sandbox_enabled:
            return False
        if self._settings.sandbox_mode == "docker":
            return bool(self._docker_bin)
        return self._settings.sandbox_mode == "subprocess"

    async def run(self, language: str, code: str, stdin: str = "") -> RunResult:
        if not self.available():
            return RunResult(error="Sandbox is not enabled on this server.")
        if self._settings.sandbox_mode == "docker":
            return await self._run_docker(language, code, stdin)
        return await self._run_subprocess(language, code, stdin)

    # ------------------------------------------------------------------ docker
    async def _run_docker(self, language: str, code: str, stdin: str) -> RunResult:
        image = DOCKER_IMAGES.get(language)
        if not image:
            return RunResult(error=f"No sandbox image configured for {language}.")
        mem = self._settings.sandbox_memory_mb
        with tempfile.TemporaryDirectory(prefix="codesnap-") as tmp:
            Path(tmp, EXTENSIONS[language]).write_text(code, encoding="utf-8")
            cmd = [
                "docker", "run", "--rm",
                "--network", "none",
                "--cpus", str(self._settings.sandbox_cpu),
                "--memory", f"{mem}m",
                "--tmpfs", f"/tmp:rw,size={mem}m",
                "-i",
                "-w", "/work",
                "-v", f"{tmp}:/work:ro",
                image,
            ] + DOCKER_COMMANDS[language]
            return await self._spawn(cmd, stdin, self._settings.sandbox_timeout_seconds, cwd=tmp)

    # ------------------------------------------------------------- subprocess
    async def _run_subprocess(self, language: str, code: str, stdin: str) -> RunResult:
        if language not in SUBPROCESS_LANGUAGES:
            return RunResult(
                error="Subprocess sandbox only supports Python and JavaScript; use SANDBOX_MODE=docker for others."
            )
        if language == "Python":
            interpreter = sys.executable
        else:
            interpreter = shutil.which("node")
        if not interpreter:
            return RunResult(error="Required interpreter is not available on this host.")
        with tempfile.TemporaryDirectory(prefix="codesnap-") as tmp:
            entry = Path(tmp, EXTENSIONS[language])
            entry.write_text(code, encoding="utf-8")
            env: dict[str, str] = {
                "PATH": os.environ.get("PATH", ""),
                "TMP": tmp,
                "TEMP": tmp,
                "HOME": tmp,
                "SystemRoot": os.environ.get("SystemRoot", ""),
            }
            kwargs: dict[str, Any] = {"cwd": tmp, "env": env}
            if os.name == "nt":
                kwargs["creationflags"] = getattr(subprocess, "CREATE_NO_WINDOW", 0)
            try:
                proc = await asyncio.create_subprocess_exec(
                    interpreter,
                    str(entry),
                    stdin=asyncio.subprocess.PIPE,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                    **kwargs,
                )
            except (OSError, subprocess.SubprocessError) as exc:
                return RunResult(error=f"Could not start interpreter: {exc}")
            return await self._communicate(
                proc, stdin, self._settings.sandbox_timeout_seconds
            )

    # ----------------------------------------------------------------- shared
    async def _spawn(self, cmd: list[str], stdin: str, timeout: int, cwd: str) -> RunResult:
        kwargs: dict[str, Any] = {"cwd": cwd}
        if os.name == "nt":
            kwargs["creationflags"] = getattr(subprocess, "CREATE_NO_WINDOW", 0)
        try:
            proc = await asyncio.create_subprocess_exec(
                *cmd,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                **kwargs,
            )
        except (OSError, subprocess.SubprocessError) as exc:
            return RunResult(error=f"Could not start sandbox process: {exc}")
        return await self._communicate(proc, stdin, timeout)

    @staticmethod
    async def _communicate(proc: asyncio.subprocess.Process, stdin: str, timeout: int) -> RunResult:
        try:
            out_b, err_b = await asyncio.wait_for(
                proc.communicate(stdin.encode("utf-8", errors="replace")), timeout=timeout
            )
        except asyncio.TimeoutError:
            try:
                proc.kill()
            except ProcessLookupError:
                pass
            await proc.wait()
            return RunResult(returncode=None, timed_out=True, error="Execution timed out.")
        return RunResult(
            returncode=proc.returncode,
            stdout=out_b.decode("utf-8", errors="replace"),
            stderr=err_b.decode("utf-8", errors="replace"),
        )
