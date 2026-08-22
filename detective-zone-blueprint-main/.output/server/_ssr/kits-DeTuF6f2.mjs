import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { D as Save, P as Plus, i as X, jt as CircleCheck, m as Sparkles, p as SquarePen, s as Upload, st as Image, u as Trash2, vt as Eye, x as ShieldCheck } from "../_libs/lucide-react.mjs";
import { c as api } from "./router-CBHk_fdB.mjs";
import { t as AdminLayout } from "./AdminLayout-BazMIgX5.mjs";
import { t as ImageUploadField } from "./ImageUploadField-DjD9Z7O9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kits-DeTuF6f2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var image_default = "/assets/image-NPnMH1my.png";
function AdminKits() {
	const [signatures, setSignatures] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [showSigModal, setShowSigModal] = (0, import_react.useState)(false);
	const [editingSig, setEditingSig] = (0, import_react.useState)(null);
	const [uploadingFeaturedImage, setUploadingFeaturedImage] = (0, import_react.useState)(false);
	const [uploadingSigModalImage, setUploadingSigModalImage] = (0, import_react.useState)(false);
	const [savingFeatured, setSavingFeatured] = (0, import_react.useState)(false);
	const [toastMessage, setToastMessage] = (0, import_react.useState)(null);
	const [featuredKit, setFeaturedKit] = (0, import_react.useState)({
		code: "DZ-001",
		title: "The Last Voicemail",
		hover_title: "The Case Is Open.",
		quote: "A sealed case. A missing voice. Thirty pieces of evidence standing between you and the truth.",
		price: "999",
		duration: "3–4",
		level: "Expert",
		image: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/case_kits/image.png"
	});
	const [sigForm, setSigForm] = (0, import_react.useState)({
		label: "",
		image_url: "",
		description: "",
		authenticity_note: "Verified Authentic Field Clue"
	});
	(0, import_react.useEffect)(() => {
		loadData();
	}, []);
	const showToast = (msg) => {
		setToastMessage(msg);
		setTimeout(() => setToastMessage(null), 3e3);
	};
	const loadData = async () => {
		try {
			setLoading(true);
			const [sigData, settingsData] = await Promise.all([api.getSignatures().catch(() => []), api.getSettings().catch(() => ({}))]);
			setSignatures(sigData);
			if (settingsData && Object.keys(settingsData).length > 0) setFeaturedKit({
				code: settingsData.featured_kit_code || "DZ-001",
				title: settingsData.featured_kit_title || "The Last Voicemail",
				hover_title: settingsData.featured_kit_hover_title || "The Case Is Open.",
				quote: settingsData.featured_kit_quote || "A sealed case. A missing voice. Thirty pieces of evidence standing between you and the truth.",
				price: settingsData.featured_kit_price || "999",
				duration: settingsData.featured_kit_duration || "3–4",
				level: settingsData.featured_kit_level || "Expert",
				image: settingsData.featured_kit_image || "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/case_kits/image.png"
			});
		} catch (err) {
			console.log("Error loading kits:", err);
		} finally {
			setLoading(false);
		}
	};
	const handleSaveFeatured = async (e) => {
		e.preventDefault();
		setSavingFeatured(true);
		try {
			await api.updateSettings({
				featured_kit_code: featuredKit.code,
				featured_kit_title: featuredKit.title,
				featured_kit_hover_title: featuredKit.hover_title,
				featured_kit_quote: featuredKit.quote,
				featured_kit_price: featuredKit.price,
				featured_kit_duration: featuredKit.duration,
				featured_kit_level: featuredKit.level,
				featured_kit_image: featuredKit.image
			});
			showToast("Featured Investigation updated live");
		} catch (err) {
			alert(err.message || "Failed to update Featured Investigation");
		} finally {
			setSavingFeatured(false);
		}
	};
	const handleUploadSigModalImage = async (e, isEdit) => {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			setUploadingSigModalImage(true);
			const media = await api.uploadMedia(file, "signatures");
			if (isEdit && editingSig) setEditingSig((prev) => ({
				...prev,
				image_url: media.url
			}));
			else setSigForm((prev) => ({
				...prev,
				image_url: media.url
			}));
			showToast("Signature image uploaded");
		} catch (err) {
			alert(err.message || "Failed to upload image");
		} finally {
			setUploadingSigModalImage(false);
		}
	};
	const handleCreateSig = async (e) => {
		e.preventDefault();
		try {
			const created = await api.createSignature(sigForm);
			setSignatures([...signatures, created]);
			setShowSigModal(false);
			setSigForm({
				label: "",
				image_url: "",
				description: "",
				authenticity_note: "Verified Authentic Field Clue"
			});
			showToast("Signature clue added");
		} catch (err) {
			alert(err.message || "Failed to add signature clue");
		}
	};
	const handleUpdateSig = async (e) => {
		e.preventDefault();
		if (!editingSig) return;
		try {
			const updated = await api.updateSignature(editingSig.id, {
				label: editingSig.label,
				image_url: editingSig.image_url,
				description: editingSig.description,
				authenticity_note: editingSig.authenticity_note
			});
			setSignatures(signatures.map((s) => s.id === editingSig.id ? updated : s));
			setEditingSig(null);
			showToast("Signature clue updated");
		} catch (err) {
			alert(err.message || "Failed to update signature clue");
		}
	};
	const handleDeleteSig = async (id) => {
		if (!window.confirm("Delete signature evidence item?")) return;
		try {
			await api.deleteSignature(id);
			setSignatures(signatures.filter((s) => s.id !== id));
			showToast("Signature item deleted");
		} catch (err) {
			alert(err.message || "Failed to delete signature");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, {
		title: "Case Kits CMS",
		subtitle: "Manage the Featured Investigation Case Box & Forensic Signature Evidence Artifacts",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setShowSigModal(true),
			className: "flex items-center gap-2 rounded-lg border border-white/20 bg-white/[0.04] px-3.5 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-white/[0.08] transition-all cursor-pointer",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add Signature Clue" })]
		}),
		children: [
			toastMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-500/40 bg-[#080808]/95 px-5 py-3 font-mono text-xs text-emerald-400 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-md animate-in fade-in",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: toastMessage })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-10 rounded-2xl border border-blood/30 bg-gradient-to-b from-blood/[0.08] to-transparent p-6 sm:p-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-10 w-10 items-center justify-center rounded-xl bg-blood/20 text-blood border border-blood/40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[10px] font-bold uppercase text-blood tracking-wider bg-blood/10 px-2 py-0.5 rounded border border-blood/20",
								children: "Case Box 1"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-bold uppercase tracking-wider text-white",
								children: "Featured Investigation (DZ-001)"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] text-white/50 uppercase tracking-wider mt-0.5",
							children: "Primary Showcase Box — Hero Presentation & Direct Case File"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "self-start sm:self-auto rounded bg-blood/20 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-blood border border-blood/40",
						children: [featuredKit.code, " Live"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveFeatured,
						className: "lg:col-span-8 space-y-5 font-mono text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 md:grid-cols-3 gap-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase text-white/60 mb-1.5",
										children: "Case Code"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										required: true,
										value: featuredKit.code,
										onChange: (e) => setFeaturedKit({
											...featuredKit,
											code: e.target.value
										}),
										placeholder: "DZ-001",
										className: "w-full rounded-lg border border-white/10 bg-black/70 p-2.5 text-white outline-none focus:border-blood"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase text-white/60 mb-1.5",
										children: "Main Title"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										required: true,
										value: featuredKit.title,
										onChange: (e) => setFeaturedKit({
											...featuredKit,
											title: e.target.value
										}),
										placeholder: "The Last Voicemail",
										className: "w-full rounded-lg border border-white/10 bg-black/70 p-2.5 text-white outline-none focus:border-blood"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase text-white/60 mb-1.5",
										children: "Hover State Headline"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										required: true,
										value: featuredKit.hover_title,
										onChange: (e) => setFeaturedKit({
											...featuredKit,
											hover_title: e.target.value
										}),
										placeholder: "The Case Is Open.",
										className: "w-full rounded-lg border border-white/10 bg-black/70 p-2.5 text-white outline-none focus:border-blood"
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block uppercase text-white/60 mb-1.5",
								children: "Dramatic Quote / Synopsis"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 2,
								required: true,
								value: featuredKit.quote,
								onChange: (e) => setFeaturedKit({
									...featuredKit,
									quote: e.target.value
								}),
								placeholder: "\"A sealed case. A missing voice. Thirty pieces of evidence standing between you and the truth.\"",
								className: "w-full rounded-lg border border-white/10 bg-black/70 p-2.5 text-white outline-none focus:border-blood resize-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-3 gap-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase text-white/60 mb-1.5",
										children: "Price (₹ INR)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										required: true,
										value: featuredKit.price,
										onChange: (e) => setFeaturedKit({
											...featuredKit,
											price: e.target.value
										}),
										placeholder: "999",
										className: "w-full rounded-lg border border-white/10 bg-black/70 p-2.5 text-white outline-none focus:border-blood"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase text-white/60 mb-1.5",
										children: "Investigation Time"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										required: true,
										value: featuredKit.duration,
										onChange: (e) => setFeaturedKit({
											...featuredKit,
											duration: e.target.value
										}),
										placeholder: "3–4",
										className: "w-full rounded-lg border border-white/10 bg-black/70 p-2.5 text-white outline-none focus:border-blood"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase text-white/60 mb-1.5",
										children: "Difficulty Level"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										required: true,
										value: featuredKit.level,
										onChange: (e) => setFeaturedKit({
											...featuredKit,
											level: e.target.value
										}),
										placeholder: "Expert",
										className: "w-full rounded-lg border border-white/10 bg-black/70 p-2.5 text-white outline-none focus:border-blood"
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadField, {
								label: "Cinematic Box Image (S3 URL or Upload)",
								value: featuredKit.image,
								onChange: (val) => setFeaturedKit({
									...featuredKit,
									image: val
								}),
								folder: "kits",
								placeholder: "/src/assets/case kits/image.png or https://bucket.s3.amazonaws.com/kits/box.png"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-end pt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									disabled: savingFeatured,
									className: "flex items-center gap-2 rounded-lg bg-blood px-6 py-2.5 font-display text-[12px] font-semibold uppercase tracking-wider text-white hover:bg-blood/90 transition-all shadow-[0_0_20px_rgba(179,18,23,0.35)] cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: savingFeatured ? "Saving..." : "Save Box 1 (Featured Investigation)" })]
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-4 rounded-xl border border-white/10 bg-black/80 p-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-white/10 pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-[10px] uppercase tracking-widest text-white/50 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Store Preview (Box 1)" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[10px] text-blood font-bold",
									children: featuredKit.code
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/10 bg-[#050505] flex items-center justify-center",
								children: featuredKit.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: featuredKit.image.startsWith("/src") ? image_default : featuredKit.image,
									alt: featuredKit.title,
									className: "h-full w-full object-contain p-2 hover:scale-105 transition-transform duration-500"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center gap-2 text-white/30",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-8 w-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[10px]",
										children: "No image selected"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-display text-sm font-bold uppercase text-white tracking-wider truncate",
										children: featuredKit.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 font-mono text-[10px] text-white/50 line-clamp-2 italic",
										children: [
											"\"",
											featuredKit.quote,
											"\""
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex items-center justify-between pt-2 border-t border-white/[0.06] font-mono text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-emerald-400",
											children: ["₹", featuredKit.price]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-white/40",
											children: [
												featuredKit.duration,
												" hrs • ",
												featuredKit.level
											]
										})]
									})
								]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-display text-base font-bold uppercase tracking-wider text-white",
					children: [
						"Signature Clues & Prop Artifacts (",
						signatures.length,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] text-white/50 uppercase tracking-wider",
					children: "Forensic photos & physical clues displayed in The Signature Collection and Store"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setShowSigModal(true),
					className: "flex items-center gap-2 rounded-lg bg-blood/20 border border-blood/40 px-3 py-1.5 font-display text-[11px] font-semibold uppercase tracking-wider text-blood hover:bg-blood hover:text-white transition-all cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add Clue" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
				children: signatures.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#070707] p-4 transition-all hover:border-white/20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3.5 min-w-0",
						children: [s.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: s.image_url,
							alt: s.label,
							className: "h-14 w-14 rounded-lg object-cover border border-white/10 bg-black shrink-0"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-14 w-14 items-center justify-center rounded-lg bg-white/5 text-white/20 border border-white/10 shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-6 w-6 text-blood" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
									className: "font-display text-xs uppercase font-bold text-white tracking-wide truncate",
									children: s.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[9px] text-blood tracking-wider",
									children: s.authenticity_note || "Verified Field Clue"
								}),
								s.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[9px] text-white/40 line-clamp-1 mt-0.5",
									children: s.description
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 shrink-0 ml-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setEditingSig(s),
							title: "Edit signature clue",
							className: "p-1.5 text-white/40 hover:text-white transition-colors cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-3.5 w-3.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleDeleteSig(s.id),
							title: "Delete signature clue",
							className: "p-1.5 text-white/30 hover:text-red-400 transition-colors cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
						})]
					})]
				}, s.id))
			})] }),
			showSigModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#0a0a0a] p-6 shadow-2xl my-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sticky top-0 z-10 -mx-6 -mt-6 mb-4 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a]/95 px-6 py-4 backdrop-blur-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-bold uppercase tracking-wider text-white",
							children: "Add Signature Clue"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowSigModal(false),
							className: "rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreateSig,
						className: "space-y-4 font-mono text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block uppercase text-white/60 mb-1",
								children: "Clue Label *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								value: sigForm.label,
								onChange: (e) => setSigForm({
									...sigForm,
									label: e.target.value
								}),
								placeholder: "Cipher Puzzle Disc",
								className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadField, {
								label: "Signature Clue Image (S3 URL or Upload)",
								value: sigForm.image_url,
								onChange: (val) => setSigForm({
									...sigForm,
									image_url: val
								}),
								folder: "signatures",
								placeholder: "/src/assets/signature/puzzle.png or https://bucket.s3.amazonaws.com/signatures/puzzle.png"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block uppercase text-white/60 mb-1",
								children: "Authenticity Tagline"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: sigForm.authenticity_note,
								onChange: (e) => setSigForm({
									...sigForm,
									authenticity_note: e.target.value
								}),
								placeholder: "Verified Authentic Field Clue",
								className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block uppercase text-white/60 mb-1",
								children: "Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 2,
								value: sigForm.description,
								onChange: (e) => setSigForm({
									...sigForm,
									description: e.target.value
								}),
								placeholder: "Details of the clue and forensic significance...",
								className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood resize-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-3 pt-3 border-t border-white/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowSigModal(false),
									className: "rounded-lg px-4 py-2 uppercase text-white/60 hover:text-white cursor-pointer",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "rounded-lg bg-blood px-5 py-2 font-display text-[11px] font-semibold uppercase tracking-wider text-white hover:bg-blood/90 cursor-pointer",
									children: "Add Clue"
								})]
							})
						]
					})]
				})
			}),
			editingSig && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#0a0a0a] p-6 shadow-2xl my-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sticky top-0 z-10 -mx-6 -mt-6 mb-4 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a]/95 px-6 py-4 backdrop-blur-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-bold uppercase tracking-wider text-white",
							children: "Edit Signature Clue"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setEditingSig(null),
							className: "rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleUpdateSig,
						className: "space-y-4 font-mono text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block uppercase text-white/60 mb-1",
								children: "Clue Label *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								value: editingSig.label,
								onChange: (e) => setEditingSig({
									...editingSig,
									label: e.target.value
								}),
								placeholder: "Cipher Puzzle Disc",
								className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block uppercase text-white/60 mb-1",
									children: "Image URL or Upload"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: editingSig.image_url || "",
										onChange: (e) => setEditingSig({
											...editingSig,
											image_url: e.target.value
										}),
										placeholder: "/src/assets/signature/puzzle.png or https://...",
										className: "flex-1 rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.05] px-3.5 py-2.5 font-display text-[11px] uppercase tracking-wider text-white hover:bg-blood/20 hover:border-blood/40 transition-colors cursor-pointer",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5 text-blood" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: uploadingSigModalImage ? "Uploading..." : "Upload File" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												accept: "image/*",
												onChange: (e) => handleUploadSigModalImage(e, true),
												className: "hidden"
											})
										]
									})]
								}),
								editingSig.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2.5 flex items-center gap-3.5 rounded-xl border border-white/10 bg-black/80 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "relative h-14 w-14 overflow-hidden rounded-lg border border-white/10 bg-[#070707] shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: editingSig.image_url,
											alt: "Clue Preview",
											className: "h-full w-full object-cover"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "inline-block rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/30 mb-0.5",
											children: "Clue Image Preview"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-[10px] text-white/50 truncate max-w-sm",
											children: editingSig.image_url
										})]
									})]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block uppercase text-white/60 mb-1",
								children: "Authenticity Tagline"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: editingSig.authenticity_note || "",
								onChange: (e) => setEditingSig({
									...editingSig,
									authenticity_note: e.target.value
								}),
								placeholder: "Verified Authentic Field Clue",
								className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block uppercase text-white/60 mb-1",
								children: "Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 2,
								value: editingSig.description || "",
								onChange: (e) => setEditingSig({
									...editingSig,
									description: e.target.value
								}),
								placeholder: "Details of the clue and forensic significance...",
								className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood resize-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-3 pt-3 border-t border-white/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setEditingSig(null),
									className: "rounded-lg px-4 py-2 uppercase text-white/60 hover:text-white cursor-pointer",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "rounded-lg bg-blood px-5 py-2 font-display text-[11px] font-semibold uppercase tracking-wider text-white hover:bg-blood/90 cursor-pointer",
									children: "Save Changes"
								})]
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { AdminKits as component };
