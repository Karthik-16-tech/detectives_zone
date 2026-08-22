import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ut as ArrowRight, w as Search, z as Package } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders.index-BHo6s3vJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OrdersLookupPage() {
	const [orderNumber, setOrderNumber] = (0, import_react.useState)("");
	const navigate = useNavigate();
	const handleLookup = (e) => {
		e.preventDefault();
		if (!orderNumber.trim()) return;
		const formatted = orderNumber.trim().replace("#", "");
		navigate({ to: `/orders/${formatted}` });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background pt-32 pb-20 px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg rounded-2xl border border-white/10 bg-[#080808] p-8 sm:p-10 shadow-2xl text-center space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blood/20 text-blood border border-blood/40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-7 w-7" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[10px] uppercase tracking-[0.25em] text-blood font-bold",
						children: "Evidence Dispatch Tracking"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-2xl uppercase font-bold text-white tracking-wider",
						children: "Track Your Case Order"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-mono text-xs text-white/50",
						children: [
							"Enter your order reference code (e.g. ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-white",
								children: "ORD-2026-XXXXX"
							}),
							") to check fulfillment timeline and estimated delivery."
						]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleLookup,
					className: "space-y-4 font-mono text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							required: true,
							value: orderNumber,
							onChange: (e) => setOrderNumber(e.target.value),
							placeholder: "Enter Order # or Reference ID",
							className: "w-full rounded-xl border border-white/15 bg-black/80 py-3.5 pl-10 pr-4 text-white outline-none focus:border-blood uppercase"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						className: "w-full flex items-center justify-center gap-2 rounded-xl bg-blood py-3.5 font-display text-xs uppercase tracking-widest text-white hover:bg-blood/90 transition-all shadow-[0_0_20px_rgba(179,18,23,0.35)] cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Track Order" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
					})]
				})
			]
		})
	});
}
//#endregion
export { OrdersLookupPage as component };
