import { Link } from "@tanstack/react-router";
import {
  Shield,
  Fingerprint,
  Mail,
  ArrowUpRight,
  Radio,
  Instagram,
  Facebook,
} from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { S3_MEDIA } from "@/lib/media";
const logo = S3_MEDIA.logo;

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    api.getSettings().then((s) => {
      if (s) setSiteSettings(s);
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || submitting) return;

    try {
      setSubmitting(true);
      await api.sendContactMessage({
        name: "Classified Dispatch Subscriber",
        email: cleanEmail,
        subject: "CLASSIFIED DISPATCH // CLEARANCE REQUEST",
        message: "Investigator requested clearance & newsletter subscription from footer Classified Dispatch form.",
      });
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 5000);
    } catch (err) {
      // Fallback display success anyway for smooth UX
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 5000);
    } finally {
      setSubmitting(false);
    }
  };

  const navGroups = [
    {
      title: "INVESTIGATIONS",
      links: [
        { label: "CASE FILES", to: "/cases" },
        { label: "EVIDENCE ARCHIVE", to: "/evidence-wall" },
        { label: "DETECTIVE STORE", to: "/store" },
        { label: "CRIME CHALLENGE", to: "/challenge" },
      ],
    },
    {
      title: "AGENCY",
      links: [
        { label: "ABOUT DOSSIER", to: "/about" },
        { label: "CONTACT HQ", to: "/contact" },
      ],
      socials: [
        {
          label: "Instagram",
          href: "https://www.instagram.com/detectives_zone?igsi=MTE1c2ppa2JlaHp4aA==",
          icon: Instagram,
        },
        {
          label: "Facebook",
          href: "https://www.facebook.com/share/1EDd4G6Nva/",
          icon: Facebook,
        },
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

      {/* Main Container */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Brand Col */}
          <div className="w-full lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] transition-colors duration-300 group-hover:border-blood/50">
                <img src={logo} alt="Detectives Zone" className="h-7 w-7 object-contain" />
              </div>
              <span className="font-display text-[20px] font-bold uppercase tracking-[0.18em] text-white">
                DETECTIVES <span className="text-blood">ZONE</span>
              </span>
            </Link>

            <p className="mt-5 max-w-md font-sans text-[13px] sm:text-[14px] leading-relaxed text-white/60">
              An interactive, story-driven crime investigation universe. Every shadow conceals a motive, every dossier holds the key to uncovering the truth.
            </p>

            {/* Badges */}
            <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-2.5">
              {[
                { icon: Shield, label: "ENCRYPTED DOSSIER" },
                { icon: Fingerprint, label: "VERIFIED EVIDENCE" },
                { icon: Radio, label: "LIVE DISPATCH" },
              ].map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70 transition-colors duration-300 hover:border-blood/40 hover:text-white"
                  >
                    <Icon className="h-3.5 w-3.5 text-blood" />
                    <span>{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Links Groups */}
          <div className="w-full flex flex-col sm:grid sm:grid-cols-2 lg:contents gap-8 lg:gap-0">
            {navGroups.map((group, idx) => (
              <div key={idx} className="w-full lg:col-span-2">
                <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-blood">
                  // {group.title}
                </h3>
                <ul className="mt-4 sm:mt-6 flex flex-col font-mono text-[12px] uppercase tracking-[0.14em]">
                  {group.links.map((link, i) => (
                    <li key={i} className="border-b border-white/[0.07] last:border-b-0 py-3 sm:py-2.5">
                      <Link
                        to={link.to}
                        className="group flex items-center justify-between sm:justify-start gap-2 text-white/50 transition-colors duration-300 hover:text-white"
                      >
                        <span className="relative">{link.label}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-blood hidden sm:block" />
                      </Link>
                    </li>
                  ))}
                  {group.socials && (
                    <li className="pt-4">
                      <div className="flex items-center gap-3">
                        {group.socials.map((social, i) => {
                          const Icon = social.icon;
                          return (
                            <a
                              key={`soc-${i}`}
                              href={social.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={social.label}
                              title={social.label}
                              className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-blood transition-all duration-300 hover:border-blood hover:bg-blood/15 hover:text-white hover:scale-105 active:scale-95"
                            >
                              <Icon className="h-4 w-4 text-blood transition-transform duration-300 group-hover:scale-110" />
                            </a>
                          );
                        })}
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>

          {/* Classified Dispatch Newsletter Box */}
          <div className="w-full lg:col-span-4 mt-4 lg:mt-0">
            <div className="relative overflow-hidden rounded-[20px] border border-white/12 bg-black/60 p-6 sm:p-7 backdrop-blur-md">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-blood font-medium">
                <Mail className="h-3.5 w-3.5 text-blood" />
                <span>{siteSettings.dispatch_kicker || "CLASSIFIED DISPATCH"}</span>
              </div>
              <h4 className="mt-3 font-display text-[22px] sm:text-[24px] font-bold uppercase tracking-tight text-white leading-tight">
                {siteSettings.dispatch_title || "RECEIVE NEW CASE FILES"}
              </h4>
              <p className="mt-2 font-sans text-[13px] leading-relaxed text-white/60">
                {siteSettings.dispatch_description || "Get notified as soon as new investigations, physical crime scene kits, and clues drop."}
              </p>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={siteSettings.dispatch_placeholder || "AGENT@DETECTIVESZONE.CO"}
                    className="w-full rounded-full border border-white/15 bg-black px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white placeholder-white/30 outline-none transition-all duration-300 focus:border-blood focus:ring-1 focus:ring-blood"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-blood py-3.5 font-mono text-[12px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-blood/90 hover:shadow-[0_0_24px_rgba(211,47,47,0.5)] cursor-pointer disabled:opacity-75"
                >
                  <span>
                    {submitting 
                      ? "TRANSMITTING..." 
                      : subscribed 
                        ? (siteSettings.dispatch_success_text || "✓ CLEARANCE GRANTED") 
                        : (siteSettings.dispatch_button_text || "REQUEST CLEARANCE")}
                  </span>
                  {!subscribed && !submitting && (
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Large Watermark Typography */}
        <div className="relative mt-12 sm:mt-16 select-none border-t border-white/[0.06] pt-8 text-center" aria-hidden>
          <p
            className="font-display font-black tracking-widest uppercase text-white/[0.04] leading-none"
            style={{
              fontSize: "clamp(2.75rem, 11vw, 9.5rem)",
              fontFamily: "Bebas Neue, Oswald, sans-serif",
            }}
          >
            DETECTIVES ZONE
          </p>
        </div>
      </div>
    </footer>
  );
}
