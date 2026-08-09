import type { ApiError } from '../services/api'
import type { Phase } from '../types/solution'
import { STAGES } from '../hooks/useSolver'
import { AlertIcon } from './icons'

const PCT = [6, 28, 56, 84, 100]

function describeError(err: ApiError | null): string {
  if (!err) return 'Something went wrong.'
  switch (err.kind) {
    case 'timeout':
      return 'The AI service took too long to respond. Try again.'
    case 'rate':
      return err.message || 'Too many requests. Wait a moment and retry.'
    case 'network':
      return 'Cannot reach the AI service. Make sure the backend is running and try again.'
    case 'server':
      return err.message || 'AI service temporarily unavailable. Try again.'
    case 'http':
      return err.message || 'The server rejected the request.'
    default:
      return err.message || 'Something went wrong.'
  }
}

interface Props {
  phase: Phase
  stage: number
  elapsedMs: number
  error: ApiError | null
  onRetry: () => void
  onUploadInstead: () => void
}

export default function ProcessingStatus({ phase, stage, elapsedMs, error, onRetry, onUploadInstead }: Props) {
  if (phase === 'error') {
    return (
      <div className="animate-fade-up rounded-xl border border-red-500/30 bg-surface p-6">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-red-500/10 ring-1 ring-red-500/30">
            <AlertIcon className="h-4 w-4 text-red-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-100">Processing failed</div>
            <div className="mt-0.5 text-xs leading-relaxed text-zinc-400">{describeError(error)}</div>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={onRetry}
            className="rounded-md bg-emerald-500/90 px-3.5 py-2 text-sm font-medium text-emerald-950 transition-colors hover:bg-emerald-400"
          >
            Retry
          </button>
          <button
            onClick={onUploadInstead}
            className="rounded-md border border-line px-3.5 py-2 text-sm text-zinc-300 transition-colors hover:bg-raised"
          >
            Upload a different image
          </button>
        </div>
      </div>
    )
  }

  if (phase !== 'processing') return null

  const label = STAGES[Math.min(stage, STAGES.length - 1)]
  const pct = PCT[Math.min(stage, PCT.length - 1)]
  const seconds = (elapsedMs / 1000).toFixed(1)

  return (
    <div className="animate-fade-up rounded-xl border border-line bg-surface p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="truncate text-sm font-semibold text-zinc-100">{label}</div>
        <div className="shrink-0 font-mono text-sm tabular-nums text-emerald-400">{seconds}s</div>
      </div>
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-raised">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500/70 to-emerald-400 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-500">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
        Typical time is under 15 seconds depending on service and network latency.
      </div>
    </div>
  )
}
