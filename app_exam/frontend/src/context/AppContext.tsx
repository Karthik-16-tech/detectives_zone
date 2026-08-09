import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Language } from '../types/solution'
import { fetchHealth, getApiBase, setApiBase as persistApiBase } from '../services/api'

type Connection = 'checking' | 'online' | 'offline'

interface AppContextValue {
  language: Language
  setLanguage: (l: Language) => void
  apiBase: string
  setApiBase: (url: string) => void
  connection: Connection
  refreshConnection: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

const LANG_KEY = 'codesnap.language'

const LANGUAGES: Language[] = ['C++', 'Python', 'Java', 'JavaScript']

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY) as Language | null
      return saved && LANGUAGES.includes(saved) ? saved : 'C++'
    } catch {
      return 'C++'
    }
  })
  const [apiBase, setApiBaseState] = useState<string>(() => getApiBase())
  const [connection, setConnection] = useState<Connection>('checking')

  const refreshConnection = useCallback(async () => {
    try {
      await fetchHealth()
      setConnection('online')
    } catch {
      setConnection('offline')
    }
  }, [])

  useEffect(() => {
    refreshConnection()
    const id = window.setInterval(refreshConnection, 15_000)
    return () => window.clearInterval(id)
  }, [refreshConnection])

  const setLanguage = useCallback((l: Language) => {
    setLanguageState(l)
    try {
      localStorage.setItem(LANG_KEY, l)
    } catch {
      /* ignore */
    }
  }, [])

  const setApiBase = useCallback((url: string) => {
    persistApiBase(url)
    setApiBaseState(url)
    void refreshConnection()
  }, [refreshConnection])

  const value = useMemo(
    () => ({ language, setLanguage, apiBase, setApiBase, connection, refreshConnection }),
    [language, setLanguage, apiBase, setApiBase, connection, refreshConnection],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
