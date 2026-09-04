import { useCallback, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const CHARS = "M01AK17D9F02B7H3CG4NP073X8J1K8M9T3C2I1U0Z9F8A6J4M9T82C1F71122D1F1Z8F7J9K37DPZ28F7JM1ZD94EP128FJM11204LP1Z8FJM2N0F0G4HR3A000017K3D028FJMY1204LP1Z88381M1RZ02Z0LP8FJM";
const LENS = 220;

export function EncryptedPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const [inside, setInside] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const lx = useSpring(mx, { stiffness: 280, damping: 28, mass: 0.4 });
  const ly = useSpring(my, { stiffness: 280, damping: 28, mass: 0.4 });
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const rows = useMemo(
    () =>
      Array.from({ length: 22 }, (_, r) =>
        Array.from({ length: 58 }, (_, c) => CHARS[(r * 7 + c * 3 + r * c) % CHARS.length]).join(""),
      ),
    [],
  );

  const onMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      mx.jump(x);
      my.jump(y);
      setPos({ x, y });
      setInside(true);
    },
    [mx, my],
  );

  const onMouseMove = useCallback(
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

  const onTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length > 0) {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const x = e.touches[0].clientX - r.left;
        const y = e.touches[0].clientY - r.top;
        mx.jump(x);
        my.jump(y);
        setPos({ x, y });
        setInside(true);
      }
    },
    [mx, my],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length > 0) {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const x = e.touches[0].clientX - r.left;
        const y = e.touches[0].clientY - r.top;
        mx.set(x);
        my.set(y);
        setPos({ x, y });
        setInside(true);
      }
    },
    [mx, my],
  );

  const copy = (
    <div className="space-y-2.5">
      <p className="font-mono text-[12px] sm:text-[13px] leading-[1.8] tracking-wide text-white font-medium">
        In Detectives Zone, evidence is not always enough.
      </p>
      <p className="font-mono text-[12px] sm:text-[13px] leading-[1.8] tracking-wide text-white font-medium">
        Sometimes, the absence of evidence hides the loudest truths.
      </p>
    </div>
  );

  return (
    <div
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setInside(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={() => setInside(false)}
      className="relative min-h-[380px] sm:min-h-[400px] overflow-hidden rounded-xl p-5 sm:p-6 bg-black cursor-crosshair select-none"
      style={{
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow:
          "inset 0 1px 0 0 rgba(255, 255, 255, 0.05), inset 0 0 40px 0 rgba(0, 0, 0, 0.7), 0 24px 60px -24px rgba(0, 0, 0, 0.9)",
      }}
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">
          // WHAT IS DETECTIVE ZONE?
        </p>
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-blood">C05.</span>
      </div>

      {/* encrypted background code grid */}
      <div className="pointer-events-none absolute inset-x-5 sm:inset-x-6 top-14 bottom-14 overflow-hidden select-none">
        {rows.map((row, i) => (
          <p
            key={i}
            className="font-mono whitespace-nowrap text-[11px] sm:text-[12px] leading-[1.55] tracking-[0.28em] sm:tracking-[0.32em] text-white/[0.12]"
          >
            {row}
          </p>
        ))}
      </div>

      {/* hidden readable copy and lens — strictly only rendered when cursor is inside */}
      {inside && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              maskImage: `radial-gradient(circle ${LENS / 2}px at ${pos.x}px ${pos.y}px, black 70%, transparent 92%)`,
              WebkitMaskImage: `radial-gradient(circle ${LENS / 2}px at ${pos.x}px ${pos.y}px, black 70%, transparent 92%)`,
            }}
          >
            <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 md:inset-x-14 max-w-[280px] sm:max-w-xs">
              {copy}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            style={{ x: lx, y: ly, width: LENS, height: LENS }}
            className="pointer-events-none absolute top-0 left-0 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full"
          >
            <div
              className="size-full rounded-full border border-white/35"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.75) 100%)",
                boxShadow:
                  "inset 0 0 25px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.7)",
              }}
            />
          </motion.div>
        </>
      )}

      <p className="font-mono absolute bottom-5 left-5 sm:left-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-white/50">
        <span
          className="size-1.5 rounded-full bg-blood"
          style={{ boxShadow: "0 0 8px #e11d48" }}
        />
        MOVE CURSOR TO REVEAL
      </p>
    </div>
  );
}
