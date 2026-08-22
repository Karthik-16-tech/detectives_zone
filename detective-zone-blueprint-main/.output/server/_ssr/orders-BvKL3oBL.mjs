import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { D as Save, G as MessageCircle, R as PenLine, X as Mail, _t as FileCode, i as X, jt as CircleCheck, k as RefreshCw, u as Trash2, v as ShoppingCart, w as Search, x as ShieldCheck, xt as Download, zt as Calendar } from "../_libs/lucide-react.mjs";
import { c as api } from "./router-CBHk_fdB.mjs";
import { t as AdminLayout } from "./AdminLayout-BazMIgX5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-BvKL3oBL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminOrders() {
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("ALL");
	const [search, setSearch] = (0, import_react.useState)("");
	const [sortBy, setSortBy] = (0, import_react.useState)("newest");
	const [selectedOrder, setSelectedOrder] = (0, import_react.useState)(null);
	const [showAcceptModal, setShowAcceptModal] = (0, import_react.useState)(false);
	const [deliveryDateInput, setDeliveryDateInput] = (0, import_react.useState)("");
	const [acceptNotes, setAcceptNotes] = (0, import_react.useState)("");
	const [accepting, setAccepting] = (0, import_react.useState)(false);
	const [isEditingOrder, setIsEditingOrder] = (0, import_react.useState)(false);
	const [editFormData, setEditFormData] = (0, import_react.useState)({});
	const [savingEdit, setSavingEdit] = (0, import_react.useState)(false);
	const [updatingStatus, setUpdatingStatus] = (0, import_react.useState)(false);
	const [toastMessage, setToastMessage] = (0, import_react.useState)(null);
	const [exportingJson, setExportingJson] = (0, import_react.useState)(false);
	const handleStartEdit = (order) => {
		setEditFormData({
			customer_name: order.customer_name || "",
			customer_email: order.customer_email || "",
			customer_phone: order.customer_phone || "",
			shipping_address: order.shipping_address || "",
			city: order.city || "",
			state: order.state || "",
			postal_code: order.postal_code || "",
			country: order.country || "India",
			expected_delivery_date: order.expected_delivery_date || "",
			tracking_number: order.tracking_number || "",
			courier_name: order.courier_name || "",
			order_status: order.order_status || "PAYMENT_CONFIRMED",
			payment_status: order.payment_status || "PENDING",
			notes: order.notes || ""
		});
		setIsEditingOrder(true);
	};
	const handleSaveEdit = async (e) => {
		e.preventDefault();
		if (!selectedOrder) return;
		try {
			setSavingEdit(true);
			const updated = await api.adminEditOrder(selectedOrder.id, editFormData);
			setOrders(orders.map((o) => o.id === updated.id ? updated : o));
			setSelectedOrder(updated);
			setIsEditingOrder(false);
			showToast(`✓ Order #${updated.order_number} details successfully updated!`);
		} catch (err) {
			alert(err.message || "Failed to update order details");
		} finally {
			setSavingEdit(false);
		}
	};
	const handleSendWhatsAppConfirmation = (order) => {
		const rawPhone = String(order.customer_phone || "").replace(/\D/g, "");
		const phone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
		const isCod = String(order.payment_method).toUpperCase() === "COD";
		const isAccepted = order.order_status === "ACCEPTED";
		let msgText = "";
		if (isAccepted) msgText = `DETECTIVE ZONE — OFFICIAL DISPATCH NOTICE\n============================================================\nCASE DOSSIER ACCEPTED & IN PROCESSING\n\nDear ${order.customer_name},\n\nYour case dossier order #${order.order_number} has been officially accepted and approved by our Central Operations Bureau.\n\nORDER SUMMARY:\n- Dossier Reference: #${order.order_number}\n- Recipient Agent: ${order.customer_name}\n- Status: Accepted & In Forensics Vault Preparation\n- Scheduled Delivery Date: ${order.expected_delivery_date || "Within 3-5 business days"}\n- Delivery Destination: ${order.shipping_address}, ${order.city}\n\nVAULT PACKAGING:\nYour physical evidence dossier is being sealed with tamper-evident tape.\n\nDispatch Helpline: https://wa.me/916305729867\nOfficial Portal: https://detectiveszone.com\n============================================================\nDetective Zone Investigation Bureau © 2026. All Rights Reserved.`;
		else msgText = `DETECTIVE ZONE — OFFICIAL ORDER CONFIRMATION\n============================================================\nCOMMISSION CONFIRMED: INVESTIGATION DOSSIER\n\nDear ${order.customer_name},\n\nYour investigation dossier order #${order.order_number} has been registered in our archives.\n\nORDER SPECIFICATIONS:\n- Dossier Reference: #${order.order_number}\n- Payment Mode: ${isCod ? "Cash on Delivery (Pay upon delivery)" : "Online / UPI (Verified)"}\n- Total Amount: Rs. ${order.total_amount?.toLocaleString()}\n- Destination: ${order.shipping_address}, ${order.city}\n\n${isCod ? "VERIFICATION PROTOCOL: Our dispatch unit will contact you via WhatsApp/Phone within 24 hours to confirm your address before releasing this physical case file." : "PAYMENT STATUS: Payment verified. Evidence files are in priority vault sealing."}\n\nDispatch Helpline: https://wa.me/916305729867\nOfficial Portal: https://detectiveszone.com\n============================================================\nDetective Zone Investigation Bureau © 2026. All Rights Reserved.`;
		const targetUrl = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(msgText)}` : `https://wa.me/916305729867?text=${encodeURIComponent(msgText)}`;
		window.open(targetUrl, "_blank", "noopener,noreferrer");
		showToast(`✓ Official WhatsApp notice prepared for ${order.customer_name} (+${phone || "6305729867"})`);
	};
	const handleExportAllOrdersJson = async () => {
		try {
			setExportingJson(true);
			const data = await api.adminExportAllOrdersJson();
			const jsonStr = JSON.stringify(data, null, 2);
			const blob = new Blob([jsonStr], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
			link.href = url;
			link.download = `detective-zone-classified-orders-backup-${today}.json`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			showToast("✓ Confidential Orders JSON Backup Downloaded!");
		} catch (err) {
			alert(err.message || "Failed to export orders JSON backup");
		} finally {
			setExportingJson(false);
		}
	};
	const handleExportSingleOrderJson = async (order) => {
		try {
			const data = await api.adminExportSingleOrderJson(order.id);
			const jsonStr = JSON.stringify(data, null, 2);
			const blob = new Blob([jsonStr], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `dossier-${order.order_number}.json`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			showToast(`✓ Order #${order.order_number} JSON Dossier Downloaded!`);
		} catch (err) {
			alert(err.message || "Failed to export order JSON dossier");
		}
	};
	(0, import_react.useEffect)(() => {
		loadOrders();
		const interval = setInterval(loadOrders, 1e4);
		return () => clearInterval(interval);
	}, [
		statusFilter,
		search,
		sortBy
	]);
	const [testingEmail, setTestingEmail] = (0, import_react.useState)(false);
	const [emailDiag, setEmailDiag] = (0, import_react.useState)(null);
	const handleTestEmailSystem = async () => {
		try {
			setTestingEmail(true);
			const diag = await api.adminTestEmail();
			setEmailDiag(diag);
		} catch (err) {
			alert(err.message || "Failed to run email diagnostic test");
		} finally {
			setTestingEmail(false);
		}
	};
	const showToast = (msg) => {
		setToastMessage(msg);
		setTimeout(() => setToastMessage(null), 3500);
	};
	const loadOrders = async () => {
		try {
			const data = await api.adminListOrders({
				status: statusFilter,
				search: search || void 0,
				sort_by: sortBy
			});
			setOrders(data);
		} catch (err) {
			console.error("Error loading orders:", err);
		} finally {
			setLoading(false);
		}
	};
	const handleOpenAcceptModal = (order) => {
		setSelectedOrder(order);
		const d = /* @__PURE__ */ new Date();
		d.setDate(d.getDate() + 5);
		const formatted = d.toLocaleDateString("en-GB", {
			day: "numeric",
			month: "long",
			year: "numeric"
		});
		setDeliveryDateInput(order.expected_delivery_date || formatted);
		setAcceptNotes("");
		setShowAcceptModal(true);
	};
	const handleAcceptOrder = async (e) => {
		e.preventDefault();
		if (!deliveryDateInput.trim()) {
			alert("Please provide a valid expected delivery date.");
			return;
		}
		try {
			setAccepting(true);
			const updated = await api.adminAcceptOrder(selectedOrder.id, {
				expected_delivery_date: deliveryDateInput.trim(),
				notes: acceptNotes.trim() || void 0
			});
			setOrders(orders.map((o) => o.id === updated.id ? updated : o));
			setSelectedOrder(updated);
			setShowAcceptModal(false);
			showToast(`Order #${updated.order_number} accepted & confirmation email dispatched to ${updated.customer_email}`);
		} catch (err) {
			alert(err.message || "Failed to accept order");
		} finally {
			setAccepting(false);
		}
	};
	const handleUpdateStatus = async (newStatus) => {
		if (!selectedOrder) return;
		try {
			setUpdatingStatus(true);
			const updated = await api.adminUpdateOrderStatus(selectedOrder.id, { order_status: newStatus });
			setOrders(orders.map((o) => o.id === updated.id ? updated : o));
			setSelectedOrder(updated);
			showToast(`Order #${updated.order_number} status updated to ${newStatus}`);
		} catch (err) {
			alert(err.message || "Failed to update order status");
		} finally {
			setUpdatingStatus(false);
		}
	};
	const handleCancelOrder = async () => {
		if (!selectedOrder) return;
		if (!window.confirm(`Are you sure you want to cancel order #${selectedOrder.order_number}?`)) return;
		try {
			const updated = await api.adminCancelOrder(selectedOrder.id);
			setOrders(orders.map((o) => o.id === updated.id ? updated : o));
			setSelectedOrder(updated);
			showToast(`Order #${updated.order_number} cancelled.`);
		} catch (err) {
			alert(err.message || "Failed to cancel order");
		}
	};
	const handleRetryEmail = async (orderId) => {
		try {
			const updated = await api.adminRetryOrderEmail(orderId);
			setOrders(orders.map((o) => o.id === updated.id ? updated : o));
			if (selectedOrder?.id === orderId) setSelectedOrder(updated);
			showToast(`Confirmation email re-dispatched to ${updated.customer_email}`);
		} catch (err) {
			alert(err.message || "Failed to retry sending email");
		}
	};
	const handleDeleteOrder = async (orderId, orderNumber, e) => {
		if (e) e.stopPropagation();
		if (!window.confirm(`Are you sure you want to permanently delete order #${orderNumber}?`)) return;
		try {
			await api.adminDeleteOrder(orderId);
			setOrders(orders.filter((o) => o.id !== orderId));
			if (selectedOrder?.id === orderId) setSelectedOrder(null);
			showToast(`Order #${orderNumber} permanently deleted.`);
		} catch (err) {
			alert(err.message || "Failed to delete order");
		}
	};
	const getStatusBadge = (status) => {
		switch (status) {
			case "PAYMENT_CONFIRMED": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-amber-400",
				children: "● Payment Confirmed"
			});
			case "ACCEPTED": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-flex items-center gap-1.5 rounded-full bg-sky-500/15 border border-sky-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-sky-400",
				children: "✓ Accepted"
			});
			case "PREPARING": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-flex items-center gap-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-purple-400",
				children: "⚙ Preparing"
			});
			case "PACKED": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-blue-400",
				children: "📦 Packed"
			});
			case "SHIPPED": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-flex items-center gap-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-indigo-400",
				children: "🚚 Shipped"
			});
			case "OUT_FOR_DELIVERY": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-flex items-center gap-1.5 rounded-full bg-teal-500/15 border border-teal-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-teal-400",
				children: "⚡ Out for Delivery"
			});
			case "DELIVERED": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400",
				children: "✓ Delivered"
			});
			case "CANCELLED": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-flex items-center gap-1.5 rounded-full bg-red-500/15 border border-red-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-red-400",
				children: "✕ Cancelled"
			});
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-2.5 py-0.5 font-mono text-[10px] text-white/60",
				children: status
			});
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, {
		title: "Orders Management",
		subtitle: "E-commerce Fulfillment, Payment Confirmation & Delivery Scheduling",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleExportAllOrdersJson,
					disabled: exportingJson,
					className: "flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 font-display text-[11px] font-semibold uppercase tracking-wider text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: exportingJson ? "Exporting..." : "Download Orders JSON Backup" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleTestEmailSystem,
					disabled: testingEmail,
					className: "flex items-center gap-2 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3.5 py-2 font-display text-[11px] font-semibold uppercase tracking-wider text-sky-400 hover:bg-sky-500/20 transition-all cursor-pointer disabled:opacity-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: testingEmail ? "Testing..." : "Test SMTP" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: loadOrders,
					className: "flex items-center gap-2 rounded-lg border border-white/20 bg-white/[0.04] px-3.5 py-2 font-display text-[11px] font-semibold uppercase tracking-wider text-white hover:bg-white/[0.08] transition-all cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Refresh" })]
				})
			]
		}),
		children: [
			toastMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-500/40 bg-[#080808]/95 px-5 py-3 font-mono text-xs text-emerald-400 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-md animate-in fade-in",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: toastMessage })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none",
					children: [
						{
							id: "ALL",
							label: "All Orders"
						},
						{
							id: "PAYMENT_CONFIRMED",
							label: "Payment Confirmed"
						},
						{
							id: "ACCEPTED",
							label: "Accepted"
						},
						{
							id: "PREPARING",
							label: "Preparing"
						},
						{
							id: "PACKED",
							label: "Packed"
						},
						{
							id: "SHIPPED",
							label: "Shipped"
						},
						{
							id: "OUT_FOR_DELIVERY",
							label: "Out for Delivery"
						},
						{
							id: "DELIVERED",
							label: "Delivered"
						},
						{
							id: "CANCELLED",
							label: "Cancelled"
						}
					].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setStatusFilter(f.id),
						className: `rounded-lg px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${statusFilter === f.id ? "bg-blood text-white font-bold shadow-[0_0_15px_rgba(179,18,23,0.4)]" : "border border-white/10 bg-[#070707] text-white/50 hover:text-white hover:border-white/20"}`,
						children: f.label
					}, f.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-full sm:max-w-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							placeholder: "Search by Order #, Customer, Email, Txn ID...",
							className: "w-full rounded-lg border border-white/10 bg-[#070707] py-2.5 pl-10 pr-4 font-mono text-xs text-white placeholder-white/30 outline-none focus:border-blood"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-mono text-xs text-white/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sort:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: sortBy,
								onChange: (e) => setSortBy(e.target.value),
								className: "rounded-lg border border-white/10 bg-[#070707] px-3 py-1.5 text-white outline-none focus:border-blood cursor-pointer",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "newest",
										children: "Newest First"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "oldest",
										children: "Oldest First"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "highest",
										children: "Highest Amount"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "lowest",
										children: "Lowest Amount"
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-xs text-white/40",
							children: [orders.length, " orders"]
						})]
					})]
				})]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-20 text-center font-mono text-xs uppercase tracking-widest text-white/40",
				children: "Scanning Orders Database..."
			}) : orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-white/10 bg-[#070707] p-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "mx-auto h-12 w-12 text-white/20 mb-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-base uppercase text-white font-bold",
						children: "No Orders Found"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs text-white/40 mt-1",
						children: "Orders placed through the store checkout will appear here in real time."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-2xl border border-white/10 bg-[#080808]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left font-mono text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-white/10 bg-black/60 text-[11px] uppercase tracking-wider text-white/50",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "Order ID & Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "Customer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "Items & Amount"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "Payment"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "Status & Delivery"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4 text-right",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-white/[0.06]",
						children: orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-white/[0.02] transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-white tracking-wide",
										children: ["#", o.order_number]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-white/40 mt-0.5",
										children: new Date(o.created_at).toLocaleDateString("en-GB", {
											day: "numeric",
											month: "short",
											year: "numeric",
											hour: "2-digit",
											minute: "2-digit"
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-white",
											children: o.customer_name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-white/40 truncate max-w-[160px]",
											children: o.customer_email
										}),
										o.customer_phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[9px] text-white/30",
											children: o.customer_phone
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-display font-bold text-blood text-sm",
										children: ["₹", o.total_amount?.toLocaleString()]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] text-white/40 mt-0.5",
										children: [
											o.items?.length || 1,
											" item",
											o.items?.length !== 1 ? "s" : ""
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-white/80",
										children: o.payment_method || "UPI"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[9px] text-white/40 truncate max-w-[120px]",
										children: o.transaction_id || "TXN-VERIFIED"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [getStatusBadge(o.order_status), o.expected_delivery_date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] text-sky-400 flex items-center gap-1 mt-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3 w-3" }),
												" ",
												o.expected_delivery_date
											]
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-4 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-end gap-2",
										children: [
											o.order_status === "PAYMENT_CONFIRMED" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleOpenAcceptModal(o),
												className: "rounded-lg bg-sky-500/20 border border-sky-500/40 px-2.5 py-1.5 font-display text-[10px] font-bold uppercase tracking-wider text-sky-400 hover:bg-sky-500 hover:text-black transition-colors cursor-pointer",
												children: "Accept Order"
											}),
											o.order_status === "ACCEPTED" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2 py-1 font-mono text-[10px] font-bold text-emerald-400",
												children: "✓ Accepted"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: (e) => {
													e.stopPropagation();
													handleSendWhatsAppConfirmation(o);
												},
												title: "Send Official WhatsApp Confirmation",
												className: "rounded-lg border border-[#25D366]/40 bg-[#25D366]/10 p-1.5 text-[#25D366] hover:bg-[#25D366] hover:text-black transition-colors cursor-pointer",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-3.5 w-3.5" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: (e) => {
													e.stopPropagation();
													handleExportSingleOrderJson(o);
												},
												title: "Download Confidential JSON Dossier",
												className: "rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-1.5 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors cursor-pointer",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCode, { className: "h-3.5 w-3.5" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setSelectedOrder(o),
												className: "rounded-lg border border-white/15 bg-white/[0.04] px-2.5 py-1.5 font-display text-[10px] font-semibold uppercase tracking-wider text-white hover:bg-white/[0.1] transition-colors cursor-pointer",
												children: "View Details"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: (e) => handleDeleteOrder(o.id, o.order_number, e),
												title: "Delete order permanently",
												className: "rounded-lg border border-red-500/20 bg-red-500/10 p-1.5 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
											})
										]
									})
								})
							]
						}, o.id))
					})]
				})
			}),
			selectedOrder && !showAcceptModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#0a0a0a] p-6 shadow-2xl space-y-6 my-auto font-mono text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sticky top-0 z-10 -mx-6 -mt-6 mb-4 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a]/95 px-6 py-4 backdrop-blur-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-display text-lg font-bold uppercase tracking-wider text-white",
								children: ["Order #", selectedOrder.order_number]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[10px] text-white/50",
								children: ["Placed on ", new Date(selectedOrder.created_at).toLocaleString()]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedOrder(null),
								className: "rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
							})]
						}),
						selectedOrder.order_status === "ACCEPTED" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-emerald-500/20 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-display text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), " ✓ ORDER ACCEPTED"]
									}), selectedOrder.accepted_at && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-emerald-300/70",
										children: new Date(selectedOrder.accepted_at).toLocaleString()
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-white/50",
											children: "Accepted by:"
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-white font-semibold",
											children: selectedOrder.accepted_by || "Admin"
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-white/50",
											children: "Scheduled Delivery:"
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sky-400 font-bold",
											children: selectedOrder.expected_delivery_date || "N/A"
										})
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row sm:items-center justify-between border-t border-emerald-500/20 pt-2 text-[11px] gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 text-white/70",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Notification Sent To:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-white font-bold bg-white/10 px-2 py-0.5 rounded border border-white/15",
											children: selectedOrder.customer_email
										})]
									}), selectedOrder.email_status === "FAILED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-amber-400 font-bold",
											children: "⚠ Delivery Pending / Needs App Password"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleRetryEmail(selectedOrder.id),
											className: "rounded bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 text-[10px] font-bold text-amber-300 hover:bg-amber-500 hover:text-black transition-colors cursor-pointer",
											children: "Retry Email"
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-emerald-400 font-bold flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), " ✓ Confirmation email dispatched to customer"]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/60 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase text-white/50 block mb-1",
								children: "Current Order Status"
							}), getStatusBadge(selectedOrder.order_status)] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									selectedOrder.order_status === "PAYMENT_CONFIRMED" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleOpenAcceptModal(selectedOrder),
										className: "rounded-lg bg-sky-500 px-4 py-2 font-display text-[11px] font-bold uppercase tracking-wider text-black hover:bg-sky-400 transition-all cursor-pointer",
										children: "Accept Order & Schedule Delivery"
									}),
									selectedOrder.order_status !== "PAYMENT_CONFIRMED" && selectedOrder.order_status !== "CANCELLED" && selectedOrder.order_status !== "DELIVERED" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: selectedOrder.order_status,
										onChange: (e) => handleUpdateStatus(e.target.value),
										disabled: updatingStatus,
										className: "rounded-lg border border-white/20 bg-[#111] px-3 py-2 text-white outline-none focus:border-blood cursor-pointer",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "ACCEPTED",
												children: "Mark Accepted"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "PREPARING",
												children: "Mark Preparing"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "PACKED",
												children: "Mark Packed"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "SHIPPED",
												children: "Mark Shipped"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "OUT_FOR_DELIVERY",
												children: "Mark Out for Delivery"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "DELIVERED",
												children: "Mark Delivered"
											})
										]
									}),
									selectedOrder.order_status !== "CANCELLED" && selectedOrder.order_status !== "DELIVERED" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: handleCancelOrder,
										className: "rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer",
										children: "Cancel"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleSendWhatsAppConfirmation(selectedOrder),
										className: "rounded-lg border border-[#25D366]/50 bg-[#25D366]/15 px-3 py-2 text-[#25D366] hover:bg-[#25D366] hover:text-black transition-colors cursor-pointer flex items-center gap-1.5 font-bold",
										title: "Send official WhatsApp order confirmation to customer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Send WhatsApp" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => isEditingOrder ? setIsEditingOrder(false) : handleStartEdit(selectedOrder),
										className: "rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white hover:bg-white/20 transition-colors cursor-pointer flex items-center gap-1.5 font-bold",
										title: "Edit customer, delivery address, or courier details",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isEditingOrder ? "Close Editor" : "Edit Details" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleExportSingleOrderJson(selectedOrder),
										className: "rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-emerald-300 hover:bg-emerald-500 hover:text-black transition-colors cursor-pointer flex items-center gap-1.5 font-bold",
										title: "Download confidential JSON dossier file",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Download JSON Dossier" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleDeleteOrder(selectedOrder.id, selectedOrder.order_number),
										className: "rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Delete" })]
									})
								]
							})]
						}),
						isEditingOrder ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSaveEdit,
							className: "rounded-xl border border-blood/40 bg-blood/5 p-5 space-y-4 font-mono text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-blood/20 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-display text-xs font-bold uppercase tracking-wider text-blood flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Edit Order Dossier #", selectedOrder.order_number] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-white/50",
										children: "All edits sync immediately to database & JSON backup"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-white/60 text-[10px] uppercase font-bold mb-1",
											children: "Customer Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											required: true,
											value: editFormData.customer_name,
											onChange: (e) => setEditFormData({
												...editFormData,
												customer_name: e.target.value
											}),
											className: "w-full rounded-lg border border-white/20 bg-black/80 p-2 text-white outline-none focus:border-blood"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-white/60 text-[10px] uppercase font-bold mb-1",
											children: "Email Address"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "email",
											required: true,
											value: editFormData.customer_email,
											onChange: (e) => setEditFormData({
												...editFormData,
												customer_email: e.target.value
											}),
											className: "w-full rounded-lg border border-white/20 bg-black/80 p-2 text-white outline-none focus:border-blood"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-white/60 text-[10px] uppercase font-bold mb-1",
											children: "Phone Number (WhatsApp)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: editFormData.customer_phone,
											onChange: (e) => setEditFormData({
												...editFormData,
												customer_phone: e.target.value
											}),
											placeholder: "e.g. 9876543210",
											className: "w-full rounded-lg border border-white/20 bg-black/80 p-2 text-white outline-none focus:border-blood"
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-white/60 text-[10px] uppercase font-bold mb-1",
									children: "Shipping Address"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									value: editFormData.shipping_address,
									onChange: (e) => setEditFormData({
										...editFormData,
										shipping_address: e.target.value
									}),
									className: "w-full rounded-lg border border-white/20 bg-black/80 p-2 text-white outline-none focus:border-blood"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-white/60 text-[10px] uppercase font-bold mb-1",
											children: "City"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: editFormData.city,
											onChange: (e) => setEditFormData({
												...editFormData,
												city: e.target.value
											}),
											className: "w-full rounded-lg border border-white/20 bg-black/80 p-2 text-white outline-none focus:border-blood"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-white/60 text-[10px] uppercase font-bold mb-1",
											children: "State"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: editFormData.state,
											onChange: (e) => setEditFormData({
												...editFormData,
												state: e.target.value
											}),
											className: "w-full rounded-lg border border-white/20 bg-black/80 p-2 text-white outline-none focus:border-blood"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-white/60 text-[10px] uppercase font-bold mb-1",
											children: "Postal Code"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: editFormData.postal_code,
											onChange: (e) => setEditFormData({
												...editFormData,
												postal_code: e.target.value
											}),
											className: "w-full rounded-lg border border-white/20 bg-black/80 p-2 text-white outline-none focus:border-blood"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-white/60 text-[10px] uppercase font-bold mb-1",
											children: "Country"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: editFormData.country,
											onChange: (e) => setEditFormData({
												...editFormData,
												country: e.target.value
											}),
											className: "w-full rounded-lg border border-white/20 bg-black/80 p-2 text-white outline-none focus:border-blood"
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-white/10 pt-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-white/60 text-[10px] uppercase font-bold mb-1",
											children: "Expected Delivery Date"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: editFormData.expected_delivery_date,
											onChange: (e) => setEditFormData({
												...editFormData,
												expected_delivery_date: e.target.value
											}),
											placeholder: "e.g. 24 August 2026",
											className: "w-full rounded-lg border border-white/20 bg-black/80 p-2 text-white outline-none focus:border-blood"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-white/60 text-[10px] uppercase font-bold mb-1",
											children: "Courier Partner"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: editFormData.courier_name,
											onChange: (e) => setEditFormData({
												...editFormData,
												courier_name: e.target.value
											}),
											placeholder: "e.g. BlueDart Express",
											className: "w-full rounded-lg border border-white/20 bg-black/80 p-2 text-white outline-none focus:border-blood"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-white/60 text-[10px] uppercase font-bold mb-1",
											children: "Tracking Number"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: editFormData.tracking_number,
											onChange: (e) => setEditFormData({
												...editFormData,
												tracking_number: e.target.value
											}),
											placeholder: "e.g. BD-89218291",
											className: "w-full rounded-lg border border-white/20 bg-black/80 p-2 text-white outline-none focus:border-blood"
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-end gap-2.5 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setIsEditingOrder(false),
										className: "px-4 py-2 uppercase text-white/60 hover:text-white cursor-pointer",
										children: "Cancel"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "submit",
										disabled: savingEdit,
										className: "rounded-lg bg-blood px-6 py-2 font-display text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(200,29,36,0.35)]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: savingEdit ? "Saving..." : "Save Dossier Changes" })]
									})]
								})
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-white/10 bg-black/40 p-4 space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] uppercase tracking-wider text-white/50 block border-b border-white/10 pb-1",
										children: "Customer Profile"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-white/50",
											children: "Name:"
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-white font-bold",
											children: selectedOrder.customer_name
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-white/50",
											children: "Email:"
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-white",
											children: selectedOrder.customer_email
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-white/50",
											children: "Phone:"
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-white",
											children: selectedOrder.customer_phone || "N/A"
										})
									] })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-white/10 bg-black/40 p-4 space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] uppercase tracking-wider text-white/50 block border-b border-white/10 pb-1",
										children: "Delivery Destination"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-white",
										children: selectedOrder.shipping_address
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-white/70",
										children: [
											selectedOrder.city,
											", ",
											selectedOrder.state,
											" - ",
											selectedOrder.postal_code
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-white/50",
										children: selectedOrder.country
									}),
									selectedOrder.expected_delivery_date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sky-400 font-bold pt-1 border-t border-white/10",
										children: ["Scheduled: ", selectedOrder.expected_delivery_date]
									}),
									selectedOrder.tracking_number && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-emerald-400 font-mono text-[11px] pt-1",
										children: [
											"Tracking: ",
											selectedOrder.tracking_number,
											" (",
											selectedOrder.courier_name || "BlueDart",
											")"
										]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-white/10 bg-black/40 p-4 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-white/10 pb-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] uppercase tracking-wider text-white/50 font-bold flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PhonePe Payment Verification Details" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-[9px] uppercase px-2 py-0.5 rounded-full font-bold font-mono ${selectedOrder.payment_status === "PAID" || selectedOrder.payment_status === "SUCCESS" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : selectedOrder.payment_status === "FAILED" ? "bg-red-500/10 text-red-400 border border-red-500/30" : "bg-amber-500/10 text-amber-400 border border-amber-500/30"}`,
									children: selectedOrder.payment_status
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-white/40 block text-[10px] uppercase",
										children: "Gateway Provider"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-white font-bold",
										children: "PhonePe PG"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-white/40 block text-[10px] uppercase",
										children: "Payment Method"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-white font-bold",
										children: selectedOrder.payment_method || "UPI"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-white/40 block text-[10px] uppercase",
										children: "Paid Amount"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-blood font-bold font-display text-sm",
										children: ["₹", selectedOrder.total_amount?.toLocaleString()]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-white/40 block text-[10px] uppercase",
										children: "Verification Time"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-white/80 font-mono text-[10px]",
										children: selectedOrder.paid_at ? new Date(selectedOrder.paid_at).toLocaleString() : "Awaiting Settlement"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-white/40 block text-[10px] uppercase",
											children: "Merchant Transaction ID"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-white font-mono text-[11px] truncate block select-all bg-black/60 p-1 rounded border border-white/5",
											children: selectedOrder.transaction_id || "N/A"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-white/40 block text-[10px] uppercase",
											children: "Provider Reference / UTR"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-white font-mono text-[11px] truncate block select-all bg-black/60 p-1 rounded border border-white/5",
											children: selectedOrder.gateway_reference || "PPE_GATEWAY_NODE"
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-white/10 bg-black/40 p-4 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-wider text-white/50 block border-b border-white/10 pb-1",
									children: "Purchased Evidence Kits & Items"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "divide-y divide-white/[0.06]",
									children: selectedOrder.items?.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "py-2.5 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-white",
											children: item.item_title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] text-white/40",
											children: [
												"Qty: ",
												item.quantity,
												" × ₹",
												item.unit_price?.toLocaleString()
											]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-display font-bold text-white",
											children: ["₹", item.total_price?.toLocaleString()]
										})]
									}, item.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2 border-t border-white/10 flex justify-between font-bold text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-white/70",
										children: "Total Charged:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-blood font-display text-base",
										children: ["₹", selectedOrder.total_amount?.toLocaleString()]
									})]
								})
							]
						}),
						selectedOrder.events && selectedOrder.events.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-white/10 bg-black/40 p-4 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-wider text-white/50 block border-b border-white/10 pb-1",
								children: "Order History & Audit Timeline"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: selectedOrder.events.map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2.5 text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-blood",
										children: "●"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-white",
											children: ev.message
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[9px] text-white/40",
											children: [
												new Date(ev.created_at).toLocaleString(),
												" · ",
												ev.performed_by || "System"
											]
										})]
									})]
								}, ev.id))
							})]
						})
					]
				})
			}),
			showAcceptModal && selectedOrder && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-lg rounded-2xl border border-sky-500/30 bg-[#0a0a0a] p-6 shadow-2xl space-y-5 my-auto font-mono text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-white/10 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display text-lg font-bold uppercase tracking-wider text-sky-400",
							children: ["Accept Order #", selectedOrder.order_number]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-white/50",
							children: "Confirm order acceptance and specify the expected delivery date for the customer."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowAcceptModal(false),
							className: "rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleAcceptOrder,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-white/70 uppercase text-[11px] mb-1.5 font-bold",
									children: "Expected Delivery Date *"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									value: deliveryDateInput,
									onChange: (e) => setDeliveryDateInput(e.target.value),
									placeholder: "e.g. 24 August 2026",
									className: "w-full rounded-lg border border-white/15 bg-black/80 p-2.5 text-white outline-none focus:border-sky-400"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-2.5 text-[11px] text-emerald-300 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-bold flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), " Simultaneous Notification Protocol"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-white/70",
										children: [
											"Accepting this order immediately dispatches an official confirmation ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Email" }),
											" and a ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "WhatsApp" }),
											" notification to the customer with this scheduled delivery date."
										]
									})]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-white/70 uppercase text-[11px] mb-1.5",
								children: "Internal Administrative Notes (Optional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 2,
								value: acceptNotes,
								onChange: (e) => setAcceptNotes(e.target.value),
								placeholder: "Special instructions, carrier batch ID, or warehouse shelf location...",
								className: "w-full rounded-lg border border-white/15 bg-black/80 p-2.5 text-white outline-none focus:border-sky-400 resize-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-3 pt-2 border-t border-white/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowAcceptModal(false),
									className: "px-4 py-2 uppercase text-white/60 hover:text-white cursor-pointer",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									disabled: accepting,
									className: "rounded-lg bg-sky-500 px-6 py-2.5 font-display text-xs uppercase tracking-wider text-black font-bold hover:bg-sky-400 transition-all shadow-[0_0_20px_rgba(14,165,233,0.4)] cursor-pointer disabled:opacity-50 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: accepting ? "Accepting..." : "Accept Order & Notify (Email + WhatsApp)" })]
								})]
							})
						]
					})]
				})
			}),
			emailDiag && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-lg rounded-2xl border border-white/15 bg-[#0a0a0a] p-6 shadow-2xl space-y-4 my-auto font-mono text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-white/10 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-display text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-sky-400" }), "SMTP Delivery Diagnostics"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setEmailDiag(null),
								className: "rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `rounded-xl border p-4 ${emailDiag.status === "SUCCESS" || emailDiag.status === "CONNECTED" ? "border-emerald-500/40 bg-emerald-950/20" : "border-amber-500/40 bg-amber-950/20"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold uppercase tracking-wider",
									children: "Connection Status:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `px-2.5 py-0.5 rounded text-[10px] font-bold ${emailDiag.status === "SUCCESS" || emailDiag.status === "CONNECTED" ? "bg-emerald-500 text-black" : "bg-amber-500 text-black"}`,
									children: emailDiag.status === "SUCCESS" || emailDiag.status === "CONNECTED" ? "CONNECTED & VERIFIED" : emailDiag.status
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-white/90 font-medium",
								children: emailDiag.status === "SUCCESS" || emailDiag.status === "CONNECTED" ? emailDiag.message || "✓ Gmail SMTP provider accepted connection & test verification email delivered successfully." : `⚠ ${emailDiag.error || emailDiag.message || "Connection failed."}`
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-white/10 bg-black/50 p-4 space-y-2 text-[11px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-white/50",
										children: "Host:"
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-white font-bold",
										children: [
											emailDiag.smtp_host,
											":",
											emailDiag.smtp_port
										]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-white/50",
										children: "Sender (From):"
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-white",
										children: emailDiag.smtp_from_email
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-white/50",
										children: "Username (User):"
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-white",
										children: emailDiag.smtp_user
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-white/50",
										children: "Password Set:"
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: emailDiag.smtp_password_configured ? "text-emerald-400 font-bold" : "text-red-400 font-bold",
										children: emailDiag.smtp_password_configured ? "Configured in .env" : "NOT CONFIGURED"
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-white/50",
										children: "TLS / SSL:"
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-white",
										children: [
											"TLS: ",
											String(emailDiag.smtp_use_tls),
											", SSL: ",
											String(emailDiag.smtp_use_ssl)
										]
									})
								] })
							]
						}),
						emailDiag.instructions && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-sky-500/20 bg-sky-500/10 p-3 text-[11px] text-sky-200",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Next Step:" }),
								" ",
								emailDiag.instructions
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end pt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setEmailDiag(null),
								className: "rounded-lg bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition-colors cursor-pointer",
								children: "Close"
							})
						})
					]
				})
			})
		]
	});
}
//#endregion
export { AdminOrders as component };
