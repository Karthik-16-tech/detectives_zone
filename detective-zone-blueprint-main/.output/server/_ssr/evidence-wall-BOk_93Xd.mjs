import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/evidence-wall-BOk_93Xd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* EvidenceWall — portable "corkboard + red string" board.
*
* COPY-PASTE READY: React + inline styles only. No Tailwind config, no design
* tokens, no animation library. Works in any React 18/19 app.
*/
var KEYFRAMES = `@keyframes ew-dash { to { stroke-dashoffset: -280; } }`;
function EvidenceWall({ pins, links = [], image, imageAlt = "Evidence board", height = 620, accent = "#D32F2F", background = "#090909", imageOpacity = .45, className, style }) {
	const [active, setActive] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		style: {
			position: "relative",
			width: "100%",
			height,
			borderRadius: 24,
			overflow: "hidden",
			background,
			border: "1px solid rgba(255,255,255,0.08)",
			boxShadow: "0 40px 120px -40px rgba(0,0,0,.9)",
			...style
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: KEYFRAMES }),
			image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: image,
				alt: imageAlt,
				style: {
					position: "absolute",
					inset: 0,
					width: "100%",
					height: "100%",
					objectFit: "cover",
					opacity: imageOpacity
				}
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
				position: "absolute",
				inset: 0,
				background
			} }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				style: {
					position: "absolute",
					inset: 0,
					width: "100%",
					height: "100%"
				},
				viewBox: "0 0 100 100",
				preserveAspectRatio: "none",
				"aria-hidden": "true",
				children: links.map(([a, b], i) => {
					const pa = pins[a];
					const pb = pins[b];
					if (!pa || !pb) return null;
					const on = active === a || active === b;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: pa.x,
						y1: pa.y,
						x2: pb.x,
						y2: pb.y,
						stroke: accent,
						strokeWidth: on ? 2.2 : 1,
						vectorEffect: "non-scaling-stroke",
						strokeDasharray: "8 6",
						style: {
							opacity: on ? .95 : .35,
							transition: "opacity .3s, stroke-width .3s",
							animation: "ew-dash 12s linear infinite"
						}
					}, i);
				})
			}),
			pins.map((p, i) => {
				const on = active === i;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onMouseEnter: () => setActive(i),
					onMouseLeave: () => setActive(null),
					onFocus: () => setActive(i),
					onBlur: () => setActive(null),
					style: {
						position: "absolute",
						left: `${p.x}%`,
						top: `${p.y}%`,
						width: "min(150px, 30vw)",
						padding: 12,
						textAlign: "left",
						cursor: "pointer",
						borderRadius: 8,
						border: `1px solid ${on ? accent : "rgba(255,255,255,0.12)"}`,
						background: "rgba(9,9,9,0.85)",
						backdropFilter: "blur(10px)",
						color: "#EDE6D6",
						transform: `translate(-50%, -50%) scale(${on ? 1.12 : 1}) rotate(${on ? i % 2 ? 2 : -2 : 0}deg)`,
						transition: "transform .28s cubic-bezier(.22,1,.36,1), border-color .28s"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
							position: "absolute",
							top: -6,
							left: "50%",
							width: 12,
							height: 12,
							marginLeft: -6,
							borderRadius: "50%",
							background: accent,
							boxShadow: `0 0 12px ${accent}`
						} }),
						p.image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: p.image,
							alt: p.note,
							loading: "lazy",
							style: {
								width: "100%",
								aspectRatio: "1 / 1",
								objectFit: "cover",
								borderRadius: 4,
								marginBottom: 10,
								display: "block"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
								fontSize: 10,
								letterSpacing: ".22em",
								textTransform: "uppercase",
								color: accent
							},
							children: p.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								marginTop: 6,
								fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
								fontSize: 11,
								lineHeight: 1.35,
								color: "rgba(237,230,214,0.8)"
							},
							children: p.note
						})
					]
				}, p.id);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
				position: "absolute",
				inset: 0,
				pointerEvents: "none",
				background: "radial-gradient(ellipse at center, transparent 20%, rgba(9,9,9,.85) 95%)"
			} })
		]
	});
}
//#endregion
export { EvidenceWall as t };
