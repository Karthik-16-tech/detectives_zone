"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

import { S3_MEDIA } from "@/lib/media";

const {
  crimeScene: crimeSceneIcon,
  autopsyReport: autopsyReportIcon,
  witnessStatements: witnessStatementsIcon,
  digitalEvidence: digitalEvidenceIcon,
  documents: documentsIcon,
  evidencePhotos: evidencePhotosIcon,
  toolsGiven: investigativeToolsIcon,
  detectiveNotes: detectiveNotesIcon,
} = S3_MEDIA.moduleIcons;

// ─────────────────────────────────────────────────────────────────────────────
// BESPOKE INTERACTIVE FORENSIC ICONS (Large, tactile, high-contrast)
// ─────────────────────────────────────────────────────────────────────────────

function IconCrimeScene({ className, active }: { className?: string; active?: boolean }) {
  return (
    <img
      src={crimeSceneIcon}
      alt="Crime Scene Icon"
      className={cn(
        "object-contain transition-transform duration-300 select-none",
        className,
        active && "scale-105"
      )}
    />
  );
}

function IconAutopsy({ className, active }: { className?: string; active?: boolean }) {
  return (
    <img
      src={autopsyReportIcon}
      alt="Autopsy Report Icon"
      className={cn(
        "object-contain transition-transform duration-300 select-none",
        className,
        active && "scale-105"
      )}
    />
  );
}

function IconWitness({ className, active }: { className?: string; active?: boolean }) {
  return (
    <img
      src={witnessStatementsIcon}
      alt="Witness Statements Icon"
      className={cn(
        "object-contain transition-transform duration-300 select-none",
        className,
        active && "scale-105"
      )}
    />
  );
}

function IconDigital({ className, active }: { className?: string; active?: boolean }) {
  return (
    <img
      src={digitalEvidenceIcon}
      alt="Digital Evidence Icon"
      className={cn(
        "object-contain transition-transform duration-300 select-none",
        className,
        active && "scale-105"
      )}
    />
  );
}

function IconDocuments({ className, active }: { className?: string; active?: boolean }) {
  return (
    <img
      src={documentsIcon}
      alt="Documents Icon"
      className={cn(
        "object-contain transition-transform duration-300 select-none",
        className,
        active && "scale-105"
      )}
    />
  );
}

function IconPhotos({ className, active }: { className?: string; active?: boolean }) {
  return (
    <img
      src={evidencePhotosIcon}
      alt="Evidence Photos Icon"
      className={cn(
        "object-contain transition-transform duration-300 select-none",
        className,
        active && "scale-105"
      )}
    />
  );
}

function IconTools({ className, active }: { className?: string; active?: boolean }) {
  return (
    <img
      src={investigativeToolsIcon}
      alt="Tools Given Icon"
      className={cn(
        "object-contain transition-transform duration-300 select-none",
        className,
        active && "scale-105"
      )}
    />
  );
}

// Alias for backwards compatibility
const IconTimeline = IconTools;

