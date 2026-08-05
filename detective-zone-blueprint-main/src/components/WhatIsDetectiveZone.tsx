import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { EncryptedPanel } from "@/components/EncryptedPanel";

export function WhatIsDetectiveZone() {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id="what-is" className="shell mt-32 scroll-mt-[64px]">
      <div className="grid grid-cols-12 items-center gap-10">
        {/* Encrypted dossier panel */}
        <div
          className={`col-span-12 lg:col-span-7 ${visible ? "rise" : "opacity-0"}`}
          style={visible ? { animationDelay: "0.05s" } : undefined}
        >
          <EncryptedPanel />
        </div>

        {/* Copy */}
        <div
          className={`col-span-12 lg:col-span-5 ${visible ? "rise" : "opacity-0"}`}
          style={visible ? { animationDelay: "0.2s" } : undefined}
        >
          <p className="caption text-blood">// What is Detective Zone?</p>
          <h2 className="mt-6 font-display text-[46px] leading-[0.95] font-bold uppercase">
            An archive of
            <br />
            unfinished truths
          </h2>
          <span className="mt-6 block h-[3px] w-[60px] bg-blood" />
          <p className="mt-6 max-w-md text-[14px] leading-relaxed text-muted-foreground">
            Detective Zone is an immersive, story-driven investigation experience. You don't just
            solve puzzles — you uncover secrets, connect evidence, and expose the truth hidden
            beneath the shadows of the city.
          </p>
          <Link
            to="/cases"
            className="group mt-9 inline-flex items-center gap-3 border border-blood/40 px-7 font-display text-[12px] tracking-[0.22em] uppercase text-blood transition-all duration-300 hover:border-blood hover:shadow-[0_0_24px_-4px_var(--blood)]"
            style={{ height: 54 }}
          >
            Begin the Investigation
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
