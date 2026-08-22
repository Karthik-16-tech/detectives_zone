import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Package, ArrowRight, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/orders/")({
  component: OrdersLookupPage,
});

function OrdersLookupPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const navigate = useNavigate();

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    const formatted = orderNumber.trim().replace("#", "");
    navigate({ to: `/orders/${formatted}` });
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4">
      <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-[#080808] p-8 sm:p-10 shadow-2xl text-center space-y-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blood/20 text-blood border border-blood/40">
          <Package className="h-7 w-7" />
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-blood font-bold">
            Evidence Dispatch Tracking
          </span>
          <h1 className="mt-1 font-display text-2xl uppercase font-bold text-white tracking-wider">
            Track Your Case Order
          </h1>
          <p className="mt-2 font-mono text-xs text-white/50">
            Enter your order reference code (e.g. <span className="text-white">ORD-2026-XXXXX</span>) to check fulfillment timeline and estimated delivery.
          </p>
        </div>

        <form onSubmit={handleLookup} className="space-y-4 font-mono text-xs">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter Order # or Reference ID"
              className="w-full rounded-xl border border-white/15 bg-black/80 py-3.5 pl-10 pr-4 text-white outline-none focus:border-blood uppercase"
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blood py-3.5 font-display text-xs uppercase tracking-widest text-white hover:bg-blood/90 transition-all shadow-[0_0_20px_rgba(179,18,23,0.35)] cursor-pointer"
          >
            <span>Track Order</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
