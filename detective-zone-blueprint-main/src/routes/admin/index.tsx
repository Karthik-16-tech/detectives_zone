import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  FolderOpen,
  ShoppingBag,
  Package,
  ShoppingCart,
  ArrowRight,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { api } from "@/lib/api";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Intelligence & CMS Overview"
      subtitle="Classified Telemetry & Content Controls"
    >
      {error && (
        <div className="mb-6 rounded-lg border border-blood/40 bg-blood/10 p-4 font-mono text-xs text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center font-mono text-xs uppercase tracking-widest text-white/40">
          Scanning Database Telemetry...
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Metrics Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Metric 1: Cases */}
            <div className="rounded-xl border border-white/[0.08] bg-[#070707] p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                  Case Files
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blood/15 text-blood border border-blood/30">
                  <FolderOpen className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-white">
                  {stats?.total_cases ?? 0}
                </span>
                <span className="font-mono text-[10px] text-emerald-400">
                  {stats?.published_cases ?? 0} Live
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px] font-mono text-white/40">
                <span>{stats?.draft_cases ?? 0} Drafts</span>
                <Link to="/admin/cases" className="text-blood hover:underline flex items-center gap-1">
                  Manage →
                </Link>
              </div>
            </div>

            {/* Metric 2: Store Products */}
            <div className="rounded-xl border border-white/[0.08] bg-[#070707] p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                  Store Products
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-white/80 border border-white/10">
                  <ShoppingBag className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-white">
                  {stats?.total_products ?? 0}
                </span>
                <span className="font-mono text-[10px] text-white/60">
                  {stats?.low_stock_products ?? 0} Low Stock
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px] font-mono text-white/40">
                <span>Inventory Active</span>
                <Link to="/admin/store" className="text-blood hover:underline flex items-center gap-1">
                  Store →
                </Link>
              </div>
            </div>

            {/* Metric 3: Case Kits */}
            <div className="rounded-xl border border-white/[0.08] bg-[#070707] p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                  Case Kits & Clues
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-white/80 border border-white/10">
                  <Package className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-white">
                  {stats?.total_kits ?? 0}
                </span>
                <span className="font-mono text-[10px] text-emerald-400">
                  Physical Kits
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px] font-mono text-white/40">
                <span>Signature Clues</span>
                <Link to="/admin/kits" className="text-blood hover:underline flex items-center gap-1">
                  Kits →
                </Link>
              </div>
            </div>

            {/* Metric 4: Orders */}
            <div className="rounded-xl border border-white/[0.08] bg-[#070707] p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                  Total Orders
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-white/80 border border-white/10">
                  <ShoppingCart className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-white">
                  {stats?.total_orders ?? 0}
                </span>
                <span className="font-mono text-[10px] text-emerald-400">
                  ${stats?.total_revenue?.toFixed(2) ?? "0.00"}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px] font-mono text-white/40">
                <span>{stats?.pending_orders ?? 0} Processing</span>
                <Link to="/admin/orders" className="text-blood hover:underline flex items-center gap-1">
                  Orders →
                </Link>
              </div>
            </div>
          </div>

          {/* Activity Logs & Quick Actions */}
          <div className="grid grid-cols-12 gap-8">
            {/* Recent Activity Audit Log */}
            <div className="col-span-12 lg:col-span-8 rounded-xl border border-white/[0.08] bg-[#070707] p-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <h3 className="font-display text-[15px] font-bold uppercase tracking-[0.16em] text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blood" />
                  <span>Recent Audit Activity</span>
                </h3>
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">
                  Live Terminal Log
                </span>
              </div>

              <div className="mt-4 divide-y divide-white/[0.05]">
                {stats?.recent_activity?.length === 0 ? (
                  <p className="py-6 text-center font-mono text-xs text-white/40">
                    No recent audit logs logged yet.
                  </p>
                ) : (
                  stats?.recent_activity?.map((act: any) => (
                    <div key={act.id} className="py-3 flex items-start justify-between gap-4 font-mono text-[11px]">
                      <div>
                        <span className="font-bold text-white/80 uppercase">
                          [{act.action}]
                        </span>{" "}
                        <span className="text-white/60">{act.details || `${act.target_model} #${act.target_id}`}</span>
                      </div>
                      <div className="shrink-0 text-[10px] text-white/35">
                        {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions & System Info */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="rounded-xl border border-white/[0.08] bg-[#070707] p-6">
                <h3 className="font-display text-[15px] font-bold uppercase tracking-[0.16em] text-white mb-4">
                  Quick CMS Actions
                </h3>
                <div className="space-y-2.5 font-mono text-[11px] uppercase tracking-wider">
                  <Link
                    to="/admin/cases"
                    className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-blood/40 hover:bg-blood/10 transition-all text-white/70 hover:text-white"
                  >
                    <span>Manage Case Cards</span>
                    <ArrowRight className="h-3.5 w-3.5 text-blood" />
                  </Link>
                  <Link
                    to="/admin/store"
                    className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-blood/40 hover:bg-blood/10 transition-all text-white/70 hover:text-white"
                  >
                    <span>Add / Edit Products</span>
                    <ArrowRight className="h-3.5 w-3.5 text-blood" />
                  </Link>
                  <Link
                    to="/admin/kits"
                    className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-blood/40 hover:bg-blood/10 transition-all text-white/70 hover:text-white"
                  >
                    <span>Manage Physical Kits</span>
                    <ArrowRight className="h-3.5 w-3.5 text-blood" />
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-blood/40 hover:bg-blood/10 transition-all text-white/70 hover:text-white"
                  >
                    <span>Global Site Settings</span>
                    <ArrowRight className="h-3.5 w-3.5 text-blood" />
                  </Link>
                </div>
              </div>

              {/* Security Clearance Badge */}
              <div className="rounded-xl border border-white/[0.08] bg-[#070707] p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                      Clearance: Level 5
                    </h4>
                    <p className="font-mono text-[10px] text-white/40 uppercase">
                      Direct Encrypted Terminal
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
