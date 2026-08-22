import { useEffect, useRef } from "react";

function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

type MouseScrubVideoProps = {
  src: string;
  className?: string;
};

/**
 * Cinematic background video that AUTOPLAYS on load.
 *
 * Moving the mouse horizontally over the hero scrubs the film:
 * - Right edge => start of the film (currentTime = 0)
 * - Left  edge => end of the film  (currentTime = duration)
 *
 * currentTime is lerped toward the target each frame for buttery
 * inertial motion. When the pointer leaves the hero, normal
 * playback resumes.
 */
export function MouseScrubVideo({ src, className }: MouseScrubVideoProps) {
  const videoRef    = useRef<HTMLVideoElement | null>(null);
  const wrapperRef  = useRef<HTMLDivElement   | null>(null);
  const trackRef    = useRef<HTMLDivElement   | null>(null);
  const timeRef     = useRef<HTMLSpanElement  | null>(null);
  const durationRef = useRef<HTMLSpanElement  | null>(null);
  const rafRef      = useRef<number | null>(null);
  const targetTime  = useRef(0);

  useEffect(() => {
    const video   = videoRef.current;
    const wrapper = wrapperRef.current;
    if (!video || !wrapper) return;

    let scrubbing = false;

    const applyTime = (t: number) => {
      try { video.currentTime = t; } catch { /* not seekable yet */ }
    };

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);

      const d = video.duration;
      if (!Number.isFinite(d) || d <= 0) return;

      if (scrubbing) {
        const next = video.currentTime + (targetTime.current - video.currentTime) * 0.08;
        if (Math.abs(next - video.currentTime) > 0.0005) applyTime(next);
      }

      // Update scrub UI directly on DOM — zero React re-renders
      const t = video.currentTime;
      if (timeRef.current) timeRef.current.textContent = formatTime(t);
      if (durationRef.current && durationRef.current.textContent === "00:00") {
        durationRef.current.textContent = formatTime(d);
      }
      if (trackRef.current) {
        trackRef.current.style.setProperty("--p", `${Math.min(100, (t / d) * 100)}%`);
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top  &&
        e.clientY <= rect.bottom;

      if (!inside) {
        if (scrubbing) {
          scrubbing = false;
          video.play().catch(() => {});
        }
        return;
      }

      if (!scrubbing) {
        scrubbing = true;
        video.pause();
      }

      // Right = 0% (start), Left = 100% (end)
      const progress = 1 - (e.clientX - rect.left) / rect.width;
      targetTime.current = Math.max(0, Math.min(1, progress)) * (video.duration || 0);
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else {
        if (rafRef.current === null) rafRef.current = requestAnimationFrame(loop);
        if (!scrubbing) video.play().catch(() => {});
      }
    };

    // Autoplay on load
    video.play().catch(() => {});

    rafRef.current = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`relative overflow-hidden ${className ?? ""}`}>
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        autoPlay
        loop
        preload="auto"
        className="h-full w-full object-cover"
      />

      {/* Scrub timeline readout */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 w-[min(400px,78vw)] -translate-x-1/2">
        <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.22em] text-white/60 uppercase">
          <span ref={timeRef}>00:00</span>
          <span className="hidden text-white/35 sm:inline">Move cursor · scrub scene</span>
          <span ref={durationRef}>00:00</span>
        </div>
        <div className="mt-2 h-px w-full bg-white/15">
          <div
            ref={trackRef}
            className="h-full bg-gradient-to-r from-blood to-white/70"
            style={{
              width: "var(--p, 0%)",
              boxShadow: "0 0 12px rgba(179,18,23,0.8)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
