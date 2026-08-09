import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import {
  Search,
  ShoppingCart,
  Star,
  Lock,
  Award,
  Shield,
  Eye,
  X,
  MapPin,
  Clock,
  Plus,
  Minus,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  Play,
  Boxes,
  Package,
  FlaskConical,
  Gem,
  KeyRound,
  Map,
  ClipboardList,
  FolderOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  CaseKitsEvidence,
  CaseKitCards,
  type KitEvidenceItem,
} from "@/components/templates/CaseKitsEvidence";
import caseVoicemail from "@/assets/case-voicemail.png";
import caseWitness from "@/assets/case-witness.png";
import caseLetter from "@/assets/case-letter.png";
import caseBetrayal from "@/assets/case-betrayal.png";
import caseHeir from "@/assets/case-heir.png";
import caseExperiment from "@/assets/case-experiment.png";
import evidenceRoom from "@/assets/evidence-room.jpg";
import dz001Kit from "@/assets/case kits/image.png";
import sigAudio from "@/assets/signature/audio.png";
import sigCamera from "@/assets/signature/camera.png";
import sigFiles from "@/assets/signature/files.png";
import sigMobile from "@/assets/signature/mobile.png";
import sigPuzzle from "@/assets/signature/puzzle.png";
import sigTime from "@/assets/signature/time.png";

export const Route = createFileRoute("/store")({
  component: StorePage,
});

/* ─── data ─── */
interface Product {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  price: number;
  image: string;
  badge: string;
  stars: number;
  reviews: number;
  difficulty: string;
  duration: string;
  type: "physical" | "digital" | "hybrid";
  stock: number;
}

const products: Product[] = [
  {
    id: "p1",
    caseNumber: "CASE 001",
    title: "The Last Voicemail",
    description:
      "A successful businessman found dead in his study. No forced entry. Just a voicemail… and a lot of questions. Every clue leads deeper into a web of secrets no one was meant to uncover.",
    price: 999,
    image: caseVoicemail,
    badge: "BESTSELLER",
    stars: 5,
    reviews: 124,
    difficulty: "Hard",
    duration: "3–5 hrs",
    type: "hybrid",
    stock: 12,
  },
  {
    id: "p2",
    caseNumber: "CASE 002",
    title: "The Silent Witness",
    description:
      "A reclusive writer found dead in a locked room. A witness that never spoke… but saw everything. The pages of the final manuscript hold the key to a truth buried in silence.",
    price: 999,
    image: caseWitness,
    badge: "BESTSELLER",
    stars: 5,
    reviews: 98,
    difficulty: "Hard",
    duration: "3–6 hrs",
    type: "hybrid",
    stock: 8,
  },
  {
    id: "p3",
    caseNumber: "CASE 003",
    title: "Blood in the Letter",
    description:
      "A threatening letter. A missing girl. A trail of blood. The shadows are speaking. Follow the crimson ink before the next message arrives — and the clock runs out.",
    price: 999,
    image: caseLetter,
    badge: "NEW",
    stars: 4,
    reviews: 76,
    difficulty: "Medium",
    duration: "2–4 hrs",
    type: "physical",
    stock: 24,
  },
  {
    id: "p4",
    caseNumber: "CASE 004",
    title: "Shadows of Betrayal",
    description:
      "A man caught between loyalty and truth. One choice changed everything. Trust no one. Deception runs deep, and the betrayer may be closer than you think.",
    price: 999,
    image: caseBetrayal,
    badge: "COLLECTOR",
    stars: 5,
    reviews: 64,
    difficulty: "Expert",
    duration: "4–7 hrs",
    type: "hybrid",
    stock: 5,
  },
  {
    id: "p5",
    caseNumber: "CASE 005",
    title: "The Vanished One",
    description:
      "They were here one day, gone the next. A disappearance that made no noise at all. No goodbye, no trace — just an empty room and a question that haunts everyone.",
    price: 999,
    image: caseHeir,
    badge: "CLASSIFIED",
    stars: 4,
    reviews: 42,
    difficulty: "Medium",
    duration: "3–5 hrs",
    type: "physical",
    stock: 15,
  },
  {
    id: "p6",
    caseNumber: "CASE 006",
    title: "The Final Experiment",
    description:
      "A scientist's last experiment was never meant to be found. Now the cure is the disease. The lab notes tell a story of obsession, and the final formula changes everything.",
    price: 999,
    image: caseExperiment,
    badge: "TOP SECRET",
    stars: 5,
    reviews: 83,
    difficulty: "Hard",
    duration: "4–6 hrs",
    type: "hybrid",
    stock: 9,
  },
];

interface KitBoxItem {
  icon: LucideIcon;
  label: string;
  note: string;
}

interface CaseKit {
  id: string;
  name: string;
  tagline: string;
  image: string;
  badge: string;
  price: number;
  originalPrice: number;
  cases: { number: string; title: string; difficulty: string }[];
  box: KitBoxItem[];
}

const caseKits: CaseKit[] = [
  {
    id: "kit2",
    name: "The Signature Collection",
    tagline: "The complete archive. Every flagship case, every clue, one evidence locker.",
    image: evidenceRoom,
    badge: "SAVE 12%",
    price: 3499,
    originalPrice: 3996,
    cases: [
      { number: "CASE 001", title: "The Last Voicemail", difficulty: "Hard" },
      { number: "CASE 002", title: "The Silent Witness", difficulty: "Hard" },
      { number: "CASE 003", title: "Blood in the Letter", difficulty: "Medium" },
      { number: "CASE 004", title: "Shadows of Betrayal", difficulty: "Expert" },
    ],
    box: [
      { icon: Package, label: "Signature Evidence Box", note: "Rigid collector case" },
      { icon: ClipboardList, label: "Complete Case Files", note: "4 full dossiers" },
      { icon: FlaskConical, label: "Evidence Vials", note: "Lab-sealed samples" },
      { icon: Map, label: "Investigation Blueprint", note: "Crime-scene floor plan" },
      { icon: KeyRound, label: "Replica Room Keys", note: "Prop evidence" },
      { icon: Gem, label: "Collector Case Card", note: "Numbered edition" },
    ],
  },
];

