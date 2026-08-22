import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as Play, It as ChevronDown, J as Map, Nt as ChevronUp, Ot as Clock, P as Plus, Q as Lock, U as Minus, Ut as ArrowRight, Vt as Boxes, dt as FolderOpen, f as Star, i as X, it as KeyRound, kt as ClipboardList, lt as Gem, pt as FlaskConical, v as ShoppingCart, vt as Eye, z as Package } from "../_libs/lucide-react.mjs";
import { a as useCart, c as api, i as S3_MEDIA } from "./router-CBHk_fdB.mjs";
import { i as AnimatePresence } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-BsZptu29.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function splitChars(text) {
	return text.split("");
}
function HoverMember({ teamMembers, defaultName, className, backgroundColor = "#040404", textColor = "#C7C7C7", hoverTextColor = "#B31217", onSelect, onHover }) {
	const [hovered, setHovered] = (0, import_react.useState)(null);
	const handleHover = (i) => {
		setHovered(i);
		onHover?.(i);
	};
	const activeName = hovered !== null ? teamMembers[hovered]?.name : defaultName ?? "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `relative overflow-hidden ${className ?? ""}`,
		style: { background: backgroundColor },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex min-h-[150px] items-center justify-center gap-6 px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
				mode: "wait",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					className: "flex items-center gap-6",
					initial: {
						opacity: 0,
						y: 30
					},
					animate: {
						opacity: 1,
						y: 0
					},
					exit: {
						opacity: 0,
						y: -30
					},
					transition: {
						duration: .5,
						ease: [
							.22,
							1,
							.36,
							1
						]
					},
					children: [hovered !== null && teamMembers[hovered]?.image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						className: "h-24 w-24 shrink-0 overflow-hidden rounded-xl border",
						style: { borderColor: "rgba(255,255,255,0.12)" },
						initial: {
							scale: .7,
							rotate: -6
						},
						animate: {
							scale: 1,
							rotate: 0
						},
						transition: {
							duration: .45,
							ease: [
								.22,
								1,
								.36,
								1
							]
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: teamMembers[hovered].image,
							alt: teamMembers[hovered].name,
							className: "h-full w-full object-cover"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-left",
						children: [hovered !== null && teamMembers[hovered]?.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
							className: "font-mono text-[10px] uppercase tracking-[0.2em]",
							style: { color: hoverTextColor },
							initial: {
								opacity: 0,
								x: 20
							},
							animate: {
								opacity: 1,
								x: 0
							},
							transition: {
								delay: .05,
								duration: .35
							},
							children: teamMembers[hovered].subtitle
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.h3, {
							className: "font-display text-[clamp(2rem,6vw,4.5rem)] font-bold uppercase tracking-wide leading-none",
							style: {
								fontFamily: "Bebas Neue, sans-serif",
								color: hovered !== null ? hoverTextColor : textColor
							},
							children: splitChars(activeName).map((ch, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
								className: "inline-block whitespace-pre",
								initial: {
									opacity: 0,
									x: 24
								},
								animate: {
									opacity: 1,
									x: 0
								},
								transition: {
									delay: i * .02,
									duration: .35,
									ease: [
										.22,
										1,
										.36,
										1
									]
								},
								children: ch
							}, `${activeName}-${i}`))
						})]
					})]
				}, activeName)
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto flex max-w-[1400px] flex-wrap items-start justify-center gap-4 px-4 pb-12 pt-8",
			children: teamMembers.map((member, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				className: "group relative w-[120px] cursor-pointer sm:w-[140px]",
				onMouseEnter: () => handleHover(i),
				onMouseLeave: () => handleHover(hovered === i ? null : hovered),
				onClick: () => onSelect?.(member, i),
				initial: {
					opacity: 0,
					y: 40
				},
				whileInView: {
					opacity: 1,
					y: 0
				},
				viewport: {
					once: true,
					margin: "-10%"
				},
				transition: {
					delay: i * .06,
					duration: .6,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative aspect-square overflow-hidden rounded-xl border",
					style: { borderColor: "rgba(255,255,255,0.06)" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: member.image,
						alt: member.name,
						loading: "lazy",
						className: `h-full w-full object-cover transition-all duration-700 ease-out ${hovered === i ? "scale-110 grayscale-0" : "scale-100 grayscale"}`
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 px-1 text-center transition-all duration-300",
					style: {
						opacity: hovered === i ? 1 : 0,
						transform: hovered === i ? "translateY(0)" : "translateY(6px)"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[8px] uppercase tracking-[0.2em] transition-colors duration-300",
						style: { color: hoverTextColor },
						children: member.subtitle ?? `0${i + 1}`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display mt-1 text-[18px] font-bold uppercase leading-none tracking-wide",
						style: {
							fontFamily: "Bebas Neue, sans-serif",
							color: hoverTextColor
						},
						children: member.name
					})]
				})]
			}, member.name))
		})]
	});
}
function CaseKitsEvidence() {
	const [activeCase, setActiveCase] = (0, import_react.useState)("CASE 001");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1500px] px-4 pt-14 pb-6 sm:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] font-semibold tracking-[0.28em] text-primary",
					children: "EVIDENCE VAULT"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display mt-3 text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[0.95] tracking-tight text-foreground",
					children: ["CASE ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary",
						children: "KITS"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground",
					children: "Curated evidence lockers of the most requested cases. Each kit ships as a physical case box — hover a kit to see which cases live inside it and the items each case needs."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 flex w-fit items-center rounded-lg border border-[#1A1A1A] bg-[#0B0B0B] px-6 py-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap items-center gap-8",
						children: ["CASE 001"].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveCase(c),
							onMouseEnter: () => setActiveCase(c),
							className: `group relative inline-flex py-2 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 cursor-pointer ${activeCase === c ? "text-[#B31217] font-semibold" : "text-muted-foreground hover:text-foreground"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative",
								children: [c, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute -bottom-1 left-0 h-[2px] bg-blood transition-all duration-500 ease-out ${activeCase === c ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"}` })]
							})
						}, c))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
          @keyframes scan-line {
            0% { top: -2px; opacity: 0; }
            10% { opacity: 0.6; }
            90% { opacity: 0.6; }
            100% { top: 100%; opacity: 0; }
          }
        ` })
			]
		})
	});
}
function CaseKitCards({ kits, images = [], signatures = [], onAdd }) {
	if (kits.length === 0) return null;
	const kit = kits[0];
	const labelsMap = {
		audio: "Exclusive Audio Wiretap",
		camera: "Crime Scene Photographs",
		files: "Authentic Incident Dossiers",
		mobile: "Encrypted Mobile Device",
		puzzle: "Cipher Puzzle Disc",
		time: "Stopped Pocket Watch",
		image: "Master Evidence Case Box"
	};
	let members = [];
	if (signatures && signatures.length > 0) members = signatures.map((sig, i) => ({
		name: sig.label,
		subtitle: sig.authenticity_note || `Case 001 Item #${i + 1}`,
		image: sig.image_url || images[i % images.length] || kit.image
	}));
	else if (images.length > 0) members = images.map((image, i) => {
		const file = image.split("/").pop()?.replace(/\.[^.]+$/, "") ?? `evidence-${i + 1}`;
		return {
			name: labelsMap[file] || `Evidence Artifact 0${i + 1}`,
			subtitle: `Featured Case Item #${i + 1}`,
			image
		};
	});
	else members = kit.cases.map((c, i) => ({
		name: c.title,
		subtitle: `${c.number} · ${c.difficulty}`,
		image: images[i] ?? kit.image
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-[1400px] items-center gap-4 px-4 sm:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-gradient-to-r from-transparent via-[#C81D24]/30 to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[10px] tracking-[0.3em] text-[#C81D24]/60 uppercase",
						children: "Case Archive — Hover To Open"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-gradient-to-r from-transparent via-[#C81D24]/30 to-transparent" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoverMember, {
				teamMembers: members,
				defaultName: kit.name,
				backgroundColor: "#040404",
				className: "relative",
				onSelect: () => onAdd?.(kit)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto max-w-[1400px] px-4 pb-2 text-center font-mono text-[10px] tracking-[0.2em] text-[#555] uppercase",
				children: "Click a case kit to add it to your cart"
			})
		]
	});
}
var caseVoicemail = S3_MEDIA.cases.caseVoicemail;
var caseWitness = S3_MEDIA.cases.caseWitness;
var caseLetter = S3_MEDIA.cases.caseLetter;
var caseBetrayal = S3_MEDIA.cases.caseBetrayal;
var caseHeir = S3_MEDIA.cases.caseHeir;
var caseExperiment = S3_MEDIA.cases.caseExperiment;
var evidenceRoom = S3_MEDIA.evidenceRoom;
var dz001Kit = S3_MEDIA.caseKits.dz001Kit;
var sigAudio = S3_MEDIA.signature.audio;
var sigCamera = S3_MEDIA.signature.camera;
var sigFiles = S3_MEDIA.signature.files;
var sigMobile = S3_MEDIA.signature.mobile;
var sigPuzzle = S3_MEDIA.signature.puzzle;
var sigTime = S3_MEDIA.signature.time;
var products = [
	{
		id: "p1",
		caseNumber: "CASE 001",
		title: "The Last Voicemail",
		description: "A successful businessman found dead in his study. No forced entry. Just a voicemail… and a lot of questions. Every clue leads deeper into a web of secrets no one was meant to uncover.",
		price: 999,
		image: caseVoicemail,
		badge: "IN STOCK · 10 UNITS",
		stars: 5,
		reviews: 124,
		difficulty: "Hard",
		duration: "3–5 hrs",
		type: "hybrid",
		stock: 10
	},
	{
		id: "p2",
		caseNumber: "CASE 002",
		title: "The Silent Witness",
		description: "A reclusive writer found dead in a locked room. A witness that never spoke… but saw everything. The pages of the final manuscript hold the key to a truth buried in silence.",
		price: 999,
		image: caseWitness,
		badge: "OUT OF STOCK",
		stars: 5,
		reviews: 98,
		difficulty: "Hard",
		duration: "3–6 hrs",
		type: "hybrid",
		stock: 0
	},
	{
		id: "p3",
		caseNumber: "CASE 003",
		title: "Blood in the Letter",
		description: "A threatening letter. A missing girl. A trail of blood. The shadows are speaking. Follow the crimson ink before the next message arrives — and the clock runs out.",
		price: 999,
		image: caseLetter,
		badge: "OUT OF STOCK",
		stars: 4,
		reviews: 76,
		difficulty: "Medium",
		duration: "2–4 hrs",
		type: "physical",
		stock: 0
	},
	{
		id: "p4",
		caseNumber: "CASE 004",
		title: "Shadows of Betrayal",
		description: "A man caught between loyalty and truth. One choice changed everything. Trust no one. Deception runs deep, and the betrayer may be closer than you think.",
		price: 999,
		image: caseBetrayal,
		badge: "OUT OF STOCK",
		stars: 5,
		reviews: 64,
		difficulty: "Expert",
		duration: "4–7 hrs",
		type: "hybrid",
		stock: 0
	},
	{
		id: "p5",
		caseNumber: "CASE 005",
		title: "The Vanished One",
		description: "They were here one day, gone the next. A disappearance that made no noise at all. No goodbye, no trace — just an empty room and a question that haunts everyone.",
		price: 999,
		image: caseHeir,
		badge: "OUT OF STOCK",
		stars: 4,
		reviews: 42,
		difficulty: "Medium",
		duration: "3–5 hrs",
		type: "physical",
		stock: 0
	},
	{
		id: "p6",
		caseNumber: "CASE 006",
		title: "The Final Experiment",
		description: "A scientist's last experiment was never meant to be found. Now the cure is the disease. The lab notes tell a story of obsession, and the final formula changes everything.",
		price: 999,
		image: caseExperiment,
		badge: "OUT OF STOCK",
		stars: 5,
		reviews: 83,
		difficulty: "Hard",
		duration: "4–6 hrs",
		type: "hybrid",
		stock: 0
	}
];
var caseKits = [{
	id: "kit2",
	name: "The Signature Collection",
	tagline: "The complete archive. Every flagship case, every clue, one evidence locker.",
	image: evidenceRoom,
	badge: "SAVE 12%",
	price: 3499,
	originalPrice: 3996,
	cases: [
		{
			number: "CASE 001",
			title: "The Last Voicemail",
			difficulty: "Hard"
		},
		{
			number: "CASE 002",
			title: "The Silent Witness",
			difficulty: "Hard"
		},
		{
			number: "CASE 003",
			title: "Blood in the Letter",
			difficulty: "Medium"
		},
		{
			number: "CASE 004",
			title: "Shadows of Betrayal",
			difficulty: "Expert"
		}
	],
	box: [
		{
			icon: Package,
			label: "Signature Evidence Box",
			note: "Rigid collector case"
		},
		{
			icon: ClipboardList,
			label: "Complete Case Files",
			note: "4 full dossiers"
		},
		{
			icon: FlaskConical,
			label: "Evidence Vials",
			note: "Lab-sealed samples"
		},
		{
			icon: Map,
			label: "Investigation Blueprint",
			note: "Crime-scene floor plan"
		},
		{
			icon: KeyRound,
			label: "Replica Room Keys",
			note: "Prop evidence"
		},
		{
			icon: Gem,
			label: "Collector Case Card",
			note: "Numbered edition"
		}
	]
}];
var fmt = (n) => "₹" + n.toLocaleString("en-IN");
function ScrollReveal({ children, delay = 0 }) {
	const ref = (0, import_react.useRef)(null);
	const [isVisible, setIsVisible] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setIsVisible(true);
				observer.unobserve(entry.target);
			}
		}, {
			threshold: .05,
			rootMargin: "0px 0px -10% 0px"
		});
		if (ref.current) observer.observe(ref.current);
		return () => {
			if (ref.current) observer.unobserve(ref.current);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		style: {
			opacity: isVisible ? 1 : 0,
			transform: isVisible ? "translateY(0) scale(1)" : "translateY(50px) scale(0.97)",
			transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`
		},
		children
	});
}
function StorePage() {
	const [liveProducts, setLiveProducts] = (0, import_react.useState)(products);
	const [featuredSettings, setFeaturedSettings] = (0, import_react.useState)({
		code: "DZ-001",
		title: "The Last Voicemail",
		hover_title: "The Case Is Open.",
		quote: "\"A sealed case. A missing voice. Thirty pieces of evidence standing between you and the truth.\"",
		price: 999,
		duration: "3–4",
		level: "Expert",
		image: dz001Kit
	});
	const [quickView, setQuickView] = (0, import_react.useState)(null);
	const [addedIds, setAddedIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [cartOpen, setCartOpen] = (0, import_react.useState)(false);
	const [storeTab, setStoreTab] = (0, import_react.useState)("CASES");
	const [liveSignatures, setLiveSignatures] = (0, import_react.useState)([]);
	const featuredRef = (0, import_react.useRef)(null);
	const [featuredParallax, setFeaturedParallax] = (0, import_react.useState)(0);
	const [dz001Hovered, setDz001Hovered] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		Promise.all([
			api.getProducts().catch(() => []),
			api.getSettings().catch(() => ({})),
			api.getSignatures().catch(() => [])
		]).then(([prods, sets, sigs]) => {
			if (sigs && Array.isArray(sigs) && sigs.length > 0) setLiveSignatures(sigs);
			if (prods && Array.isArray(prods) && prods.length > 0) {
				const imageMap = {
					p1: caseVoicemail,
					p2: caseWitness,
					p3: caseLetter,
					p4: caseBetrayal,
					p5: caseHeir,
					p6: caseExperiment
				};
				const mapped = prods.map((p, idx) => ({
					id: p.slug || `p${idx + 1}`,
					caseNumber: p.sku ? p.sku.replace("DZ-KIT-", "CASE ") : `CASE 00${idx + 1}`,
					title: p.name ? p.name.split(" — ")[0] : p.name,
					description: p.short_description || "",
					price: p.price || 999,
					image: p.cover_image && !p.cover_image.startsWith("/src") ? p.cover_image : imageMap[p.slug] || imageMap[`p${idx + 1}`] || caseVoicemail,
					badge: idx === 0 ? "BESTSELLER" : idx === 1 ? "BESTSELLER" : idx === 2 ? "NEW" : idx === 3 ? "COLLECTOR" : idx === 4 ? "CLASSIFIED" : "TOP SECRET",
					stars: 5,
					reviews: 80 + idx * 10,
					difficulty: "Hard",
					duration: "3–5 hrs",
					type: "hybrid",
					stock: p.stock_quantity ?? 10
				}));
				setLiveProducts(mapped);
			}
			if (sets && Object.keys(sets).length > 0) setFeaturedSettings({
				code: sets.featured_kit_code || "DZ-001",
				title: sets.featured_kit_title || "The Last Voicemail",
				hover_title: sets.featured_kit_hover_title || "The Case Is Open.",
				quote: sets.featured_kit_quote || "\"A sealed case. A missing voice. Thirty pieces of evidence standing between you and the truth.\"",
				price: parseFloat(sets.featured_kit_price) || 999,
				duration: sets.featured_kit_duration || "3–4",
				level: sets.featured_kit_level || "Expert",
				image: sets.featured_kit_image && !sets.featured_kit_image.startsWith("/src") ? sets.featured_kit_image : dz001Kit
			});
		});
	}, []);
	(0, import_react.useEffect)(() => {
		let raf = 0;
		const onScroll = () => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(() => {
				const el = featuredRef.current;
				if (!el || storeTab !== "CASES") return;
				const r = el.getBoundingClientRect();
				const viewportHeight = window.innerHeight;
				const relativeScroll = (r.top + r.height / 2 - viewportHeight / 2) * .08;
				setFeaturedParallax(relativeScroll);
			});
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", onScroll);
			cancelAnimationFrame(raf);
		};
	}, [storeTab]);
	const { items, addToCart: addGlobalCart, removeFromCart, updateQuantity, totalCount, subtotal } = useCart();
	const addToCart = (p) => {
		addGlobalCart({
			id: p.id,
			title: p.title,
			caseNumber: p.caseNumber,
			price: p.price,
			image: p.image,
			type: p.type === "physical" ? "Physical Case Box" : "Hybrid Evidence Package"
		});
		setAddedIds((s) => {
			const n = new Set(s);
			n.add(p.id);
			return n;
		});
		setTimeout(() => setAddedIds((s) => {
			const n = new Set(s);
			n.delete(p.id);
			return n;
		}), 1200);
	};
	const addKitToCart = (kit) => {
		addToCart({
			id: kit.id,
			caseNumber: "CASE KIT",
			title: kit.name,
			description: kit.tagline,
			price: kit.price,
			image: kit.image,
			badge: kit.badge,
			stars: 5,
			reviews: 0,
			difficulty: "Bundle",
			duration: "6–20 hrs",
			type: "physical",
			stock: 20
		});
	};
	const kitsEvidence = caseKits.map((k) => ({
		id: k.id,
		code: k.id.replace(/kit/i, "KIT-").toUpperCase(),
		name: k.name,
		tagline: k.tagline,
		image: k.image,
		badge: k.badge,
		price: k.price,
		originalPrice: k.originalPrice,
		casesIncluded: k.cases.length,
		itemsInBox: k.box.length,
		save: k.originalPrice - k.price,
		box: k.box,
		cases: k.cases
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			background: "#040404",
			minHeight: "100vh",
			paddingTop: 72
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none fixed inset-0 z-0",
				style: { background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none fixed inset-0 z-0",
				style: { background: "radial-gradient(ellipse at 50% 30%, rgba(122,15,19,0.06) 0%, transparent 60%)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @keyframes dust-float {
          0%,100%{ transform: translateY(0) translateX(0); opacity:0; }
          10%{ opacity:0.5; }
          50%{ transform: translateY(-180px) translateX(40px); opacity:0.3; }
          90%{ opacity:0; }
        }
        .dust-particle {
          position: fixed;
          width: 2px; height: 2px;
          background: rgba(255,255,255,0.15);
          border-radius: 50%;
          animation: dust-float 12s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
        }
        @keyframes card-glow {
          0%,100% { box-shadow: 0 0 0 rgba(200,29,36,0); }
          50% { box-shadow: 0 0 20px rgba(200,29,36,0.15); }
        }
        @keyframes fade-up { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fade-up 0.7s ease-out both; }
        .fade-up-d1 { animation-delay: 0.1s; }
        .fade-up-d2 { animation-delay: 0.2s; }
        .fade-up-d3 { animation-delay: 0.3s; }
        .fade-up-d4 { animation-delay: 0.4s; }
        @keyframes badge-pulse {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      ` }),
			[...Array(8)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "dust-particle",
				style: {
					left: `${10 + i * 12}%`,
					top: `${30 + i % 3 * 20}%`,
					animationDelay: `${i * 1.5}s`,
					animationDuration: `${10 + i * 2}s`
				}
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-10 mx-auto flex gap-6 px-4 sm:px-6",
				style: {
					maxWidth: 1400,
					paddingTop: 32
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "fade-up relative overflow-hidden rounded-2xl border",
						style: {
							height: "clamp(400px, 30vw, 420px)",
							borderColor: "#000",
							background: "linear-gradient(135deg, rgba(9,9,9,1) 0%, rgba(4,4,4,1) 100%)"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 z-0",
								style: {
									backgroundImage: `url(${evidenceRoom})`,
									backgroundSize: "cover",
									backgroundPosition: "center",
									opacity: .75,
									filter: "brightness(0.85) contrast(1.1)"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0",
								style: { background: "linear-gradient(90deg, rgba(4,4,4,0.85) 0%, rgba(4,4,4,0.4) 50%, rgba(4,4,4,0.1) 100%)" }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0",
								style: { background: "linear-gradient(to top, rgba(4,4,4,1) 0%, transparent 40%)" }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative z-10 flex h-full flex-col justify-center px-6 sm:px-12",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "font-display leading-[0.95]",
									style: {
										fontSize: "clamp(2.5rem, 9vw, 4.5rem)",
										letterSpacing: "-0.02em"
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-white",
											children: "CRIME FILES."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-white",
											children: "REAL EVIDENCE."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block",
											style: { color: "#C81D24" },
											children: "YOUR INVESTIGATION."
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "group relative flex items-center justify-center gap-2 rounded-lg border px-7 py-3.5 font-display text-[12px] tracking-[0.2em] uppercase transition-all duration-500",
										style: {
											background: "linear-gradient(135deg, #7A0F13 0%, #A11418 100%)",
											borderColor: "rgba(200,29,36,0.4)",
											color: "#fff",
											boxShadow: "0 0 30px rgba(122,15,19,0.3)"
										},
										children: ["Explore Cases", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "group flex items-center justify-center gap-2 rounded-lg border px-6 py-3.5 font-mono text-[11px] tracking-[0.15em] uppercase transition-all duration-500",
										style: {
											background: "rgba(255,255,255,0.04)",
											borderColor: "rgba(255,255,255,0.1)",
											color: "#A8A8A8",
											backdropFilter: "blur(10px)"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
											className: "h-3 w-3",
											style: { color: "#C81D24" }
										}), "Watch Preview"]
									})]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-12",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-6 flex flex-wrap items-center justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-[2px] w-8",
										style: { background: "#7A0F13" }
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-[16px] tracking-[0.25em] uppercase sm:text-[18px]",
										style: { color: "#fff" },
										children: "The Evidence Locker"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/cases",
									className: "group flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] uppercase transition-colors duration-300",
									style: { color: "#888" },
									children: ["View All Cases", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-8 flex w-fit items-center gap-1 rounded-xl border p-1.5",
								style: {
									background: "rgba(11,11,11,0.9)",
									borderColor: "rgba(255,255,255,0.06)"
								},
								children: [{
									key: "CASES",
									label: "All Cases",
									icon: FolderOpen
								}, {
									key: "KITS",
									label: "Case Kits",
									icon: Boxes
								}].map(({ key, label, icon: Ic }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setStoreTab(key),
									className: "flex items-center gap-2 rounded-lg px-4 py-2.5 font-mono text-[11px] font-semibold tracking-[0.15em] uppercase transition-all duration-500 sm:px-6",
									style: {
										background: storeTab === key ? "linear-gradient(135deg, #7A0F13 0%, #A11418 100%)" : "transparent",
										color: storeTab === key ? "#fff" : "#777",
										border: storeTab === key ? "1px solid rgba(200,29,36,0.4)" : "1px solid transparent",
										boxShadow: storeTab === key ? "0 0 20px rgba(122,15,19,0.25)" : "none"
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ic, { className: "h-3.5 w-3.5" }),
										label,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-md px-1.5 py-0.5 font-mono text-[8px]",
											style: {
												background: storeTab === key ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
												color: storeTab === key ? "#fff" : "#999"
											},
											children: key === "CASES" ? products.length : caseKits.length
										})
									]
								}, key))
							}),
							storeTab === "KITS" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaseKitsEvidence, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "relative mt-8 overflow-hidden",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
                    @keyframes scan-line {
                      0% { top: -2px; opacity: 0; }
                      10% { opacity: 0.6; }
                      90% { opacity: 0.6; }
                      100% { top: 100%; opacity: 0; }
                    }
                    @keyframes edge-glow {
                      0%, 100% { box-shadow: 0 0 15px rgba(200,29,36,0.15), inset 0 0 15px rgba(200,29,36,0.05); }
                      50% { box-shadow: 0 0 25px rgba(200,29,36,0.3), inset 0 0 25px rgba(200,29,36,0.1); }
                    }
                    .dz-kit-image-wrap:hover .dz-scan-line {
                      animation: scan-line 2.5s ease-in-out infinite;
                    }
                    .dz-kit-image-wrap {
                      animation: edge-glow 4s ease-in-out infinite;
                    }
                  ` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mx-auto max-w-[1400px] px-4 sm:px-8",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-4 mb-8",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-gradient-to-r from-transparent via-[#C81D24]/30 to-transparent" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-[10px] tracking-[0.3em] text-[#C81D24]/60 uppercase",
													children: "Featured Investigation"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-gradient-to-r from-transparent via-[#C81D24]/30 to-transparent" })
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col lg:flex-row gap-10 lg:gap-16 items-start",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "dz-kit-image-wrap relative w-full lg:w-[58%] xl:w-[55%] overflow-hidden rounded-[3px] cursor-pointer",
												style: { border: "1px solid rgba(200,29,36,0.15)" },
												onMouseEnter: () => setDz001Hovered(true),
												onMouseLeave: () => setDz001Hovered(false),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "dz-scan-line absolute left-0 right-0 h-[2px] z-20 pointer-events-none",
														style: {
															background: "linear-gradient(90deg, transparent 0%, rgba(200,29,36,0.6) 50%, transparent 100%)",
															top: "-2px",
															opacity: 0
														}
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "absolute inset-0 z-10 pointer-events-none opacity-[0.04]",
														style: { backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')" }
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: featuredSettings.image,
														alt: `${featuredSettings.code} ${featuredSettings.title}`,
														className: "w-full h-auto object-contain transition-all duration-[600ms] ease-out",
														style: {
															transform: dz001Hovered ? "scale(1.025) translateY(-4px)" : "scale(1) translateY(0)",
															filter: dz001Hovered ? "brightness(1.05) contrast(1.02)" : "brightness(1) contrast(1)"
														}
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "absolute bottom-0 left-0 right-0 h-16 z-10 pointer-events-none",
														style: { background: "linear-gradient(to top, #050505 0%, transparent 100%)" }
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "w-full lg:w-[42%] xl:w-[45%] flex flex-col justify-center lg:py-8 transition-all duration-[600ms] ease-out",
												style: { transform: dz001Hovered ? "translateY(-6px)" : "translateY(0)" },
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-3 mb-4",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-mono text-[13px] tracking-[0.3em] text-[#C81D24] font-bold",
																children: featuredSettings.code
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px w-8 bg-[#C81D24]/40" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-mono text-[9px] tracking-[0.2em] text-[#555] uppercase",
																children: "Official Investigation"
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
														className: "font-display text-[32px] lg:text-[40px] xl:text-[46px] tracking-[0.04em] uppercase text-white leading-[0.95] transition-all duration-500",
														children: dz001Hovered ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[#C81D24]",
															children: featuredSettings.hover_title
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-white",
															children: featuredSettings.title
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-5 text-[15px] leading-[1.7] text-[#888] font-sans max-w-md",
														style: { fontStyle: "italic" },
														children: featuredSettings.quote
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-7 flex flex-wrap gap-6 text-[12px] font-mono text-[#aaa] tracking-[0.15em] uppercase",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex flex-col gap-0.5",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-[#C81D24] text-[18px] font-bold tracking-normal",
																	children: "01"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-[10px] text-[#555]",
																	children: "Case"
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex flex-col gap-0.5",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-[#C81D24] text-[18px] font-bold tracking-normal",
																	children: featuredSettings.duration
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-[10px] text-[#555]",
																	children: "Hours"
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex flex-col gap-0.5",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-[#C81D24] text-[18px] font-bold tracking-normal",
																	children: featuredSettings.level
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-[10px] text-[#555]",
																	children: "Level"
																})]
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-8 flex items-baseline gap-3",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-display text-[36px] font-bold text-white",
															children: [
																"₹",
																featuredSettings.price,
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-[20px] text-[#666]",
																	children: "/-"
																})
															]
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-1 font-mono text-[10px] tracking-[0.2em] text-[#555] uppercase",
														children: "Free Shipping & Taxes Included"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														onClick: () => addToCart(liveProducts[0] || products[0]),
														className: "group/cta mt-8 flex items-center gap-3 rounded-[3px] py-3.5 px-7 font-mono text-[12px] font-bold tracking-[0.2em] uppercase transition-all duration-500 cursor-pointer w-fit",
														style: {
															background: "linear-gradient(135deg, #7A0F13 0%, #A11418 100%)",
															border: "1px solid rgba(200,29,36,0.5)",
															color: "#fff",
															boxShadow: "0 0 30px rgba(122,15,19,0.2)"
														},
														children: ["Add to Cart", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 transition-transform duration-500 group-hover/cta:translate-x-1.5" })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-10 border-t border-white/5 pt-6",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6",
															children: [
																"30+ Authentic Documents",
																"Exclusive Audio Evidence",
																"Crime Scene Photographs",
																"Digital Evidence",
																"Forensic Analysis",
																"Hidden Clues & Secret Files"
															].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex items-center gap-2.5",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-1 rounded-full bg-[#C81D24]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-mono text-[10px] tracking-[0.15em] text-[#666] uppercase",
																	children: item
																})]
															}, item))
														})
													})
												]
											})]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-16",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaseKitCards, {
										kits: kitsEvidence,
										signatures: liveSignatures,
										images: [
											sigAudio,
											sigCamera,
											sigFiles,
											sigMobile,
											sigPuzzle,
											sigTime,
											dz001Kit
										],
										onAdd: (kit) => {
											const orig = caseKits.find((c) => c.id === kit.id);
											if (orig) addKitToCart(orig);
										}
									})
								})
							] }),
							storeTab === "CASES" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col lg:flex-row gap-8 lg:gap-12 items-start mt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									ref: featuredRef,
									className: "w-full lg:w-[42%] xl:w-[38%] lg:sticky lg:top-[96px] z-10 transition-all duration-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "group relative flex flex-col justify-end overflow-hidden border border-white/5 bg-[#090909] rounded-[4px] h-[460px] lg:h-[530px] p-3.5 lg:p-4",
										style: { boxShadow: "0 20px 50px rgba(0,0,0,0.8)" },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "absolute inset-0 z-0 overflow-hidden",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: products[0].image,
													alt: products[0].title,
													className: "h-full w-full object-cover origin-center opacity-45 brightness-75 contrast-125 transition-transform duration-700",
													style: { transform: `translateY(${featuredParallax}px) scale(1.15)` }
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "absolute inset-0",
													style: { background: "linear-gradient(to top, rgba(9,9,9,1) 0%, rgba(9,9,9,0.8) 30%, transparent 70%)" }
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "absolute inset-0",
													style: { background: "radial-gradient(ellipse at center, transparent 30%, rgba(5,5,5,0.9) 100%)" }
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative z-10 flex flex-col h-full justify-between pointer-events-none",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between w-full",
												children: [products[0].stock > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1.5 rounded-[3px] px-2.5 py-1 font-mono text-[9px] font-bold tracking-[0.2em] uppercase border border-[#C81D24]/60 bg-black/90 text-[#FF4A50] shadow-[0_0_12px_rgba(200,29,36,0.35)] backdrop-blur-md",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block w-1.5 h-1.5 rounded-full bg-[#C81D24] animate-pulse" }),
														"IN STOCK · ",
														products[0].stock,
														" UNITS"
													]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1.5 rounded-[3px] px-2.5 py-1 font-mono text-[9px] font-bold tracking-[0.2em] uppercase border border-red-950/60 bg-black/85 text-[#777] shadow-[0_0_8px_rgba(0,0,0,0.6)] backdrop-blur-md",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block w-1.5 h-1.5 rounded-full bg-red-900/60" }), "OUT OF STOCK"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => setQuickView(products[0]),
														className: "flex h-7 w-7 items-center justify-center rounded-[3px] transition-all duration-300 hover:bg-white/10 pointer-events-auto",
														style: {
															background: "rgba(0,0,0,0.4)",
															border: "1px solid rgba(255,255,255,0.1)"
														},
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5 text-white" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-[10px] tracking-[0.25em] text-[#555] font-semibold",
														children: products[0].caseNumber
													})]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "pointer-events-auto",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
														className: "font-display text-[18px] lg:text-[22px] tracking-[0.05em] uppercase text-white leading-tight transition-transform duration-500 group-hover:translate-x-1",
														children: products[0].title
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-1 text-[10.5px] leading-normal text-[#888] font-sans max-w-[260px]",
														children: products[0].description
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-2.5 flex flex-wrap gap-1.5 items-center text-[8.5px] font-mono text-[#666]",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "border border-white/5 bg-white/[0.02] px-1.5 py-0.5 uppercase tracking-wider",
															children: ["DIFFICULTY: ", products[0].difficulty]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "border border-white/5 bg-white/[0.02] px-1.5 py-0.5 uppercase tracking-wider",
															children: ["TIME: ", products[0].duration]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-2.5 flex items-center justify-between border-t border-white/5 pt-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-display text-[18px] font-bold text-[#C81D24]",
															children: fmt(products[0].price)
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1",
															children: [[...Array(5)].map((_, si) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
																className: "h-3 w-3",
																style: {
																	fill: si < products[0].stars ? "#C81D24" : "transparent",
																	color: si < products[0].stars ? "#C81D24" : "#222"
																}
															}, si)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "ml-1 font-mono text-[8px] text-[#555] font-semibold",
																children: [
																	"(",
																	products[0].reviews,
																	")"
																]
															})]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-3 flex flex-col sm:flex-row gap-3",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => addToCart(products[0]),
															className: "flex-1 flex items-center justify-center gap-2 rounded-[3px] py-2.5 font-mono text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer",
															style: {
																background: addedIds.has(products[0].id) ? "rgba(20,120,20,0.8)" : "rgba(200,29,36,0.15)",
																border: addedIds.has(products[0].id) ? "1px solid rgba(20,120,20,0.4)" : "1px solid rgba(200,29,36,0.4)",
																color: "#fff"
															},
															children: addedIds.has(products[0].id) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-3.5 w-3.5" }), " Added!"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-3.5 w-3.5" }), " Add to Cart"] })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
															to: "/cases/$caseId",
															params: { caseId: products[0].caseNumber.replace("CASE ", "") },
															className: "group/btn flex items-center justify-center gap-2 rounded-[3px] border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] py-2.5 px-3.5 font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-white transition-all duration-300",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Case" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 transform -translate-x-1 opacity-0 transition-all duration-300 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 group-hover:translate-x-0 group-hover:opacity-100" })]
														})]
													})
												]
											})]
										})]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "w-full lg:w-[58%] xl:w-[62%] flex flex-col gap-3 lg:gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex justify-center my-1 opacity-60",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-[#090909] text-[#C81D24] shadow-md",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
											})
										}),
										products.slice(1).map((p, idx) => {
											const heights = [
												"230px",
												"265px",
												"240px",
												"255px",
												"245px"
											];
											const cardHeight = heights[idx % heights.length];
											const delay = idx * .1;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollReveal, {
												delay,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "group relative flex flex-col md:flex-row overflow-hidden border border-white/5 bg-[#090909] rounded-[4px] transition-all duration-500 hover:-translate-y-1 hover:border-[#C81D24]/30",
													style: {
														height: `min-content`,
														minHeight: cardHeight,
														boxShadow: "0 10px 30px rgba(0,0,0,0.6)"
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "relative w-full md:w-[48%] overflow-hidden h-[135px] md:h-auto min-h-[135px]",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
																src: p.image,
																alt: p.title,
																className: "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "absolute inset-0",
																style: { background: "linear-gradient(to top, rgba(9,9,9,0.95) 0%, rgba(9,9,9,0.4) 40%, transparent 80%)" }
															}),
															p.stock > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-[3px] px-2 py-0.5 font-mono text-[8px] font-bold tracking-[0.18em] uppercase border border-[#C81D24]/60 bg-black/90 text-[#FF4A50] shadow-[0_0_12px_rgba(200,29,36,0.35)] backdrop-blur-md z-10",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block w-1.5 h-1.5 rounded-full bg-[#C81D24] animate-pulse" }),
																	"IN STOCK · ",
																	p.stock,
																	" UNITS"
																]
															}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-[3px] px-2 py-0.5 font-mono text-[8px] font-bold tracking-[0.18em] uppercase border border-red-950/50 bg-black/85 text-[#777] shadow-[0_0_8px_rgba(0,0,0,0.6)] backdrop-blur-md z-10",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block w-1.5 h-1.5 rounded-full bg-red-900/60" }), "OUT OF STOCK"]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																onClick: () => setQuickView(p),
																className: "absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-[3px] opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer",
																style: {
																	background: "rgba(0,0,0,0.6)",
																	backdropFilter: "blur(8px)",
																	border: "1px solid rgba(255,255,255,0.1)"
																},
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3 text-white" })
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "absolute bottom-4 left-4 right-4 pointer-events-none",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-mono text-[9px] tracking-[0.2em] text-[#555] font-semibold block",
																	children: p.caseNumber
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
																	className: "mt-0.5 font-display text-[22px] tracking-[0.05em] uppercase text-white leading-tight transition-transform duration-500 group-hover:translate-x-1",
																	children: p.title
																})]
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "w-full md:w-[52%] flex flex-col justify-between p-3 lg:p-4 border-t md:border-t-0 md:border-l border-white/5 bg-[#0b0b0b]",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "mb-2 border-b border-white/5 pb-1.5",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-mono text-[9.5px] tracking-[0.2em] text-[#C81D24] font-semibold block",
																	children: p.caseNumber
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
																	className: "font-display text-[22px] tracking-[0.05em] uppercase text-white leading-tight transition-transform duration-500 group-hover:translate-x-1",
																	children: p.title
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "text-[15px] leading-relaxed text-[#777] font-sans",
																children: p.description
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "mt-3 flex flex-wrap gap-1.5 items-center text-[9.5px] font-mono text-[#555]",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: "border border-white/5 bg-white/[0.01] px-2 py-0.5 uppercase tracking-wider",
																	children: ["DIFFICULTY: ", p.difficulty]
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: "border border-white/5 bg-white/[0.01] px-2 py-0.5 uppercase tracking-wider",
																	children: ["TIME: ", p.duration]
																})]
															})
														] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "mt-3",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex items-center justify-between border-t border-white/5 pt-2",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-display text-[16px] font-bold text-[#C81D24]",
																	children: fmt(p.price)
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "flex items-center gap-1",
																	children: [[...Array(5)].map((_, si) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
																		className: "h-2.5 w-2.5",
																		style: {
																			fill: si < p.stars ? "#C81D24" : "transparent",
																			color: si < p.stars ? "#C81D24" : "#222"
																		}
																	}, si)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																		className: "ml-1 font-mono text-[8px] text-[#444] font-semibold",
																		children: [
																			"(",
																			p.reviews,
																			")"
																		]
																	})]
																})]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "mt-3 flex gap-2",
																children: [p.stock > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																	onClick: () => addToCart(p),
																	className: "flex-1 flex items-center justify-center gap-1.5 rounded-[3px] py-2 font-mono text-[9px] font-semibold tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer",
																	style: {
																		background: addedIds.has(p.id) ? "rgba(20,120,20,0.8)" : "rgba(255,255,255,0.02)",
																		border: addedIds.has(p.id) ? "1px solid rgba(20,120,20,0.4)" : "1px solid rgba(255,255,255,0.08)",
																		color: addedIds.has(p.id) ? "#fff" : "#bbb"
																	},
																	children: addedIds.has(p.id) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-3 w-3" }), " Added!"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-3 w-3" }), " Add to Cart"] })
																}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																	disabled: true,
																	className: "flex-1 flex items-center justify-center gap-1.5 rounded-[3px] py-2 font-mono text-[9px] font-semibold tracking-[0.15em] uppercase border border-white/10 bg-white/[0.02] text-white/40 cursor-not-allowed",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3 text-red-500/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Out of Stock" })]
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
																	to: "/cases/$caseId",
																	params: { caseId: p.caseNumber.replace("CASE ", "") },
																	className: "group/btn flex items-center justify-center gap-1.5 rounded-[3px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] py-2 px-3 font-mono text-[9px] font-semibold tracking-[0.15em] uppercase text-[#C81D24] hover:text-white transition-all duration-300",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Investigate" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3 transform -translate-x-1 opacity-0 transition-all duration-300 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 group-hover:translate-x-0 group-hover:opacity-100" })]
																})]
															})]
														})]
													})]
												})
											}, p.id);
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex justify-center my-1 opacity-60",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-[#090909] text-[#C81D24] shadow-md",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
											})
										})
									]
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setCartOpen(true),
				"aria-label": "Open Cart",
				className: "fixed z-[100] flex items-center justify-center rounded-full transition-all duration-500 hover:scale-110 active:scale-95 cursor-pointer",
				style: {
					bottom: 32,
					right: 32,
					width: 58,
					height: 58,
					background: "linear-gradient(135deg, #8B1116 0%, #C81D24 100%)",
					border: "1px solid rgba(255,255,255,0.2)",
					boxShadow: "0 0 35px rgba(200,29,36,0.5), 0 8px 24px rgba(0,0,0,0.6)",
					color: "#fff"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-6 w-6" }), totalCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full font-mono text-[10px] font-bold shadow-lg",
					style: {
						background: "#ffffff",
						color: "#C81D24",
						boxShadow: "0 0 12px rgba(255,255,255,0.8)",
						animation: "badge-pulse 2s ease-in-out infinite"
					},
					children: totalCount
				})]
			}),
			cartOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[150]",
				style: {
					background: "rgba(0,0,0,0.7)",
					backdropFilter: "blur(6px)"
				},
				onClick: () => setCartOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed top-0 right-0 z-[160] flex h-full flex-col transition-transform duration-500 ease-out",
				style: {
					width: "min(400px, 100vw)",
					transform: cartOpen ? "translateX(0)" : "translateX(100%)",
					background: "rgba(8,8,8,0.98)",
					borderLeft: "1px solid rgba(255,255,255,0.08)",
					backdropFilter: "blur(30px)",
					boxShadow: cartOpen ? "-20px 0 60px rgba(0,0,0,0.8)" : "none"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b px-6 py-5",
						style: { borderColor: "rgba(255,255,255,0.08)" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4 w-4 text-blood" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-[14px] tracking-[0.15em] uppercase font-bold text-white",
									children: "Your Cart"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-5 w-5 items-center justify-center rounded-full font-mono text-[9px] font-bold bg-blood/20 text-blood",
									children: totalCount
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setCartOpen(false),
							className: "flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/60 hover:text-white transition-colors cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 overflow-y-auto",
						style: {
							scrollbarWidth: "thin",
							scrollbarColor: "#333 transparent"
						},
						children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-center px-6 py-20",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-10 w-10 text-white/20" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 font-mono text-[11px] tracking-[0.1em] text-white/40",
									children: "Your evidence locker is empty"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setCartOpen(false),
									className: "mt-5 rounded-lg border border-white/10 px-5 py-2 font-mono text-[10px] tracking-[0.1em] uppercase text-white/70 hover:text-white hover:border-white/30 transition-colors cursor-pointer",
									children: "Continue Browsing"
								})
							]
						}) : items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-4 border-b border-white/[0.05] px-6 py-5 items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: item.image,
									alt: item.title,
									className: "h-16 w-16 shrink-0 rounded-xl object-cover border border-white/10 bg-black"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate font-display text-[10px] tracking-[0.08em] uppercase text-blood font-bold",
											children: item.caseNumber
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-[12px] text-white/90 font-medium",
											children: item.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2.5 flex items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => updateQuantity(item.id, -1),
													className: "flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:border-blood/40 hover:text-white transition-colors cursor-pointer",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3 w-3" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "w-6 text-center font-mono text-[11px] text-white",
													children: item.quantity
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => updateQuantity(item.id, 1),
													className: "flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:border-blood/40 hover:text-white transition-colors cursor-pointer",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" })
												})
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-end justify-between self-stretch",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => removeFromCart(item.id),
										className: "flex h-6 w-6 items-center justify-center rounded-full text-white/40 hover:text-red-400 transition-colors cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-[14px] font-bold text-white",
										children: fmt(item.price * item.quantity)
									})]
								})
							]
						}, item.id))
					}),
					items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-white/10 px-6 py-5 bg-[#0a0a0a]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2 font-mono text-[11px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-white/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-white",
										children: fmt(subtotal)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-white/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shipping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-emerald-400 font-bold",
										children: subtotal >= 1499 ? "FREE" : "₹99"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3.5 flex justify-between border-t border-white/10 pt-3.5 items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] tracking-[0.1em] uppercase text-white/70",
									children: "Total Amount"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-[22px] font-bold text-blood",
									children: fmt(subtotal + (subtotal >= 1499 ? 0 : 99))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/cart",
								onClick: () => setCartOpen(false),
								className: "mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-display text-[12px] tracking-[0.16em] uppercase text-white bg-blood hover:bg-blood/90 transition-all shadow-[0_0_25px_rgba(179,18,23,0.35)] cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Cart & Checkout" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
							})
						]
					})
				]
			}),
			quickView && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[200] flex items-center justify-center",
				style: {
					background: "rgba(0,0,0,0.8)",
					backdropFilter: "blur(8px)"
				},
				onClick: () => setQuickView(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-[640px] max-h-[92vh] overflow-y-auto rounded-2xl border",
					style: {
						background: "#090909",
						borderColor: "rgba(255,255,255,0.08)"
					},
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setQuickView(null),
						className: "absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300",
						style: {
							background: "rgba(255,255,255,0.06)",
							color: "#999"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full overflow-hidden sm:w-1/2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: quickView.image,
								alt: quickView.title,
								className: "h-52 w-full object-cover sm:h-full sm:absolute sm:inset-0",
								style: { minHeight: "clamp(180px, 40vw, 360px)" }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 hidden sm:block",
								style: { background: "linear-gradient(90deg, transparent 60%, rgba(9,9,9,1) 100%)" }
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex w-full flex-col justify-center px-6 py-8 sm:w-1/2 sm:px-8 sm:py-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[9px] tracking-[0.2em]",
									style: { color: "#555" },
									children: quickView.caseNumber
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-1 font-display text-[22px] tracking-[0.06em] uppercase",
									style: { color: "#fff" },
									children: quickView.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-[12px] leading-relaxed",
									style: {
										color: "#888",
										fontFamily: "Inter"
									},
									children: quickView.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1 rounded-md border px-2 py-1 font-mono text-[9px]",
											style: {
												borderColor: "rgba(255,255,255,0.08)",
												color: "#888"
											},
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
												" ",
												quickView.duration
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-md border px-2 py-1 font-mono text-[9px]",
											style: {
												borderColor: "rgba(255,255,255,0.08)",
												color: "#888"
											},
											children: quickView.difficulty
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-md border px-2 py-1 font-mono text-[9px] uppercase",
											style: {
												borderColor: "rgba(255,255,255,0.08)",
												color: quickView.type === "physical" ? "#C81D24" : "#4ade80"
											},
											children: quickView.type
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex items-center gap-1",
									children: [[...Array(5)].map((_, si) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
										className: "h-3.5 w-3.5",
										style: {
											fill: si < quickView.stars ? "#C81D24" : "transparent",
											color: si < quickView.stars ? "#C81D24" : "#444"
										}
									}, si)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "ml-2 font-mono text-[10px]",
										style: { color: "#777" },
										children: [
											"(",
											quickView.reviews,
											" reviews)"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-[28px] font-bold",
										style: {
											color: "#C81D24",
											fontFamily: "Space Grotesk, Inter, sans-serif"
										},
										children: fmt(quickView.price)
									}), quickView.stock <= 10 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-[9px]",
										style: { color: "#C81D24" },
										children: [
											"Only ",
											quickView.stock,
											" left"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										addToCart(quickView);
										setQuickView(null);
									},
									className: "mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-display text-[11px] tracking-[0.15em] uppercase transition-all duration-500",
									style: {
										background: "linear-gradient(135deg, #7A0F13 0%, #A11418 100%)",
										color: "#fff",
										border: "1px solid rgba(200,29,36,0.3)",
										boxShadow: "0 0 20px rgba(122,15,19,0.3)"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-3.5 w-3.5" }), "Add to Evidence Locker"]
								})
							]
						})]
					})]
				})
			})
		]
	});
}
//#endregion
export { StorePage as component };
