import React, { useState, useRef } from "react";
import { Upload, Link as LinkIcon, Image as ImageIcon, Check, Loader2, X, ExternalLink } from "lucide-react";
import { api } from "@/lib/api";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  folder?: string;
  placeholder?: string;
  helperText?: string;
  className?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  folder = "general",
  placeholder = "Paste S3 URL (https://bucket.s3.amazonaws.com/...) or upload file",
  helperText,
  className = "",
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const res = await api.uploadMedia(file, folder);
      if (res && res.file_url) {
        // If relative URL returned, can use as is or full host URL
        onChange(res.file_url);
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-mono uppercase text-white/70">
          {label}
        </label>
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 font-mono text-[10px] text-blood hover:underline"
          >
            <span>Preview in New Tab</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
        )}
      </div>

      <div className="flex gap-2">
        {/* URL Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-white/10 bg-black/60 py-2.5 pl-9 pr-8 font-mono text-xs text-white outline-none transition-colors focus:border-blood"
          />
          <LinkIcon className="absolute left-3 top-3 h-3.5 w-3.5 text-white/40" />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-2.5 top-2.5 rounded text-white/40 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Upload Button */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/mp4"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.05] px-3.5 py-2.5 font-mono text-xs text-white hover:border-blood hover:bg-blood/20 disabled:opacity-50 transition-all cursor-pointer shrink-0"
        >
          {uploading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-blood" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-3.5 w-3.5 text-blood" />
              <span>Upload File</span>
            </>
          )}
        </button>
      </div>

      {uploadError && (
        <p className="font-mono text-[10px] text-red-400">{uploadError}</p>
      )}

      {/* Live Preview Thumbnail if image */}
      {value && (
        <div className="mt-2 flex items-center gap-3 rounded-lg border border-white/[0.08] bg-black/40 p-2">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded border border-white/10 bg-black/80 flex items-center justify-center">
            {value.endsWith(".mp4") ? (
              <span className="font-mono text-[9px] uppercase text-blood font-bold">VIDEO</span>
            ) : (
              <img
                src={value}
                alt="Preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            )}
          </div>
          <div className="min-w-0 flex-1 font-mono text-[10px]">
            <p className="truncate text-white/80">{value}</p>
            <p className="text-white/40">
              {value.startsWith("http") ? "Remote S3 / CDN Asset" : "Local File Asset"}
            </p>
          </div>
        </div>
      )}

      {helperText && (
        <p className="font-mono text-[10px] text-white/40">{helperText}</p>
      )}
    </div>
  );
}
