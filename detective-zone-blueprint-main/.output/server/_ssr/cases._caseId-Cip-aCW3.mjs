import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Wt as ArrowLeft } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cases._caseId-Cip-aCW3.js
var import_jsx_runtime = require_jsx_runtime();
function CaseNotFound() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-[#050505] text-[#C7C7C7] font-sans pt-[72px] flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-[48px] text-[#B31217] leading-none",
					style: { fontFamily: "Bebas Neue, sans-serif" },
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground",
					children: "Case file not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/cases",
					className: "mt-8 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-[#B31217] hover:text-white transition-colors duration-300",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back to Case Files"]
				})
			]
		})
	});
}
//#endregion
export { CaseNotFound as t };
