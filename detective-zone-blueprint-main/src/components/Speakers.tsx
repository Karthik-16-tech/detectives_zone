import { AnimatePresence, motion } from "motion/react";
import { Star } from "lucide-react";
import { useState } from "react";

import speakerMain from "@/assets/testimonals/speaker-main.jpg";
import speaker2 from "@/assets/testimonals/speaker-2.jpg";
import speaker3 from "@/assets/testimonals/speaker-3.jpg";
import speaker4 from "@/assets/testimonals/speaker-4.jpg";

type Speaker = {
  name: string;
  role: string;
  desc: string;
  img: string;
  thumb: string;
};

const speakers: Speaker[] = [
  {
    name: "Aarav Rao",
    role: "Detective · 12 Cases Closed",
    desc: "Every evidence box shipped exactly as the case file promised. The room key clue had me stuck for an hour — then the puzzle snapped into place. Genuinely the best mystery I've solved.",
    img: speakerMain,
    thumb: speakerMain,
  },
  {
    name: "Meera Iyer",
    role: "Forensic Consultant · Case 002",
    desc: "The fingerprint files and time-stamped evidence make you feel like you're sitting in the interrogation room. I've worked every case and the final twist still got me.",
    img: speaker2,
    thumb: speaker2,
  },
  {
    name: "Vikram Singh",
    role: "Private Investigator",
    desc: "Detective Zone respects the craft. No hand-holding, just a sealed case file and your own deductions. It sharpens the exact instincts I rely on out in the field.",
    img: speaker3,
    thumb: speaker3,
  },
  {
    name: "Zoya Khan",
    role: "Cold Case Specialist",
    desc: "From the voicemail to the pocket watch, every detail is a planted clue. I cracked Case 001 at 3AM and honestly? Worth every lost hour of sleep.",
    img: speaker4,
    thumb: speaker4,
  },
];

export function Speakers() {
  const [active, setActive] = useState(0);
  const cur = speakers[active]!;

  return (
    <section className="relative w-full overflow-hidden bg-[#020202] py-20 lg:py-32">
      {/* ambient grid + glow */}
      <div className="pointer-events-none absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:60px_60px]" />
      <div className="pointer-events-none absolute left-0 top-1/3 h-[500px] w-[500px] rounded-full bg-[#0066ff]/[0.06] blur-[120px]" />

      <div className="mx-auto max-w-[1400px] px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold uppercase tracking-[0.05em] text-white"
        >
          TESTIMONIALS
        </motion.h2>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
          {/* Featured card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative min-h-[340px] overflow-hidden rounded-[28px] border border-white/12 bg-black sm:min-h-0"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={cur.img}
                src={cur.img}
                alt={cur.name}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="h-[340px] w-full object-contain sm:h-[440px] lg:h-[520px]"
              />
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />

            <AnimatePresence mode="wait">
              <motion.div
                key={cur.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="absolute bottom-4 left-4 w-[calc(100%-2rem)] rounded-[18px] border border-white/15 bg-black/60 p-4 backdrop-blur-xl sm:bottom-6 sm:left-6 sm:w-[min(400px,80%)] sm:p-6"
              >
                <h3 className="text-[22px] font-light text-white">{cur.name}</h3>
                <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.25em] text-white/55">
                  {cur.role}
                </p>
                <div className="mt-3 h-px w-full bg-white/15" />
                <p className="mt-3 text-[12.5px] font-light leading-relaxed text-white/70">
                  {cur.desc}
                </p>
                <div className="mt-4 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#e8b71d] text-[#e8b71d]" />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Sidebar list */}
          <div className="flex flex-row gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
            {speakers.map((sp, i) => (
              <motion.button
                key={sp.name}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                whileHover={{ x: -4 }}
                className={`group flex shrink-0 items-center gap-3 rounded-2xl border p-2 pr-4 backdrop-blur-md transition-all ${
                  active === i
                    ? "border-white/30 bg-white/[0.05] shadow-[0_0_30px_-10px_rgba(0,102,255,0.5)]"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <img
                  src={sp.thumb}
                  alt={sp.name}
                  loading="lazy"
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <div className="min-w-0 text-left">
                  <div className="truncate text-[12px] font-light leading-tight text-white">
                    {sp.name.split(" ")[0]}
                  </div>
                  <div className="truncate text-[12px] font-light leading-tight text-white/60">
                    {sp.name.split(" ").slice(1).join(" ")}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
