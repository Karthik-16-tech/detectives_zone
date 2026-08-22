import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { D as Save, G as MessageCircle, b as Shield, bt as ExternalLink, it as KeyRound, jt as CircleCheck } from "../_libs/lucide-react.mjs";
import { c as api, r as useAdminAuth } from "./router-CBHk_fdB.mjs";
import { t as AdminLayout } from "./AdminLayout-BazMIgX5.mjs";
import { t as ImageUploadField } from "./ImageUploadField-DjD9Z7O9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-oExUxSni.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminSettings() {
	const { admin } = useAdminAuth();
	const [settings, setSettings] = (0, import_react.useState)({
		site_name: "Detective Zone",
		hero_title: "Detective Zone",
		hero_subtitle: "An Archive of Unfinished Truths",
		contact_email: "files@detectivezone.co",
		contact_phone: "+91 63057 29867",
		whatsapp_phone_number: "8885296645",
		whatsapp_message: "Hi Detective Zone Team, I have an inquiry about case files.",
		office_address: "114 W 41st Street, New York, NY 10036",
		shipping_flat_rate: "12.00",
		free_shipping_threshold: "75.00"
	});
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [success, setSuccess] = (0, import_react.useState)(false);
	const [savingUpi, setSavingUpi] = (0, import_react.useState)(false);
	const [upiSuccess, setUpiSuccess] = (0, import_react.useState)(false);
	const [savingWhatsApp, setSavingWhatsApp] = (0, import_react.useState)(false);
	const [whatsappSuccess, setWhatsappSuccess] = (0, import_react.useState)(false);
	const handleSaveUpiId = async () => {
		const upi = settings.upi_id?.trim() || "";
		if (!upi || !upi.includes("@")) {
			alert("Please enter a valid UPI address (e.g. 8885296645@ybl)");
			return;
		}
		try {
			setSavingUpi(true);
			await api.updateUpiId(upi);
			setUpiSuccess(true);
			setTimeout(() => setUpiSuccess(false), 3e3);
		} catch (err) {
			alert(err.message || "Failed to update UPI ID");
		} finally {
			setSavingUpi(false);
		}
	};
	const handleSaveWhatsApp = async () => {
		const phone = settings.whatsapp_phone_number?.trim() || "";
		if (!phone) {
			alert("Please enter a valid WhatsApp phone number (e.g. 8885296645)");
			return;
		}
		try {
			setSavingWhatsApp(true);
			await api.bulkUpdateSettings({
				whatsapp_phone_number: phone,
				whatsapp_message: settings.whatsapp_message || "Hi Detective Zone Team, I have an inquiry."
			});
			setWhatsappSuccess(true);
			setTimeout(() => setWhatsappSuccess(false), 3e3);
		} catch (err) {
			alert(err.message || "Failed to update WhatsApp settings");
		} finally {
			setSavingWhatsApp(false);
		}
	};
	const [currentPassword, setCurrentPassword] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [pwdError, setPwdError] = (0, import_react.useState)(null);
	const [pwdSuccess, setPwdSuccess] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		loadSettings();
	}, []);
	const loadSettings = async () => {
		try {
			setLoading(true);
			const data = await api.getSettings();
			setSettings((prev) => ({
				...prev,
				...data
			}));
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	const handleSaveSettings = async (e) => {
		e.preventDefault();
		setSaving(true);
		setSuccess(false);
		try {
			const updated = await api.bulkUpdateSettings(settings);
			setSettings((prev) => ({
				...prev,
				...updated
			}));
			setSuccess(true);
			setTimeout(() => setSuccess(false), 3e3);
		} catch (err) {
			alert(err.message || "Failed to update settings");
		} finally {
			setSaving(false);
		}
	};
	const handleChangePassword = async (e) => {
		e.preventDefault();
		setPwdError(null);
		setPwdSuccess(false);
		if (newPassword !== confirmPassword) {
			setPwdError("New passwords do not match");
			return;
		}
		try {
			await api.changePassword({
				current_password: currentPassword,
				new_password: newPassword
			});
			setPwdSuccess(true);
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			setTimeout(() => setPwdSuccess(false), 3e3);
		} catch (err) {
			setPwdError(err.message || "Failed to change password");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, {
		title: "Global Settings & Clearance",
		subtitle: "Site Identity, Contact Points & Access Passcodes",
		children: [success && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3.5 font-mono text-xs text-emerald-300 flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Site settings successfully synchronized across all client portals." })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-12 gap-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-7 space-y-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSaveSettings,
					className: "rounded-xl border border-white/[0.08] bg-[#070707] p-6 space-y-5 font-mono text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-base font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3",
							children: "Site Brand & Content Defaults"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block uppercase text-white/50 mb-1",
							children: "Organization / Brand Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: settings.site_name || "",
							onChange: (e) => setSettings({
								...settings,
								site_name: e.target.value
							}),
							className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood font-sans text-sm"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block uppercase text-white/50 mb-1",
								children: "Hero Main Title"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: settings.hero_title || "",
								onChange: (e) => setSettings({
									...settings,
									hero_title: e.target.value
								}),
								className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood font-sans text-sm"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block uppercase text-white/50 mb-1",
								children: "Hero Subtitle"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: settings.hero_subtitle || "",
								onChange: (e) => setSettings({
									...settings,
									hero_subtitle: e.target.value
								}),
								className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood font-sans text-sm"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-white/10 pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-display text-xs font-bold uppercase tracking-wider text-white mb-3",
								children: "Homepage Hero & Media Overrides"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadField, {
									label: "Hero Video File / S3 URL (Interactive Scrub)",
									value: settings.hero_video_url || "",
									onChange: (val) => setSettings({
										...settings,
										hero_video_url: val
									}),
									folder: "general",
									placeholder: "https://bucket.s3.amazonaws.com/hero.mp4 or upload file"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-white/10 pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-display text-xs font-bold uppercase tracking-wider text-white mb-3",
								children: "Homepage About Section (File 002)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase text-white/50 mb-1",
										children: "About Headline"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: settings.about_heading || "",
										onChange: (e) => setSettings({
											...settings,
											about_heading: e.target.value
										}),
										placeholder: "Every shadow has a story",
										className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood font-sans text-sm"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase text-white/50 mb-1",
										children: "About Narrative Text"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 3,
										value: settings.about_text || "",
										onChange: (e) => setSettings({
											...settings,
											about_text: e.target.value
										}),
										placeholder: "Detective Zone is a story-driven investigation experience...",
										className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood font-sans text-xs"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadField, {
										label: "About Street Photo (S3 URL or Upload)",
										value: settings.about_image || "",
										onChange: (val) => setSettings({
											...settings,
											about_image: val
										}),
										folder: "general",
										placeholder: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/noir-street.jpg or S3 URL"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-white/10 pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-display text-xs font-bold uppercase tracking-wider text-white mb-3",
								children: "Homepage Case Challenge (003)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase text-white/50 mb-1",
										children: "Reward Discount Text"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: settings.challenge_discount || "",
										onChange: (e) => setSettings({
											...settings,
											challenge_discount: e.target.value
										}),
										placeholder: "25% OFF",
										className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase text-white/50 mb-1",
										children: "Reward Promo Code"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: settings.challenge_code || "",
										onChange: (e) => setSettings({
											...settings,
											challenge_code: e.target.value
										}),
										placeholder: "DZ25-SOLVED",
										className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "sm:col-span-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadField, {
											label: "Room 104 Crime Scene Image (S3 URL or Upload)",
											value: settings.challenge_image || "",
											onChange: (val) => setSettings({
												...settings,
												challenge_image: val
											}),
											folder: "evidence",
											placeholder: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence-room.jpg or S3 URL"
										})
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-white/10 pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-display text-xs font-bold uppercase tracking-wider text-white mb-3",
								children: "Store Page Featured Case Kit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase text-white/50 mb-1",
										children: "Featured Kit Title"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: settings.featured_kit_title || "",
										onChange: (e) => setSettings({
											...settings,
											featured_kit_title: e.target.value
										}),
										placeholder: "The Last Voicemail",
										className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase text-white/50 mb-1",
										children: "Featured Kit Code"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: settings.featured_kit_code || "",
										onChange: (e) => setSettings({
											...settings,
											featured_kit_code: e.target.value
										}),
										placeholder: "DZ-001",
										className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase text-white/50 mb-1",
										children: "Featured Price ($ / ₹)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: settings.featured_kit_price || "",
										onChange: (e) => setSettings({
											...settings,
											featured_kit_price: e.target.value
										}),
										placeholder: "999",
										className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "sm:col-span-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadField, {
											label: "Featured Kit Box Image (S3 URL or Upload)",
											value: settings.featured_kit_image || "",
											onChange: (val) => setSettings({
												...settings,
												featured_kit_image: val
											}),
											folder: "kits",
											placeholder: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/case_kits/image.png or S3 URL"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block uppercase text-white/50 mb-1",
											children: "Featured Quote / Hook"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: settings.featured_kit_quote || "",
											onChange: (e) => setSettings({
												...settings,
												featured_kit_quote: e.target.value
											}),
											placeholder: "\"A sealed case. A missing voice. Thirty pieces of evidence...\"",
											className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-white/10 pt-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-display text-xs font-bold uppercase tracking-wider text-white mb-3",
									children: "Official Contact & Dispatch Points"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase text-white/50 mb-1",
										children: "Dispatch Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "email",
										value: settings.contact_email || "",
										onChange: (e) => setSettings({
											...settings,
											contact_email: e.target.value
										}),
										className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase text-white/50 mb-1",
										children: "Secure Line"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: settings.contact_phone || "",
										onChange: (e) => setSettings({
											...settings,
											contact_phone: e.target.value
										}),
										className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase text-white/50 mb-1",
										children: "Office / Bureau Address"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: settings.office_address || "",
										onChange: (e) => setSettings({
											...settings,
											office_address: e.target.value
										}),
										className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood font-sans text-sm"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-white/10 pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "font-display text-xs font-bold uppercase tracking-wider text-blood flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "UPI Payment Gateway & PhonePe Settings" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[9px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold",
									children: "Backend Verified"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between mb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block uppercase text-white/70 font-bold text-xs",
												children: ["Active Merchant UPI ID ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-blood",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-white/40 font-mono",
												children: "Scanned by PhonePe, GPay, Paytm"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												required: true,
												value: settings.upi_id || "8885296645@ybl",
												onChange: (e) => setSettings({
													...settings,
													upi_id: e.target.value
												}),
												placeholder: "8885296645@ybl",
												className: "flex-1 rounded-lg border border-blood/50 bg-black/80 p-2.5 text-white font-mono text-sm outline-none focus:border-blood focus:ring-1 focus:ring-blood shadow-[0_0_12px_rgba(200,29,36,0.15)]"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: handleSaveUpiId,
												disabled: savingUpi,
												className: "rounded-lg bg-blood px-4 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-white hover:bg-blood/90 transition-all cursor-pointer shrink-0 disabled:opacity-50 flex items-center gap-1.5 shadow-[0_0_15px_rgba(200,29,36,0.3)]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: savingUpi ? "Saving..." : upiSuccess ? "✓ Updated!" : "Update UPI" })]
											})]
										}),
										upiSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-[11px] text-emerald-400 font-mono font-bold animate-in fade-in",
											children: [
												"✓ Merchant UPI ID updated! All customer payment QR codes are now routing to ",
												settings.upi_id,
												"."
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-[10px] text-white/50",
											children: "All customer QR codes and UPI deep links will dynamically route payments to this UPI address."
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block uppercase text-white/50 mb-1",
											children: "PhonePe Merchant ID"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: settings.phonepe_merchant_id || "PGTESTPAYUAT",
											onChange: (e) => setSettings({
												...settings,
												phonepe_merchant_id: e.target.value
											}),
											placeholder: "PGTESTPAYUAT",
											className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood font-mono text-xs"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block uppercase text-white/50 mb-1",
											children: "Gateway Environment"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: settings.phonepe_env || "UAT",
											onChange: (e) => setSettings({
												...settings,
												phonepe_env: e.target.value
											}),
											className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood font-mono text-xs",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "UAT",
													children: "UAT Sandbox (Test Environment)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "PRODUCTION",
													children: "Production (Live Hermes)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "SIMULATED",
													children: "Simulated Mode (Local Mock)"
												})
											]
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-[10px] space-y-1 text-white/60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-white/80 font-bold uppercase",
											children: "PhonePe Webhook Endpoint:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "text-blood select-all block bg-black/80 p-1.5 rounded border border-white/5",
											children: "POST /api/v1/payments/phonepe/webhook"
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-white/10 pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "font-display text-xs font-bold uppercase tracking-wider text-[#25D366] flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-3.5 w-3.5 text-[#25D366]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "WhatsApp Floating Chat & Redirection Settings" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[9px] uppercase tracking-wider text-[#25D366] bg-[#25D366]/10 border border-[#25D366]/30 px-2 py-0.5 rounded-full font-bold",
									children: "Frontend Dynamic Sync"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "block uppercase text-white/70 font-bold text-xs",
											children: ["WhatsApp Destination Number ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[#25D366]",
												children: "*"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-white/40 font-mono",
											children: "10-Digit Mobile / Country Code Included"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											required: true,
											value: settings.whatsapp_phone_number || "6305729867",
											onChange: (e) => setSettings({
												...settings,
												whatsapp_phone_number: e.target.value
											}),
											placeholder: "6305729867",
											className: "flex-1 rounded-lg border border-[#25D366]/50 bg-black/80 p-2.5 text-white font-mono text-sm outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] shadow-[0_0_12px_rgba(37,211,102,0.15)]"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: handleSaveWhatsApp,
											disabled: savingWhatsApp,
											className: "rounded-lg bg-[#25D366] px-4 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-black hover:bg-[#20bd5a] transition-all cursor-pointer shrink-0 disabled:opacity-50 flex items-center gap-1.5 shadow-[0_0_15px_rgba(37,211,102,0.3)]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: savingWhatsApp ? "Saving..." : whatsappSuccess ? "✓ Updated!" : "Update WhatsApp" })]
										})]
									}),
									whatsappSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-[11px] text-[#25D366] font-mono font-bold animate-in fade-in",
										children: [
											"✓ WhatsApp number updated! All floating chat buttons across the website now redirect to ",
											settings.whatsapp_phone_number,
											"."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-[10px] text-white/50",
										children: "Visitors clicking the floating WhatsApp button on any frontend page will instantly open a chat with this number."
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase text-white/50 mb-1",
										children: "Default Pre-filled Inquiry Message"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: settings.whatsapp_message || "Hi Detective Zone Team, I have an inquiry.",
										onChange: (e) => setSettings({
											...settings,
											whatsapp_message: e.target.value
										}),
										placeholder: "Hi Detective Zone Team, I have an inquiry about case files.",
										className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-[#25D366] font-sans text-xs"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex items-center gap-2 font-mono text-[10px] text-white/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Live Clickable Test Link:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: `https://wa.me/${(settings.whatsapp_phone_number || "6305729867").replace(/[^0-9]/g, "").length === 10 ? "91" + (settings.whatsapp_phone_number || "6305729867").replace(/[^0-9]/g, "") : (settings.whatsapp_phone_number || "6305729867").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(settings.whatsapp_message || "Hi Detective Zone Team, I have an inquiry.")}`,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "text-[#25D366] hover:underline flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["wa.me/", settings.whatsapp_phone_number || "6305729867"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3 h-3" })]
										})]
									})
								] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-white/10 pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-display text-xs font-bold uppercase tracking-wider text-white mb-3",
								children: "Store Shipping Policies"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block uppercase text-white/50 mb-1",
									children: "Flat Rate Shipping ($)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: settings.shipping_flat_rate || "",
									onChange: (e) => setSettings({
										...settings,
										shipping_flat_rate: e.target.value
									}),
									className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block uppercase text-white/50 mb-1",
									children: "Free Shipping Threshold ($)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: settings.free_shipping_threshold || "",
									onChange: (e) => setSettings({
										...settings,
										free_shipping_threshold: e.target.value
									}),
									className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
								})] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: saving,
							className: "flex items-center gap-2 rounded-lg bg-blood px-5 py-2.5 font-display text-xs font-semibold uppercase tracking-wider text-white hover:bg-blood/90 transition-all shadow-[0_0_20px_rgba(179,18,23,0.35)] disabled:opacity-50 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: saving ? "Synchronizing..." : "Save Global Settings" })]
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-5 space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-white/[0.08] bg-[#070707] p-6 font-mono text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-display text-base font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Agent Clearance Profile" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-2 text-white/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "uppercase text-white/40",
									children: "Agent Name:"
								}),
								" ",
								admin?.full_name || "Lead Investigator"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "uppercase text-white/40",
									children: "Username:"
								}),
								" ",
								admin?.username || "admin"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "uppercase text-white/40",
									children: "Email:"
								}),
								" ",
								admin?.email || "admin@detectivezone.co"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "uppercase text-white/40",
									children: "Role:"
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded bg-blood/20 text-blood px-2 py-0.5 font-bold uppercase",
									children: admin?.role || "superadmin"
								})
							] })
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleChangePassword,
					className: "rounded-xl border border-white/[0.08] bg-[#070707] p-6 space-y-4 font-mono text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display text-base font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Change Clearance Passcode" })]
						}),
						pwdSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-300",
							children: "Passcode changed successfully!"
						}),
						pwdError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg border border-blood/40 bg-blood/10 p-3 text-red-300",
							children: pwdError
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block uppercase text-white/50 mb-1",
							children: "Current Passcode"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							required: true,
							value: currentPassword,
							onChange: (e) => setCurrentPassword(e.target.value),
							className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block uppercase text-white/50 mb-1",
							children: "New Passcode"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							required: true,
							value: newPassword,
							onChange: (e) => setNewPassword(e.target.value),
							className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block uppercase text-white/50 mb-1",
							children: "Confirm New Passcode"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							required: true,
							value: confirmPassword,
							onChange: (e) => setConfirmPassword(e.target.value),
							className: "w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "w-full rounded-lg bg-white/10 py-2.5 font-display text-xs font-semibold uppercase tracking-wider text-white hover:bg-blood transition-colors cursor-pointer",
							children: "Update Passcode"
						})
					]
				})]
			})]
		})]
	});
}
//#endregion
export { AdminSettings as component };
