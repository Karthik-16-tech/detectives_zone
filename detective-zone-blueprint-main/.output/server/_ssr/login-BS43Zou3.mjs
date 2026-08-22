import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { Mt as CircleAlert, Q as Lock, Ut as ArrowRight, b as Shield, vt as Eye, yt as EyeOff } from "../_libs/lucide-react.mjs";
import { i as S3_MEDIA, r as useAdminAuth } from "./router-CBHk_fdB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BS43Zou3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var logo = S3_MEDIA.logo;
function AdminLogin() {
	const { login, isAuthenticated } = useAdminAuth();
	useNavigate();
	const [username, setUsername] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	if (isAuthenticated) {
		if (typeof window !== "undefined") window.location.href = "/admin";
	}
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			await login(username, password);
			window.location.href = "/admin";
		} catch (err) {
			setError(err.message || "Failed to authenticate. Check your credentials.");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen w-full flex items-center justify-center bg-[#040404] text-white px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": true,
			className: "pointer-events-none absolute inset-0 opacity-20",
			style: {
				backgroundImage: `
            radial-gradient(ellipse at center, rgba(179,18,23,0.2) 0%, transparent 65%),
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
				backgroundSize: "100% 100%, 40px 40px, 40px 40px"
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#080808]/90 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.8)] backdrop-blur-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between pb-6 border-b border-white/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-10 w-10 items-center justify-center rounded-lg border border-blood/50 bg-black",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: logo,
								alt: "Logo",
								className: "h-6 w-6 object-contain"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "font-display text-lg font-bold uppercase tracking-[0.18em]",
							children: ["Detectives ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-blood",
								children: "Zone"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[9px] uppercase tracking-[0.2em] text-white/40",
							children: "Classified CMS Terminal"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-8 w-8 items-center justify-center rounded-full bg-blood/10 border border-blood/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4 text-blood" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "my-6 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white/50 flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5 text-blood shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Restricted Portal · Clearance Required" })]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 rounded-lg border border-blood/40 bg-blood/10 p-3.5 font-mono text-[11px] text-red-300 flex items-start gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-blood shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2",
							children: "Agent ID / Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							required: true,
							value: username,
							onChange: (e) => setUsername(e.target.value),
							placeholder: "admin@detectivezone.co",
							className: "w-full rounded-lg border border-white/15 bg-black/60 px-4 py-3 font-mono text-[12px] text-white placeholder-white/25 outline-none transition-colors focus:border-blood focus:ring-1 focus:ring-blood"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2",
							children: "Passcode"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: showPassword ? "text" : "password",
								required: true,
								value: password,
								onChange: (e) => setPassword(e.target.value),
								placeholder: "••••••••••••",
								className: "w-full rounded-lg border border-white/15 bg-black/60 px-4 py-3 font-mono text-[12px] text-white placeholder-white/25 outline-none transition-colors focus:border-blood focus:ring-1 focus:ring-blood pr-10"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowPassword(!showPassword),
								className: "absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white",
								children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: loading,
							className: "group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blood py-3.5 font-display text-[12px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-blood/90 hover:shadow-[0_0_28px_rgba(179,18,23,0.5)] disabled:opacity-50 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: loading ? "Authenticating Clearance..." : "Access Control Terminal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 text-center border-t border-white/[0.06] pt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-white/30",
					children: "Default: admin@detectivezone.co / detective2026"
				})
			]
		})]
	});
}
//#endregion
export { AdminLogin as component };
