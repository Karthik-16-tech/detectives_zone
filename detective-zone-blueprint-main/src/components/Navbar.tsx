import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingCart, Menu, X, CloudRain, CloudOff } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useCart } from "@/context/CartContext";
import { useRain } from "@/components/RainProvider";
import { S3_MEDIA } from "@/lib/media";
const logo = S3_MEDIA.logo;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalCount } = useCart();
  const { enabled, toggle } = useRain();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const isHomePage = pathname === "/";
  const isCartPage = pathname === "/cart";

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const scrollToSection = (id: string) => {
    closeMobile();
    if (isHomePage) {
      if (id === "cases" || id === "store") {
        const el = document.getElementById("store");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const linkClass = (active: boolean) =>
    `group relative py-1 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors duration-300 cursor-pointer ${
      active ? "text-white" : "text-white/55 hover:text-white"
    }`;

  const linkUnderline = (active: boolean) =>
    `absolute -bottom-0.5 left-0 h-px bg-blood transition-all duration-500 ${
      active ? "w-full" : "w-0 group-hover:w-full"
    }`;

  const mobileLinkClass = (active: boolean) =>
    `block py-3 font-mono text-[12px] uppercase tracking-[0.22em] transition-colors duration-300 cursor-pointer ${
      active ? "text-blood" : "text-white/55 hover:text-white"
    }`;

  // Homepage links (In-page smooth navigation: Cases, Store, About, Challenge)
  const homeLinks = [
    { id: "cases", label: "Cases" },
    { id: "store", label: "Store" },
    { id: "about", label: "About" },
    { id: "challenge", label: "Challenge" },
  ];

  // Dashboard / General links
  const generalLinks = [
    { to: "/cases", label: "Cases" },
    { to: "/store", label: "Store" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const isGeneralActive = (to: string): boolean => {
    if (to === "/cases") return pathname === "/cases" || pathname.startsWith("/cases/");
    if (to === "/store") return pathname === "/store" || pathname.startsWith("/store/");
    return pathname === to || pathname.startsWith(`${to}/`);
  };

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
        style={{
          height: 50,
          background: scrolled
            ? "rgba(4,4,4,0.96)"
            : "rgba(4,4,4,0.90)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo with compact proportions */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5 sm:gap-3 py-1 group">
            <img 
              src={logo} 
              alt="Detective Zone logo" 
              className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 object-contain transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="flex flex-col justify-center">
              <span className="whitespace-nowrap font-display text-[13.5px] sm:text-[15px] font-bold uppercase tracking-[0.25em] text-white transition-colors duration-200 group-hover:text-white">
                Detectives <span className="text-blood">Zone</span>
              </span>
              <span className="font-mono text-[7px] sm:text-[7.5px] tracking-[0.26em] text-neutral-400 uppercase leading-none mt-0.5 hidden sm:block">
                Forensic Mystery Experiences
              </span>
            </div>
          </Link>

          {/* Desktop nav — right */}
          <nav className="hidden items-center gap-8 lg:flex">
            {isHomePage ? (
              // Homepage navigation: Home, About, Challenge, Contact (No Cart)
              homeLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={linkClass(false)}
                >
                  {item.label}
                  <span className={linkUnderline(false)} />
                </button>
              ))
            ) : (
              // Dashboard / other pages navigation: Cases, Store, About, Contact + Cart
              <>
                {generalLinks.map((l) => (
                  <Link key={l.to} to={l.to} className={linkClass(isGeneralActive(l.to))}>
                    {l.label}
                    <span className={linkUnderline(isGeneralActive(l.to))} />
                  </Link>
                ))}
                <Link
                  to="/cart"
                  aria-label="Cart"
                  className={`relative p-2 transition-colors duration-300 ${
                    isCartPage ? "text-white" : "text-white/55 hover:text-white"
                  }`}
                >
                  <ShoppingCart className="h-[18px] w-[18px]" />
                  {!isCartPage && totalCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-blood text-[9px] font-bold text-white shadow-sm">
                      {totalCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* Rain Toggle Button — Only on Homepage */}
            {isHomePage && (
              <button
                onClick={toggle}
                aria-label={enabled ? "Turn rain off" : "Turn rain on"}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.05] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/70 transition-all duration-300 hover:border-blood/50 hover:bg-white/[0.1] hover:text-white cursor-pointer"
              >
                {enabled ? <CloudRain className="h-3.5 w-3.5 text-blood animate-pulse" /> : <CloudOff className="h-3.5 w-3.5 text-white/40" />}
                <span>Rain {enabled ? "On" : "Off"}</span>
              </button>
            )}
          </nav>

          {/* Mobile right actions */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Rain Toggle — Only on Homepage */}
            {isHomePage && (
              <button
                onClick={toggle}
                aria-label={enabled ? "Turn rain off" : "Turn rain on"}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-blood/60 bg-black/60 text-blood shadow-[0_0_10px_rgba(200,29,36,0.3)] transition-all hover:border-blood active:scale-95 cursor-pointer"
              >
                {enabled ? <CloudRain className="h-4 w-4 text-blood" /> : <CloudOff className="h-4 w-4 text-white/40" />}
              </button>
            )}

            {!isHomePage && (
              <Link
                to="/cart"
                aria-label="Cart"
                className="relative p-2 text-white/60 hover:text-white"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-blood text-[9px] font-bold text-white shadow-sm">
                    {totalCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="flex items-center justify-center p-1.5 text-white/70 transition-colors hover:text-white"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-[49] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobile}
      />

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 right-0 z-[51] h-full w-[280px] border-l border-border/30 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background: "rgba(6,6,6,0.97)",
          backdropFilter: "blur(24px)",
        }}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <span className="font-display text-[12px] font-semibold uppercase tracking-[0.22em] text-white/60">
            Menu
          </span>
          <button
            onClick={closeMobile}
            aria-label="Close menu"
            className="p-1 text-white/60 transition-colors hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="border-b border-white/10 px-5 py-4">
          {isHomePage ? (
            homeLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full text-left ${mobileLinkClass(false)}`}
              >
                {item.label}
              </button>
            ))
          ) : (
            <>
              {generalLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={closeMobile}
                  className={mobileLinkClass(isGeneralActive(l.to))}
                >
                  {l.label}
                </Link>
              ))}
              <Link to="/" onClick={closeMobile} className={mobileLinkClass(false)}>
                Home
              </Link>
            </>
          )}
        </nav>

        {isHomePage && (
          <div className="px-5 py-4 border-t border-white/10">
            <button
              onClick={toggle}
              className="flex w-full items-center justify-between rounded-lg border border-white/15 bg-white/[0.04] p-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/80 transition-colors hover:border-blood/40 hover:text-white"
            >
              <div className="flex items-center gap-2.5">
                {enabled ? <CloudRain className="h-4 w-4 text-blood" /> : <CloudOff className="h-4 w-4 text-white/40" />}
                <span>Atmospheric Rain</span>
              </div>
              <span className={`text-[10px] font-bold ${enabled ? "text-blood" : "text-white/40"}`}>
                {enabled ? "ON" : "OFF"}
              </span>
            </button>
          </div>
        )}

        {!isHomePage && (
          <div className="px-5 py-2">
            <Link
              to="/cart"
              onClick={closeMobile}
              className="flex items-center gap-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white"
            >
              <ShoppingCart className="h-4 w-4" />
              Cart {totalCount > 0 && <span className="ml-1 text-blood">({totalCount})</span>}
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}

