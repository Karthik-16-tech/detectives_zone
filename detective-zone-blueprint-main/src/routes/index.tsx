import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Fingerprint,
  Play,
  ArrowRight,
  Clock,
  Layers,
  Gift,
  Lock,
  LockOpen,
  Check,
  Search,
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
  ZoomOut,
  RotateCcw,
  Maximize2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { S3_MEDIA } from "@/lib/media";

const detectiveHeroVideo = S3_MEDIA.heroVideo;
const caseVoicemail = S3_MEDIA.cases.caseVoicemail;
const evidenceRoom = S3_MEDIA.evidenceRoom;
const noirStreet = S3_MEDIA.noirStreet;
import { useRain, RainCanvas } from "@/components/RainProvider";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SpotlightReveal } from "@/components/SpotlightReveal";
import { WhatIsDetectiveZone } from "@/components/WhatIsDetectiveZone";
import { Speakers } from "@/components/Speakers";
import { api } from "@/lib/api";

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

const metrics = [
  { icon: FolderOpen, n: "15+", t: "Cases Open", d: "Unsolved investigations awaiting your insight." },
  { icon: SearchCheck, n: "50+", t: "Cases Solved", d: "Each truth uncovered brings you closer." },
  { icon: Puzzle, n: "25+", t: "Mysteries Uncovered", d: "Connected cases. Hidden conspiracies revealed." },
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
    label: "Mystery 01 — Room Key Code",
    q: "What room number is engraved on the brass hotel key resting beside the evidence dossier?",
    hint: "Look closely at the brass key tag on the desk next to the open police dossier. Format: 104",
    answers: ["104", "room 104", "room104", "#104", "104.", "one hundred four", "one zero four"],
    clue: "Room identifier — Stamped on brass hotel tag",
  },
  {
    id: 2,
    label: "Mystery 02 — Audio Evidence Device",
    q: "What audio recording device is connected to the telephone on the detective's desk?",
    hint: "The analog cassette machine sitting near the lamp that recorded the final voicemail. (e.g. Tape Recorder / Cassette Player)",
    answers: [
      "tape recorder",
      "cassette recorder",
      "recorder",
      "audio recorder",
      "cassette player",
      "voice recorder",
      "cassette",
      "tape",
      "voicemail recorder",
      "cassette tape recorder",
    ],
    clue: "Analog equipment — Capturing the last incoming transmission",
  },
  {
    id: 3,
    label: "Mystery 03 — Temporal Connection",
    q: "What exact time appears repeatedly in the scene and connects the notebook, wall note, clock, and sticky note?",
    hint: "Inspect the clock hands, the timestamp on the open notebook, the wall note, and the sticky note by the desk lamp. Format: 09:17",
    answers: [
      "09:17",
      "9:17",
      "09:17 am",
      "09:17 pm",
      "9:17 am",
      "9:17 pm",
      "09:17am",
      "09:17pm",
      "9:17am",
      "9:17pm",
      "09.17",
      "9.17",
      "09:17⏱️",
      "09:17 ⏱️",
      "9:17 ⏱️",
      "9:17⏱️",
      "0917",
      "917",
      "nine seventeen",
      "9 seventeen",
    ],
    clue: "Recurring timestamp — Clock, notebook, wall note, and sticky note",
  },
];

/* ΓöÇΓöÇ Challenge helper sub-components ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */

