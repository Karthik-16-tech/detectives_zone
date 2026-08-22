import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, v as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ft as ChevronLeft, G as MessageCircle, Lt as Check, Mt as CircleAlert, Ut as ArrowRight } from "../_libs/lucide-react.mjs";
import { c as api } from "./router-CBHk_fdB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders._orderId-BPCzGioL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OrderDetailsPage() {
	const { orderId } = useParams({ from: "/orders/$orderId" });
	const [order, setOrder] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		loadOrder();
	}, [orderId]);
	const loadOrder = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await api.lookupOrder(orderId);
			setOrder(data);
		} catch (err) {
			setError("Order not found. Please check your order reference number.");
		} finally {
			setLoading(false);
		}
	};
	const steps = [
		{
			key: "PAYMENT_CONFIRMED",
			label: "Payment Confirmed"
		},
		{
			key: "ACCEPTED",
			label: "Order Accepted"
		},
		{
			key: "PREPARING",
			label: "Preparing Dossier"
		},
		{
			key: "PACKED",
			label: "Packed in Sealed Locker"
		},
		{
			key: "SHIPPED",
			label: "Dispatched & In Transit"
		},
		{
			key: "OUT_FOR_DELIVERY",
			label: "Out for Delivery"
		},
		{
			key: "DELIVERED",
			label: "Delivered to Agent"
		}
	];
	const getStepIndex = (status) => {
		return {
			PENDING_PAYMENT: 0,
			PAYMENT_CONFIRMED: 0,
			ACCEPTED: 1,
			PREPARING: 2,
			PACKED: 3,
			SHIPPED: 4,
			OUT_FOR_DELIVERY: 5,
			DELIVERED: 6,
			CANCELLED: -1
		}[status] ?? 0;
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background pt-36 pb-20 px-4 text-center font-mono text-xs uppercase tracking-widest text-white/50",
		children: "Locating Order Records..."
	});
	if (error || !order) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background pt-28 pb-20 px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg rounded-2xl border border-white/10 bg-[#080808] p-8 text-center space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mx-auto h-12 w-12 text-red-400" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl uppercase font-bold text-white",
					children: "Order Not Found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs text-white/50",
					children: error || "Could not retrieve order details."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/store",
						className: "inline-flex items-center gap-2 rounded-xl bg-blood px-6 py-2.5 font-display text-xs uppercase tracking-wider text-white hover:bg-blood/90 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Go to Store" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
					})
				})
			]
		})
	});
	const activeIndex = getStepIndex(order.order_status);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background pt-24 pb-20 px-4 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/store",
						className: "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" }), " Back to Store"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/70",
						children: ["Order Status: ", order.order_status]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-white/10 bg-[#080808] p-6 sm:p-8 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[10px] uppercase tracking-[0.25em] text-blood font-bold",
								children: "Official Case Fulfillment"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white mt-1",
								children: ["Order #", order.order_number]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-xs text-white/50 mt-1",
								children: ["Placed on ", new Date(order.created_at).toLocaleDateString("en-GB", {
									day: "numeric",
									month: "long",
									year: "numeric"
								})]
							})
						] }), order.expected_delivery_date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 text-left sm:text-right font-mono",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-wider text-sky-400 block font-bold",
								children: "Expected Delivery"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-white font-display text-base font-bold",
								children: order.expected_delivery_date
							})]
						})]
					}), order.order_status !== "CANCELLED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xs uppercase font-bold tracking-wider text-white/70 mb-6",
							children: "Fulfillment Timeline"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative flex flex-col md:flex-row justify-between gap-4",
							children: steps.map((step, idx) => {
								const isDone = idx <= activeIndex;
								const isCurrent = idx === activeIndex;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex md:flex-col items-center gap-3 md:text-center flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `h-8 w-8 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-all ${isCurrent ? "bg-blood text-white ring-4 ring-blood/20 shadow-[0_0_15px_rgba(179,18,23,0.6)]" : isDone ? "bg-emerald-500 text-black font-bold" : "bg-white/10 text-white/40 border border-white/10"}`,
										children: isDone && !isCurrent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) : idx + 1
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `font-display text-[11px] uppercase tracking-wider block font-bold ${isCurrent ? "text-blood" : isDone ? "text-white" : "text-white/30"}`,
										children: step.label
									}) })]
								}, step.key);
							})
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 rounded-xl border border-red-500/30 bg-red-500/10 font-mono text-xs text-red-400",
						children: "This order has been cancelled and refunded."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-[#25D366]/40 bg-gradient-to-r from-[#07180e] via-[#0a2013] to-[#07180e] p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-[0_0_30px_rgba(37,211,102,0.12)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-12 w-12 rounded-full bg-[#25D366] text-black flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(37,211,102,0.4)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-6 w-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-base sm:text-lg font-bold uppercase tracking-wider text-white",
							children: "Receive Order Updates on WhatsApp"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs text-white/60 mt-0.5",
							children: "Get real-time tracking alerts, BlueDart shipment updates, and dispatch confirmation directly on your phone."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `https://wa.me/916305729867?text=${encodeURIComponent(`DETECTIVE ZONE — ORDER CONFIRMATION\nOrder #${order.order_number}\nAmount: Rs. ${order.total_amount?.toLocaleString()}\nPayment Method: ${order.payment_method}\n\nPlease share dispatch updates on my order.`)}`,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-display text-xs font-bold uppercase tracking-wider text-black hover:bg-[#20bd5a] transition-all shrink-0 cursor-pointer shadow-[0_4px_16px_rgba(37,211,102,0.3)] hover:scale-105",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Confirm on WhatsApp" })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-12 gap-8 items-start font-mono text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-8 rounded-2xl border border-white/10 bg-[#080808] p-6 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-display text-sm uppercase font-bold tracking-wider text-white pb-3 border-b border-white/10",
								children: [
									"Purchased Evidence Items (",
									order.items?.length || 0,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "divide-y divide-white/[0.06]",
								children: order.items?.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "py-3 flex items-center justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [item.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: item.image_url,
											alt: item.item_title,
											className: "h-12 w-12 rounded-lg object-cover border border-white/10 bg-black shrink-0"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-white block",
											children: item.item_title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-white/40",
											children: [
												"Qty: ",
												item.quantity,
												" × ₹",
												item.unit_price?.toLocaleString()
											]
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-display font-bold text-white",
										children: ["₹", item.total_price?.toLocaleString()]
									})]
								}, item.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-4 border-t border-white/10 space-y-2 text-white/60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-white",
											children: ["₹", order.subtotal?.toLocaleString()]
										})]
									}),
									order.discount_amount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-emerald-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Discount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["-₹", order.discount_amount?.toLocaleString()] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shipping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-white",
											children: order.shipping_fee === 0 ? "FREE" : `₹${order.shipping_fee}`
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between pt-2 border-t border-white/10 font-bold text-sm text-white",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Amount Paid" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-blood font-display text-base",
											children: ["₹", order.total_amount?.toLocaleString()]
										})]
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-4 rounded-2xl border border-white/10 bg-[#080808] p-6 space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-wider text-white/50 block mb-1",
								children: "Recipient & Address"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold text-white",
								children: order.customer_name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-white/70",
								children: order.shipping_address
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-white/70",
								children: [
									order.city,
									", ",
									order.state,
									" - ",
									order.postal_code
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-white/40",
								children: order.country
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-4 border-t border-white/10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-wider text-white/50 block mb-1",
									children: "Payment Information"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-white",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-white/50",
											children: "Method:"
										}),
										" ",
										order.payment_method
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-white",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-white/50",
											children: "Status:"
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-emerald-400 font-bold",
											children: "Confirmed"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-white/40 text-[10px] truncate mt-1",
									children: ["Txn: ", order.transaction_id || "VERIFIED"]
								})
							]
						})]
					})]
				})
			]
		})
	});
}
//#endregion
export { OrderDetailsPage as component };
