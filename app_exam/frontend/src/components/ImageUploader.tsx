import { useRef, useState } from 'react'
import { compressImage, validateImage } from '../services/image'
import { UploadIcon } from './icons'

interface Props {
  onUpload: (blob: Blob) => void
  onError: (message: string) => void
}

export default function ImageUploader({ onUpload, onError }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const handleFile = async (file?: File | null) => {
    if (!file) return
    const problem = validateImage(file)
    if (problem) {
      onError(problem)
      return
    }
    setBusy(true)
    try {
      const blob = await compressImage(file)
      if (preview) URL.revokeObjectURL(preview)
      setPreview(URL.createObjectURL(blob))
      onUpload(blob)
    } catch {
      onError('Could not process that image. Try a different one.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDrag(true)
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDrag(false)
          void handleFile(e.dataTransfer.files?.[0])
        }}
        className={`group flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-8 transition-colors ${
          drag
            ? 'border-emerald-500/70 bg-emerald-500/5'
            : 'border-line-strong bg-bg/40 hover:border-emerald-500/50 hover:bg-emerald-500/5'
        }`}
      >
        <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30 transition-transform group-hover:scale-105">
          <UploadIcon className="h-6 w-6 text-emerald-400" />
        </span>
        <span className="text-sm font-semibold text-zinc-100">
          {busy ? 'Processing image…' : drag ? 'Drop to upload' : 'Upload an image'}
        </span>
        <span className="text-[11px] text-zinc-500">JPG · JPEG · PNG · WEBP — click or drag &amp; drop</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={(e) => {
          void handleFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />
      {preview && (
        <img
          src={preview}
          alt="Uploaded question"
          className="mt-3 max-h-56 w-full rounded-lg border border-line bg-black/50 object-contain"
        />
      )}
    </div>
  )
}