function SpotlightBox() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 50, y: 50 });
  };

  return (
    <div
      ref={containerRef}
      id="spotlight-container"
      className="relative grid min-h-[460px] place-items-center overflow-hidden rounded-[24px] border border-white/10 bg-[#0a0a0a] px-6 text-center"
      style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        cursor: "crosshair",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* The Spotlight Overlay */}
      <div
        id="spotlight-overlay"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: `radial-gradient(220px at ${coords.x}% ${coords.y}%, transparent 0%, rgba(10, 10, 10, 0.97) 100%)`,
        }}
      />

      {/* Content (Below the spotlight) */}
      <div className="relative z-0 max-w-xl">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">// move the light</p>
        <h2 className="mt-5 text-4xl font-bold text-white sm:text-5xl" style={{ fontFamily: "'Oswald', sans-serif" }}>
          Detective Zone isn't just a game.
          <span className="block text-blood mt-2" style={{ textShadow: "0 0 20px rgba(211,47,47,0.3)" }}>It's an investigation.</span>
        </h2>
        <p className="mt-6 font-mono text-sm tracking-[0.3em] text-gray-400">
          OBSERVE ┬╖ DEDUCE ┬╖ SOLVE
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
        style={{ position: "absolute", right: 12, bottom: 12, width: 90, height: 90, color: "rgba(211,47,47,0.05)", pointerEvents: "none" }}
      />
      <FloatingParticles count={4} />
      <ChScanLine />

      {/* Top row */}
      <div style={{ position: "relative", zIndex: 11, display: "flex", alignItems: "start", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, letterSpacing: "0.22em", color: "#D32F2F", textTransform: "uppercase" }}>
            {mystery.label}
          </span>
          <div className="mt-1" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "3px 9px" }}>
            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, letterSpacing: "0.18em", color: "#666", textTransform: "uppercase" }}>Classified Clue</span>
          </div>
        </div>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${solved ? "rgba(211,47,47,0.5)" : "rgba(255,255,255,0.08)"}`, display: "flex", alignItems: "center", justifyContent: "center", background: solved ? "rgba(211,47,47,0.1)" : "rgba(255,255,255,0.02)", transition: "all 0.4s ease" }}>
          {solved ? <LockOpen style={{ width: 14, height: 14, color: "#D32F2F" }} /> : <Lock style={{ width: 14, height: 14, color: "#555" }} />}
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 11, marginTop: 16, fontFamily: "IBM Plex Mono, monospace", fontSize: 9, letterSpacing: "0.15em", color: "#444", textTransform: "uppercase" }}>Γùê {mystery.clue}</div>

      <p style={{ position: "relative", zIndex: 11, marginTop: 14, fontFamily: "IBM Plex Mono, monospace", fontSize: 14, color: "#ECECEC", lineHeight: 1.65 }}>{mystery.q}</p>

      {/* Input area */}
      <div style={{ position: "relative", zIndex: 11, marginTop: "auto", paddingTop: 20 }}>
        <label style={{ display: "block", fontFamily: "IBM Plex Mono, monospace", fontSize: 9, letterSpacing: "0.2em", color: "#555", textTransform: "uppercase", marginBottom: 7 }}>Enter your code</label>
        <div style={{ position: "relative" }}>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => { setFocused(false); if (value.trim()) handleSubmit(); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="TYPE YOUR ANSWER..."
            style={{
              width: "100%", height: 50, background: "rgba(255,255,255,0.03)", border: `1px solid ${borderColor}`, borderRadius: 10,
              padding: "0 44px 0 14px", fontFamily: "IBM Plex Mono, monospace", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase",
              color: solved ? "#D32F2F" : wrong ? "#ff6060" : "#ECECEC", outline: "none", transition: "border-color 0.3s ease, box-shadow 0.3s ease",
              boxShadow: focused ? "0 0 0 3px rgba(211,47,47,0.08), inset 0 2px 8px rgba(0,0,0,0.3)" : "none",
            }}
          />
          {!solved && (
            <button onClick={handleSubmit} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 28, height: 28, borderRadius: "50%", background: value.trim() ? "rgba(211,47,47,0.15)" : "rgba(255,255,255,0.04)", border: "1px solid rgba(211,47,47,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s ease" }} aria-label="Submit answer">
              <Zap style={{ width: 11, height: 11, color: "#D32F2F" }} />
            </button>
          )}
        </div>
        <div className="mt-3 flex items-start justify-between gap-2">
          <p style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: solved ? "#D32F2F" : wrong ? "#ff6060" : "#555", fontStyle: "italic", lineHeight: 1.5, flex: 1 }}>
            {solved ? "Γ£ô Verified. Clue logged to archive." : wrong ? "Γ£ù Access denied. Try again." : hintOpen ? `Hint: ${mystery.hint}` : "Answer above to verify the clue."}
          </p>
          {!solved && (
            <button onClick={() => setHintOpen((v) => !v)} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 4, fontFamily: "IBM Plex Mono, monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: hintOpen ? "#D32F2F" : "#444", background: "none", border: "none", cursor: "pointer", padding: 0, transition: "color 0.2s ease" }}>
              <Eye style={{ width: 10, height: 10 }} />{hintOpen ? "Hide" : "Hint"}
            </button>
          )}
        </div>
      </div>
      {solved && <div aria-hidden style={{ position: "absolute", inset: 0, borderRadius: 20, background: "radial-gradient(ellipse at 50% 80%, rgba(211,47,47,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />}
    </div>
  );
}

function Home() {
  const { enabled } = useRain();
  const [offset, setOffset] = useState(0);
  const heroRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // States for single page Interactive Challenge and About sections
  const [challengeValues, setChallengeValues] = useState<Record<number, string>>({});
  const [challengeSolved, setChallengeSolved] = useState<Record<number, boolean>>({});
  const [successBurst, setSuccessBurst] = useState(false);
  const [breathe, setBreathe] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setImageModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const solvedCount = useMemo(() => Object.values(challengeSolved).filter(Boolean).length, [challengeSolved]);
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

  const [cmsSettings, setCmsSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    api.getSettings().then((s) => {
      if (s) setCmsSettings(s);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setBreathe((v) => !v), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Normalized progress 0..1 — safe even before duration is known
    let targetProgress = 0.5;
    let currentProgress = 0.5;
    let settled = true;       // cursor at rest → stop seeking
    let didFirstMove = false; // pause video only once on first interaction

    // Seed the video to mid-point once metadata arrives
    const onReady = () => {
      const d = video.duration;
      if (!Number.isFinite(d) || d <= 0) return;
      try { video.currentTime = d * 0.5; } catch { /* noop */ }
    };
    if (video.readyState >= 1) onReady();
    video.addEventListener("loadedmetadata", onReady);

    // --- pointer handlers ---------------------------------------------------
    const onMove = (e: MouseEvent | PointerEvent) => {
      // Pause the autoplay on first cursor interaction so the frame
      // holds perfectly still when the cursor is at rest
      if (!didFirstMove) {
        didFirstMove = true;
        try { video.pause(); } catch { /* noop */ }
      }
      targetProgress = Math.max(0, Math.min(1, 1 - e.clientX / window.innerWidth));
      settled = false;
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches?.[0]) {
        if (!didFirstMove) {
          didFirstMove = true;
          try { video.pause(); } catch { /* noop */ }
        }
        targetProgress = Math.max(0, Math.min(1, 1 - e.touches[0].clientX / window.innerWidth));
        settled = false;
      }
    };

    // --- rAF loop ------------------------------------------------------------
    let raf = 0;
    const LERP = 0.10;       // smoothing factor per frame
    const DEAD_ZONE = 0.002; // 0.2% of duration → snap & stop

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (settled) return; // absolutely no seeking when at rest

      const d = video.duration;
      if (!Number.isFinite(d) || d <= 0) return;

      const diff = targetProgress - currentProgress;

      if (Math.abs(diff) < DEAD_ZONE) {
        // Snap to final position and freeze — no more seeking
        currentProgress = targetProgress;
        const sec = Math.max(0, Math.min(d - 0.01, currentProgress * d));
        try { video.currentTime = sec; } catch { /* noop */ }
        settled = true;
        return;
      }

      currentProgress += diff * LERP;
      const sec = Math.max(0, Math.min(d - 0.01, currentProgress * d));
      try { video.currentTime = sec; } catch { /* noop */ }
    };

    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", onReady);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchstart", onTouch);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div>
      {/* HERO */}
      <section
        id="home"
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden bg-black text-neutral-100 select-none"
      >
        {/* Scrubbable Background Video (Minimal Scale, Offset Right & Lower Position) */}
        <video
          ref={videoRef}
          src={cmsSettings.hero_video_url || detectiveHeroVideo}
          muted
          playsInline
          autoPlay
          loop
          preload="auto"
          className="absolute inset-0 m-auto h-full w-full object-contain pointer-events-none scale-[1.02] lg:scale-[1.03] translate-x-[6%] lg:translate-x-[10%] translate-y-[4%] lg:translate-y-[5.5%]"
        />

        {/* Rain and Atmosphere overlays */}
        <RainCanvas enabled={enabled} />
        <div className="rain-layer pointer-events-none absolute -inset-y-1/2 -inset-x-1/4 opacity-40" />
        <div className="rain-layer-slow pointer-events-none absolute -inset-y-1/2 -inset-x-1/4 opacity-30" />

        {/* Film grain and moody vignettes */}
        <div className="film-grain pointer-events-none absolute inset-0 opacity-20" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 50%, rgba(179,18,23,0.12), transparent 70%), linear-gradient(90deg, #050505 18%, rgba(5,5,5,0.65) 45%, rgba(5,5,5,0.2) 70%, #050505 95%), linear-gradient(0deg, #050505 6%, transparent 40%)",
          }}
        />

        {/* Left heading & Action CTA (Navbar transparent above, heading preserved) */}
        <div className="pointer-events-none absolute inset-0 mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-12 flex items-center justify-between pt-16">
          <div className="pointer-events-auto w-[50%] max-w-[540px] rise">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-blood" />
              <Fingerprint className="h-5 w-5 text-blood" />
              <span className="font-mono text-[9px] tracking-[0.35em] text-blood uppercase font-medium">Noir / 01</span>
            </div>
            <h1
              className="mt-6 font-display font-bold tracking-[-0.02em] uppercase"
              style={{ fontSize: "clamp(52px, 5.8vw, 84px)", lineHeight: 0.9 }}
            >
              <span className="block text-foreground">Detectives</span>
              <span className="block text-blood">Zone</span>
            </h1>
            <span className="mt-5 block h-[3px] w-[54px] bg-blood" />

            <Link
              to="/cases"
              onPointerDown={(e) => e.stopPropagation()}
              className="group relative mt-8 flex items-center justify-center gap-2.5 overflow-hidden bg-blood font-display text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.03]"
              style={{ width: 196, height: 46 }}
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-foreground/10 transition-transform duration-500 group-hover:scale-x-100" />
              <Fingerprint className="relative h-3.5 w-3.5" />
              <span className="relative">Explore Cases</span>
              <ArrowRight className="relative h-3.5 w-3.5 -translate-x-1.5 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          </div>
        </div>
      </section>

      {/* Smooth Black Page Transition below the Hero Section */}
      <div
        className="pointer-events-none relative z-10 w-full h-16 sm:h-24 -mt-1"
        style={{
          background: "linear-gradient(180deg, #000000 0%, #040404 60%, transparent 100%)",
        }}
      />

      {/* STRIP ΓÇö EvidenceCard paper-clip style */}
      <ScrollReveal>
        <section className="shell mt-30">
          <style>{`
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
          `}          </style>
          <p className="caption text-blood" style={{ marginBottom: 28 }}>File 002 — About</p>
          <div className="grid grid-cols-3 gap-6 pt-2 pb-10">
            {([
              { id: "DZ-001", step: "01", title: "Observe", quote: "Examine every scene, every detail. Nothing escapes the trained eye.", by: "Field Protocol" },
              { id: "DZ-002", step: "02", title: "Deduce", quote: "Find patterns others choose to ignore. Logic is your only weapon.", by: "Investigation Manual" },
              { id: "DZ-003", step: "03", title: "Solve", quote: "Uncover the truth. Close the file. Justice is the final clue.", by: "Resolution Brief" },
            ] as const).map((card, i) => (
              <blockquote
                key={card.id}
                className="group relative flex flex-col overflow-hidden"
                style={{
                  background: "#0a0a0a",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: "32px 28px 28px",
                  boxShadow: "rgba(0,0,0,0.9) 0px 24px 60px -20px",
                  transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease",
                  marginTop: i === 1 ? 16 : 0,
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = `translateY(-10px) rotate(${i === 0 ? -1.2 : i === 2 ? 1.2 : 0}deg)`;
                  (e.currentTarget as HTMLElement).style.boxShadow = "rgba(0,0,0,0.95) 0px 40px 80px -20px, 0 0 0 1px rgba(211,47,47,0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "none";
                  (e.currentTarget as HTMLElement).style.boxShadow = "rgba(0,0,0,0.9) 0px 24px 60px -20px";
                }}
              >
                {/* Paperclip SVG */}
                <svg viewBox="0 0 24 70" className="absolute -top-5 left-8 h-12 w-4 rotate-3 text-white/30" aria-hidden>
                  <path d="M12 66V14a7 7 0 0 1 14 0v44a12 12 0 0 1-24 0V16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" transform="translate(-2 0)" />
                </svg>

                {/* Step label */}
                <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, letterSpacing: "0.28em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", display: "block", marginBottom: 14 }}>
                  Case {card.id}
                </span>

                {/* Step number + title */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "#D32F2F", letterSpacing: "0.2em" }}>{card.step}</span>
                  <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, letterSpacing: "0.06em", textTransform: "uppercase", color: "#ECECEC", lineHeight: 1 }}>{card.title}</p>
                </div>

                {/* Quote icon */}
                <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, color: "#D32F2F", fill: "rgba(211,47,47,0.18)", marginBottom: 14, flexShrink: 0 }} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                </svg>

                {/* Quote text */}
                <p style={{ flex: 1, fontFamily: "Inter, system-ui, sans-serif", fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.72)" }}>
                  {card.quote}
                </p>

                {/* Footer */}
                <div style={{ marginTop: 24, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, letterSpacing: "0.28em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
                    {card.by}
                  </span>
                  <span
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", border: "1px solid rgba(211,47,47,0.5)", padding: "2px 8px", transform: "rotate(-12deg)", color: "#D32F2F", display: "inline-block" }}
                  >
                    Verified
                  </span>
                </div>

                {/* Decorative circle */}
                <span className="pointer-events-none absolute -bottom-8 -right-6 h-24 w-24 rounded-full border-4" style={{ borderColor: "rgba(139,90,30,0.25)" }} />

                {/* Grain texture */}
                <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ background: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />
              </blockquote>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ABOUT — scrolls below the hero */}
      <ScrollReveal>
        <section id="about" className="shell mt-32 scroll-mt-[64px]">
          <div className="grid grid-cols-12 items-center gap-8">
            <div className="col-span-5">
              <p className="caption text-blood">File 002 — About</p>
              <h2 className="mt-6 font-display text-[46px] leading-[0.95] font-bold uppercase">
                {cmsSettings.about_heading || (
                  <>
                    Every shadow
                    <br />
                    has a story
                  </>
                )}
              </h2>
              <span className="mt-6 block h-[3px] w-[60px] bg-blood" />
              <p className="mt-6 max-w-md text-[14px] leading-relaxed text-muted-foreground">
                {cmsSettings.about_text || "Detective Zone is a story-driven investigation experience. Each case is written like a dossier — statements, photographs, timelines — and nothing is handed to you. You read the room, you weigh the lies, you close the file."}
              </p>
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
            <div className="col-span-7">
              <img
                src={cmsSettings.about_image || noirStreet}
                alt="Rain-soaked noir street at night"
                loading="lazy"
                className="h-[420px] w-full rounded-[12px] object-cover grayscale"
              />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* WHAT IS DETECTIVE ZONE — below "Every shadow has a story", above challenge */}
      <WhatIsDetectiveZone />

      {/* TESTIMONIALS / AGENT DOSSIERS */}
      <Speakers />

      {/* CHALLENGE — full premium interactive section */}
      <ScrollReveal>
        <section id="challenge" className="shell mt-32 scroll-mt-[64px]">
          {/* Section label */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#D32F2F", boxShadow: "0 0 12px #D32F2F" }} />
            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, letterSpacing: "0.28em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>// Challenge</span>
            <span className="hairline flex-1" />
            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: "#D32F2F", letterSpacing: "0.18em" }}>003</span>
          </div>

          {/* Crime scene image — full width & clickable */}
          <div
            onClick={() => setImageModalOpen(true)}
            className="group cursor-pointer"
            style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", position: "relative", marginBottom: 20 }}
          >
            <img
              src={cmsSettings.challenge_image || evidenceRoom}
              alt="Hotel room evidence scene — Room 104"
              loading="lazy"
              style={{ width: "100%", height: 400, objectFit: "cover", display: "block",
                transition: "transform 4s ease-in-out", transform: breathe ? "scale(1.04)" : "scale(1.0)" }}
            />
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(9,9,9,0.5) 0%, transparent 50%), linear-gradient(to right, rgba(9,9,9,0.2) 0%, transparent 35%)", pointerEvents: "none" }} />
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 4px)", pointerEvents: "none" }} />
            {/* Corner marks */}
            {([{top:14,left:14},{top:14,right:14},{bottom:14,left:14},{bottom:14,right:14}] as React.CSSProperties[]).map((pos, i) => (
              <div key={i} aria-hidden style={{ position: "absolute", ...pos, width: 16, height: 16, borderTop: i<2?"2px solid rgba(211,47,47,0.4)":undefined, borderBottom: i>=2?"2px solid rgba(211,47,47,0.4)":undefined, borderLeft: i%2===0?"2px solid rgba(211,47,47,0.4)":undefined, borderRight: i%2===1?"2px solid rgba(211,47,47,0.4)":undefined, pointerEvents: "none" }} />
            ))}
            
            {/* Inspect Pill Overlay */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/80 backdrop-blur-md border border-[#C81D24]/50 rounded-lg px-3 py-1.5 font-mono text-[10px] text-white uppercase tracking-wider group-hover:scale-105 transition-all shadow-[0_0_15px_rgba(200,29,36,0.3)]">
              <Maximize2 className="w-3.5 h-3.5 text-[#C81D24]" />
              <span>Click to Enlarge Evidence</span>
            </div>

            <div style={{ position: "absolute", bottom: 18, left: 20, fontFamily: "IBM Plex Mono, monospace", fontSize: 9, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", pointerEvents: "none" }}>Evidence Photograph — Room 104 — 11:47 PM · Clue Time: 09:17 ⏱️</div>
          </div>

          {/* Mystery cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 18 }}>
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
          <div style={{ background: "linear-gradient(145deg,#0f0f0f 0%,#0a0a0a 100%)", border: `1px solid ${challengeUnlocked ? "rgba(211,47,47,0.4)" : "rgba(255,255,255,0.06)"}`, borderRadius: 16, padding: "24px 28px", position: "relative", overflow: "hidden", transition: "border-color 0.6s ease, box-shadow 0.6s ease", boxShadow: challengeUnlocked ? "0 0 60px rgba(211,47,47,0.12)" : "none" }}>
            <ChScanLine />
            <div aria-hidden style={{ position: "absolute", inset: 0, left: 0, background: "rgba(211,47,47,0.04)", width: `${(solvedCount / mysteries.length) * 100}%`, transition: "width 1s cubic-bezier(0.34,1.56,0.64,1)", pointerEvents: "none" }} />
            <div aria-hidden style={{ position: "absolute", bottom: 0, left: 0, height: 2, background: "linear-gradient(90deg,#D32F2F,rgba(211,47,47,0.2))", width: `${(solvedCount / mysteries.length) * 100}%`, transition: "width 1s cubic-bezier(0.34,1.56,0.64,1)", boxShadow: "0 0 12px rgba(211,47,47,0.6)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 11, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(211,47,47,0.3)", background: "rgba(211,47,47,0.08)", display: "flex", alignItems: "center", justifyContent: "center", animation: challengeUnlocked ? "none" : "dz-ch-pulse-border 2s ease-in-out infinite" }}>
                  <Fingerprint style={{ width: 18, height: 18, color: "#D32F2F" }} />
                </div>
                <div>
                  {challengeUnlocked ? (
                    <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, letterSpacing: "0.2em", color: "#ECECEC", textTransform: "uppercase" }}>Access Granted ΓÇö 25% Off Unlocked</p>
                  ) : (
                    <p style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, letterSpacing: "0.2em", color: "#666", textTransform: "uppercase" }}>Complete all three mysteries ΓÇö {solvedCount}/{mysteries.length} verified</p>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 7 }}>
                    {mysteries.map((m) => (
                      <div key={m.id} style={{ width: 52, height: 3, borderRadius: 2, background: challengeSolved[m.id] ? "#D32F2F" : challengeSolved[m.id] === false ? "rgba(255,80,80,0.28)" : "rgba(255,255,255,0.07)", transition: "background 0.5s ease", boxShadow: challengeSolved[m.id] ? "0 0 8px rgba(211,47,47,0.5)" : "none" }} />
                    ))}
                  </div>
                </div>
              </div>
              {challengeUnlocked ? (
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, letterSpacing: "0.22em", color: "#D32F2F", border: "2px solid #D32F2F", padding: "5px 16px", transform: "rotate(-3deg)", textShadow: "0 0 18px rgba(211,47,47,0.5)", animation: successBurst ? "dz-ch-stamp-drop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards" : "none" }}>Case Solved</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Check style={{ width: 16, height: 16, color: "#D32F2F" }} />
                    <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, letterSpacing: "0.14em", color: "#D32F2F", textTransform: "uppercase" }}>CODE: DZ25-SOLVED</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => mysteries.forEach((m) => { if (challengeValues[m.id]?.trim()) checkMystery(m.id, challengeValues[m.id]!); })}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(211,47,47,0.1)", border: "1px solid rgba(211,47,47,0.28)", borderRadius: 10, padding: "12px 24px", fontFamily: "'Oswald', sans-serif", fontSize: 14, letterSpacing: "0.2em", color: "#D32F2F", textTransform: "uppercase", cursor: "pointer", transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(211,47,47,0.18)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 28px rgba(211,47,47,0.18)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(211,47,47,0.1)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                >
                  <Zap style={{ width: 14, height: 14 }} /> Verify Evidence
                </button>
              )}
            </div>
            {Object.values(challengeSolved).some((v) => v === false) && !challengeUnlocked && (
              <div style={{ position: "relative", zIndex: 11, marginTop: 14, display: "flex", alignItems: "center", gap: 7, fontFamily: "IBM Plex Mono, monospace", fontSize: 9, letterSpacing: "0.14em", color: "#ff6060", textTransform: "uppercase" }}>
                <AlertTriangle style={{ width: 11, height: 11 }} /> Some answers are incorrect. Re-examine the evidence.
              </div>
            )}
          </div>
        </section>
      </ScrollReveal>

      {/* CONTACT — scrolls below challenge */}
      <ScrollReveal>
        <section id="contact" className="shell mt-32 mb-32 scroll-mt-[64px]">
          <SpotlightBox />
        </section>
      </ScrollReveal>

      {/* ════════════════════════════════════════════════════
          CRIME SCENE EVIDENCE DIALOG MODAL / LIGHTBOX
      ════════════════════════════════════════════════════ */}
      {imageModalOpen && (
        <div
          className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6"
          style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(14px)" }}
          onClick={() => setImageModalOpen(false)}
        >
          <div
            className="relative w-full max-w-[1280px] max-h-[95vh] flex flex-col rounded-2xl overflow-hidden border border-[#C81D24]/40 shadow-[0_0_50px_rgba(200,29,36,0.25)] bg-[#0A0A0A]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/80">
              <div className="flex items-center gap-3">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#C81D24] animate-pulse" />
                <div>
                  <h3 className="font-display text-[20px] text-white tracking-widest uppercase" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                    Crime Scene Evidence // Room 104
                  </h3>
                  <p className="font-mono text-[10px] text-[#888] tracking-widest uppercase">
                    Inspect Clock, Notebook, Wall Notes & Sticky Notes · Clue Marker: 09:17 ⏱️
                  </p>
                </div>
              </div>

              {/* Controls & Close */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
                    title="Zoom In"
                    className="p-1.5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-[10px] px-2 text-white/60">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
                    title="Zoom Out"
                    className="p-1.5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    title="Reset Zoom"
                    className="p-1.5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => setImageModalOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-red-950/60 hover:border-red-500/50 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Image Area */}
            <div className="relative flex-1 overflow-auto flex items-center justify-center p-4 sm:p-8 bg-black/95 max-h-[78vh]">
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: "center center",
                  transition: "transform 0.2s ease-out",
                }}
                className="max-w-full"
              >
                <img
                  src={cmsSettings.challenge_image || evidenceRoom}
                  alt="High Resolution Crime Scene Room 104"
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl border border-white/10"
                />
              </div>
            </div>

            {/* Modal Footer Banner */}
            <div className="flex flex-wrap items-center justify-between px-6 py-3 border-t border-white/10 bg-black/80 font-mono text-[10px] text-[#A0A0A0]">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#C81D24]" />
                <span>Forensic Temporal Marker: Look for repeating time <strong>09:17</strong> across notes and clock</span>
              </div>
              <span className="text-[#666]">Press ESC or click outside to exit</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

