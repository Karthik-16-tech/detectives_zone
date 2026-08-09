import { Link, useRouterState } from "@tanstack/react-router";
import { CloudRain, CloudOff, ShoppingCart, Menu, X } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useRain } from "./RainProvider";
import { useLenis } from "./SmoothScroll";
import { useCart } from "@/context/CartContext";
import logo from "@/assets/logo.png";

const scrollLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#challenge", label: "Challenge" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { enabled, toggle } = useRain();
  const { totalCount } = useCart();
  const lenis = useLenis();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const isCasesPage = pathname === "/cases" || pathname.startsWith("/cases/");
  const isStorePage = pathname === "/store";
  const isAboutPage = pathname === "/about";
  const isContactPage = pathname === "/contact";
  const isCartPage = pathname === "/cart";
  const isDashboard = isCasesPage || isStorePage || isAboutPage || isContactPage || isCartPage;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

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

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const handleScrollLink = useCallback(
    (href: string) => {
      closeMobile();
      const el = document.querySelector(href);
      if (el) {
        if (lenis) {
          lenis.scrollTo(el as HTMLElement, { offset: -56, duration: 1.4 });
        } else {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    [lenis, closeMobile],
  );

  // Height is fixed 72px on cases dashboard page, dynamic on home page
  const height = isDashboard ? 72 : scrolled ? 44 : 52;

  const navLinkClass = (active: boolean) =>
    `group relative font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 ${
      active ? "text-[#B31217]" : "text-muted-foreground hover:text-foreground"
    }`;

  const navUnderline = (active: boolean) =>
    `absolute -bottom-2 left-0 h-px bg-blood transition-all duration-500 ${
      active ? "w-full" : "w-0 group-hover:w-full"
    }`;

  /* ── Mobile link styles ── */
  const mobileLinkClass = (active: boolean) =>
    `block py-3 font-mono text-[12px] tracking-[0.22em] uppercase transition-colors duration-300 ${
      active ? "text-blood" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 border-b transition-all duration-500"
        style={{
          height,
          background: "rgba(5,5,5,0.75)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <div className="mx-auto flex h-full max-w-[1440px] items-center px-4 lg:pl-5 lg:pr-10">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <img
              src={logo}
              alt="Detectives Zone logo"
              className="h-8 w-8 shrink-0 object-contain"
            />
            <span className="whitespace-nowrap font-display text-[13px] font-semibold tracking-[0.2em] uppercase">
              Detectives <span className="text-blood">Zone</span>
            </span>
          </Link>

          {/* ── Desktop nav (hidden below lg) ── */}
          {isDashboard ? (
            <nav className="hidden lg:flex flex-1 items-center justify-center gap-9">
              <Link to="/" className={navLinkClass(false)}>
                Home
                <span className={navUnderline(false)} />
              </Link>
              <Link to="/cases" className={navLinkClass(isCasesPage)}>
                Cases
                <span className={navUnderline(isCasesPage)} />
              </Link>
              <Link to="/store" className={navLinkClass(isStorePage)}>
                Store
                <span className={navUnderline(isStorePage)} />
              </Link>
              <Link to="/about" className={navLinkClass(isAboutPage)}>
                About Us
                <span className={navUnderline(isAboutPage)} />
              </Link>
              <Link to="/contact" className={navLinkClass(isContactPage)}>
                Contact
                <span className={navUnderline(isContactPage)} />
              </Link>
            </nav>
          ) : (
            <nav className="hidden lg:flex flex-1 items-center justify-center gap-9">
              {scrollLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleScrollLink(l.href);
                  }}
                  className={navLinkClass(activeSection === l.href.substring(1))}
                >
                  {l.label}
                  <span className={navUnderline(activeSection === l.href.substring(1))} />
                </a>
              ))}
              <Link to="/contact" className={navLinkClass(isContactPage)}>
                Contact Us
                <span className={navUnderline(isContactPage)} />
              </Link>
            </nav>
          )}

          {/* ── Right side actions ── */}
          <div className="ml-auto flex shrink-0 items-center gap-4 lg:gap-5">
            {/* Rain toggle — desktop only */}
            {!isDashboard && (
              <button
                onClick={toggle}
                aria-label={enabled ? "Turn rain off" : "Turn rain on"}
                className="hidden lg:flex items-center gap-2 rounded-full border border-border px-3 py-1.5 font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase transition-colors duration-300 hover:border-blood/50 hover:text-foreground"
              >
                {enabled ? (
                  <CloudRain className="h-3.5 w-3.5 text-blood" />
                ) : (
                  <CloudOff className="h-3.5 w-3.5" />
                )}
                Rain {enabled ? "On" : "Off"}
              </button>
            )}

            {/* Cart — dashboard only */}
            {isDashboard && (
              <Link
                to="/cart"
                aria-label="Cart"
                className={`relative p-2 transition-colors duration-300 ${isCartPage ? "text-blood" : "text-muted-foreground hover:text-foreground"}`}
              >
                <ShoppingCart className="h-4.5 w-4.5" />
                {!isCartPage && totalCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-blood text-[9px] font-bold text-white shadow-sm">
                    {totalCount}
                  </span>
                )}
              </Link>
            )}

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="flex lg:hidden items-center justify-center p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile slide-in drawer ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[49] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobile}
      />
      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-[51] h-full w-[280px] border-l border-border/30 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background: "rgba(8,8,8,0.97)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Close button */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-border/20">
          <span className="font-display text-[12px] font-semibold tracking-[0.22em] uppercase text-muted-foreground">
            Menu
          </span>
          <button
            onClick={closeMobile}
            aria-label="Close menu"
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="px-5 py-4 border-b border-border/20">
          {isDashboard ? (
            <>
              <Link to="/" onClick={closeMobile} className={mobileLinkClass(false)}>
                Home
              </Link>
              <Link to="/cases" onClick={closeMobile} className={mobileLinkClass(isCasesPage)}>
                Cases
              </Link>
              <Link to="/store" onClick={closeMobile} className={mobileLinkClass(isStorePage)}>
                Store
              </Link>
              <Link to="/about" onClick={closeMobile} className={mobileLinkClass(isAboutPage)}>
                About Us
              </Link>
              <Link to="/contact" onClick={closeMobile} className={mobileLinkClass(isContactPage)}>
                Contact
              </Link>
            </>
          ) : (
            <>
              {scrollLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleScrollLink(l.href);
                  }}
                  className={mobileLinkClass(activeSection === l.href.substring(1))}
                >
                  {l.label}
                </a>
              ))}
              <Link to="/contact" onClick={closeMobile} className={mobileLinkClass(isContactPage)}>
                Contact Us
              </Link>
            </>
          )}
        </nav>

        {/* Rain toggle — mobile */}
        {!isDashboard && (
          <div className="px-5 py-4 border-b border-border/20">
            <button
              onClick={() => {
                toggle();
                closeMobile();
              }}
              className="flex w-full items-center gap-3 py-2 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase hover:text-foreground transition-colors"
            >
              {enabled ? (
                <CloudRain className="h-4 w-4 text-blood" />
              ) : (
                <CloudOff className="h-4 w-4" />
              )}
              Rain {enabled ? "On" : "Off"}
            </button>
          </div>
        )}

        {/* Cart link — mobile */}
        <div className="px-5 py-4">
          <Link
            to="/cart"
            onClick={closeMobile}
            className="flex items-center gap-3 py-2 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase hover:text-foreground transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            Cart {totalCount > 0 && <span className="ml-1 text-blood">({totalCount})</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