interface CartItem {
  product: Product;
  qty: number;
}

/* ─── helper ─── */
const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

/* ─── scroll reveal component ─── */
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -10% 0px",
      },
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) scale(1)" : "translateY(50px) scale(0.97)",
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── component ─── */
function StorePage() {
  const [cart, setCart] = useState<CartItem[]>(() => [
    { product: products[0], qty: 1 },
    { product: products[1], qty: 1 },
  ]);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [cartOpen, setCartOpen] = useState(false);
  const [storeTab, setStoreTab] = useState<"CASES" | "KITS">("CASES");
  const featuredRef = useRef<HTMLDivElement>(null);
  const [featuredParallax, setFeaturedParallax] = useState(0);
  const [dz001Hovered, setDz001Hovered] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = featuredRef.current;
        if (!el || storeTab !== "CASES") return;
        const r = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const relativeScroll = (r.top + r.height / 2 - viewportHeight / 2) * 0.08;
        setFeaturedParallax(relativeScroll);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [storeTab]);

  const { addToCart: addGlobalCart } = useCart();

  const addToCart = (p: Product) => {
    addGlobalCart({
      id: p.id,
      title: p.title,
      caseNumber: p.caseNumber,
      price: p.price,
      image: p.image,
      type: p.type === "physical" ? "Physical Case Box" : "Hybrid Evidence Package",
    });
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === p.id);
      if (existing) return prev.map((c) => (c.product.id === p.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { product: p, qty: 1 }];
    });
    setAddedIds((s) => {
      const n = new Set(s);
      n.add(p.id);
      return n;
    });
    setTimeout(
      () =>
        setAddedIds((s) => {
          const n = new Set(s);
          n.delete(p.id);
          return n;
        }),
      1200,
    );
  };

  const addKitToCart = (kit: CaseKit) => {
    addToCart({
      id: kit.id,
      caseNumber: "CASE KIT",
      title: kit.name,
      description: kit.tagline,
      price: kit.price,
      image: kit.image,
      badge: kit.badge,
      stars: 5,
      reviews: 0,
      difficulty: "Bundle",
      duration: "6–20 hrs",
      type: "physical",
      stock: 20,
    });
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((c) => c.product.id !== id));

  const updateQty = (id: string, delta: number) =>
    setCart((prev) =>
      prev
        .map((c) => (c.product.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c))
        .filter((c) => c.qty > 0),
    );

  const subtotal = cart.reduce((sum, c) => sum + c.product.price * c.qty, 0);
  const shipping = 0;
  const taxes = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + taxes;

  const kitsEvidence: KitEvidenceItem[] = caseKits.map((k) => ({
    id: k.id,
    code: k.id.replace(/kit/i, "KIT-").toUpperCase(),
    name: k.name,
    tagline: k.tagline,
    image: k.image,
    badge: k.badge,
    price: k.price,
    originalPrice: k.originalPrice,
    casesIncluded: k.cases.length,
    itemsInBox: k.box.length,
    save: k.originalPrice - k.price,
    box: k.box,
    cases: k.cases,
  }));

  return (
    <div
      style={{
        background: "#040404",
        minHeight: "100vh",
        paddingTop: 72,
      }}
    >
      {/* ---- Ambient vignette ---- */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
        }}
      />
      {/* ---- Faint red ambient glow ---- */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(122,15,19,0.06) 0%, transparent 60%)",
        }}
      />

      {/* ---- dust particles ---- */}
      <style>{`
        @keyframes dust-float {
          0%,100%{ transform: translateY(0) translateX(0); opacity:0; }
          10%{ opacity:0.5; }
          50%{ transform: translateY(-180px) translateX(40px); opacity:0.3; }
          90%{ opacity:0; }
        }
        .dust-particle {
          position: fixed;
          width: 2px; height: 2px;
          background: rgba(255,255,255,0.15);
          border-radius: 50%;
          animation: dust-float 12s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
        }
        @keyframes card-glow {
          0%,100% { box-shadow: 0 0 0 rgba(200,29,36,0); }
          50% { box-shadow: 0 0 20px rgba(200,29,36,0.15); }
        }
        @keyframes fade-up { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fade-up 0.7s ease-out both; }
        .fade-up-d1 { animation-delay: 0.1s; }
        .fade-up-d2 { animation-delay: 0.2s; }
        .fade-up-d3 { animation-delay: 0.3s; }
        .fade-up-d4 { animation-delay: 0.4s; }
        @keyframes badge-pulse {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="dust-particle"
          style={{
            left: `${10 + i * 12}%`,
            top: `${30 + (i % 3) * 20}%`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${10 + i * 2}s`,
          }}
        />
      ))}

      {/* ═══════ MAIN 2-COL LAYOUT ═══════ */}
      <div
        className="relative z-10 mx-auto flex gap-6 px-4 sm:px-6"
        style={{ maxWidth: 1400, paddingTop: 32 }}
      >
        {/* ┌──────── CENTER CONTENT ────────┐ */}
        <main className="min-w-0 flex-1">
          {/* ──── HERO BANNER ──── */}
          <section
            className="fade-up relative overflow-hidden rounded-2xl border"
            style={{
              height: "clamp(400px, 30vw, 420px)",
              borderColor: "#000",
              background: "linear-gradient(135deg, rgba(9,9,9,1) 0%, rgba(4,4,4,1) 100%)",
            }}
          >
            {/* bg image */}
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url(${evidenceRoom})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.75,
                filter: "brightness(0.85) contrast(1.1)",
              }}
            />
            {/* gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(4,4,4,0.85) 0%, rgba(4,4,4,0.4) 50%, rgba(4,4,4,0.1) 100%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to top, rgba(4,4,4,1) 0%, transparent 40%)",
              }}
            />

            {/* hero content */}
            <div className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-12">
              <h1
                className="font-display leading-[0.95]"
                style={{ fontSize: "clamp(2.5rem, 9vw, 4.5rem)", letterSpacing: "-0.02em" }}
              >
                <span className="block text-white">CRIME FILES.</span>
                <span className="block text-white">REAL EVIDENCE.</span>
                <span className="block" style={{ color: "#C81D24" }}>
                  YOUR INVESTIGATION.
                </span>
              </h1>
              <p
                className="mt-5 max-w-[440px] text-[13px] leading-relaxed"
                style={{
                  color: "#999",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Every case comes with real-world clues.
                <br />
                Every solution brings you closer to the truth.
              </p>
              <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
                <button
                  className="group relative flex items-center justify-center gap-2 rounded-lg border px-7 py-3.5 font-display text-[12px] tracking-[0.2em] uppercase transition-all duration-500"
                  style={{
                    background: "linear-gradient(135deg, #7A0F13 0%, #A11418 100%)",
                    borderColor: "rgba(200,29,36,0.4)",
                    color: "#fff",
                    boxShadow: "0 0 30px rgba(122,15,19,0.3)",
                  }}
                >
                  Explore Cases
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <button
                  className="group flex items-center justify-center gap-2 rounded-lg border px-6 py-3.5 font-mono text-[11px] tracking-[0.15em] uppercase transition-all duration-500"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.1)",
                    color: "#A8A8A8",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Play className="h-3 w-3" style={{ color: "#C81D24" }} />
                  Watch Preview
                </button>
              </div>
            </div>
          </section>

          {/* ──── STORE TABS ──── */}
          <section className="mt-12">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-[2px] w-8" style={{ background: "#7A0F13" }} />
                <h2
                  className="font-display text-[16px] tracking-[0.25em] uppercase sm:text-[18px]"
                  style={{ color: "#fff" }}
                >
                  The Evidence Locker
                </h2>
              </div>
              <Link
                to="/cases"
                className="group flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] uppercase transition-colors duration-300"
                style={{ color: "#888" }}
              >
                View All Cases
                <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* tab bar */}
            <div
              className="mb-8 flex w-fit items-center gap-1 rounded-xl border p-1.5"
              style={{
                background: "rgba(11,11,11,0.9)",
                borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              {(
                [
                  { key: "CASES", label: "All Cases", icon: FolderOpen },
                  { key: "KITS", label: "Case Kits", icon: Boxes },
                ] as const
              ).map(({ key, label, icon: Ic }) => (
                <button
                  key={key}
                  onClick={() => setStoreTab(key)}
                  className="flex items-center gap-2 rounded-lg px-4 py-2.5 font-mono text-[11px] font-semibold tracking-[0.15em] uppercase transition-all duration-500 sm:px-6"
                  style={{
                    background:
                      storeTab === key
                        ? "linear-gradient(135deg, #7A0F13 0%, #A11418 100%)"
                        : "transparent",
                    color: storeTab === key ? "#fff" : "#777",
                    border:
                      storeTab === key ? "1px solid rgba(200,29,36,0.4)" : "1px solid transparent",
                    boxShadow: storeTab === key ? "0 0 20px rgba(122,15,19,0.25)" : "none",
                  }}
                >
                  <Ic className="h-3.5 w-3.5" />
                  {label}
                  <span
                    className="rounded-md px-1.5 py-0.5 font-mono text-[8px]"
                    style={{
                      background:
                        storeTab === key ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                      color: storeTab === key ? "#fff" : "#999",
                    }}
                  >
                    {key === "CASES" ? products.length : caseKits.length}
                  </span>
                </button>
              ))}
            </div>

            {/* ──── CASE KITS EVIDENCE VAULT ──── */}
            {storeTab === "KITS" && (
              <>
                <CaseKitsEvidence />

                {/* ═══════ DZ-001 FEATURED CASE KIT PRESENTATION ═══════ */}
                <section className="relative mt-8 overflow-hidden">
                  {/* Ambient scan line animation */}
                  <style>{`
                    @keyframes scan-line {
                      0% { top: -2px; opacity: 0; }
                      10% { opacity: 0.6; }
                      90% { opacity: 0.6; }
                      100% { top: 100%; opacity: 0; }
                    }
                    @keyframes edge-glow {
                      0%, 100% { box-shadow: 0 0 15px rgba(200,29,36,0.15), inset 0 0 15px rgba(200,29,36,0.05); }
                      50% { box-shadow: 0 0 25px rgba(200,29,36,0.3), inset 0 0 25px rgba(200,29,36,0.1); }
                    }
                    .dz-kit-image-wrap:hover .dz-scan-line {
                      animation: scan-line 2.5s ease-in-out infinite;
                    }
                    .dz-kit-image-wrap {
                      animation: edge-glow 4s ease-in-out infinite;
                    }
                  `}</style>

                  <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
                    {/* Section divider */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C81D24]/30 to-transparent" />
                      <span className="font-mono text-[10px] tracking-[0.3em] text-[#C81D24]/60 uppercase">
                        Featured Investigation
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C81D24]/30 to-transparent" />
                    </div>

                    {/* Main DZ-001 Layout: Image Left + Info Right */}
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
                      {/* LEFT: Large cinematic case kit image */}
                      <div
                        className="dz-kit-image-wrap relative w-full lg:w-[58%] xl:w-[55%] overflow-hidden rounded-[3px] cursor-pointer"
                        style={{
                          border: "1px solid rgba(200,29,36,0.15)",
                        }}
                        onMouseEnter={() => setDz001Hovered(true)}
                        onMouseLeave={() => setDz001Hovered(false)}
                      >
                        {/* Scan line overlay */}
                        <div
                          className="dz-scan-line absolute left-0 right-0 h-[2px] z-20 pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent 0%, rgba(200,29,36,0.6) 50%, transparent 100%)",
                            top: "-2px",
                            opacity: 0,
                          }}
                        />

                        {/* Film grain overlay */}
                        <div
                          className="absolute inset-0 z-10 pointer-events-none opacity-[0.04]"
                          style={{
                            backgroundImage:
                              "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')",
                          }}
                        />

                        <img
                          src={dz001Kit}
                          alt="DZ-001 The Last Voicemail - Detective's Zone Case Kit"
                          className="w-full h-auto object-contain transition-all duration-[600ms] ease-out"
                          style={{
                            transform: dz001Hovered
                              ? "scale(1.025) translateY(-4px)"
                              : "scale(1) translateY(0)",
                            filter: dz001Hovered
                              ? "brightness(1.05) contrast(1.02)"
                              : "brightness(1) contrast(1)",
                          }}
                        />

                        {/* Bottom fade */}
                        <div
                          className="absolute bottom-0 left-0 right-0 h-16 z-10 pointer-events-none"
                          style={{
                            background: "linear-gradient(to top, #050505 0%, transparent 100%)",
                          }}
                        />
                      </div>

                      {/* RIGHT: Editorial information panel */}
                      <div
                        className="w-full lg:w-[42%] xl:w-[45%] flex flex-col justify-center lg:py-8 transition-all duration-[600ms] ease-out"
                        style={{
                          transform: dz001Hovered ? "translateY(-6px)" : "translateY(0)",
                        }}
                      >
                        {/* Case code */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="font-mono text-[13px] tracking-[0.3em] text-[#C81D24] font-bold">
                            DZ-001
                          </span>
                          <div className="h-px w-8 bg-[#C81D24]/40" />
                          <span className="font-mono text-[9px] tracking-[0.2em] text-[#555] uppercase">
                            Official Investigation
                          </span>
                        </div>

                        {/* Title with hover state */}
                        <h3 className="font-display text-[32px] lg:text-[40px] xl:text-[46px] tracking-[0.04em] uppercase text-white leading-[0.95] transition-all duration-500">
                          {dz001Hovered ? (
                            <span className="text-[#C81D24]">The Case Is Open.</span>
                          ) : (
                            <>
                              The Last <span className="text-[#C81D24]">Voicemail</span>
                            </>
                          )}
                        </h3>

                        {/* Description */}
                        <p
                          className="mt-5 text-[15px] leading-[1.7] text-[#888] font-sans max-w-md"
                          style={{ fontStyle: "italic" }}
                        >
                          "A sealed case. A missing voice. Thirty pieces of evidence standing
                          between you and the truth."
                        </p>

                        {/* Metadata chips */}
                        <div className="mt-7 flex flex-wrap gap-6 text-[12px] font-mono text-[#aaa] tracking-[0.15em] uppercase">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[#C81D24] text-[18px] font-bold tracking-normal">
                              01
                            </span>
                            <span className="text-[10px] text-[#555]">Case</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[#C81D24] text-[18px] font-bold tracking-normal">
                              3–4
                            </span>
                            <span className="text-[10px] text-[#555]">Hours</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[#C81D24] text-[18px] font-bold tracking-normal">
                              Expert
                            </span>
                            <span className="text-[10px] text-[#555]">Level</span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="mt-8 flex items-baseline gap-3">
                          <span className="font-display text-[36px] font-bold text-white">
                            ₹999<span className="text-[20px] text-[#666]">/-</span>
                          </span>
                        </div>
                        <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-[#555] uppercase">
                          Free Shipping & Taxes Included
                        </p>

                        {/* CTA */}
                        <button
                          onClick={() => addToCart(products[0])}
                          className="group/cta mt-8 flex items-center gap-3 rounded-[3px] py-3.5 px-7 font-mono text-[12px] font-bold tracking-[0.2em] uppercase transition-all duration-500 cursor-pointer w-fit"
                          style={{
                            background: "linear-gradient(135deg, #7A0F13 0%, #A11418 100%)",
                            border: "1px solid rgba(200,29,36,0.5)",
                            color: "#fff",
                            boxShadow: "0 0 30px rgba(122,15,19,0.2)",
                          }}
                        >
                          Add to Cart
                          <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/cta:translate-x-1.5" />
                        </button>

                        {/* Evidence list */}
                        <div className="mt-10 border-t border-white/5 pt-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                            {[
                              "30+ Authentic Documents",
                              "Exclusive Audio Evidence",
                              "Crime Scene Photographs",
                              "Digital Evidence",
                              "Forensic Analysis",
                              "Hidden Clues & Secret Files",
                            ].map((item) => (
                              <div key={item} className="flex items-center gap-2.5">
                                <div className="h-1 w-1 rounded-full bg-[#C81D24]" />
                                <span className="font-mono text-[10px] tracking-[0.15em] text-[#666] uppercase">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ═══════ CASE KIT CARDS — HOVER SHOWCASE ═══════ */}
                <div className="mt-16">
                  <CaseKitCards
                    kits={kitsEvidence}
                    images={[sigAudio, sigCamera, sigFiles, sigMobile, sigPuzzle, sigTime]}
                    onAdd={(kit) => {
                      const orig = caseKits.find((c) => c.id === kit.id);
                      if (orig) addKitToCart(orig);
                    }}
                  />
                </div>
              </>
            )}

            {/* ──── ALL CASES GRID (ASYNCHRONOUS DETECTIVE ARCHIVE LAYOUT) ──── */}
            {storeTab === "CASES" && (
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start mt-6">
                {/* Left Column: Large sticky featured card */}
                <div
                  ref={featuredRef}
                  className="w-full lg:w-[42%] xl:w-[38%] lg:sticky lg:top-[96px] z-10 transition-all duration-500"
                >
                  <div
                    className="group relative flex flex-col justify-end overflow-hidden border border-white/5 bg-[#090909] rounded-[4px] h-[460px] lg:h-[530px] p-3.5 lg:p-4"
                    style={{
                      boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
                    }}
                  >
                    {/* Parallax Background Image */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      <img
                        src={products[0].image}
                        alt={products[0].title}
                        className="h-full w-full object-cover origin-center opacity-45 brightness-75 contrast-125 transition-transform duration-700"
                        style={{
                          transform: `translateY(${featuredParallax}px) scale(1.15)`,
                        }}
                      />
                      {/* Ambient vignette and gradients */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(9,9,9,1) 0%, rgba(9,9,9,0.8) 30%, transparent 70%)",
                        }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(ellipse at center, transparent 30%, rgba(5,5,5,0.9) 100%)",
                        }}
                      />
                    </div>

                    {/* Content Overlay */}
                    <div className="relative z-10 flex flex-col h-full justify-between pointer-events-none">
                      {/* Top Row: Case badge & number */}
                      <div className="flex items-center justify-between w-full">
                        <span
                          className="rounded-[2px] px-2 py-0.5 font-mono text-[9px] font-bold tracking-[0.2em] uppercase border"
                          style={{
                            background:
                              products[0].badge === "BESTSELLER"
                                ? "rgba(122,15,19,0.9)"
                                : products[0].badge === "NEW"
                                  ? "rgba(20,120,20,0.85)"
                                  : "rgba(180,140,40,0.85)",
                            borderColor: "rgba(255,255,255,0.1)",
                            color: "#fff",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          {products[0].badge}
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setQuickView(products[0])}
                            className="flex h-7 w-7 items-center justify-center rounded-[3px] transition-all duration-300 hover:bg-white/10 pointer-events-auto"
                            style={{
                              background: "rgba(0,0,0,0.4)",
                              border: "1px solid rgba(255,255,255,0.1)",
                            }}
                          >
                            <Eye className="h-3.5 w-3.5 text-white" />
                          </button>
                          <span className="font-mono text-[10px] tracking-[0.25em] text-[#555] font-semibold">
                            {products[0].caseNumber}
                          </span>
                        </div>
                      </div>

                      {/* Bottom section: Title, Description, Meta & Actions */}
                      <div className="pointer-events-auto">
                        <h3 className="font-display text-[18px] lg:text-[22px] tracking-[0.05em] uppercase text-white leading-tight transition-transform duration-500 group-hover:translate-x-1">
                          {products[0].title}
                        </h3>

                        <p className="mt-1 text-[10.5px] leading-normal text-[#888] font-sans max-w-[260px]">
                          {products[0].description}
                        </p>

                        {/* Evidence details / status */}
                        <div className="mt-2.5 flex flex-wrap gap-1.5 items-center text-[8.5px] font-mono text-[#666]">
                          <span className="border border-white/5 bg-white/[0.02] px-1.5 py-0.5 uppercase tracking-wider">
                            DIFFICULTY: {products[0].difficulty}
                          </span>
                          <span className="border border-white/5 bg-white/[0.02] px-1.5 py-0.5 uppercase tracking-wider">
                            TIME: {products[0].duration}
                          </span>
                        </div>

                        {/* Price & Rating */}
                        <div className="mt-2.5 flex items-center justify-between border-t border-white/5 pt-1.5">
                          <span className="font-display text-[18px] font-bold text-[#C81D24]">
                            {fmt(products[0].price)}
                          </span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, si) => (
                              <Star
                                key={si}
                                className="h-3 w-3"
                                style={{
                                  fill: si < products[0].stars ? "#C81D24" : "transparent",
                                  color: si < products[0].stars ? "#C81D24" : "#222",
                                }}
                              />
                            ))}
                            <span className="ml-1 font-mono text-[8px] text-[#555] font-semibold">
                              ({products[0].reviews})
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-3 flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => addToCart(products[0])}
                            className="flex-1 flex items-center justify-center gap-2 rounded-[3px] py-2.5 font-mono text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer"
                            style={{
                              background: addedIds.has(products[0].id)
                                ? "rgba(20,120,20,0.8)"
                                : "rgba(200,29,36,0.15)",
                              border: addedIds.has(products[0].id)
                                ? "1px solid rgba(20,120,20,0.4)"
                                : "1px solid rgba(200,29,36,0.4)",
                              color: "#fff",
                            }}
                          >
                            {addedIds.has(products[0].id) ? (
                              <>
                                <ShoppingCart className="h-3.5 w-3.5" /> Added!
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                              </>
                            )}
                          </button>

                          <Link
                            to="/cases/$caseId"
                            params={{ caseId: products[0].caseNumber.replace("CASE ", "") }}
                            className="group/btn flex items-center justify-center gap-2 rounded-[3px] border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] py-2.5 px-3.5 font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-white transition-all duration-300"
                          >
                            <span>View Case</span>
                            <ArrowRight className="h-3.5 w-3.5 transform -translate-x-1 opacity-0 transition-all duration-300 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 group-hover:translate-x-0 group-hover:opacity-100" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Stack of smaller cards */}
                <div className="w-full lg:w-[58%] xl:w-[62%] flex flex-col gap-3 lg:gap-4">
                  {/* Scroll Up Indicator */}
                  <div className="flex justify-center my-1 opacity-60">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-[#090909] text-[#C81D24] shadow-md">
                      <ChevronUp className="h-4 w-4" />
                    </div>
                  </div>

                  {products.slice(1).map((p, idx) => {
                    const heights = ["230px", "265px", "240px", "255px", "245px"];
                    const cardHeight = heights[idx % heights.length];
                    const delay = idx * 0.1;

                    return (
                      <ScrollReveal key={p.id} delay={delay}>
                        <div
                          className="group relative flex flex-col md:flex-row overflow-hidden border border-white/5 bg-[#090909] rounded-[4px] transition-all duration-500 hover:-translate-y-1 hover:border-[#C81D24]/30"
                          style={{
                            height: `min-content`,
                            minHeight: cardHeight,
                            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                          }}
                        >
                          {/* Left half: Image & overlay title */}
                          <div className="relative w-full md:w-[48%] overflow-hidden h-[135px] md:h-auto min-h-[135px]">
                            <img
                              src={p.image}
                              alt={p.title}
                              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            />
                            {/* Image overlay gradients */}
                            <div
                              className="absolute inset-0"
                              style={{
                                background:
                                  "linear-gradient(to top, rgba(9,9,9,0.95) 0%, rgba(9,9,9,0.4) 40%, transparent 80%)",
                              }}
                            />

                            {/* Badge stamp */}
                            <span
                              className="absolute left-3 top-3 rounded-[2px] px-2 py-0.5 font-mono text-[8px] font-bold tracking-[0.15em] uppercase border"
                              style={{
                                background:
                                  p.badge === "BESTSELLER"
                                    ? "rgba(122,15,19,0.9)"
                                    : p.badge === "NEW"
                                      ? "rgba(20,120,20,0.85)"
                                      : "rgba(180,140,40,0.85)",
                                borderColor: "rgba(255,255,255,0.1)",
                                color: "#fff",
                                backdropFilter: "blur(8px)",
                              }}
                            >
                              {p.badge}
                            </span>

                            {/* quick view button */}
                            <button
                              onClick={() => setQuickView(p)}
                              className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-[3px] opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer"
                              style={{
                                background: "rgba(0,0,0,0.6)",
                                backdropFilter: "blur(8px)",
                                border: "1px solid rgba(255,255,255,0.1)",
                              }}
                            >
                              <Eye className="h-3 w-3 text-white" />
                            </button>

                            {/* SUPERIMPOSED TITLE AT THE BOTTOM OF THE IMAGE */}
                            <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                              <span className="font-mono text-[9px] tracking-[0.2em] text-[#555] font-semibold block">
                                {p.caseNumber}
                              </span>
                              <h3 className="mt-0.5 font-display text-[22px] tracking-[0.05em] uppercase text-white leading-tight transition-transform duration-500 group-hover:translate-x-1">
                                {p.title}
                              </h3>
                            </div>
                          </div>

                          {/* Right half: Text details */}
                          <div className="w-full md:w-[52%] flex flex-col justify-between p-3 lg:p-4 border-t md:border-t-0 md:border-l border-white/5 bg-[#0b0b0b]">
                            <div>
                              {/* Case Name at top of description panel */}
                              <div className="mb-2 border-b border-white/5 pb-1.5">
                                <span className="font-mono text-[9.5px] tracking-[0.2em] text-[#C81D24] font-semibold block">
                                  {p.caseNumber}
                                </span>
                                <h4 className="font-display text-[22px] tracking-[0.05em] uppercase text-white leading-tight transition-transform duration-500 group-hover:translate-x-1">
                                  {p.title}
                                </h4>
                              </div>

                              <p className="text-[15px] leading-relaxed text-[#777] font-sans">
                                {p.description}
                              </p>

                              <div className="mt-3 flex flex-wrap gap-1.5 items-center text-[9.5px] font-mono text-[#555]">
                                <span className="border border-white/5 bg-white/[0.01] px-2 py-0.5 uppercase tracking-wider">
                                  DIFFICULTY: {p.difficulty}
                                </span>
                                <span className="border border-white/5 bg-white/[0.01] px-2 py-0.5 uppercase tracking-wider">
                                  TIME: {p.duration}
                                </span>
                              </div>
                            </div>

                            <div className="mt-3">
                              {/* Price & Rating */}
                              <div className="flex items-center justify-between border-t border-white/5 pt-2">
                                <span className="font-display text-[16px] font-bold text-[#C81D24]">
                                  {fmt(p.price)}
                                </span>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, si) => (
                                    <Star
                                      key={si}
                                      className="h-2.5 w-2.5"
                                      style={{
                                        fill: si < p.stars ? "#C81D24" : "transparent",
                                        color: si < p.stars ? "#C81D24" : "#222",
                                      }}
                                    />
                                  ))}
                                  <span className="ml-1 font-mono text-[8px] text-[#444] font-semibold">
                                    ({p.reviews})
                                  </span>
                                </div>
                              </div>

                              {/* Buttons */}
                              <div className="mt-3 flex gap-2">
                                <button
                                  onClick={() => addToCart(p)}
                                  className="flex-1 flex items-center justify-center gap-1.5 rounded-[3px] py-2 font-mono text-[9px] font-semibold tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer"
                                  style={{
                                    background: addedIds.has(p.id)
                                      ? "rgba(20,120,20,0.8)"
                                      : "rgba(255,255,255,0.02)",
                                    border: addedIds.has(p.id)
                                      ? "1px solid rgba(20,120,20,0.4)"
                                      : "1px solid rgba(255,255,255,0.08)",
                                    color: addedIds.has(p.id) ? "#fff" : "#bbb",
                                  }}
                                >
                                  {addedIds.has(p.id) ? (
                                    <>
                                      <ShoppingCart className="h-3 w-3" /> Added!
                                    </>
                                  ) : (
                                    <>
                                      <ShoppingCart className="h-3 w-3" /> Add to Cart
                                    </>
                                  )}
                                </button>

                                <Link
                                  to="/cases/$caseId"
                                  params={{ caseId: p.caseNumber.replace("CASE ", "") }}
                                  className="group/btn flex items-center justify-center gap-1.5 rounded-[3px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] py-2 px-3 font-mono text-[9px] font-semibold tracking-[0.15em] uppercase text-[#C81D24] hover:text-white transition-all duration-300"
                                >
                                  <span>Investigate</span>
                                  <ArrowRight className="h-3 w-3 transform -translate-x-1 opacity-0 transition-all duration-300 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 group-hover:translate-x-0 group-hover:opacity-100" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </ScrollReveal>
                    );
                  })}

                  {/* Scroll Down Indicator */}
                  <div className="flex justify-center my-1 opacity-60">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-[#090909] text-[#C81D24] shadow-md">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* ═══════ FLOATING CART BUTTON ═══════ */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed z-[100] flex items-center justify-center rounded-full transition-all duration-500"
        style={{
          bottom: 32,
          right: 32,
          width: 56,
          height: 56,
          background: "linear-gradient(135deg, #7A0F13 0%, #A11418 100%)",
          border: "1px solid rgba(200,29,36,0.4)",
          boxShadow: "0 0 30px rgba(122,15,19,0.4), 0 8px 24px rgba(0,0,0,0.5)",
          color: "#fff",
        }}
      >
        <ShoppingCart className="h-5 w-5" />
        {cart.length > 0 && (
          <span
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full font-mono text-[9px] font-bold"
            style={{
              background: "#C81D24",
              color: "#fff",
              boxShadow: "0 0 10px rgba(200,29,36,0.6)",
              animation: "badge-pulse 2s ease-in-out infinite",
            }}
          >
            {cart.reduce((s, c) => s + c.qty, 0)}
          </span>
        )}
      </button>

      {/* ═══════ CART DRAWER OVERLAY ═══════ */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-[150]"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* ═══════ CART SLIDE-OUT DRAWER ═══════ */}
      <div
        className="fixed top-0 right-0 z-[160] flex h-full flex-col transition-transform duration-500 ease-out"
        style={{
          width: "min(380px, 100vw)",
          transform: cartOpen ? "translateX(0)" : "translateX(100%)",
          background: "rgba(6,6,6,0.97)",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(30px)",
          boxShadow: cartOpen ? "-20px 0 60px rgba(0,0,0,0.6)" : "none",
        }}
      >
        {/* drawer header */}
        <div
          className="flex items-center justify-between border-b px-6 py-5"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-4 w-4" style={{ color: "#C81D24" }} />
            <span
              className="font-display text-[14px] tracking-[0.15em] uppercase"
              style={{ color: "#fff" }}
            >
              Your Cart
            </span>
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full font-mono text-[9px]"
              style={{ background: "rgba(200,29,36,0.2)", color: "#C81D24" }}
            >
              {cart.length}
            </span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300"
            style={{ background: "rgba(255,255,255,0.05)", color: "#888" }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* drawer items */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#333 transparent" }}
        >
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20">
              <ShoppingCart className="h-10 w-10" style={{ color: "#222" }} />
              <p className="mt-4 font-mono text-[11px] tracking-[0.1em]" style={{ color: "#555" }}>
                Your evidence locker is empty
              </p>
              <button
                onClick={() => setCartOpen(false)}
                className="mt-5 rounded-lg border px-5 py-2 font-mono text-[10px] tracking-[0.1em] uppercase transition-colors duration-300"
                style={{ borderColor: "rgba(255,255,255,0.08)", color: "#888" }}
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 border-b px-6 py-5"
                style={{ borderColor: "rgba(255,255,255,0.04)" }}
              >
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="h-16 w-16 shrink-0 rounded-xl object-cover"
                  style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate font-display text-[11px] tracking-[0.05em] uppercase"
                    style={{ color: "#ddd" }}
                  >
                    {item.product.caseNumber}
                  </p>
                  <p
                    className="truncate text-[12px]"
                    style={{ color: "#999", fontFamily: "Inter" }}
                  >
                    {item.product.title}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.product.id, -1)}
                      className="flex h-6 w-6 items-center justify-center rounded-lg border transition-colors duration-300 hover:border-[rgba(200,29,36,0.3)]"
                      style={{ borderColor: "rgba(255,255,255,0.08)", color: "#888" }}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span
                      className="w-6 text-center font-mono text-[11px]"
                      style={{ color: "#ddd" }}
                    >
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.product.id, 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-lg border transition-colors duration-300 hover:border-[rgba(200,29,36,0.3)]"
                      style={{ borderColor: "rgba(255,255,255,0.08)", color: "#888" }}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-300 hover:bg-[rgba(200,29,36,0.1)]"
                    style={{ color: "#555" }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <span className="font-display text-[14px] font-bold" style={{ color: "#C81D24" }}>
                    {fmt(item.product.price * item.qty)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* drawer footer with totals */}
        {cart.length > 0 && (
          <div
            className="border-t px-6 py-5"
            style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(9,9,9,0.95)" }}
          >
            <div className="flex flex-col gap-2">
              {[
                { label: "Subtotal", value: fmt(subtotal) },
                { label: "Shipping", value: "FREE", accent: true },
                { label: "Taxes (GST 18%)", value: fmt(taxes) },
              ].map(({ label, value, accent }) => (
                <div key={label} className="flex justify-between font-mono text-[10px]">
                  <span style={{ color: "#777" }}>{label}</span>
                  <span style={{ color: accent ? "#4ade80" : "#bbb" }}>{value}</span>
                </div>
              ))}
            </div>
            <div
              className="mt-3 flex justify-between border-t pt-3"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              <span
                className="font-mono text-[11px] tracking-[0.1em] uppercase"
                style={{ color: "#aaa" }}
              >
                Total
              </span>
              <span
                className="font-display text-[22px] font-bold"
                style={{ color: "#C81D24", fontFamily: "Space Grotesk, Inter, sans-serif" }}
              >
                {fmt(total)}
              </span>
            </div>

            <button
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-4 font-display text-[12px] tracking-[0.2em] uppercase transition-all duration-500"
              style={{
                background: "linear-gradient(135deg, #7A0F13 0%, #A11418 100%)",
                color: "#fff",
                border: "1px solid rgba(200,29,36,0.3)",
                boxShadow: "0 0 30px rgba(122,15,19,0.3), 0 8px 20px rgba(0,0,0,0.4)",
              }}
            >
              <Lock className="h-3.5 w-3.5" />
              Proceed to Checkout
            </button>

            <div className="mt-4 flex items-center justify-center gap-2">
              <Lock className="h-3 w-3" style={{ color: "#555" }} />
              <span className="text-[9px]" style={{ color: "#555", fontFamily: "Inter" }}>
                Secure Checkout · SSL Encrypted
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ═══════ QUICK VIEW MODAL ═══════ */}
      {quickView && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
          onClick={() => setQuickView(null)}
        >
          <div
            className="relative w-full max-w-[640px] max-h-[92vh] overflow-y-auto rounded-2xl border"
            style={{
              background: "#090909",
              borderColor: "rgba(255,255,255,0.08)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQuickView(null)}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "#999",
              }}
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex flex-col sm:flex-row">
              <div className="relative w-full overflow-hidden sm:w-1/2">
                <img
                  src={quickView.image}
                  alt={quickView.title}
                  className="h-52 w-full object-cover sm:h-full sm:absolute sm:inset-0"
                  style={{ minHeight: "clamp(180px, 40vw, 360px)" }}
                />
                <div
                  className="absolute inset-0 hidden sm:block"
                  style={{
                    background: "linear-gradient(90deg, transparent 60%, rgba(9,9,9,1) 100%)",
                  }}
                />
              </div>
              <div className="flex w-full flex-col justify-center px-6 py-8 sm:w-1/2 sm:px-8 sm:py-8">
                <span className="font-mono text-[9px] tracking-[0.2em]" style={{ color: "#555" }}>
                  {quickView.caseNumber}
                </span>
                <h2
                  className="mt-1 font-display text-[22px] tracking-[0.06em] uppercase"
                  style={{ color: "#fff" }}
                >
                  {quickView.title}
                </h2>
                <p
                  className="mt-3 text-[12px] leading-relaxed"
                  style={{ color: "#888", fontFamily: "Inter" }}
                >
                  {quickView.description}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span
                    className="flex items-center gap-1 rounded-md border px-2 py-1 font-mono text-[9px]"
                    style={{ borderColor: "rgba(255,255,255,0.08)", color: "#888" }}
                  >
                    <Clock className="h-3 w-3" /> {quickView.duration}
                  </span>
                  <span
                    className="rounded-md border px-2 py-1 font-mono text-[9px]"
                    style={{ borderColor: "rgba(255,255,255,0.08)", color: "#888" }}
                  >
                    {quickView.difficulty}
                  </span>
                  <span
                    className="rounded-md border px-2 py-1 font-mono text-[9px] uppercase"
                    style={{
                      borderColor: "rgba(255,255,255,0.08)",
                      color: quickView.type === "physical" ? "#C81D24" : "#4ade80",
                    }}
                  >
                    {quickView.type}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-1">
                  {[...Array(5)].map((_, si) => (
                    <Star
                      key={si}
                      className="h-3.5 w-3.5"
                      style={{
                        fill: si < quickView.stars ? "#C81D24" : "transparent",
                        color: si < quickView.stars ? "#C81D24" : "#444",
                      }}
                    />
                  ))}
                  <span className="ml-2 font-mono text-[10px]" style={{ color: "#777" }}>
                    ({quickView.reviews} reviews)
                  </span>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span
                    className="font-display text-[28px] font-bold"
                    style={{ color: "#C81D24", fontFamily: "Space Grotesk, Inter, sans-serif" }}
                  >
                    {fmt(quickView.price)}
                  </span>
                  {quickView.stock <= 10 && (
                    <span className="font-mono text-[9px]" style={{ color: "#C81D24" }}>
                      Only {quickView.stock} left
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    addToCart(quickView);
                    setQuickView(null);
                  }}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-display text-[11px] tracking-[0.15em] uppercase transition-all duration-500"
                  style={{
                    background: "linear-gradient(135deg, #7A0F13 0%, #A11418 100%)",
                    color: "#fff",
                    border: "1px solid rgba(200,29,36,0.3)",
                    boxShadow: "0 0 20px rgba(122,15,19,0.3)",
                  }}
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Add to Evidence Locker
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
