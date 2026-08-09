import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import LanguageSelector from './components/LanguageSelector'
import ConnectionStatus from './components/ConnectionStatus'
import SettingsModal from './components/SettingsModal'
import { BoltIcon, GearIcon } from './components/icons'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive ? 'bg-raised text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
  }`

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-4">
          <NavLink to="/" className="flex shrink-0 items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-emerald-500/15 ring-1 ring-emerald-500/30">
              <BoltIcon className="h-4 w-4 text-emerald-400" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold tracking-tight text-zinc-100">CodeSnap AI</span>
              <span className="hidden text-[11px] text-zinc-500 sm:block">Photo → Solution in Seconds</span>
            </span>
          </NavLink>

          <nav className="ml-2 hidden items-center gap-1 sm:flex">
            <NavLink to="/" end className={navClass}>
              Solve
            </NavLink>
            <NavLink to="/sprint" className={navClass}>
              15 Question Sprint
            </NavLink>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <LanguageSelector compact />
            <button
              onClick={() => setSettingsOpen(true)}
              className="grid h-8 w-8 place-items-center rounded-md border border-line text-zinc-400 transition-colors hover:bg-raised hover:text-zinc-200"
              title="Settings"
            >
              <GearIcon className="h-4 w-4" />
            </button>
            <ConnectionStatus />
          </div>
        </div>
      </header>

      <div className="flex-1">
        <Outlet />
      </div>

      <footer className="border-t border-line py-4">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 text-center text-[11px] text-zinc-600">
          <p>CodeSnap AI — Gemini-powered photo-to-code assistant. Review generated code before submitting.</p>
          <p>Typical solve time is under 15 seconds when service and network latency allow.</p>
        </div>
      </footer>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
