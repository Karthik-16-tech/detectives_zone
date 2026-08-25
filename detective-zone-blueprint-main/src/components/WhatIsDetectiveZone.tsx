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
    <section ref={ref} id="what-is" className="shell mt-16 sm:mt-24 lg:mt-32 scroll-mt-[64px]">
      <div className="flex flex-col lg:grid lg:grid-cols-12 lg:items-center gap-10 lg:gap-12">
        {/* Encrypted dossier panel */}
        <div
          className={`w-full lg:col-span-7 ${visible ? "rise" : "opacity-0"}`}
          style={visible ? { animationDelay: "0.05s" } : undefined}
        >
          <EncryptedPanel />
        </div>

        {/* Copy */}
        <div
          className={`w-full lg:col-span-5 ${visible ? "rise" : "opacity-0"}`}
          style={visible ? { animationDelay: "0.2s" } : undefined}
        >
          <p className="font-mono text-[11px] sm:text-[12px] tracking-[0.24em] text-blood uppercase font-medium">
            // WHAT IS DETECTIVE ZONE?
          </p>
          <h2 className="mt-5 sm:mt-6 font-display text-[38px] sm:text-[46px] lg:text-[50px] leading-[0.92] font-black uppercase tracking-tight text-white">
            AN ARCHIVE OF
            <br />
            UNFINISHED TRUTHS
          </h2>
          <span className="mt-4 sm:mt-5 block h-[3px] w-[54px] sm:w-[60px] bg-blood" />
          <p className="mt-5 sm:mt-6 max-w-lg text-[14px] sm:text-[15px] leading-relaxed text-white/75">
            Dive deep into unsolved cases, cold files, and hidden narratives that still wait for someone to piece them together.
          </p>
          <div className="mt-7 sm:mt-9">
            <Link
              to="/cases"
              className="group inline-flex items-center justify-between sm:justify-start gap-4 border border-blood/60 bg-black/60 backdrop-blur px-6 font-mono text-[11px] sm:text-[12px] tracking-[0.24em] uppercase text-blood transition-all duration-300 hover:border-blood hover:bg-blood hover:text-white w-full sm:w-auto h-[50px] sm:h-[54px]"
            >
              <span>BEGIN THE INVESTIGATION</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
