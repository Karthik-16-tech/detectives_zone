import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { D as Save, Lt as Check, M as QrCode, Mt as CircleAlert, g as SlidersVertical, jt as CircleCheck, k as RefreshCw, wt as Copy, x as ShieldCheck } from "../_libs/lucide-react.mjs";
import { c as api } from "./router-CBHk_fdB.mjs";
import { t as AdminLayout } from "./AdminLayout-BazMIgX5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payments-DAww0_vC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPaymentsPage() {
	const [settings, setSettings] = (0, import_react.useState)({
		upi_id: "8885296645@ybl",
		phonepe_merchant_id: "PGTESTPAYUAT",
		phonepe_env: "UAT",
		phonepe_salt_key: "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399",
		phonepe_salt_index: "1",
		enable_upi: "true",
		enable_card: "true",
		enable_cod: "true"
	});
	const [savingUpi, setSavingUpi] = (0, import_react.useState)(false);
	const [savingAll, setSavingAll] = (0, import_react.useState)(false);
	const [upiSuccess, setUpiSuccess] = (0, import_react.useState)(false);
	const [allSuccess, setAllSuccess] = (0, import_react.useState)(false);
	const [errorMessage, setErrorMessage] = (0, import_react.useState)(null);
	const [copiedWebhook, setCopiedWebhook] = (0, import_react.useState)(false);
	const [previewAmount, setPreviewAmount] = (0, import_react.useState)(999);
	(0, import_react.useEffect)(() => {
		loadSettings();
	}, []);
	const loadSettings = async () => {
		try {
			const data = await api.getSettings();
			setSettings((prev) => ({
				...prev,
				...data,
				upi_id: data["upi_id"] || "8885296645@ybl",
				phonepe_merchant_id: data["phonepe_merchant_id"] || "PGTESTPAYUAT",
				phonepe_env: data["phonepe_env"] || "UAT",
				phonepe_salt_key: data["phonepe_salt_key"] || "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399",
				phonepe_salt_index: data["phonepe_salt_index"] || "1"
			}));
		} catch (err) {
			console.error(err);
		}
	};
	const handleSaveUpiOnly = async () => {
		const upi = settings.upi_id.trim();
		if (!upi || !upi.includes("@")) {
			setErrorMessage("Please enter a valid UPI ID (e.g. 8885296645@ybl)");
			return;
		}
		try {
			setSavingUpi(true);
			setErrorMessage(null);
			await api.updateUpiId(upi);
			setUpiSuccess(true);
			setTimeout(() => setUpiSuccess(false), 3500);
		} catch (err) {
			setErrorMessage(err.message || "Failed to update UPI ID");
		} finally {
			setSavingUpi(false);
		}
	};
	const handleSaveAll = async (e) => {
		e.preventDefault();
		try {
			setSavingAll(true);
			setErrorMessage(null);
			const updated = await api.bulkUpdateSettings({
				upi_id: settings.upi_id,
				phonepe_merchant_id: settings.phonepe_merchant_id,
				phonepe_env: settings.phonepe_env,
				phonepe_salt_key: settings.phonepe_salt_key,
				phonepe_salt_index: settings.phonepe_salt_index
			});
			setSettings((prev) => ({
				...prev,
				...updated,
				upi_id: updated["upi_id"] || prev.upi_id,
				phonepe_merchant_id: updated["phonepe_merchant_id"] || prev.phonepe_merchant_id,
				phonepe_env: updated["phonepe_env"] || prev.phonepe_env,
				phonepe_salt_key: updated["phonepe_salt_key"] || prev.phonepe_salt_key,
				phonepe_salt_index: updated["phonepe_salt_index"] || prev.phonepe_salt_index
			}));
			setAllSuccess(true);
			setTimeout(() => setAllSuccess(false), 3500);
		} catch (err) {
			setErrorMessage(err.message || "Failed to save payment gateway settings");
		} finally {
			setSavingAll(false);
		}
	};
	const webhookUrl = typeof window !== "undefined" ? `${window.location.origin}/api/v1/payments/phonepe/webhook` : "http://13.61.187.145/api/v1/payments/phonepe/webhook";
	const handleCopyWebhook = () => {
		navigator.clipboard.writeText(webhookUrl);
		setCopiedWebhook(true);
		setTimeout(() => setCopiedWebhook(false), 2500);
	};
	const liveUpiId = settings.upi_id.trim() || "8885296645@ybl";
	const dynamicQrPayload = `upi://pay?pa=${liveUpiId}&pn=Detective%20Zone&tr=PREVIEW_TEST&am=${previewAmount.toFixed(2)}&cu=INR&tn=Detective%20Zone%20Live%20Test`;
	const dynamicQrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(dynamicQrPayload)}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, {
		title: "Payment Gateway Control Panel",
		subtitle: "Configure PhonePe Gateway, Manage Merchant UPI ID & Live Verification Nodes",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-8 font-mono text-xs",
			children: [
				errorMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-400",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errorMessage })]
				}),
				allSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-400",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✓ Payment Gateway settings successfully synchronized and saved to database!" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-7 rounded-2xl border border-blood/50 bg-[#080808] p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(200,29,36,0.2)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-white/10 pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-10 w-10 rounded-xl bg-blood/20 border border-blood/40 flex items-center justify-center text-blood",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-6 w-6" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-base font-bold uppercase tracking-wider text-white",
										children: "Merchant UPI ID Manager"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-white/50",
										children: "Dynamic settlement receiver for PhonePe, GPay, Paytm & UPI Apps"
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[9px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold",
									children: "Live Active"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block text-white uppercase text-xs font-bold",
										children: ["Active Receiver UPI ID ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-blood",
											children: "*"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "relative flex-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												required: true,
												value: settings.upi_id,
												onChange: (e) => setSettings({
													...settings,
													upi_id: e.target.value
												}),
												placeholder: "8885296645@ybl",
												className: "w-full rounded-xl border border-blood/60 bg-black/90 px-4 py-3 text-white font-mono text-sm outline-none focus:border-blood focus:ring-1 focus:ring-blood shadow-[0_0_15px_rgba(200,29,36,0.2)]"
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: handleSaveUpiOnly,
											disabled: savingUpi,
											className: "rounded-xl bg-blood px-6 py-3 font-display text-xs font-bold uppercase tracking-wider text-white hover:bg-blood/90 transition-all cursor-pointer shrink-0 disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(200,29,36,0.35)]",
											children: savingUpi ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Saving..." })] }) : upiSuccess ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✓ Updated!" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Update UPI ID" })] })
										})]
									}),
									upiSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-400 text-xs animate-in fade-in flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Successfully updated! All checkout QR codes and UPI links are now dynamically routed to ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: settings.upi_id }),
											"."
										] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-white/50 leading-relaxed pt-1",
										children: "You can change this UPI address at any time. The update takes effect immediately without needing server restarts or rebuilding."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-white/10 pt-4 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-wider text-white/40 block",
									children: "Compatible Scanning Applications:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2",
									children: [
										"PhonePe",
										"Google Pay (GPay)",
										"Paytm",
										"BHIM UPI",
										"Cred",
										"Amazon Pay",
										"Bank Apps"
									].map((app) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-lg border border-white/10 bg-black/60 px-2.5 py-1 text-[10px] text-white/70",
										children: app
									}, app))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-white/10 bg-black/40 p-4 space-y-2 text-[10px] text-white/60",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-white font-bold uppercase text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Zero Client-Side Trust Enforced" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "leading-relaxed",
									children: "Orders are never marked paid based on client clicks. The backend checks PhonePe Status API or receives validated webhooks with SHA256 signature verification before marking orders as confirmed and deducting inventory."
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-5 rounded-2xl border border-white/10 bg-[#080808] p-6 text-center space-y-5 shadow-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-white/10 pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "font-display text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-4 w-4 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Live QR Code Simulator" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] text-white/40 font-mono",
									children: "Real-time render"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[10px] text-white/60",
								children: [
									"Scan this preview with your phone to test the current UPI ID (",
									liveUpiId,
									"):"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto w-fit p-4 bg-white rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: dynamicQrImageUrl,
									alt: "Dynamic UPI QR Preview",
									className: "h-48 w-48 object-contain rounded-lg"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-white/10 bg-black/60 p-3 space-y-2 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center text-[10px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-white/50 uppercase",
										children: "Test Payload Amount:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-display text-sm font-bold text-blood",
										children: ["₹", previewAmount.toLocaleString()]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-3 gap-2",
									children: [
										499,
										999,
										1499
									].map((amt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setPreviewAmount(amt),
										className: `py-1 rounded border text-[10px] font-bold transition-all cursor-pointer ${previewAmount === amt ? "border-blood bg-blood/20 text-white" : "border-white/10 bg-black text-white/50 hover:text-white"}`,
										children: ["₹", amt]
									}, amt))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-left space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] uppercase text-white/40 block",
									children: "Encoded UPI Deep Link:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "text-[10px] text-white/70 select-all block bg-black/80 p-2 rounded-lg border border-white/5 truncate font-mono",
									children: dynamicQrPayload
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSaveAll,
					className: "rounded-2xl border border-white/10 bg-[#080808] p-6 sm:p-8 space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between border-b border-white/10 pb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-10 w-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "h-6 w-6" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-base font-bold uppercase tracking-wider text-white",
									children: "PhonePe API Credentials & Webhook Listener"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-white/50",
									children: "Configure merchant credentials, secret keys, and webhook callback URLs"
								})] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-3 gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block uppercase text-white/50 mb-1.5 font-bold",
									children: "PhonePe Merchant ID"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: settings.phonepe_merchant_id,
									onChange: (e) => setSettings({
										...settings,
										phonepe_merchant_id: e.target.value
									}),
									placeholder: "PGTESTPAYUAT",
									className: "w-full rounded-xl border border-white/10 bg-black/70 p-3 text-white outline-none focus:border-blood font-mono text-xs"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block uppercase text-white/50 mb-1.5 font-bold",
									children: "Gateway Environment"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: settings.phonepe_env,
									onChange: (e) => setSettings({
										...settings,
										phonepe_env: e.target.value
									}),
									className: "w-full rounded-xl border border-white/10 bg-black/70 p-3 text-white outline-none focus:border-blood font-mono text-xs cursor-pointer",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "UAT",
											children: "UAT Sandbox (Test Mode)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "PRODUCTION",
											children: "Production (Live Hermes API)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "SIMULATED",
											children: "Simulated Mode (Mock Transactions)"
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block uppercase text-white/50 mb-1.5 font-bold",
									children: "Salt Key Index"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: settings.phonepe_salt_index,
									onChange: (e) => setSettings({
										...settings,
										phonepe_salt_index: e.target.value
									}),
									placeholder: "1",
									className: "w-full rounded-xl border border-white/10 bg-black/70 p-3 text-white outline-none focus:border-blood font-mono text-xs"
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block uppercase text-white/50 mb-1.5 font-bold",
							children: "PhonePe Salt Key / Secret Key"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							value: settings.phonepe_salt_key,
							onChange: (e) => setSettings({
								...settings,
								phonepe_salt_key: e.target.value
							}),
							placeholder: "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399",
							className: "w-full rounded-xl border border-white/10 bg-black/70 p-3 text-white outline-none focus:border-blood font-mono text-xs"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-white/10 bg-black/60 p-4 space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-white/80 font-bold uppercase text-[11px]",
										children: "PhonePe Server Webhook Endpoint (For PhonePe Merchant Dashboard):"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: handleCopyWebhook,
										className: "flex items-center gap-1.5 text-blood hover:text-red-400 transition-colors cursor-pointer text-[10px] font-bold uppercase",
										children: [copiedWebhook ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copiedWebhook ? "Copied!" : "Copy Webhook URL" })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "text-blood select-all block bg-black p-2.5 rounded-lg border border-white/5 font-mono text-[11px]",
									children: webhookUrl
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-white/40",
									children: "Provide this endpoint to PhonePe to receive instant payment confirmation callbacks with SHA256 X-VERIFY headers."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end pt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: savingAll,
								className: "rounded-xl bg-blood px-8 py-3.5 font-display text-xs font-bold uppercase tracking-wider text-white hover:bg-blood/90 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-[0_0_20px_rgba(200,29,36,0.35)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: savingAll ? "Saving Configuration..." : "Save All Gateway Settings" })]
							})
						})
					]
				})
			]
		})
	});
}
//#endregion
export { AdminPaymentsPage as component };
