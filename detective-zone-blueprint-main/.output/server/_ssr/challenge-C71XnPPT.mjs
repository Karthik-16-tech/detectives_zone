import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { It as ChevronDown, Lt as Check, O as RotateCcw, Ot as Clock, ct as Gift, i as X, l as TriangleAlert, mt as FingerprintPattern, n as ZoomIn, q as Maximize2, r as Zap, t as ZoomOut, vt as Eye, w as Search } from "../_libs/lucide-react.mjs";
import { i as S3_MEDIA } from "./router-CBHk_fdB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/challenge-C71XnPPT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* SpotlightReveal — portable "move the light" effect.
*
* COPY-PASTE READY: no design tokens, no motion/gsap, no Tailwind config needed.
* Only React + inline styles. Works in any React 18/19 app.
*
* How it works
* 1. Track the pointer position inside the container (percent based, so it is resolution independent).
* 2. Smooth it with a requestAnimationFrame lerp (easing 0.12 = heavy cinematic drag, 0.4 = snappy).
* 3. Paint an absolutely positioned overlay with a radial-gradient that is TRANSPARENT in the middle
*    and opaque (the darkness colour) at the edge. The transparent hole is the "flashlight".
* 4. On touch / no-hover devices the light parks in the centre so content stays readable.
*
* Tuning cheat-sheet
*   radius      160–260px  -> torch size
*   softness    0.35–0.75  -> where the fade starts (fraction of radius)
*   darkness    "rgba(9,9,9,0.97)" -> how black the unlit area is
*   ease        0.08–0.35  -> trailing lag of the beam
*/
function SpotlightReveal({ children, radius = 220, softness = .45, darkness = "rgba(9, 9, 9, 0.97)", tint, ease = .14, className, style }) {
	const hostRef = (0, import_react.useRef)(null);
	const target = (0, import_react.useRef)({
		x: 50,
		y: 50
	});
	const current = (0, import_react.useRef)({
		x: 50,
		y: 50
	});
	const [pos, setPos] = (0, import_react.useState)({
		x: 50,
		y: 50
	});
	(0, import_react.useEffect)(() => {
		let frame = 0;
		const loop = () => {
			const c = current.current;
			const t = target.current;
			c.x += (t.x - c.x) * ease;
			c.y += (t.y - c.y) * ease;
			setPos({
				x: Math.round(c.x * 100) / 100,
				y: Math.round(c.y * 100) / 100
			});
			frame = requestAnimationFrame(loop);
		};
		frame = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(frame);
	}, [ease]);
	const move = (clientX, clientY) => {
		const r = hostRef.current?.getBoundingClientRect();
		if (!r) return;
		target.current = {
			x: (clientX - r.left) / r.width * 100,
			y: (clientY - r.top) / r.height * 100
		};
	};
	const core = Math.max(0, Math.min(1, softness)) * 100;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: hostRef,
		onMouseMove: (e) => move(e.clientX, e.clientY),
		onTouchMove: (e) => {
			const t = e.touches[0];
			if (t) move(t.clientX, t.clientY);
		},
		onMouseLeave: () => target.current = {
			x: 50,
			y: 50
		},
		className,
		style: {
			position: "relative",
			overflow: "hidden",
			...style
		},
		children: [
			children,
			tint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				style: {
					position: "absolute",
					inset: 0,
					zIndex: 9,
					pointerEvents: "none",
					background: `radial-gradient(circle ${radius}px at ${pos.x}% ${pos.y}%, ${tint} 0%, transparent 70%)`,
					mixBlendMode: "screen"
				}
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				style: {
					position: "absolute",
					inset: 0,
					zIndex: 10,
					pointerEvents: "none",
					background: `radial-gradient(circle ${radius}px at ${pos.x}% ${pos.y}%, transparent ${core}%, ${darkness} 100%)`
				}
			})
		]
	});
}
var evidenceRoom = S3_MEDIA.evidenceRoom;
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
			animation: `dz-float ${p.dur}s ${p.delay}s ease-in-out infinite alternate`
		} }, p.id))
	});
}
function ScanLine() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"aria-hidden": true,
		className: "pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-[inherit]",
		style: { background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)" }
	});
}
function MysteryCard({ mystery, value, solved, onChange, onSubmit }) {
	const [hintOpen, setHintOpen] = (0, import_react.useState)(false);
	const [shaking, setShaking] = (0, import_react.useState)(false);
	const [focused, setFocused] = (0, import_react.useState)(false);
	const wrong = solved === false;
	const handleSubmit = () => {
		if (!value.trim()) return;
		onSubmit(value);
		if (!mysteries.find((m) => m.id === mystery.id).answers.includes(value.trim().toLowerCase())) {
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
			transition: "border-color 0.4s ease, box-shadow 0.4s ease, transform 0.3s ease",
			boxShadow: solved ? "0 0 30px rgba(211,47,47,0.18), 0 8px 40px rgba(0,0,0,0.6)" : "0 8px 40px rgba(0,0,0,0.5)",
			transform: shaking ? "translateX(0)" : void 0,
			animation: shaking ? "dz-shake 0.5s ease" : void 0
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FingerprintPattern, {
				"aria-hidden": true,
				className: "pointer-events-none absolute right-3 bottom-3 transition-all duration-500 group-hover:opacity-10",
				style: {
					width: 90,
					height: 90,
					color: "rgba(211,47,47,0.05)"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingParticles, { count: 4 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-10 flex items-start justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-10 mt-4",
				style: {
					fontFamily: "IBM Plex Mono, monospace",
					fontSize: 9,
					letterSpacing: "0.15em",
					color: "#444",
					textTransform: "uppercase"
				},
				children: mystery.clue
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "relative z-10 mt-4 leading-snug",
				style: {
					fontFamily: "IBM Plex Mono, monospace",
					fontSize: 14,
					color: "#ECECEC",
					lineHeight: 1.65
				},
				children: mystery.q
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 mt-auto pt-5",
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
							children: solved ? "✓ Verified. Clue logged to archive." : wrong ? "✗ Access denied. Try again." : hintOpen ? `Hint: ${mystery.hint}` : "Answer above to verify the clue."
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
				className: "pointer-events-none absolute inset-0",
				style: {
					borderRadius: 20,
					background: "radial-gradient(ellipse at 50% 80%, rgba(211,47,47,0.08) 0%, transparent 70%)"
				}
			})
		]
	});
}
function Challenge() {
	const [values, setValues] = (0, import_react.useState)({});
	const [solved, setSolved] = (0, import_react.useState)({});
	const [successBurst, setSuccessBurst] = (0, import_react.useState)(false);
	const [imageModalOpen, setImageModalOpen] = (0, import_react.useState)(false);
	const [zoomLevel, setZoomLevel] = (0, import_react.useState)(1);
	const solvedCount = (0, import_react.useMemo)(() => Object.values(solved).filter(Boolean).length, [solved]);
	const unlocked = solvedCount === mysteries.length;
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") setImageModalOpen(false);
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);
	const check = (0, import_react.useCallback)((id, val) => {
		const ok = mysteries.find((x) => x.id === id).answers.includes(val.trim().toLowerCase());
		setSolved((s) => {
			const next = {
				...s,
				[id]: ok
			};
			const nextCount = Object.values(next).filter(Boolean).length;
			if (ok && nextCount === mysteries.length) setTimeout(() => setSuccessBurst(true), 300);
			return next;
		});
	}, []);
	const [breathe, setBreathe] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => setBreathe((v) => !v), 4e3);
		return () => clearInterval(t);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		style: {
			background: "#090909",
			paddingTop: 64,
			fontFamily: "Inter, system-ui, sans-serif"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @keyframes dz-shake {
          0%,100%{transform:translateX(0)}
          15%{transform:translateX(-8px)}
          30%{transform:translateX(8px)}
          45%{transform:translateX(-6px)}
          60%{transform:translateX(6px)}
          75%{transform:translateX(-3px)}
          90%{transform:translateX(3px)}
        }
        @keyframes dz-float {
          0%{transform:translateY(0) scale(1);opacity:.15}
          100%{transform:translateY(-18px) scale(1.5);opacity:.05}
        }
        @keyframes dz-pulse-border {
          0%,100%{box-shadow:0 0 0 0 rgba(211,47,47,0.4)}
          50%{box-shadow:0 0 0 10px rgba(211,47,47,0)}
        }
        @keyframes dz-stamp-drop {
          0%{transform:scale(2.5) rotate(-12deg);opacity:0}
          60%{transform:scale(0.92) rotate(3deg);opacity:1}
          80%{transform:scale(1.06) rotate(-1deg);opacity:1}
          100%{transform:scale(1) rotate(0deg);opacity:1}
        }
        @keyframes dz-scan {
          0%{transform:translateY(-100%)}
          100%{transform:translateY(100vh)}
        }
        @keyframes dz-progress-fill {
          from{width:0}
        }
        @keyframes dz-glow-pulse {
          0%,100%{opacity:.6}
          50%{opacity:1}
        }
        @keyframes dz-breathe {
          0%,100%{transform:scale(1.0)}
          50%{transform:scale(1.04)}
        }
      ` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				className: "pointer-events-none fixed inset-0 z-0",
				style: {
					background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(211,47,47,0.04) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 100%, rgba(211,47,47,0.03) 0%, transparent 60%)",
					backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					maxWidth: 1600,
					margin: "0 auto",
					padding: "48px 32px 80px",
					position: "relative",
					zIndex: 1
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: { marginBottom: 36 },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: 12,
								marginBottom: 12
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
								display: "inline-block",
								width: 32,
								height: 2,
								background: "#D32F2F"
							} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: {
									fontFamily: "IBM Plex Mono, monospace",
									fontSize: 10,
									letterSpacing: "0.28em",
									color: "#D32F2F",
									textTransform: "uppercase"
								},
								children: "File 003 — Case Challenge"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							style: {
								fontFamily: "'Bebas Neue', 'Impact', sans-serif",
								fontSize: "clamp(52px, 7vw, 96px)",
								lineHeight: .92,
								letterSpacing: "0.03em",
								color: "#ECECEC",
								textTransform: "uppercase",
								margin: 0
							},
							children: [
								"Find the",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: {
										color: "#D32F2F",
										textShadow: "0 0 40px rgba(211,47,47,0.6)",
										animation: "dz-glow-pulse 3s ease-in-out infinite"
									},
									children: "3"
								}),
								" ",
								"Hidden Clues"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "1fr 340px",
							gap: 24,
							alignItems: "stretch",
							marginBottom: 24
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SpotlightReveal, {
							radius: 200,
							softness: .42,
							darkness: "rgba(9,9,9,0.88)",
							tint: "rgba(211,47,47,0.12)",
							ease: .12,
							style: {
								borderRadius: 20,
								minHeight: 420,
								overflow: "hidden",
								border: "1px solid rgba(255,255,255,0.06)",
								position: "relative"
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: evidenceRoom,
									alt: "Hotel room evidence scene with desk, notebook, lamp and rain-streaked window",
									loading: "eager",
									style: {
										width: "100%",
										height: "100%",
										objectFit: "cover",
										display: "block",
										minHeight: 420,
										transition: "transform 4s ease-in-out",
										transform: breathe ? "scale(1.04)" : "scale(1.0)"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									"aria-hidden": true,
									style: {
										position: "absolute",
										inset: 0,
										background: "linear-gradient(to top, rgba(9,9,9,0.85) 0%, rgba(9,9,9,0.2) 40%, transparent 70%), linear-gradient(to right, rgba(9,9,9,0.4) 0%, transparent 35%)",
										pointerEvents: "none"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									"aria-hidden": true,
									style: {
										position: "absolute",
										inset: 0,
										background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)",
										pointerEvents: "none"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										position: "absolute",
										bottom: 20,
										left: 24,
										fontFamily: "IBM Plex Mono, monospace",
										fontSize: 10,
										letterSpacing: "0.22em",
										color: "rgba(255,255,255,0.35)",
										textTransform: "uppercase",
										pointerEvents: "none"
									},
									children: "Evidence Photograph — Room 104 — 11:47 PM"
								}),
								[
									{
										top: 16,
										left: 16
									},
									{
										top: 16,
										right: 16
									},
									{
										bottom: 16,
										left: 16
									},
									{
										bottom: 16,
										right: 16
									}
								].map((pos, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									"aria-hidden": true,
									style: {
										position: "absolute",
										...pos,
										width: 18,
										height: 18,
										borderTop: i < 2 ? "2px solid rgba(211,47,47,0.4)" : void 0,
										borderBottom: i >= 2 ? "2px solid rgba(211,47,47,0.4)" : void 0,
										borderLeft: i % 2 === 0 ? "2px solid rgba(211,47,47,0.4)" : void 0,
										borderRight: i % 2 === 1 ? "2px solid rgba(211,47,47,0.4)" : void 0,
										pointerEvents: "none"
									}
								}, i)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										position: "absolute",
										top: 20,
										left: "50%",
										transform: "translateX(-50%)",
										display: "flex",
										alignItems: "center",
										gap: 6,
										fontFamily: "IBM Plex Mono, monospace",
										fontSize: 9,
										letterSpacing: "0.2em",
										color: "rgba(255,255,255,0.25)",
										textTransform: "uppercase",
										background: "rgba(9,9,9,0.5)",
										backdropFilter: "blur(6px)",
										border: "1px solid rgba(255,255,255,0.06)",
										borderRadius: 30,
										padding: "5px 14px",
										pointerEvents: "none"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { style: {
										width: 9,
										height: 9
									} }), "Move light to reveal clues"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setZoomLevel(1);
										setImageModalOpen(true);
									},
									className: "cursor-pointer transition-all duration-300 hover:scale-105",
									style: {
										position: "absolute",
										top: 16,
										right: 16,
										zIndex: 40,
										display: "flex",
										alignItems: "center",
										gap: 7,
										fontFamily: "IBM Plex Mono, monospace",
										fontSize: 9.5,
										fontWeight: 600,
										letterSpacing: "0.18em",
										color: "#FF4A50",
										textTransform: "uppercase",
										background: "rgba(0,0,0,0.85)",
										backdropFilter: "blur(10px)",
										border: "1px solid rgba(200,29,36,0.6)",
										boxShadow: "0 0 16px rgba(200,29,36,0.3)",
										borderRadius: 6,
										padding: "6px 12px"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { style: {
										width: 12,
										height: 12
									} }), "Inspect Scene"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								background: "linear-gradient(160deg, #111111 0%, #0c0c0c 100%)",
								border: "1px solid rgba(255,255,255,0.07)",
								borderRadius: 20,
								padding: "32px 28px",
								display: "flex",
								flexDirection: "column",
								position: "relative",
								overflow: "hidden"
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingParticles, { count: 8 }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										position: "relative",
										zIndex: 1,
										display: "flex",
										alignItems: "start",
										justifyContent: "space-between"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											width: 48,
											height: 48,
											borderRadius: "50%",
											border: "1px solid rgba(255,255,255,0.1)",
											background: "rgba(255,255,255,0.02)",
											display: "flex",
											alignItems: "center",
											justifyContent: "center"
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { style: {
											width: 20,
											height: 20,
											color: "rgba(255,255,255,0.6)"
										} })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: { textAlign: "right" },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											style: {
												fontFamily: "IBM Plex Mono, monospace",
												fontSize: 9,
												letterSpacing: "0.22em",
												color: "#555",
												textTransform: "uppercase"
											},
											children: "Case Challenge"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											style: {
												fontFamily: "IBM Plex Mono, monospace",
												fontSize: 11,
												letterSpacing: "0.16em",
												color: "#D32F2F",
												marginTop: 3
											},
											children: "DZ-CH-001"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									style: {
										position: "relative",
										zIndex: 1,
										fontFamily: "'Bebas Neue', Impact, sans-serif",
										fontSize: 52,
										lineHeight: .95,
										letterSpacing: "0.03em",
										color: "#ECECEC",
										textTransform: "uppercase",
										marginTop: 32
									},
									children: [
										"Find the",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												color: "#D32F2F",
												textShadow: "0 0 30px rgba(211,47,47,0.5)"
											},
											children: "3"
										}),
										" ",
										"hidden",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										"clues"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
									height: 1,
									background: "linear-gradient(90deg, rgba(211,47,47,0.4) 0%, transparent 100%)",
									margin: "20px 0",
									position: "relative",
									zIndex: 1
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									style: {
										position: "relative",
										zIndex: 1,
										fontFamily: "Inter, system-ui, sans-serif",
										fontSize: 13,
										lineHeight: 1.7,
										color: "#888"
									},
									children: "Observe the evidence carefully. Every clue reveals part of the mystery. Solve all three riddles to unlock the classified reward."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										position: "relative",
										zIndex: 1,
										marginTop: 20
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											display: "flex",
											justifyContent: "space-between",
											marginBottom: 8
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												fontFamily: "IBM Plex Mono, monospace",
												fontSize: 9,
												letterSpacing: "0.18em",
												color: "#555",
												textTransform: "uppercase"
											},
											children: "Clues verified"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											style: {
												fontFamily: "IBM Plex Mono, monospace",
												fontSize: 9,
												color: "#D32F2F"
											},
											children: [
												solvedCount,
												" / ",
												mysteries.length
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											height: 3,
											background: "rgba(255,255,255,0.06)",
											borderRadius: 2,
											overflow: "hidden"
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
											height: "100%",
											width: `${solvedCount / mysteries.length * 100}%`,
											background: "linear-gradient(90deg, #D32F2F, #ff6b6b)",
											borderRadius: 2,
											transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
											boxShadow: "0 0 10px rgba(211,47,47,0.5)"
										} })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										position: "relative",
										zIndex: 1,
										marginTop: "auto",
										paddingTop: 24
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											background: "rgba(211,47,47,0.06)",
											border: "1px solid rgba(211,47,47,0.25)",
											borderRadius: 14,
											padding: "18px 20px",
											display: "flex",
											alignItems: "center",
											gap: 16,
											animation: "dz-pulse-border 3s ease-in-out infinite"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												width: 40,
												height: 40,
												borderRadius: "50%",
												background: "rgba(211,47,47,0.12)",
												border: "1px solid rgba(211,47,47,0.3)",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												flexShrink: 0
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { style: {
												width: 18,
												height: 18,
												color: "#D32F2F"
											} })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												style: {
													fontFamily: "IBM Plex Mono, monospace",
													fontSize: 9,
													letterSpacing: "0.18em",
													color: "#555",
													textTransform: "uppercase",
													marginBottom: 3
												},
												children: "Reward"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												style: {
													fontFamily: "'Bebas Neue', Impact, sans-serif",
													fontSize: 32,
													lineHeight: 1,
													letterSpacing: "0.04em",
													color: "#D32F2F",
													textShadow: "0 0 20px rgba(211,47,47,0.4)"
												},
												children: "25% OFF"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												style: {
													fontFamily: "IBM Plex Mono, monospace",
													fontSize: 9,
													letterSpacing: "0.14em",
													color: "#555",
													textTransform: "uppercase",
													marginTop: 2
												},
												children: "On Case File 001"
											})
										] })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									"aria-hidden": true,
									style: {
										position: "absolute",
										bottom: 0,
										left: "50%",
										transform: "translateX(-50%)",
										width: "80%",
										height: "40%",
										background: "radial-gradient(ellipse, rgba(211,47,47,0.06) 0%, transparent 70%)",
										pointerEvents: "none"
									}
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "repeat(3, 1fr)",
							gap: 20,
							marginBottom: 24
						},
						children: mysteries.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MysteryCard, {
							mystery: m,
							value: values[m.id] ?? "",
							solved: solved[m.id],
							onChange: (v) => setValues((prev) => ({
								...prev,
								[m.id]: v
							})),
							onSubmit: (v) => check(m.id, v)
						}, m.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							background: "linear-gradient(145deg, #0f0f0f 0%, #0a0a0a 100%)",
							border: `1px solid ${unlocked ? "rgba(211,47,47,0.4)" : "rgba(255,255,255,0.06)"}`,
							borderRadius: 20,
							padding: "28px 32px",
							position: "relative",
							overflow: "hidden",
							transition: "border-color 0.6s ease, box-shadow 0.6s ease",
							boxShadow: unlocked ? "0 0 60px rgba(211,47,47,0.15)" : "none"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingParticles, { count: 12 }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								"aria-hidden": true,
								style: {
									position: "absolute",
									inset: 0,
									left: 0,
									background: "rgba(211,47,47,0.05)",
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
									background: "linear-gradient(90deg, #D32F2F, rgba(211,47,47,0.2))",
									width: `${solvedCount / mysteries.length * 100}%`,
									transition: "width 1s cubic-bezier(0.34,1.56,0.64,1)",
									boxShadow: "0 0 12px rgba(211,47,47,0.6)",
									pointerEvents: "none"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									position: "relative",
									zIndex: 1,
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									flexWrap: "wrap",
									gap: 24
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: 20
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											width: 44,
											height: 44,
											borderRadius: "50%",
											border: "1px solid rgba(211,47,47,0.3)",
											background: "rgba(211,47,47,0.08)",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											animation: unlocked ? "none" : "dz-pulse-border 2s ease-in-out infinite"
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FingerprintPattern, { style: {
											width: 20,
											height: 20,
											color: "#D32F2F"
										} })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [unlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										style: {
											fontFamily: "'Bebas Neue', Impact, sans-serif",
											fontSize: 22,
											letterSpacing: "0.2em",
											color: "#ECECEC",
											textTransform: "uppercase"
										},
										children: "Access Granted — 25% Off Unlocked"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										style: {
											fontFamily: "IBM Plex Mono, monospace",
											fontSize: 11,
											letterSpacing: "0.2em",
											color: "#666",
											textTransform: "uppercase"
										},
										children: [
											"Complete all three mysteries — ",
											solvedCount,
											"/",
											mysteries.length,
											" verified"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											display: "flex",
											alignItems: "center",
											gap: 6,
											marginTop: 8
										},
										children: mysteries.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
											width: 60,
											height: 4,
											borderRadius: 2,
											background: solved[m.id] ? "#D32F2F" : solved[m.id] === false ? "rgba(255,80,80,0.3)" : "rgba(255,255,255,0.08)",
											transition: "background 0.5s ease",
											boxShadow: solved[m.id] ? "0 0 8px rgba(211,47,47,0.5)" : "none"
										} }, m.id))
									})] })]
								}), unlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: 16
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											fontFamily: "'Bebas Neue', Impact, sans-serif",
											fontSize: 18,
											letterSpacing: "0.22em",
											color: "#D32F2F",
											border: "2px solid #D32F2F",
											padding: "6px 18px",
											transform: "rotate(-3deg)",
											textShadow: "0 0 20px rgba(211,47,47,0.6)",
											boxShadow: "0 0 20px rgba(211,47,47,0.2)",
											animation: successBurst ? "dz-stamp-drop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards" : "none"
										},
										children: "Case Solved"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											display: "flex",
											alignItems: "center",
											gap: 8
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { style: {
											width: 18,
											height: 18,
											color: "#D32F2F"
										} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												fontFamily: "IBM Plex Mono, monospace",
												fontSize: 10,
												letterSpacing: "0.14em",
												color: "#D32F2F",
												textTransform: "uppercase"
											},
											children: "CODE: DZ25-SOLVED"
										})]
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										mysteries.forEach((m) => {
											if (values[m.id]?.trim()) check(m.id, values[m.id]);
										});
									},
									style: {
										display: "flex",
										alignItems: "center",
										gap: 10,
										background: "rgba(211,47,47,0.1)",
										border: "1px solid rgba(211,47,47,0.3)",
										borderRadius: 12,
										padding: "14px 28px",
										fontFamily: "'Bebas Neue', Impact, sans-serif",
										fontSize: 16,
										letterSpacing: "0.2em",
										color: "#D32F2F",
										textTransform: "uppercase",
										cursor: "pointer",
										transition: "all 0.3s ease",
										position: "relative",
										overflow: "hidden"
									},
									onMouseEnter: (e) => {
										e.currentTarget.style.background = "rgba(211,47,47,0.18)";
										e.currentTarget.style.boxShadow = "0 0 30px rgba(211,47,47,0.2)";
									},
									onMouseLeave: (e) => {
										e.currentTarget.style.background = "rgba(211,47,47,0.1)";
										e.currentTarget.style.boxShadow = "none";
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { style: {
										width: 15,
										height: 15
									} }), "Verify Evidence"]
								})]
							}),
							Object.values(solved).some((v) => v === false) && !unlocked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									position: "relative",
									zIndex: 1,
									marginTop: 16,
									display: "flex",
									alignItems: "center",
									gap: 8,
									fontFamily: "IBM Plex Mono, monospace",
									fontSize: 10,
									letterSpacing: "0.14em",
									color: "#ff6060",
									textTransform: "uppercase"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { style: {
									width: 12,
									height: 12
								} }), "Some answers are incorrect. Re-examine the evidence."]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							justifyContent: "center",
							marginTop: 60,
							opacity: .3
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { style: {
							width: 20,
							height: 20,
							color: "#D32F2F",
							animation: "dz-float 2s ease-in-out infinite alternate"
						} })
					})
				]
			}),
			successBurst && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				style: {
					position: "fixed",
					inset: 0,
					zIndex: 9999,
					pointerEvents: "none",
					background: "rgba(211,47,47,0.08)",
					animation: "dz-stamp-drop 0.8s ease forwards"
				}
			}),
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
									src: evidenceRoom,
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
		]
	});
}
//#endregion
export { Challenge as component };
