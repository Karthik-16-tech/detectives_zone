import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  ArrowRight,
  ChevronLeft,
  Scan,
  Sparkles,
  Lock,
  Phone,
  Mail,
  User,
  Building,
  Home,
  Check,
  Copy,
} from "lucide-react";
import caseVoicemail from "@/assets/case-voicemail.png";

import { useCart } from "@/context/CartContext";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

export function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  // Customer Form State with pre-filled defaults for instant 1-click checkout
  const [formData, setFormData] = useState({
    name: "Detective Agent",
    email: "agent@detectivezone.com",
    phone: "+91 98765 43210",
    address: "221B Baker Street, Mystery Towers",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    location: "Mumbai, Maharashtra, India (Verified)",
  });

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cod">("upi");
  const [isLocating, setIsLocating] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [scannedVerified, setScannedVerified] = useState(false);

  const shipping = subtotal > 0 ? (subtotal >= 1499 ? 0 : 99) : 0;
  const total = Math.max(0, subtotal - discount + shipping);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === "DETECTIVE10" || coupon.trim().toUpperCase() === "NOIR") {
      const disc = Math.round(subtotal * 0.1);
      setDiscount(disc);
      setCouponApplied(true);
      setCouponError("");
    } else if (coupon.trim()) {
      setCouponError("Invalid promo code. Try 'DETECTIVE10'");
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText("detectivezone@upi");
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCompleted(true);
  };

  const handleAutoLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({
            ...prev,
            location: `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)} (GPS Verified)`,
          }));
          setIsLocating(false);
        },
        () => {
          setFormData((prev) => ({
            ...prev,
            location: "Connaught Place, New Delhi, India (Default)",
          }));
          setIsLocating(false);
        },
      );
    } else {
      setIsLocating(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-background pt-28 pb-20 px-4">
        <div className="mx-auto max-w-2xl text-center rounded-2xl border border-blood/40 bg-card/90 p-8 sm:p-12 shadow-[0_0_50px_rgba(179,18,23,0.2)]">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-blood/20 text-blood">
            <CheckCircle2 className="size-10" />
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-blood">Case Order Confirmed</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl uppercase font-bold text-foreground">
            Your Investigation Kit is Dispatched
          </h1>
          <p className="mt-3 font-mono text-sm text-muted-foreground">
            Order #DZ-{Math.floor(100000 + Math.random() * 900000)} has been successfully logged.
          </p>

          <div className="mt-8 rounded-xl border border-border bg-surface/80 p-6 text-left font-mono text-xs space-y-2">
            <p><span className="text-muted-foreground">Customer:</span> {formData.name}</p>
            <p><span className="text-muted-foreground">Email:</span> {formData.email}</p>
            <p><span className="text-muted-foreground">Address:</span> {formData.address}, {formData.city} - {formData.pincode}</p>
            <p><span className="text-muted-foreground">Payment Method:</span> {paymentMethod.toUpperCase()} (VERIFIED)</p>
            <p className="pt-2 border-t border-border/60 text-blood font-bold text-sm">Total Paid: ₹{total.toLocaleString()}</p>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/cases"
              className="inline-flex items-center gap-2 rounded-lg bg-blood px-6 py-3 font-display text-xs uppercase tracking-widest text-white hover:bg-blood/90 transition-colors"
            >
              Start Online Case Files <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header Breadcrumb */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/store"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="size-4" /> Back to Store
            </Link>
            <h1 className="mt-2 font-display text-2xl sm:text-4xl uppercase font-bold text-foreground tracking-wider flex items-center gap-3">
              <ShoppingCart className="size-8 text-blood" /> Checkout & Cart
            </h1>
          </div>
          <span className="self-start sm:self-auto font-mono text-xs uppercase tracking-widest text-muted-foreground bg-surface border border-border px-3 py-1.5 rounded-full">
            Shopify Checkout Node
          </span>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <ShoppingCart className="mx-auto size-12 text-muted-foreground" />
            <h2 className="mt-4 font-display text-xl uppercase font-bold">Your Cart is Empty</h2>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              Select a physical evidence kit or case file to proceed.
            </p>
            <Link
              to="/store"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blood px-6 py-2.5 font-display text-xs uppercase tracking-widest text-white hover:bg-blood/90"
            >
              Explore Evidence Store
            </Link>
          </div>
        ) : (
          <form onSubmit={handleCompleteOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Cart Items + Customer Details */}
            <div className="lg:col-span-7 space-y-8">
              {/* Cart Items List */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
                <h2 className="font-display text-lg uppercase font-bold tracking-wider text-foreground mb-4 flex items-center justify-between">
                  <span>Selected Case Kits ({items.length})</span>
                  <span className="font-mono text-xs text-muted-foreground font-normal">Step 1 of 2</span>
                </h2>

                <div className="divide-y divide-border/60">
                  {items.map((item) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="size-20 rounded-lg object-cover border border-border/80 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-blood font-bold">
                          {item.caseNumber}
                        </span>
                        <h3 className="font-display text-base font-semibold text-foreground truncate">
                          {item.title}
                        </h3>
                        <p className="font-mono text-xs text-muted-foreground mt-0.5">{item.type}</p>
                        <p className="font-mono text-sm font-bold text-foreground mt-1">
                          ₹{item.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="flex items-center rounded-lg border border-border bg-surface">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="px-3 font-mono text-xs font-bold text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-muted-foreground hover:text-blood transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Details Form */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-lg space-y-4">
                <h2 className="font-display text-lg uppercase font-bold tracking-wider text-foreground flex items-center gap-2">
                  <User className="size-5 text-blood" /> Shipping & Customer Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        placeholder="Detective John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-lg border border-border bg-surface pl-10 pr-3 py-2 font-mono text-xs text-foreground focus:border-blood focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <input
                        type="email"
                        required
                        placeholder="agent@detectivezone.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-lg border border-border bg-surface pl-10 pr-3 py-2 font-mono text-xs text-foreground focus:border-blood focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-lg border border-border bg-surface pl-10 pr-3 py-2 font-mono text-xs text-foreground focus:border-blood focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Pincode *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        placeholder="400001"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full rounded-lg border border-border bg-surface pl-10 pr-3 py-2 font-mono text-xs text-foreground focus:border-blood focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Street Address / House No *
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      placeholder="Flat 4B, Mystery Towers, Baker Street"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full rounded-lg border border-border bg-surface pl-10 pr-3 py-2 font-mono text-xs text-foreground focus:border-blood focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="Mumbai"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-xs text-foreground focus:border-blood focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      placeholder="Maharashtra"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-xs text-foreground focus:border-blood focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      GPS / Location Verification
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoLocation}
                      disabled={isLocating}
                      className="inline-flex items-center gap-1 font-mono text-[10px] text-blood hover:underline uppercase"
                    >
                      <MapPin className="size-3" /> {isLocating ? "Locating..." : "Auto Detect Location"}
                    </button>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={formData.location}
                    className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 font-mono text-xs text-muted-foreground cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary + Payment & Scanner */}
            <div className="lg:col-span-5 space-y-6">
              {/* Payment Scanner & Method Selection */}
              <div className="rounded-2xl border border-blood/30 bg-card p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Scan className="size-32 text-blood" />
                </div>

                <h2 className="font-display text-lg uppercase font-bold tracking-wider text-foreground mb-4 flex items-center gap-2">
                  <QrCode className="size-5 text-blood" /> Payment Method & QR Scanner
                </h2>

                {/* Tabs */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`py-2 px-2 rounded-lg font-mono text-xs uppercase text-center border transition-all ${
                      paymentMethod === "upi"
                        ? "border-blood bg-blood/10 text-foreground font-bold"
                        : "border-border bg-surface text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    UPI / QR Scan
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`py-2 px-2 rounded-lg font-mono text-xs uppercase text-center border transition-all ${
                      paymentMethod === "card"
                        ? "border-blood bg-blood/10 text-foreground font-bold"
                        : "border-border bg-surface text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Card / Net
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`py-2 px-2 rounded-lg font-mono text-xs uppercase text-center border transition-all ${
                      paymentMethod === "cod"
                        ? "border-blood bg-blood/10 text-foreground font-bold"
                        : "border-border bg-surface text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    COD
                  </button>
                </div>

                {/* QR Scanner Display for UPI */}
                {paymentMethod === "upi" && (
                  <div className="rounded-xl border border-border bg-surface p-4 text-center space-y-3">
                    <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      Scan QR Code to Pay instantly
                    </p>

                    {/* Animated QR Code Graphic */}
                    <div className="relative mx-auto size-44 rounded-xl border-2 border-blood/60 bg-white p-3 shadow-inner flex flex-col items-center justify-center">
                      <div className="size-full bg-contain bg-no-repeat bg-center" style={{ backgroundImage: "url('https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=detectivezone@upi&pn=DetectiveZone&am=999')" }} />
                      <div className="absolute inset-0 border-2 border-dashed border-blood/40 rounded-xl pointer-events-none animate-pulse" />
                    </div>

                    <div className="flex items-center justify-center gap-2 font-mono text-xs text-foreground bg-card border border-border py-1.5 px-3 rounded-lg">
                      <span className="text-muted-foreground">UPI ID:</span>
                      <span className="font-bold">detectivezone@upi</span>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="text-blood hover:text-blood/80 ml-1"
                        title="Copy UPI ID"
                      >
                        {copiedUpi ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                      </button>
                    </div>

                    <p className="font-mono text-[10px] text-muted-foreground">
                      Accepts Google Pay, PhonePe, Paytm, BHIM & all UPI apps
                    </p>

                    <button
                      type="button"
                      onClick={() => setScannedVerified(true)}
                      className={`w-full py-2 rounded-lg font-mono text-xs uppercase tracking-wider border transition-colors flex items-center justify-center gap-2 ${
                        scannedVerified
                          ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-bold"
                          : "border-border bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {scannedVerified ? (
                        <>
                          <CheckCircle2 className="size-4 text-emerald-400" /> Payment QR Verified
                        </>
                      ) : (
                        <>
                          <Scan className="size-4 text-blood" /> Simulate Payment Scan
                        </>
                      )}
                    </button>
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="space-y-3 font-mono text-xs">
                    <input
                      type="text"
                      placeholder="Card Number (4000 0000 0000 0000)"
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-foreground focus:border-blood focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-foreground focus:border-blood focus:outline-none"
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-foreground focus:border-blood focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <div className="p-3 rounded-lg border border-border bg-surface font-mono text-xs text-muted-foreground">
                    Cash on Delivery available across 19,000+ Indian pincodes. Pay when your case box arrives.
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
                <h2 className="font-display text-lg uppercase font-bold tracking-wider text-foreground">
                  Order Summary
                </h2>

                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo Code (DETECTIVE10)"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 font-mono text-xs text-foreground uppercase focus:border-blood focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-surface border border-border px-4 py-2 font-mono text-xs uppercase font-bold text-foreground hover:bg-border transition-colors"
                  >
                    Apply
                  </button>
                </form>

                {couponApplied && (
                  <p className="font-mono text-xs text-emerald-400 flex items-center gap-1">
                    <Sparkles className="size-3.5" /> 10% Detective Discount Applied!
                  </p>
                )}
                {couponError && <p className="font-mono text-xs text-blood">{couponError}</p>}

                <div className="border-t border-border pt-4 space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                  </div>
                  <div className="border-t border-border/80 pt-3 flex justify-between text-sm font-bold text-foreground">
                    <span>Total Amount</span>
                    <span className="text-blood text-base">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-blood py-3.5 font-display text-sm uppercase tracking-widest text-white shadow-lg shadow-blood/30 hover:bg-blood/90 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Lock className="size-4" /> Place Order & Pay ₹{total.toLocaleString()}
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="pt-2 flex items-center justify-center gap-4 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="size-3 text-emerald-400" /> SSL 256-Bit Encrypted
                  </span>
                  <span className="flex items-center gap-1">
                    <Truck className="size-3 text-blood" /> Dispatched in 24 Hrs
                  </span>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
