import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export function CameraIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.3l1.1-2.2a1 1 0 0 1 .9-.6h6.4a1 1 0 0 1 .9.6L17.2 6h1.3A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-8Z" />
      <circle cx="12" cy="12.2" r="3.4" />
    </svg>
  )
}

export function UploadIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M12 16V4m0 0-4 4m4-4 4 4" />
      <path d="M4 17v1.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V17" />
    </svg>
  )
}

export function CopyIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5.5A2.5 2.5 0 0 1 7.5 3H15" />
    </svg>
  )
}

export function CheckIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  )
}

export function XIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="m5 5 14 14M19 5 5 19" />
    </svg>
  )
}

export function ExpandIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6" />
    </svg>
  )
}

export function BoltIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  )
}

export function GearIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
    </svg>
  )
}

export function AlertIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 2.5 20h19L12 3Z" />
      <path d="M12 10v4M12 17.5v.5" />
    </svg>
  )
}

export function SparkIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l2.8 2.8M16.2 16.2 19 19M19 5l-2.8 2.8M7.8 16.2 5 19" />
    </svg>
  )
}

export function ShieldIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 20 6v5c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
