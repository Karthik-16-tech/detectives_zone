export type Language = 'C++' | 'Python' | 'Java' | 'JavaScript'

export const LANGUAGES: Language[] = ['C++', 'Python', 'Java', 'JavaScript']

export const LANGUAGE_LABELS: Record<Language, string> = {
  'C++': 'C++17',
  Python: 'Python 3',
  Java: 'Java 21',
  JavaScript: 'JavaScript',
}

export interface SampleCase {
  input: string
  output: string
  actual?: string
  passed?: boolean
}

export interface VerificationResult {
  executed: boolean
  passed: boolean
  message: string
  samples: SampleCase[]
}

export type SolutionStatus = 'ready' | 'unclear' | 'error'

export interface Solution {
  status: SolutionStatus
  problem: string
  language: string
  algorithm: string
  code: string
  time_complexity: string
  space_complexity: string
  confidence: number
  error?: string
  samples?: SampleCase[]
  verification?: VerificationResult
  elapsed_ms?: number
}

export type Phase = 'idle' | 'processing' | 'ready' | 'error'

export interface SprintResult {
  question: number
  elapsedMs: number
  solution: Solution
  timestamp: number
}
