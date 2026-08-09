import CodeEditor from './CodeEditor'
import type { SampleCase, Solution, VerificationResult } from '../types/solution'
import { AlertIcon, CheckIcon, ShieldIcon } from './icons'

function InfoBlock({ title, text }: { title: string; text: string }) {
  if (!text) return null
  return (
    <div className="animate-fade-up rounded-xl border border-line bg-surface p-4">
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{title}</div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">{text}</p>
    </div>
  )
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div className="animate-fade-up rounded-xl border border-line bg-surface p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="mt-1 font-mono text-sm text-emerald-300">{value || '—'}</div>
    </div>
  )
}

function VerificationBlock({ v }: { v: VerificationResult }) {
  const ok = v.executed ? v.passed : null
  return (
    <div className="animate-fade-up rounded-xl border border-line bg-surface p-4">
      <div className="flex items-center gap-2.5">
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ring-1 ${
            ok === true
              ? 'bg-emerald-500/10 ring-emerald-500/30 text-emerald-400'
              : ok === false
                ? 'bg-red-500/10 ring-red-500/30 text-red-400'
                : 'bg-zinc-500/10 ring-zinc-500/30 text-zinc-400'
          }`}
        >
          {ok === true ? <CheckIcon className="h-4 w-4" /> : <AlertIcon className="h-4 w-4" />}
        </span>
        <div>
          <div className="text-sm font-medium text-zinc-100">
            {ok === true
              ? 'All sample cases passed'
              : ok === false
                ? 'Sample cases failed verification'
                : 'Structure verified'}
          </div>
          {v.message && <p className="mt-0.5 text-xs text-zinc-500">{v.message}</p>}
        </div>
      </div>
      {v.samples.length > 0 && (
        <ul className="mt-3 space-y-2">
          {v.samples.map((s, i) => (
            <SampleRow key={i} index={i} sample={s} />
          ))}
        </ul>
      )}
    </div>
  )
}

function SampleRow({ index, sample }: { index: number; sample: SampleCase }) {
  return (
    <li className="rounded-md border border-line bg-bg/50 p-2.5">
      <div className="flex items-center justify-between gap-2 text-[11px]">
        <span className="text-zinc-500">Sample {index + 1}</span>
        <span className={sample.passed ? 'font-medium text-emerald-400' : 'font-medium text-red-400'}>
          {sample.passed ? 'passed' : 'failed'}
        </span>
      </div>
      <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-600">Input</div>
          <pre className="mt-0.5 overflow-x-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-zinc-300">
            {sample.input || '—'}
          </pre>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-600">Output</div>
          <pre className="mt-0.5 overflow-x-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-zinc-300">
            {sample.actual !== undefined && sample.passed !== undefined
              ? `actual: ${sample.actual || '(empty)'}`
              : sample.output || '—'}
          </pre>
        </div>
      </div>
    </li>
  )
}

function UnclearPanel({ message }: { message?: string }) {
  return (
    <div className="animate-fade-up rounded-xl border border-amber-500/30 bg-amber-500/5 p-8 text-center">
      <div className="mx-auto grid h-10 w-10 place-items-center rounded-md bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30">
        ?
      </div>
      <h2 className="mt-3 text-base font-semibold text-zinc-100">Image is unclear</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
        {message ||
          'The question could not be read. Capture the question again with better lighting and focus.'}
      </p>
    </div>
  )
}

export default function SolutionPanel({ solution }: { solution: Solution }) {
  if (solution.status === 'unclear') return <UnclearPanel message={solution.error} />

  if (solution.status === 'error') {
    return (
      <div className="animate-fade-up rounded-xl border border-red-500/30 bg-red-500/5 p-8 text-center">
        <h2 className="text-base font-semibold text-zinc-100">No solution produced</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
          {solution.error || 'The AI service could not solve this question. Try again.'}
        </p>
      </div>
    )
  }

  const confidencePct = Math.round(solution.confidence * 100)

  return (
    <section className="space-y-5">
      <header className="animate-fade-up flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <h1 className="text-lg font-semibold tracking-tight text-zinc-100">Solution</h1>
          {solution.elapsed_ms != null && (
            <span className="rounded-md bg-raised px-2 py-0.5 font-mono text-xs tabular-nums text-emerald-400">
              {(solution.elapsed_ms / 1000).toFixed(1)}s
            </span>
          )}
        </div>
        <span className="rounded-md border border-line px-2.5 py-1 text-xs text-zinc-400">
          {solution.language || 'Code'}
        </span>
      </header>

      <InfoBlock title="Problem" text={solution.problem} />
      <InfoBlock title="Algorithm" text={solution.algorithm} />

      {solution.code && <CodeEditor language={solution.language} code={solution.code} />}

      <div className="grid gap-3 sm:grid-cols-2">
        <Chip label="Time complexity" value={solution.time_complexity} />
        <Chip label="Space complexity" value={solution.space_complexity} />
      </div>

      <div className="animate-fade-up">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-zinc-400">Confidence</span>
          <span className="font-mono tabular-nums text-zinc-200">{confidencePct}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-raised">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-700 ease-out"
            style={{ width: `${Math.max(4, confidencePct)}%` }}
          />
        </div>
        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-zinc-500">
          <ShieldIcon className="h-3 w-3" />
          Estimated confidence — not a guarantee. Review the code before submitting.
        </p>
      </div>

      {solution.verification && <VerificationBlock v={solution.verification} />}

      {solution.samples && solution.samples.length > 0 && (
        <div className="animate-fade-up">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Sample cases extracted from the image
          </div>
          <ul className="space-y-2">
            {solution.samples.map((s, i) => (
              <SampleRow key={i} index={i} sample={s} />
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
