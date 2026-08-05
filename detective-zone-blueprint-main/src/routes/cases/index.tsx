import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  ShoppingCart,
  Bell,
  Star,
  Clock,
  Lock,
  Gift,
  AlertTriangle,
  Award,
  Shield,
  Package,
  Headset,
  ChevronDown,
  Check,
  FolderOpen,
  Eye,
  SearchCheck,
  Zap,
} from "lucide-react";

import caseVoicemail from "@/assets/case-voicemail.png";
import caseWitness from "@/assets/case-witness.png";
import caseLetter from "@/assets/case-letter.png";
import caseHeir from "@/assets/case-heir.png";
import caseExperiment from "@/assets/case-experiment.png";
import caseBetrayal from "@/assets/case-betrayal.png";

export const Route = createFileRoute("/cases/")({
  component: CasesDashboard,
});

const initialCases = [
  {
    id: "001",
    title: "The Last Voicemail",
    number: "CASE 001",
    status: "UNSOLVED", // UNSOLVED | COMPLETED | COMING SOON
    image: caseVoicemail,
    description: "A successful businessman found dead in his study. No forced entry. Just a voicemail and a lot of questions.",
    stars: 5,
    duration: "3–5 HOURS",
    difficulty: "HARD",
    rating: 5,
    dateAdded: 1690000000000,
  },
  {
    id: "002",
    title: "The Silent Witness",
    number: "CASE 002",
    status: "UNSOLVED",
    image: caseWitness,
    description: "A reclusive writer found dead in a locked room. A witness that never spoke... but saw everything.",
    stars: 4,
    duration: "3–6 HOURS",
    difficulty: "HARD",
    rating: 4,
    dateAdded: 1691000000000,
  },
  {
    id: "003",
    title: "Blood in the Letter",
    number: "CASE 003",
    status: "COMING SOON",
    image: caseLetter,
    description: "A threatening letter. A missing girl. A trail of blood. The shadows are speaking.",
    stars: 0,
    duration: "COMING SOON",
    difficulty: "MEDIUM",
    rating: 0,
    dateAdded: 1692000000000,
  },
  {
    id: "004",
    title: "The Vanished One",
    number: "CASE 004",
    status: "COMING SOON",
    image: caseHeir,
    description: "They were here one day, gone the next. A disappearance that made no noise at all.",
    stars: 0,
    duration: "COMING SOON",
    difficulty: "MEDIUM",
    rating: 0,
    dateAdded: 1693000000000,
  },
  {
    id: "005",
    title: "The Final Experiment",
    number: "CASE 005",
    status: "COMING SOON",
    image: caseExperiment,
    description: "A scientist's last experiment was never meant to be found. Now the cure is the disease.",
    stars: 0,
    duration: "COMING SOON",
    difficulty: "HARD",
    rating: 0,
    dateAdded: 1694000000000,
  },
  {
    id: "006",
    title: "Shadows of Betrayal",
    number: "CASE 006",
    status: "COMING SOON",
    image: caseBetrayal,
    description: "A man caught between loyalty and truth. One choice changed everything.",
    stars: 0,
    duration: "COMING SOON",
    difficulty: "HARD",
    rating: 0,
    dateAdded: 1695000000000,
  },
];

