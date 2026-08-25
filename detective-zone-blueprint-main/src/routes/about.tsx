import { createFileRoute } from "@tanstack/react-router";
import {
  Fingerprint,
  Search,
  Crosshair,
  FolderClosed,
  Brain,
  Puzzle,
  UserSearch,
  ScrollText,
} from "lucide-react";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

import { Atmosphere } from "@/components/noir/Atmosphere";
import { Reveal } from "@/components/noir/Reveal";
import { S3_MEDIA } from "@/lib/media";

const detectiveAlley = S3_MEDIA.about.detectiveAlley;
const evidenceBoard = S3_MEDIA.about.evidenceBoard;
const believeCrimeScene = S3_MEDIA.about.believeCrimeScene;
const believeEye = S3_MEDIA.about.believeEye;
const ctaDesk = S3_MEDIA.about.ctaDesk;
const believeClues = S3_MEDIA.about.evidenceBoard;

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Detectives Zone | We Create Mysteries, You Solve Them" },
      {
        name: "description",
        content:
          "Detectives Zone builds immersive detective experiences: realistic case files, evidence, clues and hidden secrets that challenge your observation and deduction.",
      },
      { property: "og:title", content: "About Detectives Zone — We Create Mysteries" },
      {
        property: "og:description",
        content:
          "Immersive detective case files filled with evidence, clues, statements and hidden secrets. Think. Investigate. Uncover.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const FEATURES = [
  { icon: FolderClosed, title: "EVERY CASE", sub: "HAS A STORY." },
  { icon: Search, title: "EVERY CLUE", sub: "HAS A PURPOSE." },
  { icon: Crosshair, title: "THE TRUTH IS", sub: "WAITING." },
];

const PURPOSE = [
  {
    icon: ScrollText,
    title: "REALISTIC CASE FILES",
    text: "Every case is carefully crafted to feel like a real investigation.",
  },
  {
    icon: Brain,
    title: "LOGIC, OBSERVATION & DEDUCTION",
    text: "Use your mind. Connect the dots. Solve the truth.",
  },
  {
    icon: Puzzle,
    title: "STORIES THAT CHALLENGE YOU",
    text: "Every detail matters. Every clue has a reason.",
  },
  {
    icon: UserSearch,
    title: "MADE FOR TRUE INVESTIGATORS",
    text: "For those who see beyond what others miss.",
  },
];

const BELIEFS = [
  {
    img: believeCrimeScene,
    title: "EVERY CASE HAS A STORY.",
    text: "Behind every crime lies a story waiting to be discovered.",
  },
  {
    img: believeClues,
    title: "EVERY CLUE HAS A PURPOSE.",
    text: "Nothing is placed by accident. Every detail leads somewhere.",
  },
  {
    img: believeEye,
    title: "THE TRUTH IS WAITING.",
    text: "The answers are there. You just have to find them.",
  },
];

