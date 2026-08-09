export function DetectiveBadge() {
  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5" aria-hidden="true">
      <svg viewBox="0 0 64 72" className="h-14 w-12 text-accent/55 sm:h-16 sm:w-14">
        <path
          d="M32 2 L60 12 V38 C60 54 46 64 32 70 C18 64 4 54 4 38 V12 Z"
          fill="currentColor"
          fillOpacity="0.07"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <g fill="currentColor" fillOpacity="0.75">
          <ellipse cx="32" cy="24" rx="14" ry="4" />
          <path d="M22 24 c0-7 4-11 10-11 s10 4 10 11 z" />
          <path d="M16 58 c2-11 8-16 16-16 s14 5 16 16 z" />
        </g>
        <path d="M32 42 l4 8 -4 8 -4-8 z" fill="var(--card)" />
      </svg>
      <span className="font-mono text-[0.55rem] tracking-[0.22em] text-accent/70">
        — DETECTIVE —
      </span>
    </div>
  );
}
