import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  ShoppingCart,
  Bell,
  Star,
  Lock,
  Award,
  Shield,
  Package,
  ChevronDown,
  Heart,
  Eye,
  X,
  Truck,
  Fingerprint,
  MapPin,
  Clock,
  Sparkles,
  FileText,
  Plus,
  Minus,
  ArrowRight,
  Play,
  User,
} from "lucide-react";

import caseVoicemail from "@/assets/case-voicemail.png";
import caseWitness from "@/assets/case-witness.png";
import caseLetter from "@/assets/case-letter.png";
import caseBetrayal from "@/assets/case-betrayal.png";
import evidenceRoom from "@/assets/evidence-room.jpg";

export const Route = createFileRoute("/store")({
  component: StorePage,
});

/* ─── data ─── */
const categories = [
  { id: "all", label: "All Evidence", icon: FileText },
  { id: "premium", label: "Premium Case Kits", icon: Award },
  { id: "digital", label: "Digital Investigations", icon: Eye },
  { id: "limited", label: "Limited Editions", icon: Sparkles },
  { id: "tools", label: "Detective Tools", icon: Search },
  { id: "collectibles", label: "Collectibles", icon: Shield },
];

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
      "A successful businessman found dead in his study. No forced entry. Just a voicemail… and a lot of questions.",
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
      "A reclusive writer found dead in a locked room. A witness that never spoke… but saw everything.",
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
      "A threatening letter. A missing girl. A trail of blood. The shadows are speaking.",
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
      "A man caught between loyalty and truth. One choice changed everything. Trust no one.",
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
];

interface CartItem {
  product: Product;
  qty: number;
}

/* ─── helper ─── */
const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

