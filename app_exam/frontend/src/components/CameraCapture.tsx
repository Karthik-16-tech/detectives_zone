import { useCallback, useEffect, useRef, useState } from 'react'
import { compressImage } from '../services/image'
import { CameraIcon } from './icons'

type Status = 'idle' | 'requesting' | 'live' | 'captured' | 'unavailable'

interface Props {
  onCapture: (blob: Blob) => void
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
}

export default function CameraCapture({ onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [preview, setPreview] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }, [])

  useEffect(() => {
    return () => {
      stopStream()
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [stopStream, preview])

  const start = useCallback(async () => {
    setBusy(false)
    if (preview) {
      URL.revokeObjectURL(preview)
      setPreview(null)
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('unavailable')
      return
    }
    stopStream()
    setStatus('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      })
      streamRef.current = stream
      setStatus('live')
      const video = videoRef.current
      if (video) {
        video.srcObject = stream
        await video.play().catch(() => {})
      }
    } catch {
      stopStream()
      setStatus('unavailable')
    }
  }, [preview, stopStream])

  const capture = useCallback(async () => {
    const video = videoRef.current
    if (!video || !video.videoWidth || status !== 'live') return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0)
    stopStream()
    setBusy(true)
    try {
      const raw = await canvasToBlob(canvas, 'image/jpeg', 0.92)
      if (!raw) throw new Error('capture failed')
      const blob = await compressImage(raw)
      const url = URL.createObjectURL(blob)
      if (preview) URL.revokeObjectURL(preview)
      setPreview(url)
      setStatus('captured')
      onCapture(blob)
    } catch {
      setStatus('unavailable')
    } finally {
      setBusy(false)
    }
  }, [onCapture, preview, status, stopStream])

  const retake = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview)
      setPreview(null)
    }
    setStatus('idle')
  }, [preview])

  if (status === 'unavailable') {
    return (
      <div className="py-6 text-center">
        <div className="mx-auto grid h-11 w-11 place-items-center rounded-md bg-red-500/10 ring-1 ring-red-500/30">
          <CameraIcon className="h-5 w-5 text-red-400" />
        </div>
        <p className="mt-3 text-sm font-medium text-zinc-200">Camera unavailable</p>
        <p className="mt-1 text-xs leading-relaxed text-zinc-500">
          Camera permission was denied or no camera was found. Upload an image instead.
        </p>
      </div>
    )
  }

  if (status === 'live') {
    return (
      <div>
        <div className="overflow-hidden rounded-lg border border-line bg-black">
          <video
            ref={videoRef}
            playsInline
            muted
            className="h-56 w-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
        </div>
        <div className="mt-3 flex items-center justify-center gap-3">
          <button
            onClick={capture}
            disabled={busy}
            className="flex items-center gap-2 rounded-md bg-emerald-500/90 px-5 py-2.5 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 disabled:opacity-60"
          >
            <CameraIcon className="h-4 w-4" />
            Capture
          </button>
          <button
            onClick={retake}
            className="rounded-md border border-line px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-raised"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  if (status === 'captured') {
    return (
      <div>
        <div className="overflow-hidden rounded-lg border border-line bg-black/50">
          {preview && (
            <img src={preview} alt="Captured question" className="max-h-56 w-full object-contain" />
          )}
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Processing this photo
          </span>
          <button
            onClick={retake}
            className="rounded-md border border-line px-3.5 py-2 text-xs text-zinc-300 transition-colors hover:bg-raised"
          >
            Retake
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={start}
        disabled={status === 'requesting'}
        className="group flex w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-line-strong bg-bg/40 py-8 transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/5 disabled:opacity-60"
      >
        <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30 transition-transform group-hover:scale-105">
          <CameraIcon className="h-6 w-6 text-emerald-400" />
        </span>
        <span className="text-sm font-semibold text-zinc-100">
          {status === 'requesting' ? 'Requesting camera…' : 'Take Photo'}
        </span>
        <span className="text-[11px] text-zinc-500">Capture a coding question from your screen or paper</span>
      </button>
    </div>
  )
}
