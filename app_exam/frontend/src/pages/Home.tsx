import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import CameraCapture from '../components/CameraCapture'
import ImageUploader from '../components/ImageUploader'
import ProcessingStatus from '../components/ProcessingStatus'
import SolutionPanel from '../components/SolutionPanel'
import { CameraIcon, SparkIcon, UploadIcon } from '../components/icons'
import { useSolver } from '../hooks/useSolver'
import { useApp } from '../context/AppContext'

type Tab = 'camera' | 'upload'

function EmptyState() {
  return (
    <section className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-line bg-surface/40 p-10 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-md bg-emerald-500/10 ring-1 ring-emerald-500/20">
        <SparkIcon className="h-6 w-6 text-emerald-400" />
      </div>
      <h2 className="mt-4 text-base font-semibold text-zinc-100">Ready when you are</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">
        Capture or upload a coding question. CodeSnap AI reads the image, solves the problem and
        returns submission-ready code in the language you pick.
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[11px] text-zinc-500">
        <span className="rounded border border-line px-2 py-1">Camera</span>
        <span className="rounded border border-line px-2 py-1">JPG · PNG · WEBP</span>
        <span className="rounded border border-line px-2 py-1">C++17 · Python · Java · JavaScript</span>
      </div>
    </section>
  )
}

export default function Home() {
  const { language } = useApp()
  const solver = useSolver(language)
  const [tab, setTab] = useState<Tab>('camera')
  const [notice, setNotice] = useState<string | null>(null)

  const handleImage = useCallback(
    (blob: Blob) => {
      setNotice(null)
      solver.submit(blob)
    },
    [solver.submit],
  )

  const tabBtn = (id: Tab, label: string) => (
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
      <div className="grid gap-5 lg:grid-cols-[400px_minmax(0,1fr)]">
        <div className="space-y-5">
          <section className="rounded-xl border border-line bg-surface p-4">
            <div className="mb-4 flex items-center gap-1 rounded-lg border border-line bg-bg/40 p-1">
              {tabBtn('camera', 'Camera')}
              {tabBtn('upload', 'Upload')}
            </div>
            {tab === 'camera' ? (
              <CameraCapture onCapture={handleImage} />
            ) : (
              <ImageUploader onUpload={handleImage} onError={setNotice} />
            )}
          </section>

          {notice && (
            <div className="animate-fade-up rounded-lg border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-200">
              {notice}
            </div>
          )}

          <Link
            to="/sprint"
            className="group block rounded-xl border border-line bg-surface p-4 transition-colors hover:border-emerald-500/40"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-zinc-100">15 Question Sprint</div>
              <span className="text-xs text-emerald-400 transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Practice mode with live timing — average, fastest and total response stats.
            </p>
          </Link>
        </div>

        <div className="space-y-5">
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
          {solver.phase === 'ready' && solver.solution ? (
            <SolutionPanel solution={solver.solution} />
          ) : (
            solver.phase === 'idle' && <EmptyState />
          )}
        </div>
      </div>
    </main>
  )
}
