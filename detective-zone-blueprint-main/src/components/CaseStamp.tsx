import { useId } from "react";

/**
 * A realistically distressed rubber "CONFIDENTIAL / CASE FILE" ink stamp.
 */
export function CaseStamp({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const roughId = `rough-${id}`;
  const maskId = `mask-${id}`;
  const grainId = `grain-${id}`;

  return (
    <div
      aria-hidden="true"
      className={"pointer-events-none select-none " + className}
      style={{ transform: "rotate(-9deg)" }}
    >
      <svg
        viewBox="0 0 140 140"
        className="size-[118px] text-stamp sm:size-[134px]"
        style={{ filter: "drop-shadow(0 2px 6px oklch(0 0 0 / 0.55))" }}
      >
        <defs>
          <filter id={roughId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={3} seed={7} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={1.2} xChannelSelector="R" yChannelSelector="G" />
          </filter>

          <filter id={grainId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves={4} seed={19} />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1
                      0 0 0 0 1
                      0 0 0 0 1
                      1.4 0 0 0 -0.15"
            />
          </filter>
          <mask id={maskId}>
            <rect width="140" height="140" fill="white" />
            <rect width="140" height="140" filter={`url(#${grainId})`} opacity="0.5" />
          </mask>

          <path id={`top-${id}`} d="M 70,70 m -48,0 a 48,48 0 1,1 100,0" fill="none" />
          <path id={`bot-${id}`} d="M 70,70 m -47,0 a 47,47 0 1,0 94,0" fill="none" />
        </defs>

        <g mask={`url(#${maskId})`} filter={`url(#${roughId})`} fill="none" stroke="currentColor" opacity="0.88">
          <circle cx="70" cy="70" r="58" strokeWidth="3.5" />
          <circle cx="70" cy="70" r="49" strokeWidth="1.6" />

          <g fill="currentColor" stroke="none" className="font-mono">
            <text style={{ fontSize: 14, letterSpacing: "3px", fontWeight: 700 }}>
              <textPath href={`#top-${id}`} startOffset="50%" textAnchor="middle">
                CONFIDENTIAL
              </textPath>
            </text>
            <text style={{ fontSize: 14, letterSpacing: "3px", fontWeight: 700 }}>
              <textPath href={`#bot-${id}`} startOffset="50%" textAnchor="middle">
                CASE FILE
              </textPath>
            </text>
            <circle cx="17" cy="70" r="2.6" />
            <circle cx="123" cy="70" r="2.6" />
          </g>

          <circle cx="66" cy="65" r="17" strokeWidth="3.2" />
          <line x1="78" y1="78" x2="92" y2="92" strokeWidth="5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
