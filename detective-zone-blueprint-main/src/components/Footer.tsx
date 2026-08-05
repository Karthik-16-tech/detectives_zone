import { Link } from "@tanstack/react-router";
import { Fingerprint, ShieldCheck, BookOpen, Briefcase } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-30 border-t border-border">
      {/* Main columns */}
      <div className="shell grid grid-cols-12 gap-8 py-16" style={{ minHeight: 320 }}>
        <div className="col-span-12 lg:col-span-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center border border-border bg-secondary font-display text-lg font-bold tracking-widest">
              DZ
            </span>
            <span className="font-display text-[17px] font-semibold tracking-[0.24em] uppercase">
              Detective <span className="text-blood">Zone</span>
            </span>
          </div>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
            A story-driven investigation house. We build cases that reward the patient eye and
            punish the quick guess.
          </p>
          <div className="mt-8 flex items-center gap-3">
            {[ShieldCheck, BookOpen, Briefcase].map((Icon, i) => (
              <span
                key={i}
                className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-colors duration-300 hover:border-blood/50 hover:text-blood"
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>
        <div className="col-span-6 lg:col-span-3">
          <p className="caption">Navigation</p>
          <ul className="mt-6 space-y-3 font-mono text-[13px] text-muted-foreground">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/challenge", label: "Challenge" },
              { to: "/cases", label: "Open Cases" },
              { to: "/store", label: "The Store" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="group flex items-center gap-2 transition-colors hover:text-foreground">
                  <span className="h-px w-0 bg-blood transition-all duration-300 group-hover:w-3" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-6 lg:col-span-4">
          <p className="caption">Investigation Division</p>
          <ul className="mt-6 space-y-3 font-mono text-[13px] text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-blood">▸</span>
              114 W 41st Street, New York
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blood">▸</span>
              files@detectivezone.co
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blood">▸</span>
              +1 (212) 555-0147
            </li>
          </ul>
          <p className="caption mt-8">Reporting Hours</p>
          <p className="mt-3 font-mono text-[12px] leading-relaxed text-muted-foreground">
            Mon – Fri · 09:00 – 18:00 EST
            <br />
            Hotline open 24/7 for active cases.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="relative flex items-center justify-between overflow-hidden border-t border-border px-12 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase"
        style={{ height: 64 }}
      >
        <span>© 2026 Detective Zone</span>
        <span className="hidden text-foreground/70 sm:block">Truth isn't given. It's discovered.</span>
        <span className="flex items-center gap-4">
          <Fingerprint className="h-5 w-5 opacity-30" />
          <span className="-rotate-3 border border-blood/60 px-2 py-1 text-blood">Top Secret</span>
        </span>
        <span
          className="pointer-events-none absolute inset-x-0 h-16 opacity-[0.06]"
          style={{
            background: "linear-gradient(180deg,transparent,white,transparent)",
            animation: "dz-scan 7s linear infinite",
          }}
        />
      </div>
    </footer>
  );
}