function IconNotes({ className, active }: { className?: string; active?: boolean }) {
  return (
    <img
      src={detectiveNotesIcon}
      alt="Detective Notes Icon"
      className={cn(
        "object-contain transition-transform duration-300 select-none",
        className,
        active && "scale-105"
      )}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA & ICON REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_MODULES = [
  {
    n: 1,
    num: "01",
    title: "Crime Scene",
    desc: "We provide a secure Drive link inside the kit containing full crime scene video files and authentic audio recordings to explore the scene.",
    pct: 75,
    icon: IconCrimeScene,
  },
  {
    n: 2,
    num: "02",
    title: "Autopsy Report",
    desc: "We provide official sealed coroner reports, toxicological blood panels, and trauma anatomical diagrams to establish time and cause of death.",
    pct: 60,
    icon: IconAutopsy,
  },
  {
    n: 3,
    num: "03",
    title: "Witness Statements",
    desc: "We provide verbatim police interrogation transcripts, signed eyewitness affidavits, and suspect alibi logs to detect lies and contradictions.",
    pct: 45,
    icon: IconWitness,
  },
  {
    n: 4,
    num: "04",
    title: "Digital Evidence",
    desc: "We provide extracted suspect phone records, encrypted chat histories, cell tower triangulation logs, and surveillance CCTV footage.",
    pct: 30,
    icon: IconDigital,
  },
  {
    n: 5,
    num: "05",
    title: "Documents",
    desc: "We provide confidential forensic dossier files, authentic bank statements, search warrants, and original handwritten correspondence.",
    pct: 40,
    icon: IconDocuments,
  },
  {
    n: 6,
    num: "06",
    title: "Evidence Photos",
    desc: "We provide high-resolution glossy crime scene polaroids, macro fingerprint lifts, ballistics captures, and suspect surveillance photographs.",
    pct: 50,
    icon: IconPhotos,
  },
  {
    n: 7,
    num: "07",
    title: "Tools Given",
    desc: "We provide authentic physical investigative tools including optical inspection magnifiers, fingerprint cards, and forensic loupes inside the kit.",
    pct: 35,
    icon: IconTools,
  },
  {
    n: 8,
    num: "08",
    title: "Detective Notes",
    desc: "We provide official investigator casebook worksheets, suspect motive matrices, and step-by-step procedural deduction logs to crack the case.",
    pct: 20,
    icon: IconNotes,
  },
];

export interface ModuleItem {
  n?: number;
  num?: string;
  code?: string;
  icon?: any;
  title: string;
  desc: string;
  pct?: number;
}

export interface InvestigationModulesProps {
  modules?: ModuleItem[];
  className?: string;
}

/**
 * HoverExpandModules - Clean Industrial Brutalist expanding cards (ZERO images, ZERO neon glow)
 */
function HoverExpandModules({
  items,
}: {
  items: {
    n: number;
    num: string;
    title: string;
    desc: string;
    pct: number;
    icon: any;
  }[];
}) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <div className="w-full">
      {/* Horizontal flex container with smooth scroll on mobile */}
      <div className="flex w-full items-center justify-start lg:justify-center gap-2 sm:gap-3 overflow-x-auto pb-4 pt-1 no-scrollbar snap-x">
        {items.map((m, index) => {
          const isActive = activeIndex === index;
          const IconComponent = m.icon;

          return (
            <motion.div
              key={m.n}
              className={cn(
                "relative cursor-pointer overflow-hidden rounded-2xl border transition-colors duration-200 shrink-0 snap-center select-none",
                isActive
                  ? "border-[#B31217] bg-[#000000]"
                  : "border-[#1C1C1C] bg-[#070707] hover:border-[#2C2C2C] hover:bg-[#0A0A0A]"
              )}
              initial={{ width: "4.8rem", height: "26.5rem" }}
              animate={{
                width: isActive ? "25.5rem" : "4.8rem",
                height: "26.5rem",
              }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
            >
              {/* COLLAPSED STATE (Slim vertical bar with prominent icon) */}
              <AnimatePresence>
                {!isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 flex flex-col items-center justify-between py-6 px-1.5 pointer-events-none"
                  >
                    {/* Top Number */}
                    <span className="font-mono text-[11px] font-bold text-[#B31217] tracking-wider">
                      {m.num}
                    </span>

                    {/* Middle Interactive Icon - Background-free & borderless */}
                    <div className="h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center text-neutral-300">
                      <IconComponent className="h-full w-full object-contain" active={false} />
                    </div>

                    {/* Vertical Rotated Title */}
                    <div
                      style={{ writingMode: "vertical-rl" }}
                      className="rotate-180 font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-neutral-400 whitespace-nowrap"
                    >
                      {m.title}
                    </div>

                    {/* Bottom Percentage */}
                    <span className="font-mono text-[10px] font-semibold text-neutral-500 tabular-nums">
                      {m.pct}%
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* EXPANDED STATE (Full text & BIG background-free interactive focal icon) */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.22, delay: 0.05 }}
                    className="absolute inset-0 flex flex-col justify-between p-6 sm:p-7 pointer-events-none bg-[#020202]"
                  >
                    {/* Top Row: Module Number & Depth Badge (Solid tactical colors, no neon) */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold tracking-wider text-white bg-[#B31217] px-3 py-1 rounded">
                        {m.num}
                      </span>

                      <span className="font-mono text-[10px] font-bold tracking-wider text-neutral-300 bg-[#0E0E0E] border border-[#222222] px-3 py-1 rounded">
                        {m.pct}% FORENSIC DEPTH
                      </span>
                    </div>

                    {/* Center Content: BIG Background-Free Hero Icon & Details */}
                    <div className="my-auto py-2 flex flex-col items-start">
                      {/* Big Background-Free Interactive Icon */}
                      <div className="h-32 w-32 sm:h-36 sm:w-36 flex items-center justify-start text-[#B31217] mb-3">
                        <IconComponent className="h-full w-full object-contain" active={true} />
                      </div>

                      {/* Title */}
                      <h3
                        className="font-display text-[28px] sm:text-[32px] font-black uppercase tracking-wide text-white leading-none"
                        style={{ fontFamily: "Bebas Neue, sans-serif" }}
                      >
                        {m.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-2.5 text-[13px] sm:text-[13.5px] leading-relaxed text-neutral-300 font-sans max-w-xs">
                        {m.desc}
                      </p>
                    </div>

                    {/* Bottom: Solid Progress Bar (Zero neon glow) */}
                    <div className="pt-3.5 border-t border-[#161616]">
                      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-1.5">
                        <span>Forensic Depth</span>
                        <span className="text-[#B31217] font-bold">{m.pct}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#121212] overflow-hidden">
                        <motion.div
                          className="h-full bg-[#B31217]"
                          initial={{ width: 0 }}
                          animate={{ width: `${m.pct}%` }}
                          transition={{ duration: 0.4, delay: 0.05 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

const ICON_KEY_MAP: Record<string, any> = {
  crimeScene: IconCrimeScene,
  "crime-scene": IconCrimeScene,
  "Crime Scene": IconCrimeScene,
  autopsyReport: IconAutopsy,
  "autopsy-report": IconAutopsy,
  "Autopsy Report": IconAutopsy,
  witnessStatements: IconWitness,
  "witness-statements": IconWitness,
  "Witness Statements": IconWitness,
  digitalEvidence: IconDigital,
  "digital-evidence": IconDigital,
  "Digital Evidence": IconDigital,
  documents: IconDocuments,
  Documents: IconDocuments,
  evidencePhotos: IconPhotos,
  "evidence-photos": IconPhotos,
  "Evidence Photos": IconPhotos,
  toolsGiven: IconTools,
  "tools-given": IconTools,
  "Tools Given": IconTools,
  detectiveNotes: IconNotes,
  "detective-notes": IconNotes,
  "Detective Notes": IconNotes,
};

function resolveModuleIcon(iconVal: any, defaultIcon: any, title?: string) {
  if (!iconVal) return defaultIcon;
  if (typeof iconVal === "function") return iconVal;
  if (typeof iconVal === "string") {
    const trimmed = iconVal.trim();
    if (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("/") ||
      trimmed.startsWith("data:")
    ) {
      return ({ className, active }: { className?: string; active?: boolean }) => (
        <img
          src={trimmed}
          alt={title || "Module Icon"}
          className={cn(
            "object-contain transition-transform duration-300 select-none",
            className,
            active && "scale-105"
          )}
        />
      );
    }
    if (ICON_KEY_MAP[trimmed]) {
      return ICON_KEY_MAP[trimmed];
    }
  }
  return defaultIcon;
}

/**
 * Main InvestigationModules Component
 */
export function InvestigationModules({ modules, className }: InvestigationModulesProps) {
  const displayModules = modules && modules.length > 0
    ? modules.map((m, idx) => {
        const defaultM = DEFAULT_MODULES[idx % DEFAULT_MODULES.length];
        const isTimeline = m.title === "Timeline" || m.title === "Timeline Reconstruction";
        const title = (idx === 6 && isTimeline) ? defaultM.title : (m.title || defaultM.title);
        const desc = m.desc && m.desc.trim() ? m.desc : defaultM.desc;
        const icon = resolveModuleIcon(m.icon, defaultM.icon, title);

        return {
          n: m.n || idx + 1,
          num: m.num || String(m.n || idx + 1).padStart(2, "0"),
          title,
          desc,
          pct: m.pct !== undefined ? m.pct : defaultM.pct,
          icon,
        };
      })
    : DEFAULT_MODULES;

  return (
    <section className={cn("rounded-2xl border border-[#181818] bg-[#020202] p-5 sm:p-8 relative overflow-hidden", className)}>
      {/* Header section (Tagline removed) */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 border-b border-[#161616]">
        <div>
          <h2 
            className="font-display text-[28px] sm:text-[36px] font-black uppercase text-white tracking-tight leading-none"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            MODULES WE PROVIDE
          </h2>
          <p className="mt-2 text-[13px] sm:text-[14px] text-neutral-400 font-sans leading-relaxed">
            Explore all investigative sections, forensic logs, and deduction tools included in the case.
          </p>
        </div>
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-semibold shrink-0 bg-[#0A0A0A] border border-[#1E1E1E] px-3 py-1.5 rounded">
          {displayModules.length} Modules Available
        </span>
      </div>

      {/* Interactive Expandable Hover Cards (Big Icon centerpieces, True Black layout) */}
      <div className="relative z-10 mt-6">
        <HoverExpandModules items={displayModules} />
      </div>
    </section>
  );
}

/**
 * Backwards compatibility exports
 */
export const HoverExpand_001 = HoverExpandModules;
export const Skiper52 = () => <InvestigationModules />;
