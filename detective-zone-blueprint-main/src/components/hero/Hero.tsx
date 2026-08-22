import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { MouseScrubVideo } from "./MouseScrubVideo";
import heroVideo from "@/assets/thi_svidoe_make_it_seconds.mp4";

const EASE = [0.16, 1, 0.3, 1] as const;

function FloatingParticles({ count = 22 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2.2,
        dur: 7 + Math.random() * 9,
        delay: -Math.random() * 12,
        opacity: 0.08 + Math.random() * 0.22,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 z-[4] overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -34, 0],
            opacity: [p.opacity * 0.35, p.opacity, p.opacity * 0.35],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function CursorSpotlight() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let x = -999;
    let y = -999;
    let tx = -999;
    let ty = -999;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      if (Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) {
        el.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`;
      }
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-[6] h-[600px] w-[600px] rounded-full opacity-70 mix-blend-soft-light"
      style={{
        background:
          "radial-gradient(circle, rgba(255,255,255,0.07) 0%, rgba(179,18,23,0.06) 35%, transparent 68%)",
      }}
    />
  );
}

export function Hero() {
  return (
    <section
      id="home"
      className="relative h-screen min-h-[640px] w-full overflow-hidden bg-[#050505]"
    >
      <MouseScrubVideo src={heroVideo} className="absolute inset-0 z-0 h-full w-full" />

      {/* Cinematic overlay */}
      <div
        aria-hidden
        className="absolute inset-0 z-[2]"
        style={{
          background: `
            radial-gradient(150% 110% at 50% 40%, transparent 34%, rgba(0,0,0,0.62) 100%),
            linear-gradient(90deg, rgba(2,2,2,0.92) 0%, rgba(4,4,4,0.42) 42%, rgba(4,4,4,0.28) 60%, rgba(2,2,2,0.94) 100%),
            linear-gradient(0deg, #050505 0%, rgba(5,5,5,0.8) 16%, rgba(5,5,5,0.05) 48%, transparent 72%)
          `,
        }}
      />

      {/* Bottom fade */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-[3] h-36 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"
      />

      <FloatingParticles />
      <CursorSpotlight />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="w-full px-4 sm:px-6 lg:pl-8 lg:pr-8">
          <motion.h1
            initial={{ opacity: 0, y: 44 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, ease: EASE }}
            className="font-display text-[clamp(3.2rem,9vw,7rem)] font-bold uppercase leading-[0.92] tracking-[0.01em] text-white"
            style={{
              fontFamily: "Bebas Neue, sans-serif",
              textShadow: "0 2px 44px rgba(0,0,0,0.75)",
            }}
          >
            Detective
            <br />
            <span className="text-blood">Zone</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.25, ease: EASE }}
            className="mt-10"
          >
            <Link
              to="/cases"
              className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-xl px-9 py-4 font-display text-[13px] font-semibold uppercase tracking-[0.24em] text-white transition-all duration-500 hover:scale-[1.05]"
              style={{
                background: "linear-gradient(135deg, #7A0F13 0%, #B31217 100%)",
                boxShadow: "0 12px 38px rgba(179,18,23,0.45), inset 0 1px 0 rgba(255,255,255,0.18)",
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="relative">Explore Cases</span>
              <ArrowRight className="relative h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
