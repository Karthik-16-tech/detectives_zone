import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CameraCapture from '../components/CameraCapture'
import ImageUploader from '../components/ImageUploader'
import ProcessingStatus from '../components/ProcessingStatus'
import SolutionPanel from '../components/SolutionPanel'
import SprintProgress from '../components/SprintProgress'
import { CameraIcon, CheckIcon, UploadIcon } from '../components/icons'
import { useSolver } from '../hooks/useSolver'
import { useApp } from '../context/AppContext'
import type { SprintResult } from '../types/solution'

const TOTAL = 15

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-bg/50 px-3 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="mt-1 font-mono text-base tabular-nums text-zinc-100">{value}</div>
    </div>
  )
}

function Summary({ results, onRestart }: { results: SprintResult[]; onRestart: () => void }) {
  const times = results.map((r) => r.elapsedMs)
  const avg = times.reduce((a, b) => a + b, 0) / times.length
  const fastest = Math.min(...times)
  const verified = results.filter((r) => r.solution.verification?.passed).length

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-14">
      <div className="animate-fade-up rounded-xl border border-line bg-surface p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-emerald-500/15 ring-1 ring-emerald-500/30">
          <CheckIcon className="h-6 w-6 text-emerald-400" />
        </div>
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-zinc-100">Practice Complete</h1>
        <p className="mt-1 text-sm text-zinc-500">You solved {results.length} questions in one sprint.</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryStat label="Total questions" value={`${results.length}`} />
          <SummaryStat label="Avg AI response" value={`${(avg / 1000).toFixed(1)}s`} />
          <SummaryStat label="Fastest solution" value={`${(fastest / 1000).toFixed(1)}s`} />
          <SummaryStat label="Verified" value={`${verified}/${results.length}`} />
        </div>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={onRestart}
            className="rounded-md bg-emerald-500/90 px-4 py-2 text-sm font-medium text-emerald-950 transition-colors hover:bg-emerald-400"
          >
            Run another sprint
          </button>
          <Link
            to="/"
            className="rounded-md border border-line px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-raised"
          >
            Back to Solve
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function Sprint() {
  const { language } = useApp()
  const solver = useSolver(language)
  const [tab, setTab] = useState<'camera' | 'upload'>('camera')
  const [results, setResults] = useState<SprintResult[]>([])
  const recordedSolution = useRef<object | null>(null)

  const current = Math.min(results.length + 1, TOTAL)
  const finished = results.length >= TOTAL

  useEffect(() => {
    if (solver.phase === 'ready' && solver.solution && solver.solution !== recordedSolution.current) {
      recordedSolution.current = solver.solution
      setResults((prev) => [
        ...prev,
        {
          question: prev.length + 1,
          elapsedMs: solver.solution?.elapsed_ms ?? solver.elapsedMs,
          solution: solver.solution!,
          timestamp: Date.now(),
        },
      ])
    }
  }, [solver.phase, solver.solution, solver.elapsedMs])

  const handleNext = () => {
    solver.reset()
    recordedSolution.current = null
    setTab('camera')
  }

  const handleQuit = () => {
    solver.reset()
    recordedSolution.current = null
    setResults([])
  }

  if (finished) {
    return <Summary results={results} onRestart={handleQuit} />
  }

  const tabBtn = (id: 'camera' | 'upload', label: string) => (
    <button
      onClick={() => setTab(id)}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        tab === id ? 'bg-raised text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
      }`}
    >
      {id === 'camera' ? <CameraIcon className="h-4 w-4" /> : <UploadIcon className="h-4 w-4" />}
      {label}
    </button>
  )

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-10 pt-6">
      <SprintProgress
        current={current}
        total={TOTAL}
        results={results}
        phase={solver.phase}
        onNext={handleNext}
        onQuit={handleQuit}
      />

      <div className="mt-5 grid gap-5 lg:grid-cols-[400px_minmax(0,1fr)]">
        <div className="space-y-5">
          <section className="rounded-xl border border-line bg-surface p-4">
            <div className="mb-4 flex items-center gap-1 rounded-lg border border-line bg-bg/40 p-1">
              {tabBtn('camera', 'Camera')}
              {tabBtn('upload', 'Upload')}
            </div>
            {tab === 'camera' ? (
              <CameraCapture onCapture={solver.submit} />
            ) : (
              <ImageUploader onUpload={solver.submit} onError={() => {}} />
            )}
          </section>

          {(solver.phase === 'processing' || solver.phase === 'error') && (
            <ProcessingStatus
              phase={solver.phase}
              stage={solver.stage}
              elapsedMs={solver.elapsedMs}
              error={solver.error}
              onRetry={solver.retry}
              onUploadInstead={() => setTab('upload')}
            />
          )}
        </div>

        <div>
          {solver.phase === 'ready' && solver.solution ? (
            <SolutionPanel solution={solver.solution} />
          ) : solver.phase === 'idle' ? (
            <div className="flex h-full min-h-[320px] items-center justify-center rounded-xl border border-dashed border-line bg-surface/40 p-10 text-center text-sm text-zinc-500">
              Capture question {current} of {TOTAL} to begin.
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}
