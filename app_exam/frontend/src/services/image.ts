/**
 * Client-side image preparation for the solver pipeline.
 * Large photos are resized and compressed while keeping the text readable,
 * so uploads stay small and the model responds faster.
 */

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024
export const MAX_DIMENSION = 1600
export const OUTPUT_QUALITY = 0.86
export const TARGET_SIZE = 2.4 * 1024 * 1024

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp']
const EXT_RE = /\.(jpe?g|png|webp)$/i

export function isSupportedImage(file: { type?: string; name?: string }): boolean {
  if (file.type && ALLOWED_MIME.includes(file.type)) return true
  if (file.name) return EXT_RE.test(file.name)
  return false
}

export function validateImage(file: { type?: string; name?: string; size?: number }): string | null {
  if (!isSupportedImage(file)) {
    return 'Unsupported file type. Use JPG, JPEG, PNG or WEBP.'
  }
  if (file.size && file.size > MAX_IMAGE_BYTES) {
    return 'Image is too large (max 8 MB).'
  }
  return null
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not decode the image.'))
    img.src = url
  })
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
}

export async function compressImage(
  input: Blob,
  maxDim = MAX_DIMENSION,
  quality = OUTPUT_QUALITY,
): Promise<Blob> {
  const url = URL.createObjectURL(input)
  let img: HTMLImageElement
  try {
    img = await loadImage(url)
  } finally {
    URL.revokeObjectURL(url)
  }

  const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight))
  const width = Math.max(1, Math.round(img.naturalWidth * scale))
  const height = Math.max(1, Math.round(img.naturalHeight * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is not available.')

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, width, height)

  let blob = await canvasToBlob(canvas, 'image/webp', quality)
  if (!blob || blob.size > TARGET_SIZE) {
    blob = await canvasToBlob(canvas, 'image/jpeg', quality)
  }
  if (!blob) throw new Error('Could not compress the image.')
  if (blob.size > TARGET_SIZE && quality > 0.62) {
    const smaller = await canvasToBlob(canvas, 'image/jpeg', quality - 0.12)
    if (smaller && smaller.size < blob.size) blob = smaller
  }
  return blob
}
