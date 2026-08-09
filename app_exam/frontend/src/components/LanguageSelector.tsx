import { useApp } from '../context/AppContext'
import { LANGUAGES, LANGUAGE_LABELS } from '../types/solution'

export default function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useApp()
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Output language</span>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as (typeof LANGUAGES)[number])}
        className={`appearance-none rounded-md border border-line bg-raised pr-8 font-medium text-zinc-200 outline-none transition-colors hover:border-line-strong focus:border-emerald-500/60 ${
          compact ? 'py-1.5 pl-2.5 text-xs' : 'py-2 pl-3 text-sm'
        }`}
      >
        {LANGUAGES.map((l) => (
          <option key={l} value={l}>
            {LANGUAGE_LABELS[l]}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2.5 h-3 w-3 text-zinc-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </label>
  )
}
