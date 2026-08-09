import { useRef, useState } from 'react'
import Editor, { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

;(globalThis as unknown as { MonacoEnvironment?: unknown }).MonacoEnvironment = {
  getWorker: () => new editorWorker(),
}
loader.config({ monaco })

monaco.editor.defineTheme('codesnap-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '5f7087', fontStyle: 'italic' },
    { token: 'keyword', foreground: '34d399' },
    { token: 'string', foreground: '7dd3fc' },
    { token: 'number', foreground: 'fbbf24' },
    { token: 'type', foreground: '67e8f9' },
    { token: 'function', foreground: '93c5fd' },
    { token: 'identifier', foreground: 'e4e4e7' },
    { token: 'operator', foreground: 'cbd5e1' },
    { token: 'delimiter', foreground: '94a3b8' },
  ],
  colors: {
    'editor.background': '#0f141c',
    'editor.foreground': '#d4d4d8',
    'editorLineNumber.foreground': '#3b4658',
    'editorLineNumber.activeForeground': '#8b93a7',
    'editor.selectionBackground': '#1f6f54',
    'editor.inactiveSelectionBackground': '#1f6f5455',
    'editorCursor.foreground': '#34d399',
    'editor.lineHighlightBackground': '#131a24',
    'editorIndentGuide.background1': '#1c2332',
    'editorIndentGuide.activeBackground1': '#2a3547',
    'editorWidget.background': '#0f141c',
    'editorWidget.border': '#1e2633',
    'editorGutter.background': '#0f141c',
    'editorSuggestWidget.background': '#0f141c',
    'editorSuggestWidget.border': '#1e2633',
    'scrollbarSlider.background': '#2a35475a',
    'scrollbarSlider.hoverBackground': '#2a354788',
    'scrollbarSlider.activeBackground': '#2a3547aa',
    'minimap.background': '#0f141c',
  },
})

const LANG_MAP: Record<string, string> = {
  'C++': 'cpp',
  Python: 'python',
  Java: 'java',
  JavaScript: 'javascript',
}

const OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = {
  fontSize: 13,
  minimap: { enabled: false },
  lineNumbers: 'on',
  wordWrap: 'on',
  scrollBeyondLastLine: false,
  tabSize: 4,
  automaticLayout: true,
  renderLineHighlight: 'gutter',
  padding: { top: 12, bottom: 12 },
  scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
  fixedOverflowWidgets: true,
  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
  readOnly: true,
}

export default function CodeEditor({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable */
    }
  }

  const onMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor
  }

  const toolbar = (
    <div className="flex items-center justify-between gap-2 border-b border-line bg-raised/70 px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-line-strong" />
        <span className="font-mono text-xs text-zinc-400">{LANG_MAP[language] ?? 'text'}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md border border-line px-2 py-1 text-xs text-zinc-300 transition-colors hover:bg-raised hover:text-zinc-100"
        >
          {copied ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-emerald-400">
                <path d="m4.5 12.5 5 5 10-11" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                <rect x="9" y="9" width="11" height="11" rx="2" />
                <path d="M5 15V5.5A2.5 2.5 0 0 1 7.5 3H15" />
              </svg>
              Copy
            </>
          )}
        </button>
        <button
          onClick={() => setFullscreen((f) => !f)}
          className="flex items-center gap-1.5 rounded-md border border-line px-2 py-1 text-xs text-zinc-300 transition-colors hover:bg-raised hover:text-zinc-100"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
            {fullscreen ? <path d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6" /> : <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />}
          </svg>
          {fullscreen ? 'Exit' : 'Fullscreen'}
        </button>
      </div>
    </div>
  )

  const editorPane = (
    <div className={fullscreen ? 'h-full' : 'h-[420px]'}>
      <Editor
        height="100%"
        language={LANG_MAP[language] ?? 'plaintext'}
        value={code}
        theme="codesnap-dark"
        options={OPTIONS}
        onMount={onMount}
        loading={<div className="flex h-full items-center justify-center text-sm text-zinc-500">Loading editor…</div>}
      />
    </div>
  )

  if (fullscreen) {
    return (
      <div className="animate-fade-up fixed inset-0 z-40 flex flex-col bg-bg">
        {toolbar}
        <div className="min-h-0 flex-1">{editorPane}</div>
      </div>
    )
  }

  return (
    <div className="animate-fade-up overflow-hidden rounded-xl border border-line bg-raised/40">
      {toolbar}
      {editorPane}
    </div>
  )
}
