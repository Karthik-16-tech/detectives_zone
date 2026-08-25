import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Shield, ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { S3_MEDIA } from "@/lib/media";
const logo = S3_MEDIA.logo;

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    navigate({ to: "/admin" });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      navigate({ to: "/admin" });
    } catch (err: any) {
      setError(err.message || "Failed to authenticate. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#040404] text-white px-4">
      {/* Background noir grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at center, rgba(179,18,23,0.2) 0%, transparent 65%),
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 40px 40px, 40px 40px",
        }}
      />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#080808]/90 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        {/* Top badge */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blood/50 bg-black">
              <img src={logo} alt="Logo" className="h-6 w-6 object-contain" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold uppercase tracking-[0.18em]">
                Detectives <span className="text-blood">Zone</span>
              </h1>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                Classified CMS Terminal
              </p>
            </div>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blood/10 border border-blood/30">
            <Shield className="h-4 w-4 text-blood" />
          </div>
        </div>

        {/* Security Warning */}
        <div className="my-6 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white/50 flex items-center gap-2.5">
          <Lock className="h-3.5 w-3.5 text-blood shrink-0" />
          <span>Restricted Portal · Clearance Required</span>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-blood/40 bg-blood/10 p-3.5 font-mono text-[11px] text-red-300 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-blood shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2">
              Agent ID / Email
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin@detectivezone.co"
              className="w-full rounded-lg border border-white/15 bg-black/60 px-4 py-3 font-mono text-[12px] text-white placeholder-white/25 outline-none transition-colors focus:border-blood focus:ring-1 focus:ring-blood"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2">
              Passcode
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-white/15 bg-black/60 px-4 py-3 font-mono text-[12px] text-white placeholder-white/25 outline-none transition-colors focus:border-blood focus:ring-1 focus:ring-blood pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blood py-3.5 font-display text-[12px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-blood/90 hover:shadow-[0_0_28px_rgba(179,18,23,0.5)] disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? "Authenticating Clearance..." : "Access Control Terminal"}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </form>

        <div className="mt-6 text-center border-t border-white/[0.06] pt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
          Default: admin@detectivezone.co / detective2026
        </div>
      </div>
    </div>
  );
}
