import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  FolderOpen,
  Plus,
  Search,
  Trash2,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  AlertCircle,
  X,
  Upload,
  CheckCircle2,
  SlidersHorizontal,
  Star,
  Clock,
} from "lucide-react";
import { api } from "@/lib/api";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export const Route = createFileRoute("/admin/cases")({
  component: AdminCases,
});

function AdminCases() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCase, setEditingCase] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for new case
  const [formData, setFormData] = useState({
    case_number: "",
    slug: "",
    title: "",
    subtitle: "",
    tagline: "",
    intro_text: "",
    cover_image: "",
    hero_image: "",
    status: "UNSOLVED",
    difficulty: "HARD",
    estimated_duration: "3–5 HOURS",
    rating: 5.0,
    short_description: "",
    featured: false,
    is_published: true,
  });

  useEffect(() => {
    loadCases();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadCases = async () => {
    try {
      setLoading(true);
      const data = await api.getAllCasesAdmin();
      setCases(data);
    } catch (err: any) {
      setError(err.message || "Failed to load cases");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (caseItem: any) => {
    try {
      const updated = await api.updateCase(caseItem.id, { is_published: !caseItem.is_published });
      setCases(
        cases.map((c) => (c.id === caseItem.id ? { ...c, is_published: updated.is_published } : c))
      );
      showToast(updated.is_published ? "Case published and visible live" : "Case set to hidden draft");
    } catch (err: any) {
      alert(err.message || "Failed to update case");
    }
  };

  const handleDeleteCase = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? All sections, evidence, and clues will be erased.`)) {
      return;
    }
    try {
      await api.deleteCase(id);
      setCases(cases.filter((c) => c.id !== id));
      showToast("Case deleted successfully");
    } catch (err: any) {
      alert(err.message || "Failed to delete case");
    }
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "create" | "edit") => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const media = await api.uploadMedia(file, "case_cover");
      if (target === "create") {
        setFormData((prev) => ({ ...prev, cover_image: media.url, hero_image: media.url }));
      } else if (editingCase) {
        setEditingCase((prev: any) => ({ ...prev, cover_image: media.url, hero_image: media.url }));
      }
      showToast("Image uploaded successfully");
    } catch (err: any) {
      alert(err.message || "Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        slug: formData.slug.trim() || formData.case_number.toLowerCase().replace(/\s+/g, "-"),
      };
      const newCase = await api.createCase(payload);
      setCases([newCase, ...cases]);
      setShowCreateModal(false);
      setFormData({
        case_number: "",
        slug: "",
        title: "",
        subtitle: "",
        tagline: "",
        intro_text: "",
        cover_image: "",
        hero_image: "",
        status: "UNSOLVED",
        difficulty: "HARD",
        estimated_duration: "3–5 HOURS",
        rating: 5.0,
        short_description: "",
        featured: false,
        is_published: true,
      });
      showToast("New case file created");
    } catch (err: any) {
      setError(err.message || "Failed to create case");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveEditCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCase) return;
    setSubmitting(true);
    setError(null);
    try {
      const updated = await api.updateCase(editingCase.id, {
        title: editingCase.title,
        case_number: editingCase.case_number,
        slug: editingCase.slug,
        subtitle: editingCase.subtitle,
        tagline: editingCase.tagline,
        short_description: editingCase.short_description,
        intro_text: editingCase.intro_text,
        cover_image: editingCase.cover_image,
        hero_image: editingCase.hero_image,
        status: editingCase.status,
        difficulty: editingCase.difficulty,
        estimated_duration: editingCase.estimated_duration,
        rating: parseFloat(editingCase.rating) || 5.0,
        featured: editingCase.featured,
        is_published: editingCase.is_published,
      });
      setCases(cases.map((c) => (c.id === updated.id ? updated : c)));
      setEditingCase(null);
      showToast("Case card updated live");
    } catch (err: any) {
      setError(err.message || "Failed to update case card");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCases = cases.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.case_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title="Case Files CMS"
      subtitle="Manage Classified Dossiers, Case Cards & Live Investigation Content"
      action={
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blood px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-blood/90 transition-all shadow-[0_0_18px_rgba(179,18,23,0.35)] cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Case</span>
        </button>
      }
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-500/40 bg-[#080808]/95 px-5 py-3 font-mono text-xs text-emerald-400 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-md animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Search Bar & Summary */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by case # or title..."
            className="w-full rounded-lg border border-white/10 bg-[#070707] py-2.5 pl-10 pr-4 font-mono text-[12px] text-white placeholder-white/30 outline-none focus:border-blood"
          />
        </div>
        <div className="font-mono text-[11px] uppercase tracking-wider text-white/40">
          Showing {filteredCases.length} Cases
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-xs uppercase tracking-widest text-white/40">
          Scanning Dossier Archives...
        </div>
      ) : filteredCases.length === 0 ? (
        <div className="rounded-xl border border-white/[0.08] bg-[#070707] p-12 text-center">
          <FolderOpen className="mx-auto h-12 w-12 text-white/20 mb-3" />
          <h3 className="font-display text-lg uppercase tracking-wider text-white">No Case Files Found</h3>
          <p className="mt-1 font-mono text-xs text-white/40">Create a case file to begin building the archive.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((c) => (
            <div
              key={c.id}
              className="group relative flex flex-col rounded-xl border border-white/[0.08] bg-[#070707] overflow-hidden transition-all duration-300 hover:border-blood/40 shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
            >
              {/* Cover Image Banner */}
              <div className="relative h-48 w-full bg-black/60 overflow-hidden">
                {c.cover_image ? (
                  <img
                    src={c.cover_image}
                    alt={c.title}
                    className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/[0.02] text-white/20">
                    No Cover Image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-black/60" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="rounded bg-black/80 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-blood border border-blood/40">
                    {c.case_number?.startsWith("CASE") ? c.case_number : `CASE ${c.case_number}`}
                  </span>
                  <span className={`rounded px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider ${
                    c.status === "UNSOLVED" ? "bg-blood/80 text-white" : "bg-neutral-800 text-white/70"
                  }`}>
                    {c.status}
                  </span>
                </div>

                {/* Quick Visibility & Edit Overlay */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => handleTogglePublish(c)}
                    title={c.is_published ? "Visible on Frontend (Click to hide)" : "Hidden Draft (Click to publish)"}
                    className={`rounded-full p-1.5 backdrop-blur-md transition-colors cursor-pointer ${
                      c.is_published
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-white/10 text-white/40 border border-white/20"
                    }`}
                  >
                    {c.is_published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => setEditingCase({ ...c })}
                    title="Edit Card Details"
                    className="rounded-full bg-black/70 p-1.5 text-white/70 border border-white/20 hover:text-white hover:border-blood/50 transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Case Card Body */}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between text-[10px] font-mono text-white/40 uppercase mb-1">
                  <span>{c.difficulty}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {c.estimated_duration || "3–5 HOURS"}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white group-hover:text-blood transition-colors">
                  {c.title}
                </h3>
                {c.subtitle && (
                  <p className="mt-1 font-sans text-xs text-white/50 line-clamp-1">{c.subtitle}</p>
                )}
                <p className="mt-2 font-mono text-[11px] leading-relaxed text-white/45 line-clamp-2">
                  {c.short_description || c.intro_text || "No summary provided."}
                </p>

                {/* Stars and Live Indicator */}
                <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.round(c.rating || 5) ? "fill-blood text-blood" : "text-neutral-800"
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`font-mono text-[9px] uppercase tracking-wider ${c.is_published ? "text-emerald-400" : "text-white/30"}`}>
                    {c.is_published ? "● Live On Site" : "○ Hidden Draft"}
                  </span>
                </div>

                {/* Footer Controls */}
                <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4 gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingCase({ ...c })}
                      className="flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/80 hover:bg-white/[0.08] hover:text-white transition-colors cursor-pointer border border-white/5"
                    >
                      <SlidersHorizontal className="h-3 w-3 text-blood" />
                      <span>Edit Card</span>
                    </button>
                    <Link
                      to={`/admin/cases/${c.id}`}
                      className="flex items-center gap-1.5 rounded-lg bg-blood/10 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-blood hover:bg-blood/20 hover:text-white transition-colors border border-blood/20"
                    >
                      <Edit className="h-3 w-3" />
                      <span>CMS Details</span>
                    </Link>
                  </div>

                  <div className="flex items-center gap-1">
                    <Link
                      to={`/cases/${c.slug || c.case_number}`}
                      target="_blank"
                      title="View live case"
                      className="p-1.5 text-white/40 hover:text-white transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDeleteCase(c.id, c.title)}
                      title="Delete case file"
                      className="p-1.5 text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QUICK EDIT CARD MODAL */}
      {editingCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#0a0a0a] p-6 shadow-2xl my-auto">
            <div className="sticky top-0 z-10 -mx-6 -mt-6 mb-5 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a]/95 px-6 py-4 backdrop-blur-md">
              <div>
                <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white">
                  Edit Case Card: {editingCase.title}
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-wider text-blood mt-0.5">
                  Update live card text, status, image, rating & visibility
                </p>
              </div>
              <button
                onClick={() => setEditingCase(null)}
                className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCard} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-white/60 mb-1">Case Number</label>
                  <input
                    type="text"
                    required
                    value={editingCase.case_number}
                    onChange={(e) => setEditingCase({ ...editingCase, case_number: e.target.value })}
                    placeholder="001"
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  />
                </div>
                <div>
                  <label className="block uppercase text-white/60 mb-1">Case Title</label>
                  <input
                    type="text"
                    required
                    value={editingCase.title}
                    onChange={(e) => setEditingCase({ ...editingCase, title: e.target.value })}
                    placeholder="The Last Voicemail"
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase text-white/60 mb-1">Subtitle / One-liner</label>
                <input
                  type="text"
                  value={editingCase.subtitle || ""}
                  onChange={(e) => setEditingCase({ ...editingCase, subtitle: e.target.value })}
                  placeholder="A successful businessman found dead in his study"
                  className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                />
              </div>

              <div>
                <label className="block uppercase text-white/60 mb-1">Short Description (Card Summary)</label>
                <textarea
                  rows={3}
                  value={editingCase.short_description || ""}
                  onChange={(e) => setEditingCase({ ...editingCase, short_description: e.target.value })}
                  placeholder="Summary displayed on public coverflow cards..."
                  className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood resize-none"
                />
              </div>

              {/* Image URL, Upload & Live Preview */}
              <div>
                <label className="block uppercase text-white/60 mb-1">Cover Image (URL or Upload)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingCase.cover_image || ""}
                    onChange={(e) => setEditingCase({ ...editingCase, cover_image: e.target.value })}
                    placeholder="https://... or /src/assets/case-voicemail.png"
                    className="flex-1 rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  />
                  <label className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.05] px-3.5 py-2.5 font-display text-[11px] uppercase tracking-wider text-white hover:bg-blood/20 hover:border-blood/40 transition-colors cursor-pointer">
                    <Upload className="h-3.5 w-3.5 text-blood" />
                    <span>{uploadingImage ? "Uploading..." : "Upload File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileUpload(e, "edit")}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Dialog Live Image Preview */}
                {editingCase.cover_image && (
                  <div className="mt-2.5 flex items-center gap-3.5 rounded-xl border border-white/10 bg-black/80 p-3">
                    <div className="relative h-16 w-24 overflow-hidden rounded-lg border border-white/10 bg-[#070707] shrink-0">
                      <img
                        src={editingCase.cover_image}
                        alt={editingCase.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="inline-block rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/30 mb-1">
                        Card Image Preview
                      </span>
                      <p className="font-mono text-[10px] text-white/50 truncate max-w-sm">
                        {editingCase.cover_image}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block uppercase text-white/60 mb-1">Status</label>
                  <select
                    value={editingCase.status}
                    onChange={(e) => setEditingCase({ ...editingCase, status: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood uppercase"
                  >
                    <option value="UNSOLVED">UNSOLVED</option>
                    <option value="COMING SOON">COMING SOON</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase text-white/60 mb-1">Difficulty</label>
                  <select
                    value={editingCase.difficulty}
                    onChange={(e) => setEditingCase({ ...editingCase, difficulty: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood uppercase"
                  >
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                    <option value="EXPERT">EXPERT</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase text-white/60 mb-1">Duration</label>
                  <input
                    type="text"
                    value={editingCase.estimated_duration || ""}
                    onChange={(e) => setEditingCase({ ...editingCase, estimated_duration: e.target.value })}
                    placeholder="3–5 HOURS"
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-white/60 mb-1">Rating / Stars (1–5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={editingCase.rating ?? 5.0}
                    onChange={(e) => setEditingCase({ ...editingCase, rating: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  />
                </div>
                <div className="flex items-center gap-6 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingCase.is_published}
                      onChange={(e) => setEditingCase({ ...editingCase, is_published: e.target.checked })}
                      className="rounded accent-blood h-4 w-4"
                    />
                    <span className="uppercase text-white/80">Visible Live</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingCase.featured}
                      onChange={(e) => setEditingCase({ ...editingCase, featured: e.target.checked })}
                      className="rounded accent-blood h-4 w-4"
                    />
                    <span className="uppercase text-white/80">Featured</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingCase(null)}
                  className="rounded-lg px-4 py-2 uppercase text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-blood px-5 py-2 font-display text-[11px] font-semibold uppercase tracking-wider text-white hover:bg-blood/90 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Saving..." : "Save Card Live"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW CASE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#0a0a0a] p-6 shadow-2xl my-auto">
            <div className="sticky top-0 z-10 -mx-6 -mt-6 mb-5 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a]/95 px-6 py-4 backdrop-blur-md">
              <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white">
                Create New Case File
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-white/60 mb-1">Case Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.case_number}
                    onChange={(e) => setFormData({ ...formData, case_number: e.target.value })}
                    placeholder="007"
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  />
                </div>
                <div>
                  <label className="block uppercase text-white/60 mb-1">Case Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="The Midnight Cipher"
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase text-white/60 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="A secret hidden in plain sight"
                  className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                />
              </div>

              <div>
                <label className="block uppercase text-white/60 mb-1">Short Description (Card Summary)</label>
                <textarea
                  rows={2}
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="Brief synopsis for public showcase card..."
                  className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood resize-none"
                />
              </div>

              <div>
                <ImageUploadField
                  label="Case Cover Image (S3 URL or Upload)"
                  value={formData.cover_image}
                  onChange={(val) => setFormData({ ...formData, cover_image: val, hero_image: val })}
                  folder="cases"
                  placeholder="https://bucket.s3.amazonaws.com/cases/cover.jpg or /src/assets/case-voicemail.png"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block uppercase text-white/60 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood uppercase"
                  >
                    <option value="UNSOLVED">UNSOLVED</option>
                    <option value="COMING SOON">COMING SOON</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase text-white/60 mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood uppercase"
                  >
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                    <option value="EXPERT">EXPERT</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase text-white/60 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.estimated_duration}
                    onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
                    placeholder="3–5 HOURS"
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded accent-blood h-4 w-4"
                  />
                  <span className="uppercase text-white/80">Visible on Frontend</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded accent-blood h-4 w-4"
                  />
                  <span className="uppercase text-white/80">Featured Case</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg px-4 py-2 uppercase text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-blood px-5 py-2 font-display text-[11px] font-semibold uppercase tracking-wider text-white hover:bg-blood/90 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Creating..." : "Create Case Dossier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