function CasesDashboard() {
  const [activeTab, setActiveTab] = useState<"ALL" | "UNSOLVED" | "COMPLETED" | "COMING SOON">("ALL");
  const [sortBy, setSortBy] = useState<"CASE #" | "NEWEST" | "DIFFICULTY">("CASE #");
  const [sortOpen, setSortOpen] = useState(false);

  const filteredCases = useMemo(() => {
    let result = [...initialCases];
    if (activeTab !== "ALL") {
      result = result.filter((c) => c.status === activeTab);
    }
    if (sortBy === "CASE #") {
      result.sort((a, b) => a.id.localeCompare(b.id));
    } else if (sortBy === "NEWEST") {
      result.sort((a, b) => b.dateAdded - a.dateAdded);
    } else if (sortBy === "DIFFICULTY") {
      // Sort HARD first
      result.sort((a, b) => (b.difficulty === "HARD" ? 1 : 0) - (a.difficulty === "HARD" ? 1 : 0));
    }
    return result;
  }, [activeTab, sortBy]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#C7C7C7] font-sans pt-[72px] relative overflow-hidden">
      {/* Subtle Noise / Grid Overlay */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-8 py-10">
        
        {/* PAGE HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#1A1A1A]/80 pb-7 mb-7 gap-4">
          <div>
            <h1 className="font-display text-[64px] font-bold text-white tracking-[2px] leading-none uppercase" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
              Case Files
            </h1>
            <p className="text-[12px] text-[#A0A0A0] font-mono tracking-[1.5px] uppercase mt-2">
              Choose your next investigation
            </p>
          </div>
          <div className="font-mono text-[10px] tracking-[2px] text-muted-foreground uppercase">
            <Link to="/" className="hover:text-white transition-colors duration-300">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#B31217]">Cases</span>
          </div>
        </header>

        {/* FILTER & SORT BAR */}
        <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-[#0B0B0B] border border-[#1A1A1A] rounded-lg px-6 h-auto sm:h-14 mb-8 gap-4 py-3 sm:py-0">
          <div className="flex flex-wrap gap-6">
            {(["ALL", "UNSOLVED", "COMPLETED", "COMING SOON"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`group relative py-2 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 cursor-pointer ${
                  (tab === "ALL" && activeTab === "ALL") || activeTab === tab
                    ? "text-[#B31217] font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "ALL" ? "All Cases" : tab.replace("_", " ")}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-blood transition-all duration-300 ${
                    activeTab === tab || (tab === "ALL" && activeTab === "ALL") ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="relative flex items-center gap-3 self-end sm:self-auto">
            <span className="font-mono text-[10px] tracking-[0.15em] text-[#555] uppercase">Sort By:</span>
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 bg-[#050505] border border-[#1A1A1A] rounded px-4 py-1.5 font-mono text-[11px] text-white hover:border-[#B31217]/50 transition-colors duration-300"
            >
              {sortBy === "CASE #" ? "CASE #" : sortBy === "NEWEST" ? "NEWEST" : "DIFFICULTY"}
              <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-300 ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1.5 z-20 w-40 bg-[#0B0B0B] border border-[#1A1A1A] rounded shadow-2xl py-1">
                {(["CASE #", "NEWEST", "DIFFICULTY"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSortBy(opt);
                      setSortOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 font-mono text-[10px] text-muted-foreground hover:text-white hover:bg-neutral-900 transition-colors duration-200"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 12-COLUMN MAIN CONTENT SPLIT */}
        <div className="grid grid-cols-12 gap-8 items-start">
          
          {/* LEFT: 72% Main grid */}
          <main className="col-span-12 lg:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCases.map((c) => (
                <Link
                  key={c.id}
                  to="/cases/$caseId"
                  params={{ caseId: c.id }}
                  className="group bg-[#0B0B0B] border border-[#1A1A1A] hover:border-[#B31217]/50 rounded-lg overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(179,18,23,0.12)]"
                  style={{ minHeight: 430, boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.02)" }}
                >
                  {/* Top Image */}
                  <div className="relative h-[210px] w-full overflow-hidden bg-neutral-900">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                    />
                    {/* Shadow overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent opacity-90" />
                    
                    {/* Status Badge */}
                    <span 
                      className={`absolute top-4 left-4 font-mono text-[8px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-sm shadow-md transition-all duration-300 ${
                        c.status === "UNSOLVED" 
                          ? "bg-[#B31217] text-white shadow-red-900/10 group-hover:shadow-[0_0_12px_#B31217]"
                          : "bg-neutral-800 text-muted-foreground"
                      }`}
                    >
                      {c.status === "UNSOLVED" ? "UNSOLVED" : "COMING SOON"}
                    </span>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-mono text-[10px] tracking-[0.16em] text-[#9A9A9A] uppercase mb-1">
                        {c.number}
                      </p>
                      <h3 className="font-display text-[26px] text-white tracking-[0.5px] leading-tight uppercase group-hover:text-[#B31217] transition-colors duration-300 mb-3" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                        {c.title}
                      </h3>
                      <p className="text-[13px] leading-relaxed text-[#B5B5B5] line-clamp-3">
                        {c.description}
                      </p>
                    </div>

                    {/* Metadata Row */}
                    <div className="border-t border-[#1A1A1A] pt-4 mt-5 flex items-center justify-between text-[11px] font-mono tracking-wider">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < c.stars 
                                ? "text-[#B31217] fill-[#B31217]" 
                                : "text-neutral-800"
                            }`}
                          />
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="uppercase text-[9px]">{c.duration}</span>
                      </div>

                      <span className="text-[#C21C22] font-semibold text-[9px] uppercase tracking-widest">{c.difficulty}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </main>

          {/* RIGHT: 28% Sidebar */}
          <aside className="col-span-12 lg:col-span-3 flex flex-col gap-6 lg:sticky lg:top-[96px]">
            
            {/* Sidebar Card 1: Statistics */}
            <section className="bg-[#0B0B0B] border border-[#1A1A1A] rounded-lg p-6 relative overflow-hidden" style={{ boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.02)" }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="h-4 w-1 bg-[#B31217]" />
                <h3 className="font-display text-[15px] font-bold text-white tracking-[1.5px] uppercase" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                  Case Statistics
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-950/60 border border-white/5 rounded flex flex-col items-center text-center">
                  <div className="h-8 w-8 rounded-full border border-white/5 bg-[#0B0B0B] flex items-center justify-center mb-3">
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="font-display text-[32px] font-bold text-white leading-none" style={{ fontFamily: "Bebas Neue, sans-serif" }}>06</span>
                  <span className="text-[9px] text-[#A0A0A0] tracking-widest uppercase mt-2">Total Cases</span>
                </div>
                <div className="p-4 bg-neutral-950/60 border border-white/5 rounded flex flex-col items-center text-center">
                  <div className="h-8 w-8 rounded-full border border-white/5 bg-[#0B0B0B] flex items-center justify-center mb-3">
                    <Eye className="h-4 w-4 text-[#B31217]" />
                  </div>
                  <span className="font-display text-[32px] font-bold text-white leading-none" style={{ fontFamily: "Bebas Neue, sans-serif" }}>03</span>
                  <span className="text-[9px] text-[#A0A0A0] tracking-widest uppercase mt-2">Unsolved</span>
                </div>
                <div className="p-4 bg-neutral-950/60 border border-white/5 rounded flex flex-col items-center text-center">
                  <div className="h-8 w-8 rounded-full border border-white/5 bg-[#0B0B0B] flex items-center justify-center mb-3">
                    <SearchCheck className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="font-display text-[32px] font-bold text-white leading-none" style={{ fontFamily: "Bebas Neue, sans-serif" }}>00</span>
                  <span className="text-[9px] text-[#A0A0A0] tracking-widest uppercase mt-2">Completed</span>
                </div>
                <div className="p-4 bg-neutral-950/60 border border-white/5 rounded flex flex-col items-center text-center">
                  <div className="h-8 w-8 rounded-full border border-white/5 bg-[#0B0B0B] flex items-center justify-center mb-3">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="font-display text-[32px] font-bold text-white leading-none" style={{ fontFamily: "Bebas Neue, sans-serif" }}>10K+</span>
                  <span className="text-[9px] text-[#A0A0A0] tracking-widest uppercase mt-2">Detectives</span>
                </div>
              </div>
            </section>

            {/* Sidebar Card 2: How it works */}
            <section className="bg-[#0B0B0B] border border-[#1A1A1A] rounded-lg p-6 relative overflow-hidden" style={{ boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.02)" }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="h-4 w-1 bg-[#B31217]" />
                <h3 className="font-display text-[15px] font-bold text-white tracking-[1.5px] uppercase" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                  How it works
                </h3>
              </div>
              <div className="flex flex-col gap-6 mb-6">
                {[
                  { step: "1", title: "Purchase a Case", desc: "Choose a case and get your evidence box delivered." },
                  { step: "2", title: "Examine Evidence", desc: "Analyze documents, photos, audio and other clues." },
                  { step: "3", title: "Connect the Dots", desc: "Use logic and deduction to uncover the truth." },
                  { step: "4", title: "Submit Your Report", desc: "Submit your conclusions and unlock the truth." }
                ].map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <div className="h-6 w-6 rounded-full bg-[#8E1418]/15 border border-[#8E1418]/50 flex items-center justify-center text-[#B31217] font-mono text-xs font-bold shrink-0 mt-0.5">
                      {s.step}
                    </div>
                    <div>
                      <h4 className="font-display text-[13px] font-semibold text-white tracking-wide uppercase leading-tight">{s.title}</h4>
                      <p className="text-[11px] text-[#888] mt-1.5 leading-normal">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full h-11 bg-[#8E1418] hover:bg-[#B31217] text-white font-mono text-[11px] tracking-[0.2em] uppercase rounded font-bold transition-all duration-300 hover:shadow-[0_0_15px_rgba(142,20,24,0.4)] cursor-pointer">
                Learn More
              </button>
            </section>
          </aside>

        </div>

        {/* BOTTOM FEATURE STRIP */}
        <footer className="border-t border-[#1A1A1A]/80 mt-16 pt-10 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 items-stretch text-left">
            <div className="flex flex-col justify-center">
              <span className="font-mono text-[#D32F2F] text-[20px] font-bold block mb-2">◈</span>
              <p className="text-[12px] italic text-[#A0A0A0] leading-relaxed">
                “In a world of lies, the <span className="text-[#B31217] font-semibold not-italic">truth</span> is your only weapon.”
              </p>
            </div>
            <div className="flex gap-4 items-center p-4 bg-[#0B0B0B] rounded border border-[#1A1A1A]" style={{ boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.02)" }}>
              <Shield className="h-6 w-6 text-white shrink-0" />
              <div>
                <h4 className="font-mono text-[10px] text-white tracking-[1.5px] uppercase font-bold leading-tight">Secure Payment</h4>
                <p className="text-[9px] text-[#A0A0A0] uppercase tracking-wider mt-1">SSL Encrypted</p>
              </div>
            </div>
            <div className="flex gap-4 items-center p-4 bg-[#0B0B0B] rounded border border-[#1A1A1A]" style={{ boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.02)" }}>
              <Package className="h-6 w-6 text-white shrink-0" />
              <div>
                <h4 className="font-mono text-[10px] text-white tracking-[1.5px] uppercase font-bold leading-tight">Evidence Delivery</h4>
                <p className="text-[9px] text-[#A0A0A0] uppercase tracking-wider mt-1">Pan India Delivery</p>
              </div>
            </div>
            <div className="flex gap-4 items-center p-4 bg-[#0B0B0B] rounded border border-[#1A1A1A]" style={{ boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.02)" }}>
              <Headset className="h-6 w-6 text-white shrink-0" />
              <div>
                <h4 className="font-mono text-[10px] text-white tracking-[1.5px] uppercase font-bold leading-tight">24/7 Support</h4>
                <p className="text-[9px] text-[#A0A0A0] uppercase tracking-wider mt-1">We are here to help</p>
              </div>
            </div>
            <div className="flex gap-4 items-center p-4 bg-[#0B0B0B] rounded border border-[#1A1A1A]" style={{ boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.02)" }}>
              <Award className="h-6 w-6 text-white shrink-0" />
              <div>
                <h4 className="font-mono text-[10px] text-white tracking-[1.5px] uppercase font-bold leading-tight">Premium Quality</h4>
                <p className="text-[9px] text-[#A0A0A0] uppercase tracking-wider mt-1">Best Experience Guaranteed</p>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
