import React, { useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  ShoppingBag,
  Package,
  ShoppingCart,
  Image as ImageIcon,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Radio,
  Lock,
  Menu,
  X,
  CreditCard,
  QrCode,
  MessageCircle,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { S3_MEDIA } from "@/lib/media";
const logo = S3_MEDIA.logo;

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function AdminLayout({ children, title, subtitle, action }: AdminLayoutProps) {
  const { admin, isAuthenticated, isLoading, logout } = useAdminAuth();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      if (typeof window !== "undefined" && window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white font-mono text-xs uppercase tracking-widest">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-blood animate-ping" />
          <span>Verifying Clearance Credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
    { label: "Case Pages CMS", to: "/admin/pages", icon: FileText },
    { label: "Cases & Dossiers", to: "/admin/cases", icon: FolderOpen },
    { label: "Store Products", to: "/admin/store", icon: ShoppingBag },
    { label: "Case Kits", to: "/admin/kits", icon: Package },
    { label: "Orders & Desk", to: "/admin/orders", icon: ShoppingCart },
    { label: "Payment Gateway", to: "/admin/payments", icon: CreditCard },
    { label: "WhatsApp Panel", to: "/admin/whatsapp", icon: MessageCircle },
    { label: "Contact Inbox", to: "/admin/contact", icon: Mail },
    { label: "Global Settings", to: "/admin/settings", icon: Settings },
  ];

  const isActive = (to: string) => {
    if (to === "/admin") return pathname === "/admin";
    return pathname.startsWith(to);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-[#e0e0e0] font-sans flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-white/[0.08] bg-[#060606] transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col justify-between p-4 sm:p-5">
          {/* Logo & Header */}
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-white/[0.07]">
              <Link to="/admin" className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blood/40 bg-black">
                  <img src={logo} alt="Logo" className="h-6 w-6 object-contain" />
                </div>
                <div>
                  <h1 className="font-display text-[15px] font-bold uppercase tracking-[0.2em] text-white">
                    Detectives <span className="text-blood">CMS</span>
                  </h1>
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">
                    Control Terminal
                  </span>
                </div>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 text-white/50 hover:text-white lg:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation List */}
            <nav className="mt-6 space-y-1.5 font-mono text-[11px] uppercase tracking-[0.16em]">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 transition-all duration-200 ${
                      active
                        ? "bg-blood/15 text-white border border-blood/35 font-semibold"
                        : "text-white/50 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? "text-blood" : "text-white/40"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer User Info & Live Site Link */}
          <div className="border-t border-white/[0.07] pt-5 space-y-3">
            <Link
              to="/"
              target="_blank"
              className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/60 hover:border-blood/40 hover:text-white transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink className="h-3 w-3 text-blood" />
            </Link>

            <div className="flex items-center justify-between rounded-lg bg-black/60 p-3 border border-white/[0.06]">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blood/20 text-blood font-bold text-[11px]">
                  {admin?.username?.charAt(0).toUpperCase() || "A"}
                </div>
                <div className="truncate">
                  <p className="font-mono text-[11px] font-semibold text-white truncate">
                    {admin?.username || "Admin"}
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-white/40">
                    {admin?.role || "Agent"}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 text-white/40 hover:text-blood transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#040404]/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 text-white/60 hover:text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h2 className="font-display text-[18px] font-bold uppercase tracking-[0.14em] text-white leading-none">
                {title}
              </h2>
              {subtitle && (
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>FastAPI Backend Active</span>
            </div>
            {action}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
