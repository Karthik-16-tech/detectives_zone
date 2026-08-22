import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import {
  Image as ImageIcon,
  UploadCloud,
  Copy,
  Check,
  Trash2,
  Folder,
  Film,
  Music,
  FileText,
  Search,
} from "lucide-react";
import { api } from "@/lib/api";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin/media")({
  component: AdminMedia,
});

function AdminMedia() {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [folderFilter, setFolderFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMedia();
  }, [folderFilter]);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const data = await api.getMediaList({
        folder: folderFilter === "all" ? undefined : folderFilter,
      });
      setMediaList(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folderFilter === "all" ? "general" : folderFilter);

    try {
      setUploading(true);
      const uploaded = await api.uploadMedia(file, folderFilter === "all" ? "general" : folderFilter);
      setMediaList([uploaded, ...mediaList]);
    } catch (err: any) {
      alert(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCopyUrl = (item: any) => {
    const fullUrl = item.file_url.startsWith("http")
      ? item.file_url
      : `https://api.detectiveszone.com${item.file_url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    try {
      await api.deleteMedia(id);
      setMediaList(mediaList.filter((m) => m.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete file");
    }
  };

  const filtered = mediaList.filter((m) =>
    m.original_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title="Media Library & Storage"
      subtitle="Centralized Asset Management for Evidence & Store"
      action={
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-lg bg-blood px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-blood/90 transition-all shadow-[0_0_18px_rgba(179,18,23,0.35)] cursor-pointer disabled:opacity-50"
          >
            <UploadCloud className="h-4 w-4" />
            <span>{uploading ? "Uploading Asset..." : "Upload File"}</span>
          </button>
        </div>
      }
    >
      {/* Folder Tabs & Search */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider overflow-x-auto pb-1">
          {["all", "cases", "evidence", "store", "kits", "general"].map((folder) => (
            <button
              key={folder}
              onClick={() => setFolderFilter(folder)}
              className={`rounded-lg px-3.5 py-1.5 transition-colors cursor-pointer ${
                folderFilter === folder
                  ? "bg-blood text-white font-bold"
                  : "bg-white/[0.03] text-white/50 hover:text-white"
              }`}
            >
              {folder}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search filenames..."
            className="w-full rounded-lg border border-white/10 bg-[#070707] py-1.5 pl-9 pr-3 font-mono text-[11px] text-white placeholder-white/30 outline-none focus:border-blood"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-xs uppercase tracking-widest text-white/40">
          Loading Media Files...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-white/[0.08] bg-[#070707] p-12 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-white/20 mb-3" />
          <h3 className="font-display text-lg uppercase text-white">No Media Files</h3>
          <p className="mt-1 font-mono text-xs text-white/40">Upload photos, videos, wiretaps, or documents above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item) => {
            const isImg = item.file_type === "image";
            const fullUrl = item.file_url.startsWith("http")
              ? item.file_url
              : `https://api.detectiveszone.com${item.file_url}`;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col rounded-xl border border-white/[0.08] bg-[#070707] overflow-hidden transition-all hover:border-blood/40"
              >
                {/* Thumbnail / Icon */}
                <div className="relative h-32 w-full bg-black/60 flex items-center justify-center overflow-hidden">
                  {isImg ? (
                    <img src={fullUrl} alt={item.original_name} className="h-full w-full object-cover" />
                  ) : item.file_type === "video" ? (
                    <Film className="h-10 w-10 text-white/30" />
                  ) : item.file_type === "audio" ? (
                    <Music className="h-10 w-10 text-white/30" />
                  ) : (
                    <FileText className="h-10 w-10 text-white/30" />
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleCopyUrl(item)}
                      title="Copy URL"
                      className="rounded-full bg-white/20 p-2 text-white hover:bg-blood transition-colors"
                    >
                      {copiedId === item.id ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.original_name)}
                      title="Delete"
                      className="rounded-full bg-white/20 p-2 text-white hover:bg-blood transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-2.5 font-mono text-[10px]">
                  <div className="truncate font-bold text-white/90" title={item.original_name}>
                    {item.original_name}
                  </div>
                  <div className="flex items-center justify-between text-white/40 mt-1">
                    <span className="uppercase">{item.folder}</span>
                    <span>{(item.file_size / 1024).toFixed(0)} KB</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
