import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Fingerprint,
  Play,
  ArrowRight,
  Clock,
  Layers,
  Lock,
  Check,
  Eye,
  Link2,
  ClipboardList,
  Crosshair,
  FolderOpen,
  SearchCheck,
  Puzzle,
  Zap,
  AlertTriangle,
  ZoomIn,
} from "lucide-react";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import detectiveHeroImg from "@/assets/detective-hero.png";
import caseVoicemail from "@/assets/case-voicemail.png";
import evidenceRoom from "@/assets/evidence-room.jpg";
import noirStreet from "@/assets/noir-street.jpg";
import { useRain, RainCanvas } from "@/components/RainProvider";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SpotlightReveal } from "@/components/SpotlightReveal";
import { WhatIsDetectiveZone } from "@/components/WhatIsDetectiveZone";
import { Speakers } from "@/components/Speakers";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FeaturedCaseCard } from "@/components/FeaturedCaseCard";

const LENS_R = 48;
const LENS_ZOOM = 2.4;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Detective Zone — Every Shadow Has a Story" },
      {
        name: "description",
        content:
          "Step into Case File 001. Examine the scene, inspect every clue and uncover the truth hidden beneath layers of deception.",
      },
      { property: "og:title", content: "Detective Zone — Every Shadow Has a Story" },
      {
        property: "og:description",
        content: "A cinematic, story-driven investigation experience. Open the case file.",
      },
    ],
  }),
  component: Home,
});

type Hotspot = {
  label: string;
  lines: [string, string];
  style: React.CSSProperties;
  side: "left" | "right";
};

const hotspots: Hotspot[] = [
  {
    label: "Hat Detail",
    lines: ["Small DZ insignia", "Zoom to view"],
    style: { top: "18%", left: "47%" },
    side: "right",
  },
  {
    label: "Fiber Trace",
    lines: ["Strand of fabric", "Not from here"],
    style: { top: "40%", left: "50%" },
    side: "right",
  },
  {
    label: "Field Notes",
    lines: ["Private investigation", "Handwriting inside"],
    style: { top: "64%", left: "45%" },
    side: "left",
  },
  {
    label: "Pocket Watch",
    lines: ["Stopped at 11:47 PM", "Engraving on case"],
    style: { top: "76%", left: "42%" },
    side: "left",
  },
  {
    label: "Hotel Key",
    lines: ["Room 104", "Serial legible"],
    style: { top: "76%", left: "53%" },
    side: "right",
  },
];

const metrics = [
  {
    icon: FolderOpen,
    n: "15+",
    t: "Cases Open",
    d: "Unsolved investigations awaiting your insight.",
  },
  { icon: SearchCheck, n: "50+", t: "Cases Solved", d: "Each truth uncovered brings you closer." },
  {
    icon: Puzzle,
    n: "25+",
    t: "Mysteries Uncovered",
    d: "Connected cases. Hidden conspiracies revealed.",
  },
  { icon: Lock, n: "09", t: "Sealed Files", d: "Access granted only to ranked detectives." },
];

const protocol = [
  { icon: Eye, t: "Observe", d: "Examine every scene, every detail." },
  { icon: ClipboardList, t: "Deduce", d: "Find patterns others choose to ignore." },
  { icon: Crosshair, t: "Solve", d: "Uncover the truth. Close the case." },
];

const mysteries = [
  {
    id: 1,
    q: "What exact time appears repeatedly in the scene and connects the notebook, wall note, clock, and sticky note?",
    hint: "It keeps repeating itself across every surface in the room.",
    answers: ["09:17", "9:17", "0917", "9.17"],
  },
  {
    id: 2,
    q: "Is the desk lamp on or off in the scene?",
    hint: "Study the lampshade and the light around the desk.",
    answers: ["on", "lamp on", "it is on", "yes"],
  },
  {
    id: 3,
    q: "What is written on the wall note?",
    hint: "It echoes the same detail the notebook keeps repeating.",
    answers: ["09:17", "9:17", "0917"],
  },
];

/* ── Challenge helper sub-components ─────────────────────────────────── */

