import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ot as Clock, Ut as ArrowRight, dt as FolderOpen, v as ShoppingCart, x as ShieldCheck, y as ShoppingBag, z as Package } from "../_libs/lucide-react.mjs";
import { c as api } from "./router-CBHk_fdB.mjs";
import { t as AdminLayout } from "./AdminLayout-BazMIgX5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-BdwXYT6q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminDashboard() {
	const [stats, setStats] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		loadStats();
	}, []);
	const loadStats = async () => {
		try {
			setLoading(true);
			const data = await api.getDashboardStats();
			setStats(data);
		} catch (err) {
			setError(err.message || "Failed to load dashboard metrics");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, {
		title: "Intelligence & CMS Overview",
		subtitle: "Classified Telemetry & Content Controls",
		children: [error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 rounded-lg border border-blood/40 bg-blood/10 p-4 font-mono text-xs text-red-300",
			children: error
		}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "py-20 text-center font-mono text-xs uppercase tracking-widest text-white/40",
			children: "Scanning Database Telemetry..."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/[0.08] bg-[#070707] p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[10px] uppercase tracking-[0.2em] text-white/50",
									children: "Case Files"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-8 w-8 items-center justify-center rounded-lg bg-blood/15 text-blood border border-blood/30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex items-baseline gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-3xl font-bold text-white",
									children: stats?.total_cases ?? 0
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-[10px] text-emerald-400",
									children: [stats?.published_cases ?? 0, " Live"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px] font-mono text-white/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [stats?.draft_cases ?? 0, " Drafts"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admin/cases",
									className: "text-blood hover:underline flex items-center gap-1",
									children: "Manage →"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/[0.08] bg-[#070707] p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[10px] uppercase tracking-[0.2em] text-white/50",
									children: "Store Products"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-white/80 border border-white/10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex items-baseline gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-3xl font-bold text-white",
									children: stats?.total_products ?? 0
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-[10px] text-white/60",
									children: [stats?.low_stock_products ?? 0, " Low Stock"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px] font-mono text-white/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Inventory Active" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admin/store",
									className: "text-blood hover:underline flex items-center gap-1",
									children: "Store →"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/[0.08] bg-[#070707] p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[10px] uppercase tracking-[0.2em] text-white/50",
									children: "Case Kits & Clues"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-white/80 border border-white/10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex items-baseline gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-3xl font-bold text-white",
									children: stats?.total_kits ?? 0
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[10px] text-emerald-400",
									children: "Physical Kits"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px] font-mono text-white/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Signature Clues" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admin/kits",
									className: "text-blood hover:underline flex items-center gap-1",
									children: "Kits →"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/[0.08] bg-[#070707] p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[10px] uppercase tracking-[0.2em] text-white/50",
									children: "Total Orders"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-white/80 border border-white/10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex items-baseline gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-3xl font-bold text-white",
									children: stats?.total_orders ?? 0
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-[10px] text-emerald-400",
									children: ["$", stats?.total_revenue?.toFixed(2) ?? "0.00"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px] font-mono text-white/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [stats?.pending_orders ?? 0, " Processing"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admin/orders",
									className: "text-blood hover:underline flex items-center gap-1",
									children: "Orders →"
								})]
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-12 gap-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-span-12 lg:col-span-8 rounded-xl border border-white/[0.08] bg-[#070707] p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pb-4 border-b border-white/[0.08]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display text-[15px] font-bold uppercase tracking-[0.16em] text-white flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Recent Audit Activity" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[9px] uppercase tracking-widest text-white/40",
							children: "Live Terminal Log"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 divide-y divide-white/[0.05]",
						children: stats?.recent_activity?.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "py-6 text-center font-mono text-xs text-white/40",
							children: "No recent audit logs logged yet."
						}) : stats?.recent_activity?.map((act) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-3 flex items-start justify-between gap-4 font-mono text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-white/80 uppercase",
									children: [
										"[",
										act.action,
										"]"
									]
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-white/60",
									children: act.details || `${act.target_model} #${act.target_id}`
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "shrink-0 text-[10px] text-white/35",
								children: new Date(act.created_at).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit"
								})
							})]
						}, act.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-span-12 lg:col-span-4 space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/[0.08] bg-[#070707] p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-[15px] font-bold uppercase tracking-[0.16em] text-white mb-4",
							children: "Quick CMS Actions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2.5 font-mono text-[11px] uppercase tracking-wider",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/admin/cases",
									className: "flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-blood/40 hover:bg-blood/10 transition-all text-white/70 hover:text-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Manage Case Cards" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 text-blood" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/admin/store",
									className: "flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-blood/40 hover:bg-blood/10 transition-all text-white/70 hover:text-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add / Edit Products" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 text-blood" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/admin/kits",
									className: "flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-blood/40 hover:bg-blood/10 transition-all text-white/70 hover:text-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Manage Physical Kits" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 text-blood" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/admin/settings",
									className: "flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-blood/40 hover:bg-blood/10 transition-all text-white/70 hover:text-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Global Site Settings" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 text-blood" })]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border border-white/[0.08] bg-[#070707] p-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-display text-sm font-bold uppercase tracking-wider text-white",
								children: "Clearance: Level 5"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[10px] text-white/40 uppercase",
								children: "Direct Encrypted Terminal"
							})] })]
						})
					})]
				})]
			})]
		})]
	});
}
//#endregion
export { AdminDashboard as component };
