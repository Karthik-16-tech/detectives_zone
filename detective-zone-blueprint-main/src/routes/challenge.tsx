import { createFileRoute } from "@tanstack/react-router";
import {
  Fingerprint,
  Gift,
  Check,
  Search,
  AlertTriangle,
  Eye,
  ChevronDown,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import evidenceRoom from "@/assets/evidence-room.jpg";
import { SpotlightReveal } from "@/components/SpotlightReveal";

import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/challenge")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "challenge" });
  },
  component: () => null,
});

/* ─── DATA ──────────────────────────────────────────────────────────────── */

const mysteries = [
  {
    id: 1,
    label: "Mystery 01",
    q: "Which object is hidden inside the detective's coat?",
    hint: "It keeps time it no longer owns. Stopped at 11:47 PM.",
    answers: ["watch", "pocket watch", "pocketwatch"],
    clue: "Personal item — concealed",
  },
  {
    id: 2,
    label: "Mystery 02",
    q: "What number is engraved on the hotel room key?",
    hint: "One floor above the lobby. Look carefully at the evidence.",
    answers: ["104", "room 104"],
    clue: "Room identifier — brass tag",
  },
  {
    id: 3,
    label: "Mystery 03",
    q: "Which side contains the missing photograph?",
    hint: "The hand that writes points there. Left or right.",
    answers: ["left", "left side"],
    clue: "Location — relative to the notebook",
  },
];

/* ─── PARTICLES ─────────────────────────────────────────────────────────── */

