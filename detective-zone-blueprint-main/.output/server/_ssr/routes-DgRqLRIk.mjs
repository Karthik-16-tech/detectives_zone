import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as LockOpen, Lt as Check, O as RotateCcw, Ot as Clock, Q as Lock, Ut as ArrowRight, f as Star, i as X, l as TriangleAlert, mt as FingerprintPattern, n as ZoomIn, q as Maximize2, r as Zap, t as ZoomOut, vt as Eye } from "../_libs/lucide-react.mjs";
import { c as api, i as S3_MEDIA, o as RainCanvas, s as useRain } from "./router-CBHk_fdB.mjs";
import { i as AnimatePresence, n as useMotionValue, t as useSpring } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DgRqLRIk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ScrollReveal({ children, className = "" }) {
	const ref = (0, import_react.useRef)(null);
	const [isVisible, setIsVisible] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setIsVisible(true);
				observer.unobserve(el);
			}
		}, {
			threshold: .1,
			rootMargin: "0px 0px -80px 0px"
		});
		observer.observe(el);
		return () => {
			if (el) observer.unobserve(el);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: `transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"} ${className}`,
		children
	});
}
var CHARS = "01ABCDEFGHIJKLMNOP01010101";
var LENS = 210;
function EncryptedPanel() {
	const ref = (0, import_react.useRef)(null);
	const [inside, setInside] = (0, import_react.useState)(false);
	const mx = useMotionValue(0);
	const my = useMotionValue(0);
	const lx = useSpring(mx, {
		stiffness: 220,
		damping: 26,
		mass: .6
	});
	const ly = useSpring(my, {
		stiffness: 220,
		damping: 26,
		mass: .6
	});
	const [pos, setPos] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const rows = (0, import_react.useMemo)(() => Array.from({ length: 22 }, (_, r) => Array.from({ length: 58 }, (_, c) => CHARS[(r * 7 + c * 3 + r * c) % 26]).join("")), []);
	const onMove = (0, import_react.useCallback)((e) => {
		const r = ref.current?.getBoundingClientRect();
		if (!r) return;
		const x = e.clientX - r.left;
		const y = e.clientY - r.top;
		mx.set(x);
		my.set(y);
		setPos({
			x,
			y
		});
		setInside(true);
	}, [mx, my]);
	const copy = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-mono text-[13px] leading-[1.9] tracking-wide text-foreground",
		children: "Detective Zone is an immersive story-driven investigation experience. You don't just solve puzzles — you uncover secrets, connect evidence, and expose the truth hidden beneath the shadows of the city."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		onMouseMove: onMove,
		onMouseLeave: () => setInside(false),
		className: "relative min-h-[380px] overflow-hidden rounded-xl p-6",
		style: {
			background: "linear-gradient(160deg, oklch(0.2 0 0 / 0.9), oklch(0.145 0 0 / 0.95))",
			border: "0.7px solid oklch(0.75 0.09 78 / 0.16)",
			boxShadow: "inset 0 1px 0 0 oklch(1 0 0 / 0.05), inset 0 0 40px 0 oklch(0 0 0 / 0.55), 0 24px 60px -24px oklch(0 0 0 / 0.9)"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground",
					children: "// What is Detective Zone?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[11px] uppercase tracking-[0.2em] text-blood",
					children: "001"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-x-6 top-16 bottom-14 overflow-hidden select-none",
				children: rows.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono whitespace-nowrap text-[12px] leading-[1.55] tracking-[0.32em] text-foreground/12",
					children: row
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				animate: { opacity: inside ? 1 : 0 },
				transition: { duration: .3 },
				className: "pointer-events-none absolute inset-0 z-10",
				style: {
					maskImage: `radial-gradient(circle ${LENS / 2}px at ${pos.x}px ${pos.y}px, black 62%, transparent 82%)`,
					WebkitMaskImage: `radial-gradient(circle ${LENS / 2}px at ${pos.x}px ${pos.y}px, black 62%, transparent 82%)`
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-x-8 top-1/2 -translate-y-1/2 md:inset-x-16",
					children: copy
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				animate: { opacity: inside ? 1 : 0 },
				transition: { duration: .3 },
				style: {
					x: lx,
					y: ly,
					width: LENS,
					height: LENS
				},
				className: "pointer-events-none absolute top-0 left-0 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "size-full rounded-full ring-1 ring-brass/40",
					style: {
						background: "radial-gradient(circle at 34% 26%, oklch(1 0 0/0.1), transparent 42%), radial-gradient(circle at 50% 50%, transparent 60%, oklch(0 0 0/0.35) 92%)",
						boxShadow: "inset 0 0 40px oklch(0 0 0/0.55), 0 0 40px oklch(0.75 0.09 78/0.18), 0 18px 50px oklch(0 0 0/0.7)"
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono absolute bottom-5 left-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "size-1.5 rounded-full bg-blood",
					style: { boxShadow: "0 0 30px 0 oklch(0.46 0.196 26.5 / 0.55)" }
				}), "Move cursor to reveal"]
			})
		]
	});
}
function WhatIsDetectiveZone() {
	const ref = (0, import_react.useRef)(null);
	const [visible, setVisible] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setVisible(true);
				observer.unobserve(el);
			}
		}, {
			threshold: .15,
			rootMargin: "0px 0px -60px 0px"
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		ref,
		id: "what-is",
		className: "shell mt-14 sm:mt-24 lg:mt-32 scroll-mt-[64px]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-12 items-center gap-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `col-span-12 lg:col-span-7 ${visible ? "rise" : "opacity-0"}`,
				style: visible ? { animationDelay: "0.05s" } : void 0,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EncryptedPanel, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `col-span-12 lg:col-span-5 ${visible ? "rise" : "opacity-0"}`,
				style: visible ? { animationDelay: "0.2s" } : void 0,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "caption text-blood",
						children: "// What is Detective Zone?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mt-6 font-display text-[clamp(2rem,8vw,2.875rem)] leading-[0.95] font-bold uppercase",
						children: [
							"An archive of",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"unfinished truths"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-6 block h-[3px] w-[60px] bg-blood" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/cases",
						className: "group mt-9 inline-flex items-center gap-3 border border-blood/40 px-7 font-display text-[12px] tracking-[0.22em] uppercase text-blood transition-all duration-300 hover:border-blood hover:shadow-[0_0_24px_-4px_var(--blood)]",
						style: { height: 54 },
						children: ["Begin the Investigation", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" })]
					})
				]
			})]
		})
	});
}
var testimonialFamily = S3_MEDIA.testimonials.family;
var testimonialCouple = S3_MEDIA.testimonials.couple;
var testimonialFriends = S3_MEDIA.testimonials.friends;
S3_MEDIA.testimonials.birthday;
var speakers = [
	{
		name: "Sravani Reddy",
		role: "🏠 Family Evening",
		desc: "Amma was the first to crack the coded letter, amma! We all thought it was just a game — three hours later none of us had moved from the table. The case file felt impossibly real.",
		img: testimonialFamily,
		thumb: testimonialFamily
	},
	{
		name: "Venkat & Divya",
		role: "🌙 Anniversary Night In",
		desc: "We cancelled dinner plans for this and it was absolutely the right call. Divya solved the alibi clue before I even finished reading it. Honestly humbling. Ten out of ten.",
		img: testimonialCouple,
		thumb: testimonialCouple
	},
	{
		name: "Abhiram & Gang",
		role: "🍺 Boys Night Mystery",
		desc: "Six engineers could not crack the cipher for forty minutes. Embarrassing. But when it finally clicked — we screamed. The whole building must have heard us. Worth every rupee.",
		img: testimonialFriends,
		thumb: testimonialFriends
	}
];
function Speakers() {
	const [active, setActive] = (0, import_react.useState)(0);
	const cur = speakers[active];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative w-full overflow-hidden bg-[#020202] py-20 lg:py-32",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:60px_60px]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute left-0 top-1/3 h-[500px] w-[500px] rounded-full bg-[#0066ff]/[0.06] blur-[120px]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-[1400px] px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.h2, {
					initial: {
						opacity: 0,
						y: 20
					},
					whileInView: {
						opacity: 1,
						y: 0
					},
					viewport: { once: true },
					transition: { duration: .8 },
					className: "font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold uppercase tracking-[0.05em] text-white",
					children: "TESTIMONIALS"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							y: 30
						},
						whileInView: {
							opacity: 1,
							y: 0
						},
						viewport: { once: true },
						transition: { duration: 1 },
						className: "relative min-h-[340px] overflow-hidden rounded-[28px] border border-white/12 bg-black sm:min-h-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
								mode: "wait",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.img, {
									src: cur.img,
									alt: cur.name,
									initial: {
										opacity: 0,
										scale: 1.03
									},
									animate: {
										opacity: 1,
										scale: 1
									},
									exit: { opacity: 0 },
									transition: {
										duration: .7,
										ease: [
											.22,
											1,
											.36,
											1
										]
									},
									className: "h-[340px] w-full object-cover sm:h-[440px] lg:h-[520px]"
								}, cur.img)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
								mode: "wait",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
									initial: {
										opacity: 0,
										y: 20
									},
									animate: {
										opacity: 1,
										y: 0
									},
									exit: {
										opacity: 0,
										y: -10
									},
									transition: {
										duration: .5,
										delay: .15
									},
									className: "absolute bottom-4 left-4 w-[calc(100%-2rem)] rounded-[18px] border border-white/15 bg-black/60 p-4 backdrop-blur-xl sm:bottom-6 sm:left-6 sm:w-[min(400px,80%)] sm:p-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-[22px] font-light text-white",
											children: cur.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1.5 text-[10px] font-medium uppercase tracking-[0.25em] text-white/55",
											children: cur.role
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-3 h-px w-full bg-white/15" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 text-[12.5px] font-light leading-relaxed text-white/70",
											children: cur.desc
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-4 flex items-center gap-1",
											children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 fill-[#e8b71d] text-[#e8b71d]" }, i))
										})
									]
								}, cur.name)
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-row gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible",
						children: speakers.map((sp, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
							onMouseEnter: () => setActive(i),
							onClick: () => setActive(i),
							whileHover: { x: -4 },
							className: `group flex shrink-0 items-center gap-3 rounded-2xl border p-2 pr-4 backdrop-blur-md transition-all ${active === i ? "border-white/30 bg-white/[0.05] shadow-[0_0_30px_-10px_rgba(0,102,255,0.5)]" : "border-white/10 bg-white/[0.02] hover:border-white/20"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: sp.thumb,
								alt: sp.name,
								loading: "lazy",
								className: "h-12 w-12 rounded-xl object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-[12px] font-light leading-tight text-white",
									children: sp.name.split(" ")[0]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-[12px] font-light leading-tight text-white/60",
									children: sp.name.split(" ").slice(1).join(" ")
								})]
							})]
						}, sp.name))
					})]
				})]
			})
		]
	});
}
var detectiveHeroVideo = S3_MEDIA.heroVideo;
S3_MEDIA.cases.caseVoicemail;
var evidenceRoom = S3_MEDIA.evidenceRoom;
var noirStreet = S3_MEDIA.noirStreet;
var mysteries = [
	{
		id: 1,
		label: "Mystery 01 — Room Key Code",
		q: "What room number is engraved on the brass hotel key resting beside the evidence dossier?",
		hint: "Look closely at the brass key tag on the desk next to the open police dossier. Format: 104",
		answers: [
			"104",
			"room 104",
			"room104",
			"#104",
			"104.",
			"one hundred four",
			"one zero four"
		],
		clue: "Room identifier — Stamped on brass hotel tag"
	},
	{
		id: 2,
		label: "Mystery 02 — Audio Evidence Device",
		q: "What audio recording device is connected to the telephone on the detective's desk?",
		hint: "The analog cassette machine sitting near the lamp that recorded the final voicemail. (e.g. Tape Recorder / Cassette Player)",
		answers: [
			"tape recorder",
			"cassette recorder",
			"recorder",
			"audio recorder",
			"cassette player",
			"voice recorder",
			"cassette",
			"tape",
			"voicemail recorder",
			"cassette tape recorder"
		],
		clue: "Analog equipment — Capturing the last incoming transmission"
	},
	{
		id: 3,
		label: "Mystery 03 — Temporal Connection",
		q: "What exact time appears repeatedly in the scene and connects the notebook, wall note, clock, and sticky note?",
		hint: "Inspect the clock hands, the timestamp on the open notebook, the wall note, and the sticky note by the desk lamp. Format: 09:17",
		answers: [
			"09:17",
			"9:17",
			"09:17 am",
			"09:17 pm",
			"9:17 am",
			"9:17 pm",
			"09:17am",
			"09:17pm",
			"9:17am",
			"9:17pm",
			"09.17",
			"9.17",
			"09:17⏱️",
			"09:17 ⏱️",
			"9:17 ⏱️",
			"9:17⏱️",
			"0917",
			"917",
			"nine seventeen",
			"9 seventeen"
		],
		clue: "Recurring timestamp — Clock, notebook, wall note, and sticky note"
	}
];
function SpotlightBox() {
	const containerRef = (0, import_react.useRef)(null);
	const [coords, setCoords] = (0, import_react.useState)({
		x: 50,
		y: 50
	});
	const handleMouseMove = (e) => {
		if (!containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width * 100;
		const y = (e.clientY - rect.top) / rect.height * 100;
		setCoords({
			x,
			y
		});
	};
	const handleMouseLeave = () => {
		setCoords({
			x: 50,
			y: 50
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: containerRef,
		id: "spotlight-container",
		className: "relative grid min-h-[460px] place-items-center overflow-hidden rounded-[24px] border border-white/10 bg-[#0a0a0a] px-6 text-center",
		style: {
			backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
			backgroundSize: "40px 40px",
			cursor: "crosshair"
		},
		onMouseMove: handleMouseMove,
		onMouseLeave: handleMouseLeave,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			id: "spotlight-overlay",
			className: "pointer-events-none absolute inset-0 z-10",
			style: { background: `radial-gradient(220px at ${coords.x}% ${coords.y}%, transparent 0%, rgba(10, 10, 10, 0.97) 100%)` }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-0 max-w-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-widest text-muted-foreground",
					children: "// move the light"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mt-5 text-4xl font-bold text-white sm:text-5xl",
					style: { fontFamily: "'Oswald', sans-serif" },
					children: ["Detective Zone isn't just a game.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-blood mt-2",
						style: { textShadow: "0 0 20px rgba(211,47,47,0.3)" },
						children: "It's an investigation."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 font-mono text-sm tracking-[0.3em] text-gray-400",
					children: "OBSERVE ┬╖ DEDUCE ┬╖ SOLVE"
				})
			]
		})]
	});
}
function FloatingParticles({ count = 18 }) {
	const particles = (0, import_react.useMemo)(() => Array.from({ length: count }, (_, i) => ({
		id: i,
		x: Math.random() * 100,
		y: Math.random() * 100,
		size: 1 + Math.random() * 2.5,
		dur: 6 + Math.random() * 10,
		delay: Math.random() * 8,
		opacity: .15 + Math.random() * .3
	})), [count]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-0 overflow-hidden",
		"aria-hidden": true,
		children: particles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
			position: "absolute",
			left: `${p.x}%`,
			top: `${p.y}%`,
			width: p.size,
			height: p.size,
			borderRadius: "50%",
			background: `rgba(211,47,47,${p.opacity})`,
			animation: `dz-ch-float ${p.dur}s ${p.delay}s ease-in-out infinite alternate`
		} }, p.id))
	});
}
function ChScanLine() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"aria-hidden": true,
		className: "pointer-events-none absolute inset-0 z-10 rounded-[inherit]",
		style: { background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)" }
	});
}
function ChallengeCard({ mystery, value, solved, onChange, onSubmit }) {
	const [hintOpen, setHintOpen] = (0, import_react.useState)(false);
	const [shaking, setShaking] = (0, import_react.useState)(false);
	const [focused, setFocused] = (0, import_react.useState)(false);
	const wrong = solved === false;
	const handleSubmit = () => {
		if (!value.trim()) return;
		onSubmit(value);
		if (!mystery.answers.includes(value.trim().toLowerCase())) {
			setShaking(true);
			setTimeout(() => setShaking(false), 600);
		}
	};
	const borderColor = solved ? "rgba(211,47,47,0.7)" : wrong ? "rgba(255,80,80,0.5)" : focused ? "rgba(211,47,47,0.35)" : "rgba(255,255,255,0.07)";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative flex flex-col overflow-hidden",
		style: {
			background: "linear-gradient(145deg, #111111 0%, #0d0d0d 100%)",
			border: `1px solid ${borderColor}`,
			borderRadius: 20,
			padding: "28px 28px 24px",
			minHeight: 290,
			transition: "border-color 0.4s ease, box-shadow 0.4s ease",
			boxShadow: solved ? "0 0 30px rgba(211,47,47,0.18), 0 8px 40px rgba(0,0,0,0.6)" : "0 8px 40px rgba(0,0,0,0.5)",
			animation: shaking ? "dz-ch-shake 0.5s ease" : void 0
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FingerprintPattern, {
				"aria-hidden": true,
				style: {
					position: "absolute",
					right: 12,
					bottom: 12,
					width: 90,
					height: 90,
					color: "rgba(211,47,47,0.05)",
					pointerEvents: "none"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingParticles, { count: 4 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChScanLine, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "relative",
					zIndex: 11,
					display: "flex",
					alignItems: "start",
					justifyContent: "space-between"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					style: {
						fontFamily: "IBM Plex Mono, monospace",
						fontSize: 10,
						letterSpacing: "0.22em",
						color: "#D32F2F",
						textTransform: "uppercase"
					},
					children: mystery.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1",
					style: {
						display: "inline-flex",
						alignItems: "center",
						gap: 6,
						background: "rgba(255,255,255,0.04)",
						border: "1px solid rgba(255,255,255,0.06)",
						borderRadius: 6,
						padding: "3px 9px"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: {
							fontFamily: "IBM Plex Mono, monospace",
							fontSize: 9,
							letterSpacing: "0.18em",
							color: "#666",
							textTransform: "uppercase"
						},
						children: "Classified Clue"
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						width: 32,
						height: 32,
						borderRadius: "50%",
						border: `1px solid ${solved ? "rgba(211,47,47,0.5)" : "rgba(255,255,255,0.08)"}`,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						background: solved ? "rgba(211,47,47,0.1)" : "rgba(255,255,255,0.02)",
						transition: "all 0.4s ease"
					},
					children: solved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { style: {
						width: 14,
						height: 14,
						color: "#D32F2F"
					} }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { style: {
						width: 14,
						height: 14,
						color: "#555"
					} })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "relative",
					zIndex: 11,
					marginTop: 16,
					fontFamily: "IBM Plex Mono, monospace",
					fontSize: 9,
					letterSpacing: "0.15em",
					color: "#444",
					textTransform: "uppercase"
				},
				children: ["Γùê ", mystery.clue]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				style: {
					position: "relative",
					zIndex: 11,
					marginTop: 14,
					fontFamily: "IBM Plex Mono, monospace",
					fontSize: 14,
					color: "#ECECEC",
					lineHeight: 1.65
				},
				children: mystery.q
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "relative",
					zIndex: 11,
					marginTop: "auto",
					paddingTop: 20
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						style: {
							display: "block",
							fontFamily: "IBM Plex Mono, monospace",
							fontSize: 9,
							letterSpacing: "0.2em",
							color: "#555",
							textTransform: "uppercase",
							marginBottom: 7
						},
						children: "Enter your code"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: { position: "relative" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value,
							onChange: (e) => onChange(e.target.value),
							onFocus: () => setFocused(true),
							onBlur: () => {
								setFocused(false);
								if (value.trim()) handleSubmit();
							},
							onKeyDown: (e) => e.key === "Enter" && handleSubmit(),
							placeholder: "TYPE YOUR ANSWER...",
							style: {
								width: "100%",
								height: 50,
								background: "rgba(255,255,255,0.03)",
								border: `1px solid ${borderColor}`,
								borderRadius: 10,
								padding: "0 44px 0 14px",
								fontFamily: "IBM Plex Mono, monospace",
								fontSize: 11,
								letterSpacing: "0.16em",
								textTransform: "uppercase",
								color: solved ? "#D32F2F" : wrong ? "#ff6060" : "#ECECEC",
								outline: "none",
								transition: "border-color 0.3s ease, box-shadow 0.3s ease",
								boxShadow: focused ? "0 0 0 3px rgba(211,47,47,0.08), inset 0 2px 8px rgba(0,0,0,0.3)" : "none"
							}
						}), !solved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleSubmit,
							style: {
								position: "absolute",
								right: 10,
								top: "50%",
								transform: "translateY(-50%)",
								width: 28,
								height: 28,
								borderRadius: "50%",
								background: value.trim() ? "rgba(211,47,47,0.15)" : "rgba(255,255,255,0.04)",
								border: "1px solid rgba(211,47,47,0.2)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								cursor: "pointer",
								transition: "all 0.2s ease"
							},
							"aria-label": "Submit answer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { style: {
								width: 11,
								height: 11,
								color: "#D32F2F"
							} })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: {
								fontFamily: "IBM Plex Mono, monospace",
								fontSize: 10,
								color: solved ? "#D32F2F" : wrong ? "#ff6060" : "#555",
								fontStyle: "italic",
								lineHeight: 1.5,
								flex: 1
							},
							children: solved ? "Γ£ô Verified. Clue logged to archive." : wrong ? "Γ£ù Access denied. Try again." : hintOpen ? `Hint: ${mystery.hint}` : "Answer above to verify the clue."
						}), !solved && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setHintOpen((v) => !v),
							style: {
								flexShrink: 0,
								display: "flex",
								alignItems: "center",
								gap: 4,
								fontFamily: "IBM Plex Mono, monospace",
								fontSize: 9,
								letterSpacing: "0.14em",
								textTransform: "uppercase",
								color: hintOpen ? "#D32F2F" : "#444",
								background: "none",
								border: "none",
								cursor: "pointer",
								padding: 0,
								transition: "color 0.2s ease"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { style: {
								width: 10,
								height: 10
							} }), hintOpen ? "Hide" : "Hint"]
						})]
					})
				]
			}),
			solved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				style: {
					position: "absolute",
					inset: 0,
					borderRadius: 20,
					background: "radial-gradient(ellipse at 50% 80%, rgba(211,47,47,0.08) 0%, transparent 70%)",
					pointerEvents: "none"
				}
			})
		]
	});
}
function Home() {
	const { enabled } = useRain();
	const [offset, setOffset] = (0, import_react.useState)(0);
	const heroRef = (0, import_react.useRef)(null);
	const videoRef = (0, import_react.useRef)(null);
	const [challengeValues, setChallengeValues] = (0, import_react.useState)({});
	const [challengeSolved, setChallengeSolved] = (0, import_react.useState)({});
	const [successBurst, setSuccessBurst] = (0, import_react.useState)(false);
	const [breathe, setBreathe] = (0, import_react.useState)(false);
	const [imageModalOpen, setImageModalOpen] = (0, import_react.useState)(false);
	const [zoomLevel, setZoomLevel] = (0, import_react.useState)(1);
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") setImageModalOpen(false);
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);
	const solvedCount = (0, import_react.useMemo)(() => Object.values(challengeSolved).filter(Boolean).length, [challengeSolved]);
	const challengeUnlocked = solvedCount === mysteries.length;
	const checkMystery = (0, import_react.useCallback)((id, val) => {
		const ok = mysteries.find((x) => x.id === id).answers.includes(val.trim().toLowerCase());
		setChallengeSolved((s) => {
			const next = {
				...s,
				[id]: ok
			};
			const nextCount = Object.values(next).filter(Boolean).length;
			if (ok && nextCount === mysteries.length) setTimeout(() => setSuccessBurst(true), 300);
			return next;
		});
	}, []);
	const [cmsSettings, setCmsSettings] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		api.getSettings().then((s) => {
			if (s) setCmsSettings(s);
		}).catch(() => {});
	}, []);
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => setBreathe((v) => !v), 4e3);
		return () => clearInterval(t);
	}, []);
	(0, import_react.useEffect)(() => {
		const video = videoRef.current;
		if (!video) return;
		let targetProgress = .5;
		let currentProgress = .5;
		let settled = true;
		let didFirstMove = false;
		const onReady = () => {
			const d = video.duration;
			if (!Number.isFinite(d) || d <= 0) return;
			try {
				video.currentTime = d * .5;
			} catch {}
		};
		if (video.readyState >= 1) onReady();
		video.addEventListener("loadedmetadata", onReady);
		const onMove = (e) => {
			if (!didFirstMove) {
				didFirstMove = true;
				try {
					video.pause();
				} catch {}
			}
			targetProgress = Math.max(0, Math.min(1, 1 - e.clientX / window.innerWidth));
			settled = false;
		};
		const onTouch = (e) => {
			if (e.touches?.[0]) {
				if (!didFirstMove) {
					didFirstMove = true;
					try {
						video.pause();
					} catch {}
				}
				targetProgress = Math.max(0, Math.min(1, 1 - e.touches[0].clientX / window.innerWidth));
				settled = false;
			}
		};
		let raf = 0;
		const LERP = .1;
		const DEAD_ZONE = .002;
		const loop = () => {
			raf = requestAnimationFrame(loop);
			if (settled) return;
			const d = video.duration;
			if (!Number.isFinite(d) || d <= 0) return;
			const diff = targetProgress - currentProgress;
			if (Math.abs(diff) < DEAD_ZONE) {
				currentProgress = targetProgress;
				const sec = Math.max(0, Math.min(d - .01, currentProgress * d));
				try {
					video.currentTime = sec;
				} catch {}
				settled = true;
				return;
			}
			currentProgress += diff * LERP;
			const sec = Math.max(0, Math.min(d - .01, currentProgress * d));
			try {
				video.currentTime = sec;
			} catch {}
		};
		raf = requestAnimationFrame(loop);
		window.addEventListener("pointermove", onMove, { passive: true });
		window.addEventListener("mousemove", onMove, { passive: true });
		window.addEventListener("touchmove", onTouch, { passive: true });
		window.addEventListener("touchstart", onTouch, { passive: true });
		return () => {
			cancelAnimationFrame(raf);
			video.removeEventListener("loadedmetadata", onReady);
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("touchmove", onTouch);
			window.removeEventListener("touchstart", onTouch);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const onScroll = () => setOffset(window.scrollY);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			id: "home",
			ref: heroRef,
			className: "relative h-screen w-full overflow-hidden bg-black text-neutral-100 select-none",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					ref: videoRef,
					src: cmsSettings.hero_video_url || detectiveHeroVideo,
					muted: true,
					playsInline: true,
					autoPlay: true,
					loop: true,
					preload: "auto",
					className: "absolute inset-0 m-auto h-full w-full object-contain pointer-events-none scale-[1.02] lg:scale-[1.03] translate-x-[6%] lg:translate-x-[10%] translate-y-[4%] lg:translate-y-[5.5%]"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RainCanvas, { enabled }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "rain-layer pointer-events-none absolute -inset-y-1/2 -inset-x-1/4 opacity-40" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "rain-layer-slow pointer-events-none absolute -inset-y-1/2 -inset-x-1/4 opacity-30" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "film-grain pointer-events-none absolute inset-0 opacity-20" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-0",
					style: { background: "radial-gradient(60% 55% at 50% 50%, rgba(179,18,23,0.12), transparent 70%), linear-gradient(90deg, #050505 18%, rgba(5,5,5,0.65) 45%, rgba(5,5,5,0.2) 70%, #050505 95%), linear-gradient(0deg, #050505 6%, transparent 40%)" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-0 mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-12 flex items-center justify-between pt-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-auto w-[50%] max-w-[540px] rise",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-10 bg-blood" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FingerprintPattern, { className: "h-5 w-5 text-blood" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[9px] tracking-[0.35em] text-blood uppercase font-medium",
										children: "Noir / 01"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-6 font-display font-bold tracking-[-0.02em] uppercase",
								style: {
									fontSize: "clamp(52px, 5.8vw, 84px)",
									lineHeight: .9
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-foreground",
									children: "Detectives"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-blood",
									children: "Zone"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-5 block h-[3px] w-[54px] bg-blood" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/cases",
								onPointerDown: (e) => e.stopPropagation(),
								className: "group relative mt-8 flex items-center justify-center gap-2.5 overflow-hidden bg-blood font-display text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.03]",
								style: {
									width: 196,
									height: 46
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 origin-left scale-x-0 bg-foreground/10 transition-transform duration-500 group-hover:scale-x-100" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FingerprintPattern, { className: "relative h-3.5 w-3.5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "relative",
										children: "Explore Cases"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "relative h-3.5 w-3.5 -translate-x-1.5 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" })
								]
							})
						]
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none relative z-10 w-full h-16 sm:h-24 -mt-1",
			style: { background: "linear-gradient(180deg, #000000 0%, #040404 60%, transparent 100%)" }
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollReveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "shell mt-30",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("style", { children: [`
            @keyframes dz-ch-float {
              0%   { transform: translateY(0)  scale(1);   opacity: .15; }
              100% { transform: translateY(-18px) scale(1.5); opacity: .05; }
            }
            @keyframes dz-ch-shake {
              0%,100%{transform:translateX(0)}
              15%{transform:translateX(-8px)}
              30%{transform:translateX(8px)}
              45%{transform:translateX(-6px)}
              60%{transform:translateX(6px)}
              75%{transform:translateX(-3px)}
              90%{transform:translateX(3px)}
            }
            @keyframes dz-ch-pulse-border {
              0%,100%{box-shadow:0 0 0 0 rgba(211,47,47,0.4)}
              50%{box-shadow:0 0 0 10px rgba(211,47,47,0)}
            }
            @keyframes dz-ch-stamp-drop {
              0%{transform:scale(2.5) rotate(-12deg);opacity:0}
              60%{transform:scale(0.92) rotate(3deg);opacity:1}
              100%{transform:scale(1) rotate(0deg);opacity:1}
            }
          `, "          "] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "caption text-blood",
					style: { marginBottom: 28 },
					children: "File 002 — About"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-6 pt-2 pb-10",
					children: [
						{
							id: "DZ-001",
							step: "01",
							title: "Observe",
							quote: "Examine every scene, every detail. Nothing escapes the trained eye.",
							by: "Field Protocol"
						},
						{
							id: "DZ-002",
							step: "02",
							title: "Deduce",
							quote: "Find patterns others choose to ignore. Logic is your only weapon.",
							by: "Investigation Manual"
						},
						{
							id: "DZ-003",
							step: "03",
							title: "Solve",
							quote: "Uncover the truth. Close the file. Justice is the final clue.",
							by: "Resolution Brief"
						}
					].map((card, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
						className: "group relative flex flex-col overflow-hidden",
						style: {
							background: "#0a0a0a",
							border: "1px solid rgba(255,255,255,0.08)",
							padding: "32px 28px 28px",
							boxShadow: "rgba(0,0,0,0.9) 0px 24px 60px -20px",
							transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease",
							marginTop: i === 1 ? 16 : 0,
							cursor: "default"
						},
						onMouseEnter: (e) => {
							e.currentTarget.style.transform = `translateY(-10px) rotate(${i === 0 ? -1.2 : i === 2 ? 1.2 : 0}deg)`;
							e.currentTarget.style.boxShadow = "rgba(0,0,0,0.95) 0px 40px 80px -20px, 0 0 0 1px rgba(211,47,47,0.2)";
						},
						onMouseLeave: (e) => {
							e.currentTarget.style.transform = "none";
							e.currentTarget.style.boxShadow = "rgba(0,0,0,0.9) 0px 24px 60px -20px";
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
								viewBox: "0 0 24 70",
								className: "absolute -top-5 left-8 h-12 w-4 rotate-3 text-white/30",
								"aria-hidden": true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: "M12 66V14a7 7 0 0 1 14 0v44a12 12 0 0 1-24 0V16",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2.5",
									strokeLinecap: "round",
									transform: "translate(-2 0)"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								style: {
									fontFamily: "IBM Plex Mono, monospace",
									fontSize: 10,
									letterSpacing: "0.28em",
									color: "rgba(255,255,255,0.45)",
									textTransform: "uppercase",
									display: "block",
									marginBottom: 14
								},
								children: ["Case ", card.id]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									alignItems: "baseline",
									gap: 10,
									marginBottom: 16
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: {
										fontFamily: "IBM Plex Mono, monospace",
										fontSize: 11,
										color: "#D32F2F",
										letterSpacing: "0.2em"
									},
									children: card.step
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									style: {
										fontFamily: "'Oswald', sans-serif",
										fontSize: 26,
										letterSpacing: "0.06em",
										textTransform: "uppercase",
										color: "#ECECEC",
										lineHeight: 1
									},
									children: card.title
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								viewBox: "0 0 24 24",
								style: {
									width: 22,
									height: 22,
									color: "#D32F2F",
									fill: "rgba(211,47,47,0.18)",
									marginBottom: 14,
									flexShrink: 0
								},
								stroke: "currentColor",
								strokeWidth: "2",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								style: {
									flex: 1,
									fontFamily: "Inter, system-ui, sans-serif",
									fontSize: 13,
									lineHeight: 1.7,
									color: "rgba(255,255,255,0.72)"
								},
								children: card.quote
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									marginTop: 24,
									display: "flex",
									alignItems: "flex-end",
									justifyContent: "space-between"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: {
										fontFamily: "IBM Plex Mono, monospace",
										fontSize: 9,
										letterSpacing: "0.28em",
										color: "rgba(255,255,255,0.4)",
										textTransform: "uppercase"
									},
									children: card.by
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "opacity-0 group-hover:opacity-100 transition-opacity duration-500",
									style: {
										fontFamily: "IBM Plex Mono, monospace",
										fontSize: 9,
										letterSpacing: "0.18em",
										textTransform: "uppercase",
										border: "1px solid rgba(211,47,47,0.5)",
										padding: "2px 8px",
										transform: "rotate(-12deg)",
										color: "#D32F2F",
										display: "inline-block"
									},
									children: "Verified"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pointer-events-none absolute -bottom-8 -right-6 h-24 w-24 rounded-full border-4",
								style: { borderColor: "rgba(139,90,30,0.25)" }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay",
								style: { background: "url('https://grainy-gradients.vercel.app/noise.svg')" }
							})
						]
					}, card.id))
				})
			]
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollReveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			id: "about",
			className: "shell mt-32 scroll-mt-[64px]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-12 items-center gap-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-span-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "caption text-blood",
							children: "File 002 — About"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-6 font-display text-[46px] leading-[0.95] font-bold uppercase",
							children: cmsSettings.about_heading || /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								"Every shadow",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"has a story"
							] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-6 block h-[3px] w-[60px] bg-blood" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 max-w-md text-[14px] leading-relaxed text-muted-foreground",
							children: cmsSettings.about_text || "Detective Zone is a story-driven investigation experience. Each case is written like a dossier — statements, photographs, timelines — and nothing is handed to you. You read the room, you weigh the lies, you close the file."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "#challenge",
							onClick: (e) => {
								e.preventDefault();
								document.getElementById("challenge")?.scrollIntoView({ behavior: "smooth" });
							},
							className: "group mt-9 inline-flex items-center gap-3 border border-border px-7 font-display text-[12px] tracking-[0.22em] uppercase transition-colors duration-500 hover:border-blood",
							style: { height: 54 },
							children: ["Open the briefing", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-span-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: cmsSettings.about_image || noirStreet,
						alt: "Rain-soaked noir street at night",
						loading: "lazy",
						className: "h-[420px] w-full rounded-[12px] object-cover grayscale"
					})
				})]
			})
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatIsDetectiveZone, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Speakers, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollReveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			id: "challenge",
			className: "shell mt-32 scroll-mt-[64px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: 12,
						marginBottom: 20
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
							display: "inline-block",
							width: 8,
							height: 8,
							borderRadius: "50%",
							background: "#D32F2F",
							boxShadow: "0 0 12px #D32F2F"
						} }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: {
								fontFamily: "IBM Plex Mono, monospace",
								fontSize: 10,
								letterSpacing: "0.28em",
								color: "rgba(255,255,255,0.5)",
								textTransform: "uppercase"
							},
							children: "// Challenge"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "hairline flex-1" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: {
								fontFamily: "IBM Plex Mono, monospace",
								fontSize: 10,
								color: "#D32F2F",
								letterSpacing: "0.18em"
							},
							children: "003"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: () => setImageModalOpen(true),
					className: "group cursor-pointer",
					style: {
						borderRadius: 16,
						overflow: "hidden",
						border: "1px solid rgba(255,255,255,0.06)",
						position: "relative",
						marginBottom: 20
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: cmsSettings.challenge_image || evidenceRoom,
							alt: "Hotel room evidence scene — Room 104",
							loading: "lazy",
							style: {
								width: "100%",
								height: 400,
								objectFit: "cover",
								display: "block",
								transition: "transform 4s ease-in-out",
								transform: breathe ? "scale(1.04)" : "scale(1.0)"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							"aria-hidden": true,
							style: {
								position: "absolute",
								inset: 0,
								background: "linear-gradient(to top, rgba(9,9,9,0.5) 0%, transparent 50%), linear-gradient(to right, rgba(9,9,9,0.2) 0%, transparent 35%)",
								pointerEvents: "none"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							"aria-hidden": true,
							style: {
								position: "absolute",
								inset: 0,
								background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 4px)",
								pointerEvents: "none"
							}
						}),
						[
							{
								top: 14,
								left: 14
							},
							{
								top: 14,
								right: 14
							},
							{
								bottom: 14,
								left: 14
							},
							{
								bottom: 14,
								right: 14
							}
						].map((pos, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							"aria-hidden": true,
							style: {
								position: "absolute",
								...pos,
								width: 16,
								height: 16,
								borderTop: i < 2 ? "2px solid rgba(211,47,47,0.4)" : void 0,
								borderBottom: i >= 2 ? "2px solid rgba(211,47,47,0.4)" : void 0,
								borderLeft: i % 2 === 0 ? "2px solid rgba(211,47,47,0.4)" : void 0,
								borderRight: i % 2 === 1 ? "2px solid rgba(211,47,47,0.4)" : void 0,
								pointerEvents: "none"
							}
						}, i)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/80 backdrop-blur-md border border-[#C81D24]/50 rounded-lg px-3 py-1.5 font-mono text-[10px] text-white uppercase tracking-wider group-hover:scale-105 transition-all shadow-[0_0_15px_rgba(200,29,36,0.3)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "w-3.5 h-3.5 text-[#C81D24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Click to Enlarge Evidence" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								position: "absolute",
								bottom: 18,
								left: 20,
								fontFamily: "IBM Plex Mono, monospace",
								fontSize: 9,
								letterSpacing: "0.2em",
								color: "rgba(255,255,255,0.3)",
								textTransform: "uppercase",
								pointerEvents: "none"
							},
							children: "Evidence Photograph — Room 104 — 11:47 PM · Clue Time: 09:17 ⏱️"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						display: "grid",
						gridTemplateColumns: "repeat(3, 1fr)",
						gap: 18,
						marginBottom: 18
					},
					children: mysteries.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChallengeCard, {
						mystery: m,
						value: challengeValues[m.id] ?? "",
						solved: challengeSolved[m.id],
						onChange: (v) => setChallengeValues((prev) => ({
							...prev,
							[m.id]: v
						})),
						onSubmit: (v) => checkMystery(m.id, v)
					}, m.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						background: "linear-gradient(145deg,#0f0f0f 0%,#0a0a0a 100%)",
						border: `1px solid ${challengeUnlocked ? "rgba(211,47,47,0.4)" : "rgba(255,255,255,0.06)"}`,
						borderRadius: 16,
						padding: "24px 28px",
						position: "relative",
						overflow: "hidden",
						transition: "border-color 0.6s ease, box-shadow 0.6s ease",
						boxShadow: challengeUnlocked ? "0 0 60px rgba(211,47,47,0.12)" : "none"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChScanLine, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							"aria-hidden": true,
							style: {
								position: "absolute",
								inset: 0,
								left: 0,
								background: "rgba(211,47,47,0.04)",
								width: `${solvedCount / mysteries.length * 100}%`,
								transition: "width 1s cubic-bezier(0.34,1.56,0.64,1)",
								pointerEvents: "none"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							"aria-hidden": true,
							style: {
								position: "absolute",
								bottom: 0,
								left: 0,
								height: 2,
								background: "linear-gradient(90deg,#D32F2F,rgba(211,47,47,0.2))",
								width: `${solvedCount / mysteries.length * 100}%`,
								transition: "width 1s cubic-bezier(0.34,1.56,0.64,1)",
								boxShadow: "0 0 12px rgba(211,47,47,0.6)",
								pointerEvents: "none"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								position: "relative",
								zIndex: 11,
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								flexWrap: "wrap",
								gap: 20
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									alignItems: "center",
									gap: 16
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										width: 40,
										height: 40,
										borderRadius: "50%",
										border: "1px solid rgba(211,47,47,0.3)",
										background: "rgba(211,47,47,0.08)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										animation: challengeUnlocked ? "none" : "dz-ch-pulse-border 2s ease-in-out infinite"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FingerprintPattern, { style: {
										width: 18,
										height: 18,
										color: "#D32F2F"
									} })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [challengeUnlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									style: {
										fontFamily: "'Oswald', sans-serif",
										fontSize: 20,
										letterSpacing: "0.2em",
										color: "#ECECEC",
										textTransform: "uppercase"
									},
									children: "Access Granted ΓÇö 25% Off Unlocked"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									style: {
										fontFamily: "IBM Plex Mono, monospace",
										fontSize: 10,
										letterSpacing: "0.2em",
										color: "#666",
										textTransform: "uppercase"
									},
									children: [
										"Complete all three mysteries ΓÇö ",
										solvedCount,
										"/",
										mysteries.length,
										" verified"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: 5,
										marginTop: 7
									},
									children: mysteries.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
										width: 52,
										height: 3,
										borderRadius: 2,
										background: challengeSolved[m.id] ? "#D32F2F" : challengeSolved[m.id] === false ? "rgba(255,80,80,0.28)" : "rgba(255,255,255,0.07)",
										transition: "background 0.5s ease",
										boxShadow: challengeSolved[m.id] ? "0 0 8px rgba(211,47,47,0.5)" : "none"
									} }, m.id))
								})] })]
							}), challengeUnlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									alignItems: "center",
									gap: 14
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: {
										fontFamily: "'Oswald', sans-serif",
										fontSize: 16,
										letterSpacing: "0.22em",
										color: "#D32F2F",
										border: "2px solid #D32F2F",
										padding: "5px 16px",
										transform: "rotate(-3deg)",
										textShadow: "0 0 18px rgba(211,47,47,0.5)",
										animation: successBurst ? "dz-ch-stamp-drop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards" : "none"
									},
									children: "Case Solved"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: 6
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { style: {
										width: 16,
										height: 16,
										color: "#D32F2F"
									} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											fontFamily: "IBM Plex Mono, monospace",
											fontSize: 9,
											letterSpacing: "0.14em",
											color: "#D32F2F",
											textTransform: "uppercase"
										},
										children: "CODE: DZ25-SOLVED"
									})]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => mysteries.forEach((m) => {
									if (challengeValues[m.id]?.trim()) checkMystery(m.id, challengeValues[m.id]);
								}),
								style: {
									display: "flex",
									alignItems: "center",
									gap: 8,
									background: "rgba(211,47,47,0.1)",
									border: "1px solid rgba(211,47,47,0.28)",
									borderRadius: 10,
									padding: "12px 24px",
									fontFamily: "'Oswald', sans-serif",
									fontSize: 14,
									letterSpacing: "0.2em",
									color: "#D32F2F",
									textTransform: "uppercase",
									cursor: "pointer",
									transition: "all 0.3s ease"
								},
								onMouseEnter: (e) => {
									e.currentTarget.style.background = "rgba(211,47,47,0.18)";
									e.currentTarget.style.boxShadow = "0 0 28px rgba(211,47,47,0.18)";
								},
								onMouseLeave: (e) => {
									e.currentTarget.style.background = "rgba(211,47,47,0.1)";
									e.currentTarget.style.boxShadow = "none";
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { style: {
									width: 14,
									height: 14
								} }), " Verify Evidence"]
							})]
						}),
						Object.values(challengeSolved).some((v) => v === false) && !challengeUnlocked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								position: "relative",
								zIndex: 11,
								marginTop: 14,
								display: "flex",
								alignItems: "center",
								gap: 7,
								fontFamily: "IBM Plex Mono, monospace",
								fontSize: 9,
								letterSpacing: "0.14em",
								color: "#ff6060",
								textTransform: "uppercase"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { style: {
								width: 11,
								height: 11
							} }), " Some answers are incorrect. Re-examine the evidence."]
						})
					]
				})
			]
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollReveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			id: "contact",
			className: "shell mt-32 mb-32 scroll-mt-[64px]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotlightBox, {})
		}) }),
		imageModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6",
			style: {
				background: "rgba(0,0,0,0.92)",
				backdropFilter: "blur(14px)"
			},
			onClick: () => setImageModalOpen(false),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full max-w-[1280px] max-h-[95vh] flex flex-col rounded-2xl overflow-hidden border border-[#C81D24]/40 shadow-[0_0_50px_rgba(200,29,36,0.25)] bg-[#0A0A0A]",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block w-2.5 h-2.5 rounded-full bg-[#C81D24] animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-[20px] text-white tracking-widest uppercase",
								style: { fontFamily: "Bebas Neue, sans-serif" },
								children: "Crime Scene Evidence // Room 104"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[10px] text-[#888] tracking-widest uppercase",
								children: "Inspect Clock, Notebook, Wall Notes & Sticky Notes · Clue Marker: 09:17 ⏱️"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setZoomLevel((z) => Math.min(z + .25, 2.5)),
										title: "Zoom In",
										className: "p-1.5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { className: "w-4 h-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-[10px] px-2 text-white/60",
										children: [Math.round(zoomLevel * 100), "%"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setZoomLevel((z) => Math.max(z - .25, .75)),
										title: "Zoom Out",
										className: "p-1.5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomOut, { className: "w-4 h-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setZoomLevel(1),
										title: "Reset Zoom",
										className: "p-1.5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-3.5 h-3.5" })
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setImageModalOpen(false),
								className: "flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-red-950/60 hover:border-red-500/50 transition-all cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative flex-1 overflow-auto flex items-center justify-center p-4 sm:p-8 bg-black/95 max-h-[78vh]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								transform: `scale(${zoomLevel})`,
								transformOrigin: "center center",
								transition: "transform 0.2s ease-out"
							},
							className: "max-w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: cmsSettings.challenge_image || evidenceRoom,
								alt: "High Resolution Crime Scene Room 104",
								className: "max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl border border-white/10"
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between px-6 py-3 border-t border-white/10 bg-black/80 font-mono text-[10px] text-[#A0A0A0]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5 text-[#C81D24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Forensic Temporal Marker: Look for repeating time ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "09:17" }),
								" across notes and clock"
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[#666]",
							children: "Press ESC or click outside to exit"
						})]
					})
				]
			})
		})
	] });
}
//#endregion
export { Home as component };
