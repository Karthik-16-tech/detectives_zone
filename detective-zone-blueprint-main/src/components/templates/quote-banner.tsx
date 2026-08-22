import { Fingerprint } from "lucide-react";

import alley from "@/assets/evidencce/alley.jpg";

interface QuoteBannerProps {
  quote?: string;
  author?: string;
}

export function QuoteBanner({ quote, author }: QuoteBannerProps) {
  return (
    <section className="panel grain relative grid grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_460px]">
      <div className="flex items-start gap-7 px-6 py-10 sm:px-10 sm:py-12">
        <span className="font-display text-6xl leading-none text-primary" aria-hidden="true">
          &ldquo;
        </span>
        <blockquote className="min-w-0">
          <p className="font-display text-2xl leading-snug">
            {quote ? (
              quote
            ) : (
              <>
                The <span className="text-primary">truth</span> is buried under layers of lies.
                <br />
                Only the sharpest mind can dig it out.&rdquo;
              </>
            )}
          </p>
          <footer className="label-xs mt-5 text-muted-foreground">
            {author || "— Detective Zone"}
          </footer>
        </blockquote>
      </div>

      <div className="relative hidden min-h-[180px] lg:block">
        <Fingerprint
          className="absolute left-6 top-1/2 z-10 size-32 -translate-y-1/2 text-foreground/10"
          strokeWidth={0.6}
        />
        <img
          src={alley}
          alt="Silhouette of a detective walking down a rainy alley"
          loading="lazy"
          width={1152}
          height={576}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--card),oklch(0_0_0/0.2))]" />
      </div>
    </section>
  );
}
