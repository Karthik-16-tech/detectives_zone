import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

interface MagnifyingLensProps {
  zoomImage?: string;
  active?: boolean;
  scale?: number;
  bgPos?: { x: number; y: number; w: number; h: number };
}

export function MagnifyingLens({
  zoomImage,
  active = true,
  scale = 2.2,
  bgPos,
}: MagnifyingLensProps) {
  const mouseX = useMotionValue(-300);
  const mouseY = useMotionValue(-300);
  const [visible, setVisible] = useState(false);

  const x = useSpring(mouseX, {
    stiffness: 180,
    damping: 20,
    mass: 0.6,
  });

  const y = useSpring(mouseY, {
    stiffness: 180,
    damping: 20,
    mass: 0.6,
  });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 80);
      mouseY.set(e.clientY - 80);
      if (!visible) setVisible(true);
    };

    const handleLeave = () => setVisible(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, [mouseX, mouseY, visible]);

  if (!active) return null;

  return (
    <motion.div
      style={{ x, y, opacity: visible ? 1 : 0 }}
      transition={{ opacity: { duration: 0.2 } }}
      className="pointer-events-none fixed left-0 top-0 z-50"
    >
      {/* Lens */}
      <div className="relative h-40 w-40 rounded-full border border-white/40 bg-white/10 shadow-[0_0_40px_rgba(255,255,255,0.08),inset_0_0_20px_rgba(255,255,255,0.12)] backdrop-blur-sm overflow-visible">
        {/* Magnified content / Live Zoom viewport */}
        {zoomImage && bgPos ? (
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              backgroundImage: `url(${zoomImage})`,
              backgroundRepeat: "no-repeat",
              backgroundColor: "#050505",
              backgroundSize: `${Math.round(bgPos.w)}px ${Math.round(bgPos.h)}px`,
              backgroundPosition: `${Math.round(bgPos.x)}px ${Math.round(bgPos.y)}px`,
              filter: "brightness(1.4) contrast(1.12) sepia(0.08)",
              boxShadow: "inset 0 0 20px rgba(0,0,0,0.6)",
            }}
          />
        ) : (
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "center",
              background: "inherit",
            }}
          />
        )}

        {/* Glass reflection highlight */}
        <div className="absolute left-5 top-4 h-10 w-10 rounded-full bg-white/20 blur-sm pointer-events-none" />

        {/* Inner brass/silver ring */}
        <div className="absolute inset-2 rounded-full border border-white/20 pointer-events-none" />
      </div>

      {/* Handle */}
      <div className="absolute left-[118px] top-[118px] h-24 w-3 origin-top rounded-full bg-gradient-to-b from-neutral-500 to-neutral-900 rotate-45 shadow-lg pointer-events-none" />
    </motion.div>
  );
}
