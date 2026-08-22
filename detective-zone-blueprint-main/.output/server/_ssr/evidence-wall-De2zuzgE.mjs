import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Wt as ArrowLeft, Y as MapPin } from "../_libs/lucide-react.mjs";
import { i as S3_MEDIA } from "./router-CBHk_fdB.mjs";
import { t as EvidenceWall } from "./evidence-wall-BOk_93Xd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/evidence-wall-De2zuzgE.js
var import_jsx_runtime = require_jsx_runtime();
var e01 = S3_MEDIA.evidence.e01;
var e02 = S3_MEDIA.evidence.e02;
var e03 = S3_MEDIA.evidence.e03;
var e04 = S3_MEDIA.evidence.e04;
var e05 = S3_MEDIA.evidence.e05;
var e06 = S3_MEDIA.evidence.e06;
var e07 = S3_MEDIA.evidence.e07;
var e08 = S3_MEDIA.evidence.e08;
var e09 = S3_MEDIA.evidence.e09;
var e10 = S3_MEDIA.evidence.e10;
var e11 = S3_MEDIA.evidence.e11;
var e12 = S3_MEDIA.evidence.e12;
var EVIDENCE = [
	{
		code: "E-01",
		alt: "Voicemail transcript",
		src: e01,
		rot: -3,
		x: 12,
		y: 20,
		note: "Last voicemail, 02:14."
	},
	{
		code: "E-02",
		alt: "Business card",
		src: e02,
		rot: 2.5,
		x: 30,
		y: 22,
		note: "Business card under the desk."
	},
	{
		code: "E-03",
		alt: "Receipt",
		src: e03,
		rot: -2,
		x: 50,
		y: 22,
		note: "Receipt for two, unsigned."
	},
	{
		code: "E-04",
		alt: "Door key",
		src: e04,
		rot: 3.5,
		x: 70,
		y: 13,
		note: "Door key, no matching lock."
	},
	{
		code: "E-05",
		alt: "Photograph",
		src: e05,
		rot: -3.5,
		x: 88,
		y: 24,
		note: "Photograph torn in half."
	},
	{
		code: "E-06",
		alt: "Handwritten note",
		src: e06,
		rot: 2,
		x: 14,
		y: 52,
		note: "Handwritten note, ink fresh."
	},
	{
		code: "E-07",
		alt: "Fingerprint sheet",
		src: e07,
		rot: -2.5,
		x: 34,
		y: 45,
		note: "Fingerprint sheet, partial."
	},
	{
		code: "E-08",
		alt: "Hotel key",
		src: e08,
		rot: 3,
		x: 54,
		y: 54,
		note: "Hotel key — room 404."
	},
	{
		code: "E-09",
		alt: "Map fragment",
		src: e09,
		rot: -2,
		x: 74,
		y: 46,
		note: "Map with route marked."
	},
	{
		code: "E-10",
		alt: "Blood report",
		src: e10,
		rot: 2.5,
		x: 25,
		y: 78,
		note: "Blood report, type O."
	},
	{
		code: "E-11",
		alt: "Phone log",
		src: e11,
		rot: -3,
		x: 50,
		y: 86,
		note: "Phone log, one call out."
	},
	{
		code: "E-12",
		alt: "Diary page",
		src: e12,
		rot: 2,
		x: 75,
		y: 76,
		note: "Diary page, final entry."
	}
];
var EVIDENCE_LINKS = [
	[0, 1],
	[1, 2],
	[2, 3],
	[3, 4],
	[0, 5],
	[1, 6],
	[2, 7],
	[3, 8],
	[4, 8],
	[5, 6],
	[6, 7],
	[7, 8],
	[5, 9],
	[6, 10],
	[7, 11],
	[8, 11],
	[9, 10],
	[10, 11]
];
var corkboard = S3_MEDIA.evidence.corkboard;
var pins = EVIDENCE.map((e) => ({
	id: e.code,
	x: e.x,
	y: e.y,
	label: e.code,
	note: e.note,
	image: e.src
}));
function EvidenceWallPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-[1600px] px-6 pb-20 lg:px-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 items-center gap-4 py-7 sm:grid-cols-[minmax(0,1fr)_auto]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "label-xs font-display font-semibold",
								children: "Case 001 // Evidence Wall"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 font-display text-4xl font-bold uppercase tracking-tight",
							children: "The Last Voicemail"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-xl text-sm text-muted-foreground",
							children: "Twelve exhibits, pinned and connected. Hover a card to light up its links."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/cases/$caseId",
					params: { caseId: "001" },
					className: "label-xs flex shrink-0 items-center gap-2 rounded-xl border border-hairline bg-surface-2 px-5 py-3 font-display font-semibold transition-colors hover:border-primary/50 hover:bg-primary/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Back to Case"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvidenceWall, {
				pins,
				links: EVIDENCE_LINKS,
				image: corkboard,
				height: "min(860px, 170vw)",
				accent: "#E53935",
				background: "#090909",
				imageOpacity: .4
			})]
		})
	});
}
//#endregion
export { EvidenceWallPage as component };
