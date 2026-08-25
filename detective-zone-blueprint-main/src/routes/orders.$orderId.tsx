import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  ChevronLeft,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Search,
  MessageCircle,
  Check,
} from "lucide-react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/orders/$orderId")({
  component: OrderDetailsPage,
});

function OrderDetailsPage() {
  const { orderId } = useParams({ from: "/orders/$orderId" });
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.lookupOrder(orderId);
      setOrder(data);
    } catch (err: any) {
      setError("Order not found. Please check your order reference number.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: "PAYMENT_CONFIRMED", label: "Payment Confirmed" },
    { key: "ACCEPTED", label: "Order Accepted" },
    { key: "PREPARING", label: "Preparing Dossier" },
    { key: "PACKED", label: "Packed in Sealed Locker" },
    { key: "SHIPPED", label: "Dispatched & In Transit" },
    { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
    { key: "DELIVERED", label: "Delivered to Agent" },
  ];

  const getStepIndex = (status: string) => {
    const map: Record<string, number> = {
      PENDING_PAYMENT: 0,
      PAYMENT_CONFIRMED: 0,
      ACCEPTED: 1,
      PREPARING: 2,
      PACKED: 3,
      SHIPPED: 4,
      OUT_FOR_DELIVERY: 5,
      DELIVERED: 6,
      CANCELLED: -1,
    };
    return map[status] ?? 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-36 pb-20 px-4 text-center font-mono text-xs uppercase tracking-widest text-white/50">
        Locating Order Records...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background pt-28 pb-20 px-4">
        <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-[#080808] p-8 text-center space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h2 className="font-display text-xl uppercase font-bold text-white">Order Not Found</h2>
          <p className="font-mono text-xs text-white/50">{error || "Could not retrieve order details."}</p>
          <div className="pt-2">
            <Link
              to="/store"
              className="inline-flex items-center gap-2 rounded-xl bg-blood px-6 py-2.5 font-display text-xs uppercase tracking-wider text-white hover:bg-blood/90 cursor-pointer"
            >
              <span>Go to Store</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const activeIndex = getStepIndex(order.order_status);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/store"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Store
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/70">
            Order Status: {order.order_status}
          </span>
        </div>

        {/* Order Header Card */}
        <div className="rounded-2xl border border-white/10 bg-[#080808] p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-blood font-bold">
                Official Case Fulfillment
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white mt-1">
                Order #{order.order_number}
              </h1>
              <p className="font-mono text-xs text-white/50 mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            {order.expected_delivery_date && (
              <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 text-left sm:text-right font-mono">
                <span className="text-[10px] uppercase tracking-wider text-sky-400 block font-bold">
                  Expected Delivery
                </span>
                <span className="text-white font-display text-base font-bold">
                  {order.expected_delivery_date}
                </span>
              </div>
            )}
          </div>

          {/* Interactive Status Timeline */}
          {order.order_status !== "CANCELLED" ? (
            <div className="py-6">
              <h3 className="font-display text-xs uppercase font-bold tracking-wider text-white/70 mb-6">
                Fulfillment Timeline
              </h3>
              <div className="relative flex flex-col md:flex-row justify-between gap-4">
                {steps.map((step, idx) => {
                  const isDone = idx <= activeIndex;
                  const isCurrent = idx === activeIndex;
                  return (
                    <div key={step.key} className="flex md:flex-col items-center gap-3 md:text-center flex-1">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-all ${
                          isCurrent
                            ? "bg-blood text-white ring-4 ring-blood/20 shadow-[0_0_15px_rgba(179,18,23,0.6)]"
                            : isDone
                            ? "bg-emerald-500 text-black font-bold"
                            : "bg-white/10 text-white/40 border border-white/10"
                        }`}
                      >
                        {isDone && !isCurrent ? <Check className="h-4 w-4" /> : idx + 1}
                      </div>
                      <div>
                        <span
                          className={`font-display text-[11px] uppercase tracking-wider block font-bold ${
                            isCurrent ? "text-blood" : isDone ? "text-white" : "text-white/30"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 font-mono text-xs text-red-400">
              This order has been cancelled and refunded.
            </div>
          )}
        </div>

        {/* Instant WhatsApp Order Confirmation & Updates Banner */}
        <div className="rounded-2xl border border-[#25D366]/40 bg-gradient-to-r from-[#07180e] via-[#0a2013] to-[#07180e] p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-[0_0_30px_rgba(37,211,102,0.12)]">
          <div className="flex items-center gap-4 text-left">
            <div className="h-12 w-12 rounded-full bg-[#25D366] text-black flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(37,211,102,0.4)]">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold uppercase tracking-wider text-white">
                Receive Order Updates on WhatsApp
              </h3>
              <p className="font-mono text-xs text-white/60 mt-0.5">
                Get real-time tracking alerts, BlueDart shipment updates, and dispatch confirmation directly on your phone.
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/916305729867?text=${encodeURIComponent(
              `DETECTIVE ZONE — ORDER CONFIRMATION\nOrder #${order.order_number}\nAmount: Rs. ${order.total_amount?.toLocaleString()}\nPayment Method: ${order.payment_method}\n\nPlease share dispatch updates on my order.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-display text-xs font-bold uppercase tracking-wider text-black hover:bg-[#20bd5a] transition-all shrink-0 cursor-pointer shadow-[0_4px_16px_rgba(37,211,102,0.3)] hover:scale-105"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Confirm on WhatsApp</span>
          </a>
        </div>

        {/* Details & Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start font-mono text-xs">
          {/* Purchased Items */}
          <div className="md:col-span-8 rounded-2xl border border-white/10 bg-[#080808] p-6 space-y-4">
            <h3 className="font-display text-sm uppercase font-bold tracking-wider text-white pb-3 border-b border-white/10">
              Purchased Evidence Items ({order.items?.length || 0})
            </h3>
            <div className="divide-y divide-white/[0.06]">
              {order.items?.map((item: any) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.item_title}
                        className="h-12 w-12 rounded-lg object-cover border border-white/10 bg-black shrink-0"
                      />
                    )}
                    <div>
                      <span className="font-bold text-white block">{item.item_title}</span>
                      <span className="text-[10px] text-white/40">Qty: {item.quantity} × ₹{item.unit_price?.toLocaleString()}</span>
                    </div>
                  </div>
                  <span className="font-display font-bold text-white">₹{item.total_price?.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2 text-white/60">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">₹{order.subtotal?.toLocaleString()}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-₹{order.discount_amount?.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-white">{order.shipping_fee === 0 ? "FREE" : `₹${order.shipping_fee}`}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 font-bold text-sm text-white">
                <span>{order.payment_method === "COD" ? "Total Payable (On Delivery)" : "Total Amount"}</span>
                <span className="text-blood font-display text-base">₹{order.total_amount?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Info */}
          <div className="md:col-span-4 rounded-2xl border border-white/10 bg-[#080808] p-6 space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-white/50 block mb-1">
                Recipient & Address
              </span>
              <p className="font-bold text-white">{order.customer_name}</p>
              <p className="text-white/70">{order.shipping_address}</p>
              <p className="text-white/70">{order.city}, {order.state} - {order.postal_code}</p>
              <p className="text-white/40">{order.country}</p>
            </div>

            <div className="pt-4 border-t border-white/10">
              <span className="text-[10px] uppercase tracking-wider text-white/50 block mb-1">
                Payment Information
              </span>
              <p className="text-white"><span className="text-white/50">Method:</span> {order.payment_method === "COD" ? "Cash on Delivery" : order.payment_method}</p>
              <p className="text-white">
                <span className="text-white/50">Status:</span>{" "}
                <span className={`font-bold ${order.payment_method === "COD" && order.payment_status !== "SUCCESS" ? "text-amber-400" : "text-emerald-400"}`}>
                  {order.payment_method === "COD" && order.payment_status !== "SUCCESS" ? "Pay on Delivery" : "Confirmed"}
                </span>
              </p>
              {order.payment_method !== "COD" && (
                <p className="text-white/40 text-[10px] truncate mt-1">Txn: {order.transaction_id || "VERIFIED"}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
