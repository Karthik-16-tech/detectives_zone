# CodeSnap AI

**Photo → Solution in Seconds**

An AI coding-photo solver. Open the camera (or upload an image) on a coding
question, and a Gemini multimodal model reads the problem and returns
submission-ready code in the language you choose — target response time under
**15 seconds** when service and network latency allow.

- React + Vite + TypeScript + Tailwind CSS + Monaco Editor frontend
- Python + FastAPI + Gemini (multimodal) backend
- Client-side image compression (large photos are resized to ≤1600px, WebP/JPEG)
- Structured JSON from Gemini → validation → optional sandboxed sample execution
- Automatic one-shot correction pass when verification fails
- **15 Question Sprint** practice mode with timing stats
- API key stays server-side (`.env`); never exposed to the browser

---

## Architecture

```
Camera / Upload
      │  (client-side compression + resize)
      ▼
Frontend (React + Vite + TS)  ── POST /api/solve (multipart) ──▶  FastAPI
                                                                    │
                                                     validate image + rate-limit
                                                                    │
                                                     Gemini multimodal model
                                                                    │
                                                     structured JSON (Pydantic)
                                                                    │
                                                     verification (structure,
                                                                    complexity,
                                                                    sandbox samples)
                                                                    │
                                                     correction pass if needed
                                                                    ▼
                                                 Monaco editor + solution panel
```

No separate OCR service — the image is sent directly to Gemini's multimodal
input.

---

## Project structure

```
app_exam/
├── frontend/
│   └── src/
│       ├── components/     CameraCapture, ImageUploader, ProcessingStatus,
│       │                   SolutionPanel, CodeEditor, LanguageSelector,
│       │                   SprintProgress, ConnectionStatus, SettingsModal, icons
│       ├── pages/          Home.tsx, Sprint.tsx
│       ├── services/       api.ts, image.ts
│       ├── hooks/          useSolver.ts
│       ├── context/        AppContext.tsx
│       └── types/          solution.ts
├── backend/
│   └── app/
│       ├── main.py         FastAPI app + CORS + /api/health
│       ├── config.py       pydantic-settings (reads .env)
│       ├── models/
│       ├── routes/solve.py POST /api/solve
│       ├── schemas/        solution.py (Pydantic response models)
│       └── services/       gemini.py, validator.py, sandbox.py
├── .env.example
└── README.md
```

---

## Setup

### 1. Install dependencies

Backend:

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows (macOS/Linux: source .venv/bin/activate)
pip install -r requirements.txt
```

Frontend:

```powershell
cd frontend
npm install
```

### 2. Configure the Gemini API key

Get a key from https://aistudio.google.com/apikey (free tier works).

```powershell
cd backend
Copy-Item .env.example .env     # Windows (macOS/Linux: cp .env.example .env)
```

Open `backend/.env` and set:

```
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

> Optional tuning: `GEMINI_TIMEOUT_SECONDS`, `RATE_LIMIT_PER_MINUTE`,
> `MAX_IMAGE_SIZE_MB`, `CORS_ORIGINS`.
>
> Sample execution is **off by default**. See "Sandbox" below before enabling.

### 3. Start the backend

