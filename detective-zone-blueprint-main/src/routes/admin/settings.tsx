import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Settings,
  Save,
  KeyRound,
  Shield,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { api } from "@/lib/api";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const { admin } = useAdminAuth();
  const [settings, setSettings] = useState<Record<string, string>>({
    site_name: "Detective Zone",
    hero_title: "Detective Zone",
    hero_subtitle: "An Archive of Unfinished Truths",
    contact_email: "files@detectivezone.co",
    contact_phone: "+91 63057 29867",
    whatsapp_phone_number: "8885296645",
    whatsapp_message: "Hi Detective Zone Team, I have an inquiry about case files.",
    office_address: "114 W 41st Street, New York, NY 10036",
    shipping_flat_rate: "12.00",
    free_shipping_threshold: "75.00",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [savingUpi, setSavingUpi] = useState(false);
  const [upiSuccess, setUpiSuccess] = useState(false);
  const [savingWhatsApp, setSavingWhatsApp] = useState(false);
  const [whatsappSuccess, setWhatsappSuccess] = useState(false);

  const handleSaveUpiId = async () => {
    const upi = settings.upi_id?.trim() || "";
    if (!upi || !upi.includes("@")) {
      alert("Please enter a valid UPI address (e.g. 8885296645@ybl)");
      return;
    }
    try {
      setSavingUpi(true);
      await api.updateUpiId(upi);
      setUpiSuccess(true);
      setTimeout(() => setUpiSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to update UPI ID");
    } finally {
      setSavingUpi(false);
    }
  };

  const handleSaveWhatsApp = async () => {
    const phone = settings.whatsapp_phone_number?.trim() || "";
    if (!phone) {
      alert("Please enter a valid WhatsApp phone number (e.g. 8885296645)");
      return;
    }
    try {
      setSavingWhatsApp(true);
      await api.bulkUpdateSettings({
        whatsapp_phone_number: phone,
        whatsapp_message: settings.whatsapp_message || "Hi Detective Zone Team, I have an inquiry.",
      });
      setWhatsappSuccess(true);
      setTimeout(() => setWhatsappSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to update WhatsApp settings");
    } finally {
      setSavingWhatsApp(false);
    }
  };

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdSuccess, setPwdSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await api.getSettings();
      setSettings((prev) => ({ ...prev, ...data }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      const updated = await api.bulkUpdateSettings(settings);
      setSettings((prev) => ({ ...prev, ...updated }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError(null);
    setPwdSuccess(false);

    if (newPassword !== confirmPassword) {
      setPwdError("New passwords do not match");
      return;
    }

    try {
      await api.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setPwdSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPwdSuccess(false), 3000);
    } catch (err: any) {
      setPwdError(err.message || "Failed to change password");
    }
  };

  return (
    <AdminLayout
      title="Global Settings & Clearance"
      subtitle="Site Identity, Contact Points & Access Passcodes"
    >
      {success && (
        <div className="mb-6 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3.5 font-mono text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Site settings successfully synchronized across all client portals.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Global Site CMS */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSaveSettings} className="rounded-xl border border-white/[0.08] bg-[#070707] p-6 space-y-5 font-mono text-xs">
            <h3 className="font-display text-base font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3">
              Site Brand & Content Defaults
            </h3>

            <div>
              <label className="block uppercase text-white/50 mb-1">Organization / Brand Name</label>
              <input
                type="text"
                value={settings.site_name || ""}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood font-sans text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase text-white/50 mb-1">Hero Main Title</label>
                <input
                  type="text"
                  value={settings.hero_title || ""}
                  onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood font-sans text-sm"
                />
              </div>
              <div>
                <label className="block uppercase text-white/50 mb-1">Hero Subtitle</label>
                <input
                  type="text"
                  value={settings.hero_subtitle || ""}
                  onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood font-sans text-sm"
                />
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-3">
                Homepage Hero & Media Overrides
              </h4>
              <div className="space-y-4">
                <ImageUploadField
                  label="Hero Video File / S3 URL (Interactive Scrub)"
                  value={settings.hero_video_url || ""}
                  onChange={(val) => setSettings({ ...settings, hero_video_url: val })}
                  folder="general"
                  placeholder="https://bucket.s3.amazonaws.com/hero.mp4 or upload file"
                />
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-3">
                Homepage About Section (File 002)
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block uppercase text-white/50 mb-1">About Headline</label>
                  <input
                    type="text"
                    value={settings.about_heading || ""}
                    onChange={(e) => setSettings({ ...settings, about_heading: e.target.value })}
                    placeholder="Every shadow has a story"
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood font-sans text-sm"
                  />
                </div>
                <div>
                  <label className="block uppercase text-white/50 mb-1">About Narrative Text</label>
                  <textarea
                    rows={3}
                    value={settings.about_text || ""}
                    onChange={(e) => setSettings({ ...settings, about_text: e.target.value })}
                    placeholder="Detective Zone is a story-driven investigation experience..."
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood font-sans text-xs"
                  />
                </div>
                <ImageUploadField
                  label="About Street Photo (S3 URL or Upload)"
                  value={settings.about_image || ""}
                  onChange={(val) => setSettings({ ...settings, about_image: val })}
                  folder="general"
                  placeholder="https://detectives-zone-media.s3.eu-north-1.amazonaws.com/noir-street.jpg or S3 URL"
                />
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-3">
                Homepage Case Challenge (003)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-white/50 mb-1">Reward Discount Text</label>
                  <input
                    type="text"
                    value={settings.challenge_discount || ""}
                    onChange={(e) => setSettings({ ...settings, challenge_discount: e.target.value })}
                    placeholder="25% OFF"
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  />
                </div>
                <div>
                  <label className="block uppercase text-white/50 mb-1">Reward Promo Code</label>
                  <input
                    type="text"
                    value={settings.challenge_code || ""}
                    onChange={(e) => setSettings({ ...settings, challenge_code: e.target.value })}
                    placeholder="DZ25-SOLVED"
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  />
                </div>
                <div className="sm:col-span-2">
                  <ImageUploadField
                    label="Room 104 Crime Scene Image (S3 URL or Upload)"
                    value={settings.challenge_image || ""}
                    onChange={(val) => setSettings({ ...settings, challenge_image: val })}
                    folder="evidence"
                    placeholder="https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence-room.jpg or S3 URL"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-3">
                Store Page Featured Case Kit
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-white/50 mb-1">Featured Kit Title</label>
                  <input
                    type="text"
                    value={settings.featured_kit_title || ""}
                    onChange={(e) => setSettings({ ...settings, featured_kit_title: e.target.value })}
                    placeholder="The Last Voicemail"
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  />
                </div>
                <div>
                  <label className="block uppercase text-white/50 mb-1">Featured Kit Code</label>
                  <input
                    type="text"
                    value={settings.featured_kit_code || ""}
                    onChange={(e) => setSettings({ ...settings, featured_kit_code: e.target.value })}
                    placeholder="DZ-001"
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  />
                </div>
                <div>
                  <label className="block uppercase text-white/50 mb-1">Featured Price ($ / ₹)</label>
                  <input
                    type="text"
                    value={settings.featured_kit_price || ""}
                    onChange={(e) => setSettings({ ...settings, featured_kit_price: e.target.value })}
                    placeholder="999"
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  />
                </div>
                <div className="sm:col-span-2">
                  <ImageUploadField
                    label="Featured Kit Box Image (S3 URL or Upload)"
                    value={settings.featured_kit_image || ""}
                    onChange={(val) => setSettings({ ...settings, featured_kit_image: val })}
                    folder="kits"
                    placeholder="https://detectives-zone-media.s3.eu-north-1.amazonaws.com/case_kits/image.png or S3 URL"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block uppercase text-white/50 mb-1">Featured Quote / Hook</label>
                  <input
                    type="text"
                    value={settings.featured_kit_quote || ""}
                    onChange={(e) => setSettings({ ...settings, featured_kit_quote: e.target.value })}
                    placeholder='"A sealed case. A missing voice. Thirty pieces of evidence..."'
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-3">
                Official Contact & Dispatch Points
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-white/50 mb-1">Dispatch Email</label>
                  <input
                    type="email"
                    value={settings.contact_email || ""}
                    onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  />
                </div>
                <div>
                  <label className="block uppercase text-white/50 mb-1">Secure Line</label>
                  <input
                    type="text"
                    value={settings.contact_phone || ""}
                    onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="block uppercase text-white/50 mb-1">Office / Bureau Address</label>
                <input
                  type="text"
                  value={settings.office_address || ""}
                  onChange={(e) => setSettings({ ...settings, office_address: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood font-sans text-sm"
                />
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                PHONEPE & UPI PAYMENT GATEWAY CONFIGURATION
            ═══════════════════════════════════════════════════════════ */}
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-blood flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5" />
                  <span>UPI Payment Gateway & PhonePe Settings</span>
                </h4>
                <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  Backend Verified
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block uppercase text-white/70 font-bold text-xs">
                      Active Merchant UPI ID <span className="text-blood">*</span>
                    </label>
                    <span className="text-[10px] text-white/40 font-mono">Scanned by PhonePe, GPay, Paytm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={settings.upi_id || "8885296645@ybl"}
                      onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
                      placeholder="8885296645@ybl"
                      className="flex-1 rounded-lg border border-blood/50 bg-black/80 p-2.5 text-white font-mono text-sm outline-none focus:border-blood focus:ring-1 focus:ring-blood shadow-[0_0_12px_rgba(200,29,36,0.15)]"
                    />
                    <button
                      type="button"
                      onClick={handleSaveUpiId}
                      disabled={savingUpi}
                      className="rounded-lg bg-blood px-4 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-white hover:bg-blood/90 transition-all cursor-pointer shrink-0 disabled:opacity-50 flex items-center gap-1.5 shadow-[0_0_15px_rgba(200,29,36,0.3)]"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>{savingUpi ? "Saving..." : upiSuccess ? "✓ Updated!" : "Update UPI"}</span>
                    </button>
                  </div>
                  {upiSuccess && (
                    <p className="mt-1 text-[11px] text-emerald-400 font-mono font-bold animate-in fade-in">
                      ✓ Merchant UPI ID updated! All customer payment QR codes are now routing to {settings.upi_id}.
                    </p>
                  )}
                  <p className="mt-1 text-[10px] text-white/50">
                    All customer QR codes and UPI deep links will dynamically route payments to this UPI address.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase text-white/50 mb-1">PhonePe Merchant ID</label>
                    <input
                      type="text"
                      value={settings.phonepe_merchant_id || "PGTESTPAYUAT"}
                      onChange={(e) => setSettings({ ...settings, phonepe_merchant_id: e.target.value })}
                      placeholder="PGTESTPAYUAT"
                      className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-white/50 mb-1">Gateway Environment</label>
                    <select
                      value={settings.phonepe_env || "UAT"}
                      onChange={(e) => setSettings({ ...settings, phonepe_env: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood font-mono text-xs"
                    >
                      <option value="UAT">UAT Sandbox (Test Environment)</option>
                      <option value="PRODUCTION">Production (Live Hermes)</option>
                      <option value="SIMULATED">Simulated Mode (Local Mock)</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-[10px] space-y-1 text-white/60">
                  <div className="text-white/80 font-bold uppercase">PhonePe Webhook Endpoint:</div>
                  <code className="text-blood select-all block bg-black/80 p-1.5 rounded border border-white/5">
                    POST /api/v1/payments/phonepe/webhook
                  </code>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                WHATSAPP CHAT & FLOATING BUTTON REDIRECTION PANEL
            ═══════════════════════════════════════════════════════════ */}
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#25D366] flex items-center gap-2">
                  <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
                  <span>WhatsApp Floating Chat & Redirection Settings</span>
                </h4>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#25D366] bg-[#25D366]/10 border border-[#25D366]/30 px-2 py-0.5 rounded-full font-bold">
                  Frontend Dynamic Sync
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block uppercase text-white/70 font-bold text-xs">
                      WhatsApp Destination Number <span className="text-[#25D366]">*</span>
                    </label>
                    <span className="text-[10px] text-white/40 font-mono">10-Digit Mobile / Country Code Included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={settings.whatsapp_phone_number || "6305729867"}
                      onChange={(e) => setSettings({ ...settings, whatsapp_phone_number: e.target.value })}
                      placeholder="6305729867"
                      className="flex-1 rounded-lg border border-[#25D366]/50 bg-black/80 p-2.5 text-white font-mono text-sm outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] shadow-[0_0_12px_rgba(37,211,102,0.15)]"
                    />
                    <button
                      type="button"
                      onClick={handleSaveWhatsApp}
                      disabled={savingWhatsApp}
                      className="rounded-lg bg-[#25D366] px-4 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-black hover:bg-[#20bd5a] transition-all cursor-pointer shrink-0 disabled:opacity-50 flex items-center gap-1.5 shadow-[0_0_15px_rgba(37,211,102,0.3)]"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>{savingWhatsApp ? "Saving..." : whatsappSuccess ? "✓ Updated!" : "Update WhatsApp"}</span>
                    </button>
                  </div>
                  {whatsappSuccess && (
                    <p className="mt-1 text-[11px] text-[#25D366] font-mono font-bold animate-in fade-in">
                      ✓ WhatsApp number updated! All floating chat buttons across the website now redirect to {settings.whatsapp_phone_number}.
                    </p>
                  )}
                  <p className="mt-1 text-[10px] text-white/50">
                    Visitors clicking the floating WhatsApp button on any frontend page will instantly open a chat with this number.
                  </p>
                </div>

                <div>
                  <label className="block uppercase text-white/50 mb-1">Default Pre-filled Inquiry Message</label>
                  <input
                    type="text"
                    value={settings.whatsapp_message || "Hi Detective Zone Team, I have an inquiry."}
                    onChange={(e) => setSettings({ ...settings, whatsapp_message: e.target.value })}
                    placeholder="Hi Detective Zone Team, I have an inquiry about case files."
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-[#25D366] font-sans text-xs"
                  />
                  <div className="mt-2 flex items-center gap-2 font-mono text-[10px] text-white/40">
                    <span>Live Clickable Test Link:</span>
                    <a
                      href={`https://wa.me/${(settings.whatsapp_phone_number || "6305729867").replace(/[^0-9]/g, "").length === 10 ? "91" + (settings.whatsapp_phone_number || "6305729867").replace(/[^0-9]/g, "") : (settings.whatsapp_phone_number || "6305729867").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(settings.whatsapp_message || "Hi Detective Zone Team, I have an inquiry.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#25D366] hover:underline flex items-center gap-1"
                    >
                      <span>wa.me/{settings.whatsapp_phone_number || "6305729867"}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-3">
                Store Shipping Policies
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-white/50 mb-1">Flat Rate Shipping ($)</label>
                  <input
                    type="text"
                    value={settings.shipping_flat_rate || ""}
                    onChange={(e) => setSettings({ ...settings, shipping_flat_rate: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  />
                </div>
                <div>
                  <label className="block uppercase text-white/50 mb-1">Free Shipping Threshold ($)</label>
                  <input
                    type="text"
                    value={settings.free_shipping_threshold || ""}
                    onChange={(e) => setSettings({ ...settings, free_shipping_threshold: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-blood px-5 py-2.5 font-display text-xs font-semibold uppercase tracking-wider text-white hover:bg-blood/90 transition-all shadow-[0_0_20px_rgba(179,18,23,0.35)] disabled:opacity-50 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? "Synchronizing..." : "Save Global Settings"}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Admin Profile & Passcode Update */}
        <div className="lg:col-span-5 space-y-6">
          {/* Admin Identity Info */}
          <div className="rounded-xl border border-white/[0.08] bg-[#070707] p-6 font-mono text-xs">
            <h3 className="font-display text-base font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-blood" />
              <span>Agent Clearance Profile</span>
            </h3>
            <div className="mt-4 space-y-2 text-white/60">
              <div>
                <span className="uppercase text-white/40">Agent Name:</span> {admin?.full_name || "Lead Investigator"}
              </div>
              <div>
                <span className="uppercase text-white/40">Username:</span> {admin?.username || "admin"}
              </div>
              <div>
                <span className="uppercase text-white/40">Email:</span> {admin?.email || "admin@detectivezone.co"}
              </div>
              <div>
                <span className="uppercase text-white/40">Role:</span>{" "}
                <span className="rounded bg-blood/20 text-blood px-2 py-0.5 font-bold uppercase">
                  {admin?.role || "superadmin"}
                </span>
              </div>
            </div>
          </div>

          {/* Change Passcode */}
          <form onSubmit={handleChangePassword} className="rounded-xl border border-white/[0.08] bg-[#070707] p-6 space-y-4 font-mono text-xs">
            <h3 className="font-display text-base font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-blood" />
              <span>Change Clearance Passcode</span>
            </h3>

            {pwdSuccess && (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-300">
                Passcode changed successfully!
              </div>
            )}
            {pwdError && (
              <div className="rounded-lg border border-blood/40 bg-blood/10 p-3 text-red-300">
                {pwdError}
              </div>
            )}

            <div>
              <label className="block uppercase text-white/50 mb-1">Current Passcode</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
              />
            </div>

            <div>
              <label className="block uppercase text-white/50 mb-1">New Passcode</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
              />
            </div>

            <div>
              <label className="block uppercase text-white/50 mb-1">Confirm New Passcode</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-white/10 py-2.5 font-display text-xs font-semibold uppercase tracking-wider text-white hover:bg-blood transition-colors cursor-pointer"
            >
              Update Passcode
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
