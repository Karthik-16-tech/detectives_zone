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
  Banknote,
  Wrench,
  Sparkles,
  Zap,
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
  payment_created_at?: string;
  payment_expires_at?: string;
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

  // Payment Method: COD (Default) or UPI
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "COD">("COD");

  // Active Order & PhonePe Transaction State
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null);
  const [activeOrderNumber, setActiveOrderNumber] = useState<string>("");
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes session
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Status & Verification state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [isSubmittingUtr, setIsSubmittingUtr] = useState(false);
  const [verifyNotice, setVerifyNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);
  const pollingTimerRef = useRef<any>(null);

  const [flatRate, setFlatRate] = useState<number>(0);
  const [freeThreshold, setFreeThreshold] = useState<number>(499);
  const [liveShippingMap, setLiveShippingMap] = useState<Record<string, number>>({});

  useEffect(() => {
    Promise.all([
      api.getSettings().catch(() => ({})),
      api.getCases().catch(() => []),
      api.getProducts().catch(() => []),
    ]).then(([sets, casesData, prodsData]) => {
      if (sets) {
        if (sets.shipping_flat_rate !== undefined && sets.shipping_flat_rate !== "") {
          const val = parseFloat(sets.shipping_flat_rate);
          setFlatRate(isNaN(val) ? 0 : val);
        }
        if (sets.free_shipping_threshold !== undefined && sets.free_shipping_threshold !== "") {
          const val = parseFloat(sets.free_shipping_threshold);
          setFreeThreshold(isNaN(val) ? 499 : val);
        }
      }

      const shipMap: Record<string, number> = {};
      if (casesData && Array.isArray(casesData)) {
        casesData.forEach((c: any) => {
          const num = c.case_number ? c.case_number.replace(/^CASE\s*#?/i, "").trim().padStart(3, "0") : "";
          const fee = c.shipping_fee != null ? Number(c.shipping_fee) : 0;
          if (num) shipMap[num] = fee;
          if (c.slug) shipMap[c.slug.toLowerCase().trim()] = fee;
          if (c.title) shipMap[c.title.toLowerCase().trim()] = fee;
          if (c.id) shipMap[String(c.id)] = fee;
        });
      }
      if (prodsData && Array.isArray(prodsData)) {
        prodsData.forEach((p: any) => {
          const skuNum = p.sku ? p.sku.replace("DZ-KIT-", "").replace("CASE", "").replace("#", "").trim().padStart(3, "0") : "";
          const fee = p.shipping_fee != null ? Number(p.shipping_fee) : (shipMap[skuNum] ?? 0);
          if (skuNum) shipMap[skuNum] = fee;
          if (p.slug) shipMap[p.slug.toLowerCase().trim()] = fee;
          if (p.name) shipMap[p.name.toLowerCase().trim()] = fee;
          if (p.id) shipMap[String(p.id)] = fee;
        });
      }
      setLiveShippingMap(shipMap);
    }).catch(() => {});

    // Check if customer is returning from Razorpay Payment Link / hosted checkout
    const params = new URLSearchParams(window.location.search);
    const rzpPaymentId = params.get("razorpay_payment_id");
    const rzpSign = params.get("razorpay_signature");
    if (rzpPaymentId && rzpSign) {
      setIsVerifying(true);
      const rzpLinkId = params.get("razorpay_payment_link_id") || undefined;
      const rzpLinkRef = params.get("razorpay_payment_link_reference_id") || undefined;
      const rzpLinkStatus = params.get("razorpay_payment_link_status") || undefined;
      const rzpOrderId = params.get("razorpay_order_id") || undefined;
      const parsedOrdId = Number(params.get("order_id") || 0) || undefined;

      api.verifyRazorpayPayment({
        order_id: parsedOrdId,
        razorpay_order_id: rzpOrderId,
        razorpay_payment_id: rzpPaymentId,
        razorpay_signature: rzpSign,
        razorpay_payment_link_id: rzpLinkId,
        razorpay_payment_link_reference_id: rzpLinkRef,
        razorpay_payment_link_status: rzpLinkStatus,
      }).then((verifiedRes) => {
        clearCart();
        setConfirmedOrder(verifiedRes);
        setStep("confirmed");
        setIsVerifying(false);
      }).catch((vErr: any) => {
        setErrorMessage(vErr?.message || "Payment verification failed.");
        setStep("failed");
        setIsVerifying(false);
      });
      return;
    }

    // Check if customer is returning from PhonePe redirect
    const txnId = params.get("merchant_transaction_id") || params.get("transaction_id") || params.get("txn_id");
    const ordNum = params.get("order_number");
    if (txnId) {
      setIsVerifying(true);
      const startTime = Date.now();
      const checkStatus = async () => {
        try {
          const res = await api.getPaymentStatus(txnId);
          if (res.payment_status === "PAID" || res.order_status === "PAYMENT_CONFIRMED") {
            if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
            clearCart();
            setConfirmedOrder(res);
            setStep("confirmed");
            setIsVerifying(false);
            return true;
          } else if (res.payment_status === "FAILED") {
            if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
            setErrorMessage("Payment was not completed on PhonePe. Please try again.");
            setStep("failed");
            setIsVerifying(false);
            return true;
          }
        } catch (e) {
          // Keep polling
        }
        if (Date.now() - startTime > 600000) { // 10 minutes maximum
          if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
          setIsVerifying(false);
          setVerifyNotice("Payment verification window expired. If your account was debited, please contact support with your order number.");
        }
        return false;
      };

      checkStatus();
      pollingTimerRef.current = setInterval(async () => {
        const done = await checkStatus();
        if (done && pollingTimerRef.current) {
          clearInterval(pollingTimerRef.current);
        }
      }, 3500);
    }
  }, []);

  // Helper to determine exact shipping fee for an item (Admin-configured per-case or fallback)
  const getItemShippingFee = (item: any): number => {
    const cleanId = String(item.id || "").replace(/^CASE\s*#?/i, "").trim().padStart(3, "0");
    const cleanCaseNum = String(item.caseNumber || "").replace(/^CASE\s*#?/i, "").trim().padStart(3, "0");
    const cleanTitle = String(item.title || "").toLowerCase().trim();

    if (liveShippingMap[cleanId] !== undefined) return liveShippingMap[cleanId];
    if (liveShippingMap[cleanCaseNum] !== undefined) return liveShippingMap[cleanCaseNum];
    if (liveShippingMap[cleanTitle] !== undefined) return liveShippingMap[cleanTitle];
    if (item.shippingFee !== undefined && item.shippingFee !== null) return Number(item.shippingFee);
    return flatRate;
  };

  // Financial calculations
  const totalItemShipping = items.reduce((sum, item) => sum + (getItemShippingFee(item) * item.quantity), 0);
  const isFreeThresholdMet = freeThreshold > 0 && subtotal >= freeThreshold;
  const baseShippingFee = subtotal > 0 ? (isFreeThresholdMet ? 0 : totalItemShipping) : 0;
  
  // When Cash on Delivery (COD) is selected, apply ₹80 shipping fee; Online prepaid is Free
  const shippingFee = subtotal > 0 ? (paymentMethod === "COD" ? 80 : baseShippingFee) : 0;
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
    const upiToCopy = paymentData?.upi_id || "9492751073-2@ybl";
    navigator.clipboard.writeText(upiToCopy);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Helper to ensure Razorpay checkout.js is loaded
  const loadRazorpaySdk = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof (window as any).Razorpay !== "undefined") {
        return resolve(true);
      }
      const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(true));
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ─── STEP 1 -> STEP 2: Initiate Checkout & Register Razorpay Payment ───
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
        // 2. Initialize official Razorpay Payment Order & Hosted URL
        const rzpData = await api.createRazorpayOrder(currentOrder.id);
        
        if (rzpData.payment_url) {
          // Directly navigate to Razorpay Official Hosted Checkout (100% browser compatible)
          window.location.href = rzpData.payment_url;
          return;
        }

        // Clean up any stale modal containers
        if (typeof document !== "undefined") {
          document.querySelectorAll(".razorpay-container").forEach((el) => el.remove());
        }

        const options = {
          key: rzpData.key_id,
          amount: rzpData.amount_in_paise,
          currency: rzpData.currency || "INR",
          name: "Detectives Zone",
          description: `Order #${rzpData.order_number}`,
          order_id: rzpData.razorpay_order_id,
          prefill: {
            name: deliveryForm.name.trim(),
            email: deliveryForm.email.trim(),
            contact: deliveryForm.phone.trim(),
          },
          theme: {
            color: "#C81D24",
          },
          modal: {
            ondismiss: () => {
              setIsSubmitting(false);
            },
            escape: true,
            backdropclose: false,
          },
          handler: async (response: any) => {
            try {
              setIsSubmitting(true);
              setErrorMessage(null);
              setIsVerifying(true);

              // 3. Cryptographic Signature Verification
              const verifiedRes = await api.verifyRazorpayPayment({
                order_id: currentOrder.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              clearCart();
              setConfirmedOrder(verifiedRes);
              setStep("confirmed");
            } catch (vErr: any) {
              setErrorMessage(vErr?.message || "Payment verification failed. If your account was debited, please contact support.");
              setStep("failed");
            } finally {
              setIsVerifying(false);
              setIsSubmitting(false);
            }
          },
        };

        const isLoaded = await loadRazorpaySdk();
        if (isLoaded && typeof (window as any).Razorpay !== "undefined") {
          const rzpInstance = new (window as any).Razorpay(options);
          rzpInstance.on("payment.failed", (resp: any) => {
            setIsSubmitting(false);
            setErrorMessage(resp.error?.description || "Payment attempt was declined or failed. Please try again.");
          });
          rzpInstance.open();
          return;
        }
        return;
      }

      // Process Cash on Delivery (COD) Order Flow
      const verifiedOrder = await api.processOrderPayment(currentOrder.id, {
        payment_method: "COD",
      });
      setConfirmedOrder(verifiedOrder);
      clearCart();
      setStep("confirmed");
    } catch (err: any) {
      const msg = typeof err === "string" ? err : (err?.message || JSON.stringify(err));
      setErrorMessage(typeof msg === "string" ? msg : "Failed to initiate payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── INSTANT UPI REFERENCE / UTR VERIFICATION ───
  const handleUtrSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!paymentData?.merchant_transaction_id) return;
    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || cleanUtr.length < 6) {
      setVerifyNotice("Please enter your 12-digit UPI Reference / UTR Number from your GPay, PhonePe, or banking app payment receipt.");
      return;
    }
    try {
      setIsSubmittingUtr(true);
      setVerifyNotice(null);
      const resp = await api.submitPaymentUtr(paymentData.merchant_transaction_id, cleanUtr);
      if (resp.payment_status === "PAID" || resp.order_status === "PAYMENT_CONFIRMED") {
        if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
        clearCart();
        setConfirmedOrder(resp);
        setStep("confirmed");
      } else {
        setVerifyNotice(resp.message || "Payment is not confirmed by PhonePe gateway yet. Please complete the transaction on PhonePe.");
      }
    } catch (err: any) {
      setVerifyNotice(err?.message || "Payment not confirmed by PhonePe gateway yet. Please complete the payment on the PhonePe page.");
    } finally {
      setIsSubmittingUtr(false);
    }
  };

  // ─── MANUAL "I've Completed Payment" VERIFICATION TRIGGER ───
  const handleManualVerificationCheck = async () => {
    if (!paymentData?.merchant_transaction_id) return;
    if (utrNumber.trim().length >= 6) {
      return handleUtrSubmit();
    }
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
        // Prompt for UTR
        setVerifyNotice(
          "Payment completed in your UPI app (FamPay / PhonePe / GPay / Paytm)? Please enter the 12-digit UPI Reference / UTR Number from your payment receipt in the box above and click 'Confirm' to finish immediately."
        );
      }
    } catch (err: any) {
      setVerifyNotice("Connecting to payment verification node. Please enter your UTR number above or retry in a few seconds.");
    } finally {
      setIsVerifying(false);
    }
  };

  // ═════════════════════════════════════════════════════════════
  // VIEW: PHONEPE PAYMENT VERIFYING LOADER
  // ═════════════════════════════════════════════════════════════
  if (isVerifying && !confirmedOrder) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20 px-4 flex items-center justify-center">
        <div className="mx-auto max-w-md w-full rounded-2xl border border-white/15 bg-[#0A0A0A] p-8 text-center shadow-[0_0_80px_rgba(200,29,36,0.25)] space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40">
            <RefreshCw className="h-8 w-8 animate-spin" />
          </div>
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-purple-400 font-bold bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-full inline-block">
              Verifying Payment
            </span>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-white">
              Verifying Payment
            </h2>
            <p className="font-mono text-xs text-white/60 leading-relaxed">
              Please wait while we verify your transaction signature with the Razorpay gateway. Please do not close or refresh this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
              <div className="space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full inline-block">
                  ✓ Order Placed Successfully (COD)
                </span>
                <h1 className="mt-3 font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
                  Order #{confirmedOrder.order_number}
                </h1>
                <p className="mt-2 font-mono text-xs text-white/90 max-w-lg mx-auto leading-relaxed font-semibold">
                  Our dispatch team will contact you to verify delivery prior to dispatch.
                </p>
                <div className="mt-3 rounded-xl border border-emerald-500/25 bg-emerald-950/30 p-4 text-left font-mono text-xs text-emerald-200/90 leading-relaxed space-y-1.5 max-w-lg mx-auto">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Instant Email & WhatsApp Dispatched</span>
                  </div>
                  <p className="text-[11px] text-white/80">
                    Your order is being placed! We will update you with all dispatch and tracking details in the next 24 hours. Kindly check your email (<span className="text-white font-bold">{confirmedOrder.customer_email || deliveryForm.email}</span>) and WhatsApp. Thank you for choosing Detectives Zone!
                  </p>
                </div>
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
                  Your Detectives Zone investigation dossier order is confirmed. A receipt has been dispatched to{" "}
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
              <span className={`font-bold uppercase ${isCod ? "text-amber-400" : "text-emerald-400"}`}>
                {isCod ? "PAY ON DELIVERY" : "PAID ✓"}
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-white/10">
              <span className="text-white/50">Payment Method:</span>
              <span className="text-white font-bold">
                {isCod ? "Cash on Delivery (COD)" : (confirmedOrder.provider || "Razorpay Gateway")}
              </span>
            </div>
            {!isCod && (confirmedOrder.razorpay_payment_id || confirmedOrder.merchant_transaction_id || confirmedOrder.transaction_id) && (
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-white/50">Payment ID:</span>
                <span className="text-white font-mono text-[11px]">
                  {confirmedOrder.razorpay_payment_id || confirmedOrder.merchant_transaction_id || confirmedOrder.transaction_id}
                </span>
              </div>
            )}
            <div className="flex justify-between pb-2 border-b border-white/10">
              <span className="text-white/50">Recipient Name:</span>
              <span className="text-white">{confirmedOrder.customer_name || deliveryForm.name}</span>
            </div>
            <div className="flex justify-between pt-1 text-sm font-bold">
              <span className="text-white/70">{isCod ? "Amount Payable:" : "Total Amount:"}</span>
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
              onClick={async () => {
                if (activeOrderId) {
                  try {
                    setIsSubmitting(true);
                    setErrorMessage(null);
                    const rzpData = await api.createRazorpayOrder(activeOrderId);
                    if (rzpData.payment_url) {
                      window.location.href = rzpData.payment_url;
                      return;
                    }
                  } catch (err: any) {
                    setErrorMessage(err?.message || "Failed to restart payment. Please try from checkout.");
                    setStep("checkout");
                  } finally {
                    setIsSubmitting(false);
                  }
                } else {
                  setErrorMessage(null);
                  setStep("checkout");
                }
              }}
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#C81D24] px-6 py-3 font-display text-xs uppercase tracking-widest text-white hover:bg-red-700 transition-all cursor-pointer shadow-[0_0_20px_rgba(200,29,36,0.35)] disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isSubmitting ? "animate-spin" : ""}`} />
              <span>{isSubmitting ? "Launching Razorpay..." : "Try Payment Again"}</span>
            </button>
            <button
              onClick={() => {
                setErrorMessage(null);
                setStep("checkout");
              }}
              className="w-full sm:w-auto font-mono text-xs text-white/60 hover:text-white uppercase tracking-wider py-3 px-4"
            >
              Edit Shipping Address
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // VIEW: PHONEPE HOSTED PAYMENT EXPERIENCE (Matching Reference Image)
  // ═══════════════════════════════════════════════════════════════════
  if (step === "upi_qr" && paymentData) {
    const upiIdDisplay = paymentData.upi_id || "9492751073-2@ybl";

    return (
      <div className="min-h-screen bg-[#0E0E10] pt-24 pb-20 px-4 flex items-center justify-center">
        {/* Main PhonePe Modal Container */}
        <div className="w-full max-w-4xl bg-white text-gray-900 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-gray-100 overflow-hidden">
          
          <div className="flex flex-col md:flex-row min-h-[520px]">
            
            {/* ─── LEFT SIDEBAR: ORDER & MERCHANT INFO ─── */}
            <div className="w-full md:w-5/12 bg-[#F8F9FB] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-200">
              <div className="space-y-6">
                {/* Merchant Badge */}
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600 font-bold text-lg">
                    🛍️
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-gray-800 tracking-wider uppercase block">
                      M23KCK7ZX4MPD
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium block">
                      Order #{paymentData.order_number}
                    </span>
                  </div>
                </div>

                {/* Total Strip */}
                <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs font-medium">Total Amount</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold uppercase">
                      INR
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                      ₹{paymentData.amount.toFixed(2)}
                    </span>
                    <span className="text-gray-400 text-xs font-bold">⌵</span>
                  </div>
                </div>

                {/* Live Settlement Status */}
                <div className="rounded-xl bg-purple-50/80 border border-purple-100 p-3.5 space-y-1 text-xs">
                  <div className="flex items-center gap-2 text-purple-900 font-bold">
                    <span className="h-2 w-2 rounded-full bg-purple-600 animate-ping"></span>
                    <span>Waiting for Payment...</span>
                  </div>
                  <p className="text-purple-700/80 text-[11px] font-mono leading-relaxed">
                    Auto-checking PhonePe settlement every 3.5 seconds.
                  </p>
                </div>
              </div>

              {/* Bottom PhonePe Branding */}
              <div className="pt-6 border-t border-gray-200/60 flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Powered by</span>
                <div className="flex items-center gap-1.5 text-[#5f259f] font-bold">
                  <div className="h-5 w-5 rounded-full bg-[#5f259f] text-white flex items-center justify-center text-[10px] font-extrabold">
                    पे
                  </div>
                  <span>PhonePe</span>
                </div>
              </div>
            </div>

            {/* ─── RIGHT MAIN PANEL: PAYMENT OPTIONS & QR ─── */}
            <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">
                  Payment Options
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                  
                  {/* Left Column: Payment Methods List */}
                  <div className="sm:col-span-5 space-y-4">
                    <div>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                        UPI Payment
                      </span>
                      {/* Active Selected UPI Option */}
                      <div className="rounded-2xl border-2 border-purple-600 bg-purple-50/60 p-3.5 space-y-1 transition-all shadow-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🇮🇳</span>
                          <span className="font-bold text-gray-900 text-sm">UPI</span>
                        </div>
                        <span className="text-[11px] text-gray-500 block leading-tight">
                          Pay via UPI apps, number or ID
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                        Other Methods
                      </span>
                      <div className="space-y-2 text-xs">
                        <div className="rounded-xl border border-gray-200 p-3 flex items-center justify-between text-gray-600 hover:bg-gray-50 transition-all cursor-pointer">
                          <div className="flex items-center gap-2">
                            <span>💳</span>
                            <span className="font-medium">Debit/Credit Card</span>
                          </div>
                          <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400">
                            <span>VISA</span>
                            <span>MC</span>
                          </div>
                        </div>

                        <div className="rounded-xl border border-gray-200 p-3 flex items-center justify-between text-gray-600 hover:bg-gray-50 transition-all cursor-pointer">
                          <div className="flex items-center gap-2">
                            <span>🏛️</span>
                            <span className="font-medium">Net Banking</span>
                          </div>
                          <span className="text-[9px] text-gray-400">50+ Banks</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: PhonePe QR Card */}
                  <div className="sm:col-span-7 bg-[#F9FAFC] border border-gray-200/80 rounded-2xl p-5 flex flex-col items-center text-center space-y-3.5 shadow-sm">
                    
                    <span className="text-xs font-bold text-gray-800 tracking-wide">
                      Scan via any UPI app
                    </span>

                    {/* Supported App Icons Strip */}
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-bold text-[10px]">PhonePe</span>
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold text-[10px]">GPay</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-700 font-bold text-[10px]">Paytm</span>
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-bold text-[10px]">Cred</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px]">BHIM</span>
                    </div>

                    {/* QR Code Container with Center PhonePe Badge */}
                    <div className="relative p-3 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center min-h-[210px] min-w-[210px]">
                      <img
                        src={paymentData.qr_image_url}
                        alt="PhonePe UPI QR Code"
                        className="h-48 w-48 object-contain rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://quickchart.io/qr?size=220&text=${encodeURIComponent(paymentData.qr_payload)}`;
                        }}
                      />
                      {/* Center PhonePe Icon */}
                      <div className="absolute inset-0 m-auto h-8 w-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-[#5f259f] font-extrabold text-xs">
                        पे
                      </div>
                    </div>

                    {/* Expiration Tag matching Reference Image */}
                    <div className="rounded-full bg-gray-200/70 border border-gray-300/60 px-3.5 py-1 text-[11px] font-mono font-semibold text-gray-700 flex items-center gap-1.5 animate-pulse">
                      <Clock className="h-3 w-3 text-purple-700" />
                      <span>This QR will expire in {formatTimer(timeLeft)}</span>
                    </div>

                    {/* 1-Click Copy UPI ID */}
                    <div className="w-full flex items-center justify-between gap-1.5 bg-white border border-gray-200 rounded-xl p-2 font-mono text-[10px] text-gray-600">
                      <span className="truncate font-bold text-gray-800 select-all">{upiIdDisplay}</span>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="px-2 py-1 rounded bg-purple-50 border border-purple-200 text-purple-700 font-bold uppercase text-[9px] hover:bg-purple-100 transition-all shrink-0 cursor-pointer"
                      >
                        {copiedUpi ? "Copied" : "Copy UPI"}
                      </button>
                    </div>
                  </div>

                </div>

                {/* 12-Digit UTR Instant Confirm Box */}
                <div className="mt-4 rounded-xl border border-purple-200 bg-purple-50/40 p-3 flex flex-col sm:flex-row items-center gap-2 text-xs">
                  <div className="flex-1 min-w-0 text-left">
                    <span className="text-[10px] text-purple-900 font-bold block">Paid with UPI App?</span>
                    <span className="text-[9px] text-gray-500 block">Enter 12-digit UTR from your GPay / PhonePe receipt to instant-verify</span>
                  </div>
                  <div className="flex gap-1.5 w-full sm:w-auto shrink-0">
                    <input
                      type="text"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="e.g. 423456789012"
                      className="w-36 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 font-mono text-xs text-gray-800 placeholder:text-gray-400 focus:border-purple-600 focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUtrSubmit();
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleUtrSubmit()}
                      disabled={isSubmittingUtr}
                      className="rounded-lg bg-purple-700 px-3 py-1.5 font-bold text-[11px] uppercase text-white hover:bg-purple-800 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmittingUtr ? <RefreshCw className="h-3 w-3 animate-spin" /> : "Confirm"}
                    </button>
                  </div>
                </div>

                {/* Notice Banner */}
                {verifyNotice && (
                  <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 font-mono text-xs text-amber-900">
                    {verifyNotice}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
                    setStep("checkout");
                  }}
                  className="text-gray-500 hover:text-gray-800 font-medium cursor-pointer"
                >
                  ← Back to Checkout
                </button>
                <button
                  type="button"
                  onClick={handleManualVerificationCheck}
                  disabled={isVerifying}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-5 py-2.5 font-bold text-white hover:bg-black transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isVerifying ? "animate-spin" : ""}`} />
                  <span>{isVerifying ? "Checking Status..." : "I've Completed Payment"}</span>
                </button>
              </div>

            </div>

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
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-xs text-white/50">
                                ₹{item.price.toLocaleString()} each
                              </span>
                              <span className="text-white/20">·</span>
                              <span className={`font-mono text-[10px] uppercase tracking-wider ${getItemShippingFee(item) === 0 ? "text-emerald-400 font-bold" : "text-white/60"}`}>
                                {getItemShippingFee(item) === 0 ? "Free Delivery" : `+₹${getItemShippingFee(item)} Shipping`}
                              </span>
                            </div>
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
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2.5">
                        <CreditCard className="h-4 w-4 text-[#FF4A50]" />
                        <h3 className="font-display text-sm uppercase font-bold tracking-wider text-white">
                          Select Payment Option
                        </h3>
                      </div>
                      <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                        STEP 2 OF 2
                      </span>
                    </div>

                    {/* Method Selector Tabs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Cash on Delivery (COD) - Ultra-Attractive Green Luxury Card */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("COD")}
                        onMouseMove={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
                          e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.setProperty("--mouse-x", `-999px`);
                          e.currentTarget.style.setProperty("--mouse-y", `-999px`);
                        }}
                        style={{
                          background: "radial-gradient(350px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(16, 185, 129, 0.18), transparent 80%), linear-gradient(180deg, #101512 0%, #080a09 100%)",
                        }}
                        className={`group relative flex flex-col justify-between rounded-2xl border p-5 text-left font-mono transition-all duration-300 cursor-pointer overflow-hidden ${
                          paymentMethod === "COD"
                            ? "border-emerald-500/70 shadow-[0_4px_24px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30"
                            : "border-white/10 hover:border-emerald-500/40"
                        }`}
                      >
                        {/* Top Header Row */}
                        <div className="flex items-start justify-between w-full pointer-events-none mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-inner group-hover:scale-105 transition-transform">
                              <Truck className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-display text-sm font-bold uppercase tracking-wider text-white">
                                  Cash on Delivery
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] uppercase font-bold text-emerald-400">
                                  COD Handling
                                </span>
                                <span className="text-[10px] text-white/40">· Doorstep Pay</span>
                              </div>
                            </div>
                          </div>

                          {/* Active Indicator Radio */}
                          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-500/50 bg-emerald-500/20 text-emerald-300">
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                          </div>
                        </div>

                        {/* Price Badge Chip */}
                        <div className="my-2 pointer-events-none">
                          <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                            <Banknote className="h-3.5 w-3.5 text-emerald-400" />
                            <span>+₹80 Courier & COD Fee</span>
                          </div>
                        </div>

                        {/* Footer Reassuring Text */}
                        <p className="text-[10px] text-white/60 leading-relaxed pointer-events-none mt-1">
                          Pay in cash or scan UPI QR directly to the courier executive upon physical dossier delivery.
                        </p>
                      </button>

                      {/* Online Payment (Razorpay UPI / Cards) - UNDER MAINTENANCE (Disabled) */}
                      <button
                        type="button"
                        disabled
                        onMouseMove={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
                          e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.setProperty("--mouse-x", `-999px`);
                          e.currentTarget.style.setProperty("--mouse-y", `-999px`);
                        }}
                        style={{
                          background: "radial-gradient(350px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(234, 179, 8, 0.15), transparent 80%), linear-gradient(180deg, #13120d 0%, #090908 100%)",
                        }}
                        className="relative flex flex-col justify-between rounded-2xl border border-white/10 p-5 text-left font-mono opacity-70 cursor-not-allowed overflow-hidden select-none transition-all duration-300"
                      >
                        {/* Top Header Row */}
                        <div className="flex items-start justify-between w-full pointer-events-none mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-400/80 shadow-inner">
                              <QrCode className="h-5 w-5" />
                            </div>
                            <div>
                              <span className="font-display text-sm font-bold uppercase tracking-wider text-white/80">
                                Online Gateway
                              </span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] uppercase font-bold text-yellow-400/90">
                                  UPI · Cards · NetBanking
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Maintenance Badge */}
                          <div className="flex items-center gap-1 rounded-full border border-yellow-500/40 bg-yellow-500/15 px-2.5 py-1 text-[9px] font-bold uppercase text-yellow-300">
                            <Wrench className="h-3 w-3 animate-spin" style={{ animationDuration: "6s" }} />
                            <span>UPGRADE</span>
                          </div>
                        </div>

                        {/* Status Notice Chip */}
                        <div className="my-2 pointer-events-none">
                          <div className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/25 px-2.5 py-1 text-[11px] font-medium text-yellow-300/90">
                            <Zap className="h-3.5 w-3.5 text-yellow-400" />
                            <span>Under Scheduled Maintenance</span>
                          </div>
                        </div>

                        {/* Footer Notice */}
                        <p className="text-[10px] text-white/40 leading-relaxed pointer-events-none mt-1">
                          Online UPI and payment gateways are undergoing system upgrades. Please complete your order via COD.
                        </p>
                      </button>
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
                      <span>
                        {isSubmitting
                          ? "Initializing Payment..."
                          : paymentMethod === "UPI"
                          ? `Pay ₹${finalTotal.toLocaleString()} with Razorpay`
                          : `Confirm Order (COD: ₹${finalTotal.toLocaleString()})`}
                      </span>
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
                    <span className={shippingFee === 0 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                      {shippingFee === 0 ? "FREE" : `₹${shippingFee} ${paymentMethod === "COD" ? "(COD Charge)" : ""}`}
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
