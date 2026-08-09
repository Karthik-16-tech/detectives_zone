import { useCallback, useEffect, useRef, useState } from 'react'
import type { Language, Phase, Solution } from '../types/solution'
import { ApiError, solveImage } from '../services/api'

export const STAGES = [
  'Scanning question...',
  'Understanding problem...',
  'Generating solution...',
  'Verifying code...',
  'Solution ready',
] as const

/** Stage index -> auto-advance time (ms) while the request is in flight. */
const STAGE_SCHEDULE: Array<[number, number]> = [
  [1100, 1],
  [3000, 2],
  [5800, 3],
]

export interface Solver {
  phase: Phase
  stage: number
  elapsedMs: number
  solution: Solution | null
  error: ApiError | null
  submit: (blob: Blob) => void
  retry: () => void
  reset: () => void
}

export function useSolver(language: Language): Solver {
  const [phase, setPhase] = useState<Phase>('idle')
  const [stage, setStage] = useState(0)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [solution, setSolution] = useState<Solution | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const lastBlob = useRef<Blob | null>(null)
  const timers = useRef<number[]>([])

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t))
    },
    [],
  )

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }, [])

  const submit = useCallback(
    (blob: Blob) => {
      lastBlob.current = blob
      clearTimers()
      setSolution(null)
      setError(null)
      setStage(0)
      setPhase('processing')
      const started = performance.now()
      const tick = window.setInterval(() => setElapsedMs(Math.round(performance.now() - started)), 100)
      for (const [at, s] of STAGE_SCHEDULE) {
        timers.current.push(window.setTimeout(() => setStage((cur) => Math.max(cur, s)), at))
      }
      solveImage(blob, language)
        .then(async (res) => {
          window.clearInterval(tick)
          clearTimers()
          setStage(3)
          await new Promise((r) => setTimeout(r, 550))
          setSolution(res)
          setElapsedMs(Math.round(performance.now() - started))
          setStage(4)
          setPhase('ready')
        })
        .catch((err: unknown) => {
          window.clearInterval(tick)
          clearTimers()
          setError(err instanceof ApiError ? err : new ApiError('network', 'Unexpected error.'))
          setElapsedMs(Math.round(performance.now() - started))
          setPhase('error')
        })
    },
    [language, clearTimers],
  )

  const retry = useCallback(() => {
    if (lastBlob.current) submit(lastBlob.current)
  }, [submit])

  const reset = useCallback(() => {
    clearTimers()
    lastBlob.current = null
    setSolution(null)
    setError(null)
    setStage(0)
    setElapsedMs(0)
    setPhase('idle')
  }, [clearTimers])

  return { phase, stage, elapsedMs, solution, error, submit, retry, reset }
}
