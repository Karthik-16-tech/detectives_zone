import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { CloudRain, CloudOff, User, ShoppingCart, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useRain } from "./RainProvider";
import logo from "@/assets/logo.png";

const scrollLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#challenge", label: "Challenge" },
  { href: "#contact", label: "Contact Us" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { enabled, toggle } = useRain();
  const routerState = useRouterState();
  const navigate = useNavigate();
  const pathname = routerState.location.pathname;
  const isCasesPage = pathname === "/cases" || pathname.startsWith("/cases/");
  const isStorePage = pathname === "/store";
  const isAboutPage = pathname === "/about";
  const isDashboard = isCasesPage || isStorePage || isAboutPage;

  const scrollToHomeSection = (id: string) => {
    if (isDashboard) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    navigate({ to: "/" });
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  useEffect(() => {
    if (isDashboard) return;
    const onScroll = () => {
      setScrolled(window.scrollY > 24);

      // Track active section on scroll
      const sections = ["home", "about", "challenge", "contact"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isDashboard]);

  // Height is fixed 72px on cases dashboard page, dynamic on home page
  const height = isDashboard ? 72 : (scrolled ? 56 : 64);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b transition-all duration-500"
      style={{
        height,
        background: "rgba(5,5,5,0.75)",
        backdropFilter: "blur(20px)",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-center pl-5 pr-10">
        <Link to="/" className="flex w-[268px] shrink-0 items-center gap-3">
          <img
            src={logo}
            alt="Detective Zone logo"
            className="h-9 w-9 shrink-0 object-contain"
          />
          <span className="block font-display text-[14px] font-semibold tracking-[0.22em] uppercase">
            Detective <span className="text-blood">Zone</span>
          </span>
        </Link>

        {isDashboard ? (
          <nav className="flex flex-1 items-center justify-center gap-9 -ml-10">
            <Link
              to="/"
              className="group relative font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 text-muted-foreground hover:text-foreground"
            >
              Home
              <span className="absolute -bottom-2 left-0 h-px w-0 bg-blood transition-all duration-500 group-hover:w-full" />
            </Link>
            <Link
              to="/cases"
              className={`group relative font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 ${isCasesPage ? 'text-[#B31217]' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Cases
              <span className={`absolute -bottom-2 left-0 h-px bg-blood transition-all duration-500 ${isCasesPage ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>
            <Link
              to="/store"
              className={`group relative font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 ${isStorePage ? 'text-[#B31217]' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Store
              <span className={`absolute -bottom-2 left-0 h-px bg-blood transition-all duration-500 ${isStorePage ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>
            <Link
              to="/about"
              className={`group relative font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 ${isAboutPage ? 'text-[#B31217]' : 'text-muted-foreground hover:text-foreground'}`}
            >
              About Us
              <span className={`absolute -bottom-2 left-0 h-px bg-blood transition-all duration-500 ${isAboutPage ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>
            <Link
              to="/"
              hash="contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToHomeSection("contact");
              }}
              className="group relative font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 text-muted-foreground hover:text-foreground"
            >
              Contact
              <span className="absolute -bottom-2 left-0 h-px w-0 bg-blood transition-all duration-500 group-hover:w-full" />
            </Link>
          </nav>
        ) : (
          <nav className="flex flex-1 items-center justify-center gap-9">
            {scrollLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.querySelector(l.href);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={`group relative font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 ${
                  activeSection === l.href.substring(1)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-2 left-0 h-px bg-blood transition-all duration-500 ${
                    activeSection === l.href.substring(1) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </a>
            ))}
          </nav>
        )}

        {isDashboard ? (
          <div className="flex shrink-0 items-center gap-6">
            <button aria-label="Cart" className="relative text-muted-foreground hover:text-foreground transition-colors duration-300">
              <ShoppingCart className="h-4.5 w-4.5" />
              <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blood text-[8px] font-bold text-white">
                1
              </span>
            </button>
            <button aria-label="Notifications" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
              <Bell className="h-4.5 w-4.5" />
            </button>
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-5">
            <button
              onClick={toggle}
              aria-label={enabled ? "Turn rain off" : "Turn rain on"}
              className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase transition-colors duration-300 hover:border-blood/50 hover:text-foreground"
            >
              {enabled ? <CloudRain className="h-3.5 w-3.5 text-blood" /> : <CloudOff className="h-3.5 w-3.5" />}
              Rain {enabled ? "On" : "Off"}
            </button>
            <button aria-label="Profile" className="text-muted-foreground transition-colors hover:text-foreground">
              <User className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
