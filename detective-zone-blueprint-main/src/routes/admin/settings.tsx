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
  Mail,
  Send,
  RefreshCw,
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
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [smtpDiag, setSmtpDiag] = useState<any | null>(null);

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

  const handleTestSmtp = async () => {
    try {
      setTestingSmtp(true);
      const diag = await api.adminTestEmail();
      setSmtpDiag(diag);
    } catch (err: any) {
      setSmtpDiag({
        status: "FAILED",
        error: err.message || "Failed to execute SMTP diagnostic test",
        message: err.message || "Failed to execute SMTP diagnostic test",
      });
    } finally {
      setTestingSmtp(false);
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
      const payload = { ...settings };
      if (payload.featured_kit_price) {
        payload.featured_kit_price = String(payload.featured_kit_price).replace(/,/g, "").replace(/[^0-9.]/g, "");
      }
      const updated = await api.bulkUpdateSettings(payload);
      setSettings((prev) => ({ ...prev, ...updated }));

      // Sync Product 1 and Case 1 if featured_kit_price was provided
      if (payload.featured_kit_price) {
        const numPrice = parseFloat(payload.featured_kit_price);
        if (!isNaN(numPrice) && numPrice > 0) {
          api.updateProduct(1, { price: numPrice, sale_price: numPrice }).catch(() => {});
          api.updateCase(1, { price: numPrice }).catch(() => {});
        }
      }

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
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#B31217]" />
                  <span>Cases Page — Case Statistics CMS</span>
                </h4>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#B31217] bg-[#B31217]/10 border border-[#B31217]/30 px-2 py-0.5 rounded-full font-bold">
                  Cases Dashboard Sync
                </span>
              </div>
              <p className="text-[11px] text-white/50 mb-3">
                Customize the 4 statistics metric cards displayed at the bottom of the Cases page (/cases). Leave count blank to use dynamic system count.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Metric 1 */}
                <div className="p-3 bg-black/40 border border-white/5 rounded-lg space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#B31217] font-bold">Card 1: Total Cases</span>
                  <div>
                    <label className="block uppercase text-white/50 text-[10px] mb-1">Count / Value</label>
                    <input
                      type="text"
                      value={settings.stats_total_cases || ""}
                      onChange={(e) => setSettings({ ...settings, stats_total_cases: e.target.value })}
                      placeholder="e.g. 06 (or blank for auto count)"
                      className="w-full rounded-lg border border-white/10 bg-black/60 p-2 text-white font-mono text-xs outline-none focus:border-blood"
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-white/50 text-[10px] mb-1">Card Label</label>
                    <input
                      type="text"
                      value={settings.stats_total_cases_label || ""}
                      onChange={(e) => setSettings({ ...settings, stats_total_cases_label: e.target.value })}
                      placeholder="Total Cases"
                      className="w-full rounded-lg border border-white/10 bg-black/60 p-2 text-white font-mono text-xs outline-none focus:border-blood"
                    />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="p-3 bg-black/40 border border-white/5 rounded-lg space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#B31217] font-bold">Card 2: Unsolved</span>
                  <div>
                    <label className="block uppercase text-white/50 text-[10px] mb-1">Count / Value</label>
                    <input
                      type="text"
                      value={settings.stats_unsolved_cases || ""}
                      onChange={(e) => setSettings({ ...settings, stats_unsolved_cases: e.target.value })}
                      placeholder="e.g. 04 (or blank for auto count)"
                      className="w-full rounded-lg border border-white/10 bg-black/60 p-2 text-white font-mono text-xs outline-none focus:border-blood"
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-white/50 text-[10px] mb-1">Card Label</label>
                    <input
                      type="text"
                      value={settings.stats_unsolved_cases_label || ""}
                      onChange={(e) => setSettings({ ...settings, stats_unsolved_cases_label: e.target.value })}
                      placeholder="Unsolved"
                      className="w-full rounded-lg border border-white/10 bg-black/60 p-2 text-white font-mono text-xs outline-none focus:border-blood"
                    />
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="p-3 bg-black/40 border border-white/5 rounded-lg space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#B31217] font-bold">Card 3: Completed</span>
                  <div>
                    <label className="block uppercase text-white/50 text-[10px] mb-1">Count / Value</label>
                    <input
                      type="text"
                      value={settings.stats_completed_cases || ""}
                      onChange={(e) => setSettings({ ...settings, stats_completed_cases: e.target.value })}
                      placeholder="e.g. 02 (or blank for auto count)"
                      className="w-full rounded-lg border border-white/10 bg-black/60 p-2 text-white font-mono text-xs outline-none focus:border-blood"
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-white/50 text-[10px] mb-1">Card Label</label>
                    <input
                      type="text"
                      value={settings.stats_completed_cases_label || ""}
                      onChange={(e) => setSettings({ ...settings, stats_completed_cases_label: e.target.value })}
                      placeholder="Completed"
                      className="w-full rounded-lg border border-white/10 bg-black/60 p-2 text-white font-mono text-xs outline-none focus:border-blood"
                    />
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="p-3 bg-black/40 border border-white/5 rounded-lg space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#B31217] font-bold">Card 4: Detectives</span>
                  <div>
                    <label className="block uppercase text-white/50 text-[10px] mb-1">Count / Value</label>
                    <input
                      type="text"
                      value={settings.stats_detectives_count || ""}
                      onChange={(e) => setSettings({ ...settings, stats_detectives_count: e.target.value })}
                      placeholder="10K+"
                      className="w-full rounded-lg border border-white/10 bg-black/60 p-2 text-white font-mono text-xs outline-none focus:border-blood"
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-white/50 text-[10px] mb-1">Card Label</label>
                    <input
                      type="text"
                      value={settings.stats_detectives_label || ""}
                      onChange={(e) => setSettings({ ...settings, stats_detectives_label: e.target.value })}
                      placeholder="Detectives"
                      className="w-full rounded-lg border border-white/10 bg-black/60 p-2 text-white font-mono text-xs outline-none focus:border-blood"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-blood" />
                  <span>Classified Dispatch (Footer Newsletter) CMS</span>
                </h4>
                <span className="font-mono text-[9px] uppercase tracking-wider text-blood bg-blood/10 border border-blood/30 px-2 py-0.5 rounded-full font-bold">
                  Footer Live Sync
                </span>
              </div>
              <p className="text-[11px] text-white/50 mb-3">
                Customize the newsletter & clearance request box in the website footer. All submitted emails are delivered straight to your Admin Contact & Inquiries Inbox.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-white/50 text-[10px] mb-1">Badge / Kicker</label>
                  <input
                    type="text"
                    value={settings.dispatch_kicker || ""}
                    onChange={(e) => setSettings({ ...settings, dispatch_kicker: e.target.value })}
                    placeholder="CLASSIFIED DISPATCH"
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white font-mono text-xs outline-none focus:border-blood"
                  />
                </div>
                <div>
                  <label className="block uppercase text-white/50 text-[10px] mb-1">Headline Title</label>
                  <input
                    type="text"
                    value={settings.dispatch_title || ""}
                    onChange={(e) => setSettings({ ...settings, dispatch_title: e.target.value })}
                    placeholder="RECEIVE NEW CASE FILES"
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white font-mono text-xs outline-none focus:border-blood"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block uppercase text-white/50 text-[10px] mb-1">Description Subtitle</label>
                  <input
                    type="text"
                    value={settings.dispatch_description || ""}
                    onChange={(e) => setSettings({ ...settings, dispatch_description: e.target.value })}
                    placeholder="Get notified as soon as new investigations, physical crime scene kits, and clues drop."
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white font-sans text-xs outline-none focus:border-blood"
                  />
                </div>
                <div>
                  <label className="block uppercase text-white/50 text-[10px] mb-1">Input Placeholder</label>
                  <input
                    type="text"
                    value={settings.dispatch_placeholder || ""}
                    onChange={(e) => setSettings({ ...settings, dispatch_placeholder: e.target.value })}
                    placeholder="AGENT@DETECTIVESZONE.CO"
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white font-mono text-xs outline-none focus:border-blood"
                  />
                </div>
                <div>
                  <label className="block uppercase text-white/50 text-[10px] mb-1">Button Action Text</label>
                  <input
                    type="text"
                    value={settings.dispatch_button_text || ""}
                    onChange={(e) => setSettings({ ...settings, dispatch_button_text: e.target.value })}
                    placeholder="REQUEST CLEARANCE"
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white font-mono text-xs outline-none focus:border-blood"
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
                  <label className="block uppercase text-white/50 mb-1">Flat Rate Shipping (₹)</label>
                  <input
                    type="text"
                    value={settings.shipping_flat_rate || ""}
                    onChange={(e) => setSettings({ ...settings, shipping_flat_rate: e.target.value })}
                    placeholder="99"
                    className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-white outline-none focus:border-blood"
                  />
                </div>
                <div>
                  <label className="block uppercase text-white/50 mb-1">Free Shipping Threshold (₹)</label>
                  <input
                    type="text"
                    value={settings.free_shipping_threshold || ""}
                    onChange={(e) => setSettings({ ...settings, free_shipping_threshold: e.target.value })}
                    placeholder="1499"
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

          {/* SMTP Email Diagnostics Card */}
          <div className="rounded-xl border border-white/[0.08] bg-[#070707] p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Mail className="h-4 w-4 text-blood" />
                <span>SMTP Mail Telemetry</span>
              </h3>
              <span className="font-mono text-[9px] uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">
                Gmail Provider
              </span>
            </div>

            <div className="space-y-2 text-white/70">
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-white/40 uppercase">Merchant User:</span>
                <span className="text-white font-bold font-mono">detectiveszonesupport@gmail.com</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-white/40 uppercase">Server & Port:</span>
                <span className="text-white font-mono">smtp.gmail.com : 587 (TLS)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-white/40 uppercase">Sender Header:</span>
                <span className="text-white font-mono">Detectives Zone</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTestSmtp}
              disabled={testingSmtp}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blood/20 border border-blood/50 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-white hover:bg-blood hover:border-blood transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(179,18,23,0.2)]"
            >
              {testingSmtp ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Testing SMTP Handshake...</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Test SMTP Email Connection</span>
                </>
              )}
            </button>

            {smtpDiag && (
              <div
                className={`p-3.5 rounded-lg border text-xs space-y-1.5 animate-in fade-in ${
                  smtpDiag.status === "SUCCESS"
                    ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-300"
                    : "border-red-500/40 bg-red-950/20 text-red-300"
                }`}
              >
                <div className="flex items-center gap-2 font-bold uppercase text-[11px]">
                  {smtpDiag.status === "SUCCESS" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                  )}
                  <span>Status: {smtpDiag.status}</span>
                </div>
                <p className="text-[11px] leading-relaxed font-sans text-white/90">
                  {smtpDiag.message || smtpDiag.error}
                </p>
                {smtpDiag.smtp_user && (
                  <div className="pt-2 text-[10px] text-white/50 border-t border-white/10 font-mono">
                    User: {smtpDiag.smtp_user} | Host: {smtpDiag.smtp_host}:{smtpDiag.smtp_port}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
