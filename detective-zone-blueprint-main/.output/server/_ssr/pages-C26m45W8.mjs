import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { D as Save, Mt as CircleAlert, P as Plus, Y as MapPin, at as Info, bt as ExternalLink, dt as FolderOpen, ht as Film, j as Quote, jt as CircleCheck, rt as Layers, u as Trash2 } from "../_libs/lucide-react.mjs";
import { c as api } from "./router-CBHk_fdB.mjs";
import { t as AdminLayout } from "./AdminLayout-BazMIgX5.mjs";
import { t as ImageUploadField } from "./ImageUploadField-DjD9Z7O9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pages-C26m45W8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_8_MODULES = [
	{
		icon: "PersonStanding",
		heading: "Crime Scene",
		body: "Explore the scene",
		pct: 75
	},
	{
		icon: "FileText",
		heading: "Autopsy Report",
		body: "Medical examination findings",
		pct: 60
	},
	{
		icon: "MessagesSquare",
		heading: "Witness Statements",
		body: "Interviews and testimonies",
		pct: 45
	},
	{
		icon: "Monitor",
		heading: "Digital Evidence",
		body: "Devices, calls and digital clues",
		pct: 30
	},
	{
		icon: "Folder",
		heading: "Documents",
		body: "Letters, reports and files",
		pct: 40
	},
	{
		icon: "Camera",
		heading: "Evidence Photos",
		body: "Images and photographs",
		pct: 50
	},
	{
		icon: "Share2",
		heading: "Timeline",
		body: "Reconstruct the sequence",
		pct: 35
	},
	{
		icon: "Notebook",
		heading: "Detective Notes",
		body: "Your notes and deductions",
		pct: 20
	}
];
function AdminCasePagesCMS() {
	const [casesList, setCasesList] = (0, import_react.useState)([]);
	const [selectedCaseNum, setSelectedCaseNum] = (0, import_react.useState)("001");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [success, setSuccess] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [caseForm, setCaseForm] = (0, import_react.useState)({
		case_number: "001",
		title: "",
		tagline: "",
		short_description: "",
		status: "UNSOLVED",
		difficulty: "HARD",
		estimated_duration: "3–5 Hours",
		cover_image: ""
	});
	const [pageContent, setPageContent] = (0, import_react.useState)({
		hero_video_url: "",
		hero_subtitle: "",
		hero_badge_text: "Case Introduction Video",
		case_type: "Homicide",
		date_of_incident: "15 July 2027",
		location: "Varma Residence",
		evidence_wall_bg_url: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/corkboard.jpg",
		evidence_pins: [],
		investigation_modules: DEFAULT_8_MODULES,
		quote_text: "",
		quote_author: ""
	});
	(0, import_react.useEffect)(() => {
		loadAllCases();
	}, []);
	(0, import_react.useEffect)(() => {
		if (selectedCaseNum && casesList.length > 0) loadSpecificCase(selectedCaseNum);
	}, [selectedCaseNum, casesList]);
	const loadAllCases = async () => {
		try {
			setLoading(true);
			const data = await api.getAllCasesAdmin();
			setCasesList(data || []);
		} catch (err) {
			setError(err.message || "Failed to load cases");
		} finally {
			setLoading(false);
		}
	};
	const loadSpecificCase = async (cNum) => {
		setError(null);
		const foundCase = casesList.find((c) => c.case_number === cNum || c.slug === cNum);
		if (!foundCase) return;
		setCaseForm({
			id: foundCase.id,
			case_number: foundCase.case_number,
			title: foundCase.title || "",
			tagline: foundCase.tagline || "",
			short_description: foundCase.short_description || foundCase.intro_text || "",
			status: foundCase.status || "UNSOLVED",
			difficulty: foundCase.difficulty || "HARD",
			estimated_duration: foundCase.estimated_duration || "3–5 Hours",
			cover_image: foundCase.cover_image || ""
		});
		try {
			const pageData = await api.getCasePage(foundCase.id);
			let loadedModules = DEFAULT_8_MODULES;
			if (pageData && pageData.investigation_modules && pageData.investigation_modules.length >= 8) loadedModules = pageData.investigation_modules;
			else if (pageData && pageData.investigation_modules && pageData.investigation_modules.length > 0) loadedModules = DEFAULT_8_MODULES.map((def, idx) => {
				if (pageData.investigation_modules[idx]) return {
					...def,
					heading: pageData.investigation_modules[idx].heading || def.heading,
					body: pageData.investigation_modules[idx].body || def.body,
					pct: pageData.investigation_modules[idx].pct ?? def.pct
				};
				return def;
			});
			if (pageData) setPageContent({
				hero_video_url: pageData.hero_video_url || "",
				hero_subtitle: pageData.hero_subtitle || foundCase.short_description || "",
				hero_badge_text: pageData.hero_badge_text || "Case Introduction Video",
				case_type: pageData.case_type || "Homicide",
				date_of_incident: pageData.date_of_incident || "15 July 2027",
				location: pageData.location || "Varma Residence",
				evidence_wall_bg_url: pageData.evidence_wall_bg_url || "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/corkboard.jpg",
				evidence_pins: pageData.evidence_pins || [],
				investigation_modules: loadedModules,
				quote_text: pageData.quote_text || "",
				quote_author: pageData.quote_author || ""
			});
			else setPageContent((prev) => ({
				...prev,
				investigation_modules: DEFAULT_8_MODULES
			}));
		} catch (err) {
			setPageContent((prev) => ({
				...prev,
				investigation_modules: DEFAULT_8_MODULES
			}));
		}
	};
	const handleSave = async (e) => {
		e.preventDefault();
		if (!caseForm.id) return;
		setSaving(true);
		setSuccess(false);
		setError(null);
		try {
			await api.updateCase(caseForm.id, {
				title: caseForm.title,
				tagline: caseForm.tagline,
				short_description: caseForm.short_description,
				status: caseForm.status,
				difficulty: caseForm.difficulty,
				estimated_duration: caseForm.estimated_duration,
				cover_image: caseForm.cover_image
			});
			await api.updateCasePage(caseForm.id, pageContent);
			await loadAllCases();
			setSuccess(true);
			setTimeout(() => setSuccess(false), 3500);
		} catch (err) {
			setError(err.message || "Failed to update case page in MySQL");
		} finally {
			setSaving(false);
		}
	};
	const handleAddPin = () => {
		const newId = `pin_${Date.now()}`;
		setPageContent((prev) => ({
			...prev,
			evidence_pins: [...prev.evidence_pins, {
				id: newId,
				x: 50,
				y: 50,
				label: "New Clue Item",
				note: "Enter field observation note...",
				image_url: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-01.jpg"
			}]
		}));
	};
	const handleUpdatePin = (index, field, value) => {
		setPageContent((prev) => {
			const updated = [...prev.evidence_pins];
			updated[index] = {
				...updated[index],
				[field]: value
			};
			return {
				...prev,
				evidence_pins: updated
			};
		});
	};
	const handleDeletePin = (index) => {
		setPageContent((prev) => ({
			...prev,
			evidence_pins: prev.evidence_pins.filter((_, i) => i !== index)
		}));
	};
	const handleUpdateModule = (index, field, value) => {
		setPageContent((prev) => {
			const updated = [...prev.investigation_modules];
			updated[index] = {
				...updated[index],
				[field]: value
			};
			return {
				...prev,
				investigation_modules: updated
			};
		});
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, {
		title: "Case Pages CMS",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "py-20 text-center font-mono text-xs uppercase tracking-widest text-white/40",
			children: "Loading Case Pages from MySQL..."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, {
		title: "Case Pages CMS Studio",
		subtitle: "Edit the complete public page for every case (Videos, Evidence Wall, Pins, Modules, Quotes)",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: `/cases/${selectedCaseNum}`,
			target: "_blank",
			rel: "noreferrer",
			className: "flex items-center gap-1.5 rounded-lg border border-blood/40 bg-blood/15 px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider text-white hover:bg-blood/25",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["View Live Case ", selectedCaseNum] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5 text-blood" })]
		}),
		children: [
			success && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3.5 font-mono text-xs text-emerald-300 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"Case ",
					selectedCaseNum,
					" page updated in MySQL! Changes are live on the website immediately."
				] })]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 rounded-lg border border-blood/40 bg-blood/10 p-3.5 font-mono text-xs text-red-300 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto font-mono text-xs uppercase tracking-wider",
				children: casesList.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setSelectedCaseNum(c.case_number),
					className: `flex items-center gap-2 rounded-lg px-4 py-2 transition-all cursor-pointer ${selectedCaseNum === c.case_number ? "bg-blood text-white font-bold shadow-[0_0_15px_rgba(211,47,47,0.4)]" : "bg-white/[0.03] text-white/50 hover:text-white border border-white/[0.06]"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "h-4 w-4" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Case ", c.case_number] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-[9px] px-1.5 py-0.5 rounded font-mono ${c.status === "UNSOLVED" ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-white/60"}`,
							children: c.status
						})
					]
				}, c.case_number))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSave,
				className: "mt-8 space-y-8 max-w-5xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/[0.08] bg-[#070707] p-6 space-y-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display text-base font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4 w-4 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "1. Case Identity & Header Information" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-mono uppercase text-white/60 mb-1",
									children: "Case Title"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: caseForm.title,
									onChange: (e) => setCaseForm({
										...caseForm,
										title: e.target.value
									}),
									placeholder: "The Last Voicemail",
									className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood text-sm font-semibold"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-mono uppercase text-white/60 mb-1",
									children: "Tagline / Sub-heading"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: caseForm.tagline,
									onChange: (e) => setCaseForm({
										...caseForm,
										tagline: e.target.value
									}),
									placeholder: "Evidence wall — connect the dots",
									className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood text-sm"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "md:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-mono uppercase text-white/60 mb-1",
										children: "Case Description / Narrative Briefing"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 2,
										value: caseForm.short_description,
										onChange: (e) => setCaseForm({
											...caseForm,
											short_description: e.target.value
										}),
										placeholder: "A successful businessman found dead in his study. No forced entry. No clear motive...",
										className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood text-xs leading-relaxed"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-mono uppercase text-white/60 mb-1",
									children: "Case Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: caseForm.status,
									onChange: (e) => setCaseForm({
										...caseForm,
										status: e.target.value
									}),
									className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood text-xs font-mono",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "UNSOLVED",
											children: "UNSOLVED (Playable)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "SOLVED",
											children: "SOLVED (Archive)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "COMING SOON",
											children: "COMING SOON"
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-mono uppercase text-white/60 mb-1",
									children: "Difficulty Level"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: caseForm.difficulty,
									onChange: (e) => setCaseForm({
										...caseForm,
										difficulty: e.target.value
									}),
									className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood text-xs font-mono",
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
									className: "block text-xs font-mono uppercase text-white/60 mb-1",
									children: "Investigation Time"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: caseForm.estimated_duration,
									onChange: (e) => setCaseForm({
										...caseForm,
										estimated_duration: e.target.value
									}),
									placeholder: "3–5 Hours",
									className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood text-xs"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-mono uppercase text-white/60 mb-1",
									children: "Case Type"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: pageContent.case_type,
									onChange: (e) => setPageContent({
										...pageContent,
										case_type: e.target.value
									}),
									placeholder: "Homicide / Locked Room",
									className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood text-xs"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-mono uppercase text-white/60 mb-1",
									children: "Date of Incident"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: pageContent.date_of_incident,
									onChange: (e) => setPageContent({
										...pageContent,
										date_of_incident: e.target.value
									}),
									placeholder: "15 July 2027",
									className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood text-xs"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-mono uppercase text-white/60 mb-1",
									children: "Crime Scene Location"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: pageContent.location,
									onChange: (e) => setPageContent({
										...pageContent,
										location: e.target.value
									}),
									placeholder: "Varma Residence",
									className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood text-xs"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "md:col-span-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadField, {
										label: "Cover Poster Image (S3 URL or File Upload)",
										value: caseForm.cover_image,
										onChange: (val) => setCaseForm({
											...caseForm,
											cover_image: val
										}),
										folder: "cases",
										placeholder: "https://bucket.s3.amazonaws.com/cases/poster.jpg or upload below"
									})
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/[0.08] bg-[#070707] p-6 space-y-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display text-base font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, { className: "h-4 w-4 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "2. Case Introduction Video & Interactive Scrub" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-mono uppercase text-white/60 mb-1",
								children: "Video Badge Label"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: pageContent.hero_badge_text,
								onChange: (e) => setPageContent({
									...pageContent,
									hero_badge_text: e.target.value
								}),
								placeholder: "Case Introduction Video",
								className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood text-xs"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadField, {
								label: "Hero Video File / S3 URL (Interactive Scrub)",
								value: pageContent.hero_video_url,
								onChange: (val) => setPageContent({
									...pageContent,
									hero_video_url: val
								}),
								folder: "cases",
								placeholder: "https://bucket.s3.amazonaws.com/videos/hero.mp4 or /src/assets/detective-scrub-fast.mp4",
								helperText: "Supports S3 bucket MP4 video URL or direct video upload for mouse/touch frame scrubbing."
							}) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/[0.08] bg-[#070707] p-6 space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-white/10 pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-display text-base font-bold uppercase tracking-wider text-white flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"3. Evidence Wall & Interactive Clue Pins (",
										pageContent.evidence_pins.length,
										")"
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: handleAddPin,
									className: "flex items-center gap-1.5 rounded-lg border border-blood/50 bg-blood/15 px-3 py-1.5 font-mono text-xs text-white hover:bg-blood/30 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add Evidence Pin" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadField, {
								label: "Corkboard Background Texture (S3 URL or Upload)",
								value: pageContent.evidence_wall_bg_url,
								onChange: (val) => setPageContent({
									...pageContent,
									evidence_wall_bg_url: val
								}),
								folder: "evidence",
								placeholder: "/src/assets/evidencce/corkboard.jpg or S3 URL"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4 pt-2",
								children: pageContent.evidence_pins.map((pin, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-white/10 bg-black/40 p-4 space-y-3 relative group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between font-mono text-xs text-white/60 border-b border-white/[0.06] pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-blood font-bold",
											children: [
												"Pin #",
												idx + 1,
												" — ",
												pin.label || "Untitled Pin"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => handleDeletePin(idx),
											className: "text-red-400 hover:text-red-300 flex items-center gap-1 font-mono text-[11px] cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Remove Pin" })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "sm:col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-[10px] font-mono uppercase text-white/50 mb-1",
													children: "Clue Label"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: pin.label,
													onChange: (e) => handleUpdatePin(idx, "label", e.target.value),
													placeholder: "Voicemail / Door Key",
													className: "w-full rounded-lg border border-white/10 bg-black/70 p-2 text-white outline-none focus:border-blood text-xs"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-[10px] font-mono uppercase text-white/50 mb-1",
												children: "X Position (%)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: 0,
												max: 100,
												value: pin.x,
												onChange: (e) => handleUpdatePin(idx, "x", parseFloat(e.target.value) || 0),
												className: "w-full rounded-lg border border-white/10 bg-black/70 p-2 text-white outline-none focus:border-blood font-mono text-xs"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-[10px] font-mono uppercase text-white/50 mb-1",
												children: "Y Position (%)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: 0,
												max: 100,
												value: pin.y,
												onChange: (e) => handleUpdatePin(idx, "y", parseFloat(e.target.value) || 0),
												className: "w-full rounded-lg border border-white/10 bg-black/70 p-2 text-white outline-none focus:border-blood font-mono text-xs"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "sm:col-span-2 md:col-span-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadField, {
													label: `Evidence Photo for Pin #${idx + 1}`,
													value: pin.image_url,
													onChange: (val) => handleUpdatePin(idx, "image_url", val),
													folder: "evidence",
													placeholder: "/src/assets/evidencce/e-01.jpg or https://bucket.s3.amazonaws.com/evidence/clue.jpg"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-[10px] font-mono uppercase text-white/50 mb-1",
												children: "X Position (%)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: 0,
												max: 100,
												value: pin.x,
												onChange: (e) => handleUpdatePin(idx, "x", parseFloat(e.target.value) || 0),
												className: "w-full rounded-lg border border-white/10 bg-black/70 p-2 text-white outline-none focus:border-blood font-mono text-xs"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-[10px] font-mono uppercase text-white/50 mb-1",
												children: "Y Position (%)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: 0,
												max: 100,
												value: pin.y,
												onChange: (e) => handleUpdatePin(idx, "y", parseFloat(e.target.value) || 0),
												className: "w-full rounded-lg border border-white/10 bg-black/70 p-2 text-white outline-none focus:border-blood font-mono text-xs"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "sm:col-span-2 md:col-span-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-[10px] font-mono uppercase text-white/50 mb-1",
													children: "Field Clue Note"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: pin.note,
													onChange: (e) => handleUpdatePin(idx, "note", e.target.value),
													placeholder: "3:47 AM. It is already done. Don't look for me.",
													className: "w-full rounded-lg border border-white/10 bg-black/70 p-2 text-white outline-none focus:border-blood text-xs"
												})]
											})
										]
									})]
								}, pin.id || idx))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/[0.08] bg-[#070707] p-6 space-y-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-white/10 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-display text-base font-bold uppercase tracking-wider text-white flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"4. Investigation Modules Suite (",
									pageContent.investigation_modules.length,
									" Modules)"
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPageContent((prev) => ({
									...prev,
									investigation_modules: DEFAULT_8_MODULES
								})),
								className: "font-mono text-xs text-white/50 hover:text-white underline cursor-pointer",
								children: "Reset to Standard 8 Modules"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-4",
							children: pageContent.investigation_modules.map((mod, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-white/10 bg-black/40 p-4 space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between font-mono text-xs text-white/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-blood font-bold",
										children: ["Module 0", idx + 1]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-white/40",
												children: "Progress:"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: 0,
												max: 100,
												value: mod.pct ?? 50,
												onChange: (e) => handleUpdateModule(idx, "pct", parseInt(e.target.value) || 0),
												className: "w-14 rounded border border-white/10 bg-black/80 px-1.5 py-0.5 text-right font-mono text-xs text-emerald-400 outline-none focus:border-blood"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-emerald-400",
												children: "%"
											})
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-[10px] font-mono uppercase text-white/50 mb-1",
										children: "Module Title"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: mod.heading,
										onChange: (e) => handleUpdateModule(idx, "heading", e.target.value),
										placeholder: "Crime Scene / Autopsy Report",
										className: "w-full rounded-lg border border-white/10 bg-black/70 p-2 text-white outline-none focus:border-blood text-xs font-semibold"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-[10px] font-mono uppercase text-white/50 mb-1",
										children: "Module Subtitle / Desc"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: mod.body,
										onChange: (e) => handleUpdateModule(idx, "body", e.target.value),
										placeholder: "Explore the scene...",
										className: "w-full rounded-lg border border-white/10 bg-black/70 p-2 text-white outline-none focus:border-blood text-xs"
									})] })]
								})]
							}, idx))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/[0.08] bg-[#070707] p-6 space-y-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display text-base font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quote, { className: "h-4 w-4 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "5. Detective Quote Banner" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-mono uppercase text-white/60 mb-1",
								children: "Atmospheric Noir Quote"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 2,
								value: pageContent.quote_text,
								onChange: (e) => setPageContent({
									...pageContent,
									quote_text: e.target.value
								}),
								placeholder: "The voicemail wasn't a confession. It was a warning.",
								className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood text-xs"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-mono uppercase text-white/60 mb-1",
								children: "Author / Investigator Attribution"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: pageContent.quote_author,
								onChange: (e) => setPageContent({
									...pageContent,
									quote_author: e.target.value
								}),
								placeholder: "Detective Varma · Lead Investigator",
								className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood text-xs"
							})] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-end gap-4 pt-4 border-t border-white/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: saving,
							className: "flex items-center gap-2 rounded-lg bg-blood px-8 py-3.5 font-display text-sm font-bold uppercase tracking-widest text-white hover:bg-blood/90 disabled:opacity-50 shadow-[0_0_30px_rgba(211,47,47,0.4)] cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: saving ? `Saving Case ${selectedCaseNum}...` : `Save Case ${selectedCaseNum} Page to MySQL` })]
						})
					})
				]
			})
		]
	});
}
//#endregion
export { AdminCasePagesCMS as component };