function AboutPage() {
  const [cmsSettings, setCmsSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    api.getSettings().then((data) => {
      if (data) setCmsSettings(data);
    }).catch(() => {});
  }, []);

  return (
    <div className="about-noir noir-grain relative min-h-screen max-w-full overflow-x-clip bg-background">
      <Atmosphere />

      <main className="relative z-10 mx-auto max-w-[1500px] px-4 sm:px-6 pt-20 sm:pt-28 pb-16 sm:pb-24">
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="grid items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          <div>
            <p className="font-tech mb-4 sm:mb-6 text-[10px] sm:text-[11px] tracking-[0.35em] text-primary">// ABOUT US</p>

            <div className="dz-headline relative overflow-hidden">
              <h1 className="font-display text-[clamp(2.75rem,13vw,9.5rem)] leading-[0.88] tracking-tight sm:leading-[0.78]">
                <span data-text="ABOUT" className="text-glitch block text-foreground">
                  ABOUT
                </span>
                <span data-text="US" className="text-glitch block text-primary">
                  US
                </span>
              </h1>
              <div className="scanlines pointer-events-none absolute inset-0 opacity-25" />
            </div>

            <div className="mt-6 sm:mt-10 max-w-xl space-y-4 sm:space-y-5">
              <p className="font-display text-xl sm:text-2xl tracking-[0.08em] sm:tracking-[0.12em] text-foreground">
                {cmsSettings.about_page_headline || (
                  <>
                    WE CREATE MYSTERIES.
                    <br />
                    <span className="text-primary">YOU SOLVE THEM.</span>
                  </>
                )}
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                <strong className="text-primary">Detectives Zone</strong> is an immersive detective
                experience brand built for people who love mystery, investigation and the thrill of
                uncovering the truth.
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                We create realistic case files filled with{" "}
                <strong className="text-primary">
                  evidence, clues, statements, documents and hidden secrets
                </strong>{" "}
                designed to challenge your observation, logic and deduction.
              </p>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed text-foreground">
                And the truth is waiting to be discovered.
              </p>
            </div>
          </div>

          {/* Hero imagery */}
          <div className="relative mt-4 lg:mt-0">
            <div className="float-slow relative overflow-hidden border border-border/70">
              <img
                src={cmsSettings.about_alley_image || detectiveAlley}
                alt="Detective in a trench coat and fedora standing in a rainy alley at night"
                width={912}
                height={1408}
                className="h-[320px] sm:h-[440px] w-full object-cover opacity-90 lg:h-[560px]"
              />
            </div>

            <div className="absolute -right-2 top-8 hidden w-[42%] rotate-1 border border-border/60 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.95)] md:block">
              <img
                src={cmsSettings.about_board_image || evidenceBoard}
                alt="Evidence board with pinned photographs, maps, fingerprints and red connecting strings"
                width={704}
                height={1200}
                loading="lazy"
                className="h-[320px] w-full object-cover lg:h-[420px]"
              />
              <div className="string-glow pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_45%,color-mix(in_oklab,var(--blood)_35%,transparent)_100%)] opacity-50" />
            </div>

            <div className="absolute bottom-4 left-2 sm:bottom-16 sm:left-2 w-36 sm:w-40 -rotate-3 bg-paper p-3 sm:p-4 text-center font-display text-[10px] sm:text-xs leading-relaxed tracking-[0.12em] text-paper-foreground shadow-[0_20px_40px_-18px_rgb(0_0_0/0.9)]">
              TRUTH IS HIDDEN IN DETAILS
              <div className="tape absolute -top-3 left-1/2 h-5 w-14 -translate-x-1/2 -rotate-6" />
            </div>
          </div>
        </section>

        {/* ── FEATURE STRIP ─────────────────────────────────────── */}
        <Reveal className="mt-12 sm:mt-16">
          <div className="glass-card grid divide-y divide-border/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0 [perspective:1400px]">
            {FEATURES.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="lift-3d flex items-center gap-3 sm:gap-4 px-5 py-5 sm:px-8 sm:py-7">
                <Icon className="size-7 sm:size-8 shrink-0 text-primary" strokeWidth={1.2} />
                <p className="font-display text-xs sm:text-sm tracking-[0.14em] sm:tracking-[0.18em] text-foreground">
                  {title}
                  <br />
                  <span className="text-muted-foreground">{sub}</span>
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── OUR PURPOSE DOSSIER ───────────────────────────────── */}
        <Reveal className="mt-16 sm:mt-24">
          <div className="dossier relative overflow-hidden sm:overflow-visible p-5 sm:p-8 lg:p-12">
            <div className="tape absolute -left-4 -top-3 hidden sm:block sm:-left-6 sm:-top-5 h-8 w-24 sm:h-10 sm:w-32 -rotate-12" />
            <div className="tape absolute -right-4 -bottom-3 hidden sm:block sm:-right-6 sm:-bottom-5 h-8 w-24 sm:h-10 sm:w-32 -rotate-6" />
            <div className="grid gap-8 sm:gap-10 lg:grid-cols-[0.8fr_2fr]">
              <div>
                <p className="font-tech mb-3 sm:mb-4 text-[10px] tracking-[0.3em] text-primary/80">
                  DOSSIER DZ-00
                </p>
                <h2 className="font-display text-2xl sm:text-3xl tracking-[0.12em] sm:tracking-[0.14em]">
                  OUR <span className="text-primary">PURPOSE</span>
                </h2>
                <div className="mt-3 h-px w-20 sm:w-24 bg-primary" />
                <p className="mt-4 sm:mt-6 max-w-xs text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  To build the world's most engaging detective experiences where curiosity leads,
                  logic connects and truth is uncovered.
                </p>
                <div className="relative mt-6 sm:mt-10 flex size-24 sm:size-28 flex-col items-center justify-center rounded-full border-2 border-dashed border-primary/50 font-display text-[9px] sm:text-[10px] leading-tight tracking-[0.2em] text-primary/80">
                  <Fingerprint
                    className="absolute size-12 sm:size-14 text-primary opacity-15"
                    strokeWidth={0.8}
                  />
                  <span className="relative">TRUTH</span>
                  <span className="relative">SEEKER</span>
                </div>
              </div>

              <div className="grid gap-px bg-border/60 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 [perspective:1400px]">
                {PURPOSE.map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="lift-3d group relative bg-card/70 px-5 py-6 sm:px-6 sm:py-8 hover:bg-blood/[0.06]"
                  >
                    <div className="tape absolute -top-2 left-6 h-5 w-10" />
                    <Icon className="size-8 sm:size-9 text-primary" strokeWidth={1.2} />
                    <h3 className="mt-5 sm:mt-6 font-display text-xs sm:text-sm leading-snug tracking-[0.12em] sm:tracking-[0.14em] text-foreground">
                      {title}
                    </h3>
                    <p className="mt-3 sm:mt-4 text-xs leading-relaxed text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── WHAT WE BELIEVE ───────────────────────────────────── */}
        <section className="mt-16 sm:mt-24">
          <Reveal>
            <p className="font-tech mb-3 sm:mb-4 text-[10px] tracking-[0.3em] text-primary/80">
              FILE 003 — CASE PHILOSOPHY
            </p>
            <h2 className="font-display text-2xl sm:text-3xl tracking-[0.12em] sm:tracking-[0.14em]">
              WHAT WE <span className="text-primary">BELIEVE</span>
            </h2>
            <div className="mt-3 h-px w-24 sm:w-28 bg-primary" />
          </Reveal>

          <div className="mt-8 sm:mt-10 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 [perspective:1600px]">
            {BELIEFS.map(({ img, title, text }, i) => (
              <Reveal key={title} delay={i * 120}>
                <article className="glass-card lift-3d h-full overflow-hidden">
                  <img
                    src={img}
                    alt={title.toLowerCase()}
                    width={900}
                    height={640}
                    loading="lazy"
                    className="h-44 sm:h-56 w-full object-cover opacity-85"
                  />
                  <div className="p-5 sm:p-6">
                    <h3 className="font-display text-sm sm:text-base tracking-[0.12em] sm:tracking-[0.14em] text-foreground">
                      {title}
                    </h3>
                    <p className="mt-2.5 sm:mt-3 text-xs leading-relaxed text-muted-foreground">{text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── FINAL CTA DOSSIER ─────────────────────────────────── */}
        <Reveal className="mt-16 sm:mt-24">
          <div className="dossier relative overflow-hidden sm:overflow-visible grid items-center gap-8 sm:gap-10 p-5 sm:p-8 lg:grid-cols-[0.7fr_1.4fr_1fr] lg:p-12">
            <div className="relative rotate-0 sm:-rotate-2 bg-paper p-5 sm:p-6 text-paper-foreground shadow-[0_30px_60px_-30px_rgb(0_0_0/0.95)]">
              <div className="tape absolute -top-3 left-6 sm:-top-4 sm:left-8 h-6 w-20 sm:h-8 sm:w-24 -rotate-6" />
              <p className="font-display text-xs sm:text-sm tracking-[0.2em] text-primary">YOUR ROLE</p>
              <p className="mt-3 sm:mt-4 font-hand text-lg sm:text-xl leading-snug">
                You're not just a player.
                <br />
                You're the investigator.
                <br />
                You examine evidence.
                <br />
                You question everything.
                <br />
                You connect the dots.
                <br />
                You uncover the truth.
              </p>
              <Fingerprint className="mt-3 sm:mt-4 size-8 sm:size-10 opacity-40" strokeWidth={0.8} />
            </div>

            <div>
              <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl leading-[1.1] sm:leading-[1.05] tracking-[0.04em]">
                THINK LIKE A DETECTIVE.
                <br />
                <span className="text-primary">FIND THE TRUTH.</span>
              </h2>
              <p className="mt-4 sm:mt-6 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                The evidence is in front of you.
                <br />
                The truth is hidden in plain sight.
              </p>
              <p className="mt-4 sm:mt-6 inline-block border-b border-primary/60 pb-1 font-hand text-2xl sm:text-3xl text-primary">
                Are you ready?
              </p>
            </div>

            <div className="relative rotate-0 sm:rotate-2 border border-border/60">
              <img
                src={ctaDesk}
                alt="Detective desk with case files and photographs under lamp light"
                width={900}
                height={700}
                loading="lazy"
                className="h-48 sm:h-64 w-full object-cover opacity-85"
              />
              <div className="tape absolute -top-3 right-6 sm:-top-4 sm:right-8 h-6 w-20 sm:h-8 sm:w-24 rotate-6" />
            </div>
          </div>
        </Reveal>
      </main>
    </div>
  );
}
