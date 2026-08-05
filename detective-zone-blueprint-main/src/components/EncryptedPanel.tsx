import { useCallback, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const CHARS = "01ABCDEFGHIJKLMNOP01010101";
const LENS = 210;

export function EncryptedPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const [inside, setInside] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const lx = useSpring(mx, { stiffness: 220, damping: 26, mass: 0.6 });
  const ly = useSpring(my, { stiffness: 220, damping: 26, mass: 0.6 });
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const rows = useMemo(
    () =>
      Array.from({ length: 22 }, (_, r) =>
        Array.from({ length: 58 }, (_, c) => CHARS[(r * 7 + c * 3 + r * c) % CHARS.length]).join(""),
      ),
    [],
  );

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      mx.set(x);
      my.set(y);
      setPos({ x, y });
      setInside(true);
    },
    [mx, my],
  );

  const copy = (
    <p className="font-mono text-[13px] leading-[1.9] tracking-wide text-foreground">
      Detective Zone is an immersive story-driven investigation experience. You don't just solve
      puzzles — you uncover secrets, connect evidence, and expose the truth hidden beneath the
      shadows of the city.
    </p>
  );

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setInside(false)}
      className="relative min-h-[380px] overflow-hidden rounded-xl p-6"
      style={{
        background: "linear-gradient(160deg, oklch(0.2 0 0 / 0.9), oklch(0.145 0 0 / 0.95))",
        border: "0.7px solid oklch(0.75 0.09 78 / 0.16)",
        boxShadow:
          "inset 0 1px 0 0 oklch(1 0 0 / 0.05), inset 0 0 40px 0 oklch(0 0 0 / 0.55), 0 24px 60px -24px oklch(0 0 0 / 0.9)",
      }}
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          // What is Detective Zone?
        </p>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blood">001</span>
      </div>

      {/* encrypted field */}
      <div className="pointer-events-none absolute inset-x-6 top-16 bottom-14 overflow-hidden select-none">
        {rows.map((row, i) => (
          <p
            key={i}
            className="font-mono whitespace-nowrap text-[12px] leading-[1.55] tracking-[0.32em] text-foreground/12"
          >
            {row}
          </p>
        ))}
      </div>

      {/* hidden readable copy — only visible through the lens */}
      <motion.div
        animate={{ opacity: inside ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          maskImage: `radial-gradient(circle ${LENS / 2}px at ${pos.x}px ${pos.y}px, black 62%, transparent 82%)`,
          WebkitMaskImage: `radial-gradient(circle ${LENS / 2}px at ${pos.x}px ${pos.y}px, black 62%, transparent 82%)`,
        }}
      >
        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 md:inset-x-16">{copy}</div>
      </motion.div>

      {/* lens glass */}
      <motion.div
        animate={{ opacity: inside ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ x: lx, y: ly, width: LENS, height: LENS }}
        className="pointer-events-none absolute top-0 left-0 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full"
      >
        <div
          className="size-full rounded-full ring-1 ring-brass/40"
          style={{
            background:
              "radial-gradient(circle at 34% 26%, oklch(1 0 0/0.1), transparent 42%), radial-gradient(circle at 50% 50%, transparent 60%, oklch(0 0 0/0.35) 92%)",
            boxShadow:
              "inset 0 0 40px oklch(0 0 0/0.55), 0 0 40px oklch(0.75 0.09 78/0.18), 0 18px 50px oklch(0 0 0/0.7)",
          }}
        />
      </motion.div>

      <p className="font-mono absolute bottom-5 left-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        <span
          className="size-1.5 rounded-full bg-blood"
          style={{ boxShadow: "0 0 30px 0 oklch(0.46 0.196 26.5 / 0.55)" }}
        />
        Move cursor to reveal
      </p>
    </div>
  );
}
