import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  MessageCircle,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Phone,
  Radio,
  Send,
  Sparkles,
  Smartphone,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { api } from "@/lib/api";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/context/AdminAuthContext";

export const Route = createFileRoute("/admin/whatsapp")({
  component: AdminWhatsAppPanel,
});

function AdminWhatsAppPanel() {
  const { admin } = useAdminAuth();
  const [settings, setSettings] = useState<Record<string, string>>({
    whatsapp_phone_number: "6305729867",
    whatsapp_message: "Hi Detective Zone Team, I have an inquiry about case files.",
    whatsapp_order_msg: "Hi Detective Zone, I placed an order and want to confirm my delivery details.",
    whatsapp_enabled: "true",
    whatsapp_position: "bottom-left",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await api.getSettings();
      if (data) {
        setSettings((prev) => ({
          ...prev,
          whatsapp_phone_number: data.whatsapp_phone_number || "6305729867",
          whatsapp_message:
            data.whatsapp_message ||
            "Hi Detective Zone Team, I have an inquiry about case files.",
          whatsapp_order_msg:
            data.whatsapp_order_msg ||
            "Hi Detective Zone, I placed an order and want to confirm my delivery details.",
          whatsapp_enabled: data.whatsapp_enabled ?? "true",
          whatsapp_position: data.whatsapp_position || "bottom-left",
        }));
      }
    } catch (err: any) {
      console.error("Failed to load WhatsApp settings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccess(false);

    const phone = settings.whatsapp_phone_number?.trim() || "";
    if (!phone) {
      setError("Please enter a valid WhatsApp phone number.");
      return;
    }

    try {
      setSaving(true);
      const updated = await api.bulkUpdateSettings({
        whatsapp_phone_number: phone,
        whatsapp_message: settings.whatsapp_message || "Hi Detective Zone Team, I have an inquiry.",
        whatsapp_order_msg: settings.whatsapp_order_msg || "Hi Detective Zone, I placed an order.",
        whatsapp_enabled: settings.whatsapp_enabled || "true",
        whatsapp_position: settings.whatsapp_position || "bottom-left",
      });
      setSettings((prev) => ({ ...prev, ...updated }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to update WhatsApp configuration.");
    } finally {
      setSaving(false);
    }
  };

  // Construct Live wa.me preview URL
  const cleanNumber = (settings.whatsapp_phone_number || "6305729867").replace(/[^0-9]/g, "");
  const formattedNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber || "916305729867";
  const liveUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(
    settings.whatsapp_message || "Hi Detective Zone Team, I have an inquiry."
  )}`;

  return (
    <AdminLayout
      title="WhatsApp Redirection & Dispatch Panel"
      subtitle="Configure Live WhatsApp Support, Destination Number & Customer Redirection"
      action={
        <button
          type="button"
          onClick={() => handleSave()}
          disabled={saving || loading}
          className="flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-[#20bd5a] hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(37,211,102,0.35)]"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? "Saving..." : success ? "✓ Saved to Database!" : "Save Changes"}</span>
        </button>
      }
    >
      {/* Notifications */}
      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 p-4 font-mono text-xs text-[#25D366] shadow-[0_0_20px_rgba(37,211,102,0.15)] animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-bold">WhatsApp Configuration Updated Successfully!</p>
            <p className="text-white/60 text-[11px] mt-0.5">
              All website visitors clicking the floating WhatsApp chat button will now be redirected to <strong>+91 {settings.whatsapp_phone_number}</strong>.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-4 font-mono text-xs text-red-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Configuration */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Primary Channel Card */}
            <div className="rounded-2xl border border-white/10 bg-[#080808] p-6 sm:p-7 space-y-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366]">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold uppercase tracking-wider text-white">
                      WhatsApp Redirection Settings
                    </h3>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                      Destination Phone Number & Live Triggers
                    </p>
                  </div>
                </div>

                <span className="flex items-center gap-1.5 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 px-3 py-1 font-mono text-[10px] uppercase font-bold text-[#25D366]">
                  <span className="h-2 w-2 rounded-full bg-[#25D366] animate-pulse" />
                  Live Sync
                </span>
              </div>

              {/* Number Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-mono text-xs uppercase font-bold text-white/80">
                    WhatsApp Destination Number <span className="text-[#25D366]">*</span>
                  </label>
                  <span className="font-mono text-[10px] text-white/40">
                    10-digit Indian Mobile Number
                  </span>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 font-mono text-sm text-[#25D366] font-bold select-none">
                    +91
                  </span>
                  <input
                    type="text"
                    required
                    value={settings.whatsapp_phone_number || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, whatsapp_phone_number: e.target.value })
                    }
                    placeholder="6305729867"
                    className="w-full rounded-xl border border-white/15 bg-black/80 py-3.5 pl-14 pr-4 font-mono text-base font-bold text-white outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                  />
                </div>
                <p className="font-mono text-[11px] text-white/50">
                  Customer clicks on the floating chat button will immediately launch WhatsApp with this phone number.
                </p>
              </div>

              {/* Default Pre-filled Message */}
              <div className="space-y-2">
                <label className="block font-mono text-xs uppercase font-bold text-white/80">
                  Default Pre-filled Inquiry Message
                </label>
                <textarea
                  rows={3}
                  value={settings.whatsapp_message || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, whatsapp_message: e.target.value })
                  }
                  placeholder="Hi Detective Zone Team, I have an inquiry about case files."
                  className="w-full rounded-xl border border-white/15 bg-black/80 p-3.5 font-sans text-xs text-white outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] transition-all"
                />
                <p className="font-mono text-[10px] text-white/40">
                  This text automatically populates the user's WhatsApp message input when they open the chat.
                </p>
              </div>

              {/* Order Confirmation Message Template */}
              <div className="space-y-2">
                <label className="block font-mono text-xs uppercase font-bold text-white/80">
                  Order Updates & Tracking Message Template
                </label>
                <input
                  type="text"
                  value={settings.whatsapp_order_msg || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, whatsapp_order_msg: e.target.value })
                  }
                  placeholder="Hi Detective Zone, I placed an order and want to confirm my delivery details."
                  className="w-full rounded-xl border border-white/15 bg-black/80 p-3.5 font-sans text-xs text-white outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] transition-all"
                />
              </div>

              {/* Position & Display Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <label className="block font-mono text-xs uppercase font-bold text-white/80 mb-2">
                    Button Screen Position
                  </label>
                  <select
                    value={settings.whatsapp_position || "bottom-left"}
                    onChange={(e) =>
                      setSettings({ ...settings, whatsapp_position: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/15 bg-black/80 p-3 font-mono text-xs text-white outline-none focus:border-[#25D366]"
                  >
                    <option value="bottom-left">Bottom-Left Corner (Recommended)</option>
                    <option value="bottom-right">Bottom-Right Corner</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase font-bold text-white/80 mb-2">
                    Floating Button Visibility
                  </label>
                  <select
                    value={settings.whatsapp_enabled || "true"}
                    onChange={(e) =>
                      setSettings({ ...settings, whatsapp_enabled: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/15 bg-black/80 p-3 font-mono text-xs text-white outline-none focus:border-[#25D366]"
                  >
                    <option value="true">Active & Visible on Frontend</option>
                    <option value="false">Hidden / Disabled</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 font-display text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-[#20bd5a] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-[0_4px_20px_rgba(37,211,102,0.3)]"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? "Saving to Cloud Database..." : "Save WhatsApp Settings"}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Live Simulator & Direct Click Testing */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Link Verification Card */}
          <div className="rounded-2xl border border-[#25D366]/30 bg-gradient-to-b from-[#07180e] to-[#0a0a0a] p-6 space-y-5 shadow-xl">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-[#25D366]" />
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                Live Click Redirection Test
              </h3>
            </div>

            <p className="font-mono text-xs text-white/60">
              Test your configured WhatsApp chat link in real-time. Clicking below simulates the exact user experience when a visitor taps the floating chat button.
            </p>

            <div className="rounded-xl border border-white/10 bg-black/60 p-3.5 font-mono text-[11px] break-all space-y-1 text-white/80">
              <span className="text-[9px] uppercase tracking-wider text-white/40 block">Generated API Link:</span>
              <code className="text-[#25D366] select-all block">{liveUrl}</code>
            </div>

            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-[#25D366]/50 bg-[#25D366]/10 py-3 font-display text-xs font-bold uppercase tracking-wider text-[#25D366] hover:bg-[#25D366] hover:text-black transition-all cursor-pointer shadow-[0_0_15px_rgba(37,211,102,0.15)]"
            >
              <span>Test Open WhatsApp (+91 {settings.whatsapp_phone_number || "6305729867"})</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Mobile Visual Mockup Card */}
          <div className="rounded-2xl border border-white/10 bg-[#080808] p-6 space-y-4">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white/70">
              Frontend Button Visual Preview
            </h4>

            <div className="relative h-44 rounded-xl border border-white/10 bg-[#040404] p-4 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                <span>Frontend Case Dossiers</span>
                <span>Detective Zone</span>
              </div>

              <div className="font-mono text-[10px] text-white/20 text-center">
                User browsing cases & evidence
              </div>

              {/* Floating Button in Mockup */}
              <div
                className={`flex items-center gap-2 ${
                  settings.whatsapp_position === "bottom-right" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black border border-[#25D366]/40 text-[#25D366] shadow-[0_4px_16px_rgba(0,0,0,0.9)] cursor-pointer transition-transform hover:scale-105"
                >
                  <MessageCircle className="h-5 w-5 text-[#25D366]" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              <span>Clean circular design · No beacon overlay · Zero latency</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
