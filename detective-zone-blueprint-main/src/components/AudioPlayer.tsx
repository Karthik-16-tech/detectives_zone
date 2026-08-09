import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

interface AudioPlayerProps {
  /** Total duration in seconds */
  duration?: number;
  label?: string;
  compact?: boolean;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function AudioPlayer({ duration = 105, label = "Case audio preview", compact = false }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const rafRef = useRef<number | null>(null);

  const barsCount = compact ? 36 : 72;

  const bars = useMemo(
    () =>
      Array.from({ length: barsCount }, (_, i) => {
        const wave =
          Math.sin(i * 0.7) * 0.32 + Math.sin(i * 1.9) * 0.22 + Math.sin(i * 0.23) * 0.28;
        const env = Math.sin((i / barsCount) * Math.PI);
        return 0.18 + Math.abs(wave) * env + (i % 7 === 0 ? 0.22 * env : 0);
      }),
    [barsCount],
  );

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const tick = (now: number) => {
      const delta = (now - last) / 1000;
      last = now;
      setElapsed((prev) => {
        const next = prev + delta;
        if (next >= duration) {
          setPlaying(false);
          return duration;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, duration]);

  const progress = elapsed / duration;

  if (compact) {
    return (
      <div className="rounded-lg border border-border/70 bg-surface/80 px-2.5 py-2">


        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (elapsed >= duration) setElapsed(0);
              setPlaying((p) => !p);
            }}
            aria-label={playing ? "Pause preview" : "Play preview"}
            className="flex size-7 shrink-0 items-center justify-center rounded-full border border-accent/60 text-accent transition-colors duration-300 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 cursor-pointer"
          >
            {playing ? <Pause className="size-3 fill-current" /> : <Play className="ml-0.5 size-3 fill-current" />}
          </button>

          <div className="flex h-6 min-w-0 flex-1 items-center gap-[1px]" role="img" aria-label={label}>
            {bars.map((h, i) => {
              const active = i / bars.length <= progress;
              return (
                <span
                  key={i}
                  className={
                    "flex-1 rounded-full transition-colors duration-200 " +
                    (active ? "bg-stamp" : "bg-stamp/35")
                  }
                  style={{ height: `${(Math.min(h, 1) * 100).toFixed(1)}%` }}
                />
              );
            })}
          </div>

          <span className="shrink-0 font-typewriter text-[0.62rem] tabular-nums tracking-[0.04em] text-muted-foreground">
            {formatTime(elapsed)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/70 bg-surface/80 px-4 py-3.5">
      <p className="mb-3 flex items-center gap-2 font-typewriter text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground [text-shadow:0_1px_2px_oklch(0_0_0/0.8)]">
        <span className="size-1.5 rounded-full bg-stamp shadow-[0_0_8px_oklch(0.52_0.16_27/0.9)]" aria-hidden="true" />
        Case audio preview
      </p>

      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={() => {
            if (elapsed >= duration) setElapsed(0);
            setPlaying((p) => !p);
          }}
          aria-label={playing ? "Pause preview" : "Play preview"}
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-accent/60 text-accent transition-colors duration-300 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 cursor-pointer"
        >
          {playing ? <Pause className="size-4 fill-current" /> : <Play className="ml-0.5 size-4 fill-current" />}
        </button>

        <div className="flex h-9 min-w-0 flex-1 items-center gap-[1.5px]" role="img" aria-label={label}>
          {bars.map((h, i) => {
            const active = i / bars.length <= progress;
            return (
              <span
                key={i}
                className={
                  "flex-1 rounded-full transition-colors duration-200 " +
                  (active ? "bg-stamp" : "bg-stamp/35")
                }
                style={{ height: `${(Math.min(h, 1) * 100).toFixed(1)}%` }}
              />
            );
          })}
        </div>

        <span className="shrink-0 font-typewriter text-[0.75rem] tabular-nums tracking-[0.06em] text-muted-foreground">
          {formatTime(elapsed)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
