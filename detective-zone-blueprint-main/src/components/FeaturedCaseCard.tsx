import { ArrowRight } from "lucide-react";
import noirImage from "@/assets/case-voicemail.png";
import { AudioPlayer } from "@/components/AudioPlayer";
import { CaseStamp } from "@/components/CaseStamp";
import { PaperClip } from "@/components/PaperClip";
import { Link } from "@tanstack/react-router";

interface FeaturedCaseCardProps {
  title?: string;
  description?: string;
  caseNumber?: string;
  caseId?: string;
  onView?: () => void;
}

export function FeaturedCaseCard({
  title = "The Last\nVoicemail",
  description = "A successful businessman found dead.\nNo forced entry. No clear motive.\nJust a voicemail… and questions.",
  caseNumber = "#001",
  caseId = "001",
  onView,
}: FeaturedCaseCardProps) {
  return (
    <div className="relative w-full max-w-[16rem] pt-4">
      {/* Folder back sheets */}
      <span
        aria-hidden="true"
        className="absolute inset-x-2.5 bottom-[-7px] top-4 rounded-[1.3rem] border border-accent/15 bg-surface shadow-[0_18px_45px_oklch(0_0_0/0.7)]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-1 bottom-[-3.5px] top-5 rounded-[1.3rem] border border-accent/20 bg-card/80"
      />

      {/* Folder tab */}
      <div
        className="absolute right-3 top-0 z-20 rotate-[-2deg] rounded-md rounded-bl-none bg-paper px-3 py-0.5 text-center shadow-[0_4px_10px_oklch(0_0_0/0.6)]"
        style={{ clipPath: "polygon(6% 0, 100% 0, 100% 100%, 0 100%)" }}
      >
        <p className="font-typewriter text-[0.58rem] font-bold leading-tight tracking-[0.09em] text-paper-ink">
          CASE FILE
        </p>
        <p className="font-typewriter text-[0.58rem] font-bold leading-tight tracking-[0.09em] text-paper-ink">
          {caseNumber}
        </p>
      </div>

      <article className="relative z-10 overflow-visible rounded-[1.3rem] border border-accent/25 bg-card p-3.5 shadow-card ring-1 ring-inset ring-border/60 transition-colors duration-300 hover:border-accent/40 sm:p-3.5">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-3 top-2 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent"
        />

        {/* Featured case plaque */}
        <div className="relative z-20 inline-flex items-center gap-1 rounded-[0.25rem] border border-accent/35 bg-gradient-to-b from-surface to-background px-2.5 py-0.5 shadow-[inset_0_1px_0_oklch(1_0_0/0.06),inset_0_-2px_6px_oklch(0_0_0/0.6),0_2px_6px_oklch(0_0_0/0.55)]">
          <span className="text-[0.48rem] text-accent">★</span>
          <span className="text-engraved font-typewriter text-[0.62rem] font-bold uppercase tracking-[0.2em] text-paper">
            Featured Case
          </span>
          <span className="text-[0.48rem] text-accent">★</span>
        </div>

        {/* Photo with clip and stamp */}
        <div className="relative mt-2.5">
          <div className="rounded-sm border-[3px] border-paper/70 shadow-[0_6px_20px_oklch(0_0_0/0.6)]">
            <img
              src={noirImage}
              alt="Case 001 cover photo"
              width={1024}
              height={768}
              loading="lazy"
              className="h-28 w-full object-cover grayscale-[0.2] sm:h-30"
            />
          </div>

          <PaperClip className="absolute -top-5 right-4 z-20 h-11 w-4" />
          <CaseStamp className="absolute -bottom-10 -right-3 z-20 scale-60 origin-bottom-right translate-y-1" />
        </div>

        {/* Title */}
        <div className="mt-3.5 flex items-start justify-between gap-1.5">
          <h2 className="text-cinematic whitespace-pre-line font-typewriter text-[1.12rem] font-normal leading-[1.1] tracking-[0.01em]">
            {title}
          </h2>
        </div>

        <div className="mt-2 h-px w-full bg-gradient-to-r from-accent/40 via-accent/15 to-transparent" />

        <div className="mt-2.5">
          <AudioPlayer duration={105} compact />
        </div>

        <Link
          to="/cases/$caseId"
          params={{ caseId }}
          onClick={onView}
          className="group mt-2.5 flex w-full items-stretch overflow-hidden rounded-md border border-accent/50 transition-colors duration-300 hover:border-accent hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        >
          <span className="text-gold-glow flex flex-1 items-center justify-center px-2.5 py-1.5 font-typewriter text-[0.68rem] font-bold uppercase tracking-[0.22em]">
            View Case
          </span>
          <span className="flex w-8 items-center justify-center border-l border-accent/40 text-accent">
            <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </Link>
      </article>
    </div>
  );
}
