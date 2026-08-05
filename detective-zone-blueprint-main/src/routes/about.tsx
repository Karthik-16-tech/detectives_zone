import { createFileRoute, Link } from "@tanstack/react-router";
import { Fingerprint } from "lucide-react";

import heroImg from "@/assets/detective-hero.png";
import noirStreet from "@/assets/noir-street.jpg";
import evidenceRoom from "@/assets/evidence-room.jpg";
import { PersonnelGrid } from "@/components/templates/personnel-card";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#C7C7C7] font-sans pt-[72px] relative overflow-hidden">
      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-8 py-10">
        {/* PAGE HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#1A1A1A]/80 pb-7 mb-10 gap-4">
          <div>
            <h1
              className="font-display text-[64px] font-bold text-white tracking-[2px] leading-none uppercase"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
            >
              About Us
            </h1>
            <p className="text-[12px] text-[#A0A0A0] font-mono tracking-[1.5px] uppercase mt-2">
              The unit behind the investigations
            </p>
          </div>
          <div className="font-mono text-[10px] tracking-[2px] text-muted-foreground uppercase">
            <Link to="/" className="hover:text-white transition-colors duration-300">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#B31217]">About Us</span>
          </div>
        </header>

        {/* MISSION */}
        <section className="grid grid-cols-12 gap-8 items-center mb-16">
          <div className="col-span-12 lg:col-span-7">
            <span className="inline-flex items-center gap-2 border border-blood/40 bg-blood/10 px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-blood uppercase mb-6">
              <Fingerprint className="h-3 w-3" />
              Agency Dossier — DZ
            </span>
            <h2
              className="font-display text-[40px] font-bold text-white tracking-[1px] uppercase leading-none"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
            >
              Truth isn't given.
              <br />
              <span className="text-[#B31217]">It's discovered.</span>
            </h2>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-[#B5B5B5]">
              Detective Zone is a story-driven investigation house. We design physical and digital
              mystery cases that reward the patient eye and punish the quick guess. Every file is
              built with real evidence, layered clues and a trail that only the sharpest detective
              can follow to the end.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "10K+", label: "Active Detectives" },
                { value: "06", label: "Cases In Rotation" },
                { value: "04", label: "Core Team" },
                { value: "99%", label: "Solved By Deduction" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="p-5 bg-[#0B0B0B] border border-[#1A1A1A] rounded-lg text-center"
                  style={{ boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.02)" }}
                >
                  <span
                    className="font-display text-[36px] font-bold text-[#B31217] leading-none block"
                    style={{ fontFamily: "Bebas Neue, sans-serif" }}
                  >
                    {s.value}
                  </span>
                  <span className="text-[10px] text-[#A0A0A0] tracking-widest uppercase mt-2 block">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PERSONNEL FILES */}
        <section className="border-t border-[#1A1A1A]/80 pt-12">
          <div className="flex items-center gap-3 mb-8">
            <span className="h-8 w-1 bg-[#B31217]" />
            <div>
              <h2
                className="font-display text-[44px] font-bold text-white tracking-[2px] uppercase leading-none"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                The Unit
              </h2>
              <p className="text-[12px] text-[#A0A0A0] font-mono tracking-[1.5px] uppercase mt-2">
                Personnel files — the detectives behind the cases
              </p>
            </div>
          </div>
          <PersonnelGrid
            people={[
              {
                image: heroImg,
                name: "R. Calloway",
                role: "Chief Investigator",
                statLeft: { label: "Experience", value: "12 Years" },
                statRight: { label: "Cases Solved", value: 157 },
                stamp: "Confidential",
              },
              {
                image: noirStreet,
                name: "M. Vex",
                role: "Evidence Analyst",
                statLeft: { label: "Experience", value: "9 Years" },
                statRight: { label: "Cases Solved", value: 118 },
                stamp: "Confidential",
              },
              {
                image: evidenceRoom,
                name: "J. Morrow",
                role: "Field Agent",
                statLeft: { label: "Experience", value: "7 Years" },
                statRight: { label: "Cases Solved", value: 93 },
                stamp: "Confidential",
              },
            ]}
          />
        </section>
      </div>
    </div>
  );
}
