import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { X as Mail, u as Trash2 } from "../_libs/lucide-react.mjs";
import { c as api } from "./router-CBHk_fdB.mjs";
import { t as AdminLayout } from "./AdminLayout-BazMIgX5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inbox-CXti5Sa0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminInbox() {
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [selectedMsg, setSelectedMsg] = (0, import_react.useState)(null);
	const [replyNotes, setReplyNotes] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		loadInbox();
	}, [statusFilter]);
	const loadInbox = async () => {
		try {
			setLoading(true);
			const data = await api.getInboxAdmin(statusFilter === "all" ? void 0 : statusFilter);
			setMessages(data);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	const handleOpenMessage = async (msg) => {
		setSelectedMsg(msg);
		setReplyNotes(msg.reply_notes || "");
		if (msg.status === "unread") try {
			await api.updateMessageStatus(msg.id, { status: "read" });
			setMessages(messages.map((m) => m.id === msg.id ? {
				...m,
				status: "read"
			} : m));
		} catch (err) {
			console.error(err);
		}
	};
	const handleSaveNotes = async () => {
		if (!selectedMsg) return;
		try {
			const updated = await api.updateMessageStatus(selectedMsg.id, {
				reply_notes: replyNotes,
				status: "replied"
			});
			setMessages(messages.map((m) => m.id === selectedMsg.id ? updated : m));
			setSelectedMsg(updated);
			alert("Inquiry notes saved!");
		} catch (err) {
			alert(err.message || "Failed to save notes");
		}
	};
	const handleDelete = async (id) => {
		if (!window.confirm("Delete this inquiry message?")) return;
		try {
			await api.deleteMessage(id);
			setMessages(messages.filter((m) => m.id !== id));
			if (selectedMsg?.id === id) setSelectedMsg(null);
		} catch (err) {
			alert(err.message || "Failed to delete message");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, {
		title: "Classified Inquiries Inbox",
		subtitle: "Public Inquiries & Investigation Requests",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-wider",
			children: [
				"all",
				"unread",
				"read",
				"replied"
			].map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setStatusFilter(status),
				className: `rounded-lg px-3.5 py-1.5 transition-colors cursor-pointer ${statusFilter === status ? "bg-blood text-white font-bold" : "bg-white/[0.03] text-white/50 hover:text-white"}`,
				children: status
			}, status))
		}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "py-20 text-center font-mono text-xs uppercase tracking-widest text-white/40",
			children: "Decrypting Transmission Inbox..."
		}) : messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-white/[0.08] bg-[#070707] p-12 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "mx-auto h-12 w-12 text-white/20 mb-3" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg uppercase text-white",
					children: "No Inquiries Found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-mono text-xs text-white/40",
					children: "New public submissions will appear here."
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-12 gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-5 rounded-xl border border-white/[0.08] bg-[#070707] overflow-hidden divide-y divide-white/[0.05]",
				children: messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: () => handleOpenMessage(m),
					className: `p-4 cursor-pointer transition-colors ${selectedMsg?.id === m.id ? "bg-white/[0.06]" : m.status === "unread" ? "bg-blood/10 hover:bg-blood/15" : "hover:bg-white/[0.02]"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-sans font-bold text-sm text-white",
								children: m.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[9px] text-white/40",
								children: new Date(m.created_at).toLocaleDateString()
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-xs text-blood font-semibold mt-0.5 truncate",
							children: m.subject
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-sans text-xs text-white/50 mt-1 line-clamp-2",
							children: m.message
						})
					]
				}, m.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-7 rounded-xl border border-white/[0.08] bg-[#070707] p-6",
				children: selectedMsg ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pb-4 border-b border-white/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-lg font-bold uppercase text-white",
								children: selectedMsg.subject
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-mono text-xs text-white/50 mt-1",
								children: [
									"From: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-white font-semibold",
										children: selectedMsg.name
									}),
									" (",
									selectedMsg.email,
									")"
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleDelete(selectedMsg.id),
								className: "p-2 text-white/40 hover:text-blood transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-white/[0.06] bg-black/40 p-4 font-sans text-sm text-white/90 whitespace-pre-line leading-relaxed",
							children: selectedMsg.message
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 font-mono text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block uppercase text-white/50",
									children: "Internal Case Notes / Reply Log"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 4,
									value: replyNotes,
									onChange: (e) => setReplyNotes(e.target.value),
									placeholder: "Log agent response or investigation actions taken...",
									className: "w-full rounded-lg border border-white/10 bg-black/60 p-3 text-white font-sans text-xs outline-none focus:border-blood"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleSaveNotes,
									className: "rounded-lg bg-blood px-4 py-2 font-display text-xs font-semibold uppercase tracking-wider text-white hover:bg-blood/90",
									children: "Save Notes & Mark Replied"
								})
							]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-20 text-center font-mono text-xs text-white/40",
					children: "Select an inquiry from the left to view full transmission."
				})
			})]
		})]
	});
}
//#endregion
export { AdminInbox as component };
