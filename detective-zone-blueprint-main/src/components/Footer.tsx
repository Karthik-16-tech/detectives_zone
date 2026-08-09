import { Link } from "@tanstack/react-router";
import { ShieldCheck, BookOpen, Briefcase, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="relative mt-14 border-t border-border bg-secondary sm:mt-24 lg:mt-30">
      {/* Main columns */}
      <div className="shell grid grid-cols-12 gap-8 py-12 sm:py-16" style={{ minHeight: 320 }}>
        <div className="col-span-12 lg:col-span-3">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Detective Zone logo"
              className="h-11 w-11 shrink-0 object-contain"
            />
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
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="group flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <span className="h-px w-0 bg-blood transition-all duration-300 group-hover:w-3" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-6 lg:col-span-3">
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
        <div className="col-span-12 lg:col-span-3">
          <p className="caption">Newsletter</p>
          <div className="mt-6 border border-border bg-background/40 p-4">
            <p className="flex items-center gap-2 caption">
              <Mail className="h-3.5 w-3.5 text-blood" />
              The Classified Briefing
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
              New cases and clues before they go public.
            </p>
            <form
              className="mt-4 flex flex-col gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.elements.namedItem("email") as HTMLInputElement;
                input.value = "";
              }}
            >
              <Input
                name="email"
                type="email"
                required
                placeholder="Your e-mail"
                aria-label="Email address"
                className="h-9 font-mono text-[13px]"
              />
              <Button type="submit" size="sm" className="bg-blood text-white hover:bg-blood/90">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
