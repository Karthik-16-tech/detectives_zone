import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { ShieldIcon, XIcon } from './icons'

interface Props {
  open: boolean
  onClose: () => void
}

export default function SettingsModal({ open, onClose }: Props) {
  const { apiBase, setApiBase } = useApp()
  const [value, setValue] = useState(apiBase)

  useEffect(() => {
    if (open) setValue(apiBase)
  }, [open, apiBase])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-line bg-surface p-5 shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-100">Settings</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-raised hover:text-zinc-200"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">Backend API URL</label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="http://localhost:8000"
              spellCheck={false}
              className="w-full rounded-md border border-line bg-bg px-3 py-2 font-mono text-sm text-zinc-200 outline-none transition-colors focus:border-emerald-500/60"
            />
            <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-500">
              Leave empty to use the Vite dev proxy, which forwards <span className="font-mono">/api</span> to{' '}
              <span className="font-mono">localhost:8000</span>.
            </p>
          </div>

          <div className="flex gap-3 rounded-md border border-line bg-raised/60 p-3">
            <ShieldIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <div className="text-[11px] leading-relaxed text-zinc-500">
              <p className="font-medium text-zinc-400">Security</p>
              <p>
                Your Gemini API key stays on the server (<span className="font-mono">backend/.env</span>) and is
                never sent to the browser. Generated code is only executed inside the optional sandbox when it is
                explicitly enabled.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-200"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setApiBase(value)
              onClose()
            }}
            className="rounded-md bg-emerald-500/90 px-3 py-1.5 text-sm font-medium text-emerald-950 transition-colors hover:bg-emerald-400"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
