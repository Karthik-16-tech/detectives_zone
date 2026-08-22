import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { bt as ExternalLink, et as LoaderCircle, i as X, s as Upload, tt as Link } from "../_libs/lucide-react.mjs";
import { c as api } from "./router-CBHk_fdB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ImageUploadField-DjD9Z7O9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ImageUploadField({ label, value, onChange, folder = "general", placeholder = "Paste S3 URL (https://bucket.s3.amazonaws.com/...) or upload file", helperText, className = "" }) {
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [uploadError, setUploadError] = (0, import_react.useState)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	const handleFileChange = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		setUploadError(null);
		try {
			const res = await api.uploadMedia(file, folder);
			if (res && res.file_url) onChange(res.file_url);
		} catch (err) {
			setUploadError(err.message || "Failed to upload file");
		} finally {
			setUploading(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `space-y-1.5 ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-mono uppercase text-white/70",
					children: label
				}), value && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: value,
					target: "_blank",
					rel: "noreferrer",
					className: "flex items-center gap-1 font-mono text-[10px] text-blood hover:underline",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Preview in New Tab" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-2.5 w-2.5" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: value || "",
								onChange: (e) => onChange(e.target.value),
								placeholder,
								className: "w-full rounded-lg border border-white/10 bg-black/60 py-2.5 pl-9 pr-8 font-mono text-xs text-white outline-none transition-colors focus:border-blood"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { className: "absolute left-3 top-3 h-3.5 w-3.5 text-white/40" }),
							value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => onChange(""),
								className: "absolute right-2.5 top-2.5 rounded text-white/40 hover:text-white",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileInputRef,
						type: "file",
						accept: "image/*,video/mp4",
						onChange: handleFileChange,
						className: "hidden"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: uploading,
						onClick: () => fileInputRef.current?.click(),
						className: "flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.05] px-3.5 py-2.5 font-mono text-xs text-white hover:border-blood hover:bg-blood/20 disabled:opacity-50 transition-all cursor-pointer shrink-0",
						children: uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Uploading..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Upload File" })] })
					})
				]
			}),
			uploadError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] text-red-400",
				children: uploadError
			}),
			value && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-center gap-3 rounded-lg border border-white/[0.08] bg-black/40 p-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-12 w-12 shrink-0 overflow-hidden rounded border border-white/10 bg-black/80 flex items-center justify-center",
					children: value.endsWith(".mp4") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[9px] uppercase text-blood font-bold",
						children: "VIDEO"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: value,
						alt: "Preview",
						className: "h-full w-full object-cover",
						onError: (e) => {
							e.target.style.display = "none";
						}
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1 font-mono text-[10px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-white/80",
						children: value
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-white/40",
						children: value.startsWith("http") ? "Remote S3 / CDN Asset" : "Local File Asset"
					})]
				})]
			}),
			helperText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] text-white/40",
				children: helperText
			})
		]
	});
}
//#endregion
export { ImageUploadField as t };
