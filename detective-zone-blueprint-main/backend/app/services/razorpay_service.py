import hmac
import hashlib
import logging
from typing import Optional, Dict, Any

try:
    import razorpay
except ImportError:
    razorpay = None

from app.core.config import settings

logger = logging.getLogger("detective_zone.razorpay")


class RazorpayService:
    """
    Production-grade Razorpay Service for creating orders,
    verifying payment signatures, and processing webhooks.
    """

    def __init__(self):
        self.key_id = settings.RAZORPAY_KEY_ID
        self.key_secret = settings.RAZORPAY_KEY_SECRET
        self.webhook_secret = settings.RAZORPAY_WEBHOOK_SECRET
        self._client = None

    @property
    def client(self):
        if not razorpay:
            logger.warning("[RAZORPAY: SDK_MISSING] razorpay package not installed in environment")
            return None
        if not self._client:
            self._client = razorpay.Client(auth=(self.key_id, self.key_secret))
        return self._client

    def create_order(
        self,
        amount: float,
        receipt: str,
        notes: Optional[Dict[str, Any]] = None,
        currency: str = "INR"
    ) -> Dict[str, Any]:
        """
        Creates an official Razorpay Order.
        Amount must be provided in Rupees, automatically converted to paise (integer).
        """
        amount_in_paise = int(round(amount * 100))
        data = {
            "amount": amount_in_paise,
            "currency": currency,
            "receipt": receipt[:40], # Razorpay receipts max 40 chars
            "notes": notes or {},
            "payment_capture": 1 # Auto capture payment
        }

        logger.info(f"[RAZORPAY] Creating order with amount: {amount_in_paise} paise, receipt: {receipt}")
        order = self.client.order.create(data=data)
        logger.info(f"[RAZORPAY] Order created successfully: {order.get('id')}")
        return order

    def create_payment_link(
        self,
        amount: float,
        order_number: str,
        customer_name: Optional[str] = None,
        customer_email: Optional[str] = None,
        customer_phone: Optional[str] = None,
        callback_url: Optional[str] = None,
        notes: Optional[Dict[str, Any]] = None,
        currency: str = "INR"
    ) -> Dict[str, Any]:
        """
        Creates an official Razorpay Dynamic Payment Link (QR & UPI hosted checkout).
        """
        amount_in_paise = int(round(amount * 100))
        data = {
            "amount": amount_in_paise,
            "currency": currency,
            "accept_partial": False,
            "description": f"Investigation Dossier #{order_number}",
            "customer": {
                "name": (customer_name or "Guest Customer")[:40],
                "email": customer_email or "guest@detectiveszone.com",
                "contact": customer_phone or "+919999999999"
            },
            "notify": {
                "sms": False,
                "email": False
            },
            "reminder_enable": False,
            "notes": notes or {},
            "callback_method": "get"
        }
        if callback_url:
            data["callback_url"] = callback_url

        logger.info(f"[RAZORPAY] Creating payment link for order {order_number} ({amount_in_paise} paise)")
        link = self.client.payment_link.create(data=data)
        logger.info(f"[RAZORPAY] Payment link created: {link.get('short_url')}")
        return link

    def verify_payment_signature(
        self,
        razorpay_order_id: str,
        razorpay_payment_id: str,
        razorpay_signature: str
    ) -> bool:
        """
        Cryptographically verifies the Razorpay payment signature
        using HMAC SHA256 against RAZORPAY_KEY_SECRET.
        """
        try:
            params_dict = {
                "razorpay_order_id": razorpay_order_id,
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature
            }
            self.client.utility.verify_payment_signature(params_dict)
            logger.info(f"[RAZORPAY] Signature verified successfully for payment {razorpay_payment_id}")
            return True
        except razorpay.errors.SignatureVerificationError as e:
            logger.warning(f"[RAZORPAY] Signature verification failed: {e}")
            return False
        except Exception as e:
            logger.error(f"[RAZORPAY] Unexpected error verifying signature: {e}")
            return False

    def verify_payment_link_signature(
        self,
        razorpay_payment_id: str,
        razorpay_payment_link_id: str,
        razorpay_payment_link_reference_id: Optional[str] = None,
        razorpay_payment_link_status: Optional[str] = "paid",
        razorpay_signature: str = ""
    ) -> bool:
        """
        Cryptographically verifies Razorpay Payment Link signature.
        """
        try:
            params_dict = {
                "payment_link_id": razorpay_payment_link_id,
                "payment_link_reference_id": razorpay_payment_link_reference_id or "",
                "payment_link_status": razorpay_payment_link_status or "paid",
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature
            }
            self.client.utility.verify_payment_link_signature(params_dict)
            logger.info(f"[RAZORPAY] Payment link signature verified for {razorpay_payment_id}")
            return True
        except Exception as e:
            logger.warning(f"[RAZORPAY] Payment link signature verification failed: {e}")
            return False

    def verify_webhook_signature(
        self,
        body_bytes: bytes,
        signature: str,
        secret: Optional[str] = None
    ) -> bool:
        """
        Verifies Razorpay Webhook signature using webhook secret.
        """
        webhook_sec = secret or self.webhook_secret
        if not webhook_sec:
            logger.warning("[RAZORPAY WEBHOOK] No webhook secret configured.")
            return False

        try:
            expected_signature = hmac.new(
                webhook_sec.encode("utf-8"),
                body_bytes,
                hashlib.sha256
            ).hexdigest()
            return hmac.compare_digest(expected_signature, signature)
        except Exception as e:
            logger.error(f"[RAZORPAY WEBHOOK] Error verifying webhook signature: {e}")
            return False

    def fetch_payment(self, payment_id: str) -> Optional[Dict[str, Any]]:
        """
        Fetches payment status directly from Razorpay API.
        """
        try:
            return self.client.payment.fetch(payment_id)
        except Exception as e:
            logger.error(f"[RAZORPAY] Error fetching payment {payment_id}: {e}")
            return None


razorpay_service = RazorpayService()