/* ─── component ─── */
function StorePage() {
  const [activeCat, setActiveCat] = useState("all");
  const [cart, setCart] = useState<CartItem[]>(() => [
    { product: products[0], qty: 1 },
    { product: products[1], qty: 1 },
  ]);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [cartOpen, setCartOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroParallax, setHeroParallax] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) {
        const r = heroRef.current.getBoundingClientRect();
        setHeroParallax(Math.max(0, -r.top * 0.25));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const addToCart = (p: Product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === p.id);
      if (existing)
        return prev.map((c) =>
          c.product.id === p.id ? { ...c, qty: c.qty + 1 } : c,
        );
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

  const removeFromCart = (id: string) =>
    setCart((prev) => prev.filter((c) => c.product.id !== id));

  const updateQty = (id: string, delta: number) =>
    setCart((prev) =>
      prev
        .map((c) =>
          c.product.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c,
        )
        .filter((c) => c.qty > 0),
    );

  const subtotal = cart.reduce(
    (sum, c) => sum + c.product.price * c.qty,
    0,
  );
  const shipping = 0;
  const taxes = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + taxes;

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
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
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
        className="relative z-10 mx-auto flex gap-6"
        style={{ maxWidth: 1400, padding: "32px 32px 0" }}
      >
        {/* ┌──────── LEFT SIDEBAR ────────┐ */}
        <aside
          className="shrink-0"
          style={{ width: 260, position: "sticky", top: 104, alignSelf: "flex-start" }}
        >
          {/* sidebar title */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: "#7A0F13" }} />
            <span
              className="font-display text-[11px] tracking-[0.3em] uppercase"
              style={{ color: "#A8A8A8" }}
            >
              Store
            </span>
          </div>

          {/* category nav */}
          <nav className="flex flex-col gap-1.5">
            {categories.map((c) => {
              const active = activeCat === c.id;
              const Icon = c.icon;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(c.id)}
                  className="group flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-300"
                  style={{
                    background: active
                      ? "linear-gradient(135deg, #7A0F13 0%, #5a0b0f 100%)"
                      : "transparent",
                    color: active ? "#fff" : "#A8A8A8",
                    border: active
                      ? "1px solid rgba(200,29,36,0.3)"
                      : "1px solid transparent",
                    boxShadow: active
                      ? "0 0 20px rgba(122,15,19,0.25), inset 0 0 15px rgba(200,29,36,0.1)"
                      : "none",
                  }}
                >
                  {active && (
                    <div
                      className="absolute left-0 h-6 w-[3px] rounded-r"
                      style={{
                        background: "#C81D24",
                        boxShadow: "0 0 8px rgba(200,29,36,0.6)",
                      }}
                    />
                  )}
                  <Icon
                    className="h-4 w-4 transition-colors duration-300"
                    style={{
                      color: active ? "#fff" : "#666",
                    }}
                  />
                  <span
                    className="font-mono text-[11px] tracking-[0.12em] uppercase transition-colors duration-300"
                    style={{ color: active ? "#fff" : undefined }}
                  >
                    {c.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* detective quote card */}
          <div
            className="mt-6 overflow-hidden rounded-2xl border"
            style={{
              background:
                "linear-gradient(180deg, rgba(9,9,9,0.95) 0%, rgba(5,5,5,1) 100%)",
              borderColor: "rgba(255,255,255,0.06)",
            }}
          >
            {/* silhouette */}
            <div
              className="relative flex items-end justify-center overflow-hidden"
              style={{ height: 160 }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 80%, rgba(122,15,19,0.15) 0%, transparent 70%)",
                }}
              />
              <div
                className="relative"
                style={{
                  width: 80,
                  height: 130,
                  background:
                    "linear-gradient(to bottom, rgba(20,20,20,0.9), rgba(10,10,10,1))",
                  borderRadius: "50% 50% 0 0",
                  boxShadow: "0 0 40px rgba(0,0,0,0.8)",
                }}
              >
                <User
                  className="absolute left-1/2 top-6 -translate-x-1/2"
                  style={{ width: 36, height: 36, color: "#333" }}
                />
              </div>
            </div>
            <div className="px-5 pb-5 pt-3 text-center">
              <p
                className="text-[12px] italic leading-relaxed"
                style={{ color: "#888", fontFamily: "Inter, sans-serif" }}
              >
                "The truth rewards those who notice what others ignore."
              </p>
              <span
                className="mt-2 inline-block font-display text-[9px] tracking-[0.25em] uppercase"
                style={{ color: "#7A0F13" }}
              >
                — Detective Zone
              </span>
            </div>
          </div>

          {/* premium benefits */}
          <div className="mt-5 flex flex-col gap-3">
            {[
              { icon: Truck, label: "Free Shipping", sub: "On all physical orders" },
              {
                icon: Lock,
                label: "Secure Payments",
                sub: "100% Safe & Encrypted",
              },
              {
                icon: Shield,
                label: "Made for Detectives",
                sub: "By Mystery Lovers",
              },
            ].map(({ icon: Ic, label, sub }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border px-4 py-3"
                style={{
                  background: "rgba(9,9,9,0.8)",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <Ic className="h-4 w-4 shrink-0" style={{ color: "#7A0F13" }} />
                <div>
                  <p
                    className="font-mono text-[10px] font-semibold tracking-[0.1em] uppercase"
                    style={{ color: "#ddd" }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-[9px]"
                    style={{ color: "#666", fontFamily: "Inter" }}
                  >
                    {sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ┌──────── CENTER CONTENT ────────┐ */}
        <main className="min-w-0 flex-1">
          {/* ──── HERO BANNER ──── */}
          <section
            ref={heroRef}
            className="fade-up relative overflow-hidden rounded-2xl border"
            style={{
              height: 420,
              borderColor: "rgba(255,255,255,0.06)",
              background:
                "linear-gradient(135deg, rgba(9,9,9,1) 0%, rgba(4,4,4,1) 100%)",
            }}
          >
            {/* bg image */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${evidenceRoom})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: `translateY(${heroParallax}px)`,
                opacity: 0.35,
                filter: "brightness(0.5) contrast(1.2)",
              }}
            />
            {/* gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(4,4,4,0.95) 0%, rgba(4,4,4,0.7) 50%, rgba(4,4,4,0.3) 100%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(4,4,4,1) 0%, transparent 40%)",
              }}
            />

            {/* hero content */}
            <div className="relative z-10 flex h-full flex-col justify-center px-12">
              <h1
                className="font-display leading-[0.95]"
                style={{ fontSize: 72, letterSpacing: "-0.02em" }}
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
              <div className="mt-7 flex items-center gap-4">
                <button
                  className="group relative flex items-center gap-2 rounded-lg border px-7 py-3.5 font-display text-[12px] tracking-[0.2em] uppercase transition-all duration-500"
                  style={{
                    background:
                      "linear-gradient(135deg, #7A0F13 0%, #A11418 100%)",
                    borderColor: "rgba(200,29,36,0.4)",
                    color: "#fff",
                    boxShadow: "0 0 30px rgba(122,15,19,0.3)",
                  }}
                >
                  Explore Cases
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <button
                  className="group flex items-center gap-2 rounded-lg border px-6 py-3.5 font-mono text-[11px] tracking-[0.15em] uppercase transition-all duration-500"
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

          {/* ──── FEATURED INVESTIGATIONS ──── */}
          <section className="mt-10">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="h-[2px] w-8"
                  style={{ background: "#7A0F13" }}
                />
                <h2
                  className="font-display text-[18px] tracking-[0.25em] uppercase"
                  style={{ color: "#fff" }}
                >
                  Featured Case Kits
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

            <div className="grid grid-cols-4 gap-5">
              {products.map((p, i) => (
                <div
                  key={p.id}
                  className={`fade-up fade-up-d${i + 1} group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-500`}
                  style={{
                    background: "#090909",
                    borderColor: "rgba(255,255,255,0.06)",
                    minHeight: 460,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = "translateY(-6px)";
                    el.style.borderColor = "rgba(200,29,36,0.3)";
                    el.style.boxShadow =
                      "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(122,15,19,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = "translateY(0)";
                    el.style.borderColor = "rgba(255,255,255,0.06)";
                    el.style.boxShadow = "none";
                  }}
                >
                  {/* image */}
                  <div className="relative overflow-hidden" style={{ height: 200 }}>
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(9,9,9,1) 0%, transparent 50%)",
                      }}
                    />
                    {/* badge */}
                    <span
                      className="absolute left-3 top-3 rounded-md px-2.5 py-1 font-mono text-[9px] font-bold tracking-[0.15em] uppercase"
                      style={{
                        background:
                          p.badge === "BESTSELLER"
                            ? "rgba(122,15,19,0.9)"
                            : p.badge === "NEW"
                              ? "rgba(20,120,20,0.85)"
                              : "rgba(180,140,40,0.85)",
                        color: "#fff",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      {p.badge}
                    </span>
                    {/* quick view */}
                    <button
                      onClick={() => setQuickView(p)}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg opacity-0 transition-all duration-300 group-hover:opacity-100"
                      style={{
                        background: "rgba(0,0,0,0.6)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <Eye className="h-3.5 w-3.5 text-white" />
                    </button>
                  </div>

                  {/* card body */}
                  <div className="flex flex-1 flex-col px-5 pb-5 pt-3">
                    <span
                      className="font-mono text-[9px] tracking-[0.2em]"
                      style={{ color: "#555" }}
                    >
                      {p.caseNumber}
                    </span>
                    <h3
                      className="mt-1 font-display text-[16px] tracking-[0.06em] uppercase"
                      style={{ color: "#fff" }}
                    >
                      {p.title}
                    </h3>
                    <p
                      className="mt-2 flex-1 text-[11px] leading-relaxed"
                      style={{
                        color: "#777",
                        fontFamily: "Inter, sans-serif",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {p.description}
                    </p>

                    {/* price & stars */}
                    <div className="mt-4 flex items-center justify-between">
                      <span
                        className="font-display text-[22px] font-bold"
                        style={{ color: "#C81D24", fontFamily: "Space Grotesk, Inter, sans-serif" }}
                      >
                        {fmt(p.price)}
                      </span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, si) => (
                          <Star
                            key={si}
                            className="h-3 w-3"
                            style={{
                              fill: si < p.stars ? "#C81D24" : "transparent",
                              color: si < p.stars ? "#C81D24" : "#444",
                            }}
                          />
                        ))}
                        <span
                          className="ml-1 font-mono text-[9px]"
                          style={{ color: "#666" }}
                        >
                          ({p.reviews})
                        </span>
                      </div>
                    </div>

                    {/* add to cart */}
                    <button
                      onClick={() => addToCart(p)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-mono text-[10px] font-semibold tracking-[0.15em] uppercase transition-all duration-500"
                      style={{
                        background: addedIds.has(p.id)
                          ? "rgba(20,120,20,0.8)"
                          : "rgba(255,255,255,0.04)",
                        border: addedIds.has(p.id)
                          ? "1px solid rgba(20,120,20,0.4)"
                          : "1px solid rgba(255,255,255,0.08)",
                        color: addedIds.has(p.id) ? "#fff" : "#bbb",
                      }}
                    >
                      {addedIds.has(p.id) ? (
                        <>
                          <ShoppingCart className="h-3.5 w-3.5" /> Added!
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ──── PREMIUM FEATURE STRIP ──── */}
          <section className="mt-10 grid grid-cols-4 gap-4 pb-10">
            {[
              {
                icon: Shield,
                title: "Real Evidence",
                sub: "Physical & Digital Clues",
              },
              {
                icon: Search,
                title: "Immersive Experience",
                sub: "Solve. Think. Discover.",
              },
              {
                icon: Award,
                title: "For Detectives",
                sub: "Every Case is Unique",
              },
              {
                icon: MapPin,
                title: "Made in India",
                sub: "Built for Mystery Lovers",
              },
            ].map(({ icon: Ic, title, sub }) => (
              <div
                key={title}
                className="group flex items-center gap-4 rounded-2xl border px-5 py-5 transition-all duration-500"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  borderColor: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(20px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    "rgba(200,29,36,0.2)";
                  e.currentTarget.style.boxShadow =
                    "0 0 20px rgba(122,15,19,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    "rgba(255,255,255,0.06)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                  style={{
                    background: "rgba(122,15,19,0.1)",
                    borderColor: "rgba(200,29,36,0.2)",
                  }}
                >
                  <Ic className="h-4.5 w-4.5" style={{ color: "#C81D24" }} />
                </div>
                <div>
                  <p
                    className="font-display text-[12px] tracking-[0.1em] uppercase"
                    style={{ color: "#ddd" }}
                  >
                    {title}
                  </p>
                  <p
                    className="mt-0.5 text-[10px]"
                    style={{ color: "#666", fontFamily: "Inter" }}
                  >
                    {sub}
                  </p>
                </div>
              </div>
            ))}
          </section>

          {/* ──── PREMIUM FEATURE STRIP END ──── */}
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
          width: 380,
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
            <span className="font-display text-[14px] tracking-[0.15em] uppercase" style={{ color: "#fff" }}>
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
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#333 transparent" }}>
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
                  <p className="truncate font-display text-[11px] tracking-[0.05em] uppercase" style={{ color: "#ddd" }}>
                    {item.product.caseNumber}
                  </p>
                  <p className="truncate text-[12px]" style={{ color: "#999", fontFamily: "Inter" }}>
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
                    <span className="w-6 text-center font-mono text-[11px]" style={{ color: "#ddd" }}>
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
              <span className="font-mono text-[11px] tracking-[0.1em] uppercase" style={{ color: "#aaa" }}>
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
            className="relative w-full max-w-[640px] overflow-hidden rounded-2xl border"
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
            <div className="flex">
              <div className="relative w-1/2 overflow-hidden">
                <img
                  src={quickView.image}
                  alt={quickView.title}
                  className="h-full w-full object-cover"
                  style={{ minHeight: 360 }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 60%, rgba(9,9,9,1) 100%)",
                  }}
                />
              </div>
              <div className="flex w-1/2 flex-col justify-center px-8 py-8">
                <span
                  className="font-mono text-[9px] tracking-[0.2em]"
                  style={{ color: "#555" }}
                >
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
                  <span className="flex items-center gap-1 rounded-md border px-2 py-1 font-mono text-[9px]" style={{ borderColor: "rgba(255,255,255,0.08)", color: "#888" }}>
                    <Clock className="h-3 w-3" /> {quickView.duration}
                  </span>
                  <span className="rounded-md border px-2 py-1 font-mono text-[9px]" style={{ borderColor: "rgba(255,255,255,0.08)", color: "#888" }}>
                    {quickView.difficulty}
                  </span>
                  <span className="rounded-md border px-2 py-1 font-mono text-[9px] uppercase" style={{ borderColor: "rgba(255,255,255,0.08)", color: quickView.type === "physical" ? "#C81D24" : "#4ade80" }}>
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
                    background:
                      "linear-gradient(135deg, #7A0F13 0%, #A11418 100%)",
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
