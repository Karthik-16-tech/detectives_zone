import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as Notebook, F as Play, H as Monitor, L as PersonStanding, Q as Lock, Rt as Camera, S as Share2, W as MessagesSquare, Wt as ArrowLeft, f as Star, gt as FileText, mt as FingerprintPattern, q as Maximize2, ut as Folder } from "../_libs/lucide-react.mjs";
import { c as api, i as S3_MEDIA, n as Route$3 } from "./router-CBHk_fdB.mjs";
import { t as CaseNotFound } from "./cases._caseId-Cip-aCW3.mjs";
import { t as EvidenceWall } from "./evidence-wall-BOk_93Xd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cases._caseId-D6HMfDLh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var noir_street_default = "/assets/noir-street-CTVKNfLm.jpg";
function HeroVideoCard({ videoSrc }) {
	const [isPlayingInline, setIsPlayingInline] = (0, import_react.useState)(false);
	const videoRef = (0, import_react.useRef)(null);
	const handlePlayInline = () => {
		setIsPlayingInline(true);
		setTimeout(() => {
			if (videoRef.current) videoRef.current.play().catch(() => {});
		}, 50);
	};
	const handleFullscreen = () => {
		setIsPlayingInline(true);
		setTimeout(() => {
			const video = videoRef.current;
			if (video) {
				video.play().catch(() => {});
				if (video.requestFullscreen) video.requestFullscreen().catch(() => {});
				else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
				else if (video.msRequestFullscreen) video.msRequestFullscreen();
			}
		}, 50);
	};
	const handleVideoClick = () => {
		if (videoRef.current) if (videoRef.current.paused) videoRef.current.play().catch(() => {});
		else videoRef.current.pause();
	};
	if (!videoSrc) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel group relative overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: noir_street_default,
				alt: "The victim's study: a dark detective office with a desk lamp, case files and rain on the window",
				width: 1280,
				height: 720,
				className: "h-[340px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] xl:h-[380px]"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[linear-gradient(180deg,oklch(0_0_0/0.35),oklch(0_0_0/0.85))]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 flex flex-col items-center justify-center gap-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"aria-label": "Play case introduction video",
					className: "grid size-[74px] place-items-center rounded-full border border-foreground/70 bg-background/25 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-[var(--glow-red)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "ml-1 size-7 fill-current" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-base font-semibold uppercase tracking-[0.18em]",
						children: "Case Introduction Video"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-xs mt-2 text-muted-foreground",
						children: "12:45 Min"
					})]
				})]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .no-progress-video::-webkit-media-controls-timeline {
          display: none !important;
        }
        .no-progress-video::-webkit-media-controls-current-time-display {
          display: none !important;
        }
        .no-progress-video::-webkit-media-controls-time-remaining-display {
          display: none !important;
        }
        .no-progress-video::-webkit-media-controls-mute-button {
          display: none !important;
        }
        .no-progress-video::-webkit-media-controls-volume-slider {
          display: none !important;
        }
        .no-progress-video::-webkit-media-controls-fullscreen-button {
          display: none !important;
        }
        .no-progress-video::-internal-media-controls-overflow-button {
          display: none !important;
        }
      ` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "panel group relative overflow-hidden bg-black",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					ref: videoRef,
					src: videoSrc,
					controls: true,
					controlsList: "nodownload nofullscreen noplaybackrate",
					disablePictureInPicture: true,
					onClick: handleVideoClick,
					className: `h-[340px] w-full object-cover xl:h-[380px] no-progress-video cursor-pointer ${isPlayingInline ? "block" : "hidden"}`
				}), !isPlayingInline && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/assets/noir-street-CTVKNfLm.jpg",
						alt: "The victim's study: a dark detective office with a desk lamp, case files and rain on the window",
						width: 1280,
						height: 720,
						className: "h-[340px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] xl:h-[380px]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[linear-gradient(180deg,oklch(0_0_0/0.35),oklch(0_0_0/0.85))]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-0 flex flex-col items-center justify-center gap-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handlePlayInline,
								"aria-label": "Play case introduction video",
								className: "grid size-[74px] place-items-center rounded-full border border-foreground/70 bg-background/25 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-[var(--glow-red)] cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "ml-1 size-7 fill-current" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-base font-semibold uppercase tracking-[0.18em]",
									children: "Case Introduction Video"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "label-xs mt-2 text-muted-foreground",
									children: "12:45 Min"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute bottom-4 right-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: handleFullscreen,
									className: "flex items-center gap-1.5 px-3 py-1.5 bg-black/50 hover:bg-black/80 border border-white/10 hover:border-primary/50 text-[10px] uppercase tracking-wider rounded transition-colors text-white cursor-pointer font-mono",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "size-3" }), "Theater Mode"]
								})
							})
						]
					})
				] })]
			}),
			isPlayingInline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleFullscreen,
					className: "flex items-center gap-2 px-4 py-2 border border-foreground/30 hover:border-primary text-xs uppercase tracking-wider rounded transition-colors text-white bg-transparent cursor-pointer font-mono",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "size-3.5" }), "Theater Mode"]
				})
			})
		]
	});
}
var MODULES = [
	{
		n: 1,
		icon: PersonStanding,
		title: "Crime Scene",
		desc: "Explore the scene",
		pct: 75
	},
	{
		n: 2,
		icon: FileText,
		title: "Autopsy Report",
		desc: "Medical examination findings",
		pct: 60
	},
	{
		n: 3,
		icon: MessagesSquare,
		title: "Witness Statements",
		desc: "Interviews and testimonies",
		pct: 45
	},
	{
		n: 4,
		icon: Monitor,
		title: "Digital Evidence",
		desc: "Devices, calls and digital clues",
		pct: 30
	},
	{
		n: 5,
		icon: Folder,
		title: "Documents",
		desc: "Letters, reports and files",
		pct: 40
	},
	{
		n: 6,
		icon: Camera,
		title: "Evidence Photos",
		desc: "Images and photographs",
		pct: 50
	},
	{
		n: 7,
		icon: Share2,
		title: "Timeline",
		desc: "Reconstruct the sequence",
		pct: 35
	},
	{
		n: 8,
		icon: Notebook,
		title: "Detective Notes",
		desc: "Your notes and deductions",
		pct: 20
	}
];
var ICON_MAP = {
	PersonStanding,
	FileText,
	MessagesSquare,
	Monitor,
	Folder,
	Camera,
	Share2,
	Notebook
};
var DEFAULT_ICONS = [
	PersonStanding,
	FileText,
	MessagesSquare,
	Monitor,
	Folder,
	Camera,
	Share2,
	Notebook
];
function InvestigationModules({ modules }) {
	const displayModules = modules && modules.length > 0 ? modules.map((m, idx) => {
		let IconComp = DEFAULT_ICONS[idx % DEFAULT_ICONS.length];
		if (m.icon && typeof m.icon === "string" && ICON_MAP[m.icon]) IconComp = ICON_MAP[m.icon];
		else if (m.icon && typeof m.icon !== "string") IconComp = m.icon;
		return {
			n: m.n || idx + 1,
			icon: IconComp,
			title: m.title,
			desc: m.desc,
			pct: m.pct !== void 0 ? m.pct : MODULES[idx]?.pct || 50
		};
	}) : MODULES;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel grain p-4 sm:p-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-0.5 w-7 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold uppercase tracking-[0.1em]",
						children: "Investigation Modules"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 pl-11 text-[14px] text-muted-foreground",
					children: "Explore all sections and uncover the truth."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "label-xs shrink-0 text-muted-foreground",
				children: [displayModules.length, " Modules"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: displayModules.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "group relative overflow-hidden rounded-2xl border border-hairline bg-surface-2/50 p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface-2 hover:shadow-[var(--glow-red)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-11 shrink-0 place-items-center rounded-xl border border-hairline bg-background/60 transition-colors group-hover:border-primary/40",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(m.icon, {
									className: "size-5",
									strokeWidth: 1.4
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "label-xs shrink-0 font-semibold tabular-nums text-muted-foreground/70",
								children: String(m.n).padStart(2, "0")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "label-xs ml-auto shrink-0 font-semibold tabular-nums",
								children: [m.pct, "%"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-4 block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-xs truncate font-display font-semibold",
							children: m.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1.5 block text-[13px] leading-snug text-muted-foreground",
							children: m.desc
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-5 block h-[3px] w-full overflow-hidden rounded-full bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block h-full rounded-full bg-primary transition-all duration-500",
							style: { width: `${m.pct}%` }
						})
					})
				]
			}, m.n))
		})]
	});
}
var alley_default = "/assets/alley-CyRx6z9e.jpg";
function QuoteBanner({ quote, author }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel grain relative grid grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_460px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-7 px-6 py-10 sm:px-10 sm:py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-6xl leading-none text-primary",
				"aria-hidden": "true",
				children: "“"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl leading-snug",
					children: quote ? quote : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"The ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary",
							children: "truth"
						}),
						" is buried under layers of lies.",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"Only the sharpest mind can dig it out.”"
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
					className: "label-xs mt-5 text-muted-foreground",
					children: author || "— Detective Zone"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative hidden min-h-[180px] lg:block",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FingerprintPattern, {
					className: "absolute left-6 top-1/2 z-10 size-32 -translate-y-1/2 text-foreground/10",
					strokeWidth: .6
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: alley_default,
					alt: "Silhouette of a detective walking down a rainy alley",
					loading: "lazy",
					width: 1152,
					height: 576,
					className: "h-full w-full object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[linear-gradient(90deg,var(--card),oklch(0_0_0/0.2))]" })
			]
		})]
	});
}
var caseVoicemail = S3_MEDIA.cases.caseVoicemail;
var caseWitness = S3_MEDIA.cases.caseWitness;
var caseLetter = S3_MEDIA.cases.caseLetter;
var caseHeir = S3_MEDIA.cases.caseHeir;
var caseExperiment = S3_MEDIA.cases.caseExperiment;
var caseBetrayal = S3_MEDIA.cases.caseBetrayal;
var corkboard = S3_MEDIA.evidence.corkboard;
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
var case001Video = S3_MEDIA.heroVideo;
var caseFiles = {
	"001": {
		id: "001",
		title: "The Last Voicemail",
		status: "UNSOLVED",
		image: caseVoicemail,
		description: "A successful businessman found dead in his study. No forced entry. No clear motive. Just a voicemail… and a lot of questions.",
		stars: 5,
		duration: "3–5 HOURS",
		difficulty: "HARD",
		caseType: "Homicide",
		dateOfIncident: "15 July 2027",
		location: "Varma Residence",
		pins: [
			{
				id: "vm",
				x: 14,
				y: 22,
				label: "Voicemail",
				note: "3:47 AM. \"It's already done. Don't look for me.\"",
				image: e01
			},
			{
				id: "card",
				x: 45,
				y: 24,
				label: "Business Card",
				note: "Found under the desk. Dated the night before.",
				image: e02
			},
			{
				id: "receipt",
				x: 78,
				y: 24,
				label: "Receipt",
				note: "Dinner for two. Not his wife's handwriting.",
				image: e03
			},
			{
				id: "key",
				x: 16,
				y: 68,
				label: "Door Key",
				note: "Unmatched to any lock in the house.",
				image: e04
			},
			{
				id: "photo",
				x: 48,
				y: 72,
				label: "Photograph",
				note: "Torn in half. A face cut away with scissors.",
				image: e05
			},
			{
				id: "note",
				x: 82,
				y: 66,
				label: "Handwritten Note",
				note: "\"The hand that writes points there.\"",
				image: e06
			}
		],
		links: [
			[0, 1],
			[1, 2],
			[0, 3],
			[3, 4],
			[4, 5],
			[2, 5]
		]
	},
	"002": {
		id: "002",
		title: "The Silent Witness",
		status: "UNSOLVED",
		image: caseWitness,
		description: "A reclusive writer found dead in a locked room. A witness that never spoke... but saw everything.",
		stars: 4,
		duration: "3–6 HOURS",
		difficulty: "HARD",
		caseType: "Locked Room",
		dateOfIncident: "22 June 2027",
		location: "Morrow House",
		pins: [
			{
				id: "mss",
				x: 14,
				y: 20,
				label: "Manuscript",
				note: "Final chapter rewritten eleven times.",
				image: e07
			},
			{
				id: "lamp",
				x: 44,
				y: 14,
				label: "Desk Lamp",
				note: "Bulb still warm. Nobody in the room.",
				image: e08
			},
			{
				id: "lock",
				x: 72,
				y: 30,
				label: "Locked Door",
				note: "Bolt thrown from the inside.",
				image: e09
			},
			{
				id: "glass",
				x: 30,
				y: 62,
				label: "Glass Shard",
				note: "Three fingerprints. Two of them his.",
				image: e10
			},
			{
				id: "book",
				x: 60,
				y: 70,
				label: "Open Diary",
				note: "Last entry: \"They know I saw.\"",
				image: e11
			},
			{
				id: "phone",
				x: 86,
				y: 58,
				label: "Phone",
				note: "One call out. To a number that doesn't exist.",
				image: e12
			}
		],
		links: [
			[0, 1],
			[1, 2],
			[0, 3],
			[3, 4],
			[4, 5],
			[2, 5]
		]
	},
	"003": {
		id: "003",
		title: "Blood in the Letter",
		status: "COMING SOON",
		image: caseLetter,
		description: "A threatening letter. A missing girl. A trail of blood. The shadows are speaking.",
		stars: 0,
		duration: "COMING SOON",
		difficulty: "MEDIUM",
		caseType: "Classified",
		dateOfIncident: "TBD",
		location: "Redacted",
		pins: [
			{
				id: "letter",
				x: 16,
				y: 22,
				label: "Letter",
				note: "Typed. Postmark from a town that burned down."
			},
			{
				id: "stamp",
				x: 44,
				y: 14,
				label: "Blood Stain",
				note: "Dried on the fold. Dated before the threat."
			},
			{
				id: "photo",
				x: 72,
				y: 30,
				label: "Photo",
				note: "A girl in a yellow coat. Face circled in red."
			},
			{
				id: "map",
				x: 30,
				y: 62,
				label: "Map",
				note: "A route marked in pencil. Ends at the river."
			},
			{
				id: "shoe",
				x: 60,
				y: 70,
				label: "Shoe Print",
				note: "Left behind. Size too small."
			},
			{
				id: "note",
				x: 86,
				y: 58,
				label: "Note",
				note: "\"The shadows are speaking.\""
			}
		],
		links: [
			[0, 1],
			[1, 2],
			[0, 3],
			[3, 4],
			[4, 5],
			[2, 5]
		]
	},
	"004": {
		id: "004",
		title: "The Vanished One",
		status: "COMING SOON",
		image: caseHeir,
		description: "They were here one day, gone the next. A disappearance that made no noise at all.",
		stars: 0,
		duration: "COMING SOON",
		difficulty: "MEDIUM",
		caseType: "Classified",
		dateOfIncident: "TBD",
		location: "Redacted",
		pins: [
			{
				id: "bed",
				x: 16,
				y: 22,
				label: "Bed",
				note: "Unmade. Clothes still in the wardrobe."
			},
			{
				id: "keys",
				x: 44,
				y: 14,
				label: "Car Keys",
				note: "Left on the table. Engine cold."
			},
			{
				id: "wallet",
				x: 72,
				y: 30,
				label: "Wallet",
				note: "Cash untouched. Cards all there."
			},
			{
				id: "journal",
				x: 30,
				y: 62,
				label: "Journal",
				note: "Pages torn from the last week."
			},
			{
				id: "phone",
				x: 60,
				y: 70,
				label: "Phone",
				note: "Dead. Last message never sent."
			},
			{
				id: "coat",
				x: 86,
				y: 58,
				label: "Coat",
				note: "Hanging by the door. Still damp."
			}
		],
		links: [
			[0, 1],
			[1, 2],
			[0, 3],
			[3, 4],
			[4, 5],
			[2, 5]
		]
	},
	"005": {
		id: "005",
		title: "The Final Experiment",
		status: "COMING SOON",
		image: caseExperiment,
		description: "A scientist's last experiment was never meant to be found. Now the cure is the disease.",
		stars: 0,
		duration: "COMING SOON",
		difficulty: "HARD",
		caseType: "Classified",
		dateOfIncident: "TBD",
		location: "Redacted",
		pins: [
			{
				id: "vial",
				x: 16,
				y: 22,
				label: "Vial",
				note: "Label torn. A drop missing."
			},
			{
				id: "log",
				x: 44,
				y: 14,
				label: "Lab Log",
				note: "Stops mid-sentence. Ink smudged."
			},
			{
				id: "camera",
				x: 72,
				y: 30,
				label: "Camera",
				note: "Footage ends 11:47 PM."
			},
			{
				id: "stamp",
				x: 30,
				y: 62,
				label: "Stamp",
				note: "Classified. Redacted twice."
			},
			{
				id: "note",
				x: 60,
				y: 70,
				label: "Note",
				note: "\"Now the cure is the disease.\""
			},
			{
				id: "keycard",
				x: 86,
				y: 58,
				label: "Keycard",
				note: "Level 4 access. Used at 11:48 PM."
			}
		],
		links: [
			[0, 1],
			[1, 2],
			[0, 3],
			[3, 4],
			[4, 5],
			[2, 5]
		]
	},
	"006": {
		id: "006",
		title: "Shadows of Betrayal",
		status: "COMING SOON",
		image: caseBetrayal,
		description: "A man caught between loyalty and truth. One choice changed everything.",
		stars: 0,
		duration: "COMING SOON",
		difficulty: "HARD",
		caseType: "Classified",
		dateOfIncident: "TBD",
		location: "Redacted",
		pins: [
			{
				id: "letter",
				x: 16,
				y: 22,
				label: "Letter",
				note: "Unsigned. A name crossed out."
			},
			{
				id: "watch",
				x: 44,
				y: 14,
				label: "Watch",
				note: "Stopped at 11:47 PM. Second hand missing."
			},
			{
				id: "receipt",
				x: 72,
				y: 30,
				label: "Receipt",
				note: "Two tickets. One name."
			},
			{
				id: "photo",
				x: 30,
				y: 62,
				label: "Photo",
				note: "Two men shaking hands. Faces blurred."
			},
			{
				id: "key",
				x: 60,
				y: 70,
				label: "Key",
				note: "Opens a drawer that shouldn't exist."
			},
			{
				id: "note",
				x: 86,
				y: 58,
				label: "Note",
				note: "\"Trust no one.\""
			}
		],
		links: [
			[0, 1],
			[1, 2],
			[0, 3],
			[3, 4],
			[4, 5],
			[2, 5]
		]
	}
};
function CaseDetailPage() {
	const { caseId } = Route$3.useParams();
	const initialFile = caseFiles[caseId] || caseFiles["001"];
	const [file, setFile] = (0, import_react.useState)(initialFile);
	const [pageData, setPageData] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		Promise.all([api.getCase(caseId).catch(() => null), api.getCasePage(caseId).catch(() => null)]).then(([cData, pData]) => {
			if (cData) setFile((prev) => ({
				...prev,
				title: cData.title || prev.title,
				description: cData.short_description || cData.intro_text || prev.description,
				status: cData.status || prev.status,
				difficulty: cData.difficulty || prev.difficulty,
				duration: cData.estimated_duration || prev.duration,
				stars: cData.rating ? Math.round(cData.rating) : prev.stars,
				image: cData.cover_image || prev.image
			}));
			if (pData) {
				setPageData(pData);
				setFile((prev) => {
					let customPins = prev.pins;
					if (pData.evidence_pins && pData.evidence_pins.length > 0) {
						const fallbackImages = [
							e01,
							e02,
							e03,
							e04,
							e05,
							e06,
							e07,
							e08,
							e09,
							e10,
							e11,
							e12
						];
						customPins = pData.evidence_pins.map((p, idx) => ({
							id: p.id || `pin_${idx}`,
							x: p.x,
							y: p.y,
							label: p.label,
							note: p.note,
							image: p.image_url || fallbackImages[idx % fallbackImages.length]
						}));
					}
					return {
						...prev,
						caseType: pData.case_type || prev.caseType,
						dateOfIncident: pData.date_of_incident || prev.dateOfIncident,
						location: pData.location || prev.location,
						pins: customPins,
						description: pData.hero_subtitle || prev.description
					};
				});
			}
		});
	}, [caseId]);
	if (!file) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaseNotFound, {});
	const unlocked = file.status === "UNSOLVED";
	const titleCase = (s) => s.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
	const metaRows = [
		{
			label: "Case Status",
			value: titleCase(file.status)
		},
		{
			label: "Difficulty",
			value: titleCase(file.difficulty)
		},
		{
			label: "Investigation Time",
			value: titleCase(file.duration)
		},
		{
			label: "Case Type",
			value: file.caseType
		},
		{
			label: "Date of Incident",
			value: file.dateOfIncident
		},
		{
			label: "Location",
			value: file.location
		}
	];
	const activeHeroVideo = pageData?.hero_video_url || (file.id === "001" ? case001Video : void 0);
	const activeModules = pageData?.investigation_modules && pageData.investigation_modules.length > 0 ? pageData.investigation_modules.map((m, idx) => ({
		n: idx + 1,
		icon: m.icon,
		title: m.heading,
		desc: m.body,
		pct: m.pct !== void 0 ? m.pct : [
			75,
			60,
			45,
			30,
			40,
			50,
			35,
			20
		][idx % 8]
	})) : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-[#000000] text-[#C7C7C7] font-sans pt-[72px] relative overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
					className: "flex flex-col md:flex-row justify-between items-start md:items-end pb-7 mb-8 gap-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-mono text-[10px] tracking-[2px] text-muted-foreground uppercase",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "hover:text-white transition-colors duration-300",
								children: "Home"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mx-2",
								children: "/"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/cases",
								className: "hover:text-white transition-colors duration-300",
								children: "Cases"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mx-2",
								children: "/"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[#B31217]",
								children: ["Case ", file.id]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "grid grid-cols-12 gap-8 mb-10 items-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-span-12 lg:col-span-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative rounded-lg overflow-hidden border border-[#1A1A1A]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: file.image,
								alt: file.title,
								className: "w-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent opacity-80" })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-12 lg:col-span-7",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-[10px] tracking-[0.2em] uppercase text-[#B31217]",
									children: ["Case ", file.id]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `px-2.5 py-1 font-mono text-[8px] font-bold tracking-[0.2em] uppercase rounded-sm ${file.status === "UNSOLVED" ? "bg-[#B31217] text-white" : "bg-neutral-800 text-muted-foreground"}`,
									children: file.status
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-[clamp(2.25rem,8vw,3rem)] font-bold text-white tracking-[2px] leading-none uppercase mb-1",
								style: { fontFamily: "Bebas Neue, sans-serif" },
								children: file.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[12px] text-[#A0A0A0] font-mono tracking-[1.5px] uppercase mb-6",
								children: "Evidence wall — connect the dots"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2 mb-4",
								children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-4 w-4 ${i < file.stars ? "text-[#B31217] fill-[#B31217]" : "text-neutral-800"}` }, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[15px] leading-relaxed text-[#B5B5B5] max-w-2xl",
								children: file.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 border border-[#1A1A1A] bg-[#0B0B0B] rounded-lg p-6",
								children: metaRows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground",
									children: row.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-display text-[16px] text-white uppercase tracking-[1px]",
									style: { fontFamily: "Bebas Neue, sans-serif" },
									children: row.value
								})] }, row.label))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/cases",
								className: "mt-8 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-white transition-colors duration-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back to Case Files"]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroVideoCard, { videoSrc: activeHeroVideo }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "border-t border-[#1A1A1A]/80 pt-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-8 w-1 bg-[#B31217]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-[36px] font-bold text-white tracking-[2px] uppercase leading-none",
							style: { fontFamily: "Bebas Neue, sans-serif" },
							children: "Evidence Wall"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[12px] text-[#A0A0A0] font-mono tracking-[1.5px] uppercase mt-2",
							children: unlocked ? "Hover the pins to inspect each piece. Follow the red string." : "Locked until the case is released."
						})] })]
					}), unlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvidenceWall, {
						pins: file.pins,
						links: file.links,
						image: pageData?.evidence_wall_bg_url || corkboard,
						imageAlt: "Corkboard evidence board",
						height: "min(560px, 130vw)",
						accent: "#D32F2F",
						background: "#090909",
						imageOpacity: .45
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center rounded-2xl border border-[#1A1A1A] bg-[#0B0B0B] text-center",
						style: { height: "min(560px, 130vw)" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-10 w-10 text-muted-foreground mb-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-[24px] text-white uppercase tracking-[1.5px]",
								style: { fontFamily: "Bebas Neue, sans-serif" },
								children: "Case Classified"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 max-w-sm font-mono text-[11px] leading-relaxed text-muted-foreground uppercase tracking-[0.12em]",
								children: "This case file is sealed. Return when the investigation is released."
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8",
					children: [
						{
							t: "Room 104",
							s: "Hotel Key — serial legible"
						},
						{
							t: "11:47 PM",
							s: "Pocket Watch — stopped"
						},
						{
							t: "No. 404",
							s: "Sticky note — ask about the key"
						}
					].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 bg-[#0B0B0B] border border-[#1A1A1A] rounded-lg",
						style: { boxShadow: "inset 0 1px 1px rgba(255,255,255,0.02)" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-[28px] text-[#B31217] leading-none",
							style: { fontFamily: "Bebas Neue, sans-serif" },
							children: c.t
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-mono text-[9px] tracking-[0.15em] uppercase text-muted-foreground",
							children: c.s
						})]
					}, c.t))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InvestigationModules, { modules: activeModules })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuoteBanner, {
						quote: pageData?.quote_text,
						author: pageData?.quote_author
					})
				})
			]
		})
	});
}
//#endregion
export { CaseDetailPage as component };