function SpotlightBox() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [coords, setCoords] = useState({ x: 50, y: 50 });

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      id="spotlight-container"
      className="relative grid min-h-[460px] place-items-center overflow-hidden rounded-[24px] border border-white/10 bg-[#0a0a0a] px-6 text-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        cursor: "crosshair",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* The Spotlight Overlay */}
      <div
        id="spotlight-overlay"
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          background: isHovered
            ? `radial-gradient(220px at ${coords.x}% ${coords.y}%, transparent 0%, rgba(10, 10, 10, 0.97) 100%)`
            : "rgba(10, 10, 10, 1)",
        }}
      />

      {/* Content (Below the spotlight) */}
      <div className="relative z-0 max-w-xl">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          // move the light
        </p>
        <h2
          className="mt-5 text-4xl font-bold text-white sm:text-5xl"
          style={{ fontFamily: "'Oswald', sans-serif" }}
        >
          Detective Zone isn't just a game.
          <span
            className="block text-blood mt-2"
            style={{ textShadow: "0 0 20px rgba(211,47,47,0.3)" }}
          >
            It's an investigation.
          </span>
        </h2>
        <p className="mt-6 font-mono text-sm tracking-[0.3em] text-gray-400">
          OBSERVE · DEDUCE · SOLVE
        </p>
      </div>
    </div>
  );
}

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
            animation: `dz-ch-float ${p.dur}s ${p.delay}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

function ChScanLine() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
      }}
    />
  );
}

type ChallengeCardProps = {
  mystery: { id: number; label: string; q: string; hint: string; answers: string[]; clue: string };
  value: string;
  solved: boolean | undefined;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
};

function ChallengeCard({ mystery, value, solved, onChange, onSubmit }: ChallengeCardProps) {
  const [hintOpen, setHintOpen] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrong = solved === false;

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value);
    if (!mystery.answers.includes(value.trim().toLowerCase())) {
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
        transition: "border-color 0.4s ease, box-shadow 0.4s ease",
        boxShadow: solved
          ? "0 0 30px rgba(211,47,47,0.18), 0 8px 40px rgba(0,0,0,0.6)"
          : "0 8px 40px rgba(0,0,0,0.5)",
        animation: shaking ? "dz-ch-shake 0.5s ease" : undefined,
      }}
    >
      <Fingerprint
        aria-hidden
        style={{
          position: "absolute",
          right: 12,
          bottom: 12,
          width: 90,
          height: 90,
          color: "rgba(211,47,47,0.05)",
          pointerEvents: "none",
        }}
      />
      <FloatingParticles count={4} />
      <ChScanLine />

      {/* Top row */}
      <div
        style={{
          position: "relative",
          zIndex: 11,
          display: "flex",
          alignItems: "start",
          justifyContent: "space-between",
        }}
      >
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

      <div
        style={{
          position: "relative",
          zIndex: 11,
          marginTop: 16,
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 9,
          letterSpacing: "0.15em",
          color: "#444",
          textTransform: "uppercase",
        }}
      >
        {mystery.clue}
      </div>

      <p
        style={{
          position: "relative",
          zIndex: 11,
          marginTop: 14,
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 14,
          color: "#ECECEC",
          lineHeight: 1.65,
        }}
      >
        {mystery.q}
      </p>

      {/* Input area */}
      <div style={{ position: "relative", zIndex: 11, marginTop: "auto", paddingTop: 20 }}>
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
              boxShadow: focused
                ? "0 0 0 3px rgba(211,47,47,0.08), inset 0 2px 8px rgba(0,0,0,0.3)"
                : "none",
            }}
          />
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
      {solved && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 20,
            background:
              "radial-gradient(ellipse at 50% 80%, rgba(211,47,47,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}

function Home() {
  const { enabled } = useRain();
  const heroRef = useRef<HTMLElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const alphaRef = useRef<Uint8ClampedArray | null>(null);
  const alphaSize = useRef<{ w: number; h: number } | null>(null);
  const [lens, setLens] = useState<{
    x: number;
    y: number;
    bx: number;
    by: number;
    bw: number;
    bh: number;
  } | null>(null);
  const [imgRect, setImgRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  // States for single page Interactive Challenge and About sections
  const [challengeValues, setChallengeValues] = useState<Record<number, string>>({});
  const [challengeSolved, setChallengeSolved] = useState<Record<number, boolean>>({});
  const [successBurst, setSuccessBurst] = useState(false);
  const [breathe, setBreathe] = useState(false);
  const [sceneOpen, setSceneOpen] = useState(false);

  const solvedCount = useMemo(
    () => Object.values(challengeSolved).filter(Boolean).length,
    [challengeSolved],
  );
  const challengeUnlocked = solvedCount === mysteries.length;

  const checkMystery = useCallback((id: number, val: string) => {
    const m = mysteries.find((x) => x.id === id)!;
    const ok = m.answers.includes(val.trim().toLowerCase());
    setChallengeSolved((s) => {
      const next = { ...s, [id]: ok };
      const nextCount = Object.values(next).filter(Boolean).length;
      if (ok && nextCount === mysteries.length) {
        setTimeout(() => setSuccessBurst(true), 300);
      }
      return next;
    });
  }, []);

  // Track detective image bounding rect for hotspot alignment
  const updateImgRect = useCallback(() => {
    const img = imgRef.current;
    const hero = heroRef.current;
    if (!img || !hero) return;
    const ir = img.getBoundingClientRect();
    const hr = hero.getBoundingClientRect();
    setImgRect({
      left: ir.left - hr.left,
      top: ir.top - hr.top,
      width: ir.width,
      height: ir.height,
    });
  }, []);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete) updateImgRect();
    else img.addEventListener("load", updateImgRect);
    window.addEventListener("resize", updateImgRect);
    return () => {
      img.removeEventListener("load", updateImgRect);
      window.removeEventListener("resize", updateImgRect);
    };
  }, [updateImgRect]);

  // Build an alpha map of the detective image so the lens only activates on the body itself
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    const buildAlpha = () => {
      if (alphaRef.current || !img.naturalWidth) return;
      try {
        const c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const ctx = c.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        alphaRef.current = ctx.getImageData(0, 0, c.width, c.height).data;
        alphaSize.current = { w: c.width, h: c.height };
      } catch {
        alphaRef.current = null;
      }
    };
    if (img.complete) buildAlpha();
    else img.addEventListener("load", buildAlpha);
    return () => img.removeEventListener("load", buildAlpha);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setBreathe((v) => !v), 4000);
    return () => clearInterval(t);
  }, []);

  const onHeroMove = (e: React.PointerEvent) => {
    const hero = heroRef.current;
    const img = imgRef.current;
    if (!hero || !img) return;

    // Do not show lens over the left content, buttons, links, featured card, or left portion of the hero
    const targetEl = e.target as HTMLElement;
    const heroLeft = hero.getBoundingClientRect().left;
    const heroW = hero.getBoundingClientRect().width;
    const relX = e.clientX - heroLeft;
    if (
      targetEl.closest("a") ||
      targetEl.closest("button") ||
      targetEl.closest(".rise") ||
      targetEl.closest(".panel") ||
      targetEl.closest("aside") ||
      relX < heroW * 0.4
    ) {
      setLens(null);
      return;
    }

    const h = hero.getBoundingClientRect();
    const r = img.getBoundingClientRect();
    const x = e.clientX - h.left;
    const y = e.clientY - h.top;
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
      setLens(null);
      return;
    }
    // Only engage the lens over the detective body (non-transparent pixels)
    const alpha = alphaRef.current;
    const as = alphaSize.current;
    if (alpha && as) {
      const px = Math.floor(((e.clientX - r.left) / r.width) * as.w);
      const py = Math.floor(((e.clientY - r.top) / r.height) * as.h);
      const ai = (Math.min(py, as.h - 1) * as.w + Math.min(px, as.w - 1)) * 4 + 3;
      if (alpha[ai] !== undefined && alpha[ai]! < 24) {
        setLens(null);
        return;
      }
    }
    const bw = r.width * LENS_ZOOM;
    const bh = r.height * LENS_ZOOM;
    setLens({
      x,
      y,
      bw,
      bh,
      bx: LENS_R - (e.clientX - r.left) * LENS_ZOOM,
      by: LENS_R - (e.clientY - r.top) * LENS_ZOOM,
    });
  };

  return (
    <div>
      {/* HERO */}
      <section
        id="home"
        ref={heroRef}
        onPointerMove={onHeroMove}
        onPointerLeave={() => setLens(null)}
        className="relative h-screen overflow-hidden pt-[64px]"
      >
        <RainCanvas enabled={enabled} />
        <div
          className="absolute inset-x-0 bottom-0 top-[64px]"
          style={{ transform: "scale(1.06)" }}
        >
          <img
            ref={imgRef}
            src={detectiveHeroImg}
            alt="Detective in a trench coat standing in the rain on a city street"
            className="absolute top-1/2 left-1/2 h-[120%] w-auto max-w-none object-contain"
            style={{
              transform: "translate3d(-50%, -50%, 0)",
              imageRendering: "-webkit-optimize-contrast",
              backfaceVisibility: "hidden",
            }}
          />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 55%, rgba(179,18,23,0.16), transparent 70%), linear-gradient(90deg, #050505 12%, transparent 38%, transparent 62%, #050505 92%), linear-gradient(0deg, #050505 4%, transparent 40%)",
          }}
        />
        {/* black overlay on hero bottom edge — hides any seam/line before next section */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-50"
          style={{
            height: "15%",
            background:
              "linear-gradient(to top, #050505 0%, rgba(5,5,5,0.92) 35%, transparent 100%)",
          }}
        />

        {/* classic magnifying glass */}
        {lens && (
          <div
            className="pointer-events-none absolute z-40 hidden lg:block"
            style={{
              left: lens.x - LENS_R,
              top: lens.y - LENS_R,
              width: LENS_R * 2,
              height: LENS_R * 2,
            }}
          >
            {/* handle */}
            <span
              className="absolute origin-top-left"
              style={{
                left: "83%",
                top: "83%",
                width: 14,
                height: LENS_R * 1.5,
                borderRadius: 8,
                transform: "rotate(-45deg)",
                background:
                  "linear-gradient(90deg, #2a2320 0%, #7a5c33 22%, #d8b877 48%, #7a5c33 74%, #241d19 100%)",
                boxShadow: "0 10px 24px rgba(0,0,0,0.65)",
              }}
            />
            {/* brass rim */}
            <span
              className="absolute inset-0 rounded-full"
              style={{
                padding: 7,
                background:
                  "conic-gradient(from 210deg, #6b4f2a, #e3c68b 18%, #8a6a38 38%, #f0dcae 58%, #7c5c30 78%, #5a4123 100%)",
                boxShadow: "0 18px 40px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(0,0,0,0.45)",
              }}
            >
              {/* glass */}
              <span
                className="block h-full w-full rounded-full"
                style={{
                  backgroundImage: `url(${detectiveHeroImg})`,
                  backgroundRepeat: "no-repeat",
                  backgroundColor: "#050505",
                  backgroundSize: `${Math.round(lens.bw)}px ${Math.round(lens.bh)}px`,
                  backgroundPosition: `${Math.round(lens.bx - 7)}px ${Math.round(lens.by - 7)}px`,
                  filter: "brightness(1.55) contrast(1.12) sepia(0.12)",
                  boxShadow: "inset 0 0 24px rgba(0,0,0,0.7)",
                  imageRendering: "-webkit-optimize-contrast",
                  backfaceVisibility: "hidden",
                }}
              />
            </span>
            {/* glass highlight */}
            <span
              className="absolute inset-[7px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 30% 24%, rgba(255,255,255,0.22), rgba(255,255,255,0.04) 38%, transparent 62%)",
              }}
            />
          </div>
        )}

        {/* hotspots — pinned to detective image */}
        {imgRect && (
          <div
            className="absolute hidden lg:block pointer-events-none"
            style={{
              left: imgRect.left,
              top: imgRect.top,
              width: imgRect.width,
              height: imgRect.height,
            }}
          >
            {hotspots.map((h) => (
              <div key={h.label} className="group absolute pointer-events-auto" style={h.style}>
                <span className="relative flex h-11 w-11 items-center justify-center">
                  <span className="absolute inset-0 rounded-full border-2 border-blood/70" />
                  <span
                    className="absolute inset-0 rounded-full border-2 border-blood"
                    style={{ animation: "dz-pulse-ring 3.4s cubic-bezier(0.16,1,0.3,1) infinite" }}
                  />
                  <span className="h-1.5 w-1.5 rounded-full bg-blood" />
                </span>
                <span
                  className={`absolute top-1/2 h-px w-16 bg-gradient-to-r from-blood/70 to-transparent ${
                    h.side === "left" ? "right-full mr-1" : "left-full ml-1"
                  }`}
                />
                <div
                  className={`absolute top-1/2 -translate-y-1/2 opacity-70 transition-all duration-500 group-hover:opacity-100 ${
                    h.side === "left" ? "right-full mr-20 text-right" : "left-full ml-20"
                  }`}
                  style={{ width: 180 }}
                >
                  <p className="font-display text-[11px] font-semibold tracking-[0.16em] uppercase">
                    {h.label}
                  </p>
                  <p className="mt-1 font-mono text-[9px] leading-relaxed tracking-[0.08em] text-muted-foreground uppercase">
                    {h.lines[0]}
                    <br />
                    {h.lines[1]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hero content container — constrains left content + featured card on wide monitors */}
        <div className="hero-container pointer-events-none">
          {/* left content */}
          <div className="pointer-events-auto absolute top-1/2 left-[clamp(1rem,4vw,3rem)] w-[90%] sm:w-[60%] md:w-[45%] lg:w-[34%] max-w-[520px] -translate-y-1/2 rise">
            <div className="flex items-center gap-4">
              <span className="h-px w-14 bg-blood" />
              <Fingerprint className="h-7 w-7 text-blood" />
            </div>
            <h1
              className="mt-6 sm:mt-8 font-display font-black tracking-[-0.02em] uppercase"
              style={{ fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 0.92, fontWeight: 700 }}
            >
              <span className="block text-foreground">DETECTIVES</span>
              <span className="block text-blood">ZONES</span>
            </h1>

            <Link
              to="/cases"
              className="group relative mt-7 sm:mt-9 flex items-center justify-center gap-3 overflow-hidden bg-blood font-display text-[11px] font-semibold tracking-[0.22em] uppercase"
              style={{ width: 200, height: 46 }}
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-foreground/10 transition-transform duration-700 group-hover:scale-x-100" />
              <Fingerprint className="relative h-3.5 w-3.5" />
              <span className="relative">Explore Cases</span>
              <ArrowRight className="relative h-3.5 w-3.5 -translate-x-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          </div>

          {/* featured case */}
          <aside className="pointer-events-auto absolute top-[50%] right-[clamp(1rem,4vw,3rem)] hidden -translate-y-1/2 xl:block z-30">
            <FeaturedCaseCard />
          </aside>
        </div>

        <div
          className="pointer-events-none absolute inset-0"
          style={{ animation: "dz-flicker 9s ease-in-out infinite", mixBlendMode: "overlay" }}
        />
      </section>

      {/* STRIP — EvidenceCard paper-clip style */}
      <ScrollReveal>
        <section className="shell mt-14 sm:mt-24 lg:mt-30">
          <style>
            {`
            @keyframes dz-ch-float {
              0%   { transform: translateY(0)  scale(1);   opacity: .15; }
              100% { transform: translateY(-18px) scale(1.5); opacity: .05; }
            }
            @keyframes dz-ch-shake {
              0%,100%{transform:translateX(0)}
              15%{transform:translateX(-8px)}
              30%{transform:translateX(8px)}
              45%{transform:translateX(-6px)}
              60%{transform:translateX(6px)}
              75%{transform:translateX(-3px)}
              90%{transform:translateX(3px)}
            }
            @keyframes dz-ch-pulse-border {
              0%,100%{box-shadow:0 0 0 0 rgba(211,47,47,0.4)}
              50%{box-shadow:0 0 0 10px rgba(211,47,47,0)}
            }
            @keyframes dz-ch-stamp-drop {
              0%{transform:scale(2.5) rotate(-12deg);opacity:0}
              60%{transform:scale(0.92) rotate(3deg);opacity:1}
              100%{transform:scale(1) rotate(0deg);opacity:1}
            }
          `}{" "}
          </style>
          <p className="caption text-blood mb-6">File 001 — What you do</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 pb-10">
            {(
              [
                {
                  id: "DZ-001",
                  step: "01",
                  title: "Observe",
                  quote: "Examine every scene, every detail. Nothing escapes the trained eye.",
                  by: "Field Protocol",
                },
                {
                  id: "DZ-002",
                  step: "02",
                  title: "Deduce",
                  quote: "Find patterns others choose to ignore. Logic is your only weapon.",
                  by: "Investigation Manual",
                },
                {
                  id: "DZ-003",
                  step: "03",
                  title: "Solve",
                  quote: "Uncover the truth. Close the file. Justice is the final clue.",
                  by: "Resolution Brief",
                },
              ] as const
            ).map((card, i) => (
              <blockquote
                key={card.id}
                className="group relative flex flex-col overflow-hidden"
                style={{
                  background: "#0a0a0a",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: "32px 28px 28px",
                  boxShadow: "rgba(0,0,0,0.9) 0px 24px 60px -20px",
                  transition:
                    "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease",
                  marginTop: i === 1 ? 16 : 0,
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    `translateY(-10px) rotate(${i === 0 ? -1.2 : i === 2 ? 1.2 : 0}deg)`;
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "rgba(0,0,0,0.95) 0px 40px 80px -20px, 0 0 0 1px rgba(211,47,47,0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "none";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "rgba(0,0,0,0.9) 0px 24px 60px -20px";
                }}
              >
                {/* Paperclip SVG */}
                <svg
                  viewBox="0 0 24 70"
                  className="absolute -top-5 left-8 h-12 w-4 rotate-3 text-white/30"
                  aria-hidden
                >
                  <path
                    d="M12 66V14a7 7 0 0 1 14 0v44a12 12 0 0 1-24 0V16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    transform="translate(-2 0)"
                  />
                </svg>

                {/* Step label */}
                <span
                  style={{
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 10,
                    letterSpacing: "0.28em",
                    color: "rgba(255,255,255,0.45)",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: 14,
                  }}
                >
                  Case {card.id}
                </span>

                {/* Step number + title */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
                  <span
                    style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: 11,
                      color: "#D32F2F",
                      letterSpacing: "0.2em",
                    }}
                  >
                    {card.step}
                  </span>
                  <p
                    style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: 26,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "#ECECEC",
                      lineHeight: 1,
                    }}
                  >
                    {card.title}
                  </p>
                </div>

                {/* Quote icon */}
                <svg
                  viewBox="0 0 24 24"
                  style={{
                    width: 22,
                    height: 22,
                    color: "#D32F2F",
                    fill: "rgba(211,47,47,0.18)",
                    marginBottom: 14,
                    flexShrink: 0,
                  }}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                </svg>

                {/* Quote text */}
                <p
                  style={{
                    flex: 1,
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: 13,
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.72)",
                  }}
                >
                  {card.quote}
                </p>

                {/* Footer */}
                <div
                  style={{
                    marginTop: 24,
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: 9,
                      letterSpacing: "0.28em",
                      color: "rgba(255,255,255,0.4)",
                      textTransform: "uppercase",
                    }}
                  >
                    {card.by}
                  </span>
                  <span
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: 9,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      border: "1px solid rgba(211,47,47,0.5)",
                      padding: "2px 8px",
                      transform: "rotate(-12deg)",
                      color: "#D32F2F",
                      display: "inline-block",
                    }}
                  >
                    Verified
                  </span>
                </div>

                {/* Decorative circle */}
                <span
                  className="pointer-events-none absolute -bottom-8 -right-6 h-24 w-24 rounded-full border-4"
                  style={{ borderColor: "rgba(139,90,30,0.25)" }}
                />

                {/* Grain texture */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
                  style={{ background: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
                />
              </blockquote>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ABOUT — scrolls below the hero */}
      <ScrollReveal>
        <section id="about" className="shell mt-14 sm:mt-24 lg:mt-32 scroll-mt-[64px]">
          <div className="grid grid-cols-12 items-center gap-8">
            <div className="col-span-12 lg:col-span-5">
              <p className="caption text-blood">File 002 — About</p>
              <h2
                className="mt-6 font-display leading-[0.95] font-bold uppercase"
                style={{ fontSize: "clamp(2rem, 5vw, 2.875rem)" }}
              >
                Every shadow
                <br />
                has a story
              </h2>
              <span className="mt-6 block h-[3px] w-[60px] bg-blood" />
              <a
                href="#challenge"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("challenge")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group mt-9 inline-flex items-center gap-3 border border-border px-7 font-display text-[12px] tracking-[0.22em] uppercase transition-colors duration-500 hover:border-blood"
                style={{ height: 54 }}
              >
                Open the briefing
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
              </a>
            </div>
            <div className="col-span-12 lg:col-span-7">
              <img
                src={noirStreet}
                alt="Rain-soaked noir street at night"
                loading="lazy"
                className="w-full rounded-[12px] object-cover grayscale"
                style={{ height: "clamp(200px, 35vw, 420px)" }}
              />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* WHAT IS DETECTIVE ZONE — below "Every shadow has a story", above challenge */}
      <WhatIsDetectiveZone />

      {/* SPEAKERS — above challenge */}
      <Speakers />

      {/* CHALLENGE — full premium interactive section */}
      <ScrollReveal>
        <section id="challenge" className="shell mt-14 sm:mt-24 lg:mt-32 scroll-mt-[64px]">
          {/* Section label */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#D32F2F",
                boxShadow: "0 0 12px #D32F2F",
              }}
            />
            <span
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 10,
                letterSpacing: "0.28em",
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
              }}
            >
              // Challenge
            </span>
            <span className="hairline flex-1" />
            <span
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 10,
                color: "#D32F2F",
                letterSpacing: "0.18em",
              }}
            >
              003
            </span>
          </div>

          {/* Hero panel: crime scene */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 20,
              alignItems: "stretch",
              marginBottom: 20,
            }}
          >
            {/* Heading above the scene */}
            <div
              style={{
                fontFamily: "Bebas Neue, sans-serif",
                fontSize: "clamp(2.25rem, 9vw, 3rem)",
                lineHeight: 0.95,
                letterSpacing: "0.03em",
                color: "#ECECEC",
                textTransform: "uppercase",
              }}
            >
              Think like
              <br />a detective
            </div>

            {/* Crime scene image */}
            <div
              onClick={() => setSceneOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSceneOpen(true);
                }
              }}
              className="group relative cursor-pointer"
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.06)",
                position: "relative",
                height: "clamp(220px, 35vw, 420px)",
                transition: "border-color 0.3s ease",
              }}
            >
              <img
                src={evidenceRoom}
                alt="Hotel room evidence scene — Room 104"
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 4s ease-in-out",
                  transform: breathe ? "scale(1.04)" : "scale(1.0)",
                }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(9,9,9,0.5) 0%, transparent 50%), linear-gradient(to right, rgba(9,9,9,0.2) 0%, transparent 35%)",
                  pointerEvents: "none",
                }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 4px)",
                  pointerEvents: "none",
                }}
              />
              {/* Enlarge hint */}
              <div
                className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-md border border-white/15 bg-black/55 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/75 backdrop-blur-md transition-all duration-300 group-hover:border-[#D32F2F]/60 group-hover:text-white group-hover:shadow-[0_0_16px_-4px_rgba(211,47,47,0.5)]"
                style={{ pointerEvents: "none" }}
              >
                <ZoomIn className="h-3 w-3" /> Enlarge
              </div>
              {/* Corner marks */}
              {(
                [
                  { top: 14, left: 14 },
                  { top: 14, right: 14 },
                  { bottom: 14, left: 14 },
                  { bottom: 14, right: 14 },
                ] as React.CSSProperties[]
              ).map((pos, i) => (
                <div
                  key={i}
                  aria-hidden
                  style={{
                    position: "absolute",
                    ...pos,
                    width: 16,
                    height: 16,
                    borderTop: i < 2 ? "2px solid rgba(211,47,47,0.4)" : undefined,
                    borderBottom: i >= 2 ? "2px solid rgba(211,47,47,0.4)" : undefined,
                    borderLeft: i % 2 === 0 ? "2px solid rgba(211,47,47,0.4)" : undefined,
                    borderRight: i % 2 === 1 ? "2px solid rgba(211,47,47,0.4)" : undefined,
                    pointerEvents: "none",
                  }}
                />
              ))}
              <div
                style={{
                  position: "absolute",
                  bottom: 18,
                  left: 20,
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 9,
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                  pointerEvents: "none",
                }}
              >
                Evidence Photograph — Room 104 — 11:47 PM
              </div>
            </div>
          </div>

          {/* Mystery cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px] mb-[18px]">
            {mysteries.map((m) => (
              <ChallengeCard
                key={m.id}
                mystery={m as any}
                value={challengeValues[m.id] ?? ""}
                solved={challengeSolved[m.id]}
                onChange={(v) => setChallengeValues((prev) => ({ ...prev, [m.id]: v }))}
                onSubmit={(v) => checkMystery(m.id, v)}
              />
            ))}
          </div>

          {/* Evidence terminal bar */}
          <div
            style={{
              background: "linear-gradient(145deg,#0f0f0f 0%,#0a0a0a 100%)",
              border: `1px solid ${challengeUnlocked ? "rgba(211,47,47,0.4)" : "rgba(255,255,255,0.06)"}`,
              borderRadius: 16,
              padding: "24px 28px",
              position: "relative",
              overflow: "hidden",
              transition: "border-color 0.6s ease, box-shadow 0.6s ease",
              boxShadow: challengeUnlocked ? "0 0 60px rgba(211,47,47,0.12)" : "none",
            }}
          >
            <ChScanLine />
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                left: 0,
                background: "rgba(211,47,47,0.04)",
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
                background: "linear-gradient(90deg,#D32F2F,rgba(211,47,47,0.2))",
                width: `${(solvedCount / mysteries.length) * 100}%`,
                transition: "width 1s cubic-bezier(0.34,1.56,0.64,1)",
                boxShadow: "0 0 12px rgba(211,47,47,0.6)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "relative",
                zIndex: 11,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "1px solid rgba(211,47,47,0.3)",
                    background: "rgba(211,47,47,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: challengeUnlocked
                      ? "none"
                      : "dz-ch-pulse-border 2s ease-in-out infinite",
                  }}
                >
                  <Fingerprint style={{ width: 18, height: 18, color: "#D32F2F" }} />
                </div>
                <div>
                  {challengeUnlocked ? (
                    <p
                      style={{
                        fontFamily: "'Oswald', sans-serif",
                        fontSize: 20,
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
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        color: "#666",
                        textTransform: "uppercase",
                      }}
                    >
                      Complete all three mysteries — {solvedCount}/{mysteries.length} verified
                    </p>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 7 }}>
                    {mysteries.map((m) => (
                      <div
                        key={m.id}
                        style={{
                          width: 52,
                          height: 3,
                          borderRadius: 2,
                          background: challengeSolved[m.id]
                            ? "#D32F2F"
                            : challengeSolved[m.id] === false
                              ? "rgba(255,80,80,0.28)"
                              : "rgba(255,255,255,0.07)",
                          transition: "background 0.5s ease",
                          boxShadow: challengeSolved[m.id] ? "0 0 8px rgba(211,47,47,0.5)" : "none",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {challengeUnlocked ? (
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span
                    style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: 16,
                      letterSpacing: "0.22em",
                      color: "#D32F2F",
                      border: "2px solid #D32F2F",
                      padding: "5px 16px",
                      transform: "rotate(-3deg)",
                      textShadow: "0 0 18px rgba(211,47,47,0.5)",
                      animation: successBurst
                        ? "dz-ch-stamp-drop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards"
                        : "none",
                    }}
                  >
                    Case Solved
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Check style={{ width: 16, height: 16, color: "#D32F2F" }} />
                    <span
                      style={{
                        fontFamily: "IBM Plex Mono, monospace",
                        fontSize: 9,
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
                  onClick={() =>
                    mysteries.forEach((m) => {
                      if (challengeValues[m.id]?.trim()) checkMystery(m.id, challengeValues[m.id]!);
                    })
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(211,47,47,0.1)",
                    border: "1px solid rgba(211,47,47,0.28)",
                    borderRadius: 10,
                    padding: "12px 24px",
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: 14,
                    letterSpacing: "0.2em",
                    color: "#D32F2F",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(211,47,47,0.18)";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 0 28px rgba(211,47,47,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(211,47,47,0.1)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <Zap style={{ width: 14, height: 14 }} /> Verify Evidence
                </button>
              )}
            </div>
            {Object.values(challengeSolved).some((v) => v === false) && !challengeUnlocked && (
              <div
                style={{
                  position: "relative",
                  zIndex: 11,
                  marginTop: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 9,
                  letterSpacing: "0.14em",
                  color: "#ff6060",
                  textTransform: "uppercase",
                }}
              >
                <AlertTriangle style={{ width: 11, height: 11 }} /> Some answers are incorrect.
                Re-examine the evidence.
              </div>
            )}
          </div>
        </section>
      </ScrollReveal>

      {/* CONTACT — scrolls below challenge */}
      <ScrollReveal>
        <section
          id="contact"
          className="shell mt-14 mb-14 sm:mt-24 sm:mb-24 lg:mt-32 lg:mb-32 scroll-mt-[64px]"
        >
          <SpotlightBox />
        </section>
      </ScrollReveal>

      {/* Challenge scene — full image dialog */}
      <Dialog open={sceneOpen} onOpenChange={setSceneOpen}>
        <DialogContent className="max-w-[min(1150px,94vw)] border border-white/10 bg-black p-2 sm:p-3">
          <img
            src={evidenceRoom}
            alt="Hotel room evidence scene — Room 104"
            className="h-auto max-h-[82vh] w-full rounded-md object-contain"
          />
          <p className="px-2 pb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            Evidence Photograph — Room 104 — 11:47 PM
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
