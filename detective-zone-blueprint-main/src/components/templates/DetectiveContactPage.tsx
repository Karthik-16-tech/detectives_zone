/**
 * DETECTIVE ZONE — CONTACT US PAGE
 * ---------------------------------------------------------------
 * 100% self-contained single-file React component.
 * No Tailwind, no icon library, no CSS file, no router needed.
 * Only dependency: react (17+ / 18 / 19).
 *
 * USAGE:
 *   import DetectiveContactPage from "./DetectiveContactPage";
 *   export default function App() { return <DetectiveContactPage />; }
 *
 * Inside the app (rendered with the shared Navbar/Footer):
 *   <DetectiveContactPage embedded />   // hides its own nav + footer
 *
 * Swap the IMAGES constants below for your own photos.
 * ---------------------------------------------------------------
 */

import React, { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { S3_MEDIA } from "@/lib/media";

/* ================= IMAGES (replace with your own) ================= */
const IMAGES = {
  hero: S3_MEDIA.supportScene,
  support: S3_MEDIA.hqScene,
};

/* ================= ICONS (inline SVG, ultra-thin lines) ================= */
type IcoProps = { className?: string; size?: number };
const Svg = ({ children, size = 18, className }: IcoProps & { children: React.ReactNode }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);
const IconPin = (p: IcoProps) => (
  <Svg {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </Svg>
);
const IconPhone = (p: IcoProps) => (
  <Svg {...p}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  </Svg>
);
const IconMail = (p: IcoProps) => (
  <Svg {...p}>
    <rect x="2" y="4" width="20" height="16" rx="1" />
    <path d="m2 6 10 7 10-7" />
  </Svg>
);
const IconClock = (p: IcoProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);
const IconInstagram = (p: IcoProps) => (
  <Svg {...p}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </Svg>
);
const IconFacebook = (p: IcoProps) => (
  <Svg {...p}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </Svg>
);
const IconSearch = (p: IcoProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
);
const IconLife = (p: IcoProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4" />
    <path d="m5 5 4 4M15 15l4 4M19 5l-4 4M9 15l-4 4" />
  </Svg>
);
const IconArrow = (p: IcoProps) => (
  <Svg {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Svg>
);
const IconShield = (p: IcoProps) => (
  <Svg {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
);
const IconSend = (p: IcoProps) => (
  <Svg {...p}>
    <path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z" />
  </Svg>
);
const IconChat = (p: IcoProps) => (
  <Svg {...p}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
  </Svg>
);
const IconChevron = (p: IcoProps) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);
const IconMenu = (p: IcoProps) => (
  <Svg {...p}>
    <path d="M4 8h16M4 16h16" />
  </Svg>
);
const IconClose = (p: IcoProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);
const IconCart = (p: IcoProps) => (
  <Svg {...p}>
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
    <path d="M2 3h3l2.6 12.4a1.5 1.5 0 0 0 1.5 1.1h8.3a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
  </Svg>
);
const IconBell = (p: IcoProps) => (
  <Svg {...p}>
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </Svg>
);
const socialPaths: Record<string, string> = {
  Facebook:
    "M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V10H6v3h2v8h3v-8h2.5l.5-3H11V7.5A1.5 1.5 0 0 1 12.5 6H15Z",
  Instagram:
    "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.5-1.5v.01",
  Twitter:
    "M22 5.9c-.7.3-1.5.6-2.3.7a4 4 0 0 0 1.8-2.2c-.8.5-1.7.8-2.6 1a4 4 0 0 0-6.9 3.6A11.4 11.4 0 0 1 3.8 4.7a4 4 0 0 0 1.2 5.4c-.6 0-1.3-.2-1.8-.5a4 4 0 0 0 3.2 4 4 4 0 0 1-1.8.1 4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 18.3a11.3 11.3 0 0 0 6.1 1.8c7.4 0 11.4-6.1 11.4-11.4v-.5c.8-.6 1.5-1.3 2-2.2Z",
  Youtube:
    "M22 12s0-3.5-.4-5.1a2.7 2.7 0 0 0-1.9-1.9C18 4.5 12 4.5 12 4.5s-6 0-7.7.5a2.7 2.7 0 0 0-1.9 1.9C2 8.5 2 12 2 12s0 3.5.4 5.1c.2.9.9 1.6 1.9 1.9 1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9C22 15.5 22 12 22 12ZM10 15V9l5 3Z",
  Discord:
    "M20 5.5A16 16 0 0 0 15.6 4l-.3.5a12 12 0 0 1 3 1.5 15 15 0 0 0-12.6 0 12 12 0 0 1 3-1.5L8.4 4A16 16 0 0 0 4 5.5C1.6 9 1 12.4 1.3 15.8A16 16 0 0 0 6.2 18l1-1.6a10 10 0 0 1-1.6-.8l.4-.3a11 11 0 0 0 12 0l.4.3c-.5.3-1 .6-1.6.8l1 1.6a16 16 0 0 0 4.9-2.2c.4-4-.6-7.3-2.7-10.3ZM9 14a1.8 1.8 0 1 1 0-3.6A1.8 1.8 0 0 1 9 14Zm6 0a1.8 1.8 0 1 1 0-3.6A1.8 1.8 0 0 1 15 14Z",
};
const SocialIcon = ({ name }: { name: string }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={socialPaths[name]} />
  </svg>
);

const FingerprintMark = ({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg viewBox="0 0 120 150" className={className} style={style} fill="none" aria-hidden="true">
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <ellipse
        key={i}
        cx="60"
        cy="72"
        rx={10 + i * 9}
        ry={14 + i * 11}
        stroke="currentColor"
        strokeWidth="1"
      />
    ))}
    <path d="M60 30v84" stroke="currentColor" strokeWidth="1" />
    <path d="M28 96c14 14 50 14 64 0" stroke="currentColor" strokeWidth="1" />
  </svg>
);

/* ================= DATA ================= */
const NAV = [
  "Home",
  "Cases",
  "Store",
  "Dashboard",
  "Evidence Locker",
  "Leaderboard",
  "About Us",
  "Contact",
];

const METHODS = [
  {
    Icon: IconPhone,
    file: "FILE 01",
    title: "Phone",
    lines: ["+91 63057 29867", "Mon–Sun · 09:00 — 21:00 IST"],
  },
  {
    Icon: IconMail,
    file: "FILE 02",
    title: "Email",
    lines: ["cases@detectivezone.io", "Reply within 12 hours"],
  },
  {
    Icon: IconInstagram,
    file: "FILE 03",
    title: "Instagram",
    lines: ["@detective.zone", "DM us with case reports"],
  },
  {
    Icon: IconFacebook,
    file: "FILE 04",
    title: "Facebook",
    lines: ["/DetectiveZone", "Follow for case updates"],
  },
];

const FAQS = [
  {
    q: "Do I need the physical box to play the digital cases?",
    a: "No. Every case is fully playable online through our interactive Case Dossiers with digital evidence, autopsy reports, suspect interviews, and audio wiretaps. Purchasing a physical Case Kit delivers the deluxe collector's locker, wax-sealed police files, physical fingerprints, and rotating cipher discs for the ultimate real-world investigation experience.",
  },
  {
    q: "Will my progress save if I close the browser?",
    a: "Yes. Your deductions, solved crime scene clues, field notes, and interactive mystery progress are stored automatically in your investigator terminal session, so you can step away from the crime scene and resume your investigation anytime without losing your place.",
  },
  {
    q: "Is shipping really free, and how long does delivery take?",
    a: "Yes — 100% Free Express Shipping is included on all Case Kit orders across India. Orders are hand-packed with tamper-evident evidence seals within 24 hours and delivered via BlueDart Express in 3–5 business days with real-time tracking.",
  },
  {
    q: "How does the challenge discount work at checkout?",
    a: "Solve all three mysteries in the Room 104 Crime Scene Challenge to unlock the classified promo code DZ25-SOLVED for 25% OFF. Enter the code in your cart or checkout page, and the discount will apply instantly to your total order amount.",
  },
  {
    q: "Can I replay a case after solving it?",
    a: "Absolutely! Once closed, case files remain accessible in your Evidence Locker forever. You can re-examine crime scene photographs, re-read suspect transcripts, or pass the physical evidence dossier to friends and family for mystery game nights.",
  },
];

const INQUIRY_TYPES = [
  "General Inquiry",
  "Evidence Report",
  "Technical Support",
  "Order & Shipping",
  "Partnership",
  "Press",
];

const FOOTER_COLUMNS = [
  {
    title: "Quick Links",
    links: ["Home", "Cases", "Store", "Dashboard", "Evidence Locker", "Leaderboard"],
  },
  { title: "Support", links: ["Help Center", "How It Works", "Shipping & Delivery", "FAQs"] },
  {
    title: "Legal",
    links: ["Terms & Conditions", "Privacy Policy", "Refund Policy", "Cookie Policy"],
  },
];

/* ================= STYLES ================= */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Barlow:wght@300;400;500&family=JetBrains+Mono:wght@400;500&family=Bebas+Neue&display=swap');

.dz {
  --bg:#000; --panel:#0e0e0e; --panel2:#141414; --fg:#f4f3f0;
  --muted:#96948f; --line:rgba(255,255,255,.085); --input:rgba(255,255,255,.12);
  --red:#c11818; --red-soft:rgba(193,24,24,.45);
  --display:'Bebas Neue','Barlow Condensed','Arial Narrow',sans-serif;
  --condensed:'Barlow Condensed','Arial Narrow',sans-serif;
  --sfont:'Barlow',system-ui,sans-serif;
  --mfont:'JetBrains Mono',ui-monospace,monospace;
  --ease:cubic-bezier(.16,1,.3,1);
  background:var(--bg); color:var(--fg); font-family:var(--sfont);
  -webkit-font-smoothing:antialiased; min-height:100vh; scroll-behavior:smooth;
  position:relative; isolation:isolate;
}
.dz::before{
  content:""; position:fixed; inset:0; z-index:-1; pointer-events:none;
  background:
    radial-gradient(620px 420px at 10% 6%, rgba(193,24,24,.07), transparent 62%),
    radial-gradient(760px 520px at 90% 92%, rgba(193,24,24,.05), transparent 62%);
}
.dz::after{
  content:""; position:fixed; inset:0; z-index:50; pointer-events:none; opacity:.035; mix-blend-mode:screen;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>");
  background-size:180px 180px;
}
/* embedded inside the app: clear room for the fixed app navbar, hide own chrome */
.dz--embedded{padding-top:72px;}
.dz--embedded .dz-nav,.dz--embedded .dz-footer{display:none;}
.dz *,.dz *::before,.dz *::after{box-sizing:border-box;}
.dz h1,.dz h2{font-family:var(--display);text-transform:uppercase;font-weight:400;line-height:.9;letter-spacing:.015em;margin:0;}
.dz h3,.dz h4{font-family:var(--condensed);text-transform:uppercase;font-weight:600;line-height:.95;letter-spacing:.02em;margin:0;}
.dz p{margin:0;}
.dz a{color:inherit;text-decoration:none;}
.dz button{font:inherit;color:inherit;background:none;border:none;cursor:pointer;}
.dz input,.dz select,.dz textarea{font:inherit;color:inherit;}
.dz ::selection{background:rgba(193,24,24,.7);color:#fff;}
.dz img{display:block;max-width:100%;}

.dz-wrap{max-width:1440px;margin:0 auto;padding:0 24px;}
@media(min-width:1024px){.dz-wrap{padding:0 48px;}}
.dz-block{padding:clamp(72px,10vw,120px) 0;}
.dz-kicker{font-family:var(--mfont);font-size:10px;letter-spacing:.34em;text-transform:uppercase;color:var(--muted);}
.dz-mono{font-family:var(--mfont);}
.dz-red{color:var(--red);}
.dz-mutedtxt{color:var(--muted);}
.dz-rule{height:1px;width:44px;background:var(--red);}
.dz-panel{background:linear-gradient(160deg,#151515,#0d0d0d);border:1px solid var(--line);}

/* pill badge / eyebrow */
.dz-badge{
  display:inline-flex;align-items:center;gap:10px;
  border:1px solid var(--red-soft);background:rgba(193,24,24,.08);
  padding:7px 14px;font-family:var(--mfont);font-size:10px;letter-spacing:.3em;
  text-transform:uppercase;color:var(--red);border-radius:999px;
}
.dz-eyebrow{display:flex;align-items:center;gap:16px;}
.dz-herogrid .dz-eyebrow{margin-top:-16px;}

/* double-bezel (machined shell + inner core) */
.dz-shell{
  position:relative;border:1px solid var(--line);padding:8px;border-radius:5px;
  background:#000;
}
.dz-shell::before{
  content:""; position:absolute; inset:0; border-radius:5px; pointer-events:none;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.06);
}
.dz-core{
  position:relative;border:1px solid var(--line);border-radius:3px;
  background:var(--panel);box-shadow:inset 0 1px 0 rgba(255,255,255,.04);
}
.dz-tick{position:absolute;width:13px;height:13px;border:1px solid var(--red-soft);pointer-events:none;}
.dz-tick--tl{left:-1px;top:-1px;border-right:none;border-bottom:none;}
.dz-tick--tr{right:-1px;top:-1px;border-left:none;border-bottom:none;}
.dz-tick--bl{left:-1px;bottom:-1px;border-right:none;border-top:none;}
.dz-tick--br{right:-1px;bottom:-1px;border-left:none;border-top:none;}

/* film grain (contextual, for frames/cards) */
.dz-grain::before{
  content:""; position:absolute; inset:0; pointer-events:none; opacity:.5; z-index:2;
  background-image:radial-gradient(rgba(255,255,255,.05) .5px,transparent .5px);
  background-size:2px 2px;
}

/* nav */
.dz-nav{
  position:fixed;inset:0 0 auto 0;z-index:60;
  transition:background-color .6s var(--ease),backdrop-filter .6s var(--ease),border-color .6s var(--ease);
  border-bottom:1px solid transparent;background:linear-gradient(to bottom,#000,transparent);
}
.dz-nav.is-scrolled{background:rgba(0,0,0,.82);backdrop-filter:blur(20px);border-bottom-color:var(--line);}
.dz-navin{display:flex;align-items:center;gap:32px;height:84px;}
.dz-navlinks{display:none;flex:1;justify-content:center;gap:22px;}
@media(min-width:1280px){.dz-navlinks{display:flex;}.dz-burger{display:none!important;}}
.dz-navlink{
  position:relative;padding:8px 0;font-family:var(--condensed);font-size:12.5px;
  text-transform:uppercase;letter-spacing:.14em;color:var(--muted);
  transition:color .35s var(--ease);white-space:nowrap;
}
.dz-navlink:hover,.dz-navlink.is-active{color:var(--fg);}
.dz-navlink::after{
  content:"";position:absolute;left:0;bottom:-1px;height:1px;width:100%;
  background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .6s var(--ease);
}
.dz-navlink:hover::after,.dz-navlink.is-active::after{transform:scaleX(1);}
.dz-navacts{margin-left:auto;display:flex;align-items:center;gap:20px;}
.dz-iconbtn{position:relative;color:var(--muted);transition:color .35s var(--ease);display:grid;place-items:center;}
.dz-iconbtn:hover{color:var(--fg);}
.dz-badge-num{
  position:absolute;top:-8px;right:-8px;display:grid;place-items:center;width:16px;height:16px;
  background:var(--red);color:#fff;font-family:var(--mfont);font-size:9px;border-radius:999px;
}
.dz-user{display:none;align-items:center;gap:12px;border-left:1px solid var(--line);padding-left:20px;}
@media(min-width:1024px){.dz-user{display:flex;}}
.dz-avatar{
  display:grid;place-items:center;width:36px;height:36px;border:1px solid var(--line);
  background:var(--panel);font-family:var(--condensed);font-size:12px;color:var(--muted);border-radius:999px;
}
.dz-mobilemenu{
  border-top:1px solid var(--line);background:rgba(7,7,7,.96);backdrop-filter:blur(20px);
  padding:8px 24px 24px;
}
.dz-mobilemenu a{
  display:block;border-bottom:1px solid rgba(255,255,255,.06);padding:13px 0;
  font-family:var(--condensed);font-size:14px;text-transform:uppercase;letter-spacing:.2em;color:var(--muted);
}

/* logo */
.dz-logo{display:flex;align-items:center;gap:12px;}
.dz-logomark{
  position:relative;display:grid;place-items:center;width:44px;height:44px;
  border:1px solid var(--line);background:var(--panel);border-radius:3px;
  font-family:var(--condensed);font-size:24px;font-weight:700;line-height:1;
}
.dz-logomark span{position:absolute;left:0;bottom:-1px;height:1px;width:100%;background:rgba(193,24,24,.7);}
.dz-logotext{font-family:var(--condensed);font-size:18px;letter-spacing:.16em;line-height:1;}
.dz-logosub{margin-top:4px;font-family:var(--mfont);font-size:9px;text-transform:uppercase;letter-spacing:.3em;color:var(--muted);}

/* buttons */
.dz-btn{
  position:relative;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;gap:10px;
  border:1px solid var(--red);background:var(--red);color:#fff;padding:10px 18px;
  font-family:var(--condensed);font-size:12px;text-transform:uppercase;letter-spacing:.18em;
  transition:box-shadow .5s var(--ease),background-color .4s var(--ease),border-color .4s var(--ease);
}
.dz-btn:hover{box-shadow:0 0 46px -10px var(--red);}
.dz-btn:active{transform:scale(.985);}
.dz-btn--ghost{background:transparent;border-color:var(--line);color:var(--fg);}
.dz-btn--ghost:hover{border-color:var(--red-soft);background:var(--panel);box-shadow:none;}
.dz-btn::after{
  content:"";position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(110deg,transparent 20%,rgba(255,255,255,.1) 45%,transparent 70%);
  transform:translateX(-130%);transition:transform .9s var(--ease);
}
.dz-btn:hover::after{transform:translateX(130%);}
.dz-btn--full{width:100%;}
.dz-btnlabel{display:inline-flex;align-items:center;gap:10px;white-space:nowrap;}
.dz-icocircle{
  display:grid;place-items:center;width:22px;height:22px;border-radius:999px;flex-shrink:0;
  background:rgba(255,255,255,.14);
  transition:transform .3s var(--ease),background-color .4s var(--ease);
}
.dz-btn:hover .dz-icocircle{transform:translateX(3px);background:rgba(255,255,255,.24);}
.dz-btn--ghost .dz-icocircle{background:rgba(255,255,255,.06);border:1px solid var(--line);}

/* reveal */
.dz-reveal{
  opacity:0;filter:blur(8px);transform:translateY(26px);
  transition:opacity .9s var(--ease),filter .9s var(--ease),transform .9s var(--ease);
}
.dz-reveal.is-in{opacity:1;filter:blur(0);transform:none;}

/* atmosphere */
@keyframes dz-rain{from{background-position:0 0,0 0}to{background-position:0 900px,0 1400px}}
@keyframes dz-dust{from{transform:translate3d(0,0,0)}to{transform:translate3d(-40px,-120px,0)}}
@keyframes dz-scan{0%,100%{transform:translateY(-100%);opacity:0}40%{opacity:1}60%{transform:translateY(100%);opacity:.6}}
@keyframes dz-dot{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(193,24,24,.55)}50%{opacity:.55;box-shadow:0 0 0 7px transparent}}
@keyframes dz-fadein{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.dz-rain{
  position:absolute;inset:0;pointer-events:none;opacity:.2;animation:dz-rain 1.6s linear infinite;
  background-image:repeating-linear-gradient(104deg,transparent 0 22px,rgba(255,255,255,.16) 22px 23px,transparent 23px 46px),repeating-linear-gradient(98deg,transparent 0 40px,rgba(255,255,255,.09) 40px 41px,transparent 41px 90px);
}
.dz-dust{
  position:absolute;inset:0;pointer-events:none;opacity:.16;
  animation:dz-dust 26s linear infinite alternate;
  background-image:radial-gradient(rgba(255,255,255,.28) 1px,transparent 1px),radial-gradient(rgba(255,255,255,.16) 1px,transparent 1px);
  background-size:180px 180px,260px 260px;
}
.dz-scan{
  position:absolute;left:0;right:0;top:0;height:1px;background:rgba(193,24,24,.75);
  animation:dz-scan 3.4s cubic-bezier(.45,0,.55,1) infinite;
}
.dz-dot{width:8px;height:8px;background:var(--red);border-radius:999px;animation:dz-dot 2s ease-in-out infinite;}
.dz-fadein{animation:dz-fadein .8s var(--ease) both;transform:translateZ(0);backface-visibility:hidden;}

/* hero */
.dz-hero{position:relative;min-height:100svh;overflow:hidden;border-bottom:1px solid var(--line);}
.dz-herogrid{display:grid;gap:56px;align-items:center;min-height:100svh;padding:112px 0 56px;}
@media(min-width:1024px){.dz-herogrid{grid-template-columns:45fr 55fr;gap:40px;padding:56px 0 0;}}
.dz-h1{margin-top:32px;font-size:clamp(2.7rem,6.5vw,4rem);line-height:.84;transform:translateZ(0);backface-visibility:hidden;}
@media(min-width:1024px){.dz-herogrid .dz-fadein{padding-left:clamp(0px,4vw,56px);}}
.dz-lead{margin-top:32px;max-width:32rem;font-size:16px;line-height:1.75;color:var(--muted);}
.dz-ctas{margin-top:36px;display:flex;flex-direction:column;gap:12px;}
@media(min-width:640px){.dz-ctas{flex-direction:row;}}
.dz-heroart{position:relative;height:54vh;min-height:380px;}
@media(min-width:1024px){.dz-heroart{height:calc(100svh - 96px);}}
.dz-frame{position:absolute;inset:0;overflow:hidden;}
.dz-frame img{width:100%;height:100%;object-fit:cover;}
.dz-vign{position:absolute;inset:0;pointer-events:none;background:linear-gradient(to top,var(--bg),rgba(7,7,7,.22) 45%,transparent);}

/* grids / cards */
.dz-grid4{display:grid;gap:20px;margin-top:64px;}
@media(min-width:640px){.dz-grid4{grid-template-columns:repeat(2,1fr);}}
@media(min-width:1280px){.dz-grid4{grid-template-columns:repeat(4,1fr);}}
.dz-card{
  position:relative;height:100%;padding:30px;overflow:hidden;
  transition:transform .6s var(--ease),box-shadow .6s var(--ease),border-color .5s var(--ease);
}
.dz-card:hover{transform:translateY(-6px);box-shadow:0 26px 80px -38px rgba(193,24,24,.85);}
.dz-cardtile{
  display:grid;place-items:center;width:44px;height:44px;border:1px solid var(--red-soft);
  background:rgba(193,24,24,.08);color:var(--red);
}
.dz-card h3{margin-top:28px;font-size:24px;letter-spacing:.06em;}
.dz-cardline{margin-top:14px;height:1px;width:40px;background:var(--red);transition:width .6s var(--ease);}
.dz-card:hover .dz-cardline{width:82px;}

.dz-split{display:grid;gap:24px;padding:clamp(72px,10vw,120px) 24px;max-width:1440px;margin:0 auto;}
@media(min-width:1024px){.dz-split{grid-template-columns:58fr 42fr;gap:40px;padding:clamp(72px,10vw,120px) 48px;}}

/* form */
.dz-field{
  width:100%;border:1px solid var(--input);background:rgba(7,7,7,.65);
  padding:14px 16px;font-size:14px;outline:none;border-radius:3px;
  transition:border-color .4s var(--ease),background-color .4s var(--ease),box-shadow .4s var(--ease);
}
.dz-field::placeholder{color:rgba(150,148,143,.55);}
.dz-field:focus{
  border-color:var(--red);background:#050505;
  box-shadow:0 0 0 1px var(--red),0 0 0 6px rgba(193,24,24,.12);
}
.dz-label{display:block;font-family:var(--mfont);font-size:10px;text-transform:uppercase;letter-spacing:.26em;color:var(--muted);margin-bottom:9px;}
.dz-formgrid{display:grid;gap:22px;}
@media(min-width:640px){.dz-formgrid{grid-template-columns:1fr 1fr;}}
.dz-selwrap{position:relative;}
.dz-selwrap svg{position:absolute;right:16px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--muted);}
.dz-dl{margin-top:36px;display:grid;gap:1px;background:var(--line);}
.dz-dl>div{display:flex;align-items:baseline;justify-content:space-between;gap:16px;background:var(--panel2);padding:15px 18px;}
.dz-dt{font-family:var(--mfont);font-size:9.5px;text-transform:uppercase;letter-spacing:.22em;color:var(--muted);}
.dz-dd{font-family:var(--condensed);font-size:14px;letter-spacing:.08em;text-align:right;}

/* faq */
.dz-faqgrid{display:grid;gap:56px;}
@media(min-width:1024px){.dz-faqgrid{grid-template-columns:38fr 62fr;}}
.dz-faq{border-bottom:1px solid var(--line);transition:background-color .5s var(--ease);}
.dz-faq.is-open{background:var(--panel);}
.dz-faq:not(.is-open):hover{background:rgba(14,14,14,.6);}
.dz-faqbtn{display:flex;width:100%;align-items:center;gap:24px;padding:26px 24px;text-align:left;}
.dz-faqq{flex:1;font-family:var(--condensed);font-size:19px;text-transform:uppercase;letter-spacing:.05em;}
.dz-faqbody{display:grid;transition:grid-template-rows .55s var(--ease);}
.dz-faqbody>div{overflow:hidden;}
.dz-faqa{max-width:42rem;border-left:1px solid var(--red-soft);padding-left:20px;font-size:14px;line-height:1.75;color:var(--muted);margin:0 24px 30px 54px;}
.dz-faqico{display:grid;place-items:center;width:30px;height:30px;border:1px solid var(--line);border-radius:999px;flex-shrink:0;transition:transform .55s var(--ease),border-color .4s var(--ease);}
.dz-faq.is-open .dz-faqico{transform:rotate(180deg);border-color:var(--red-soft);}

/* footer */
.dz-footer{position:relative;overflow:hidden;border-top:1px solid var(--line);background:var(--bg);}
.dz-footergrid{display:grid;gap:48px;padding:88px 0 56px;}
@media(min-width:1024px){.dz-footergrid{grid-template-columns:1.3fr 1fr 1fr 1fr .9fr;}}
.dz-footer h4{font-family:var(--condensed);font-size:13px;letter-spacing:.24em;color:var(--fg);}
.dz-footer ul{list-style:none;margin:20px 0 0;padding:0;display:grid;gap:12px;}
.dz-footer li a{font-size:14px;color:var(--muted);transition:color .35s var(--ease);}
.dz-footer li a:hover{color:var(--fg);}
.dz-soc{
  display:grid;place-items:center;width:40px;height:40px;border:1px solid var(--line);
  color:var(--muted);border-radius:3px;transition:border-color .45s var(--ease),color .45s var(--ease),transform .45s var(--ease);
}
.dz-soc:hover{border-color:var(--red-soft);color:var(--fg);transform:translateY(-2px);}
.dz-footbar{border-top:1px solid var(--line);}
.dz-footbarin{display:flex;flex-direction:column;align-items:center;gap:16px;padding:26px 0;text-align:center;}
@media(min-width:768px){.dz-footbarin{flex-direction:row;justify-content:space-between;}}

/* toast */
.dz-toasts{position:fixed;right:24px;bottom:24px;z-index:120;display:grid;gap:12px;}
.dz-toast{
  border:1px solid var(--line);border-left:2px solid var(--red);
  background:rgba(14,14,14,.97);backdrop-filter:blur(12px);
  padding:14px 18px;min-width:260px;max-width:340px;border-radius:4px;
  animation:dz-fadein .35s var(--ease) both;
}
.dz-toast b{font-family:var(--condensed);font-size:14px;letter-spacing:.14em;text-transform:uppercase;}
.dz-toast p{margin-top:4px;font-size:12px;color:var(--muted);line-height:1.5;}
`;

/* ================= HELPERS ================= */
function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "article" | "section";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const C = Tag as "div";
  return (
    <C
      ref={ref}
      className={`dz-reveal ${shown ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </C>
  );
}

function MagneticButton({
  children,
  icon,
  variant = "primary",
  type = "button",
  full = false,
  style,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "primary" | "ghost";
  type?: "button" | "submit";
  full?: boolean;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const move = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) / 10}px, ${(e.clientY - r.top - r.height / 2) / 10}px)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };
  return (
    <button
      ref={ref}
      type={type}
      onMouseMove={move}
      onMouseLeave={leave}
      style={style}
      className={`dz-btn ${variant === "ghost" ? "dz-btn--ghost" : ""} ${full ? "dz-btn--full" : ""}`}
    >
      <span className="dz-btnlabel">{children}</span>
      {icon && <span className="dz-icocircle">{icon}</span>}
    </button>
  );
}

