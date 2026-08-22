import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  QrCode,
  ShieldCheck,
  Save,
  Check,
  Copy,
  RefreshCw,
  AlertCircle,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { api } from "@/lib/api";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin/payments")({
  component: AdminPaymentsPage,
});

interface PaymentSettings {
  upi_id: string;
  phonepe_merchant_id: string;
  phonepe_env: string;
  phonepe_salt_key: string;
  phonepe_salt_index: string;
  enable_upi?: string;
  enable_card?: string;
  enable_cod?: string;
}

function AdminPaymentsPage() {
  const [settings, setSettings] = useState<PaymentSettings>({
    upi_id: "8885296645@ybl",
    phonepe_merchant_id: "PGTESTPAYUAT",
    phonepe_env: "UAT",
    phonepe_salt_key: "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399",
    phonepe_salt_index: "1",
    enable_upi: "true",
    enable_card: "true",
    enable_cod: "true",
  });

  const [savingUpi, setSavingUpi] = useState(false);
  const [savingAll, setSavingAll] = useState(false);
  const [upiSuccess, setUpiSuccess] = useState(false);
  const [allSuccess, setAllSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  // Test amount for QR Preview simulator
  const [previewAmount, setPreviewAmount] = useState<number>(999);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings((prev) => ({
        ...prev,
        ...data,
        upi_id: data["upi_id"] || "8885296645@ybl",
        phonepe_merchant_id: data["phonepe_merchant_id"] || "PGTESTPAYUAT",
        phonepe_env: data["phonepe_env"] || "UAT",
        phonepe_salt_key: data["phonepe_salt_key"] || "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399",
        phonepe_salt_index: data["phonepe_salt_index"] || "1",
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // Instant 1-Click Update for Merchant UPI ID
  const handleSaveUpiOnly = async () => {
    const upi = settings.upi_id.trim();
    if (!upi || !upi.includes("@")) {
      setErrorMessage("Please enter a valid UPI ID (e.g. 8885296645@ybl)");
      return;
    }
    try {
      setSavingUpi(true);
      setErrorMessage(null);
      await api.updateUpiId(upi);
      setUpiSuccess(true);
      setTimeout(() => setUpiSuccess(false), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update UPI ID");
    } finally {
      setSavingUpi(false);
    }
  };

  // Save All Payment Gateway Settings
  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingAll(true);
      setErrorMessage(null);
      const updated = await api.bulkUpdateSettings({
        upi_id: settings.upi_id,
        phonepe_merchant_id: settings.phonepe_merchant_id,
        phonepe_env: settings.phonepe_env,
        phonepe_salt_key: settings.phonepe_salt_key,
        phonepe_salt_index: settings.phonepe_salt_index,
      });
      setSettings((prev) => ({
        ...prev,
        ...updated,
        upi_id: updated["upi_id"] || prev.upi_id,
        phonepe_merchant_id: updated["phonepe_merchant_id"] || prev.phonepe_merchant_id,
        phonepe_env: updated["phonepe_env"] || prev.phonepe_env,
        phonepe_salt_key: updated["phonepe_salt_key"] || prev.phonepe_salt_key,
        phonepe_salt_index: updated["phonepe_salt_index"] || prev.phonepe_salt_index,
      }));
      setAllSuccess(true);
      setTimeout(() => setAllSuccess(false), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save payment gateway settings");
    } finally {
      setSavingAll(false);
    }
  };

  const webhookUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/v1/payments/phonepe/webhook`
    : "https://api.detectiveszone.com/api/v1/payments/phonepe/webhook";

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2500);
  };

  // Dynamic QR Code payload for live preview
  const liveUpiId = settings.upi_id.trim() || "8885296645@ybl";
  const dynamicQrPayload = `upi://pay?pa=${liveUpiId}&pn=Detective%20Zone&tr=PREVIEW_TEST&am=${previewAmount.toFixed(2)}&cu=INR&tn=Detective%20Zone%20Live%20Test`;
  const dynamicQrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(dynamicQrPayload)}`;

  return (
    <AdminLayout
      title="Payment Gateway Control Panel"
      subtitle="Configure PhonePe Gateway, Manage Merchant UPI ID & Live Verification Nodes"
    >
      <div className="space-y-8 font-mono text-xs">
        {/* Status Banners */}
        {errorMessage && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {allSuccess && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-400">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>✓ Payment Gateway settings successfully synchronized and saved to database!</span>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            HERO CARD: ACTIVE MERCHANT UPI ID & LIVE QR TESTER
        ═════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: UPI ID Configuration Form */}
          <div className="lg:col-span-7 rounded-2xl border border-blood/50 bg-[#080808] p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(200,29,36,0.2)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blood/20 border border-blood/40 flex items-center justify-center text-blood">
                  <QrCode className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold uppercase tracking-wider text-white">
                    Merchant UPI ID Manager
                  </h3>
                  <p className="text-[10px] text-white/50">
                    Dynamic settlement receiver for PhonePe, GPay, Paytm & UPI Apps
                  </p>
                </div>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
                Live Active
              </span>
            </div>

            {/* UPI ID Edit Field with Instant 1-Click Update */}
            <div className="space-y-3">
              <label className="block text-white uppercase text-xs font-bold">
                Active Receiver UPI ID <span className="text-blood">*</span>
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    required
                    value={settings.upi_id}
                    onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
                    placeholder="8885296645@ybl"
                    className="w-full rounded-xl border border-blood/60 bg-black/90 px-4 py-3 text-white font-mono text-sm outline-none focus:border-blood focus:ring-1 focus:ring-blood shadow-[0_0_15px_rgba(200,29,36,0.2)]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSaveUpiOnly}
                  disabled={savingUpi}
                  className="rounded-xl bg-blood px-6 py-3 font-display text-xs font-bold uppercase tracking-wider text-white hover:bg-blood/90 transition-all cursor-pointer shrink-0 disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(200,29,36,0.35)]"
                >
                  {savingUpi ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : upiSuccess ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" />
                      <span>✓ Updated!</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Update UPI ID</span>
                    </>
                  )}
                </button>
              </div>

              {upiSuccess && (
                <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-400 text-xs animate-in fade-in flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>
                    Successfully updated! All checkout QR codes and UPI links are now dynamically routed to <strong>{settings.upi_id}</strong>.
                  </span>
                </div>
              )}

              <p className="text-[11px] text-white/50 leading-relaxed pt-1">
                You can change this UPI address at any time. The update takes effect immediately without needing server restarts or rebuilding.
              </p>
            </div>

            {/* Supported UPI Apps Badges */}
            <div className="border-t border-white/10 pt-4 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-white/40 block">
                Compatible Scanning Applications:
              </span>
              <div className="flex flex-wrap gap-2">
                {["PhonePe", "Google Pay (GPay)", "Paytm", "BHIM UPI", "Cred", "Amazon Pay", "Bank Apps"].map((app) => (
                  <span key={app} className="rounded-lg border border-white/10 bg-black/60 px-2.5 py-1 text-[10px] text-white/70">
                    {app}
                  </span>
                ))}
              </div>
            </div>

            {/* Zero Client Trust Security Protocol */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2 text-[10px] text-white/60">
              <div className="flex items-center gap-2 text-white font-bold uppercase text-[11px]">
                <ShieldCheck className="h-4 w-4 text-blood" />
                <span>Zero Client-Side Trust Enforced</span>
              </div>
              <p className="leading-relaxed">
                Orders are never marked paid based on client clicks. The backend checks PhonePe Status API or receives validated webhooks with SHA256 signature verification before marking orders as confirmed and deducting inventory.
              </p>
            </div>
          </div>

          {/* Right: Live Interactive QR Preview Simulator */}
          <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#080808] p-6 text-center space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <QrCode className="h-4 w-4 text-blood" />
                <span>Live QR Code Simulator</span>
              </h4>
              <span className="text-[9px] text-white/40 font-mono">Real-time render</span>
            </div>

            <p className="text-[10px] text-white/60">
              Scan this preview with your phone to test the current UPI ID ({liveUpiId}):
            </p>

            {/* High-Contrast White QR Card */}
            <div className="mx-auto w-fit p-4 bg-white rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center">
              <img
                src={dynamicQrImageUrl}
                alt="Dynamic UPI QR Preview"
                className="h-48 w-48 object-contain rounded-lg"
              />
            </div>

            {/* Test Amount Adjuster */}
            <div className="rounded-xl border border-white/10 bg-black/60 p-3 space-y-2 text-left">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-white/50 uppercase">Test Payload Amount:</span>
                <span className="font-display text-sm font-bold text-blood">₹{previewAmount.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[499, 999, 1499].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setPreviewAmount(amt)}
                    className={`py-1 rounded border text-[10px] font-bold transition-all cursor-pointer ${
                      previewAmount === amt
                        ? "border-blood bg-blood/20 text-white"
                        : "border-white/10 bg-black text-white/50 hover:text-white"
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Encoded UPI String */}
            <div className="text-left space-y-1">
              <span className="text-[9px] uppercase text-white/40 block">Encoded UPI Deep Link:</span>
              <code className="text-[10px] text-white/70 select-all block bg-black/80 p-2 rounded-lg border border-white/5 truncate font-mono">
                {dynamicQrPayload}
              </code>
            </div>
          </div>

        </div>

        {/* ═════════════════════════════════════════════════════════════
            PHONEPE GATEWAY & ENVIRONMENT SETTINGS FORM
        ═════════════════════════════════════════════════════════════ */}
        <form onSubmit={handleSaveAll} className="rounded-2xl border border-white/10 bg-[#080808] p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
                <Sliders className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold uppercase tracking-wider text-white">
                  PhonePe API Credentials & Webhook Listener
                </h3>
                <p className="text-[10px] text-white/50">
                  Configure merchant credentials, secret keys, and webhook callback URLs
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block uppercase text-white/50 mb-1.5 font-bold">
                PhonePe Merchant ID
              </label>
              <input
                type="text"
                value={settings.phonepe_merchant_id}
                onChange={(e) => setSettings({ ...settings, phonepe_merchant_id: e.target.value })}
                placeholder="PGTESTPAYUAT"
                className="w-full rounded-xl border border-white/10 bg-black/70 p-3 text-white outline-none focus:border-blood font-mono text-xs"
              />
            </div>

            <div>
              <label className="block uppercase text-white/50 mb-1.5 font-bold">
                Gateway Environment
              </label>
              <select
                value={settings.phonepe_env}
                onChange={(e) => setSettings({ ...settings, phonepe_env: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/70 p-3 text-white outline-none focus:border-blood font-mono text-xs cursor-pointer"
              >
                <option value="UAT">UAT Sandbox (Test Mode)</option>
                <option value="PRODUCTION">Production (Live Hermes API)</option>
                <option value="SIMULATED">Simulated Mode (Mock Transactions)</option>
              </select>
            </div>

            <div>
              <label className="block uppercase text-white/50 mb-1.5 font-bold">
                Salt Key Index
              </label>
              <input
                type="text"
                value={settings.phonepe_salt_index}
                onChange={(e) => setSettings({ ...settings, phonepe_salt_index: e.target.value })}
                placeholder="1"
                className="w-full rounded-xl border border-white/10 bg-black/70 p-3 text-white outline-none focus:border-blood font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block uppercase text-white/50 mb-1.5 font-bold">
              PhonePe Salt Key / Secret Key
            </label>
            <input
              type="password"
              value={settings.phonepe_salt_key}
              onChange={(e) => setSettings({ ...settings, phonepe_salt_key: e.target.value })}
              placeholder="099eb0cd-02cf-4e2a-8aca-3e6c6aff0399"
              className="w-full rounded-xl border border-white/10 bg-black/70 p-3 text-white outline-none focus:border-blood font-mono text-xs"
            />
          </div>

          {/* Webhook Callback Strip */}
          <div className="rounded-xl border border-white/10 bg-black/60 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white/80 font-bold uppercase text-[11px]">
                PhonePe Server Webhook Endpoint (For PhonePe Merchant Dashboard):
              </span>
              <button
                type="button"
                onClick={handleCopyWebhook}
                className="flex items-center gap-1.5 text-blood hover:text-red-400 transition-colors cursor-pointer text-[10px] font-bold uppercase"
              >
                {copiedWebhook ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedWebhook ? "Copied!" : "Copy Webhook URL"}</span>
              </button>
            </div>
            <code className="text-blood select-all block bg-black p-2.5 rounded-lg border border-white/5 font-mono text-[11px]">
              {webhookUrl}
            </code>
            <p className="text-[10px] text-white/40">
              Provide this endpoint to PhonePe to receive instant payment confirmation callbacks with SHA256 X-VERIFY headers.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingAll}
              className="rounded-xl bg-blood px-8 py-3.5 font-display text-xs font-bold uppercase tracking-wider text-white hover:bg-blood/90 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-[0_0_20px_rgba(200,29,36,0.35)]"
            >
              <Save className="h-4 w-4" />
              <span>{savingAll ? "Saving Configuration..." : "Save All Gateway Settings"}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
