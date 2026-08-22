import { Link } from "@tanstack/react-router";
import {
  Shield,
  Fingerprint,
  Mail,
  ArrowUpRight,
  Radio,
} from "lucide-react";
import { useState } from "react";
import { S3_MEDIA } from "@/lib/media";
const logo = S3_MEDIA.logo;

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 4000);
  };

  const navGroups = [
    {
      title: "Investigations",
      links: [
        { label: "Case Files", to: "/cases" },
        { label: "Evidence Archive", to: "/evidence-wall" },
        { label: "Detective Store", to: "/store" },
        { label: "Crime Challenge", to: "/challenge" },
      ],
    },
    {
      title: "Agency",
      links: [
        { label: "About Dossier", to: "/about" },
        { label: "Contact HQ", to: "/contact" },
        { label: "Privacy Protocol", to: "/about" },
        { label: "Terms of Service", to: "/about" },
      ],
    },
  ];

  return (
    <footer className="relative mt-20 sm:mt-32 overflow-hidden border-t border-white/[0.08] bg-[#020202] text-white">
      {/* Ambient background glow & grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(179,18,23,0.18) 0%, transparent 65%),
            linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)
          `,
        }}
      />

      {/* Main Grid */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-12 gap-10 lg:gap-14">
          
          {/* Brand Col */}
          <div className="col-span-12 lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] transition-colors duration-300 group-hover:border-blood/50">
                <img src={logo} alt="Detectives Zone" className="h-7 w-7 object-contain" />
              </div>
              <span className="font-display text-[19px] font-bold uppercase tracking-[0.22em] text-white">
                Detectives <span className="text-blood">Zone</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm font-sans text-[13px] leading-relaxed text-white/55">
              An interactive, story-driven crime investigation universe. Every shadow conceals a motive, every dossier holds the key to uncovering the truth.
            </p>

            {/* Badges */}
            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              {[
                { icon: Shield, label: "Encrypted Dossier" },
                { icon: Fingerprint, label: "Verified Evidence" },
                { icon: Radio, label: "Live Dispatch" },
              ].map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/60 transition-colors duration-300 hover:border-blood/40 hover:text-white"
                  >
                    <Icon className="h-3 w-3 text-blood" />
                    <span>{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Links Groups */}
          {navGroups.map((group, idx) => (
            <div key={idx} className="col-span-6 sm:col-span-3 lg:col-span-2">
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80">
                // {group.title}
              </h3>
              <ul className="mt-6 space-y-3.5 font-mono text-[12px] uppercase tracking-[0.14em]">
                {group.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      to={link.to}
                      className="group flex items-center gap-2 text-white/45 transition-colors duration-300 hover:text-white"
                    >
                      <span className="h-px w-0 bg-blood transition-all duration-300 group-hover:w-2.5" />
                      <span className="relative">{link.label}</span>
                      <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-blood" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Box */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-b from-white/[0.04] to-transparent p-6 lg:p-7">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-blood">
                <Mail className="h-3.5 w-3.5" />
                <span>Classified Dispatch</span>
              </div>
              <h4 className="mt-2.5 font-display text-[18px] font-bold uppercase tracking-[0.08em] text-white">
                Receive New Case Files
              </h4>
              <p className="mt-2 font-sans text-[12px] leading-relaxed text-white/50">
                Get notified as soon as new investigations, physical crime scene kits, and clues drop.
              </p>

              <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2.5">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="agent@detectiveszone.co"
                    className="w-full rounded-lg border border-white/12 bg-black/70 px-3.5 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white placeholder-white/25 outline-none transition-all duration-300 focus:border-blood focus:ring-1 focus:ring-blood"
                  />
                </div>
                <button
                  type="submit"
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-blood py-2.5 font-display text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-all duration-300 hover:bg-blood/90 hover:shadow-[0_0_24px_rgba(179,18,23,0.4)] cursor-pointer"
                >
                  <span className="relative">{subscribed ? "✓ Registered" : "Request Clearance"}</span>
                  {!subscribed && (
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Large Watermark Typography */}
        <div className="relative mt-16 select-none border-t border-white/[0.06] pt-8 text-center" aria-hidden>
          <p
            className="font-display font-black tracking-widest uppercase text-white/[0.035] leading-none"
            style={{
              fontSize: "clamp(3.5rem, 11vw, 9.5rem)",
              fontFamily: "Bebas Neue, Oswald, sans-serif",
            }}
          >
            DETECTIVES ZONE
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-center gap-4 border-t border-white/[0.05] pt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35 sm:flex-row">
          <p>© {new Date().getFullYear()} Detectives Zone. All classified rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
