import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { Bt as Brain, E as ScrollText, N as Puzzle, St as Crosshair, ft as FolderClosed, mt as FingerprintPattern, o as UserSearch, w as Search } from "../_libs/lucide-react.mjs";
import { c as api, i as S3_MEDIA } from "./router-CBHk_fdB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-u98dpetu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Mouse-follow flashlight + rain overlay. Purely decorative. */
function Atmosphere() {
	const [pos, setPos] = (0, import_react.useState)({
		x: .5,
		y: .3
	});
	(0, import_react.useEffect)(() => {
		const onMove = (e) => {
			setPos({
				x: e.clientX / window.innerWidth,
				y: e.clientY / window.innerHeight
			});
		};
		window.addEventListener("pointermove", onMove);
		return () => window.removeEventListener("pointermove", onMove);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none fixed inset-0 z-40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 transition-[background] duration-300",
			style: { background: `radial-gradient(420px circle at ${pos.x * 100}% ${pos.y * 100}%, color-mix(in oklab, var(--foreground) 9%, transparent), transparent 70%)` }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0",
			style: { background: "radial-gradient(120% 80% at 50% 0%, transparent 40%, rgb(0 0 0 / 0.75) 100%)" }
		})]
	});
}
function Reveal({ children, delay = 0, className = "" }) {
	const ref = (0, import_react.useRef)(null);
	const [shown, setShown] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const io = new IntersectionObserver(([entry]) => {
			if (entry?.isIntersecting) {
				setShown(true);
				io.disconnect();
			}
		}, { threshold: .15 });
		io.observe(el);
		return () => io.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		"data-shown": shown,
		style: { transitionDelay: `${delay}ms` },
		className: `reveal ${className}`,
		children
	});
}
var detectiveAlley = S3_MEDIA.about.detectiveAlley;
var evidenceBoard = S3_MEDIA.about.evidenceBoard;
var believeCrimeScene = S3_MEDIA.about.believeCrimeScene;
var believeEye = S3_MEDIA.about.believeEye;
var ctaDesk = S3_MEDIA.about.ctaDesk;
var believeClues = S3_MEDIA.about.evidenceBoard;
var FEATURES = [
	{
		icon: FolderClosed,
		title: "EVERY CASE",
		sub: "HAS A STORY."
	},
	{
		icon: Search,
		title: "EVERY CLUE",
		sub: "HAS A PURPOSE."
	},
	{
		icon: Crosshair,
		title: "THE TRUTH IS",
		sub: "WAITING."
	}
];
var PURPOSE = [
	{
		icon: ScrollText,
		title: "REALISTIC CASE FILES",
		text: "Every case is carefully crafted to feel like a real investigation."
	},
	{
		icon: Brain,
		title: "LOGIC, OBSERVATION & DEDUCTION",
		text: "Use your mind. Connect the dots. Solve the truth."
	},
	{
		icon: Puzzle,
		title: "STORIES THAT CHALLENGE YOU",
		text: "Every detail matters. Every clue has a reason."
	},
	{
		icon: UserSearch,
		title: "MADE FOR TRUE INVESTIGATORS",
		text: "For those who see beyond what others miss."
	}
];
var BELIEFS = [
	{
		img: believeCrimeScene,
		title: "EVERY CASE HAS A STORY.",
		text: "Behind every crime lies a story waiting to be discovered."
	},
	{
		img: believeClues,
		title: "EVERY CLUE HAS A PURPOSE.",
		text: "Nothing is placed by accident. Every detail leads somewhere."
	},
	{
		img: believeEye,
		title: "THE TRUTH IS WAITING.",
		text: "The answers are there. You just have to find them."
	}
];
function AboutPage() {
	const [cmsSettings, setCmsSettings] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		api.getSettings().then((data) => {
			if (data) setCmsSettings(data);
		}).catch(() => {});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "about-noir noir-grain relative min-h-screen max-w-full overflow-x-clip bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Atmosphere, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "relative z-10 mx-auto max-w-[1500px] px-6 pt-28 pb-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-tech mb-6 text-[11px] tracking-[0.4em] text-primary",
							children: "// ABOUT US"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "dz-headline relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "font-display text-[14vw] leading-[0.78] tracking-tight sm:text-[9.5rem]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"data-text": "ABOUT",
									className: "text-glitch block text-foreground",
									children: "ABOUT"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"data-text": "US",
									className: "text-glitch block text-primary",
									children: "US"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "scanlines pointer-events-none absolute inset-0 opacity-25" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10 max-w-xl space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-2xl tracking-[0.12em] text-foreground",
									children: cmsSettings.about_page_headline || /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										"WE CREATE MYSTERIES.",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-primary",
											children: "YOU SOLVE THEM."
										})
									] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm leading-relaxed text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-primary",
										children: "Detectives Zone"
									}), " is an immersive detective experience brand built for people who love mystery, investigation and the thrill of uncovering the truth."]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm leading-relaxed text-muted-foreground",
									children: [
										"We create realistic case files filled with",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-primary",
											children: "evidence, clues, statements, documents and hidden secrets"
										}),
										" ",
										"designed to challenge your observation, logic and deduction."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold leading-relaxed text-foreground",
									children: "And the truth is waiting to be discovered."
								})
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "float-slow relative overflow-hidden border border-border/70",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: cmsSettings.about_alley_image || detectiveAlley,
									alt: "Detective in a trench coat and fedora standing in a rainy alley at night",
									width: 912,
									height: 1408,
									className: "h-[440px] w-full object-cover opacity-90 lg:h-[560px]"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute -right-2 top-8 hidden w-[42%] rotate-1 border border-border/60 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.95)] md:block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: cmsSettings.about_board_image || evidenceBoard,
									alt: "Evidence board with pinned photographs, maps, fingerprints and red connecting strings",
									width: 704,
									height: 1200,
									loading: "lazy",
									className: "h-[320px] w-full object-cover lg:h-[420px]"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "string-glow pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_45%,color-mix(in_oklab,var(--blood)_35%,transparent)_100%)] opacity-50" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute bottom-16 left-2 w-40 -rotate-3 bg-paper p-4 text-center font-display text-xs leading-relaxed tracking-[0.15em] text-paper-foreground shadow-[0_20px_40px_-18px_rgb(0_0_0/0.9)]",
								children: ["TRUTH IS HIDDEN IN DETAILS", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 -rotate-6" })]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					className: "mt-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "glass-card grid divide-y divide-border/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0 [perspective:1400px]",
						children: FEATURES.map(({ icon: Icon, title, sub }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lift-3d flex items-center gap-4 px-8 py-7",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "size-8 shrink-0 text-primary",
								strokeWidth: 1.2
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-display text-sm tracking-[0.18em] text-foreground",
								children: [
									title,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: sub
									})
								]
							})]
						}, title))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					className: "mt-24",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "dossier relative p-8 lg:p-12",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -left-6 -top-5 h-10 w-32 -rotate-12" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -right-6 -bottom-5 h-10 w-32 -rotate-6" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-10 lg:grid-cols-[0.8fr_2fr]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-tech mb-4 text-[10px] tracking-[0.3em] text-primary/80",
										children: "DOSSIER DZ-00"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "font-display text-3xl tracking-[0.14em]",
										children: ["OUR ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-primary",
											children: "PURPOSE"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-3 h-px w-24 bg-primary" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground",
										children: "To build the world's most engaging detective experiences where curiosity leads, logic connects and truth is uncovered."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative mt-10 flex size-28 flex-col items-center justify-center rounded-full border-2 border-dashed border-primary/50 font-display text-[10px] leading-tight tracking-[0.2em] text-primary/80",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FingerprintPattern, {
												className: "absolute size-14 text-primary opacity-15",
												strokeWidth: .8
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "relative",
												children: "TRUTH"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "relative",
												children: "SEEKER"
											})
										]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-px bg-border/60 sm:grid-cols-2 xl:grid-cols-4 [perspective:1400px]",
									children: PURPOSE.map(({ icon: Icon, title, text }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "lift-3d group relative bg-card/70 px-6 py-8 hover:bg-blood/[0.06]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -top-2 left-6 h-5 w-10" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
												className: "size-9 text-primary",
												strokeWidth: 1.2
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "mt-6 font-display text-sm leading-snug tracking-[0.14em] text-foreground",
												children: title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-4 text-xs leading-relaxed text-muted-foreground",
												children: text
											})
										]
									}, title))
								})]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-24",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-tech mb-4 text-[10px] tracking-[0.3em] text-primary/80",
							children: "FILE 003 — CASE PHILOSOPHY"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-display text-3xl tracking-[0.14em]",
							children: ["WHAT WE ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: "BELIEVE"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-3 h-px w-28 bg-primary" })
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 grid gap-6 lg:grid-cols-3 [perspective:1600px]",
						children: BELIEFS.map(({ img, title, text }, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: i * 120,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "glass-card lift-3d h-full overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: img,
									alt: title.toLowerCase(),
									width: 900,
									height: 640,
									loading: "lazy",
									className: "h-56 w-full object-cover opacity-85"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-base tracking-[0.14em] text-foreground",
										children: title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-xs leading-relaxed text-muted-foreground",
										children: text
									})]
								})]
							})
						}, title))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					className: "mt-24",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "dossier relative grid items-center gap-10 p-8 lg:grid-cols-[0.7fr_1.4fr_1fr] lg:p-12",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative -rotate-2 bg-paper p-6 text-paper-foreground shadow-[0_30px_60px_-30px_rgb(0_0_0/0.95)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -top-4 left-8 h-8 w-24 -rotate-6" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-sm tracking-[0.2em] text-primary",
										children: "YOUR ROLE"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-4 font-hand text-xl leading-snug",
										children: [
											"You're not just a player.",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											"You're the investigator.",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											"You examine evidence.",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											"You question everything.",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											"You connect the dots.",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											"You uncover the truth."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FingerprintPattern, {
										className: "mt-4 size-10 opacity-40",
										strokeWidth: .8
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "font-display text-4xl leading-[1.05] tracking-[0.04em] sm:text-5xl",
									children: [
										"THINK LIKE A DETECTIVE.",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-primary",
											children: "FIND THE TRUTH."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-6 text-sm leading-relaxed text-muted-foreground",
									children: [
										"The evidence is in front of you.",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										"The truth is hidden in plain sight."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-6 inline-block border-b border-primary/60 pb-1 font-hand text-3xl text-primary",
									children: "Are you ready?"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative rotate-2 border border-border/60",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: ctaDesk,
									alt: "Detective desk with case files and photographs under lamp light",
									width: 900,
									height: 700,
									loading: "lazy",
									className: "h-64 w-full object-cover opacity-85"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "tape absolute -top-4 right-8 h-8 w-24 rotate-6" })]
							})
						]
					})
				})
			]
		})]
	});
}
//#endregion
export { AboutPage as component };
