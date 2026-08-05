import { Play } from "lucide-react";

import hero from "@/assets/noir-street.jpg";

export function HeroVideoCard() {
  return (
    <section className="panel group relative overflow-hidden">
      <img
        src={hero}
        alt="The victim's study: a dark detective office with a desk lamp, case files and rain on the window"
        width={1280}
        height={720}
        className="h-[340px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] xl:h-[380px]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0_0_0/0.35),oklch(0_0_0/0.85))]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
        <button
          aria-label="Play case introduction video"
          className="grid size-[74px] place-items-center rounded-full border border-foreground/70 bg-background/25 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-[var(--glow-red)]"
        >
          <Play className="ml-1 size-7 fill-current" />
        </button>
        <div className="text-center">
          <h2 className="font-display text-base font-semibold uppercase tracking-[0.18em]">
            Case Introduction Video
          </h2>
          <p className="label-xs mt-2 text-muted-foreground">12:45 Min</p>
        </div>
      </div>
    </section>
  );
}

export default HeroVideoCard;