function FloatingParticles({ count = 18 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        dur: 6 + Math.random() * 10,
        delay: Math.random() * 8,
        opacity: 0.15 + Math.random() * 0.3,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: `rgba(211,47,47,${p.opacity})`,
            animation: `dz-float ${p.dur}s ${p.delay}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── SCAN LINE ─────────────────────────────────────────────────────────── */

function ScanLine() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-[inherit]"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
      }}
    />
  );
}

/* ─── MYSTERY CARD ──────────────────────────────────────────────────────── */

type MysteryCardProps = {
  mystery: (typeof mysteries)[number];
  value: string;
  solved: boolean | undefined;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
};

function MysteryCard({ mystery, value, solved, onChange, onSubmit }: MysteryCardProps) {
  const [hintOpen, setHintOpen] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrong = solved === false;

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value);
    if (!mysteries.find((m) => m.id === mystery.id)!.answers.includes(value.trim().toLowerCase())) {
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
  };

  const borderColor = solved
    ? "rgba(211,47,47,0.7)"
    : wrong
      ? "rgba(255,80,80,0.5)"
      : focused
        ? "rgba(211,47,47,0.35)"
        : "rgba(255,255,255,0.07)";

  return (
    <div
      className="group relative flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #111111 0%, #0d0d0d 100%)",
        border: `1px solid ${borderColor}`,
        borderRadius: 20,
        padding: "28px 28px 24px",
        minHeight: 290,
        transition: "border-color 0.4s ease, box-shadow 0.4s ease, transform 0.3s ease",
        boxShadow: solved
          ? "0 0 30px rgba(211,47,47,0.18), 0 8px 40px rgba(0,0,0,0.6)"
          : "0 8px 40px rgba(0,0,0,0.5)",
        transform: shaking ? "translateX(0)" : undefined,
        animation: shaking ? "dz-shake 0.5s ease" : undefined,
      }}
    >
      {/* Background fingerprint watermark */}
      <Fingerprint
        aria-hidden
        className="pointer-events-none absolute right-3 bottom-3 transition-all duration-500 group-hover:opacity-10"
        style={{ width: 90, height: 90, color: "rgba(211,47,47,0.05)" }}
      />
      <FloatingParticles count={4} />
      <ScanLine />

      {/* Top row */}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <span
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 10,
              letterSpacing: "0.22em",
              color: "#D32F2F",
              textTransform: "uppercase",
            }}
          >
            {mystery.label}
          </span>
          <div
            className="mt-1"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 6,
              padding: "3px 9px",
            }}
          >
            <span
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 9,
                letterSpacing: "0.18em",
                color: "#666",
                textTransform: "uppercase",
              }}
            >
              Classified Clue
            </span>
          </div>
        </div>
      </div>

      {/* Clue tag */}
      <div
        className="relative z-10 mt-4"
        style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 9,
          letterSpacing: "0.15em",
          color: "#444",
          textTransform: "uppercase",
        }}
      >
        {mystery.clue}
      </div>

      {/* Question */}
      <p
        className="relative z-10 mt-4 leading-snug"
        style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 14,
          color: "#ECECEC",
          lineHeight: 1.65,
        }}
      >
        {mystery.q}
      </p>

      {/* Input */}
      <div className="relative z-10 mt-auto pt-5">
        <label
          style={{
            display: "block",
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 9,
            letterSpacing: "0.2em",
            color: "#555",
            textTransform: "uppercase",
            marginBottom: 7,
          }}
        >
          Enter your code
        </label>
        <div style={{ position: "relative" }}>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              if (value.trim()) handleSubmit();
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="TYPE YOUR ANSWER..."
            style={{
              width: "100%",
              height: 50,
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${borderColor}`,
              borderRadius: 10,
              padding: "0 44px 0 14px",
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: solved ? "#D32F2F" : wrong ? "#ff6060" : "#ECECEC",
              outline: "none",
              transition: "border-color 0.3s ease, box-shadow 0.3s ease",
              boxShadow: focused ? "0 0 0 3px rgba(211,47,47,0.08), inset 0 2px 8px rgba(0,0,0,0.3)" : "none",
            }}
          />
          {/* Submit micro button */}
          {!solved && (
            <button
              onClick={handleSubmit}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: value.trim() ? "rgba(211,47,47,0.15)" : "rgba(255,255,255,0.04)",
                border: "1px solid rgba(211,47,47,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              aria-label="Submit answer"
            >
              <Zap style={{ width: 11, height: 11, color: "#D32F2F" }} />
            </button>
          )}
        </div>

        {/* Status / hint line */}
        <div className="mt-3 flex items-start justify-between gap-2">
          <p
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 10,
              color: solved ? "#D32F2F" : wrong ? "#ff6060" : "#555",
              fontStyle: "italic",
              lineHeight: 1.5,
              flex: 1,
            }}
          >
            {solved
              ? "✓ Verified. Clue logged to archive."
              : wrong
                ? "✗ Access denied. Try again."
                : hintOpen
                  ? `Hint: ${mystery.hint}`
                  : "Answer above to verify the clue."}
          </p>
          {!solved && (
            <button
              onClick={() => setHintOpen((v) => !v)}
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 9,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: hintOpen ? "#D32F2F" : "#444",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "color 0.2s ease",
              }}
            >
              <Eye style={{ width: 10, height: 10 }} />
              {hintOpen ? "Hide" : "Hint"}
            </button>
          )}
        </div>
      </div>

      {/* Solved overlay glow */}
      {solved && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius: 20,
            background: "radial-gradient(ellipse at 50% 80%, rgba(211,47,47,0.08) 0%, transparent 70%)",
          }}
        />
      )}
    </div>
  );
}

/* ─── MAIN COMPONENT ────────────────────────────────────────────────────── */

