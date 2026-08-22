import { useEffect, useState } from "react";

/**
 * PORTABLE detective "buffering ring" preloader.
 * Self-contained: no Tailwind config, no CSS file, no dependencies.
 * Copy this ONE file into any React project and use:
 *
 *   const [loading, setLoading] = useState(true);
 *   {loading && <DetectivePreloader onDone={() => setLoading(false)} />}
 */

const SEARCH_MS = 650;
const SOLVED_MS = 250;

const NOIR = "#141210";
const CREAM = "#f2e9d8";
const CLUE = "#b03a2e";
const GOLD = "#d9b45b";

const CSS = `
@keyframes dp-ring-spin { to { transform: rotate(360deg); } }
@keyframes dp-ring-dash {
  0% { stroke-dasharray: 12 252; }
  50% { stroke-dasharray: 150 114; }
  100% { stroke-dasharray: 12 252; }
}
@keyframes dp-ticks-spin { to { transform: rotate(-360deg); } }
@keyframes dp-glass-pulse {
  0%,100% { opacity: .75; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.08); }
}
@keyframes dp-glass-pop {
  0% { transform: scale(1); }
  100% { transform: scale(1.25); opacity: 1; }
}
@keyframes dp-blink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }
@keyframes dp-exit {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.06); }
}
.dp-arc {
  transform-origin: 50% 50%;
  stroke-dasharray: 80 184;
  animation: dp-ring-spin 1.1s linear infinite, dp-ring-dash 1.8s ease-in-out infinite;
  will-change: transform;
}
.dp-arc-solved {
  animation: none; stroke-dasharray: 264; stroke-dashoffset: 0;
  filter: drop-shadow(0 0 5px ${CLUE});
}
.dp-ticks { animation: dp-ticks-spin 14s linear infinite; will-change: transform; }
.dp-glass { animation: dp-glass-pulse 1.8s ease-in-out infinite; }
.dp-glass-pop { animation: dp-glass-pop .5s ease-out forwards; }
.dp-cursor { animation: dp-blink .9s steps(1) infinite; }
.dp-exit { animation: dp-exit .7s ease-in .25s forwards; }
@media (prefers-reduced-motion: reduce) {
  .dp-arc, .dp-ticks, .dp-glass, .dp-glass-pop, .dp-cursor, .dp-exit { animation: none; }
}
`;

export function DetectivePreloader({
  onDone,
  searchMs,
  solvedMs,
}: {
  onDone?: () => void;
  searchMs?: number;
  solvedMs?: number;
}) {
  const [solved, setSolved] = useState(false);
  const [gone, setGone] = useState(false);

  const SEARCH = searchMs ?? SEARCH_MS;
  const SOLVED = solvedMs ?? SOLVED_MS;

  useEffect(() => {
    const t1 = setTimeout(() => setSolved(true), SEARCH);
    const t2 = setTimeout(() => {
      setGone(true);
      onDone?.();
    }, SEARCH + SOLVED);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone, SEARCH, SOLVED]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (gone) return null;

  return (
    <div
      className={solved ? "dp-exit" : undefined}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: NOIR,
      }}
    >
      <style>{CSS}</style>

      <div style={{ position: "relative", height: 112, width: 112 }}>
        {/* track + buffering arc */}
        <svg
          viewBox="0 0 100 100"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            transform: "rotate(-90deg)",
          }}
        >
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={CREAM}
            strokeOpacity="0.12"
            strokeWidth="1.5"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={CLUE}
            strokeWidth="1.5"
            strokeLinecap="round"
            className={solved ? "dp-arc dp-arc-solved" : "dp-arc"}
          />
        </svg>

        {/* slow counter-rotating gold tick dial */}
        <svg
          viewBox="0 0 100 100"
          className="dp-ticks"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="6"
              x2="50"
              y2="10"
              stroke={GOLD}
              strokeOpacity={i % 6 === 0 ? 0.55 : 0.18}
              strokeWidth="1"
              transform={`rotate(${i * 15} 50 50)`}
            />
          ))}
        </svg>

        {/* centered magnifying glass */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={CREAM}
          strokeWidth="1.5"
          strokeLinecap="round"
          className={solved ? "dp-glass-pop" : "dp-glass"}
          style={{ position: "absolute", inset: 0, margin: "auto", height: 32, width: 32 }}
        >
          <circle cx="10.5" cy="10.5" r="6.5" />
          <line x1="15.5" y1="15.5" x2="21" y2="21" />
        </svg>
      </div>

      <p
        style={{
          marginTop: 28,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: "0.7rem",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: CREAM,
          opacity: 0.8,
        }}
      >
        {solved ? "Case Solved" : "Investigating"}
        <span
          className="dp-cursor"
          style={{
            display: "inline-block",
            marginLeft: 6,
            width: 2,
            height: 12,
            verticalAlign: "middle",
            background: CLUE,
          }}
        />
      </p>
    </div>
  );
}
