import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  MapPin,
  CreditCard,
  QrCode,
  Truck,
  ArrowRight,
  ChevronLeft,
  Lock,
  Phone,
  Mail,
  User,
  Check,
  AlertCircle,
  Package,
  Clock,
  ShieldCheck,
  Send,
  Radio,
  CheckCircle,
  Copy,
  ExternalLink,
  RefreshCw,
  XCircle,
  MessageCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

interface PaymentData {
  merchant_transaction_id: string;
  order_id: number;
  order_number: string;
  amount: number;
  currency: string;
  upi_id: string;
  qr_payload: string;
  qr_image_url: string;
  payment_url?: string;
  status: string;
  expires_in_seconds: number;
}

function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, totalCount } = useCart();
  const navigate = useNavigate();

  // Step state machine: cart -> checkout -> upi_qr -> confirmed / failed
  const [step, setStep] = useState<"cart" | "checkout" | "upi_qr" | "payment_processing" | "confirmed" | "failed">("cart");

  // Guest Delivery Details Form
  const [deliveryForm, setDeliveryForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  // Payment Method: UPI (Default) or COD
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "COD">("UPI");

  // Active Order & PhonePe Transaction State
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null);
  const [activeOrderNumber, setActiveOrderNumber] = useState<string>("");
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes session
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Status & Verification state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyNotice, setVerifyNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  const pollingTimerRef = useRef<any>(null);

  // Financial calculations
  const shippingFee = subtotal > 0 ? (subtotal >= 1499 ? 0 : 99) : 0;
  const finalTotal = Math.max(0, subtotal + shippingFee);

  // 10-Minute Countdown timer for active payment QR
  useEffect(() => {
    let timer: any;
    if (step === "upi_qr" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && step === "upi_qr") {
      setErrorMessage("Payment session timed out. Please initiate a new payment transaction.");
      setStep("failed");
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  // ═══════════════════════════════════════════════════════════════════
  // AUTOMATIC SERVER-SIDE PAYMENT STATUS POLLING (Every 3.5 seconds)
  // ═══════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (step !== "upi_qr" || !paymentData?.merchant_transaction_id) {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
      return;
    }

    let isPolling = true;

    const pollPaymentStatus = async () => {
      try {
        const resp = await api.getPaymentStatus(paymentData.merchant_transaction_id);

        if (!isPolling) return;

        if (resp.payment_status === "PAID" || resp.order_status === "PAYMENT_CONFIRMED") {
          // Backend verified payment! Stop polling and confirm order.
          if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
          isPolling = false;
          clearCart();
          setConfirmedOrder(resp);
          setStep("confirmed");
        } else if (resp.payment_status === "FAILED" || resp.payment_status === "EXPIRED") {
          if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
          isPolling = false;
          setErrorMessage(resp.message || "Payment attempt failed or was declined.");
          setStep("failed");
        }
      } catch (e) {
        // Continue polling silently on transient network errors
      }
    };

    // Initial check + interval polling
    pollPaymentStatus();
    pollingTimerRef.current = setInterval(pollPaymentStatus, 3500);

    return () => {
      isPolling = false;
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, [step, paymentData]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCopyUpi = () => {
    const upiToCopy = paymentData?.upi_id || "8885296645@ybl";
    navigator.clipboard.writeText(upiToCopy);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // ─── STEP 1 -> STEP 2: Initiate Checkout & Register PhonePe Payment ───
  const handleProceedFromCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Address Validations
    if (!deliveryForm.name.trim()) {
      setErrorMessage("Please enter your Full Name.");
      return;
    }
    if (!deliveryForm.email.trim() || !deliveryForm.email.includes("@")) {
      setErrorMessage("Please enter a valid Email Address for order confirmation.");
      return;
    }
    if (!deliveryForm.phone.trim() || deliveryForm.phone.trim().length < 8) {
      setErrorMessage("Please enter a valid Phone Number for shipment updates.");
      return;
    }
    if (!deliveryForm.address.trim()) {
      setErrorMessage("Please enter your complete Street Address & Flat/House Number.");
      return;
    }
    if (!deliveryForm.city.trim()) {
      setErrorMessage("Please enter your City.");
      return;
    }
    if (!deliveryForm.state.trim()) {
      setErrorMessage("Please enter your State.");
      return;
    }
    if (!deliveryForm.pincode.trim()) {
      setErrorMessage("Please enter your 6-digit Postal PIN Code.");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Create order in database with PENDING status
      const orderPayload = {
        customer_name: deliveryForm.name.trim(),
        customer_email: deliveryForm.email.trim(),
        customer_phone: deliveryForm.phone.trim(),
        shipping_address: deliveryForm.address.trim(),
        city: deliveryForm.city.trim(),
        state: deliveryForm.state.trim(),
        postal_code: deliveryForm.pincode.trim(),
        country: deliveryForm.country.trim() || "India",
        payment_method: paymentMethod,
        items: items.map((item) => ({
          product_id: typeof item.productId === "number" ? item.productId : (typeof item.id === "number" ? item.id : null),
          item_title: item.title || "Detective Case Box",
          sku: item.caseNumber || "DZ-CASE",
          image_url: item.image || "",
          unit_price: Number(item.price) || 999,
          quantity: Number(item.quantity) || 1,
        })),
      };

      const currentOrder = await api.createOrder(orderPayload);
      if (currentOrder?.id) {
        setActiveOrderId(currentOrder.id);
        setActiveOrderNumber(currentOrder.order_number);
      }

      if (paymentMethod === "UPI") {
        // 2. Register PhonePe payment transaction with unique merchant_transaction_id
        const pData = await api.createPaymentTransaction({
          order_id: currentOrder.id,
          payment_method: "UPI",
        });

        setPaymentData(pData);
        setTimeLeft(pData.expires_in_seconds || 600);
        setVerifyNotice(null);
        setStep("upi_qr");
      } else if (paymentMethod === "COD") {
        // Cash on Delivery direct flow — order already auto-confirmed by backend on creation
        const verifiedOrder = await api.processOrderPayment(currentOrder.id, {
          payment_method: "COD",
        });
        setConfirmedOrder(verifiedOrder);
        clearCart();
        setStep("confirmed");
      }
    } catch (err: any) {
      const msg = typeof err === "string" ? err : (err?.message || JSON.stringify(err));
      setErrorMessage(typeof msg === "string" ? msg : "Failed to initiate payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── MANUAL "I've Completed Payment" VERIFICATION TRIGGER ───
  // CRITICAL: Does NOT confirm on client. Directly checks backend status!
  const handleManualVerificationCheck = async () => {
    if (!paymentData?.merchant_transaction_id) return;
    try {
      setIsVerifying(true);
      setVerifyNotice(null);

      const resp = await api.getPaymentStatus(paymentData.merchant_transaction_id);

      if (resp.payment_status === "PAID" || resp.order_status === "PAYMENT_CONFIRMED") {
        // Confirmed by backend!
        if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
        clearCart();
        setConfirmedOrder(resp);
        setStep("confirmed");
      } else if (resp.payment_status === "FAILED") {
        setErrorMessage("Payment was reported as failed. Please try again.");
        setStep("failed");
      } else {
        // Still pending
        setVerifyNotice(
          "Payment verification in progress. If you just authorized the UPI transaction in your banking app, please wait 5-10 seconds while the bank settlement confirms."
        );
      }
    } catch (err: any) {
      setVerifyNotice("Connecting to payment verification node. Please retry in a few seconds.");
    } finally {
      setIsVerifying(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════
  // VIEW: CONFIRMED ORDER RECEIPT (Backend Verified ONLY)
  // ═══════════════════════════════════════════════════════════════════
  if (step === "confirmed" && confirmedOrder) {
    const isCod = confirmedOrder.payment_method === "COD";

    return (
      <div className="min-h-screen bg-black pt-28 pb-20 px-4">
        <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-[#080808] p-6 sm:p-10 shadow-[0_0_60px_rgba(0,0,0,0.9)] backdrop-blur-md">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            {isCod ? (
              <div className="space-y-1">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full inline-block">
                  Cash on Delivery Placed
                </span>
                <h1 className="mt-3 font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
                  Order #{confirmedOrder.order_number}
                </h1>
                <p className="mt-2 font-mono text-xs text-white/70 max-w-md mx-auto leading-relaxed">
                  Our dispatch team will contact you to verify delivery prior to dispatch.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full inline-block">
                  ✓ Payment Confirmed & Verified
                </span>
                <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
                  Order #{confirmedOrder.order_number}
                </h1>
                <p className="mt-2 font-mono text-xs text-white/50">
                  Your Detective Zone investigation dossier order is confirmed. A receipt has been dispatched to{" "}
                  <span className="text-white font-bold">{confirmedOrder.customer_email || deliveryForm.email}</span>.
                </p>
              </div>
            )}
          </div>

          {/* Details Box */}
          <div className="mt-8 rounded-xl border border-white/10 bg-black/80 p-6 space-y-3 font-mono text-xs">
            <div className="flex justify-between pb-2 border-b border-white/10">
              <span className="text-white/50">Order Number:</span>
              <span className="text-white font-bold">#{confirmedOrder.order_number}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-white/10">
              <span className="text-white/50">Payment Status:</span>
              <span className="text-emerald-400 font-bold uppercase">
                {isCod ? "PENDING (COD)" : "PAID ✓"}
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-white/10">
              <span className="text-white/50">Payment Gateway:</span>
              <span className="text-white font-bold">
                {confirmedOrder.provider || "PhonePe UPI Gateway"}
              </span>
            </div>
            {(confirmedOrder.merchant_transaction_id || confirmedOrder.transaction_id) && (
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-white/50">Transaction ID:</span>
                <span className="text-white font-mono text-[11px]">
                  {confirmedOrder.merchant_transaction_id || confirmedOrder.transaction_id}
                </span>
              </div>
            )}
            <div className="flex justify-between pb-2 border-b border-white/10">
              <span className="text-white/50">Recipient Name:</span>
              <span className="text-white">{confirmedOrder.customer_name || deliveryForm.name}</span>
            </div>
            <div className="flex justify-between pt-1 text-sm font-bold">
              <span className="text-white/70">Total Amount:</span>
              <span className="text-[#C81D24] font-display text-lg">
                ₹{confirmedOrder.amount || confirmedOrder.total_amount?.toLocaleString() || finalTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`https://wa.me/916305729867?text=${encodeURIComponent(
                `DETECTIVE ZONE — ORDER CONFIRMATION\n============================================================\nOrder Reference: #${confirmedOrder.order_number}\nAgent: ${confirmedOrder.customer_name || deliveryForm.name}\nMode: ${isCod ? "Cash on Delivery (COD)" : "Paid Online"}\nTotal: Rs. ${confirmedOrder.total_amount || confirmedOrder.amount || finalTotal}\n\nPlease share dispatch tracking updates for my order.\n============================================================`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 font-display text-xs font-bold uppercase tracking-wider text-black hover:bg-[#20ba59] transition-all shadow-[0_4px_20px_rgba(37,211,102,0.3)] cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Receive Confirmation on WhatsApp</span>
            </a>
            <Link
              to="/store"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#C81D24] px-6 py-3.5 font-display text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(200,29,36,0.35)] cursor-pointer"
            >
              <Package className="h-4 w-4" />
              <span>Return to Store</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // VIEW: PAYMENT FAILED / TIMED OUT
  // ═══════════════════════════════════════════════════════════════════
  if (step === "failed") {
    return (
      <div className="min-h-screen bg-black pt-28 pb-20 px-4">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-500/30 bg-[#080808] p-8 sm:p-10 shadow-[0_0_60px_rgba(200,29,36,0.25)] text-center space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20 text-red-400 border border-red-500/40">
            <XCircle className="h-8 w-8" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-400 font-bold bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-full inline-block">
            Payment Not Completed
          </span>
          <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-white">
            We Couldn't Confirm Your Payment
          </h2>
          <p className="font-mono text-xs text-white/60 max-w-md mx-auto leading-relaxed">
            {errorMessage || "Your order has NOT been confirmed. No funds were debited, or the payment session timed out."}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setErrorMessage(null);
                setStep("checkout");
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#C81D24] px-6 py-3 font-display text-xs uppercase tracking-widest text-white hover:bg-red-700 transition-all cursor-pointer shadow-[0_0_20px_rgba(200,29,36,0.35)]"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Payment Again</span>
            </button>
            <Link
              to="/cart"
              onClick={() => setStep("cart")}
              className="w-full sm:w-auto font-mono text-xs text-white/60 hover:text-white uppercase tracking-wider py-3 px-4"
            >
              Modify Cart Items
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // VIEW: PRODUCTION-READY PHONEPE UPI QR PAYMENT SCREEN
  // ═══════════════════════════════════════════════════════════════════
  if (step === "upi_qr" && paymentData) {
    const upiIdDisplay = paymentData.upi_id || "8885296645@ybl";

    return (
      <div className="min-h-screen bg-black pt-24 pb-20 px-4">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#C81D24]/40 bg-[#0A0A0A] p-6 sm:p-8 shadow-[0_0_80px_rgba(200,29,36,0.35)] backdrop-blur-xl space-y-6">
          
          {/* Header Strip */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-[#C81D24]/20 border border-[#C81D24]/40 flex items-center justify-center text-[#FF4A50]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold uppercase tracking-wider text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                  PhonePe UPI Gateway
                </h3>
                <span className="font-mono text-[10px] text-white/50 tracking-wider uppercase block">
                  Encrypted Real-Time Settlement Node
                </span>
              </div>
            </div>

            {/* Session Timer */}
            <div className="flex items-center gap-1.5 rounded-full bg-[#C81D24]/20 border border-[#C81D24]/40 px-3 py-1 text-[#FF4A50] font-mono text-xs font-bold animate-pulse">
              <Clock className="h-3.5 w-3.5" />
              <span>Expires in {formatTimer(timeLeft)}</span>
            </div>
          </div>

          {/* Amount Strip */}
          <div className="flex items-center justify-between rounded-xl bg-black/90 border border-white/10 p-4 font-mono">
            <div>
              <span className="text-[10px] uppercase text-white/50 block">Order #{paymentData.order_number}</span>
              <span className="font-display text-3xl font-bold text-[#FF4A50]" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                ₹{paymentData.amount.toLocaleString()}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold inline-block">
                ● Waiting for Payment...
              </span>
              <span className="text-[9px] text-white/40 block mt-1">Auto-checking every 3s</span>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════
              OFFICIAL UPI QR CODE CONTAINER
          ═════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col items-center justify-center space-y-4 bg-black/70 border border-white/15 rounded-2xl p-6 sm:p-8">
            <span className="font-mono text-[11px] uppercase tracking-wider text-white/70 font-semibold flex items-center gap-2">
              <QrCode className="h-4 w-4 text-[#FF4A50]" />
              Scan QR to Complete Payment
            </span>

            {/* QR Card */}
            <div className="relative group p-4 bg-white rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center justify-center min-h-[240px] min-w-[240px]">
              <img
                src={paymentData.qr_image_url}
                alt="PhonePe UPI QR Code"
                className="h-56 w-56 object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://quickchart.io/qr?size=240&text=${encodeURIComponent(paymentData.qr_payload)}`;
                }}
              />
            </div>

            <p className="font-mono text-xs text-white/80 text-center max-w-sm leading-relaxed">
              Open <strong className="text-white">PhonePe</strong>, <strong className="text-white">Google Pay</strong>, <strong className="text-white">Paytm</strong>, or any UPI app on your phone and scan to pay.
            </p>

            {/* UPI ID Badge with 1-Click Copy */}
            <div className="w-full max-w-sm flex items-center justify-between gap-2 rounded-xl border border-white/15 bg-black/90 p-3 font-mono text-xs">
              <div className="min-w-0 flex-1">
                <span className="text-[9px] uppercase text-white/40 block">Merchant UPI ID:</span>
                <span className="text-white font-bold truncate block">{upiIdDisplay}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="flex items-center gap-1.5 rounded-lg border border-[#C81D24]/50 bg-[#C81D24]/20 px-3 py-1.5 text-[11px] font-bold uppercase text-[#FF4A50] hover:bg-[#C81D24]/30 transition-all cursor-pointer shrink-0"
              >
                {copiedUpi ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedUpi ? "Copied!" : "Copy UPI"}</span>
              </button>
            </div>

            {/* Mobile Deep Link Button if User is on Phone */}
            <a
              href={paymentData.qr_payload}
              className="sm:hidden w-full flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/20 p-3 font-mono text-xs text-white hover:bg-white/15 transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5 text-[#FF4A50]" />
              <span>Tap to Open in UPI App</span>
            </a>
          </div>

          {/* Notice Banner */}
          {verifyNotice && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 font-mono text-xs text-amber-300 leading-relaxed animate-in fade-in">
              {verifyNotice}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
                setStep("checkout");
              }}
              className="w-full sm:w-auto font-mono text-xs text-white/50 hover:text-white uppercase tracking-wider py-2 cursor-pointer"
            >
              Cancel / Change Method
            </button>

            {/* "I've Completed Payment" button triggers real status query */}
            <button
              type="button"
              onClick={handleManualVerificationCheck}
              disabled={isVerifying}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#C81D24] px-8 py-3.5 font-display text-xs uppercase tracking-widest text-white hover:bg-red-700 transition-all shadow-[0_0_25px_rgba(200,29,36,0.45)] cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Verifying Transaction...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>I've Completed Payment</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // VIEW: PAYMENT PROCESSING LOADER
  // ═══════════════════════════════════════════════════════════════════
  if (step === "payment_processing") {
    return (
      <div className="min-h-screen bg-black pt-36 pb-20 px-4 text-center">
        <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[#080808] p-10 shadow-2xl">
          <div className="mx-auto mb-6 h-12 w-12 rounded-full border-2 border-[#C81D24] border-t-transparent animate-spin" />
          <h2 className="font-display text-xl uppercase font-bold text-white tracking-wider">
            Confirming Your Order...
          </h2>
          <p className="mt-3 font-mono text-xs text-white/50">
            Securely processing fulfillment and payment details. Please do not close or reload this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/store"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Store
            </Link>
            <h1 className="mt-2 font-display text-2xl sm:text-3xl uppercase font-bold text-white tracking-wider flex items-center gap-3">
              <ShoppingCart className="h-7 w-7 text-[#C81D24]" />
              {step === "checkout" ? "Delivery & Payment Checkout" : "Your Shopping Cart"}
            </h1>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className={`px-3 py-1 rounded-full border transition-colors ${step === "cart" ? "border-[#C81D24] bg-[#C81D24]/20 text-[#FF4A50] font-bold" : "border-white/10 text-white/40"}`}>
              1. Cart Items
            </span>
            <span className="text-white/20">→</span>
            <span className={`px-3 py-1 rounded-full border transition-colors ${step === "checkout" ? "border-[#C81D24] bg-[#C81D24]/20 text-[#FF4A50] font-bold" : "border-white/10 text-white/40"}`}>
              2. Delivery & Payment
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-4 font-mono text-xs text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ─── EMPTY CART STATE ─── */}
        {items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#080808] p-12 sm:p-16 text-center">
            <ShoppingCart className="mx-auto h-12 w-12 text-white/20" />
            <h2 className="mt-4 font-display text-xl uppercase font-bold text-white tracking-wider">Your Cart is Empty</h2>
            <p className="mt-2 font-mono text-xs text-white/50 max-w-sm mx-auto">
              You haven't added any physical case kits or evidence dossiers to your locker yet.
            </p>
            <Link
              to="/store"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#C81D24] px-6 py-3 font-display text-xs uppercase tracking-widest text-white hover:bg-red-700 transition-all cursor-pointer"
            >
              <span>Explore Evidence Store</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ═════════════════════════════════════════════════════════════
                LEFT COLUMN: CART ITEMS (STEP 1) OR CHECKOUT FORM (STEP 2)
            ═════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-8 space-y-6">
              {step === "cart" ? (
                <div className="rounded-2xl border border-white/10 bg-[#080808] p-6 space-y-4">
                  <h3 className="font-display text-sm uppercase font-bold tracking-wider text-white pb-3 border-b border-white/10">
                    Cart Items ({totalCount})
                  </h3>

                  <div className="divide-y divide-white/[0.06]">
                    {items.map((item) => (
                      <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-16 w-16 rounded-xl object-cover border border-white/10 bg-black shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-display text-[10px] font-bold uppercase text-[#FF4A50] tracking-wider">
                              {item.caseNumber}
                            </span>
                            <h4 className="font-display text-sm font-bold uppercase text-white truncate tracking-wide">
                              {item.title}
                            </h4>
                            <span className="font-mono text-xs text-white/50">
                              ₹{item.price.toLocaleString()} each
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between w-full sm:w-auto gap-6 self-stretch sm:self-center">
                          <div className="flex items-center gap-2 border border-white/10 bg-black/60 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              aria-label="Decrease quantity"
                              className="h-6 w-6 flex items-center justify-center text-white/60 hover:text-white cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-mono text-xs font-bold text-white px-2">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              aria-label="Increase quantity"
                              className="h-6 w-6 flex items-center justify-center text-white/60 hover:text-white cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <span className="font-display text-base font-bold text-white">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            title="Remove item"
                            className="text-white/40 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-white/10">
                    <Link
                      to="/store"
                      className="font-mono text-xs text-white/60 hover:text-white inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" /> Continue Shopping
                    </Link>
                    <button
                      onClick={() => setStep("checkout")}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#C81D24] px-6 py-3 font-display text-xs uppercase tracking-widest text-white hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(200,29,36,0.35)] cursor-pointer"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* ─── STEP 2: CHECKOUT (GUEST DELIVERY & PAYMENT SELECTOR) ─── */
                <form onSubmit={handleProceedFromCheckout} className="space-y-6">
                  {/* Delivery Address Form */}
                  <div className="rounded-2xl border border-white/10 bg-[#080808] p-6 space-y-4">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                      <MapPin className="h-4 w-4 text-[#FF4A50]" />
                      <h3 className="font-display text-sm uppercase font-bold tracking-wider text-white">
                        Delivery & Shipping Address
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                      <div>
                        <label className="block text-white/70 mb-1.5 uppercase font-medium">
                          Full Name <span className="text-[#FF4A50]">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                          <input
                            type="text"
                            required
                            value={deliveryForm.name}
                            onChange={(e) => setDeliveryForm({ ...deliveryForm, name: e.target.value })}
                            placeholder="Enter your full name"
                            className="w-full rounded-xl border border-white/15 bg-black/70 py-2.5 pl-9 pr-3 text-white outline-none focus:border-[#C81D24]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/70 mb-1.5 uppercase font-medium">
                          Email Address <span className="text-[#FF4A50]">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                          <input
                            type="email"
                            required
                            value={deliveryForm.email}
                            onChange={(e) => setDeliveryForm({ ...deliveryForm, email: e.target.value })}
                            placeholder="your.email@example.com"
                            className="w-full rounded-xl border border-white/15 bg-black/70 py-2.5 pl-9 pr-3 text-white outline-none focus:border-[#C81D24]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                      <div>
                        <label className="block text-white/70 mb-1.5 uppercase font-medium">
                          Phone Number <span className="text-[#FF4A50]">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                          <input
                            type="tel"
                            required
                            value={deliveryForm.phone}
                            onChange={(e) => setDeliveryForm({ ...deliveryForm, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                            className="w-full rounded-xl border border-white/15 bg-black/70 py-2.5 pl-9 pr-3 text-white outline-none focus:border-[#C81D24]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/70 mb-1.5 uppercase font-medium">
                          PIN Code <span className="text-[#FF4A50]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={deliveryForm.pincode}
                          onChange={(e) => setDeliveryForm({ ...deliveryForm, pincode: e.target.value })}
                          placeholder="e.g. 500081 or 400001"
                          className="w-full rounded-xl border border-white/15 bg-black/70 py-2.5 px-3 text-white outline-none focus:border-[#C81D24]"
                        />
                      </div>
                    </div>

                    <div className="font-mono text-xs">
                      <label className="block text-white/70 mb-1.5 uppercase font-medium">
                        Street Address, Flat / House No., Landmark <span className="text-[#FF4A50]">*</span>
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={deliveryForm.address}
                        onChange={(e) => setDeliveryForm({ ...deliveryForm, address: e.target.value })}
                        placeholder="Flat 101, Galaxy Apartments, Road No. 5, Near City Park"
                        className="w-full rounded-xl border border-white/15 bg-black/70 p-3 text-white outline-none focus:border-[#C81D24] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                      <div>
                        <label className="block text-white/70 mb-1.5 uppercase font-medium">
                          City <span className="text-[#FF4A50]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={deliveryForm.city}
                          onChange={(e) => setDeliveryForm({ ...deliveryForm, city: e.target.value })}
                          placeholder="e.g. Hyderabad, Mumbai, Bangalore"
                          className="w-full rounded-xl border border-white/15 bg-black/70 py-2.5 px-3 text-white outline-none focus:border-[#C81D24]"
                        />
                      </div>

                      <div>
                        <label className="block text-white/70 mb-1.5 uppercase font-medium">
                          State <span className="text-[#FF4A50]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={deliveryForm.state}
                          onChange={(e) => setDeliveryForm({ ...deliveryForm, state: e.target.value })}
                          placeholder="e.g. Telangana, Maharashtra, Karnataka"
                          className="w-full rounded-xl border border-white/15 bg-black/70 py-2.5 px-3 text-white outline-none focus:border-[#C81D24]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="rounded-2xl border border-white/10 bg-[#080808] p-6 space-y-5">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                      <QrCode className="h-4 w-4 text-[#FF4A50]" />
                      <h3 className="font-display text-sm uppercase font-bold tracking-wider text-white">
                        Select Payment Option
                      </h3>
                    </div>

                    {/* Method Selector Tabs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: "UPI", label: "PhonePe / UPI QR", sub: "Scan with PhonePe, GPay, Paytm, Any UPI", icon: QrCode },
                        { id: "COD", label: "Cash on Delivery", sub: "Pay upon physical arrival & verification", icon: Truck },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPaymentMethod(m.id as any)}
                          className={`flex flex-col gap-1 rounded-xl border p-4 text-left font-mono transition-all cursor-pointer ${
                            paymentMethod === m.id
                              ? "border-[#C81D24] bg-[#C81D24]/15 text-white shadow-[0_0_15px_rgba(200,29,36,0.25)]"
                              : "border-white/10 bg-black/40 text-white/60 hover:border-white/20 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <m.icon className={`h-4 w-4 ${paymentMethod === m.id ? "text-[#FF4A50]" : "text-white/40"}`} />
                            <div className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center ${paymentMethod === m.id ? "border-[#C81D24] bg-[#C81D24]" : "border-white/20"}`}>
                              {paymentMethod === m.id && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                            </div>
                          </div>
                          <span className="font-bold text-xs text-white mt-2">{m.label}</span>
                          <span className="text-[10px] text-white/40 leading-tight">{m.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setStep("cart")}
                      className="font-mono text-xs text-white/60 hover:text-white inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" /> Back to Cart
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#C81D24] px-8 py-3.5 font-display text-xs uppercase tracking-widest text-white hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(200,29,36,0.35)] cursor-pointer disabled:opacity-50"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      <span>{isSubmitting ? "Generating Payment Node..." : paymentMethod === "UPI" ? "Proceed to UPI Payment" : "Complete Order"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* ═════════════════════════════════════════════════════════════
                RIGHT COLUMN: ORDER SUMMARY SIDEBAR
            ═════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl border border-white/10 bg-[#080808] p-6 space-y-4 font-mono text-xs">
                <h3 className="font-display text-sm uppercase font-bold tracking-wider text-white pb-3 border-b border-white/10">
                  Order Summary
                </h3>

                <div className="space-y-2.5 text-white/60">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalCount} items)</span>
                    <span className="text-white">₹{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span className={shippingFee === 0 ? "text-emerald-400 font-bold" : "text-white"}>
                      {shippingFee === 0 ? "FREE (Orders > ₹1,499)" : `₹${shippingFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Tax</span>
                    <span className="text-white">Included</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between items-center text-sm font-bold">
                  <span className="text-white">Total Amount</span>
                  <span className="text-[#FF4A50] font-display text-xl">
                    ₹{finalTotal.toLocaleString()}
                  </span>
                </div>

                <div className="pt-2">
                  <div className="rounded-xl border border-white/10 bg-black/60 p-3 space-y-2 text-[10px] text-white/50">
                    <div className="flex items-center gap-2 text-white/80 font-bold">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#FF4A50]" />
                      <span>100% Encrypted & Authenticated</span>
                    </div>
                    <p>
                      Payments verified via PhonePe Gateway with instant order confirmation and dispatch notification.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
