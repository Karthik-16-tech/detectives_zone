export function PaperClip({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 110"
      aria-hidden="true"
      className={"drop-shadow-[0_3px_6px_oklch(0_0_0/0.7)] " + className}
    >
      <defs>
        <linearGradient id="clipMetal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.55 0.005 80)" />
          <stop offset="40%" stopColor="oklch(0.92 0.004 80)" />
          <stop offset="70%" stopColor="oklch(0.7 0.005 80)" />
          <stop offset="100%" stopColor="oklch(0.45 0.005 80)" />
        </linearGradient>
      </defs>
      <path
        d="M12 96 V22 a10 10 0 0 1 20 0 V88 a16 16 0 0 1 -32 0 V26"
        fill="none"
        stroke="url(#clipMetal)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
