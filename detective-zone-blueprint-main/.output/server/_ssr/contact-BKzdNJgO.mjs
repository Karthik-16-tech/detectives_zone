import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { D as Save, I as Phone, Ot as Clock, X as Mail, Y as MapPin, jt as CircleCheck, k as RefreshCw, m as Sparkles, ot as Inbox, u as Trash2, x as ShieldCheck } from "../_libs/lucide-react.mjs";
import { c as api } from "./router-CBHk_fdB.mjs";
import { t as AdminLayout } from "./AdminLayout-BazMIgX5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-BKzdNJgO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminContactCMS() {
	const [activeTab, setActiveTab] = (0, import_react.useState)("channels");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [toastMessage, setToastMessage] = (0, import_react.useState)(null);
	const [inbox, setInbox] = (0, import_react.useState)([]);
	const [inboxFilter, setInboxFilter] = (0, import_react.useState)("ALL");
	const [loadingInbox, setLoadingInbox] = (0, import_react.useState)(false);
	const [channels, setChannels] = (0, import_react.useState)({
		section_kicker: "Direct channels",
		section_title: "Four ways to reach",
		section_accent: "the desk",
		ch1_file: "FILE // 001",
		ch1_title: "Encrypted Dispatch",
		ch1_line1: "investigations@detectivezone.com",
		ch1_line2: "Average response: under 2 hours",
		ch1_line3: "PGP Key ID: 0x8F3A29B1",
		ch2_file: "FILE // 002",
		ch2_title: "Secure Line",
		ch2_line1: "+91 63057 29867",
		ch2_line2: "Mon–Sun · 09:00 — 21:00 IST",
		ch2_line3: "Direct line, priority response",
		ch3_file: "FILE // 003",
		ch3_title: "Field Headquarters",
		ch3_line1: "221B Baker St. Complex",
		ch3_line2: "Suite 404, New York, NY 10001",
		ch3_line3: "By appointment or priority case only",
		ch4_file: "FILE // 004",
		ch4_title: "Urgent Deadlines",
		ch4_line1: "case-alert@detectivezone.com",
		ch4_line2: "24/7 on-call dispatch desk",
		ch4_line3: "Immediate field routing"
	});
	const [formSettings, setFormSettings] = (0, import_react.useState)({
		kicker: "Confidential report",
		title: "Open a new",
		accent: "case",
		description: "All fields are encrypted before they leave your device. Provide as much detail as the file allows.",
		support_phone: "+91 63057 29867",
		support_hours: "Mon–Sun · 09:00 — 21:00 IST"
	});
	(0, import_react.useEffect)(() => {
		loadSettings();
		loadInboxData();
	}, []);
	const showToast = (msg) => {
		setToastMessage(msg);
		setTimeout(() => setToastMessage(null), 3e3);
	};
	const loadSettings = async () => {
		try {
			setLoading(true);
			const settings = await api.getSettings();
			if (settings && Object.keys(settings).length > 0) {
				setChannels({
					section_kicker: settings.contact_section_kicker || "Direct channels",
					section_title: settings.contact_section_title || "Four ways to reach",
					section_accent: settings.contact_section_accent || "the desk",
					ch1_file: settings.contact_ch1_file || "FILE // 001",
					ch1_title: settings.contact_ch1_title || "Encrypted Dispatch",
					ch1_line1: settings.contact_ch1_line1 || "investigations@detectivezone.com",
					ch1_line2: settings.contact_ch1_line2 || "Average response: under 2 hours",
					ch1_line3: settings.contact_ch1_line3 || "PGP Key ID: 0x8F3A29B1",
					ch2_file: settings.contact_ch2_file || "FILE // 002",
					ch2_title: settings.contact_ch2_title || "Secure Line",
					ch2_line1: settings.contact_ch2_line1 || "+91 63057 29867",
					ch2_line2: settings.contact_ch2_line2 || "Mon–Sun · 09:00 — 21:00 IST",
					ch2_line3: settings.contact_ch2_line3 || "Direct line, priority response",
					ch3_file: settings.contact_ch3_file || "FILE // 003",
					ch3_title: settings.contact_ch3_title || "Field Headquarters",
					ch3_line1: settings.contact_ch3_line1 || "221B Baker St. Complex",
					ch3_line2: settings.contact_ch3_line2 || "Suite 404, New York, NY 10001",
					ch3_line3: settings.contact_ch3_line3 || "By appointment or priority case only",
					ch4_file: settings.contact_ch4_file || "FILE // 004",
					ch4_title: settings.contact_ch4_title || "Urgent Deadlines",
					ch4_line1: settings.contact_ch4_line1 || "case-alert@detectivezone.com",
					ch4_line2: settings.contact_ch4_line2 || "24/7 on-call dispatch desk",
					ch4_line3: settings.contact_ch4_line3 || "Immediate field routing"
				});
				setFormSettings({
					kicker: settings.contact_form_kicker || "Confidential report",
					title: settings.contact_form_title || "Open a new",
					accent: settings.contact_form_accent || "case",
					description: settings.contact_form_desc || "All fields are encrypted before they leave your device. Provide as much detail as the file allows.",
					support_phone: settings.contact_support_phone || "+91 63057 29867",
					support_hours: settings.contact_support_hours || "Mon–Sun · 09:00 — 21:00 IST"
				});
			}
		} catch (err) {
			console.log("Error loading contact settings:", err);
		} finally {
			setLoading(false);
		}
	};
	const loadInboxData = async (status) => {
		try {
			setLoadingInbox(true);
			const data = await api.getInbox(status || inboxFilter);
			setInbox(data);
		} catch (err) {
			console.log("Error loading inbox:", err);
		} finally {
			setLoadingInbox(false);
		}
	};
	const handleSaveChannels = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			await api.updateSettings({
				contact_section_kicker: channels.section_kicker,
				contact_section_title: channels.section_title,
				contact_section_accent: channels.section_accent,
				contact_ch1_file: channels.ch1_file,
				contact_ch1_title: channels.ch1_title,
				contact_ch1_line1: channels.ch1_line1,
				contact_ch1_line2: channels.ch1_line2,
				contact_ch1_line3: channels.ch1_line3,
				contact_ch2_file: channels.ch2_file,
				contact_ch2_title: channels.ch2_title,
				contact_ch2_line1: channels.ch2_line1,
				contact_ch2_line2: channels.ch2_line2,
				contact_ch2_line3: channels.ch2_line3,
				contact_ch3_file: channels.ch3_file,
				contact_ch3_title: channels.ch3_title,
				contact_ch3_line1: channels.ch3_line1,
				contact_ch3_line2: channels.ch3_line2,
				contact_ch3_line3: channels.ch3_line3,
				contact_ch4_file: channels.ch4_file,
				contact_ch4_title: channels.ch4_title,
				contact_ch4_line1: channels.ch4_line1,
				contact_ch4_line2: channels.ch4_line2,
				contact_ch4_line3: channels.ch4_line3
			});
			showToast("Four Desk Channels updated live");
		} catch (err) {
			alert(err.message || "Failed to save channels");
		} finally {
			setSaving(false);
		}
	};
	const handleSaveForm = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			await api.updateSettings({
				contact_form_kicker: formSettings.kicker,
				contact_form_title: formSettings.title,
				contact_form_accent: formSettings.accent,
				contact_form_desc: formSettings.description,
				contact_support_phone: formSettings.support_phone,
				contact_support_hours: formSettings.support_hours
			});
			showToast("Confidential Report block updated live");
		} catch (err) {
			alert(err.message || "Failed to save form settings");
		} finally {
			setSaving(false);
		}
	};
	const handleUpdateStatus = async (id, status) => {
		try {
			await api.updateInboxMessage(id, { status });
			setInbox(inbox.map((m) => m.id === id ? {
				...m,
				status
			} : m));
			showToast(`Inquiry marked as ${status}`);
		} catch (err) {
			alert(err.message || "Failed to update status");
		}
	};
	const handleDeleteMessage = async (id) => {
		if (!window.confirm("Permanently delete this inquiry?")) return;
		try {
			await api.deleteInboxMessage(id);
			setInbox(inbox.filter((m) => m.id !== id));
			showToast("Inquiry deleted");
		} catch (err) {
			alert(err.message || "Failed to delete inquiry");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, {
		title: "Contact Page & Desk CMS",
		subtitle: "Manage Desk Channels, Confidential Report Header & Inquiries Inbox",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setActiveTab("channels"),
					className: `rounded-lg px-3.5 py-2 font-display text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${activeTab === "channels" ? "bg-blood text-white shadow-[0_0_15px_rgba(179,18,23,0.4)]" : "border border-white/10 bg-white/[0.03] text-white/60 hover:text-white"}`,
					children: "Four Desk Channels"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setActiveTab("form"),
					className: `rounded-lg px-3.5 py-2 font-display text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${activeTab === "form" ? "bg-blood text-white shadow-[0_0_15px_rgba(179,18,23,0.4)]" : "border border-white/10 bg-white/[0.03] text-white/60 hover:text-white"}`,
					children: "Confidential Report Block"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setActiveTab("inbox"),
					className: `flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-display text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${activeTab === "inbox" ? "bg-blood text-white shadow-[0_0_15px_rgba(179,18,23,0.4)]" : "border border-white/10 bg-white/[0.03] text-white/60 hover:text-white"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Inquiries (",
						inbox.length,
						")"
					] })]
				})
			]
		}),
		children: [
			toastMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-500/40 bg-[#080808]/95 px-5 py-3 font-mono text-xs text-emerald-400 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-md animate-in fade-in",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: toastMessage })]
			}),
			activeTab === "channels" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSaveChannels,
				className: "space-y-8 font-mono text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-white/10 bg-[#080808] p-6 sm:p-7",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 pb-4 border-b border-white/10 mb-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-base font-bold uppercase tracking-wider text-white",
								children: "Section Heading & Kicker"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-3 gap-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block uppercase text-white/60 mb-1.5",
									children: "Section Kicker"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									value: channels.section_kicker,
									onChange: (e) => setChannels({
										...channels,
										section_kicker: e.target.value
									}),
									placeholder: "Direct channels",
									className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block uppercase text-white/60 mb-1.5",
									children: "Title Text"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									value: channels.section_title,
									onChange: (e) => setChannels({
										...channels,
										section_title: e.target.value
									}),
									placeholder: "Four ways to reach",
									className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block uppercase text-white/60 mb-1.5",
									children: "Accent (Red Highlight)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									value: channels.section_accent,
									onChange: (e) => setChannels({
										...channels,
										section_accent: e.target.value
									}),
									placeholder: "the desk",
									className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
								})] })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-white/10 bg-[#080808] p-6 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between pb-3 border-b border-white/10",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-display text-sm font-bold uppercase text-white",
												children: "Channel 1"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: channels.ch1_file,
											onChange: (e) => setChannels({
												...channels,
												ch1_file: e.target.value
											}),
											className: "rounded border border-white/10 bg-black/60 px-2 py-1 text-[10px] text-white/70 text-right w-28"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase text-white/60 mb-1",
										children: "Title"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: channels.ch1_title,
										onChange: (e) => setChannels({
											...channels,
											ch1_title: e.target.value
										}),
										className: "w-full rounded-lg border border-white/10 bg-black/60 p-2 text-white outline-none focus:border-blood"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase text-white/60 mb-1",
										children: "Email / Line 1"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: channels.ch1_line1,
										onChange: (e) => setChannels({
											...channels,
											ch1_line1: e.target.value
										}),
										className: "w-full rounded-lg border border-white/10 bg-black/60 p-2 text-white outline-none focus:border-blood"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block uppercase text-white/60 mb-1",
											children: "Response Time / Line 2"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: channels.ch1_line2,
											onChange: (e) => setChannels({
												...channels,
												ch1_line2: e.target.value
											}),
											className: "w-full rounded-lg border border-white/10 bg-black/60 p-2 text-white outline-none focus:border-blood"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block uppercase text-white/60 mb-1",
											children: "PGP Key / Line 3"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: channels.ch1_line3,
											onChange: (e) => setChannels({
												...channels,
												ch1_line3: e.target.value
											}),
											className: "w-full rounded-lg border border-white/10 bg-black/60 p-2 text-white outline-none focus:border-blood"
										})] })]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-white/10 bg-[#080808] p-6 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between pb-3 border-b border-white/10",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-display text-sm font-bold uppercase text-white",
												children: "Channel 2"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: channels.ch2_file,
											onChange: (e) => setChannels({
												...channels,
												ch2_file: e.target.value
											}),
											className: "rounded border border-white/10 bg-black/60 px-2 py-1 text-[10px] text-white/70 text-right w-28"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase text-white/60 mb-1",
										children: "Title"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: channels.ch2_title,
										onChange: (e) => setChannels({
											...channels,
											ch2_title: e.target.value
										}),
										className: "w-full rounded-lg border border-white/10 bg-black/60 p-2 text-white outline-none focus:border-blood"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase text-white/60 mb-1",
										children: "Phone Number / Line 1"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: channels.ch2_line1,
										onChange: (e) => setChannels({
											...channels,
											ch2_line1: e.target.value
										}),
										className: "w-full rounded-lg border border-white/10 bg-black/60 p-2 text-white outline-none focus:border-blood"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block uppercase text-white/60 mb-1",
											children: "Operating Hours / Line 2"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: channels.ch2_line2,
											onChange: (e) => setChannels({
												...channels,
												ch2_line2: e.target.value
											}),
											className: "w-full rounded-lg border border-white/10 bg-black/60 p-2 text-white outline-none focus:border-blood"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block uppercase text-white/60 mb-1",
											children: "Security Note / Line 3"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: channels.ch2_line3,
											onChange: (e) => setChannels({
												...channels,
												ch2_line3: e.target.value
											}),
											className: "w-full rounded-lg border border-white/10 bg-black/60 p-2 text-white outline-none focus:border-blood"
										})] })]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-white/10 bg-[#080808] p-6 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between pb-3 border-b border-white/10",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-display text-sm font-bold uppercase text-white",
												children: "Channel 3"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: channels.ch3_file,
											onChange: (e) => setChannels({
												...channels,
												ch3_file: e.target.value
											}),
											className: "rounded border border-white/10 bg-black/60 px-2 py-1 text-[10px] text-white/70 text-right w-28"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase text-white/60 mb-1",
										children: "Title"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: channels.ch3_title,
										onChange: (e) => setChannels({
											...channels,
											ch3_title: e.target.value
										}),
										className: "w-full rounded-lg border border-white/10 bg-black/60 p-2 text-white outline-none focus:border-blood"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase text-white/60 mb-1",
										children: "Address / Line 1"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: channels.ch3_line1,
										onChange: (e) => setChannels({
											...channels,
											ch3_line1: e.target.value
										}),
										className: "w-full rounded-lg border border-white/10 bg-black/60 p-2 text-white outline-none focus:border-blood"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block uppercase text-white/60 mb-1",
											children: "Suite / City / Line 2"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: channels.ch3_line2,
											onChange: (e) => setChannels({
												...channels,
												ch3_line2: e.target.value
											}),
											className: "w-full rounded-lg border border-white/10 bg-black/60 p-2 text-white outline-none focus:border-blood"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block uppercase text-white/60 mb-1",
											children: "Access Policy / Line 3"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: channels.ch3_line3,
											onChange: (e) => setChannels({
												...channels,
												ch3_line3: e.target.value
											}),
											className: "w-full rounded-lg border border-white/10 bg-black/60 p-2 text-white outline-none focus:border-blood"
										})] })]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-white/10 bg-[#080808] p-6 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between pb-3 border-b border-white/10",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-cyan-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-display text-sm font-bold uppercase text-white",
												children: "Channel 4"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: channels.ch4_file,
											onChange: (e) => setChannels({
												...channels,
												ch4_file: e.target.value
											}),
											className: "rounded border border-white/10 bg-black/60 px-2 py-1 text-[10px] text-white/70 text-right w-28"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase text-white/60 mb-1",
										children: "Title"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: channels.ch4_title,
										onChange: (e) => setChannels({
											...channels,
											ch4_title: e.target.value
										}),
										className: "w-full rounded-lg border border-white/10 bg-black/60 p-2 text-white outline-none focus:border-blood"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase text-white/60 mb-1",
										children: "Priority Email / Line 1"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: channels.ch4_line1,
										onChange: (e) => setChannels({
											...channels,
											ch4_line1: e.target.value
										}),
										className: "w-full rounded-lg border border-white/10 bg-black/60 p-2 text-white outline-none focus:border-blood"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block uppercase text-white/60 mb-1",
											children: "Availability / Line 2"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: channels.ch4_line2,
											onChange: (e) => setChannels({
												...channels,
												ch4_line2: e.target.value
											}),
											className: "w-full rounded-lg border border-white/10 bg-black/60 p-2 text-white outline-none focus:border-blood"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block uppercase text-white/60 mb-1",
											children: "Routing Note / Line 3"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: channels.ch4_line3,
											onChange: (e) => setChannels({
												...channels,
												ch4_line3: e.target.value
											}),
											className: "w-full rounded-lg border border-white/10 bg-black/60 p-2 text-white outline-none focus:border-blood"
										})] })]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end pt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: saving,
							className: "flex items-center gap-2 rounded-lg bg-blood px-7 py-3 font-display text-[12px] font-semibold uppercase tracking-wider text-white hover:bg-blood/90 transition-all shadow-[0_0_20px_rgba(179,18,23,0.35)] cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: saving ? "Saving..." : "Save Four Channels Live" })]
						})
					})
				]
			}),
			activeTab === "form" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSaveForm,
				className: "space-y-6 font-mono text-xs max-w-3xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-blood/30 bg-gradient-to-b from-blood/[0.08] to-transparent p-6 sm:p-8 space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 pb-4 border-b border-white/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-6 w-6 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-base font-bold uppercase tracking-wider text-white",
								children: "Confidential Report Section Header & Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[10px] text-white/50 uppercase tracking-wider mt-0.5",
								children: "Direct Case Intake Presentation & Encryption Notice"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-3 gap-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block uppercase text-white/60 mb-1.5",
									children: "Section Kicker"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									value: formSettings.kicker,
									onChange: (e) => setFormSettings({
										...formSettings,
										kicker: e.target.value
									}),
									placeholder: "Confidential report",
									className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block uppercase text-white/60 mb-1.5",
									children: "Title Text"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									value: formSettings.title,
									onChange: (e) => setFormSettings({
										...formSettings,
										title: e.target.value
									}),
									placeholder: "Open a new",
									className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block uppercase text-white/60 mb-1.5",
									children: "Accent Word"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									value: formSettings.accent,
									onChange: (e) => setFormSettings({
										...formSettings,
										accent: e.target.value
									}),
									placeholder: "case",
									className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block uppercase text-white/60 mb-1.5",
							children: "Encryption & Privacy Notice (Description)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 3,
							required: true,
							value: formSettings.description,
							onChange: (e) => setFormSettings({
								...formSettings,
								description: e.target.value
							}),
							placeholder: "All fields are encrypted before they leave your device. Provide as much detail as the file allows.",
							className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood resize-none"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-white/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block uppercase text-white/60 mb-1.5",
								children: "Support Direct Line"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: formSettings.support_phone,
								onChange: (e) => setFormSettings({
									...formSettings,
									support_phone: e.target.value
								}),
								placeholder: "+91 63057 29867",
								className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block uppercase text-white/60 mb-1.5",
								children: "Support Availability Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: formSettings.support_hours,
								onChange: (e) => setFormSettings({
									...formSettings,
									support_hours: e.target.value
								}),
								placeholder: "24/7 Field Clearance Active",
								className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
							})] })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end pt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						disabled: saving,
						className: "flex items-center gap-2 rounded-lg bg-blood px-7 py-3 font-display text-[12px] font-semibold uppercase tracking-wider text-white hover:bg-blood/90 transition-all shadow-[0_0_20px_rgba(179,18,23,0.35)] cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: saving ? "Saving..." : "Save Confidential Report Block Live" })]
					})
				})]
			}),
			activeTab === "inbox" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: [
							"ALL",
							"unread",
							"in_progress",
							"resolved"
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setInboxFilter(s);
								loadInboxData(s);
							},
							className: `rounded-lg px-3 py-1.5 font-mono text-[11px] uppercase transition-all cursor-pointer ${inboxFilter === s ? "bg-blood text-white font-bold" : "border border-white/10 bg-white/[0.03] text-white/60 hover:text-white"}`,
							children: s.replace("_", " ")
						}, s))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => loadInboxData(),
						className: "flex items-center gap-1.5 text-white/50 hover:text-white font-mono text-xs cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${loadingInbox ? "animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Refresh" })]
					})]
				}), inbox.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-white/10 bg-[#080808] p-12 text-center font-mono text-xs text-white/40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "mx-auto h-8 w-8 text-white/20 mb-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["No inquiries found under filter: ", inboxFilter] })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: inbox.map((msg) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/10 bg-[#080808] p-5 hover:border-white/20 transition-all font-mono text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-display text-sm font-bold uppercase text-white",
											children: msg.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-white/40",
											children: [
												"(",
												msg.email,
												")"
											]
										}),
										msg.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-white/40",
											children: ["📱 ", msg.phone]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: msg.status,
										onChange: (e) => handleUpdateStatus(msg.id, e.target.value),
										className: "rounded border border-white/15 bg-black px-2 py-1 text-[10px] text-white outline-none focus:border-blood",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "unread",
												children: "Unread"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "in_progress",
												children: "In Progress"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "resolved",
												children: "Resolved"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "archived",
												children: "Archived"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleDeleteMessage(msg.id),
										className: "p-1 text-white/40 hover:text-red-400 cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-bold text-white mb-1",
									children: ["Subject: ", msg.subject]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-white/70 leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5 whitespace-pre-wrap",
									children: msg.message
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center justify-between text-[10px] text-white/40 pt-2 border-t border-white/[0.04]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Case Interest: ", msg.case_interest || "General Inquiry"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Received: ", new Date(msg.created_at).toLocaleString()] })]
							})
						]
					}, msg.id))
				})]
			})
		]
	});
}
//#endregion
export { AdminContactCMS as component };
