import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { Lt as Check, Tt as CloudUpload, V as Music, gt as FileText, ht as Film, st as Image, u as Trash2, w as Search, wt as Copy } from "../_libs/lucide-react.mjs";
import { c as api } from "./router-CBHk_fdB.mjs";
import { t as AdminLayout } from "./AdminLayout-BazMIgX5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/media--s9VdU-2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminMedia() {
	const [mediaList, setMediaList] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [folderFilter, setFolderFilter] = (0, import_react.useState)("all");
	const [search, setSearch] = (0, import_react.useState)("");
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [copiedId, setCopiedId] = (0, import_react.useState)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		loadMedia();
	}, [folderFilter]);
	const loadMedia = async () => {
		try {
			setLoading(true);
			const data = await api.getMediaList({ folder: folderFilter === "all" ? void 0 : folderFilter });
			setMediaList(data);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	const handleFileUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const formData = new FormData();
		formData.append("file", file);
		formData.append("folder", folderFilter === "all" ? "general" : folderFilter);
		try {
			setUploading(true);
			const uploaded = await api.uploadMedia(file, folderFilter === "all" ? "general" : folderFilter);
			setMediaList([uploaded, ...mediaList]);
		} catch (err) {
			alert(err.message || "Failed to upload file");
		} finally {
			setUploading(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};
	const handleCopyUrl = (item) => {
		const fullUrl = item.file_url.startsWith("http") ? item.file_url : `http://13.61.187.145${item.file_url}`;
		navigator.clipboard.writeText(fullUrl);
		setCopiedId(item.id);
		setTimeout(() => setCopiedId(null), 2e3);
	};
	const handleDelete = async (id, name) => {
		if (!window.confirm(`Delete ${name}?`)) return;
		try {
			await api.deleteMedia(id);
			setMediaList(mediaList.filter((m) => m.id !== id));
		} catch (err) {
			alert(err.message || "Failed to delete file");
		}
	};
	const filtered = mediaList.filter((m) => m.original_name.toLowerCase().includes(search.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, {
		title: "Media Library & Storage",
		subtitle: "Centralized Asset Management for Evidence & Store",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "file",
			ref: fileInputRef,
			onChange: handleFileUpload,
			className: "hidden",
			accept: "image/*,video/*,audio/*,.pdf,.doc,.docx"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => fileInputRef.current?.click(),
			disabled: uploading,
			className: "flex items-center gap-2 rounded-lg bg-blood px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-blood/90 transition-all shadow-[0_0_18px_rgba(179,18,23,0.35)] cursor-pointer disabled:opacity-50",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: uploading ? "Uploading Asset..." : "Upload File" })]
		})] }),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2 font-mono text-xs uppercase tracking-wider overflow-x-auto pb-1",
				children: [
					"all",
					"cases",
					"evidence",
					"store",
					"kits",
					"general"
				].map((folder) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setFolderFilter(folder),
					className: `rounded-lg px-3.5 py-1.5 transition-colors cursor-pointer ${folderFilter === folder ? "bg-blood text-white font-bold" : "bg-white/[0.03] text-white/50 hover:text-white"}`,
					children: folder
				}, folder))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative max-w-xs w-full",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					placeholder: "Search filenames...",
					className: "w-full rounded-lg border border-white/10 bg-[#070707] py-1.5 pl-9 pr-3 font-mono text-[11px] text-white placeholder-white/30 outline-none focus:border-blood"
				})]
			})]
		}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "py-20 text-center font-mono text-xs uppercase tracking-widest text-white/40",
			children: "Loading Media Files..."
		}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-white/[0.08] bg-[#070707] p-12 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "mx-auto h-12 w-12 text-white/20 mb-3" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg uppercase text-white",
					children: "No Media Files"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-mono text-xs text-white/40",
					children: "Upload photos, videos, wiretaps, or documents above."
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4",
			children: filtered.map((item) => {
				const isImg = item.file_type === "image";
				const fullUrl = item.file_url.startsWith("http") ? item.file_url : `http://13.61.187.145${item.file_url}`;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "group relative flex flex-col rounded-xl border border-white/[0.08] bg-[#070707] overflow-hidden transition-all hover:border-blood/40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-32 w-full bg-black/60 flex items-center justify-center overflow-hidden",
						children: [isImg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: fullUrl,
							alt: item.original_name,
							className: "h-full w-full object-cover"
						}) : item.file_type === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, { className: "h-10 w-10 text-white/30" }) : item.file_type === "audio" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { className: "h-10 w-10 text-white/30" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-10 w-10 text-white/30" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleCopyUrl(item),
								title: "Copy URL",
								className: "rounded-full bg-white/20 p-2 text-white hover:bg-blood transition-colors",
								children: copiedId === item.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleDelete(item.id, item.original_name),
								title: "Delete",
								className: "rounded-full bg-white/20 p-2 text-white hover:bg-blood transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-2.5 font-mono text-[10px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate font-bold text-white/90",
							title: item.original_name,
							children: item.original_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-white/40 mt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "uppercase",
								children: item.folder
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [(item.file_size / 1024).toFixed(0), " KB"] })]
						})]
					})]
				}, item.id);
			})
		})]
	});
}
//#endregion
export { AdminMedia as component };
