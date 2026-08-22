import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ft as ChevronLeft, Ot as Clock, Pt as ChevronRight, T as SearchCheck, dt as FolderOpen, f as Star, r as Zap, vt as Eye } from "../_libs/lucide-react.mjs";
import { c as api, i as S3_MEDIA } from "./router-CBHk_fdB.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { i as SwiperSlide, n as Pagination, r as Swiper, t as EffectCoverflow } from "../_libs/swiper.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cases-D7PPPYT4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function extractWords(node, keyPrefix, out) {
	if (node == null || typeof node === "boolean") return;
	if (typeof node === "string" || typeof node === "number") {
		node.toString().split(" ").filter(Boolean).forEach((word, i) => out.push({
			text: word,
			key: `${keyPrefix}-${i}`
		}));
		return;
	}
	if (Array.isArray(node)) {
		node.forEach((child, i) => extractWords(child, `${keyPrefix}-${i}`, out));
		return;
	}
	if ((0, import_react.isValidElement)(node)) {
		const props = node.props;
		extractWords(props?.children, `${keyPrefix}-${node.key ?? out.length}`, out);
	}
}
function SkiperTextRevealH({ children, className, style }) {
	const words = [];
	extractWords(children, "w", words);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
		className,
		style,
		"aria-label": words.map((w) => w.text).join(" "),
		initial: "hidden",
		whileInView: "visible",
		viewport: {
			once: false,
			margin: "-12% 0px"
		},
		variants: {
			hidden: {},
			visible: { transition: { staggerChildren: .07 } }
		},
		children: words.map((word, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "inline-block overflow-hidden align-top",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
				className: "inline-block",
				variants: {
					hidden: {
						x: 60,
						opacity: 0,
						skewY: 8
					},
					visible: {
						x: 0,
						opacity: 1,
						skewY: 0,
						transition: {
							duration: .7,
							ease: [
								.22,
								1,
								.36,
								1
							]
						}
					}
				},
				children: word.text
			})
		}), i < words.length - 1 ? "\xA0" : null] }, word.key))
	});
}
var caseVoicemail = S3_MEDIA.cases.caseVoicemail;
var caseWitness = S3_MEDIA.cases.caseWitness;
var caseLetter = S3_MEDIA.cases.caseLetter;
var caseHeir = S3_MEDIA.cases.caseHeir;
var caseExperiment = S3_MEDIA.cases.caseExperiment;
var caseBetrayal = S3_MEDIA.cases.caseBetrayal;
var initialCases = [
	{
		id: "001",
		title: "The Last Voicemail",
		number: "CASE 001",
		status: "UNSOLVED",
		image: caseVoicemail,
		description: "A successful businessman found dead in his study. No forced entry. Just a voicemail and a lot of questions.",
		stars: 5,
		duration: "3–5 HOURS",
		difficulty: "HARD",
		rating: 5,
		dateAdded: 169e10
	},
	{
		id: "002",
		title: "The Silent Witness",
		number: "CASE 002",
		status: "UNSOLVED",
		image: caseWitness,
		description: "A reclusive writer found dead in a locked room. A witness that never spoke... but saw everything.",
		stars: 4,
		duration: "3–6 HOURS",
		difficulty: "HARD",
		rating: 4,
		dateAdded: 1691e9
	},
	{
		id: "003",
		title: "Blood in the Letter",
		number: "CASE 003",
		status: "COMING SOON",
		image: caseLetter,
		description: "A threatening letter. A missing girl. A trail of blood. The shadows are speaking.",
		stars: 0,
		duration: "COMING SOON",
		difficulty: "MEDIUM",
		rating: 0,
		dateAdded: 1692e9
	},
	{
		id: "004",
		title: "The Vanished One",
		number: "CASE 004",
		status: "COMING SOON",
		image: caseHeir,
		description: "They were here one day, gone the next. A disappearance that made no noise at all.",
		stars: 0,
		duration: "COMING SOON",
		difficulty: "MEDIUM",
		rating: 0,
		dateAdded: 1693e9
	},
	{
		id: "005",
		title: "The Final Experiment",
		number: "CASE 005",
		status: "COMING SOON",
		image: caseExperiment,
		description: "A scientist's last experiment was never meant to be found. Now the cure is the disease.",
		stars: 0,
		duration: "COMING SOON",
		difficulty: "HARD",
		rating: 0,
		dateAdded: 1694e9
	},
	{
		id: "006",
		title: "Shadows of Betrayal",
		number: "CASE 006",
		status: "COMING SOON",
		image: caseBetrayal,
		description: "A man caught between loyalty and truth. One choice changed everything.",
		stars: 0,
		duration: "COMING SOON",
		difficulty: "HARD",
		rating: 0,
		dateAdded: 1695e9
	}
];
function CasesDashboard() {
	const [activeTab, setActiveTab] = (0, import_react.useState)("ALL");
	const [liveCases, setLiveCases] = (0, import_react.useState)(initialCases);
	const swiperRef = (0, import_react.useRef)(null);
	const prevBtn = (0, import_react.useRef)(null);
	const nextBtn = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		api.getCases().then((data) => {
			if (data && Array.isArray(data) && data.length > 0) {
				const imageMap = {
					"001": caseVoicemail,
					"002": caseWitness,
					"003": caseLetter,
					"004": caseHeir,
					"005": caseExperiment,
					"006": caseBetrayal
				};
				const mapped = data.map((c) => {
					const num = c.case_number ? c.case_number.replace(/^CASE\s*/i, "") : "001";
					const img = c.cover_image && !c.cover_image.startsWith("/src") ? c.cover_image : imageMap[num] || imageMap[c.slug] || caseVoicemail;
					return {
						id: num,
						dbId: c.id,
						title: c.title,
						number: c.case_number.startsWith("CASE") ? c.case_number : `CASE ${c.case_number}`,
						status: c.status || "UNSOLVED",
						image: img,
						description: c.short_description || c.intro_text || "",
						stars: c.rating ? Math.round(c.rating) : 5,
						duration: c.estimated_duration || "3–5 HOURS",
						difficulty: c.difficulty || "HARD",
						rating: c.rating || 5,
						dateAdded: new Date(c.created_at || Date.now()).getTime()
					};
				});
				setLiveCases(mapped);
			}
		}).catch((err) => console.log("Using initial cases fallback:", err));
	}, []);
	const filteredCases = (0, import_react.useMemo)(() => {
		let result = [...liveCases];
		if (activeTab !== "ALL") result = result.filter((c) => c.status === activeTab);
		result.sort((a, b) => a.id.localeCompare(b.id));
		return result;
	}, [activeTab, liveCases]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-[#000000] text-[#C7C7C7] font-sans pt-[72px] relative overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex flex-col md:flex-row justify-between items-start md:items-end pb-7 mb-10 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-display text-[clamp(3.5rem,12vw,6.5rem)] font-bold text-white tracking-[2px] leading-none uppercase",
						style: { fontFamily: "Bebas Neue, sans-serif" },
						children: ["Case ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[#B31217]",
							children: "Files"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[19px] text-[#A0A0A0] font-mono tracking-[1.5px] uppercase mt-3",
						children: "Choose your next investigation"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[#B31217]",
								children: "Cases"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "flex items-center w-fit bg-[#0B0B0B] border border-[#1A1A1A] rounded-lg px-6 py-3 mb-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap items-center gap-8",
						children: [
							"ALL",
							"UNSOLVED",
							"COMPLETED",
							"COMING SOON"
						].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveTab(tab),
							className: `group relative inline-flex py-2 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 cursor-pointer ${tab === "ALL" && activeTab === "ALL" || activeTab === tab ? "text-[#B31217] font-semibold" : "text-muted-foreground hover:text-foreground"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative",
								children: [tab === "ALL" ? "All Cases" : tab.replace("_", " "), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute -bottom-1 left-0 h-[2px] bg-blood transition-all duration-500 ease-out ${activeTab === tab || tab === "ALL" && activeTab === "ALL" ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"}` })]
							})
						}, tab))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden px-2 sm:px-16 mt-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swiper, {
							modules: [EffectCoverflow, Pagination],
							effect: "coverflow",
							coverflowEffect: {
								rotate: 35,
								depth: 120,
								modifier: 1.2,
								slideShadows: true
							},
							grabCursor: true,
							centeredSlides: true,
							loop: true,
							slidesPerView: "auto",
							speed: 800,
							spaceBetween: -48,
							pagination: {
								el: ".cases-pagination",
								clickable: true
							},
							ref: swiperRef,
							onSlideChange: (swiper) => {
								const real = swiper.realIndex;
								const first = real === 0;
								const last = real === filteredCases.length - 1;
								prevBtn.current?.style.setProperty("opacity", first ? "0.25" : "1");
								nextBtn.current?.style.setProperty("opacity", last ? "0.25" : "1");
							},
							className: "cases-coverflow",
							children: filteredCases.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwiperSlide, {
								className: "cases-coverflow-slide",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/cases/$caseId",
									params: { caseId: c.id },
									className: "group flex h-full flex-col overflow-hidden rounded-lg border border-[#1A1A1A] bg-[#0B0B0B] transition-all duration-300 hover:border-[#B31217]/50 hover:shadow-[0_20px_40px_rgba(179,18,23,0.12)]",
									style: { boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.02)" },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative h-[210px] w-full overflow-hidden bg-neutral-900",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: c.image,
												alt: c.title,
												className: "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter grayscale group-hover:grayscale-0"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent opacity-90" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `absolute top-4 left-4 inline-flex items-center gap-1.5 font-mono text-[8px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-[3px] border shadow-md backdrop-blur-md transition-all duration-300 ${c.status === "UNSOLVED" ? "bg-black/90 text-[#FF4A50] border-[#C81D24]/60 shadow-[0_0_12px_rgba(200,29,36,0.35)]" : "bg-black/85 text-neutral-400 border-white/10 shadow-[0_0_8px_rgba(0,0,0,0.6)]"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block w-1.5 h-1.5 rounded-full ${c.status === "UNSOLVED" ? "bg-[#C81D24] animate-pulse" : "bg-neutral-600"}` }), c.status === "UNSOLVED" ? "UNSOLVED" : "COMING SOON"]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-6 flex-1 flex flex-col justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-[10px] tracking-[0.16em] text-[#9A9A9A] uppercase mb-1",
											children: c.number
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-[26px] text-white tracking-[0.5px] leading-tight uppercase group-hover:text-[#B31217] transition-colors duration-300 mb-3",
											style: { fontFamily: "Bebas Neue, sans-serif" },
											children: c.title
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "border-t border-[#1A1A1A] pt-4 mt-5 flex items-center justify-between text-[11px] font-mono tracking-wider",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex gap-0.5",
													children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-3 w-3 ${i < c.stars ? "text-[#B31217] fill-[#B31217]" : "text-neutral-800"}` }, i))
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5 text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "uppercase text-[9px]",
														children: c.duration
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[#C21C22] font-semibold text-[9px] uppercase tracking-widest",
													children: c.difficulty
												})
											]
										})]
									})]
								})
							}, c.id))
						}, activeTab),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							ref: prevBtn,
							type: "button",
							"aria-label": "Previous case",
							onClick: () => swiperRef.current?.swiper.slidePrev(),
							className: "cases-arrow left-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							ref: nextBtn,
							type: "button",
							"aria-label": "Next case",
							onClick: () => swiperRef.current?.swiper.slideNext(),
							className: "cases-arrow right-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cases-pagination mt-4 flex justify-center gap-2" })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
              .cases-coverflow {
                width: 100%;
                padding: 16px 0 12px;
                overflow: visible;
              }
              .cases-coverflow .swiper-slide {
                width: 320px;
                height: 440px;
                transition: opacity 0.4s ease;
                transform-style: preserve-3d;
              }
              .cases-coverflow .swiper-slide-prev,
              .cases-coverflow .swiper-slide-next {
                opacity: 0.55;
              }
              .cases-coverflow .swiper-slide-shadow-coverflow {
                background: rgba(0, 0, 0, 0.55) !important;
                border-radius: 8px;
              }
              .cases-coverflow .swiper-pagination-bullet {
                width: 0.375rem;
                height: 0.375rem;
                border-radius: 9999px;
                background: rgba(255, 255, 255, 0.22);
                opacity: 1;
                transition: all 0.3s ease;
              }
              .cases-coverflow .swiper-pagination-bullet-active {
                width: 1.5rem;
                background: #b31217;
              }
              .cases-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                z-index: 30;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 2.5rem;
                height: 2.5rem;
                border-radius: 9999px;
                border: 1px solid #1a1a1a;
                background: #0b0b0b;
                color: #b31217;
                cursor: pointer;
                transition: border-color 0.3s, background 0.3s, opacity 0.3s;
              }
              .cases-arrow:hover {
                border-color: rgba(179, 18, 23, 0.6);
                background: rgba(179, 18, 23, 0.15);
              }
            ` })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-32 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mb-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-4 w-1 bg-[#B31217]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-[15px] font-bold text-white tracking-[1.5px] uppercase",
								style: { fontFamily: "Bebas Neue, sans-serif" },
								children: "How it works"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col gap-12",
							children: [
								{
									step: "01",
									title: "Purchase a Case",
									desc: "Choose a case and get your evidence box delivered."
								},
								{
									step: "02",
									title: "Examine Evidence",
									desc: "Analyze documents, photos, audio and other clues."
								},
								{
									step: "03",
									title: "Connect the Dots",
									desc: "Use logic and deduction to uncover the truth."
								},
								{
									step: "04",
									title: "Submit Your Report",
									desc: "Submit your conclusions and unlock the truth."
								}
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SkiperTextRevealH, {
										className: "font-mono text-[13px] tracking-[0.3em] text-[#B31217] uppercase",
										children: ["Step ", s.step]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkiperTextRevealH, {
										className: "font-display text-[clamp(2rem,5.5vw,4rem)] font-bold uppercase leading-[1.05] tracking-wide text-white",
										style: { fontFamily: "Bebas Neue, sans-serif" },
										children: s.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkiperTextRevealH, {
										className: "text-[14px] text-[#888] leading-relaxed max-w-2xl",
										children: s.desc
									})
								]
							}, s.step))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "lg:sticky lg:top-[96px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "bg-[#0B0B0B] border border-[#1A1A1A] rounded-lg p-9 relative overflow-hidden",
							style: { boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.02)" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 mb-8",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-5 w-1 bg-[#B31217]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-[18px] font-bold text-white tracking-[1.5px] uppercase",
									style: { fontFamily: "Bebas Neue, sans-serif" },
									children: "Case Statistics"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-8 bg-neutral-950/60 border border-white/5 rounded flex flex-col items-center text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-12 w-12 rounded-full border border-white/5 bg-[#0B0B0B] flex items-center justify-center mb-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "h-6 w-6 text-muted-foreground" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-display text-[48px] font-bold text-white leading-none",
												style: { fontFamily: "Bebas Neue, sans-serif" },
												children: "06"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] text-[#A0A0A0] tracking-widest uppercase mt-3",
												children: "Total Cases"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-8 bg-neutral-950/60 border border-white/5 rounded flex flex-col items-center text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-12 w-12 rounded-full border border-white/5 bg-[#0B0B0B] flex items-center justify-center mb-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-6 w-6 text-[#B31217]" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-display text-[48px] font-bold text-white leading-none",
												style: { fontFamily: "Bebas Neue, sans-serif" },
												children: "03"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] text-[#A0A0A0] tracking-widest uppercase mt-3",
												children: "Unsolved"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-8 bg-neutral-950/60 border border-white/5 rounded flex flex-col items-center text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-12 w-12 rounded-full border border-white/5 bg-[#0B0B0B] flex items-center justify-center mb-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchCheck, { className: "h-6 w-6 text-muted-foreground" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-display text-[48px] font-bold text-white leading-none",
												style: { fontFamily: "Bebas Neue, sans-serif" },
												children: "00"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] text-[#A0A0A0] tracking-widest uppercase mt-3",
												children: "Completed"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-8 bg-neutral-950/60 border border-white/5 rounded flex flex-col items-center text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-12 w-12 rounded-full border border-white/5 bg-[#0B0B0B] flex items-center justify-center mb-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-6 w-6 text-muted-foreground" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-display text-[48px] font-bold text-white leading-none",
												style: { fontFamily: "Bebas Neue, sans-serif" },
												children: "10K+"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] text-[#A0A0A0] tracking-widest uppercase mt-3",
												children: "Detectives"
											})
										]
									})
								]
							})]
						})
					})]
				})
			]
		})
	});
}
//#endregion
export { CasesDashboard as component };