```powershell
cd backend
.venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

Check it: open http://localhost:8000/api/health — `"status": "ok"` and
`gemini_configured: true` when the key is set. Interactive docs at
http://localhost:8000/docs.

### 4. Start the frontend

```powershell
cd frontend
npm run dev
```

Open http://localhost:5173 — the header indicator should show **Connected**
(green dot). Vite proxies `/api` to `localhost:8000`, so no CORS setup is
needed in dev.

### 5. Test camera capture

The camera API requires a secure context. **http://localhost** counts as
secure. In the app:

1. Click **Camera** → **Take Photo**.
2. Grant the camera permission prompt.
3. Point the camera at a coding question and press **Capture**.
4. The photo is compressed, uploaded, and solved automatically.

If permission is denied, the UI shows *"Camera unavailable"* and you can use
**Upload** instead.

### 6. Test a coding question image

- Click the **Upload** tab and drop a JPG/PNG/WEBP screenshot of a coding
  problem (anything from a competitive-programming site, a practice sheet, or
  the sample below).
- The pipeline runs `Scanning question… → Understanding problem… →
  Generating solution… → Verifying code… → Solution ready`, showing the live
  elapsed time (e.g. `8.4s`).

Quick API-only smoke test (no key needed to see validation/rate-limiting):

```powershell
curl.exe -X POST http://localhost:8000/api/solve -F "image=@photo.png" -F "language=C++"
```

With a key configured this returns the full solution JSON. A real solve uses
the app UI so the result renders in Monaco.

---

## 15 Question Sprint

Click **15 Question Sprint** in the header. The sprint shows
`Question 1 / 15`, tracks completed questions, average/fastest/total response
time, and verification results, and ends with a **Practice Complete** summary.

---

## Verification & sandbox

After Gemini returns a solution, the backend always runs lightweight checks:
code structure, language match, placeholder detection, bracket balance, and
complexity vs. extracted constraints. Warnings are reported; failures trigger
one automatic Gemini correction pass.

**Sample execution is optional and disabled by default** — generated code is
**never** executed on the main server unless you explicitly opt in:

- **Docker (recommended)** — run with no network, CPU/memory caps, and a tmpfs:

  ```powershell
  # backend/.env
  SANDBOX_ENABLED=true
  SANDBOX_MODE=docker
  SANDBOX_TIMEOUT_SECONDS=8
  SANDBOX_MEMORY_MB=256
  SANDBOX_CPU=0.5
  ```

  Pull the images once (used for C++ / Python / Java / JavaScript):
  `docker pull gcc:13`, `docker pull python:3.11-slim`,
  `docker pull node:20-alpine`, `docker pull openjdk:21-slim`.

- **Subprocess** — interpreted languages only (Python, JavaScript), with a
  hard timeout and a throwaway temp filesystem:

  ```powershell
  SANDBOX_ENABLED=true
  SANDBOX_MODE=subprocess
  ```

With a sandbox enabled, extracted sample cases are executed and compared
against the expected output; the results are shown in the solution panel.

---

## Security notes

- The Gemini API key lives only in `backend/.env`. It is never bundled into
  the frontend or exposed via any frontend environment variable.
- Uploads are validated as real images (Pillow + magic bytes), capped at 8 MB.
- Requests are rate-limited per client IP (default 30/min).
- Generated code is rendered read-only in Monaco (no `eval`, no DOM injection).
- Execution only ever happens inside the opt-in sandbox with CPU/memory/time
  limits, no network, and a temporary filesystem.

## Performance

- Images compressed/resized in the browser before upload.
- Async FastAPI endpoints with timeouts; single Gemini round-trip (no OCR,
  no multi-LLM chains); connection pooling handled by the SDK.
- Stage-based progress UI so the user sees immediate feedback.
- *15 seconds is a target, not a guarantee* — actual latency depends on the
  model and network.

## Environment variables

| Variable                   | Default                                | Description                              |
| -------------------------- | -------------------------------------- | ---------------------------------------- |
| `GEMINI_API_KEY`           | *(empty)*                              | Gemini API key (required)                |
| `GEMINI_MODEL`             | `gemini-2.5-flash`                     | Multimodal model                         |
| `GEMINI_TIMEOUT_SECONDS`   | `45`                                   | Per-request timeout                      |
| `MAX_IMAGE_SIZE_MB`        | `8`                                    | Upload size cap                          |
| `RATE_LIMIT_PER_MINUTE`    | `30`                                   | Per-IP request limit                     |
| `CORS_ORIGINS`             | `http://localhost:5173,http://127.0.0.1:5173` | Allowed origins (comma-separated) |
| `SANDBOX_ENABLED`          | `false`                                | Enable sandboxed sample execution        |
| `SANDBOX_MODE`             | `subprocess`                           | `docker` or `subprocess`                 |
| `SANDBOX_TIMEOUT_SECONDS`  | `8`                                    | Execution timeout                        |
| `SANDBOX_MEMORY_MB`        | `256`                                  | Memory limit (docker)                    |
| `SANDBOX_CPU`              | `0.5`                                  | CPU limit (docker)                       |
