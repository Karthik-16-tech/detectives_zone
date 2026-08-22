import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, v as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as Save, Mt as CircleAlert, P as Plus, Wt as ArrowLeft, bt as ExternalLink, d as StickyNote, gt as FileText, ht as Film, it as KeyRound, jt as CircleCheck, st as Image, u as Trash2 } from "../_libs/lucide-react.mjs";
import { c as api } from "./router-CBHk_fdB.mjs";
import { t as AdminLayout } from "./AdminLayout-BazMIgX5.mjs";
import { t as ImageUploadField } from "./ImageUploadField-DjD9Z7O9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cases._caseId-_8YuQGGs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminCaseDetail() {
	const { caseId } = useParams({ from: "/admin/cases/$caseId" });
	const [caseData, setCaseData] = (0, import_react.useState)(null);
	const [pageContent, setPageContent] = (0, import_react.useState)({
		hero_video_url: "",
		hero_subtitle: "",
		hero_badge_text: "Case File",
		evidence_wall_bg_url: "",
		case_type: "Homicide",
		date_of_incident: "15 July 2027",
		location: "Varma Residence",
		quote_text: "The voicemail wasn't a confession. It was a warning.",
		quote_author: "Detective Varma · Lead Investigator",
		evidence_pins: [],
		investigation_modules: [
			{
				icon: "Users",
				heading: "Unravel the Suspect Matrix",
				body: "Cross-examine 5 distinct persons of interest."
			},
			{
				icon: "FolderSearch",
				heading: "Analyze Crime Scene Evidence",
				body: "Examine high-resolution forensic photographs."
			},
			{
				icon: "Terminal",
				heading: "Decode Encrypted Files",
				body: "Access restricted police databases."
			}
		]
	});
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [activeTab, setActiveTab] = (0, import_react.useState)("page_cms");
	const [saveSuccess, setSaveSuccess] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [newPin, setNewPin] = (0, import_react.useState)({
		id: "",
		label: "",
		note: "",
		x: 50,
		y: 50,
		image_url: ""
	});
	const [newSection, setNewSection] = (0, import_react.useState)({
		title: "",
		section_type: "briefing",
		content_markdown: ""
	});
	const [newEvidence, setNewEvidence] = (0, import_react.useState)({
		title: "",
		type: "image",
		file_url: "",
		description: "",
		date_recorded: "",
		is_locked: false
	});
	const [newClue, setNewClue] = (0, import_react.useState)({
		title: "",
		description: "",
		correct_answer: "",
		hint: ""
	});
	const [newNote, setNewNote] = (0, import_react.useState)({
		title: "",
		body: "",
		highlight_color: "blood",
		is_confidential: true
	});
	(0, import_react.useEffect)(() => {
		loadCase();
	}, [caseId]);
	const loadCase = async () => {
		try {
			setLoading(true);
			const [cData, pData] = await Promise.all([api.getCase(caseId), api.getCasePage(caseId).catch(() => null)]);
			setCaseData(cData);
			if (pData) setPageContent({
				hero_video_url: pData.hero_video_url ?? cData.hero_video ?? "",
				hero_subtitle: pData.hero_subtitle ?? cData.subtitle ?? "",
				hero_badge_text: pData.hero_badge_text ?? "Case File",
				evidence_wall_bg_url: pData.evidence_wall_bg_url ?? "",
				case_type: pData.case_type ?? "Homicide",
				date_of_incident: pData.date_of_incident ?? "15 July 2027",
				location: pData.location ?? "Varma Residence",
				quote_text: pData.quote_text ?? "",
				quote_author: pData.quote_author ?? "",
				evidence_pins: pData.evidence_pins ?? [],
				investigation_modules: pData.investigation_modules && pData.investigation_modules.length > 0 ? pData.investigation_modules : [
					{
						icon: "Users",
						heading: "Unravel the Suspect Matrix",
						body: "Cross-examine 5 distinct persons of interest."
					},
					{
						icon: "FolderSearch",
						heading: "Analyze Crime Scene Evidence",
						body: "Examine high-resolution forensic photographs."
					},
					{
						icon: "Terminal",
						heading: "Decode Encrypted Files",
						body: "Access restricted police databases."
					}
				]
			});
		} catch (err) {
			setError(err.message || "Failed to load case data");
		} finally {
			setLoading(false);
		}
	};
	const handleSavePageContent = async (e) => {
		e.preventDefault();
		setSaving(true);
		setError(null);
		setSaveSuccess(false);
		try {
			const updated = await api.updateCasePage(caseData.id, pageContent);
			setPageContent(updated);
			setSaveSuccess(true);
			setTimeout(() => setSaveSuccess(false), 3e3);
		} catch (err) {
			setError(err.message || "Failed to save page CMS content");
		} finally {
			setSaving(false);
		}
	};
	const handleSaveOverview = async (e) => {
		e.preventDefault();
		setSaving(true);
		setError(null);
		setSaveSuccess(false);
		try {
			const updated = await api.updateCase(caseData.id, {
				title: caseData.title,
				subtitle: caseData.subtitle,
				tagline: caseData.tagline,
				intro_text: caseData.intro_text,
				short_description: caseData.short_description,
				cover_image: caseData.cover_image,
				hero_image: caseData.hero_image,
				hero_video: caseData.hero_video,
				difficulty: caseData.difficulty,
				estimated_duration: caseData.estimated_duration,
				status: caseData.status,
				featured: caseData.featured,
				is_published: caseData.is_published
			});
			setCaseData({
				...caseData,
				...updated
			});
			setSaveSuccess(true);
			setTimeout(() => setSaveSuccess(false), 3e3);
		} catch (err) {
			setError(err.message || "Failed to save changes");
		} finally {
			setSaving(false);
		}
	};
	const handleAddSection = async (e) => {
		e.preventDefault();
		try {
			const item = await api.addCaseSection(caseData.id, newSection);
			setCaseData({
				...caseData,
				sections: [...caseData.sections || [], item]
			});
			setNewSection({
				title: "",
				section_type: "briefing",
				content_markdown: ""
			});
		} catch (err) {
			alert(err.message || "Failed to add section");
		}
	};
	const handleDeleteSection = async (id) => {
		if (!window.confirm("Delete this story section?")) return;
		try {
			await api.deleteCaseSection(id);
			setCaseData({
				...caseData,
				sections: caseData.sections.filter((s) => s.id !== id)
			});
		} catch (err) {
			alert(err.message || "Failed to delete section");
		}
	};
	const handleAddEvidence = async (e) => {
		e.preventDefault();
		try {
			const item = await api.addCaseEvidence(caseData.id, newEvidence);
			setCaseData({
				...caseData,
				evidence: [...caseData.evidence || [], item]
			});
			setNewEvidence({
				title: "",
				type: "image",
				file_url: "",
				description: "",
				date_recorded: "",
				is_locked: false
			});
		} catch (err) {
			alert(err.message || "Failed to add evidence");
		}
	};
	const handleDeleteEvidence = async (id) => {
		if (!window.confirm("Delete this evidence piece?")) return;
		try {
			await api.deleteCaseEvidence(id);
			setCaseData({
				...caseData,
				evidence: caseData.evidence.filter((e) => e.id !== id)
			});
		} catch (err) {
			alert(err.message || "Failed to delete evidence");
		}
	};
	const handleAddClue = async (e) => {
		e.preventDefault();
		try {
			const item = await api.addCaseClue(caseData.id, newClue);
			setCaseData({
				...caseData,
				clues: [...caseData.clues || [], item]
			});
			setNewClue({
				title: "",
				description: "",
				correct_answer: "",
				hint: ""
			});
		} catch (err) {
			alert(err.message || "Failed to add clue");
		}
	};
	const handleDeleteClue = async (id) => {
		if (!window.confirm("Delete this clue challenge?")) return;
		try {
			await api.deleteCaseClue(id);
			setCaseData({
				...caseData,
				clues: caseData.clues.filter((c) => c.id !== id)
			});
		} catch (err) {
			alert(err.message || "Failed to delete clue");
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, {
		title: "Case CMS Editor",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "py-20 text-center font-mono text-xs uppercase tracking-widest text-white/40",
			children: "Decrypting Dossier CMS Files..."
		})
	});
	if (!caseData) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, {
		title: "Case Not Found",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-8 text-center text-white/60",
			children: [
				"Case could not be found.",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/cases",
					className: "text-blood underline",
					children: "Back to cases"
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, {
		title: `Case #${caseData.case_number}: ${caseData.title}`,
		subtitle: `CMS Controls · Status: ${caseData.status} · ${caseData.difficulty}`,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/cases",
				className: "flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.03] px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider text-white/70 hover:text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Back" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: `/cases/${caseData.slug || caseData.case_number}`,
				target: "_blank",
				className: "flex items-center gap-1.5 rounded-lg border border-blood/40 bg-blood/15 px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider text-white hover:bg-blood/25",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Live Case" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5 text-blood" })]
			})]
		}),
		children: [
			saveSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3.5 font-mono text-xs text-emerald-300 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Case dossier updated successfully! Changes are live immediately." })]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 rounded-lg border border-blood/40 bg-blood/10 p-3.5 font-mono text-xs text-red-300 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto font-mono text-xs uppercase tracking-wider",
				children: [
					{
						id: "page_cms",
						label: "Public Page CMS",
						count: pageContent.evidence_pins?.length ? `${pageContent.evidence_pins.length} Pins` : "Ready"
					},
					{
						id: "overview",
						label: "General & Hero",
						count: null
					},
					{
						id: "sections",
						label: "Story & Briefings",
						count: caseData.sections?.length
					},
					{
						id: "evidence",
						label: "Evidence Locker",
						count: caseData.evidence?.length
					},
					{
						id: "clues",
						label: "Clues & Verification",
						count: caseData.clues?.length
					}
				].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setActiveTab(tab.id),
					className: `flex items-center gap-2 rounded-lg px-4 py-2 transition-colors cursor-pointer ${activeTab === tab.id ? "bg-blood text-white font-bold" : "bg-white/[0.03] text-white/50 hover:text-white"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab.label }), tab.count !== null && tab.count !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-white/80",
						children: tab.count
					})]
				}, tab.id))
			}),
			activeTab === "page_cms" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSavePageContent,
				className: "mt-8 space-y-10 max-w-5xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-white/10 bg-[#070707] p-6 space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-white/10 pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-display text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, { className: "h-5 w-5 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Hero Section & Scrub Video" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-sans text-xs text-white/50 mt-1",
									children: "Control the video, badges, and headline metadata on the public case page."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									disabled: saving,
									className: "flex items-center gap-2 rounded-lg bg-blood px-4 py-2 font-display text-xs font-semibold uppercase tracking-wider text-white hover:bg-blood/90 disabled:opacity-50 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: saving ? "Saving..." : "Save Page" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadField, {
										label: "Hero Video File / S3 URL (Interactive Scrub)",
										value: pageContent.hero_video_url || "",
										onChange: (val) => setPageContent({
											...pageContent,
											hero_video_url: val
										}),
										folder: "cases",
										placeholder: "/src/assets/Untitled design (5).mp4 or https://bucket.s3.amazonaws.com/hero.mp4"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block font-mono text-xs uppercase tracking-wider text-white/60 mb-2",
										children: "Hero Badge Text"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: pageContent.hero_badge_text || "",
										onChange: (e) => setPageContent({
											...pageContent,
											hero_badge_text: e.target.value
										}),
										placeholder: "e.g. Case File, Classified Dossier",
										className: "w-full rounded-lg border border-white/10 bg-black/60 p-3 text-white font-sans text-sm focus:border-blood outline-none"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "md:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block font-mono text-xs uppercase tracking-wider text-white/60 mb-2",
											children: "Hero Subtitle / Dossier Hook"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											rows: 2,
											value: pageContent.hero_subtitle || "",
											onChange: (e) => setPageContent({
												...pageContent,
												hero_subtitle: e.target.value
											}),
											placeholder: "e.g. A successful businessman found dead in his study. No forced entry. Just a voicemail…",
											className: "w-full rounded-lg border border-white/10 bg-black/60 p-3 text-white font-sans text-sm focus:border-blood outline-none"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/[0.06]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block font-mono text-xs uppercase tracking-wider text-white/60 mb-1",
										children: "Case Type"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: pageContent.case_type || "",
										onChange: (e) => setPageContent({
											...pageContent,
											case_type: e.target.value
										}),
										placeholder: "e.g. Homicide, Kidnapping",
										className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white font-sans text-xs focus:border-blood outline-none"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block font-mono text-xs uppercase tracking-wider text-white/60 mb-1",
										children: "Date of Incident"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: pageContent.date_of_incident || "",
										onChange: (e) => setPageContent({
											...pageContent,
											date_of_incident: e.target.value
										}),
										placeholder: "e.g. 15 July 2027",
										className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white font-sans text-xs focus:border-blood outline-none"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block font-mono text-xs uppercase tracking-wider text-white/60 mb-1",
										children: "Crime Scene Location"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: pageContent.location || "",
										onChange: (e) => setPageContent({
											...pageContent,
											location: e.target.value
										}),
										placeholder: "e.g. Varma Residence, Study Room",
										className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white font-sans text-xs focus:border-blood outline-none"
									})] })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-white/10 bg-[#070707] p-6 space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-white/10 pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-display text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-5 w-5 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Interactive Evidence Wall Pins (",
										pageContent.evidence_pins?.length || 0,
										")"
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-sans text-xs text-white/50 mt-1",
									children: "Configure pins on the corkboard canvas with coordinates, evidence photos, and notes."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									disabled: saving,
									className: "flex items-center gap-2 rounded-lg bg-blood px-4 py-2 font-display text-xs font-semibold uppercase tracking-wider text-white hover:bg-blood/90 disabled:opacity-50 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Save Pins" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadField, {
								label: "Corkboard Background Texture (S3 URL or Upload)",
								value: pageContent.evidence_wall_bg_url || "",
								onChange: (val) => setPageContent({
									...pageContent,
									evidence_wall_bg_url: val
								}),
								folder: "evidence",
								placeholder: "/src/assets/evidencce/corkboard.jpg or S3 URL"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-mono text-xs uppercase tracking-wider text-white/80",
									children: "Active Evidence Pins:"
								}), pageContent.evidence_pins?.map((pin, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-white/[0.08] bg-black/40 p-4 space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono text-xs text-blood font-bold uppercase",
												children: [
													"Pin #",
													index + 1,
													": ",
													pin.label || "Untitled Pin"
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													const updated = [...pageContent.evidence_pins];
													updated.splice(index, 1);
													setPageContent({
														...pageContent,
														evidence_pins: updated
													});
												},
												className: "text-white/40 hover:text-blood transition-colors cursor-pointer",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-[10px] font-mono uppercase text-white/50 mb-1",
													children: "Label"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: pin.label || "",
													onChange: (e) => {
														const updated = [...pageContent.evidence_pins];
														updated[index].label = e.target.value;
														setPageContent({
															...pageContent,
															evidence_pins: updated
														});
													},
													className: "w-full rounded border border-white/10 bg-black p-2 text-xs text-white outline-none focus:border-blood"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "sm:col-span-2 md:col-span-4",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadField, {
														label: `Evidence Photo for Pin #${index + 1}`,
														value: pin.image_url || "",
														onChange: (val) => {
															const updated = [...pageContent.evidence_pins];
															updated[index].image_url = val;
															setPageContent({
																...pageContent,
																evidence_pins: updated
															});
														},
														folder: "evidence",
														placeholder: "/src/assets/evidencce/e-01.jpg or S3 URL"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "block text-[10px] font-mono uppercase text-white/50 mb-1",
													children: [
														"X Position: ",
														pin.x,
														"%"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "range",
													min: "5",
													max: "95",
													value: pin.x || 50,
													onChange: (e) => {
														const updated = [...pageContent.evidence_pins];
														updated[index].x = parseFloat(e.target.value);
														setPageContent({
															...pageContent,
															evidence_pins: updated
														});
													},
													className: "w-full accent-blood"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "block text-[10px] font-mono uppercase text-white/50 mb-1",
													children: [
														"Y Position: ",
														pin.y,
														"%"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "range",
													min: "10",
													max: "90",
													value: pin.y || 50,
													onChange: (e) => {
														const updated = [...pageContent.evidence_pins];
														updated[index].y = parseFloat(e.target.value);
														setPageContent({
															...pageContent,
															evidence_pins: updated
														});
													},
													className: "w-full accent-blood"
												})] })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-[10px] font-mono uppercase text-white/50 mb-1",
											children: "Clue Note Description"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: pin.note || "",
											onChange: (e) => {
												const updated = [...pageContent.evidence_pins];
												updated[index].note = e.target.value;
												setPageContent({
													...pageContent,
													evidence_pins: updated
												});
											},
											placeholder: "e.g. 3:47 AM. 'It's already done. Don't look for me.'",
											className: "w-full rounded border border-white/10 bg-black p-2 text-xs text-white outline-none focus:border-blood"
										})] })
									]
								}, pin.id || index))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-dashed border-white/20 bg-white/[0.02] p-5 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
										className: "font-mono text-xs font-bold uppercase tracking-wider text-white/90 flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add Evidence Pin to Board" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-[11px] font-mono uppercase text-white/50 mb-1",
												children: "Pin ID (Slug)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												value: newPin.id,
												onChange: (e) => setNewPin({
													...newPin,
													id: e.target.value
												}),
												placeholder: "e.g. voicemail_tape",
												className: "w-full rounded-lg border border-white/10 bg-black p-2.5 text-xs text-white outline-none focus:border-blood"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-[11px] font-mono uppercase text-white/50 mb-1",
												children: "Label"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												value: newPin.label,
												onChange: (e) => setNewPin({
													...newPin,
													label: e.target.value
												}),
												placeholder: "e.g. Audio Tape",
												className: "w-full rounded-lg border border-white/10 bg-black p-2.5 text-xs text-white outline-none focus:border-blood"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block text-[11px] font-mono uppercase text-white/50 mb-1",
												children: [
													"X Coord (",
													newPin.x,
													"%)"
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "range",
												min: "5",
												max: "95",
												value: newPin.x,
												onChange: (e) => setNewPin({
													...newPin,
													x: parseFloat(e.target.value)
												}),
												className: "w-full accent-blood mt-2"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block text-[11px] font-mono uppercase text-white/50 mb-1",
												children: [
													"Y Coord (",
													newPin.y,
													"%)"
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "range",
												min: "10",
												max: "90",
												value: newPin.y,
												onChange: (e) => setNewPin({
													...newPin,
													y: parseFloat(e.target.value)
												}),
												className: "w-full accent-blood mt-2"
											})] })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "sm:col-span-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadField, {
												label: "Pin Evidence Photo (S3 URL or Upload)",
												value: newPin.image_url,
												onChange: (val) => setNewPin({
													...newPin,
													image_url: val
												}),
												folder: "evidence",
												placeholder: "/src/assets/evidencce/e-01.jpg or S3 URL"
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-[11px] font-mono uppercase text-white/50 mb-1",
											children: "Note Text"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: newPin.note,
											onChange: (e) => setNewPin({
												...newPin,
												note: e.target.value
											}),
											placeholder: "Clue or forensic observation description",
											className: "w-full rounded-lg border border-white/10 bg-black p-2.5 text-xs text-white outline-none focus:border-blood"
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											if (!newPin.label) {
												alert("Please provide at least a label for the pin");
												return;
											}
											const pinToAdd = {
												id: newPin.id || `pin_${Date.now()}`,
												label: newPin.label,
												note: newPin.note,
												x: newPin.x,
												y: newPin.y,
												image_url: newPin.image_url,
												links: []
											};
											setPageContent({
												...pageContent,
												evidence_pins: [...pageContent.evidence_pins || [], pinToAdd]
											});
											setNewPin({
												id: "",
												label: "",
												note: "",
												x: 50,
												y: 50,
												image_url: ""
											});
										},
										className: "flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 font-mono text-xs uppercase text-white hover:bg-blood hover:text-white transition-colors cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Place Pin on Evidence Wall" })]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-white/10 bg-[#070707] p-6 space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-white/10 pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-display text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Investigation Modules (3 Feature Cards)" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-sans text-xs text-white/50 mt-1",
								children: "Customize the 3 interactive case dossiers / investigation gameplay mechanics."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: saving,
								className: "flex items-center gap-2 rounded-lg bg-blood px-4 py-2 font-display text-xs font-semibold uppercase tracking-wider text-white hover:bg-blood/90 disabled:opacity-50 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Save Modules" })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 md:grid-cols-3 gap-6",
							children: [
								0,
								1,
								2
							].map((idx) => {
								const mod = pageContent.investigation_modules?.[idx] || {
									icon: "Users",
									heading: "",
									body: ""
								};
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-white/10 bg-black/40 p-4 space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-[11px] text-blood font-bold uppercase",
											children: ["Module #", idx + 1]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-[10px] font-mono uppercase text-white/50 mb-1",
											children: "Heading"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: mod.heading || "",
											onChange: (e) => {
												const updated = [...pageContent.investigation_modules || []];
												while (updated.length <= idx) updated.push({
													icon: "Users",
													heading: "",
													body: ""
												});
												updated[idx] = {
													...updated[idx],
													heading: e.target.value
												};
												setPageContent({
													...pageContent,
													investigation_modules: updated
												});
											},
											placeholder: "e.g. Unravel the Suspect Matrix",
											className: "w-full rounded border border-white/10 bg-black p-2 text-xs text-white font-display font-semibold uppercase outline-none focus:border-blood"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-[10px] font-mono uppercase text-white/50 mb-1",
											children: "Description"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											rows: 4,
											value: mod.body || "",
											onChange: (e) => {
												const updated = [...pageContent.investigation_modules || []];
												while (updated.length <= idx) updated.push({
													icon: "Users",
													heading: "",
													body: ""
												});
												updated[idx] = {
													...updated[idx],
													body: e.target.value
												};
												setPageContent({
													...pageContent,
													investigation_modules: updated
												});
											},
											placeholder: "Module briefing narrative...",
											className: "w-full rounded border border-white/10 bg-black p-2 text-xs text-white/80 font-sans outline-none focus:border-blood"
										})] })
									]
								}, idx);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-white/10 bg-[#070707] p-6 space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-white/10 pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-display text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "h-5 w-5 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Detective Quote Banner" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-sans text-xs text-white/50 mt-1",
								children: "The atmospheric noir quote banner across the bottom of the case page."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: saving,
								className: "flex items-center gap-2 rounded-lg bg-blood px-4 py-2 font-display text-xs font-semibold uppercase tracking-wider text-white hover:bg-blood/90 disabled:opacity-50 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Save Quote" })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-mono text-xs uppercase tracking-wider text-white/60 mb-2",
								children: "Quote Text"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 2,
								value: pageContent.quote_text || "",
								onChange: (e) => setPageContent({
									...pageContent,
									quote_text: e.target.value
								}),
								placeholder: "e.g. \"The voicemail wasn't a confession. It was a warning.\"",
								className: "w-full rounded-lg border border-white/10 bg-black/60 p-3 text-white font-sans text-sm focus:border-blood outline-none"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-mono text-xs uppercase tracking-wider text-white/60 mb-2",
								children: "Author / Detective Attribution"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: pageContent.quote_author || "",
								onChange: (e) => setPageContent({
									...pageContent,
									quote_author: e.target.value
								}),
								placeholder: "e.g. Detective Varma · Lead Investigator",
								className: "w-full rounded-lg border border-white/10 bg-black/60 p-3 text-white font-sans text-sm focus:border-blood outline-none"
							})] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-end gap-4 pt-4 border-t border-white/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: saving,
							className: "flex items-center gap-2 rounded-lg bg-blood px-8 py-3.5 font-display text-sm font-bold uppercase tracking-widest text-white hover:bg-blood/90 disabled:opacity-50 shadow-[0_0_30px_rgba(211,47,47,0.4)] cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: saving ? "Saving All Changes..." : "Save Public Case Page" })]
						})
					})
				]
			}),
			activeTab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSaveOverview,
				className: "mt-8 space-y-6 max-w-4xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block font-mono text-xs uppercase tracking-wider text-white/60 mb-2",
							children: "Case Title"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: caseData.title || "",
							onChange: (e) => setCaseData({
								...caseData,
								title: e.target.value
							}),
							className: "w-full rounded-lg border border-white/10 bg-[#070707] p-3 text-white font-sans text-sm focus:border-blood outline-none"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block font-mono text-xs uppercase tracking-wider text-white/60 mb-2",
							children: "Subtitle"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: caseData.subtitle || "",
							onChange: (e) => setCaseData({
								...caseData,
								subtitle: e.target.value
							}),
							className: "w-full rounded-lg border border-white/10 bg-[#070707] p-3 text-white font-sans text-sm focus:border-blood outline-none"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block font-mono text-xs uppercase tracking-wider text-white/60 mb-2",
						children: "Dramatic Tagline"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: caseData.tagline || "",
						onChange: (e) => setCaseData({
							...caseData,
							tagline: e.target.value
						}),
						placeholder: "Some voices never truly fade into the background.",
						className: "w-full rounded-lg border border-white/10 bg-[#070707] p-3 text-white font-sans text-sm focus:border-blood outline-none"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block font-mono text-xs uppercase tracking-wider text-white/60 mb-2",
						children: "Introductory Narrative"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 4,
						value: caseData.intro_text || "",
						onChange: (e) => setCaseData({
							...caseData,
							intro_text: e.target.value
						}),
						className: "w-full rounded-lg border border-white/10 bg-[#070707] p-3 text-white font-sans text-sm focus:border-blood outline-none"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadField, {
							label: "Case Cover Poster Image (S3 URL or Upload)",
							value: caseData.cover_image || "",
							onChange: (val) => setCaseData({
								...caseData,
								cover_image: val,
								hero_image: val
							}),
							folder: "cases",
							placeholder: "https://bucket.s3.amazonaws.com/cases/cover.jpg or /src/assets/..."
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadField, {
							label: "Hero Banner Image (S3 URL or Upload)",
							value: caseData.hero_image || "",
							onChange: (val) => setCaseData({
								...caseData,
								hero_image: val
							}),
							folder: "cases",
							placeholder: "https://bucket.s3.amazonaws.com/cases/hero.jpg or /src/assets/..."
						}) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block uppercase tracking-wider text-white/60 mb-2",
								children: "Difficulty Level"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: caseData.difficulty || "HARD",
								onChange: (e) => setCaseData({
									...caseData,
									difficulty: e.target.value
								}),
								className: "w-full rounded-lg border border-white/10 bg-[#070707] p-3 text-white focus:border-blood outline-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "EASY",
										children: "EASY"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "MEDIUM",
										children: "MEDIUM"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "HARD",
										children: "HARD"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "EXPERT",
										children: "EXPERT"
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block uppercase tracking-wider text-white/60 mb-2",
								children: "Duration Estimate"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: caseData.estimated_duration || "",
								onChange: (e) => setCaseData({
									...caseData,
									estimated_duration: e.target.value
								}),
								className: "w-full rounded-lg border border-white/10 bg-[#070707] p-3 text-white focus:border-blood outline-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block uppercase tracking-wider text-white/60 mb-2",
								children: "Investigation Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: caseData.status || "UNSOLVED",
								onChange: (e) => setCaseData({
									...caseData,
									status: e.target.value
								}),
								className: "w-full rounded-lg border border-white/10 bg-[#070707] p-3 text-white focus:border-blood outline-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "UNSOLVED",
										children: "UNSOLVED"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "COMING SOON",
										children: "COMING SOON"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "COMPLETED",
										children: "COMPLETED"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "ACTIVE",
										children: "ACTIVE"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "SOLVED",
										children: "SOLVED"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "CLASSIFIED",
										children: "CLASSIFIED"
									})
								]
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-6 pt-4 font-mono text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: caseData.featured || false,
								onChange: (e) => setCaseData({
									...caseData,
									featured: e.target.checked
								}),
								className: "rounded border-white/20 bg-black text-blood focus:ring-blood"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "uppercase tracking-wider text-white/80",
								children: "Feature On Homepage"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: caseData.is_published || false,
								onChange: (e) => setCaseData({
									...caseData,
									is_published: e.target.checked
								}),
								className: "rounded border-white/20 bg-black text-blood focus:ring-blood"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "uppercase tracking-wider text-white/80",
								children: "Publish Status"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-6 border-t border-white/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: saving,
							className: "flex items-center gap-2 rounded-xl bg-blood px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-blood/90 transition-all shadow-[0_0_24px_rgba(179,18,23,0.4)] disabled:opacity-50 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: saving ? "Saving Changes..." : "Save Overview Changes" })]
						})
					})
				]
			}),
			activeTab === "sections" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-8 max-w-4xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-white/10 bg-[#070707] p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-sm font-bold uppercase tracking-wider text-white mb-4",
						children: "Add New Story Section / Briefing"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleAddSection,
						className: "space-y-4 font-mono text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block uppercase tracking-wider text-white/60 mb-1",
									children: "Section Title"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									value: newSection.title,
									onChange: (e) => setNewSection({
										...newSection,
										title: e.target.value
									}),
									placeholder: "e.g. Incident Overview or Autopsy Report",
									className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block uppercase tracking-wider text-white/60 mb-1",
									children: "Section Type"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: newSection.section_type,
									onChange: (e) => setNewSection({
										...newSection,
										section_type: e.target.value
									}),
									className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "briefing",
											children: "Briefing"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "timeline",
											children: "Timeline"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "suspects",
											children: "Suspect Dossier"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "forensics",
											children: "Forensics Report"
										})
									]
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block uppercase tracking-wider text-white/60 mb-1",
								children: "Content (Markdown supported)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 4,
								required: true,
								value: newSection.content_markdown,
								onChange: (e) => setNewSection({
									...newSection,
									content_markdown: e.target.value
								}),
								placeholder: "Enter detailed narrative briefing notes...",
								className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white font-sans text-xs outline-none focus:border-blood"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								className: "flex items-center gap-2 rounded-lg bg-blood px-4 py-2 font-display text-xs font-semibold uppercase tracking-wider text-white hover:bg-blood/90",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add Section" })]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
						className: "font-mono text-xs uppercase tracking-wider text-white/50",
						children: [
							"Existing Story Sections (",
							caseData.sections?.length || 0,
							")"
						]
					}), caseData.sections?.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs text-white/40",
						children: "No custom story sections added yet."
					}) : caseData.sections?.map((sec) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/[0.08] bg-[#070707] p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pb-3 border-b border-white/[0.06]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-blood" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-sm font-bold uppercase text-white",
										children: sec.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded bg-white/10 px-2 py-0.5 font-mono text-[9px] uppercase text-white/60",
										children: sec.section_type
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleDeleteSection(sec.id),
								className: "text-white/40 hover:text-blood transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-sans text-xs text-white/70 whitespace-pre-line",
							children: sec.content_markdown
						})]
					}, sec.id))]
				})]
			}),
			activeTab === "evidence" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-8 max-w-4xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-white/10 bg-[#070707] p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-sm font-bold uppercase tracking-wider text-white mb-4",
						children: "Catalog New Evidence Item"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleAddEvidence,
						className: "space-y-4 font-mono text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block uppercase tracking-wider text-white/60 mb-1",
									children: "Evidence Title"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									value: newEvidence.title,
									onChange: (e) => setNewEvidence({
										...newEvidence,
										title: e.target.value
									}),
									placeholder: "e.g. Spent Cartridge 9mm",
									className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block uppercase tracking-wider text-white/60 mb-1",
									children: "Evidence Type"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: newEvidence.type,
									onChange: (e) => setNewEvidence({
										...newEvidence,
										type: e.target.value
									}),
									className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "image",
											children: "Photo / Document"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "audio",
											children: "Audio Wiretap / Voicemail"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "video",
											children: "CCTV Surveillance Footage"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "cctv",
											children: "CCTV Stills"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "note",
											children: "Cryptic Note"
										})
									]
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadField, {
									label: "Media File / Photo / Video (S3 URL or Upload)",
									value: newEvidence.file_url,
									onChange: (val) => setNewEvidence({
										...newEvidence,
										file_url: val
									}),
									folder: "evidence",
									placeholder: "https://bucket.s3.amazonaws.com/evidence/... or /src/assets/..."
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block uppercase tracking-wider text-white/60 mb-1",
									children: "Timestamp / Date Recorded"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: newEvidence.date_recorded,
									onChange: (e) => setNewEvidence({
										...newEvidence,
										date_recorded: e.target.value
									}),
									placeholder: "Oct 14, 11:42 PM",
									className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block uppercase tracking-wider text-white/60 mb-1",
								children: "Forensic Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 2,
								value: newEvidence.description,
								onChange: (e) => setNewEvidence({
									...newEvidence,
									description: e.target.value
								}),
								placeholder: "Details regarding location discovered and fingerprint analysis...",
								className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								className: "flex items-center gap-2 rounded-lg bg-blood px-4 py-2 font-display text-xs font-semibold uppercase tracking-wider text-white hover:bg-blood/90",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Log Evidence" })]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-4",
					children: caseData.evidence?.map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/[0.08] bg-[#070707] p-4 flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between pb-2 border-b border-white/[0.06]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-xs font-bold uppercase text-white truncate",
									children: ev.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded bg-blood/20 text-blood font-mono text-[9px] uppercase px-2 py-0.5",
									children: ev.type
								})]
							}),
							ev.file_url && ev.type === "image" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: ev.file_url,
								alt: ev.title,
								className: "mt-3 h-28 w-full object-cover rounded-lg"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-sans text-xs text-white/60",
								children: ev.description || "No notes."
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 font-mono text-[10px] text-white/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ev.date_recorded || "Unknown Time" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleDeleteEvidence(ev.id),
								className: "text-white/40 hover:text-blood transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
							})]
						})]
					}, ev.id))
				})]
			}),
			activeTab === "clues" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-8 max-w-4xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-white/10 bg-[#070707] p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-sm font-bold uppercase tracking-wider text-white mb-4",
						children: "Add Riddle / Clue Verification Challenge"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleAddClue,
						className: "space-y-4 font-mono text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block uppercase tracking-wider text-white/60 mb-1",
								children: "Clue Title / Riddle Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								value: newClue.title,
								onChange: (e) => setNewClue({
									...newClue,
									title: e.target.value
								}),
								placeholder: "e.g. The Timekeeper's Riddle",
								className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block uppercase tracking-wider text-white/60 mb-1",
								children: "Question / Prompt"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 2,
								required: true,
								value: newClue.description,
								onChange: (e) => setNewClue({
									...newClue,
									description: e.target.value
								}),
								placeholder: "What object was found inside the victim's coat pocket?",
								className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block uppercase tracking-wider text-white/60 mb-1",
									children: "Accepted Answers (comma separated)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									value: newClue.correct_answer,
									onChange: (e) => setNewClue({
										...newClue,
										correct_answer: e.target.value
									}),
									placeholder: "watch, pocket watch, pocketwatch",
									className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block uppercase tracking-wider text-white/60 mb-1",
									children: "Hint (Optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: newClue.hint,
									onChange: (e) => setNewClue({
										...newClue,
										hint: e.target.value
									}),
									placeholder: "It measures seconds it can never hold...",
									className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								className: "flex items-center gap-2 rounded-lg bg-blood px-4 py-2 font-display text-xs font-semibold uppercase tracking-wider text-white hover:bg-blood/90",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Create Clue Challenge" })]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: caseData.clues?.map((clue) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/[0.08] bg-[#070707] p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between pb-3 border-b border-white/[0.06]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-sm font-bold uppercase text-white",
										children: clue.title
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleDeleteClue(clue.id),
									className: "text-white/40 hover:text-blood transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-sans text-xs text-white/80",
								children: clue.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap items-center gap-4 font-mono text-[11px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-emerald-400",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-white/40",
											children: "Accepted:"
										}),
										" ",
										clue.correct_answer
									]
								}), clue.hint && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-white/40",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Hint:" }),
										" ",
										clue.hint
									]
								})]
							})
						]
					}, clue.id))
				})]
			})
		]
	});
}
//#endregion
export { AdminCaseDetail as component };
