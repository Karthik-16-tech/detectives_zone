import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type RainCtx = { enabled: boolean; toggle: () => void };
const Ctx = createContext<RainCtx>({ enabled: true, toggle: () => {} });

export const useRain = () => useContext(Ctx);

export function RainProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  return (
    <Ctx.Provider value={{ enabled, toggle: () => setEnabled((v) => !v) }}>
      {children}
    </Ctx.Provider>
  );
}

type Drop = {
  x: number;
  y: number;
  len: number;
  speed: number;
  thickness: number;
  alpha: number;
};
type Splash = { x: number; y: number; r: number; life: number; max: number };

export function RainCanvas({ enabled }: { enabled: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const flashRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const count = Math.round(Math.min(520, (w * h) / 3400));
    const drops: Drop[] = Array.from({ length: count }, () => spawn(w, h, true));
    const splashes: Splash[] = [];

    function spawn(width: number, height: number, initial = false): Drop {
      // depth 0 = far (thin, slow, faint), 1 = near
      const depth = Math.random();
      return {
        x: Math.random() * (width + 260) - 130,
        y: initial ? Math.random() * height : -Math.random() * 220 - 20,
        len: 8 + depth * 26,
        speed: 5.5 + depth * 13,
        thickness: 0.45 + depth * 1.1,
        alpha: 0.06 + depth * 0.22,
      };
    }

    let wind = 0.9;
    let windTarget = 0.9;
    let gustTimer = 0;

    // thunder state
    let nextStrike = 5000 + Math.random() * 12000;
    let elapsed = 0;

    const strike = () => {
      const el = flashRef.current;
      if (!el) return;
      const seq = [
        [0, 0.5],
        [70, 0],
        [120, 0.85],
        [230, 0.12],
        [300, 0.4],
        [420, 0],
      ] as const;
      seq.forEach(([t, o]) => {
        window.setTimeout(() => {
          if (flashRef.current) flashRef.current.style.opacity = String(o);
        }, t);
      });
      try {
        rumble();
      } catch {
        /* audio unavailable */
      }
    };

    let audioCtx: AudioContext | null = null;
    const rumble = () => {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return;
      audioCtx = audioCtx ?? new AC();
      if (audioCtx.state === "suspended") return; // needs user gesture; stay silent
      const dur = 3.2;
      const rate = audioCtx.sampleRate;
      const buf = audioCtx.createBuffer(1, rate * dur, rate);
      const data = buf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02; // brown noise
        data[i] = last * 3.5;
      }
      const src = audioCtx.createBufferSource();
      src.buffer = buf;
      const lp = audioCtx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 220;
      const gain = audioCtx.createGain();
      const t0 = audioCtx.currentTime + 0.35;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.22, t0 + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      src.connect(lp).connect(gain).connect(audioCtx.destination);
      src.start(t0);
      src.stop(t0 + dur);
    };

    let raf = 0;
    let prev = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(48, now - prev);
      prev = now;
      elapsed += dt;
      gustTimer -= dt;
      if (gustTimer <= 0) {
        gustTimer = 2500 + Math.random() * 4000;
        windTarget = 0.3 + Math.random() * 2.4;
      }
      wind += (windTarget - wind) * 0.002 * dt;

      if (elapsed > nextStrike) {
        elapsed = 0;
        nextStrike = 9000 + Math.random() * 22000;
        strike();
      }

      ctx.clearRect(0, 0, w, h);
      const f = dt / 16.67;

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i]!;
        const vx = wind * (d.speed * 0.16);
        d.x += vx * f;
        d.y += d.speed * f;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(198,214,230,${d.alpha})`;
        ctx.lineWidth = d.thickness;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - vx * 1.6, d.y - d.len);
        ctx.stroke();
        if (d.y > h) {
          if (d.alpha > 0.18 && splashes.length < 60) {
            splashes.push({ x: d.x, y: h - 2, r: 0, life: 0, max: 380 });
          }
          drops[i] = spawn(w, h);
        }
      }

      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i]!;
        s.life += dt;
        const p = s.life / s.max;
        if (p >= 1) {
          splashes.splice(i, 1);
          continue;
        }
        s.r = p * 14;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(198,214,230,${0.18 * (1 - p)})`;
        ctx.lineWidth = 0.7;
        ctx.ellipse(s.x, s.y, s.r, s.r * 0.28, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const resumeAudio = () => {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return;
      audioCtx = audioCtx ?? new AC();
      void audioCtx.resume();
    };
    window.addEventListener("pointerdown", resumeAudio, { once: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", resumeAudio);
      void audioCtx?.close();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-40">
      <canvas ref={canvasRef} className="h-full w-full opacity-70" />
      <div
        ref={flashRef}
        className="absolute inset-0 transition-opacity duration-150"
        style={{
          opacity: 0,
          background:
            "radial-gradient(120% 80% at 70% 0%, rgba(214,228,244,0.5), rgba(180,200,224,0.12) 45%, transparent 70%)",
        }}
      />
    </div>
  );
}
