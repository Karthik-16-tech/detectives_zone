import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Settings, Ct as CreditCard, G as MessageCircle, K as Menu, X as Mail, Z as LogOut, bt as ExternalLink, dt as FolderOpen, gt as FileText, i as X, nt as LayoutDashboard, v as ShoppingCart, y as ShoppingBag, z as Package } from "../_libs/lucide-react.mjs";
import { i as S3_MEDIA, r as useAdminAuth } from "./router-CBHk_fdB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AdminLayout-BazMIgX5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var logo = S3_MEDIA.logo;
function AdminLayout({ children, title, subtitle, action }) {
	const { admin, isAuthenticated, isLoading, logout } = useAdminAuth();
	const pathname = useRouterState().location.pathname;
	const [mobileOpen, setMobileOpen] = import_react.useState(false);
	(0, import_react.useEffect)(() => {
		if (!isLoading && !isAuthenticated) {
			if (typeof window !== "undefined" && window.location.pathname !== "/admin/login") window.location.href = "/admin/login";
		}
	}, [isLoading, isAuthenticated]);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-[#050505] text-white font-mono text-xs uppercase tracking-widest",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-blood animate-ping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verifying Clearance Credentials..." })]
		})
	});
	if (!isAuthenticated) return null;
	const navItems = [
		{
			label: "Dashboard",
			to: "/admin",
			icon: LayoutDashboard
		},
		{
			label: "Case Pages CMS",
			to: "/admin/pages",
			icon: FileText
		},
		{
			label: "Cases & Dossiers",
			to: "/admin/cases",
			icon: FolderOpen
		},
		{
			label: "Store Products",
			to: "/admin/store",
			icon: ShoppingBag
		},
		{
			label: "Case Kits",
			to: "/admin/kits",
			icon: Package
		},
		{
			label: "Orders & Desk",
			to: "/admin/orders",
			icon: ShoppingCart
		},
		{
			label: "Payment Gateway",
			to: "/admin/payments",
			icon: CreditCard
		},
		{
			label: "WhatsApp Panel",
			to: "/admin/whatsapp",
			icon: MessageCircle
		},
		{
			label: "Contact Inbox",
			to: "/admin/contact",
			icon: Mail
		},
		{
			label: "Global Settings",
			to: "/admin/settings",
			icon: Settings
		}
	];
	const isActive = (to) => {
		if (to === "/admin") return pathname === "/admin";
		return pathname.startsWith(to);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#030303] text-[#e0e0e0] font-sans flex",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: `fixed inset-y-0 left-0 z-50 w-64 border-r border-white/[0.08] bg-[#060606] transition-transform duration-300 lg:static lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-full flex-col justify-between p-4 sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between pb-6 border-b border-white/[0.07]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin",
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-9 w-9 items-center justify-center rounded-lg border border-blood/40 bg-black",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: logo,
								alt: "Logo",
								className: "h-6 w-6 object-contain"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "font-display text-[15px] font-bold uppercase tracking-[0.2em] text-white",
							children: ["Detectives ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-blood",
								children: "CMS"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[9px] uppercase tracking-[0.16em] text-white/40",
							children: "Control Terminal"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMobileOpen(false),
						className: "p-1 text-white/50 hover:text-white lg:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "mt-6 space-y-1.5 font-mono text-[11px] uppercase tracking-[0.16em]",
					children: navItems.map((item) => {
						const Icon = item.icon;
						const active = isActive(item.to);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							onClick: () => setMobileOpen(false),
							className: `flex items-center gap-3 rounded-lg px-3.5 py-2.5 transition-all duration-200 ${active ? "bg-blood/15 text-white border border-blood/35 font-semibold" : "text-white/50 hover:bg-white/[0.04] hover:text-white"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 ${active ? "text-blood" : "text-white/40"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
						}, item.to);
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-white/[0.07] pt-5 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						target: "_blank",
						className: "flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/60 hover:border-blood/40 hover:text-white transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Live Website" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3 text-blood" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-lg bg-black/60 p-3 border border-white/[0.06]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blood/20 text-blood font-bold text-[11px]",
								children: admin?.username?.charAt(0).toUpperCase() || "A"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "truncate",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[11px] font-semibold text-white truncate",
									children: admin?.username || "Admin"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[9px] uppercase tracking-wider text-white/40",
									children: admin?.role || "Agent"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: logout,
							title: "Logout",
							className: "p-1.5 text-white/40 hover:text-blood transition-colors",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
						})]
					})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex flex-col min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#040404]/90 px-4 backdrop-blur-md sm:px-6 lg:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMobileOpen(true),
						className: "p-2 text-white/60 hover:text-white lg:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-[18px] font-bold uppercase tracking-[0.14em] text-white leading-none",
						children: title
					}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase tracking-[0.14em] text-white/45 mt-1",
						children: subtitle
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden sm:flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-500 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FastAPI Backend Active" })]
					}), action]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto",
				children
			})]
		})]
	});
}
//#endregion
export { AdminLayout as t };
