import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { D as Save, G as MessageCircle, Mt as CircleAlert, bt as ExternalLink, h as Smartphone, jt as CircleCheck, x as ShieldCheck } from "../_libs/lucide-react.mjs";
import { c as api, r as useAdminAuth } from "./router-CBHk_fdB.mjs";
import { t as AdminLayout } from "./AdminLayout-BazMIgX5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/whatsapp-DB8HCQSm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminWhatsAppPanel() {
	const { admin } = useAdminAuth();
	const [settings, setSettings] = (0, import_react.useState)({
		whatsapp_phone_number: "6305729867",
		whatsapp_message: "Hi Detective Zone Team, I have an inquiry about case files.",
		whatsapp_order_msg: "Hi Detective Zone, I placed an order and want to confirm my delivery details.",
		whatsapp_enabled: "true",
		whatsapp_position: "bottom-left"
	});
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [success, setSuccess] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		loadSettings();
	}, []);
	const loadSettings = async () => {
		try {
			setLoading(true);
			const data = await api.getSettings();
			if (data) setSettings((prev) => ({
				...prev,
				whatsapp_phone_number: data.whatsapp_phone_number || "6305729867",
				whatsapp_message: data.whatsapp_message || "Hi Detective Zone Team, I have an inquiry about case files.",
				whatsapp_order_msg: data.whatsapp_order_msg || "Hi Detective Zone, I placed an order and want to confirm my delivery details.",
				whatsapp_enabled: data.whatsapp_enabled ?? "true",
				whatsapp_position: data.whatsapp_position || "bottom-left"
			}));
		} catch (err) {
			console.error("Failed to load WhatsApp settings", err);
		} finally {
			setLoading(false);
		}
	};
	const handleSave = async (e) => {
		if (e) e.preventDefault();
		setError(null);
		setSuccess(false);
		const phone = settings.whatsapp_phone_number?.trim() || "";
		if (!phone) {
			setError("Please enter a valid WhatsApp phone number.");
			return;
		}
		try {
			setSaving(true);
			const updated = await api.bulkUpdateSettings({
				whatsapp_phone_number: phone,
				whatsapp_message: settings.whatsapp_message || "Hi Detective Zone Team, I have an inquiry.",
				whatsapp_order_msg: settings.whatsapp_order_msg || "Hi Detective Zone, I placed an order.",
				whatsapp_enabled: settings.whatsapp_enabled || "true",
				whatsapp_position: settings.whatsapp_position || "bottom-left"
			});
			setSettings((prev) => ({
				...prev,
				...updated
			}));
			setSuccess(true);
			setTimeout(() => setSuccess(false), 4e3);
		} catch (err) {
			setError(err.message || "Failed to update WhatsApp configuration.");
		} finally {
			setSaving(false);
		}
	};
	const cleanNumber = (settings.whatsapp_phone_number || "6305729867").replace(/[^0-9]/g, "");
	const liveUrl = `https://wa.me/${cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber || "916305729867"}?text=${encodeURIComponent(settings.whatsapp_message || "Hi Detective Zone Team, I have an inquiry.")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, {
		title: "WhatsApp Redirection & Dispatch Panel",
		subtitle: "Configure Live WhatsApp Support, Destination Number & Customer Redirection",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => handleSave(),
			disabled: saving || loading,
			className: "flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-[#20bd5a] hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(37,211,102,0.35)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: saving ? "Saving..." : success ? "✓ Saved to Database!" : "Save Changes" })]
		}),
		children: [
			success && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center gap-3 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 p-4 font-mono text-xs text-[#25D366] shadow-[0_0_20px_rgba(37,211,102,0.15)] animate-in fade-in",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-bold",
					children: "WhatsApp Configuration Updated Successfully!"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-white/60 text-[11px] mt-0.5",
					children: [
						"All website visitors clicking the floating WhatsApp chat button will now be redirected to ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["+91 ", settings.whatsapp_phone_number] }),
						"."
					]
				})] })]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-4 font-mono text-xs text-red-300",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-7 space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
						onSubmit: handleSave,
						className: "space-y-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-white/10 bg-[#080808] p-6 sm:p-7 space-y-6 shadow-xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between pb-4 border-b border-white/10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-10 w-10 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-5 w-5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-base font-bold uppercase tracking-wider text-white",
											children: "WhatsApp Redirection Settings"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-[10px] uppercase tracking-wider text-white/40",
											children: "Destination Phone Number & Live Triggers"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 px-3 py-1 font-mono text-[10px] uppercase font-bold text-[#25D366]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-[#25D366] animate-pulse" }), "Live Sync"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block font-mono text-xs uppercase font-bold text-white/80",
												children: ["WhatsApp Destination Number ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[#25D366]",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-[10px] text-white/40",
												children: "10-digit Indian Mobile Number"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative flex items-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "absolute left-3.5 font-mono text-sm text-[#25D366] font-bold select-none",
												children: "+91"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												required: true,
												value: settings.whatsapp_phone_number || "",
												onChange: (e) => setSettings({
													...settings,
													whatsapp_phone_number: e.target.value
												}),
												placeholder: "6305729867",
												className: "w-full rounded-xl border border-white/15 bg-black/80 py-3.5 pl-14 pr-4 font-mono text-base font-bold text-white outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-[11px] text-white/50",
											children: "Customer clicks on the floating chat button will immediately launch WhatsApp with this phone number."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block font-mono text-xs uppercase font-bold text-white/80",
											children: "Default Pre-filled Inquiry Message"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											rows: 3,
											value: settings.whatsapp_message || "",
											onChange: (e) => setSettings({
												...settings,
												whatsapp_message: e.target.value
											}),
											placeholder: "Hi Detective Zone Team, I have an inquiry about case files.",
											className: "w-full rounded-xl border border-white/15 bg-black/80 p-3.5 font-sans text-xs text-white outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] transition-all"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-[10px] text-white/40",
											children: "This text automatically populates the user's WhatsApp message input when they open the chat."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block font-mono text-xs uppercase font-bold text-white/80",
										children: "Order Updates & Tracking Message Template"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: settings.whatsapp_order_msg || "",
										onChange: (e) => setSettings({
											...settings,
											whatsapp_order_msg: e.target.value
										}),
										placeholder: "Hi Detective Zone, I placed an order and want to confirm my delivery details.",
										className: "w-full rounded-xl border border-white/15 bg-black/80 p-3.5 font-sans text-xs text-white outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] transition-all"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block font-mono text-xs uppercase font-bold text-white/80 mb-2",
										children: "Button Screen Position"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: settings.whatsapp_position || "bottom-left",
										onChange: (e) => setSettings({
											...settings,
											whatsapp_position: e.target.value
										}),
										className: "w-full rounded-xl border border-white/15 bg-black/80 p-3 font-mono text-xs text-white outline-none focus:border-[#25D366]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "bottom-left",
											children: "Bottom-Left Corner (Recommended)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "bottom-right",
											children: "Bottom-Right Corner"
										})]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block font-mono text-xs uppercase font-bold text-white/80 mb-2",
										children: "Floating Button Visibility"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: settings.whatsapp_enabled || "true",
										onChange: (e) => setSettings({
											...settings,
											whatsapp_enabled: e.target.value
										}),
										className: "w-full rounded-xl border border-white/15 bg-black/80 p-3 font-mono text-xs text-white outline-none focus:border-[#25D366]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "true",
											children: "Active & Visible on Frontend"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "false",
											children: "Hidden / Disabled"
										})]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "submit",
										disabled: saving,
										className: "w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 font-display text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-[#20bd5a] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-[0_4px_20px_rgba(37,211,102,0.3)]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: saving ? "Saving to Cloud Database..." : "Save WhatsApp Settings" })]
									})
								})
							]
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-5 space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-[#25D366]/30 bg-gradient-to-b from-[#07180e] to-[#0a0a0a] p-6 space-y-5 shadow-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-5 w-5 text-[#25D366]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-sm font-bold uppercase tracking-wider text-white",
									children: "Live Click Redirection Test"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs text-white/60",
								children: "Test your configured WhatsApp chat link in real-time. Clicking below simulates the exact user experience when a visitor taps the floating chat button."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-white/10 bg-black/60 p-3.5 font-mono text-[11px] break-all space-y-1 text-white/80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] uppercase tracking-wider text-white/40 block",
									children: "Generated API Link:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "text-[#25D366] select-all block",
									children: liveUrl
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: liveUrl,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "flex items-center justify-center gap-2 rounded-xl border border-[#25D366]/50 bg-[#25D366]/10 py-3 font-display text-xs font-bold uppercase tracking-wider text-[#25D366] hover:bg-[#25D366] hover:text-black transition-all cursor-pointer shadow-[0_0_15px_rgba(37,211,102,0.15)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Test Open WhatsApp (+91 ",
									settings.whatsapp_phone_number || "6305729867",
									")"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" })]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-white/10 bg-[#080808] p-6 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-display text-xs font-bold uppercase tracking-wider text-white/70",
								children: "Frontend Button Visual Preview"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative h-44 rounded-xl border border-white/10 bg-[#040404] p-4 flex flex-col justify-between overflow-hidden",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-[10px] font-mono text-white/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Frontend Case Dossiers" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Detective Zone" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-[10px] text-white/20 text-center",
										children: "User browsing cases & evidence"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `flex items-center gap-2 ${settings.whatsapp_position === "bottom-right" ? "justify-end" : "justify-start"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg cursor-pointer transition-transform hover:scale-110",
											style: { backgroundColor: "#25D366" },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-5 w-5 text-white" })
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-mono text-[10px] text-emerald-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Clean circular design · No beacon overlay · Zero latency" })]
							})
						]
					})]
				})]
			})
		]
	});
}
//#endregion
export { AdminWhatsAppPanel as component };