function SectionHeading({
  kicker,
  title,
  accent,
  description,
}: {
  kicker: string;
  title: string;
  accent?: string;
  description?: string;
}) {
  return (
    <div style={{ maxWidth: "44rem" }}>
      <span className="dz-badge">
        <span className="dz-dot" style={{ width: 6, height: 6 }} />
        {kicker}
      </span>
      <h2 style={{ marginTop: 28, fontSize: "clamp(3rem,6vw,4.4rem)" }}>
        {title} {accent && <span className="dz-red">{accent}</span>}
      </h2>
      {description && (
        <p style={{ marginTop: 22, fontSize: 16, lineHeight: 1.75, color: "var(--muted)" }}>
          {description}
        </p>
      )}
    </div>
  );
}

type Toast = { id: number; title: string; body: string };

/* ================= PAGE ================= */
export default function DetectiveContactPage({ embedded = false }: { embedded?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroImgRef = useRef<HTMLImageElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Live Contact & Desk CMS Settings
  const [channelsData, setChannelsData] = useState({
    kicker: "Direct channels",
    title: "Four ways to reach",
    accent: "the desk",
    list: [
      {
        file: "FILE // 001",
        Icon: IconMail,
        title: "Encrypted Dispatch",
        lines: ["investigations@detectivezone.com", "Average response: under 2 hours", "PGP Key ID: 0x8F3A29B1"],
      },
      {
        file: "FILE // 002",
        Icon: IconPhone,
        title: "Secure Line",
        lines: ["+91 63057 29867", "Mon–Sun · 09:00 — 21:00 IST", "Direct line, priority response"],
      },
      {
        file: "FILE // 003",
        Icon: IconPin,
        title: "Field Headquarters",
        lines: ["221B Baker St. Complex", "Suite 404, New York, NY 10001", "By appointment or priority case only"],
      },
      {
        file: "FILE // 004",
        Icon: IconClock,
        title: "Urgent Deadlines",
        lines: ["case-alert@detectivezone.com", "24/7 on-call dispatch desk", "Immediate field routing"],
      },
    ],
  });

  const [formConfig, setFormConfig] = useState({
    kicker: "Confidential report",
    title: "Open a new",
    accent: "case",
    description: "All fields are encrypted before they leave your device. Provide as much detail as the file allows.",
    supportPhone: "+91 63057 29867",
    supportHours: "Mon–Sun · 09:00 — 21:00 IST",
  });

  useEffect(() => {
    // Load live CMS settings from backend
    api.getSettings()
      .then((settings) => {
        if (settings && Object.keys(settings).length > 0) {
          setChannelsData({
            kicker: settings.contact_section_kicker || "Direct channels",
            title: settings.contact_section_title || "Four ways to reach",
            accent: settings.contact_section_accent || "the desk",
            list: [
              {
                file: settings.contact_ch1_file || "FILE // 001",
                Icon: IconMail,
                title: settings.contact_ch1_title || "Encrypted Dispatch",
                lines: [
                  settings.contact_ch1_line1 || "investigations@detectivezone.com",
                  settings.contact_ch1_line2 || "Average response: under 2 hours",
                  settings.contact_ch1_line3 || "PGP Key ID: 0x8F3A29B1",
                ],
              },
              {
                file: settings.contact_ch2_file || "FILE // 002",
                Icon: IconPhone,
                title: settings.contact_ch2_title || "Secure Line",
                lines: [
                  settings.contact_ch2_line1 || "+91 63057 29867",
                  settings.contact_ch2_line2 || "Mon–Sun · 09:00 — 21:00 IST",
                  settings.contact_ch2_line3 || "Direct line, priority response",
                ],
              },
              {
                file: settings.contact_ch3_file || "FILE // 003",
                Icon: IconPin,
                title: settings.contact_ch3_title || "Field Headquarters",
                lines: [
                  settings.contact_ch3_line1 || "221B Baker St. Complex",
                  settings.contact_ch3_line2 || "Suite 404, New York, NY 10001",
                  settings.contact_ch3_line3 || "By appointment or priority case only",
                ],
              },
              {
                file: settings.contact_ch4_file || "FILE // 004",
                Icon: IconClock,
                title: settings.contact_ch4_title || "Urgent Deadlines",
                lines: [
                  settings.contact_ch4_line1 || "case-alert@detectivezone.com",
                  settings.contact_ch4_line2 || "24/7 on-call dispatch desk",
                  settings.contact_ch4_line3 || "Immediate field routing",
                ],
              },
            ],
          });

          setFormConfig({
            kicker: settings.contact_form_kicker || "Confidential report",
            title: settings.contact_form_title || "Open a new",
            accent: settings.contact_form_accent || "case",
            description: settings.contact_form_desc || "All fields are encrypted before they leave your device. Provide as much detail as the file allows.",
            supportPhone: settings.contact_support_phone || "+91 63057 29867",
            supportHours: settings.contact_support_hours || "Mon–Sun · 09:00 — 21:00 IST",
          });
        }
      })
      .catch(() => {
        // use defaults
      });
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const img = heroImgRef.current;
        if (img) {
          const y = Math.min(window.scrollY, 600);
          img.style.transform = `translateY(${y * -0.06}px) scale(1.08)`;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const pushToast = (title: string, body: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, title, body }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  };

  const onCaseSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const phone = String(formData.get("phone") || "");
    const type = String(formData.get("type") || "General Case Inquiry");
    const subject = String(formData.get("subject") || "");
    const message = String(formData.get("message") || "");

    setSubmitting(true);
    try {
      await api.sendContactMessage({
        name,
        email,
        phone,
        subject: `[${type}] ${subject}`,
        message,
        case_interest: type,
      });

      form.reset();
      pushToast(
        "Case Report Encrypted & Filed",
        `Reference DZ-${Math.floor(1000 + Math.random() * 9000)} assigned. Central dispatch will route to a detective shortly.`
      );
    } catch (err: any) {
      pushToast("Filing Error", err.message || "Failed to transmit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`dz ${embedded ? "dz--embedded" : ""}`} id="top">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ---------------- NAV ---------------- */}
      {!embedded && (
        <header className={`dz-nav ${scrolled ? "is-scrolled" : ""}`}>
          <div className="dz-wrap dz-navin">
            <a href="#top" className="dz-logo" style={{ flexShrink: 0 }}>
              <div className="dz-logomark">
                D
                <span
                  style={{ position: "static", background: "none", width: "auto", height: "auto" }}
                  className="dz-red"
                >
                  Z
                </span>
                <span />
              </div>
              <div style={{ lineHeight: 1 }}>
                <div className="dz-logotext">
                  DETECTIVE <span className="dz-red">ZONE</span>
                </div>
                <div className="dz-logosub">Every clue. A step closer.</div>
              </div>
            </a>

            <nav className="dz-navlinks">
              {NAV.map((item) => (
                <a
                  key={item}
                  href={item === "Contact" ? "#top" : "#"}
                  className={`dz-navlink ${item === "Contact" ? "is-active" : ""}`}
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="dz-navacts">
              <button className="dz-iconbtn" aria-label="Search">
                <IconSearch />
              </button>
              <button className="dz-iconbtn" aria-label="Cart">
                <IconCart />
                <span className="dz-badge-num">2</span>
              </button>
              <button className="dz-iconbtn" aria-label="Notifications">
                <IconBell />
                <span className="dz-badge-num">4</span>
              </button>
              <div className="dz-user">
                <div className="dz-avatar">DP</div>
                <div style={{ lineHeight: 1.25 }}>
                  <div
                    style={{ fontFamily: "var(--condensed)", fontSize: 13, letterSpacing: ".12em" }}
                  >
                    Detective Prime
                  </div>
                  <div className="dz-logosub" style={{ marginTop: 2 }}>
                    Level 7
                  </div>
                </div>
              </div>
              <button
                className="dz-iconbtn dz-burger"
                aria-label="Menu"
                onClick={() => setMenuOpen((v) => !v)}
                style={{ color: "var(--fg)" }}
              >
                {menuOpen ? <IconClose size={20} /> : <IconMenu size={20} />}
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="dz-mobilemenu">
              {NAV.map((i) => (
                <a key={i} href="#" onClick={() => setMenuOpen(false)}>
                  {i}
                </a>
              ))}
            </div>
          )}
        </header>
      )}

      <main style={{ position: "relative", zIndex: 1 }}>
        {/* ---------------- HERO ---------------- */}
        <section className="dz-hero">
          <div className="dz-wrap dz-herogrid">
            <div className="dz-fadein" style={{ position: "relative", zIndex: 20 }}>
              <div className="dz-eyebrow">
                <span className="dz-rule" />
                <span className="dz-kicker">Get in touch</span>
                <span style={{ height: 1, flex: 1, background: "var(--line)" }} />
              </div>

              <h1 className="dz-h1">
                Contact the
                <br />
                <span className="dz-red">Investigation</span>
                <br />
                Team
              </h1>

              <p className="dz-lead">
                Every investigation starts with a conversation. Whether you&apos;re reporting a
                clue, requesting assistance, or exploring partnership opportunities, our detectives
                are ready to respond.
              </p>

              <div className="dz-ctas">
                <a href="#case-form">
                  <MagneticButton full icon={<IconArrow size={13} />}>
                    Open Investigation
                  </MagneticButton>
                </a>
                <a href="#faq">
                  <MagneticButton variant="ghost" full icon={<IconLife size={13} />}>
                    Support Center
                  </MagneticButton>
                </a>
              </div>
            </div>

            <div className="dz-heroart">
              <div className="dz-shell" style={{ position: "absolute", inset: 0, borderRadius: 6 }}>
                <span className="dz-tick dz-tick--tl" />
                <span className="dz-tick dz-tick--tr" />
                <span className="dz-tick dz-tick--bl" />
                <span className="dz-tick dz-tick--br" />
                <div
                  className="dz-core dz-grain"
                  style={{
                    position: "absolute",
                    inset: 8,
                    overflow: "hidden",
                    border: "1px solid var(--line)",
                  }}
                >
                  <img
                    ref={heroImgRef}
                    src={IMAGES.hero}
                    alt="Noir detective headquarters with an evidence board and rain-streaked window"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transform: "translateY(0px) scale(1.08)",
                      willChange: "transform",
                    }}
                  />
                  <div className="dz-rain" />
                  <div className="dz-dust" />
                  <div className="dz-vign" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- CONTACT METHODS (FOUR WAYS TO REACH THE DESK) ---------------- */}
        <section className="dz-block">
          <div className="dz-wrap">
            <SectionHeading
              kicker={channelsData.kicker}
              title={channelsData.title}
              accent={channelsData.accent}
            />
            <div className="dz-grid4">
              {channelsData.list.map((m, i) => (
                <Reveal key={m.title} delay={i * 90}>
                  <div className="dz-shell">
                    <div className="dz-core dz-card">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <div className="dz-cardtile">
                          <m.Icon size={20} />
                        </div>
                        <span
                          className="dz-mono"
                          style={{
                            fontSize: 10,
                            letterSpacing: ".28em",
                            color: "rgba(150,148,143,.7)",
                          }}
                        >
                          {m.file}
                        </span>
                      </div>
                      <h3>{m.title}</h3>
                      <div className="dz-cardline" />
                      <div style={{ marginTop: 16, display: "grid", gap: 4 }}>
                        {m.lines.map((l) => (
                          <p key={l} style={{ fontSize: 14, color: "var(--muted)" }}>
                            {l}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- FORM + SUPPORT (CONFIDENTIAL REPORT: OPEN A NEW CASE) ---------------- */}
        <section id="case-form" className="dz-block" style={{ paddingTop: 0 }}>
          <div className="dz-split">
            <Reveal>
              <div className="dz-shell" style={{ height: "100%" }}>
                <span className="dz-tick dz-tick--tl" />
                <span className="dz-tick dz-tick--bl" />
                <div
                  className="dz-core dz-grain"
                  style={{ padding: "clamp(28px,4vw,48px)", height: "100%" }}
                >
                  <div className="dz-eyebrow">
                    <span className="dz-rule" />
                    <span className="dz-kicker">{formConfig.kicker}</span>
                  </div>
                  <h2 style={{ marginTop: 26, fontSize: "clamp(2.8rem,5vw,4rem)" }}>
                    {formConfig.title} <span className="dz-red">{formConfig.accent}</span>
                  </h2>
                  <p
                    style={{
                      marginTop: 16,
                      maxWidth: "28rem",
                      fontSize: 14,
                      lineHeight: 1.75,
                      color: "var(--muted)",
                    }}
                  >
                    {formConfig.description}
                  </p>

                  <form onSubmit={onCaseSubmit} style={{ marginTop: 44, display: "grid", gap: 22 }}>
                    <div className="dz-formgrid">
                      <label>
                        <span className="dz-label">Name</span>
                        <input
                          required
                          name="name"
                          maxLength={100}
                          placeholder="Full name"
                          className="dz-field"
                        />
                      </label>
                      <label>
                        <span className="dz-label">Email</span>
                        <input
                          required
                          type="email"
                          name="email"
                          maxLength={255}
                          placeholder="you@domain.com"
                          className="dz-field"
                        />
                      </label>
                      <label>
                        <span className="dz-label">Phone</span>
                        <input
                          name="phone"
                          maxLength={40}
                          placeholder="+1 000 000 0000"
                          className="dz-field"
                        />
                      </label>
                      <label>
                        <span className="dz-label">Inquiry type</span>
                        <div className="dz-selwrap">
                          <select
                            name="type"
                            className="dz-field"
                            style={{ appearance: "none", paddingRight: 40 }}
                          >
                            {INQUIRY_TYPES.map((t) => (
                              <option key={t} value={t} style={{ background: "#070707" }}>
                                {t}
                              </option>
                            ))}
                          </select>
                          <IconChevron size={16} />
                        </div>
                      </label>
                    </div>

                    <label>
                      <span className="dz-label">Subject</span>
                      <input
                        required
                        name="subject"
                        maxLength={150}
                        placeholder="Short case title"
                        className="dz-field"
                      />
                    </label>

                    <label>
                      <span className="dz-label">Message</span>
                      <textarea
                        required
                        name="message"
                        rows={6}
                        maxLength={1000}
                        placeholder="Describe the clue, request or inquiry in detail…"
                        className="dz-field"
                        style={{ resize: "none", lineHeight: 1.75 }}
                      />
                    </label>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 24,
                        paddingTop: 8,
                      }}
                    >
                      <MagneticButton type="submit" icon={<IconSend size={16} />}>
                        {submitting ? "Filing…" : "Submit Investigation"}
                      </MagneticButton>
                      <p
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          fontSize: 12,
                          color: "var(--muted)",
                        }}
                      >
                        <IconShield size={16} className="dz-red" /> Encrypted · Detective eyes only
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="dz-shell" style={{ height: "100%" }}>
                <span className="dz-tick dz-tick--tr" />
                <span className="dz-tick dz-tick--br" />
                <div
                  className="dz-core"
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    background: "var(--panel2)",
                  }}
                >
                  <div
                    className="dz-grain"
                    style={{
                      position: "relative",
                      aspectRatio: "16 / 10",
                      overflow: "hidden",
                      borderBottom: "1px solid var(--line)",
                    }}
                  >
                    <img
                      src={IMAGES.support}
                      alt="Detective analysing evidence with case screens"
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
                    />
                    <div className="dz-dust" />
                    <div className="dz-scan" />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      flexDirection: "column",
                      padding: "clamp(24px,3vw,36px)",
                    }}
                  >
                    <h3 style={{ fontSize: 28 }}>
                      Live <span className="dz-red">assistance</span>
                    </h3>
                    <p
                      style={{
                        marginTop: 14,
                        fontSize: 14,
                        lineHeight: 1.75,
                        color: "var(--muted)",
                      }}
                    >
                      A senior detective is monitoring the wire. Skip the queue for time-sensitive
                      evidence.
                    </p>

                    <dl className="dz-dl">
                      {[
                        ["Response time", "Under 12 hours"],
                        ["Live status", "Desk open · 3 detectives"],
                        ["Support email", "support@detectivezone.io"],
                        ["Priority line", "+91 63057 29867"],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <dt className="dz-dt">{k}</dt>
                          <dd className="dz-dd" style={{ margin: 0 }}>
                            {v}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <div style={{ marginTop: "auto", paddingTop: 36 }}>
                      <MagneticButton variant="ghost" full icon={<IconChat size={16} />}>
                        Start Live Chat
                      </MagneticButton>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section id="faq" className="dz-block" style={{ paddingTop: 0 }}>
          <div className="dz-wrap dz-faqgrid">
            <SectionHeading
              kicker="Case archive"
              title="Frequently opened"
              accent="files"
              description="Five files answer most inquiries before they reach a detective."
            />
            <div style={{ borderTop: "1px solid var(--line)" }}>
              {FAQS.map((f, i) => {
                const active = openFaq === i;
                return (
                  <Reveal key={f.q} delay={i * 60}>
                    <div className={`dz-faq ${active ? "is-open" : ""}`}>
                      <button
                        className="dz-faqbtn"
                        aria-expanded={active}
                        onClick={() => setOpenFaq(active ? null : i)}
                      >
                        <span
                          className="dz-mono"
                          style={{
                            fontSize: 10,
                            letterSpacing: ".26em",
                            color: active ? "var(--red)" : "rgba(150,148,143,.7)",
                            transition: "color .4s var(--ease)",
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="dz-faqq">{f.q}</span>
                        <span className="dz-faqico">
                          <IconChevron size={16} className={active ? "dz-red" : "dz-mutedtxt"} />
                        </span>
                      </button>
                      <div
                        className="dz-faqbody"
                        style={{ gridTemplateRows: active ? "1fr" : "0fr" }}
                      >
                        <div>
                          <p className="dz-faqa">{f.a}</p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* ---------------- FOOTER ---------------- */}
      {!embedded && (
        <footer className="dz-footer" style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              position: "absolute",
              insetInline: 0,
              top: 0,
              height: 1,
              background:
                "linear-gradient(to right,var(--red),rgba(193,24,24,.12) 65%,transparent)",
            }}
          />
          <FingerprintMark
            style={{
              position: "absolute",
              right: -24,
              bottom: 16,
              height: 256,
              width: 208,
              color: "rgba(255,255,255,.04)",
              pointerEvents: "none",
            }}
          />

          <div className="dz-wrap dz-footergrid">
            <div>
              <div className="dz-logo">
                <div className="dz-logomark">
                  D
                  <span
                    style={{
                      position: "static",
                      background: "none",
                      width: "auto",
                      height: "auto",
                    }}
                    className="dz-red"
                  >
                    Z
                  </span>
                  <span />
                </div>
                <div className="dz-logotext">
                  DETECTIVE <span className="dz-red">ZONE</span>
                </div>
              </div>
              <p
                style={{
                  marginTop: 24,
                  maxWidth: 220,
                  fontSize: 14,
                  lineHeight: 1.75,
                  color: "var(--muted)",
                }}
              >
                The ultimate detective experience. Built by mystery lovers, for mystery lovers.
              </p>
            </div>

            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h4>{col.title}</h4>
                <div style={{ marginTop: 8, height: 1, width: 32, background: "var(--red)" }} />
                <ul>
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h4>Follow Us</h4>
              <div style={{ marginTop: 8, height: 1, width: 32, background: "var(--red)" }} />
              <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 12 }}>
                {Object.keys(socialPaths).map((name) => (
                  <a key={name} href="#" aria-label={name} className="dz-soc">
                    <SocialIcon name={name} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="dz-footbar">
            <div className="dz-wrap dz-footbarin">
              <p className="dz-mono" style={{ fontSize: 11, color: "var(--muted)" }}>
                © 2026 Detective Zone. All Rights Reserved.
              </p>
              <p
                className="dz-mono"
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: ".4em",
                  color: "rgba(150,148,143,.7)",
                }}
              >
                Every clue. A step closer.
              </p>
            </div>
          </div>
        </footer>
      )}

      {/* ---------------- TOASTS ---------------- */}
      <div className="dz-toasts">
        {toasts.map((t) => (
          <div key={t.id} className="dz-toast">
            <b>{t.title}</b>
            <p>{t.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
