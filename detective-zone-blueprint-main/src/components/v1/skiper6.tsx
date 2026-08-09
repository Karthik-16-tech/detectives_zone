import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface HoverMemberItem {
  name: string;
  image: string;
  subtitle?: string;
}

function splitChars(text: string) {
  return text.split("");
}

export function HoverMember({
  teamMembers,
  defaultName,
  className,
  backgroundColor = "#040404",
  textColor = "#C7C7C7",
  hoverTextColor = "#B31217",
  onSelect,
  onHover,
}: {
  teamMembers: HoverMemberItem[];
  defaultName?: string;
  className?: string;
  backgroundColor?: string;
  textColor?: string;
  hoverTextColor?: string;
  onSelect?: (member: HoverMemberItem, index: number) => void;
  onHover?: (index: number | null) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  const handleHover = (i: number | null) => {
    setHovered(i);
    onHover?.(i);
  };

  const activeName = hovered !== null ? teamMembers[hovered]?.name : (defaultName ?? "");

  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{ background: backgroundColor }}
    >
      {/* ── hovered kit — image + text reveal ── */}
      <div className="flex min-h-[150px] items-center justify-center gap-6 px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeName}
            className="flex items-center gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {hovered !== null && teamMembers[hovered]?.image && (
              <motion.div
                className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border"
                style={{ borderColor: "rgba(255,255,255,0.12)" }}
                initial={{ scale: 0.7, rotate: -6 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <img
                  src={teamMembers[hovered].image}
                  alt={teamMembers[hovered].name}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            )}
            <div className="text-left">
              {hovered !== null && teamMembers[hovered]?.subtitle && (
                <motion.p
                  className="font-mono text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: hoverTextColor }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05, duration: 0.35 }}
                >
                  {teamMembers[hovered].subtitle}
                </motion.p>
              )}
              <motion.h3
                className="font-display text-[clamp(2rem,6vw,4.5rem)] font-bold uppercase tracking-wide leading-none"
                style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  color: hovered !== null ? hoverTextColor : textColor,
                }}
              >
                {splitChars(activeName).map((ch, i) => (
                  <motion.span
                    key={`${activeName}-${i}`}
                    className="inline-block whitespace-pre"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </motion.h3>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── image grid ── */}
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-start justify-center gap-4 px-4 pb-12 pt-8">
        {teamMembers.map((member, i) => (
          <motion.div
            key={member.name}
            className="group relative w-[120px] cursor-pointer sm:w-[140px]"
            onMouseEnter={() => handleHover(i)}
            onMouseLeave={() => handleHover(hovered === i ? null : hovered)}
            onClick={() => onSelect?.(member, i)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ delay: i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative aspect-square overflow-hidden rounded-xl border" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <img
                src={member.image}
                alt={member.name}
                loading="lazy"
                className={`h-full w-full object-cover transition-all duration-700 ease-out ${
                  hovered === i ? "scale-110 grayscale-0" : "scale-100 grayscale"
                }`}
              />
            </div>
            {/* ── caption below the card — revealed on hover ── */}
            <div
              className="mt-3 px-1 text-center transition-all duration-300"
              style={{
                opacity: hovered === i ? 1 : 0,
                transform: hovered === i ? "translateY(0)" : "translateY(6px)",
              }}
            >
              <p
                className="font-mono text-[8px] uppercase tracking-[0.2em] transition-colors duration-300"
                style={{ color: hoverTextColor }}
              >
                {member.subtitle ?? `0${i + 1}`}
              </p>
              <p
                className="font-display mt-1 text-[18px] font-bold uppercase leading-none tracking-wide"
                style={{ fontFamily: "Bebas Neue, sans-serif", color: hoverTextColor }}
              >
                {member.name}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
