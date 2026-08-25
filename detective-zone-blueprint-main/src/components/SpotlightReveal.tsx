/**
 * SpotlightReveal — portable "move the light" effect.
 *
 * COPY-PASTE READY: no design tokens, no motion/gsap, no Tailwind config needed.
 * Only React + inline styles. Works in any React 18/19 app.
 *
 * How it works
 * 1. Track the pointer position inside the container (percent based, so it is resolution independent).
 * 2. Smooth it with a requestAnimationFrame lerp (easing 0.12 = heavy cinematic drag, 0.4 = snappy).
 * 3. Paint an absolutely positioned overlay with a radial-gradient that is TRANSPARENT in the middle
 *    and opaque (the darkness colour) at the edge. The transparent hole is the "flashlight".
 * 4. On touch / no-hover devices the light parks in the centre so content stays readable.
 *
 * Tuning cheat-sheet
 *   radius      160–260px  -> torch size
 *   softness    0.35–0.75  -> where the fade starts (fraction of radius)
 *   darkness    "rgba(9,9,9,0.97)" -> how black the unlit area is
 *   ease        0.08–0.35  -> trailing lag of the beam
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export type SpotlightRevealProps = {
  children: ReactNode;
  /** Torch radius in px. Default 220. */
  radius?: number;
  /** 0..1 — where the transparent core ends. Default 0.45. */
  softness?: number;
  /** Colour of the unlit area. Default near-black at 97%. */
  darkness?: string;
  /** Optional coloured glow tint around the beam, e.g. "rgba(211,47,47,0.18)". */
  tint?: string;
  /** Follow easing 0..1. Lower = laggier. Default 0.14. */
  ease?: number;
  className?: string;
  style?: CSSProperties;
};

export function SpotlightReveal({
  children,
  radius = 220,
  softness = 0.45,
  darkness = "rgba(9, 9, 9, 0.97)",
  tint,
  ease = 0.14,
  className,
  style,
}: SpotlightRevealProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 50, y: 50 });
  const current = useRef({ x: 50, y: 50 });
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let frame = 0;
    const loop = () => {
      const c = current.current;
      const t = target.current;
      c.x += (t.x - c.x) * ease;
      c.y += (t.y - c.y) * ease;
      setPos({ x: Math.round(c.x * 100) / 100, y: Math.round(c.y * 100) / 100 });
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [ease]);

  const move = (clientX: number, clientY: number) => {
    const r = hostRef.current?.getBoundingClientRect();
    if (!r) return;
    target.current = {
      x: ((clientX - r.left) / r.width) * 100,
      y: ((clientY - r.top) / r.height) * 100,
    };
    setIsHovered(true);
  };

  const core = Math.max(0, Math.min(1, softness)) * 100;

  return (
    <div
      ref={hostRef}
      onMouseEnter={(e) => move(e.clientX, e.clientY)}
      onMouseMove={(e) => move(e.clientX, e.clientY)}
      onTouchStart={(e) => {
        const t = e.touches[0];
        if (t) move(t.clientX, t.clientY);
      }}
      onTouchMove={(e) => {
        const t = e.touches[0];
        if (t) move(t.clientX, t.clientY);
      }}
      onTouchEnd={() => setIsHovered(false)}
      onMouseLeave={() => setIsHovered(false)}
      className={className}
      style={{ position: "relative", overflow: "hidden", ...style }}
    >
      {children}

      {tint && isHovered ? (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 9,
            pointerEvents: "none",
            background: `radial-gradient(circle ${radius}px at ${pos.x}% ${pos.y}%, ${tint} 0%, transparent 70%)`,
            mixBlendMode: "screen",
          }}
        />
      ) : null}

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          pointerEvents: "none",
          background: isHovered
            ? `radial-gradient(circle ${radius}px at ${pos.x}% ${pos.y}%, transparent ${core}%, ${darkness} 100%)`
            : darkness,
        }}
      />
    </div>
  );
}

export default SpotlightReveal;
