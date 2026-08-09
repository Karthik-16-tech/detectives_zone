import type { Phase, SprintResult } from '../types/solution'

interface Props {
  current: number
  total: number
  results: SprintResult[]
  phase: Phase
  onNext: () => void
  onQuit: () => void
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-bg/50 px-3 py-2">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="mt-0.5 font-mono text-sm tabular-nums text-zinc-100">{value}</div>
    </div>
  )
}

function Stats({ results }: { results: SprintResult[] }) {
  const times = results.map((r) => r.elapsedMs)
  const avg = times.reduce((a, b) => a + b, 0) / times.length
  const fastest = Math.min(...times)
  const total = times.reduce((a, b) => a + b, 0)
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
      <Stat label="Completed" value={`${results.length}`} />
      <Stat label="Avg response" value={`${(avg / 1000).toFixed(1)}s`} />
      <Stat label="Fastest" value={`${(fastest / 1000).toFixed(1)}s`} />
      <Stat label="Total time" value={`${(total / 1000).toFixed(1)}s`} />
    </div>
  )
}

export default function SprintProgress({ current, total, results, phase, onNext, onQuit }: Props) {
  const nextEnabled = phase === 'ready'

  return (
    <section className="animate-fade-up rounded-xl border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            15 Question Sprint
          </div>
          <div className="mt-0.5 text-sm font-semibold text-zinc-100">
            Question {current} / {total}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-raised px-2.5 py-1 font-mono text-xs tabular-nums text-zinc-400">
            {results.length}/{total}
          </span>
          <button
            onClick={onQuit}
            className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
          >
            Quit
          </button>
        </div>
      </div>

      <div className="mt-3 flex gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < results.length
                ? 'bg-emerald-500'
                : i === results.length
                  ? 'animate-pulse bg-emerald-500/40'
                  : 'bg-raised'
            }`}
          />
        ))}
      </div>

      {results.length > 0 && <Stats results={results} />}

      {results.length > 0 && (
        <div className="mt-4 max-h-32 space-y-1.5 overflow-y-auto pr-1 scroll-thin">
          {results.map((r) => (
            <div
              key={r.question}
              className="flex items-center justify-between rounded-md bg-raised/60 px-3 py-1.5 text-xs"
            >
              <span className="text-zinc-400">
                Question {r.question}
                {r.solution.verification?.passed ? (
                  <span className="ml-2 text-emerald-400">✓ verified</span>
                ) : null}
              </span>
              <span className="font-mono tabular-nums text-zinc-300">
                {(r.elapsedMs / 1000).toFixed(1)}s
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="hidden text-[11px] text-zinc-500 sm:block">
          Target under 15 seconds per question when latency allows.
        </div>
        <button
          onClick={onNext}
          disabled={!nextEnabled}
          className={`ml-auto rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            nextEnabled
              ? 'bg-emerald-500/90 text-emerald-950 hover:bg-emerald-400'
              : 'cursor-not-allowed border border-line text-zinc-600'
          }`}
        >
          {current >= total ? 'Finish' : 'Next Question →'}
        </button>
      </div>
    </section>
  )
}
