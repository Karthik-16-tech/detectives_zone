import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  X,
  AlertCircle,
  CreditCard,
  QrCode,
  Calendar,
  Eye,
  Check,
  Ban,
  ArrowRight,
  Filter,
  RefreshCw,
  Trash2,
  Mail,
  ShieldCheck,
  Download,
  FileCode,
  Lock,
  Database,
  MessageCircle,
  Edit3,
  Save,
  Phone,
  MapPin,
  User,
} from "lucide-react";
import { api } from "@/lib/api";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  
  // Accept Order Modal State
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [deliveryDateInput, setDeliveryDateInput] = useState("");
  const [acceptNotes, setAcceptNotes] = useState("");
  const [accepting, setAccepting] = useState(false);

  // Edit Order State
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [savingEdit, setSavingEdit] = useState(false);

  // Status Change State
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [exportingJson, setExportingJson] = useState(false);

  const handleStartEdit = (order: any) => {
    setEditFormData({
      customer_name: order.customer_name || "",
      customer_email: order.customer_email || "",
      customer_phone: order.customer_phone || "",
      shipping_address: order.shipping_address || "",
      city: order.city || "",
      state: order.state || "",
      postal_code: order.postal_code || "",
      country: order.country || "India",
      expected_delivery_date: order.expected_delivery_date || "",
      tracking_number: order.tracking_number || "",
      courier_name: order.courier_name || "",
      order_status: order.order_status || "PAYMENT_CONFIRMED",
      payment_status: order.payment_status || "PENDING",
      notes: order.notes || "",
    });
    setIsEditingOrder(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      setSavingEdit(true);
      const updated = await api.adminEditOrder(selectedOrder.id, editFormData);
      setOrders(orders.map((o) => (o.id === updated.id ? updated : o)));
      setSelectedOrder(updated);
      setIsEditingOrder(false);
      showToast(`✓ Order #${updated.order_number} details successfully updated!`);
    } catch (err: any) {
      alert(err.message || "Failed to update order details");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleSendWhatsAppConfirmation = (order: any) => {
    const rawPhone = String(order.customer_phone || "").replace(/\D/g, "");
    const phone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
    const isCod = String(order.payment_method).toUpperCase() === "COD";
    const isAccepted = order.order_status === "ACCEPTED";
    
    let msgText = "";
    if (isAccepted) {
      msgText = `DETECTIVE ZONE — OFFICIAL DISPATCH NOTICE\n============================================================\nCASE DOSSIER ACCEPTED & IN PROCESSING\n\nDear ${order.customer_name},\n\nYour case dossier order #${order.order_number} has been officially accepted and approved by our Central Operations Bureau.\n\nORDER SUMMARY:\n- Dossier Reference: #${order.order_number}\n- Recipient Agent: ${order.customer_name}\n- Status: Accepted & In Forensics Vault Preparation\n- Scheduled Delivery Date: ${order.expected_delivery_date || "Within 3-5 business days"}\n- Delivery Destination: ${order.shipping_address}, ${order.city}\n\nVAULT PACKAGING:\nYour physical evidence dossier is being sealed with tamper-evident tape.\n\nDispatch Helpline: https://wa.me/916305729867\nOfficial Portal: https://detectiveszone.com\n============================================================\nDetective Zone Investigation Bureau © 2026. All Rights Reserved.`;
    } else {
      msgText = `DETECTIVE ZONE — OFFICIAL ORDER CONFIRMATION\n============================================================\nCOMMISSION CONFIRMED: INVESTIGATION DOSSIER\n\nDear ${order.customer_name},\n\nYour investigation dossier order #${order.order_number} has been registered in our archives.\n\nORDER SPECIFICATIONS:\n- Dossier Reference: #${order.order_number}\n- Payment Mode: ${isCod ? "Cash on Delivery (Pay upon delivery)" : "Online / UPI (Verified)"}\n- Total Amount: Rs. ${order.total_amount?.toLocaleString()}\n- Destination: ${order.shipping_address}, ${order.city}\n\n${isCod ? "VERIFICATION PROTOCOL: Our dispatch unit will contact you via WhatsApp/Phone within 24 hours to confirm your address before releasing this physical case file." : "PAYMENT STATUS: Payment verified. Evidence files are in priority vault sealing."}\n\nDispatch Helpline: https://wa.me/916305729867\nOfficial Portal: https://detectiveszone.com\n============================================================\nDetective Zone Investigation Bureau © 2026. All Rights Reserved.`;
    }
    
    const targetUrl = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(msgText)}` : `https://wa.me/916305729867?text=${encodeURIComponent(msgText)}`;
    window.open(targetUrl, "_blank", "noopener,noreferrer");
    showToast(`✓ Official WhatsApp notice prepared for ${order.customer_name} (+${phone || "6305729867"})`);
  };

  const handleExportAllOrdersJson = async () => {
    try {
      setExportingJson(true);
      const data = await api.adminExportAllOrdersJson();
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const today = new Date().toISOString().split("T")[0];
      link.href = url;
      link.download = `detective-zone-classified-orders-backup-${today}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("✓ Confidential Orders JSON Backup Downloaded!");
    } catch (err: any) {
      alert(err.message || "Failed to export orders JSON backup");
    } finally {
      setExportingJson(false);
    }
  };

  const handleExportSingleOrderJson = async (order: any) => {
    try {
      const data = await api.adminExportSingleOrderJson(order.id);
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `dossier-${order.order_number}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`✓ Order #${order.order_number} JSON Dossier Downloaded!`);
    } catch (err: any) {
      alert(err.message || "Failed to export order JSON dossier");
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 10000); // Polling for live orders
    return () => clearInterval(interval);
  }, [statusFilter, search, sortBy]);

  const [testingEmail, setTestingEmail] = useState(false);
  const [emailDiag, setEmailDiag] = useState<any | null>(null);

  const handleTestEmailSystem = async () => {
    try {
      setTestingEmail(true);
      const diag = await api.adminTestEmail();
      setEmailDiag(diag);
    } catch (err: any) {
      alert(err.message || "Failed to run email diagnostic test");
    } finally {
      setTestingEmail(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadOrders = async () => {
    try {
      const data = await api.adminListOrders({
        status: statusFilter,
        search: search || undefined,
        sort_by: sortBy,
      });
      setOrders(data);
    } catch (err: any) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAcceptModal = (order: any) => {
    setSelectedOrder(order);
    // Pre-suggest a delivery date ~5 business days out
    const d = new Date();
    d.setDate(d.getDate() + 5);
    const formatted = d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    setDeliveryDateInput(order.expected_delivery_date || formatted);
    setAcceptNotes("");
    setShowAcceptModal(true);
  };

  const handleAcceptOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryDateInput.trim()) {
      alert("Please provide a valid expected delivery date.");
      return;
    }
    try {
      setAccepting(true);
      const updated = await api.adminAcceptOrder(selectedOrder.id, {
        expected_delivery_date: deliveryDateInput.trim(),
        notes: acceptNotes.trim() || undefined,
      });
      setOrders(orders.map((o) => (o.id === updated.id ? updated : o)));
      setSelectedOrder(updated);
      setShowAcceptModal(false);
      showToast(`Order #${updated.order_number} accepted & confirmation email dispatched to ${updated.customer_email}`);
    } catch (err: any) {
      alert(err.message || "Failed to accept order");
    } finally {
      setAccepting(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedOrder) return;
    try {
      setUpdatingStatus(true);
      const updated = await api.adminUpdateOrderStatus(selectedOrder.id, {
        order_status: newStatus,
      });
      setOrders(orders.map((o) => (o.id === updated.id ? updated : o)));
      setSelectedOrder(updated);
      showToast(`Order #${updated.order_number} status updated to ${newStatus}`);
    } catch (err: any) {
      alert(err.message || "Failed to update order status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;
    if (!window.confirm(`Are you sure you want to cancel order #${selectedOrder.order_number}?`)) return;
    try {
      const updated = await api.adminCancelOrder(selectedOrder.id);
      setOrders(orders.map((o) => (o.id === updated.id ? updated : o)));
      setSelectedOrder(updated);
      showToast(`Order #${updated.order_number} cancelled.`);
    } catch (err: any) {
      alert(err.message || "Failed to cancel order");
    }
  };

  const handleRetryEmail = async (orderId: number) => {
    try {
      const updated = await api.adminRetryOrderEmail(orderId);
      setOrders(orders.map((o) => (o.id === updated.id ? updated : o)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updated);
      }
      showToast(`Confirmation email re-dispatched to ${updated.customer_email}`);
    } catch (err: any) {
      alert(err.message || "Failed to retry sending email");
    }
  };

  const handleDeleteOrder = async (orderId: number, orderNumber: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm(`Are you sure you want to permanently delete order #${orderNumber}?`)) return;
    try {
      await api.adminDeleteOrder(orderId);
      setOrders(orders.filter((o) => o.id !== orderId));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
      showToast(`Order #${orderNumber} permanently deleted.`);
    } catch (err: any) {
      alert(err.message || "Failed to delete order");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAYMENT_CONFIRMED":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-amber-400">● Payment Confirmed</span>;
      case "ACCEPTED":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/15 border border-sky-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-sky-400">✓ Accepted</span>;
      case "PREPARING":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-purple-400">⚙ Preparing</span>;
      case "PACKED":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-blue-400">📦 Packed</span>;
      case "SHIPPED":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-indigo-400">🚚 Shipped</span>;
      case "OUT_FOR_DELIVERY":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/15 border border-teal-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-teal-400">⚡ Out for Delivery</span>;
      case "DELIVERED":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400">✓ Delivered</span>;
      case "CANCELLED":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 border border-red-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-red-400">✕ Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-2.5 py-0.5 font-mono text-[10px] text-white/60">{status}</span>;
    }
  };

  return (
    <AdminLayout
      title="Orders Management"
      subtitle="E-commerce Fulfillment, Payment Confirmation & Delivery Scheduling"
      action={
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportAllOrdersJson}
            disabled={exportingJson}
            className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 font-display text-[11px] font-semibold uppercase tracking-wider text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{exportingJson ? "Exporting..." : "Download Orders JSON Backup"}</span>
          </button>
          <button
            onClick={handleTestEmailSystem}
            disabled={testingEmail}
            className="flex items-center gap-2 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3.5 py-2 font-display text-[11px] font-semibold uppercase tracking-wider text-sky-400 hover:bg-sky-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>{testingEmail ? "Testing..." : "Test SMTP"}</span>
          </button>
          <button
            onClick={loadOrders}
            className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/[0.04] px-3.5 py-2 font-display text-[11px] font-semibold uppercase tracking-wider text-white hover:bg-white/[0.08] transition-all cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      }
    >
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-500/40 bg-[#080808]/95 px-5 py-3 font-mono text-xs text-emerald-400 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-md animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="mb-6 space-y-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "ALL", label: "All Orders" },
            { id: "PAYMENT_CONFIRMED", label: "Payment Confirmed" },
            { id: "ACCEPTED", label: "Accepted" },
            { id: "PREPARING", label: "Preparing" },
            { id: "PACKED", label: "Packed" },
            { id: "SHIPPED", label: "Shipped" },
            { id: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
            { id: "DELIVERED", label: "Delivered" },
            { id: "CANCELLED", label: "Cancelled" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`rounded-lg px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === f.id
                  ? "bg-blood text-white font-bold shadow-[0_0_15px_rgba(179,18,23,0.4)]"
                  : "border border-white/10 bg-[#070707] text-white/50 hover:text-white hover:border-white/20"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order #, Customer, Email, Txn ID..."
              className="w-full rounded-lg border border-white/10 bg-[#070707] py-2.5 pl-10 pr-4 font-mono text-xs text-white placeholder-white/30 outline-none focus:border-blood"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2 font-mono text-xs text-white/60">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-white/10 bg-[#070707] px-3 py-1.5 text-white outline-none focus:border-blood cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
            </div>
            <span className="font-mono text-xs text-white/40">
              {orders.length} orders
            </span>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="py-20 text-center font-mono text-xs uppercase tracking-widest text-white/40">
          Scanning Orders Database...
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#070707] p-12 text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-white/20 mb-3" />
          <h3 className="font-display text-base uppercase text-white font-bold">No Orders Found</h3>
          <p className="font-mono text-xs text-white/40 mt-1">
            Orders placed through the store checkout will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#080808]">
          <table className="w-full text-left font-mono text-xs">
            <thead className="border-b border-white/10 bg-black/60 text-[11px] uppercase tracking-wider text-white/50">
              <tr>
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items & Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status & Delivery</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-white tracking-wide">#{o.order_number}</span>
                    <p className="text-[10px] text-white/40 mt-0.5">
                      {new Date(o.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-white">{o.customer_name}</span>
                    <p className="text-[10px] text-white/40 truncate max-w-[160px]">{o.customer_email}</p>
                    {o.customer_phone && <p className="text-[9px] text-white/30">{o.customer_phone}</p>}
                  </td>
                  <td className="p-4">
                    <span className="font-display font-bold text-blood text-sm">
                      ₹{o.total_amount?.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-white/40 mt-0.5">
                      {o.items?.length || 1} item{o.items?.length !== 1 ? "s" : ""}
                    </p>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-white/80">{o.payment_method || "UPI"}</span>
                    <p className="text-[9px] text-white/40 truncate max-w-[120px]">
                      {o.transaction_id || "TXN-VERIFIED"}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      {getStatusBadge(o.order_status)}
                      {o.expected_delivery_date && (
                        <p className="text-[10px] text-sky-400 flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" /> {o.expected_delivery_date}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {o.order_status === "PAYMENT_CONFIRMED" && (
                        <button
                          onClick={() => handleOpenAcceptModal(o)}
                          className="rounded-lg bg-sky-500/20 border border-sky-500/40 px-2.5 py-1.5 font-display text-[10px] font-bold uppercase tracking-wider text-sky-400 hover:bg-sky-500 hover:text-black transition-colors cursor-pointer"
                        >
                          Accept Order
                        </button>
                      )}
                      {o.order_status === "ACCEPTED" && (
                        <span className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2 py-1 font-mono text-[10px] font-bold text-emerald-400">
                          ✓ Accepted
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendWhatsAppConfirmation(o);
                        }}
                        title="Send Official WhatsApp Confirmation"
                        className="rounded-lg border border-[#25D366]/40 bg-[#25D366]/10 p-1.5 text-[#25D366] hover:bg-[#25D366] hover:text-black transition-colors cursor-pointer"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportSingleOrderJson(o);
                        }}
                        title="Download Confidential JSON Dossier"
                        className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-1.5 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors cursor-pointer"
                      >
                        <FileCode className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="rounded-lg border border-white/15 bg-white/[0.04] px-2.5 py-1.5 font-display text-[10px] font-semibold uppercase tracking-wider text-white hover:bg-white/[0.1] transition-colors cursor-pointer"
                      >
                        View Details
                      </button>
                      <button
                        onClick={(e) => handleDeleteOrder(o.id, o.order_number, e)}
                        title="Delete order permanently"
                        className="rounded-lg border border-red-500/20 bg-red-500/10 p-1.5 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          ORDER DETAIL MODAL
      ═════════════════════════════════════════════════════════════════ */}
      {selectedOrder && !showAcceptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#0a0a0a] p-6 shadow-2xl space-y-6 my-auto font-mono text-xs">
            <div className="sticky top-0 z-10 -mx-6 -mt-6 mb-4 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a]/95 px-6 py-4 backdrop-blur-md">
              <div>
                <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white">
                  Order #{selectedOrder.order_number}
                </h3>
                <p className="text-[10px] text-white/50">
                  Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Acceptance Banner if Accepted */}
            {selectedOrder.order_status === "ACCEPTED" && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2.5">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> ✓ ORDER ACCEPTED
                  </span>
                  {selectedOrder.accepted_at && (
                    <span className="text-[10px] text-emerald-300/70">
                      {new Date(selectedOrder.accepted_at).toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <p><span className="text-white/50">Accepted by:</span> <span className="text-white font-semibold">{selectedOrder.accepted_by || "Admin"}</span></p>
                  <p><span className="text-white/50">Scheduled Delivery:</span> <span className="text-sky-400 font-bold">{selectedOrder.expected_delivery_date || "N/A"}</span></p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-emerald-500/20 pt-2 text-[11px] gap-2">
                  <div className="flex items-center gap-1.5 text-white/70">
                    <span>Notification Sent To:</span>
                    <span className="font-mono text-white font-bold bg-white/10 px-2 py-0.5 rounded border border-white/15">
                      {selectedOrder.customer_email}
                    </span>
                  </div>
                  {selectedOrder.email_status === "FAILED" ? (
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold">⚠ Delivery Pending / Needs App Password</span>
                      <button
                        onClick={() => handleRetryEmail(selectedOrder.id)}
                        className="rounded bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 text-[10px] font-bold text-amber-300 hover:bg-amber-500 hover:text-black transition-colors cursor-pointer"
                      >
                        Retry Email
                      </button>
                    </div>
                  ) : (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> ✓ Confirmation email dispatched to customer
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Status & Actions Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/60 p-4">
              <div>
                <span className="text-[10px] uppercase text-white/50 block mb-1">Current Order Status</span>
                {getStatusBadge(selectedOrder.order_status)}
              </div>
              
              <div className="flex items-center gap-2">
                {selectedOrder.order_status === "PAYMENT_CONFIRMED" && (
                  <button
                    onClick={() => handleOpenAcceptModal(selectedOrder)}
                    className="rounded-lg bg-sky-500 px-4 py-2 font-display text-[11px] font-bold uppercase tracking-wider text-black hover:bg-sky-400 transition-all cursor-pointer"
                  >
                    Accept Order & Schedule Delivery
                  </button>
                )}

                {selectedOrder.order_status !== "PAYMENT_CONFIRMED" && selectedOrder.order_status !== "CANCELLED" && selectedOrder.order_status !== "DELIVERED" && (
                  <select
                    value={selectedOrder.order_status}
                    onChange={(e) => handleUpdateStatus(e.target.value)}
                    disabled={updatingStatus}
                    className="rounded-lg border border-white/20 bg-[#111] px-3 py-2 text-white outline-none focus:border-blood cursor-pointer"
                  >
                    <option value="ACCEPTED">Mark Accepted</option>
                    <option value="PREPARING">Mark Preparing</option>
                    <option value="PACKED">Mark Packed</option>
                    <option value="SHIPPED">Mark Shipped</option>
                    <option value="OUT_FOR_DELIVERY">Mark Out for Delivery</option>
                    <option value="DELIVERED">Mark Delivered</option>
                  </select>
                )}

                {selectedOrder.order_status !== "CANCELLED" && selectedOrder.order_status !== "DELIVERED" && (
                  <button
                    onClick={handleCancelOrder}
                    className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}

                <button
                  onClick={() => handleSendWhatsAppConfirmation(selectedOrder)}
                  className="rounded-lg border border-[#25D366]/50 bg-[#25D366]/15 px-3 py-2 text-[#25D366] hover:bg-[#25D366] hover:text-black transition-colors cursor-pointer flex items-center gap-1.5 font-bold"
                  title="Send official WhatsApp order confirmation to customer"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>Send WhatsApp</span>
                </button>

                <button
                  onClick={() => (isEditingOrder ? setIsEditingOrder(false) : handleStartEdit(selectedOrder))}
                  className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white hover:bg-white/20 transition-colors cursor-pointer flex items-center gap-1.5 font-bold"
                  title="Edit customer, delivery address, or courier details"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>{isEditingOrder ? "Close Editor" : "Edit Details"}</span>
                </button>

                <button
                  onClick={() => handleExportSingleOrderJson(selectedOrder)}
                  className="rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-emerald-300 hover:bg-emerald-500 hover:text-black transition-colors cursor-pointer flex items-center gap-1.5 font-bold"
                  title="Download confidential JSON dossier file"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download JSON Dossier</span>
                </button>

                <button
                  onClick={() => handleDeleteOrder(selectedOrder.id, selectedOrder.order_number)}
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            {/* ═════════════════════════════════════════════════════════════
                EDIT ORDER DOSSIER FORM
            ═════════════════════════════════════════════════════════════ */}
            {isEditingOrder ? (
              <form onSubmit={handleSaveEdit} className="rounded-xl border border-blood/40 bg-blood/5 p-5 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-blood/20 pb-2">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-blood flex items-center gap-2">
                    <Edit3 className="h-4 w-4" />
                    <span>Edit Order Dossier #{selectedOrder.order_number}</span>
                  </span>
                  <span className="text-[10px] text-white/50">All edits sync immediately to database & JSON backup</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-white/60 text-[10px] uppercase font-bold mb-1">Customer Name</label>
                    <input
                      type="text"
                      required
                      value={editFormData.customer_name}
                      onChange={(e) => setEditFormData({ ...editFormData, customer_name: e.target.value })}
                      className="w-full rounded-lg border border-white/20 bg-black/80 p-2 text-white outline-none focus:border-blood"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-[10px] uppercase font-bold mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={editFormData.customer_email}
                      onChange={(e) => setEditFormData({ ...editFormData, customer_email: e.target.value })}
                      className="w-full rounded-lg border border-white/20 bg-black/80 p-2 text-white outline-none focus:border-blood"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-[10px] uppercase font-bold mb-1">Phone Number (WhatsApp)</label>
                    <input
                      type="text"
                      value={editFormData.customer_phone}
                      onChange={(e) => setEditFormData({ ...editFormData, customer_phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full rounded-lg border border-white/20 bg-black/80 p-2 text-white outline-none focus:border-blood"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 text-[10px] uppercase font-bold mb-1">Shipping Address</label>
                  <input
                    type="text"
                    required
                    value={editFormData.shipping_address}
                    onChange={(e) => setEditFormData({ ...editFormData, shipping_address: e.target.value })}
                    className="w-full rounded-lg border border-white/20 bg-black/80 p-2 text-white outline-none focus:border-blood"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-white/60 text-[10px] uppercase font-bold mb-1">City</label>
                    <input
                      type="text"
                      value={editFormData.city}
                      onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                      className="w-full rounded-lg border border-white/20 bg-black/80 p-2 text-white outline-none focus:border-blood"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-[10px] uppercase font-bold mb-1">State</label>
                    <input
                      type="text"
                      value={editFormData.state}
                      onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                      className="w-full rounded-lg border border-white/20 bg-black/80 p-2 text-white outline-none focus:border-blood"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-[10px] uppercase font-bold mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={editFormData.postal_code}
                      onChange={(e) => setEditFormData({ ...editFormData, postal_code: e.target.value })}
                      className="w-full rounded-lg border border-white/20 bg-black/80 p-2 text-white outline-none focus:border-blood"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-[10px] uppercase font-bold mb-1">Country</label>
                    <input
                      type="text"
                      value={editFormData.country}
                      onChange={(e) => setEditFormData({ ...editFormData, country: e.target.value })}
                      className="w-full rounded-lg border border-white/20 bg-black/80 p-2 text-white outline-none focus:border-blood"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-white/10 pt-3">
                  <div>
                    <label className="block text-white/60 text-[10px] uppercase font-bold mb-1">Expected Delivery Date</label>
                    <input
                      type="text"
                      value={editFormData.expected_delivery_date}
                      onChange={(e) => setEditFormData({ ...editFormData, expected_delivery_date: e.target.value })}
                      placeholder="e.g. 24 August 2026"
                      className="w-full rounded-lg border border-white/20 bg-black/80 p-2 text-white outline-none focus:border-blood"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-[10px] uppercase font-bold mb-1">Courier Partner</label>
                    <input
                      type="text"
                      value={editFormData.courier_name}
                      onChange={(e) => setEditFormData({ ...editFormData, courier_name: e.target.value })}
                      placeholder="e.g. BlueDart Express"
                      className="w-full rounded-lg border border-white/20 bg-black/80 p-2 text-white outline-none focus:border-blood"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-[10px] uppercase font-bold mb-1">Tracking Number</label>
                    <input
                      type="text"
                      value={editFormData.tracking_number}
                      onChange={(e) => setEditFormData({ ...editFormData, tracking_number: e.target.value })}
                      placeholder="e.g. BD-89218291"
                      className="w-full rounded-lg border border-white/20 bg-black/80 p-2 text-white outline-none focus:border-blood"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingOrder(false)}
                    className="px-4 py-2 uppercase text-white/60 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="rounded-lg bg-blood px-6 py-2 font-display text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(200,29,36,0.35)]"
                  >
                    <Save className="h-4 w-4" />
                    <span>{savingEdit ? "Saving..." : "Save Dossier Changes"}</span>
                  </button>
                </div>
              </form>
            ) : null}

            {/* Customer & Delivery Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-white/50 block border-b border-white/10 pb-1">
                  Customer Profile
                </span>
                <p><span className="text-white/50">Name:</span> <span className="text-white font-bold">{selectedOrder.customer_name}</span></p>
                <p><span className="text-white/50">Email:</span> <span className="text-white">{selectedOrder.customer_email}</span></p>
                <p><span className="text-white/50">Phone:</span> <span className="text-white">{selectedOrder.customer_phone || "N/A"}</span></p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-white/50 block border-b border-white/10 pb-1">
                  Delivery Destination
                </span>
                <p className="text-white">{selectedOrder.shipping_address}</p>
                <p className="text-white/70">{selectedOrder.city}, {selectedOrder.state} - {selectedOrder.postal_code}</p>
                <p className="text-white/50">{selectedOrder.country}</p>
                {selectedOrder.expected_delivery_date && (
                  <p className="text-sky-400 font-bold pt-1 border-t border-white/10">
                    Scheduled: {selectedOrder.expected_delivery_date}
                  </p>
                )}
                {selectedOrder.tracking_number && (
                  <p className="text-emerald-400 font-mono text-[11px] pt-1">
                    Tracking: {selectedOrder.tracking_number} ({selectedOrder.courier_name || "BlueDart"})
                  </p>
                )}
              </div>
            </div>

            {/* Payment Record */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-blood" />
                  <span>PhonePe Payment Verification Details</span>
                </span>
                <span className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-bold font-mono ${
                  selectedOrder.payment_status === "PAID" || selectedOrder.payment_status === "SUCCESS"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : selectedOrder.payment_status === "FAILED"
                    ? "bg-red-500/10 text-red-400 border border-red-500/30"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                }`}>
                  {selectedOrder.payment_status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-white/40 block text-[10px] uppercase">Gateway Provider</span>
                  <span className="text-white font-bold">PhonePe PG</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px] uppercase">Payment Method</span>
                  <span className="text-white font-bold">{selectedOrder.payment_method || "UPI"}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px] uppercase">Paid Amount</span>
                  <span className="text-blood font-bold font-display text-sm">₹{selectedOrder.total_amount?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px] uppercase">Verification Time</span>
                  <span className="text-white/80 font-mono text-[10px]">
                    {selectedOrder.paid_at ? new Date(selectedOrder.paid_at).toLocaleString() : "Awaiting Settlement"}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-white/40 block text-[10px] uppercase">Merchant Transaction ID</span>
                  <span className="text-white font-mono text-[11px] truncate block select-all bg-black/60 p-1 rounded border border-white/5">
                    {selectedOrder.transaction_id || "N/A"}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-white/40 block text-[10px] uppercase">Provider Reference / UTR</span>
                  <span className="text-white font-mono text-[11px] truncate block select-all bg-black/60 p-1 rounded border border-white/5">
                    {selectedOrder.gateway_reference || "PPE_GATEWAY_NODE"}
                  </span>
                </div>
              </div>
            </div>

            {/* Ordered Products */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
              <span className="text-[10px] uppercase tracking-wider text-white/50 block border-b border-white/10 pb-1">
                Purchased Evidence Kits & Items
              </span>
              <div className="divide-y divide-white/[0.06]">
                {selectedOrder.items?.map((item: any) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">{item.item_title}</span>
                      <p className="text-[10px] text-white/40">Qty: {item.quantity} × ₹{item.unit_price?.toLocaleString()}</p>
                    </div>
                    <span className="font-display font-bold text-white">₹{item.total_price?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm">
                <span className="text-white/70">Total Charged:</span>
                <span className="text-blood font-display text-base">₹{selectedOrder.total_amount?.toLocaleString()}</span>
              </div>
            </div>

            {/* Order Timeline Events */}
            {selectedOrder.events && selectedOrder.events.length > 0 && (
              <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
                <span className="text-[10px] uppercase tracking-wider text-white/50 block border-b border-white/10 pb-1">
                  Order History & Audit Timeline
                </span>
                <div className="space-y-2">
                  {selectedOrder.events.map((ev: any) => (
                    <div key={ev.id} className="flex items-start gap-2.5 text-[11px]">
                      <span className="text-blood">●</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-white">{ev.message}</p>
                        <p className="text-[9px] text-white/40">
                          {new Date(ev.created_at).toLocaleString()} · {ev.performed_by || "System"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          ACCEPT ORDER & SET DELIVERY DATE MODAL
      ═════════════════════════════════════════════════════════════════ */}
      {showAcceptModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-sky-500/30 bg-[#0a0a0a] p-6 shadow-2xl space-y-5 my-auto font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-display text-lg font-bold uppercase tracking-wider text-sky-400">
                  Accept Order #{selectedOrder.order_number}
                </h3>
                <p className="text-[10px] text-white/50">
                  Confirm order acceptance and specify the expected delivery date for the customer.
                </p>
              </div>
              <button
                onClick={() => setShowAcceptModal(false)}
                className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAcceptOrder} className="space-y-4">
              <div>
                <label className="block text-white/70 uppercase text-[11px] mb-1.5 font-bold">
                  Expected Delivery Date *
                </label>
                <input
                  type="text"
                  required
                  value={deliveryDateInput}
                  onChange={(e) => setDeliveryDateInput(e.target.value)}
                  placeholder="e.g. 24 August 2026"
                  className="w-full rounded-lg border border-white/15 bg-black/80 p-2.5 text-white outline-none focus:border-sky-400"
                />
                <div className="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-2.5 text-[11px] text-emerald-300 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Simultaneous Notification Protocol
                  </p>
                  <p className="text-white/70">
                    Accepting this order immediately dispatches an official confirmation <strong>Email</strong> and a <strong>WhatsApp</strong> notification to the customer with this scheduled delivery date.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-white/70 uppercase text-[11px] mb-1.5">
                  Internal Administrative Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={acceptNotes}
                  onChange={(e) => setAcceptNotes(e.target.value)}
                  placeholder="Special instructions, carrier batch ID, or warehouse shelf location..."
                  className="w-full rounded-lg border border-white/15 bg-black/80 p-2.5 text-white outline-none focus:border-sky-400 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAcceptModal(false)}
                  className="px-4 py-2 uppercase text-white/60 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={accepting}
                  className="rounded-lg bg-sky-500 px-6 py-2.5 font-display text-xs uppercase tracking-wider text-black font-bold hover:bg-sky-400 transition-all shadow-[0_0_20px_rgba(14,165,233,0.4)] cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{accepting ? "Accepting..." : "Accept Order & Notify (Email + WhatsApp)"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          SMTP DIAGNOSTIC REPORT MODAL
      ═════════════════════════════════════════════════════════════════ */}
      {emailDiag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-[#0a0a0a] p-6 shadow-2xl space-y-4 my-auto font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Mail className="h-4 w-4 text-sky-400" />
                SMTP Delivery Diagnostics
              </h3>
              <button
                onClick={() => setEmailDiag(null)}
                className="rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className={`rounded-xl border p-4 ${(emailDiag.status === 'SUCCESS' || emailDiag.status === 'CONNECTED') ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-amber-500/40 bg-amber-950/20'}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider">Connection Status:</span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${(emailDiag.status === 'SUCCESS' || emailDiag.status === 'CONNECTED') ? 'bg-emerald-500 text-black' : 'bg-amber-500 text-black'}`}>
                  {(emailDiag.status === 'SUCCESS' || emailDiag.status === 'CONNECTED') ? 'CONNECTED & VERIFIED' : emailDiag.status}
                </span>
              </div>
              <p className="mt-2 text-white/90 font-medium">
                {(emailDiag.status === 'SUCCESS' || emailDiag.status === 'CONNECTED')
                  ? (emailDiag.message || '✓ Gmail SMTP provider accepted connection & test verification email delivered successfully.')
                  : `⚠ ${emailDiag.error || emailDiag.message || 'Connection failed.'}`}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/50 p-4 space-y-2 text-[11px]">
              <p><span className="text-white/50">Host:</span> <span className="text-white font-bold">{emailDiag.smtp_host}:{emailDiag.smtp_port}</span></p>
              <p><span className="text-white/50">Sender (From):</span> <span className="text-white">{emailDiag.smtp_from_email}</span></p>
              <p><span className="text-white/50">Username (User):</span> <span className="text-white">{emailDiag.smtp_user}</span></p>
              <p><span className="text-white/50">Password Set:</span> <span className={emailDiag.smtp_password_configured ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>{emailDiag.smtp_password_configured ? "Configured in .env" : "NOT CONFIGURED"}</span></p>
              <p><span className="text-white/50">TLS / SSL:</span> <span className="text-white">TLS: {String(emailDiag.smtp_use_tls)}, SSL: {String(emailDiag.smtp_use_ssl)}</span></p>
            </div>

            {emailDiag.instructions && (
              <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-3 text-[11px] text-sky-200">
                <strong>Next Step:</strong> {emailDiag.instructions}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setEmailDiag(null)}
                className="rounded-lg bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
