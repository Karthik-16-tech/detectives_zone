/**
 * EvidenceWall — portable "corkboard + red string" board.
 *
 * COPY-PASTE READY: React + inline styles only. No Tailwind config, no design
 * tokens, no animation library. Works in any React 18/19 app.
 */
import { useState, type CSSProperties } from "react";

export type EvidencePin = {
  id: string;
  /** 0..100 percent of board width */
  x: number;
  /** 0..100 percent of board height */
  y: number;
  label: string;
  note: string;
  /** Optional evidence photo shown inside the card */
  image?: string;
};

export type EvidenceWallProps = {
  pins: EvidencePin[];
  /** Pairs of pin indexes to connect with string, e.g. [[0,1],[1,2]] */
  links?: [number, number][];
  image?: string;
  imageAlt?: string;
  height?: number;
  accent?: string;
  background?: string;
  imageOpacity?: number;
  className?: string;
  style?: CSSProperties;
};

const KEYFRAMES = `@keyframes ew-dash { to { stroke-dashoffset: -280; } }`;

export function EvidenceWall({
  pins,
  links = [],
  image,
  imageAlt = "Evidence board",
  height = 620,
  accent = "#D32F2F",
  background = "#090909",
  imageOpacity = 0.45,
  className,
  style,
}: EvidenceWallProps) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height,
        borderRadius: 24,
        overflow: "hidden",
        background,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 40px 120px -40px rgba(0,0,0,.9)",
        ...style,
      }}
    >
      <style>{KEYFRAMES}</style>

      {image ? (
        <img
          src={image}
          alt={imageAlt}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: imageOpacity,
          }}
        />
      ) : (
        <div style={{ position: "absolute", inset: 0, background }} />
      )}

      {/* red string layer */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {links.map(([a, b], i) => {
          const pa = pins[a];
          const pb = pins[b];
          if (!pa || !pb) return null;
          const on = active === a || active === b;
          return (
            <line
              key={i}
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              stroke={accent}
              strokeWidth={on ? 2.2 : 1}
              vectorEffect="non-scaling-stroke"
              strokeDasharray="8 6"
              style={{
                opacity: on ? 0.95 : 0.35,
                transition: "opacity .3s, stroke-width .3s",
                animation: "ew-dash 12s linear infinite",
              }}
            />
          );
        })}
      </svg>

      {/* pinned cards */}
      {pins.map((p, i) => {
        const on = active === i;
        return (
          <button
            key={p.id}
            type="button"
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: 150,
              padding: 12,
              textAlign: "left",
              cursor: "pointer",
              borderRadius: 8,
              border: `1px solid ${on ? accent : "rgba(255,255,255,0.12)"}`,
              background: "rgba(9,9,9,0.85)",
              backdropFilter: "blur(10px)",
              color: "#EDE6D6",
              transform: `translate(-50%, -50%) scale(${on ? 1.12 : 1}) rotate(${on ? (i % 2 ? 2 : -2) : 0}deg)`,
              transition: "transform .28s cubic-bezier(.22,1,.36,1), border-color .28s",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: -6,
                left: "50%",
                width: 12,
                height: 12,
                marginLeft: -6,
                borderRadius: "50%",
                background: accent,
                boxShadow: `0 0 12px ${accent}`,
              }}
            />
            {p.image && (
              <img
                src={p.image}
                alt={p.note}
                loading="lazy"
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  objectFit: "cover",
                  borderRadius: 4,
                  marginBottom: 10,
                  display: "block",
                }}
              />
            )}
            <div
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 10,
                letterSpacing: ".22em",
                textTransform: "uppercase",
                color: accent,
              }}
            >
              {p.label}
            </div>
            <div
              style={{
                marginTop: 6,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 11,
                lineHeight: 1.35,
                color: "rgba(237,230,214,0.8)",
              }}
            >
              {p.note}
            </div>
          </button>
        );
      })}

      {/* vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, transparent 20%, rgba(9,9,9,.85) 95%)",
        }}
      />
    </div>
  );
}

export const demoPins: EvidencePin[] = [
  { id: "a", x: 16, y: 22, label: "Witness 04", note: "Saw the car twice." },
  { id: "b", x: 44, y: 14, label: "Map / Pier 9", note: "Route repeats weekly." },
  { id: "c", x: 72, y: 30, label: "Passport", note: "Issued under alias." },
  { id: "d", x: 30, y: 62, label: "Newspaper", note: "Headline predates crime." },
  { id: "e", x: 60, y: 70, label: "Evidence Bag", note: "Fibers match coat." },
  { id: "f", x: 86, y: 58, label: "Sticky Note", note: "'Ask about the key.'" },
];

export const demoLinks: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 3],
  [3, 4],
  [4, 5],
  [2, 5],
];

export default EvidenceWall;