function Challenge() {
  const [values, setValues] = useState<Record<number, string>>({});
  const [solved, setSolved] = useState<Record<number, boolean>>({});
  const [successBurst, setSuccessBurst] = useState(false);

  const solvedCount = useMemo(() => Object.values(solved).filter(Boolean).length, [solved]);
  const unlocked = solvedCount === mysteries.length;

  const check = useCallback(
    (id: number, val: string) => {
      const m = mysteries.find((x) => x.id === id)!;
      const ok = m.answers.includes(val.trim().toLowerCase());
      setSolved((s) => {
        const next = { ...s, [id]: ok };
        const nextCount = Object.values(next).filter(Boolean).length;
        if (ok && nextCount === mysteries.length) {
          setTimeout(() => setSuccessBurst(true), 300);
        }
        return next;
      });
    },
    [],
  );

  /* ── Breathing zoom for the scene image ── */
  const [breathe, setBreathe] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setBreathe((v) => !v), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#090909",
        paddingTop: 64,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Animated page keyframes */}
      <style>{`
        @keyframes dz-shake {
          0%,100%{transform:translateX(0)}
          15%{transform:translateX(-8px)}
          30%{transform:translateX(8px)}
          45%{transform:translateX(-6px)}
          60%{transform:translateX(6px)}
          75%{transform:translateX(-3px)}
          90%{transform:translateX(3px)}
        }
        @keyframes dz-float {
          0%{transform:translateY(0) scale(1);opacity:.15}
          100%{transform:translateY(-18px) scale(1.5);opacity:.05}
        }
        @keyframes dz-pulse-border {
          0%,100%{box-shadow:0 0 0 0 rgba(211,47,47,0.4)}
          50%{box-shadow:0 0 0 10px rgba(211,47,47,0)}
        }
        @keyframes dz-stamp-drop {
          0%{transform:scale(2.5) rotate(-12deg);opacity:0}
          60%{transform:scale(0.92) rotate(3deg);opacity:1}
          80%{transform:scale(1.06) rotate(-1deg);opacity:1}
          100%{transform:scale(1) rotate(0deg);opacity:1}
        }
        @keyframes dz-scan {
          0%{transform:translateY(-100%)}
          100%{transform:translateY(100vh)}
        }
        @keyframes dz-progress-fill {
          from{width:0}
        }
        @keyframes dz-glow-pulse {
          0%,100%{opacity:.6}
          50%{opacity:1}
        }
        @keyframes dz-breathe {
          0%,100%{transform:scale(1.0)}
          50%{transform:scale(1.04)}
        }
      `}</style>

      {/* ── Page background texture ── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(211,47,47,0.04) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 100%, rgba(211,47,47,0.03) 0%, transparent 60%)",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
        }}
      />

      <div
        style={{
          maxWidth: 1600,
          margin: "0 auto",
          padding: "48px 32px 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ════════════════════════════════════════════════════
            SECTION A — HEADER
        ════════════════════════════════════════════════════ */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span
              style={{
                display: "inline-block",
                width: 32,
                height: 2,
                background: "#D32F2F",
              }}
            />
            <span
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 10,
                letterSpacing: "0.28em",
                color: "#D32F2F",
                textTransform: "uppercase",
              }}
            >
              File 003 — Case Challenge
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              fontSize: "clamp(52px, 7vw, 96px)",
              lineHeight: 0.92,
              letterSpacing: "0.03em",
              color: "#ECECEC",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Find the{" "}
            <span
              style={{
                color: "#D32F2F",
                textShadow: "0 0 40px rgba(211,47,47,0.6)",
                animation: "dz-glow-pulse 3s ease-in-out infinite",
              }}
            >
              3
            </span>{" "}
            Hidden Clues
          </h1>
        </div>

        {/* ════════════════════════════════════════════════════
            SECTION B — HERO INVESTIGATION PANEL
        ════════════════════════════════════════════════════ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 24,
            alignItems: "stretch",
            marginBottom: 24,
          }}
        >
          {/* ── LEFT: Crime scene with spotlight ── */}
          <SpotlightReveal
            radius={200}
            softness={0.42}
            darkness="rgba(9,9,9,0.88)"
            tint="rgba(211,47,47,0.12)"
            ease={0.12}
            style={{
              borderRadius: 20,
              minHeight: 420,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.06)",
              position: "relative",
            }}
          >
            {/* Scene image with breathing zoom */}
            <img
              src={evidenceRoom}
              alt="Hotel room evidence scene with desk, notebook, lamp and rain-streaked window"
              loading="eager"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                minHeight: 420,
                transition: "transform 4s ease-in-out",
                transform: breathe ? "scale(1.04)" : "scale(1.0)",
              }}
            />

            {/* Gradient overlays */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(9,9,9,0.85) 0%, rgba(9,9,9,0.2) 40%, transparent 70%), linear-gradient(to right, rgba(9,9,9,0.4) 0%, transparent 35%)",
                pointerEvents: "none",
              }}
            />

            {/* CRT scanlines texture */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)",
                pointerEvents: "none",
              }}
            />

            {/* Caption */}
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: 24,
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 10,
                letterSpacing: "0.22em",
                color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase",
                pointerEvents: "none",
              }}
            >
              Evidence Photograph — Room 104 — 11:47 PM
            </div>

            {/* Corner classification marks */}
            {[
              { top: 16, left: 16 },
              { top: 16, right: 16 },
              { bottom: 16, left: 16 },
              { bottom: 16, right: 16 },
            ].map((pos, i) => (
              <div
                key={i}
                aria-hidden
                style={{
                  position: "absolute",
                  ...pos,
                  width: 18,
                  height: 18,
                  borderTop: i < 2 ? "2px solid rgba(211,47,47,0.4)" : undefined,
                  borderBottom: i >= 2 ? "2px solid rgba(211,47,47,0.4)" : undefined,
                  borderLeft: i % 2 === 0 ? "2px solid rgba(211,47,47,0.4)" : undefined,
                  borderRight: i % 2 === 1 ? "2px solid rgba(211,47,47,0.4)" : undefined,
                  pointerEvents: "none",
                }}
              />
            ))}

            {/* "MOVE LIGHT" hint */}
            <div
              style={{
                position: "absolute",
                top: 20,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 9,
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.25)",
                textTransform: "uppercase",
                background: "rgba(9,9,9,0.5)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 30,
                padding: "5px 14px",
                pointerEvents: "none",
              }}
            >
              <Search style={{ width: 9, height: 9 }} />
              Move light to reveal clues
            </div>
          </SpotlightReveal>

          {/* ── RIGHT: Classified briefing panel ── */}
          <div
            style={{
              background: "linear-gradient(160deg, #111111 0%, #0c0c0c 100%)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20,
              padding: "32px 28px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <FloatingParticles count={8} />
            <ScanLine />

            {/* Header row */}
            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "start", justifyContent: "space-between" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.02)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Search style={{ width: 20, height: 20, color: "rgba(255,255,255,0.6)" }} />
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 9,
                    letterSpacing: "0.22em",
                    color: "#555",
                    textTransform: "uppercase",
                  }}
                >
                  Case Challenge
                </p>
                <p
                  style={{
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 11,
                    letterSpacing: "0.16em",
                    color: "#D32F2F",
                    marginTop: 3,
                  }}
                >
                  DZ-CH-001
                </p>
              </div>
            </div>

            {/* Title */}
            <h2
              style={{
                position: "relative",
                zIndex: 1,
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: 52,
                lineHeight: 0.95,
                letterSpacing: "0.03em",
                color: "#ECECEC",
                textTransform: "uppercase",
                marginTop: 32,
              }}
            >
              Find the
              <br />
              <span
                style={{
                  color: "#D32F2F",
                  textShadow: "0 0 30px rgba(211,47,47,0.5)",
                }}
              >
                3
              </span>{" "}
              hidden
              <br />
              clues
            </h2>

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: "linear-gradient(90deg, rgba(211,47,47,0.4) 0%, transparent 100%)",
                margin: "20px 0",
                position: "relative",
                zIndex: 1,
              }}
            />

            {/* Description */}
            <p
              style={{
                position: "relative",
                zIndex: 1,
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 13,
                lineHeight: 1.7,
                color: "#888",
              }}
            >
              Observe the evidence carefully. Every clue reveals part of the mystery. Solve all three
              riddles to unlock the classified reward.
            </p>

            {/* Progress indicator */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                marginTop: 20,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, letterSpacing: "0.18em", color: "#555", textTransform: "uppercase" }}>
                  Clues verified
                </span>
                <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, color: "#D32F2F" }}>
                  {solvedCount} / {mysteries.length}
                </span>
              </div>
              <div
                style={{
                  height: 3,
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${(solvedCount / mysteries.length) * 100}%`,
                    background: "linear-gradient(90deg, #D32F2F, #ff6b6b)",
                    borderRadius: 2,
                    transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    boxShadow: "0 0 10px rgba(211,47,47,0.5)",
                  }}
                />
              </div>
            </div>

            {/* Reward card */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                marginTop: "auto",
                paddingTop: 24,
              }}
            >
              <div
                style={{
                  background: "rgba(211,47,47,0.06)",
                  border: "1px solid rgba(211,47,47,0.25)",
                  borderRadius: 14,
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  animation: "dz-pulse-border 3s ease-in-out infinite",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "rgba(211,47,47,0.12)",
                    border: "1px solid rgba(211,47,47,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Gift style={{ width: 18, height: 18, color: "#D32F2F" }} />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: 9,
                      letterSpacing: "0.18em",
                      color: "#555",
                      textTransform: "uppercase",
                      marginBottom: 3,
                    }}
                  >
                    Reward
                  </p>
                  <p
                    style={{
                      fontFamily: "'Bebas Neue', Impact, sans-serif",
                      fontSize: 32,
                      lineHeight: 1,
                      letterSpacing: "0.04em",
                      color: "#D32F2F",
                      textShadow: "0 0 20px rgba(211,47,47,0.4)",
                    }}
                  >
                    25% OFF
                  </p>
                  <p
                    style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: 9,
                      letterSpacing: "0.14em",
                      color: "#555",
                      textTransform: "uppercase",
                      marginTop: 2,
                    }}
                  >
                    On Case File 001
                  </p>
                </div>
              </div>
            </div>

            {/* Background glow */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "80%",
                height: "40%",
                background: "radial-gradient(ellipse, rgba(211,47,47,0.06) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            SECTION C — MYSTERY CARDS
        ════════════════════════════════════════════════════ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
            marginBottom: 24,
          }}
        >
          {mysteries.map((m) => (
            <MysteryCard
              key={m.id}
              mystery={m}
              value={values[m.id] ?? ""}
              solved={solved[m.id]}
              onChange={(v) => setValues((prev) => ({ ...prev, [m.id]: v }))}
              onSubmit={(v) => check(m.id, v)}
            />
          ))}
        </div>

        {/* ════════════════════════════════════════════════════
            SECTION D — EVIDENCE PROGRESS + TERMINAL
        ════════════════════════════════════════════════════ */}
        <div
          style={{
            background: "linear-gradient(145deg, #0f0f0f 0%, #0a0a0a 100%)",
            border: `1px solid ${unlocked ? "rgba(211,47,47,0.4)" : "rgba(255,255,255,0.06)"}`,
            borderRadius: 20,
            padding: "28px 32px",
            position: "relative",
            overflow: "hidden",
            transition: "border-color 0.6s ease, box-shadow 0.6s ease",
            boxShadow: unlocked ? "0 0 60px rgba(211,47,47,0.15)" : "none",
          }}
        >
          <ScanLine />
          <FloatingParticles count={12} />

          {/* Progress fill bar */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              left: 0,
              background: "rgba(211,47,47,0.05)",
              width: `${(solvedCount / mysteries.length) * 100}%`,
              transition: "width 1s cubic-bezier(0.34,1.56,0.64,1)",
              pointerEvents: "none",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: 2,
              background: "linear-gradient(90deg, #D32F2F, rgba(211,47,47,0.2))",
              width: `${(solvedCount / mysteries.length) * 100}%`,
              transition: "width 1s cubic-bezier(0.34,1.56,0.64,1)",
              boxShadow: "0 0 12px rgba(211,47,47,0.6)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            {/* Left: Evidence tracker */}
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: "1px solid rgba(211,47,47,0.3)",
                  background: "rgba(211,47,47,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: unlocked ? "none" : "dz-pulse-border 2s ease-in-out infinite",
                }}
              >
                <Fingerprint style={{ width: 20, height: 20, color: "#D32F2F" }} />
              </div>
              <div>
                {unlocked ? (
                  <p
                    style={{
                      fontFamily: "'Bebas Neue', Impact, sans-serif",
                      fontSize: 22,
                      letterSpacing: "0.2em",
                      color: "#ECECEC",
                      textTransform: "uppercase",
                    }}
                  >
                    Access Granted — 25% Off Unlocked
                  </p>
                ) : (
                  <p
                    style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: 11,
                      letterSpacing: "0.2em",
                      color: "#666",
                      textTransform: "uppercase",
                    }}
                  >
                    Complete all three mysteries — {solvedCount}/{mysteries.length} verified
                  </p>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                  {mysteries.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        width: 60,
                        height: 4,
                        borderRadius: 2,
                        background: solved[m.id]
                          ? "#D32F2F"
                          : solved[m.id] === false
                            ? "rgba(255,80,80,0.3)"
                            : "rgba(255,255,255,0.08)",
                        transition: "background 0.5s ease",
                        boxShadow: solved[m.id] ? "0 0 8px rgba(211,47,47,0.5)" : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Status / CTA */}
            {unlocked ? (
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span
                  style={{
                    fontFamily: "'Bebas Neue', Impact, sans-serif",
                    fontSize: 18,
                    letterSpacing: "0.22em",
                    color: "#D32F2F",
                    border: "2px solid #D32F2F",
                    padding: "6px 18px",
                    transform: "rotate(-3deg)",
                    textShadow: "0 0 20px rgba(211,47,47,0.6)",
                    boxShadow: "0 0 20px rgba(211,47,47,0.2)",
                    animation: successBurst ? "dz-stamp-drop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards" : "none",
                  }}
                >
                  Case Solved
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Check style={{ width: 18, height: 18, color: "#D32F2F" }} />
                  <span
                    style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      color: "#D32F2F",
                      textTransform: "uppercase",
                    }}
                  >
                    CODE: DZ25-SOLVED
                  </span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  mysteries.forEach((m) => {
                    if (values[m.id]?.trim()) check(m.id, values[m.id]);
                  });
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "rgba(211,47,47,0.1)",
                  border: "1px solid rgba(211,47,47,0.3)",
                  borderRadius: 12,
                  padding: "14px 28px",
                  fontFamily: "'Bebas Neue', Impact, sans-serif",
                  fontSize: 16,
                  letterSpacing: "0.2em",
                  color: "#D32F2F",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(211,47,47,0.18)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(211,47,47,0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(211,47,47,0.1)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <Zap style={{ width: 15, height: 15 }} />
                Verify Evidence
              </button>
            )}
          </div>

          {/* Wrong answers warning */}
          {Object.values(solved).some((v) => v === false) && !unlocked && (
            <div
              style={{
                position: "relative",
                zIndex: 1,
                marginTop: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 10,
                letterSpacing: "0.14em",
                color: "#ff6060",
                textTransform: "uppercase",
              }}
            >
              <AlertTriangle style={{ width: 12, height: 12 }} />
              Some answers are incorrect. Re-examine the evidence.
            </div>
          )}
        </div>

        {/* ── Scroll hint ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 60,
            opacity: 0.3,
          }}
        >
          <ChevronDown
            style={{
              width: 20,
              height: 20,
              color: "#D32F2F",
              animation: "dz-float 2s ease-in-out infinite alternate",
            }}
          />
        </div>
      </div>

      {/* ── Full-page success flash ── */}
      {successBurst && (
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            pointerEvents: "none",
            background: "rgba(211,47,47,0.08)",
            animation: "dz-stamp-drop 0.8s ease forwards",
          }}
        />
      )}
    </div>
  );
}
