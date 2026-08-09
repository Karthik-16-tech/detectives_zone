import { useEffect, useState } from "react";

/** Mouse-follow flashlight + rain overlay. Purely decorative. */
export function Atmosphere() {
  const [pos, setPos] = useState({ x: 0.5, y: 0.3 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      <div
        className="absolute inset-0 transition-[background] duration-300"
        style={{
          background: `radial-gradient(420px circle at ${pos.x * 100}% ${pos.y * 100}%, color-mix(in oklab, var(--foreground) 9%, transparent), transparent 70%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, transparent 40%, rgb(0 0 0 / 0.75) 100%)",
        }}
      />
    </div>
  );
}
