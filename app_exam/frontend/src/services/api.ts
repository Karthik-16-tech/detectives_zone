import type { Language, SampleCase, Solution } from '../types/solution'

export interface HealthInfo {
  status: string
  service: string
  model: string
  gemini_configured: boolean
  sandbox_enabled?: boolean
}

export type ApiErrorKind = 'timeout' | 'network' | 'rate' | 'server' | 'http'

export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status?: number

  constructor(kind: ApiErrorKind, message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.status = status
  }
}

const BASE_KEY = 'codesnap.apiBase'

export function getApiBase(): string {
  try {
    return localStorage.getItem(BASE_KEY) ?? ''
  } catch {
    return ''
  }
}

export function setApiBase(url: string): void {
  try {
    const trimmed = url.trim().replace(/\/+$/, '')
    if (trimmed) localStorage.setItem(BASE_KEY, trimmed)
    else localStorage.removeItem(BASE_KEY)
  } catch {
    /* storage unavailable */
  }
}

function normalizeSolution(data: unknown): Solution {
  const d = (data ?? {}) as Record<string, unknown>
  const str = (v: unknown) => (typeof v === 'string' ? v : '')
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0)
  const samples: SampleCase[] | undefined = Array.isArray(d.samples)
    ? (d.samples as Array<Record<string, unknown>>).map((s) => ({
        input: str(s.input),
        output: str(s.output),
        actual: s.actual != null ? str(s.actual) : undefined,
        passed: typeof s.passed === 'boolean' ? s.passed : undefined,
      }))
    : undefined
  return {
    status: d.status === 'unclear' ? 'unclear' : d.status === 'error' ? 'error' : 'ready',
    problem: str(d.problem),
    language: str(d.language),
    algorithm: str(d.algorithm),
    code: str(d.code),
    time_complexity: str(d.time_complexity),
    space_complexity: str(d.space_complexity),
    confidence: Math.min(1, Math.max(0, num(d.confidence))),
    error: typeof d.error === 'string' && d.error ? d.error : undefined,
    samples,
    verification:
      d.verification && typeof d.verification === 'object'
        ? (d.verification as Solution['verification'])
        : undefined,
    elapsed_ms: num(d.elapsed_ms) || undefined,
  }
}

async function readErrorDetail(res: Response): Promise<string> {
  try {
    const j = await res.json()
    if (typeof j?.detail === 'string') return j.detail
    if (Array.isArray(j?.detail) && j.detail.length > 0 && typeof j.detail[0]?.msg === 'string') {
      return j.detail[0].msg
    }
  } catch {
    /* not JSON */
  }
  return `Request failed with status ${res.status}.`
}

export async function solveImage(
  image: Blob,
  language: Language,
  timeoutMs = 70_000,
): Promise<Solution> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)
  const form = new FormData()
  form.append('image', image, 'question.jpg')
  form.append('language', language)
  try {
    const res = await fetch(`${getApiBase()}/api/solve`, {
      method: 'POST',
      body: form,
      signal: controller.signal,
    })
    if (!res.ok) {
      const detail = await readErrorDetail(res)
      if (res.status === 429) throw new ApiError('rate', detail, 429)
      if (res.status >= 500) throw new ApiError('server', detail, res.status)
      throw new ApiError('http', detail, res.status)
    }
    return normalizeSolution(await res.json())
  } catch (err) {
    if (err instanceof ApiError) throw err
    const timedOut = controller.signal.aborted
    throw new ApiError(
      timedOut ? 'timeout' : 'network',
      timedOut ? 'The request timed out.' : 'Cannot reach the AI service. Is the backend running?',
    )
  } finally {
    window.clearTimeout(timer)
  }
}

export async function fetchHealth(): Promise<HealthInfo> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), 5000)
  try {
    const res = await fetch(`${getApiBase()}/api/health`, { signal: controller.signal })
    if (!res.ok) throw new ApiError('http', 'Health check failed', res.status)
    return (await res.json()) as HealthInfo
  } finally {
    window.clearTimeout(timer)
  }
}
