import { useApp } from '../context/AppContext'

const MAP = {
  checking: { label: 'Checking', color: 'bg-zinc-400' },
  online: { label: 'Connected', color: 'bg-emerald-400' },
  offline: { label: 'Offline', color: 'bg-red-400' },
} as const

export default function ConnectionStatus() {
  const { connection } = useApp()
  const s = MAP[connection]
  return (
    <div
      className="hidden items-center gap-1.5 rounded-md border border-line bg-raised px-2.5 py-1.5 text-xs text-zinc-400 sm:flex"
      title={connection === 'online' ? 'Backend reachable' : 'Backend not reachable'}
    >
      <span className={`relative flex h-2 w-2 ${connection === 'online' ? 'animate-pulse' : ''}`}>
        {connection === 'online' && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${s.color} opacity-50`} />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${s.color}`} />
      </span>
      <span>{s.label}</span>
    </div>
  )
}
