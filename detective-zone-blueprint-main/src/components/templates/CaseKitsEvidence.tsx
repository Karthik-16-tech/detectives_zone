import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { HoverMember, type HoverMemberItem } from "@/components/v1/skiper6";

export interface KitEvidenceBoxItem {
  icon: LucideIcon;
  label: string;
  note: string;
}

export interface KitEvidenceCase {
  number: string;
  title: string;
  difficulty: string;
}

export interface KitEvidenceItem {
  id: string;
  code: string;
  name: string;
  tagline: string;
  image: string;
  badge: string;
  price: number;
  originalPrice: number;
  casesIncluded: number;
  itemsInBox: number;
  save: number;
  box: KitEvidenceBoxItem[];
  cases: KitEvidenceCase[];
}

export function CaseKitsEvidence() {
  const [activeCase, setActiveCase] = useState("CASE 001");

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[1500px] px-4 pt-14 pb-6 sm:px-8">
        <p className="text-[13px] font-semibold tracking-[0.28em] text-primary">EVIDENCE VAULT</p>
        <h2 className="font-display mt-3 text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[0.95] tracking-tight text-foreground">
          CASE <span className="text-primary">KITS</span>
        </h2>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Curated evidence lockers of the most requested cases. Each kit ships as a physical case
          box — hover a kit to see which cases live inside it and the items each case needs.
        </p>

        {/* ── case selector bar ── */}
        <div className="mt-8 flex w-fit items-center rounded-lg border border-[#1A1A1A] bg-[#0B0B0B] px-6 py-3">
          <div className="flex flex-wrap items-center gap-8">
            {["CASE 001"].map((c) => (
              <button
                key={c}
                onClick={() => setActiveCase(c)}
                onMouseEnter={() => setActiveCase(c)}
                className={`group relative inline-flex py-2 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 cursor-pointer ${
                  activeCase === c
                    ? "text-[#B31217] font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="relative">
                  {c}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] bg-blood transition-all duration-500 ease-out ${
                      activeCase === c
                        ? "w-full opacity-100"
                        : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                    }`}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Global style animations */}
        <style>{`
          @keyframes scan-line {
            0% { top: -2px; opacity: 0; }
            10% { opacity: 0.6; }
            90% { opacity: 0.6; }
            100% { top: 100%; opacity: 0; }
          }
        `}</style>
      </div>
    </section>
  );
}

/* ─── case kit cards — hover showcase ─── */
export function CaseKitCards({
  kits,
  images = [],
  onAdd,
}: {
  kits: KitEvidenceItem[];
  images?: string[];
  onAdd?: (kit: KitEvidenceItem) => void;
}) {
  if (kits.length === 0) return null;
  const kit = kits[0];

  const members: HoverMemberItem[] =
    images.length > 0
      ? images.map((image, i) => {
          const file =
            image
              .split("/")
              .pop()
              ?.replace(/\.[^.]+$/, "") ?? `evidence-${i + 1}`;
          const labels: Record<string, string> = {
            audio: "Exclusive Audio Evidence",
            camera: "Crime Scene Photographs",
            files: "Authentic Case Files",
            mobile: "Mobile Device Evidence",
            puzzle: "Hidden Clues & Puzzles",
            time: "Time Stamped Evidence",
          };
          const label = labels[file] ?? file;
          return {
            name: label,
            subtitle: `Case 001 Kit Contains`,
            image,
          };
        })
      : kit.cases.map((c, i) => ({
          name: c.title,
          subtitle: `${c.number} · ${c.difficulty}`,
          image: images[i] ?? kit.image,
        }));

  return (
    <section className="relative">
      {/* Section divider */}
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 sm:px-8">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C81D24]/30 to-transparent" />
        <span className="font-mono text-[10px] tracking-[0.3em] text-[#C81D24]/60 uppercase">
          Case Archive — Hover To Open
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C81D24]/30 to-transparent" />
      </div>

      <HoverMember
        teamMembers={members}
        defaultName={kit.name}
        backgroundColor="#040404"
        className="relative"
        onSelect={() => onAdd?.(kit)}
      />

      <p className="mx-auto max-w-[1400px] px-4 pb-2 text-center font-mono text-[10px] tracking-[0.2em] text-[#555] uppercase">
        Click a case kit to add it to your cart
      </p>
    </section>
  );
}
