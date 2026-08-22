import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { Mt as CircleAlert, P as Plus, i as X, p as SquarePen, u as Trash2, w as Search, y as ShoppingBag } from "../_libs/lucide-react.mjs";
import { c as api } from "./router-CBHk_fdB.mjs";
import { t as AdminLayout } from "./AdminLayout-BazMIgX5.mjs";
import { t as ImageUploadField } from "./ImageUploadField-DjD9Z7O9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-CajQPhT1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminStore() {
	const [products, setProducts] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [editingProduct, setEditingProduct] = (0, import_react.useState)(null);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)({
		name: "",
		slug: "",
		price: 39,
		sale_price: "",
		sku: "",
		category: "Physical Case Kits",
		stock_quantity: 20,
		cover_image: "",
		short_description: "",
		full_description: "",
		availability_status: "available"
	});
	(0, import_react.useEffect)(() => {
		loadProducts();
	}, []);
	const loadProducts = async () => {
		try {
			setLoading(true);
			const data = await api.getAllProductsAdmin();
			setProducts(data);
		} catch (err) {
			setError(err.message || "Failed to load store products");
		} finally {
			setLoading(false);
		}
	};
	const handleOpenCreate = () => {
		setEditingProduct(null);
		setFormData({
			name: "",
			slug: "",
			price: 39,
			sale_price: "",
			sku: `DZ-KIT-${Math.floor(100 + Math.random() * 900)}`,
			category: "Physical Case Kits",
			stock_quantity: 20,
			cover_image: "",
			short_description: "",
			full_description: "",
			availability_status: "available"
		});
		setShowModal(true);
	};
	const handleOpenEdit = (p) => {
		setEditingProduct(p);
		setFormData({
			name: p.name,
			slug: p.slug,
			price: p.price,
			sale_price: p.sale_price ? String(p.sale_price) : "",
			sku: p.sku || "",
			category: p.category || "Physical Case Kits",
			stock_quantity: p.stock_quantity ?? 10,
			cover_image: p.cover_image || "",
			short_description: p.short_description || "",
			full_description: p.full_description || "",
			availability_status: p.availability_status || "available"
		});
		setShowModal(true);
	};
	const handleDelete = async (id, name) => {
		if (!window.confirm(`Delete product "${name}"?`)) return;
		try {
			await api.deleteProduct(id);
			setProducts(products.filter((p) => p.id !== id));
		} catch (err) {
			alert(err.message || "Failed to delete product");
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		setError(null);
		try {
			const payload = {
				...formData,
				price: Number(formData.price),
				sale_price: formData.sale_price ? Number(formData.sale_price) : null,
				stock_quantity: Number(formData.stock_quantity)
			};
			if (editingProduct) {
				const updated = await api.updateProduct(editingProduct.id, payload);
				setProducts(products.map((p) => p.id === editingProduct.id ? updated : p));
			} else {
				const created = await api.createProduct(payload);
				setProducts([created, ...products]);
			}
			setShowModal(false);
		} catch (err) {
			setError(err.message || "Failed to save product");
		} finally {
			setSubmitting(false);
		}
	};
	const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, {
		title: "Store & Inventory CMS",
		subtitle: "Physical Evidence Kits, Gear & Collectibles",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: handleOpenCreate,
			className: "flex items-center gap-2 rounded-lg bg-blood px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-blood/90 transition-all shadow-[0_0_18px_rgba(179,18,23,0.35)] cursor-pointer",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add Product" })]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative max-w-md w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Search products by title or SKU...",
						className: "w-full rounded-lg border border-white/10 bg-[#070707] py-2.5 pl-10 pr-4 font-mono text-[12px] text-white placeholder-white/30 outline-none focus:border-blood"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-mono text-[11px] uppercase tracking-wider text-white/40",
					children: [filtered.length, " Items Listed"]
				})]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-20 text-center font-mono text-xs uppercase tracking-widest text-white/40",
				children: "Loading Store Catalog..."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-white/[0.08] bg-[#070707] overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left font-mono text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-white/10 bg-white/[0.02] text-white/50 uppercase tracking-wider text-[10px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3.5 pl-5",
								children: "Product"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3.5 px-4",
								children: "SKU / Code"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3.5 px-4",
								children: "Price"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3.5 px-4",
								children: "Stock"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3.5 px-4",
								children: "Availability"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3.5 pr-5 text-right",
								children: "Actions"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-white/[0.05]",
						children: filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-white/[0.02] transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-4 pl-5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [p.cover_image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: p.cover_image,
											alt: p.name,
											className: "h-10 w-10 rounded-lg object-cover bg-black border border-white/10"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/30",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-sans font-bold text-white text-sm",
											children: p.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-white/40",
											children: p.category
										})] })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-4 px-4 text-white/60",
									children: p.sku || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-4 px-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-white",
											children: ["₹", p.price?.toFixed(0)]
										}), p.sale_price && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-emerald-400 font-bold",
											children: [
												"(₹",
												p.sale_price?.toFixed(0),
												")"
											]
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-4 px-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `font-bold ${p.stock_quantity <= 5 ? "text-amber-400" : "text-white/80"}`,
										children: [p.stock_quantity, " units"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-4 px-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded-full px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-bold ${p.availability_status === "available" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"}`,
										children: p.availability_status
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-4 pr-5 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-end gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleOpenEdit(p),
											className: "rounded p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleDelete(p.id, p.name),
											className: "rounded p-1.5 text-white/50 hover:bg-blood/20 hover:text-blood transition-colors",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})]
									})
								})
							]
						}, p.id))
					})]
				})
			}),
			showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-2xl rounded-2xl border border-white/15 bg-[#090909] p-6 sm:p-8 shadow-2xl my-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pb-4 border-b border-white/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-bold uppercase tracking-wider text-white",
								children: editingProduct ? "Edit Product" : "Add Store Product"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setShowModal(false),
								className: "text-white/40 hover:text-white p-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
							})]
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-lg border border-blood/40 bg-blood/10 p-3 font-mono text-xs text-red-300 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							className: "mt-6 space-y-4 font-mono text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block uppercase tracking-wider text-white/60 mb-1",
									children: "Product Name *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									value: formData.name,
									onChange: (e) => {
										const name = e.target.value;
										setFormData({
											...formData,
											name,
											slug: editingProduct ? formData.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
										});
									},
									placeholder: "The Voicemail Evidence Dossier",
									className: "w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2.5 text-white font-sans text-sm focus:border-blood outline-none"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase tracking-wider text-white/60 mb-1",
										children: "URL Slug *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										required: true,
										value: formData.slug,
										onChange: (e) => setFormData({
											...formData,
											slug: e.target.value
										}),
										className: "w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2.5 text-white focus:border-blood outline-none"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase tracking-wider text-white/60 mb-1",
										children: "SKU / Code"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: formData.sku,
										onChange: (e) => setFormData({
											...formData,
											sku: e.target.value
										}),
										placeholder: "DZ-KIT-001",
										className: "w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2.5 text-white focus:border-blood outline-none"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block uppercase tracking-wider text-white/60 mb-1",
											children: "Regular Price ($) *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											step: "0.01",
											required: true,
											value: formData.price,
											onChange: (e) => setFormData({
												...formData,
												price: Number(e.target.value)
											}),
											className: "w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2.5 text-white focus:border-blood outline-none"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block uppercase tracking-wider text-white/60 mb-1",
											children: "Sale Price ($)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											step: "0.01",
											value: formData.sale_price,
											onChange: (e) => setFormData({
												...formData,
												sale_price: e.target.value
											}),
											placeholder: "Leave blank if none",
											className: "w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2.5 text-white focus:border-blood outline-none"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block uppercase tracking-wider text-white/60 mb-1",
											children: "Stock Quantity"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											value: formData.stock_quantity,
											onChange: (e) => setFormData({
												...formData,
												stock_quantity: Number(e.target.value)
											}),
											className: "w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2.5 text-white focus:border-blood outline-none"
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase tracking-wider text-white/60 mb-1",
										children: "Category"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: formData.category,
										onChange: (e) => setFormData({
											...formData,
											category: e.target.value
										}),
										className: "w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2.5 text-white focus:border-blood outline-none",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Physical Case Kits",
												children: "Physical Case Kits"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Field Equipment",
												children: "Field Equipment"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Collector Editions",
												children: "Collector Editions"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Digital Files",
												children: "Digital Files"
											})
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block uppercase tracking-wider text-white/60 mb-1",
										children: "Availability"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: formData.availability_status,
										onChange: (e) => setFormData({
											...formData,
											availability_status: e.target.value
										}),
										className: "w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2.5 text-white focus:border-blood outline-none",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "available",
												children: "Available (In Stock)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "preorder",
												children: "Pre-Order"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "out_of_stock",
												children: "Out of Stock"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "discontinued",
												children: "Discontinued"
											})
										]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploadField, {
									label: "Product Cover Image (S3 URL or Upload)",
									value: formData.cover_image,
									onChange: (val) => setFormData({
										...formData,
										cover_image: val
									}),
									folder: "store",
									placeholder: "https://bucket.s3.amazonaws.com/products/kit.png or upload below"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block uppercase tracking-wider text-white/60 mb-1",
									children: "Short Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 2,
									value: formData.short_description,
									onChange: (e) => setFormData({
										...formData,
										short_description: e.target.value
									}),
									placeholder: "Brief summary shown on store cards...",
									className: "w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 text-white font-sans text-xs focus:border-blood outline-none"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-end gap-3 pt-6 border-t border-white/10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowModal(false),
										className: "rounded-lg border border-white/15 px-4 py-2 uppercase tracking-wider text-white/70 hover:bg-white/[0.04]",
										children: "Cancel"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										disabled: submitting,
										className: "rounded-lg bg-blood px-5 py-2 font-display text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-blood/90 transition-all disabled:opacity-50",
										children: submitting ? "Saving..." : editingProduct ? "Update Product" : "Create Product"
									})]
								})
							]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { AdminStore as component };
