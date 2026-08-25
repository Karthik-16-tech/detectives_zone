import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Plus,
  Search,
  Trash2,
  Edit,
  Tag,
  DollarSign,
  Package,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { api } from "@/lib/api";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export const Route = createFileRoute("/admin/store")({
  component: AdminStore,
});

function AdminStore() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: 999,
    sale_price: "",
    shipping_fee: 0,
    sku: "",
    category: "Physical Case Kits",
    stock_quantity: 20,
    cover_image: "",
    short_description: "",
    full_description: "",
    availability_status: "available",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getAllProductsAdmin();
      setProducts(data);
    } catch (err: any) {
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
      price: 999,
      sale_price: "",
      shipping_fee: 0,
      sku: `DZ-KIT-${Math.floor(100 + Math.random() * 900)}`,
      category: "Physical Case Kits",
      stock_quantity: 20,
      cover_image: "",
      short_description: "",
      full_description: "",
      availability_status: "available",
    });
    setError(null);
    setShowModal(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      slug: p.slug,
      price: p.price,
      sale_price: p.sale_price !== null && p.sale_price !== undefined ? String(p.sale_price) : "",
      shipping_fee: p.shipping_fee !== null && p.shipping_fee !== undefined ? Number(p.shipping_fee) : 0,
      sku: p.sku || "",
      category: p.category || "Physical Case Kits",
      stock_quantity: p.stock_quantity ?? 10,
      cover_image: p.cover_image || "",
      short_description: p.short_description || "",
      full_description: p.full_description || "",
      availability_status: p.availability_status || "available",
    });
    setError(null);
    setShowModal(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete product "${name}"?`)) return;
    try {
      await api.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      showToast(`Product "${name}" deleted successfully.`);
    } catch (err: any) {
      alert(err.message || "Failed to delete product");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const parsedPrice = isNaN(Number(formData.price)) ? 999 : Number(formData.price);
      const parsedSalePrice = formData.sale_price !== "" && formData.sale_price !== null && !isNaN(Number(formData.sale_price))
        ? Number(formData.sale_price)
        : null;

      const payload: any = {
        ...formData,
        price: parsedPrice,
        sale_price: parsedSalePrice,
        stock_quantity: isNaN(Number(formData.stock_quantity)) ? 10 : Number(formData.stock_quantity),
      };

      if (editingProduct) {
        const updated = await api.updateProduct(editingProduct.id, payload);
        setProducts(products.map((p) => (p.id === editingProduct.id ? updated : p)));
        showToast(`✓ "${updated.name}" updated (₹${updated.price}) — Live across store & case cards!`);
      } else {
        const created = await api.createProduct(payload);
        setProducts([created, ...products]);
        showToast(`✓ New product "${created.name}" created successfully!`);
      }
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminLayout
      title="Store & Inventory CMS"
      subtitle="Physical Evidence Kits, Gear & Collectibles"
      action={
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-lg bg-blood px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-blood/90 transition-all shadow-[0_0_18px_rgba(179,18,23,0.35)] cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      }
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-500/40 bg-[#080808]/95 px-5 py-3 font-mono text-xs text-emerald-400 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-md animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
      {/* Search Bar */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title or SKU..."
            className="w-full rounded-lg border border-white/10 bg-[#070707] py-2.5 pl-10 pr-4 font-mono text-[12px] text-white placeholder-white/30 outline-none focus:border-blood"
          />
        </div>
        <div className="font-mono text-[11px] uppercase tracking-wider text-white/40">
          {filtered.length} Items Listed
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-xs uppercase tracking-widest text-white/40">
          Loading Store Catalog...
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.08] bg-[#070707] overflow-hidden">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-white/50 uppercase tracking-wider text-[10px]">
                <th className="py-3.5 pl-5">Product</th>
                <th className="py-3.5 px-4">SKU / Code</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 pl-5">
                    <div className="flex items-center gap-3">
                      {p.cover_image ? (
                        <img
                          src={p.cover_image}
                          alt={p.name}
                          className="h-10 w-10 rounded-lg object-cover bg-black border border-white/10"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/30">
                          <ShoppingBag className="h-4 w-4" />
                        </div>
                      )}
                      <div>
                        <div className="font-sans font-bold text-white text-sm">{p.name}</div>
                        <div className="text-[10px] text-white/40">{p.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-white/60">{p.sku || "—"}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white">₹{p.price?.toFixed(0)}</span>
                      {p.sale_price && (
                        <span className="text-[10px] text-emerald-400 font-bold">
                          (₹{p.sale_price?.toFixed(0)})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`font-bold ${p.stock_quantity <= 5 ? "text-amber-400" : "text-white/80"}`}>
                      {p.stock_quantity} units
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-bold ${
                        p.availability_status === "available"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {p.availability_status}
                    </span>
                  </td>
                  <td className="py-4 pr-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="rounded p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="rounded p-1.5 text-white/50 hover:bg-blood/20 hover:text-blood transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-[#090909] p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="font-display text-lg font-bold uppercase tracking-wider text-white">
                {editingProduct ? "Edit Product" : "Add Store Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/40 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-blood/40 bg-blood/10 p-3 font-mono text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blood" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 font-mono text-xs">
              <div>
                <label className="block uppercase tracking-wider text-white/60 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData,
                      name,
                      slug: editingProduct ? formData.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    });
                  }}
                  placeholder="The Voicemail Evidence Dossier"
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2.5 text-white font-sans text-sm focus:border-blood outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2.5 text-white focus:border-blood outline-none"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1">SKU / Code</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="DZ-KIT-001"
                    className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2.5 text-white focus:border-blood outline-none"
                  />
                </div>
              </div>

              {/* Pricing & Inventory Box */}
              <div className="rounded-xl border border-blood/30 bg-blood/[0.04] p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-blood/20 pb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blood">
                    💳 Pricing & Inventory Control
                  </span>
                  <span className="text-[10px] text-white/70">
                    Active Rate: <b className="text-white">₹{formData.sale_price !== "" && formData.sale_price !== null && !isNaN(Number(formData.sale_price)) ? Number(formData.sale_price) : Number(formData.price) || 0}</b>
                    {formData.sale_price && Number(formData.sale_price) < Number(formData.price) && (
                      <span className="text-emerald-400 font-bold ml-1.5 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                        {Math.round(((Number(formData.price) - Number(formData.sale_price)) / Number(formData.price)) * 100)}% OFF
                      </span>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block uppercase tracking-wider text-white/60 mb-1 text-[10px]">Regular Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      placeholder="1500"
                      className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-white focus:border-blood outline-none font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-blood font-bold mb-1 text-[10px]">Sale Price (₹)</label>
                    <input
                      type="number"
                      value={formData.sale_price}
                      onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                      placeholder="999 (Discount)"
                      className="w-full rounded-lg border border-blood/30 bg-black/80 px-3 py-2 text-white focus:border-blood outline-none font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-emerald-400 font-bold mb-1 text-[10px]">Shipping Fee (₹)</label>
                    <input
                      type="number"
                      value={formData.shipping_fee ?? 0}
                      onChange={(e) => setFormData({ ...formData, shipping_fee: Number(e.target.value) })}
                      placeholder="0 = Free"
                      className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-white focus:border-blood outline-none font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-white/60 mb-1 text-[10px]">Stock Qty</label>
                    <input
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                      className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-white focus:border-blood outline-none text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2.5 text-white focus:border-blood outline-none"
                  >
                    <option value="Physical Case Kits">Physical Case Kits</option>
                    <option value="Field Equipment">Field Equipment</option>
                    <option value="Collector Editions">Collector Editions</option>
                    <option value="Digital Files">Digital Files</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1">Availability</label>
                  <select
                    value={formData.availability_status}
                    onChange={(e) => setFormData({ ...formData, availability_status: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2.5 text-white focus:border-blood outline-none"
                  >
                    <option value="available">Available (In Stock)</option>
                    <option value="preorder">Pre-Order</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                </div>
              </div>

              <div>
                <ImageUploadField
                  label="Product Cover Image (S3 URL or Upload)"
                  value={formData.cover_image}
                  onChange={(val) => setFormData({ ...formData, cover_image: val })}
                  folder="store"
                  placeholder="https://bucket.s3.amazonaws.com/products/kit.png or upload below"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-white/60 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="Brief summary shown on store cards..."
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 text-white font-sans text-xs focus:border-blood outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-white/15 px-4 py-2 uppercase tracking-wider text-white/70 hover:bg-white/[0.04]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-blood px-5 py-2 font-display text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-blood/90 transition-all disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
