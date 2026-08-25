import os
import json
import base64
import hashlib
import urllib.request
import urllib.error
import urllib.parse
from datetime import datetime
from typing import Dict, Any, Optional, Tuple

from app.core.config import settings

class PhonePeService:
    def __init__(
        self,
        merchant_id: Optional[str] = None,
        salt_key: Optional[str] = None,
        salt_index: Optional[str] = None,
        env: Optional[str] = None,
        callback_url: Optional[str] = None,
    ):
        self.merchant_id = merchant_id or settings.PHONEPE_MERCHANT_ID
        self.salt_key = salt_key or settings.PHONEPE_SALT_KEY
        self.salt_index = str(salt_index or settings.PHONEPE_SALT_INDEX)
        self.env = (env or settings.PHONEPE_ENV).upper()
        self.callback_url = callback_url or settings.PHONEPE_CALLBACK_URL

        if self.env == "PRODUCTION":
            self.base_url = "https://api.phonepe.com/apis/hermes"
        else:
            # Preprod / Sandbox
            self.base_url = "https://api-preprod.phonepe.com/apis/pg-sandbox"

    def generate_checksum(self, base64_payload: str, endpoint: str) -> str:
        """
        Calculates PhonePe standard SHA256 checksum:
        SHA256(base64_payload + endpoint + salt_key) + "###" + salt_index
        """
        raw_string = f"{base64_payload}{endpoint}{self.salt_key}"
        sha256_hash = hashlib.sha256(raw_string.encode("utf-8")).hexdigest()
        return f"{sha256_hash}###{self.salt_index}"

    def generate_status_checksum(self, endpoint: str) -> str:
        """
        Calculates PhonePe status check SHA256 checksum:
        SHA256(endpoint + salt_key) + "###" + salt_index
        """
        raw_string = f"{endpoint}{self.salt_key}"
        sha256_hash = hashlib.sha256(raw_string.encode("utf-8")).hexdigest()
        return f"{sha256_hash}###{self.salt_index}"

    def verify_webhook_checksum(self, response_base64: str, received_x_verify: str) -> bool:
        """
        Verifies PhonePe Webhook X-VERIFY signature:
        SHA256(response_base64 + salt_key) + "###" + salt_index
        """
        if not received_x_verify:
            return False
        raw_string = f"{response_base64}{self.salt_key}"
        sha256_hash = hashlib.sha256(raw_string.encode("utf-8")).hexdigest()
        expected_x_verify = f"{sha256_hash}###{self.salt_index}"
        return expected_x_verify.strip() == received_x_verify.strip()

    def generate_upi_qr_string(
        self,
        merchant_upi_id: str,
        merchant_transaction_id: str,
        order_number: str,
        amount: float,
        merchant_name: str = "Detective Zone"
    ) -> Tuple[str, str]:
        """
        Generates standard UPI deep link / QR string:
        upi://pay?pa=...&pn=...&tr=...&am=...&cu=INR&tn=...
        Returns (upi_string, qr_image_url)
        """
        pa = merchant_upi_id.strip()
        pn = urllib.parse.quote(merchant_name.strip())
        tr = merchant_transaction_id.strip()
        am = f"{amount:.2f}"
        tn = urllib.parse.quote(f"Detective Zone Order {order_number}")
        
        upi_string = f"upi://pay?pa={pa}&pn={pn}&tr={tr}&am={am}&cu=INR&tn={tn}"
        qr_image_url = f"https://api.qrserver.com/v1/create-qr-code/?size=320x320&data={urllib.parse.quote(upi_string)}&bgcolor=ffffff&color=000000&margin=2"
        return upi_string, qr_image_url

    def create_payment_request(
        self,
        merchant_transaction_id: str,
        order_number: str,
        amount: float,
        customer_id: str,
        customer_phone: Optional[str] = None,
        redirect_url: Optional[str] = None,
        merchant_upi_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Builds official PhonePe payment creation payload and generates standard UPI QR.
        """
        active_upi = merchant_upi_id or settings.DEFAULT_UPI_ID
        amount_in_paise = int(round(amount * 100))

        payload = {
            "merchantId": self.merchant_id,
            "merchantTransactionId": merchant_transaction_id,
            "merchantUserId": f"CUST_{customer_id}",
            "amount": amount_in_paise,
            "redirectUrl": redirect_url or f"http://localhost:5173/cart?merchant_transaction_id={merchant_transaction_id}&order_number={order_number}",
            "redirectMode": "REDIRECT",
            "callbackUrl": self.callback_url,
            "mobileNumber": (customer_phone or "9999999999").replace("+91", "").replace(" ", "")[-10:],
            "paymentInstrument": {
                "type": "PAY_PAGE"
            }
        }

        payload_json = json.dumps(payload)
        base64_payload = base64.b64encode(payload_json.encode("utf-8")).decode("utf-8")
        checksum = self.generate_checksum(base64_payload, "/pg/v1/pay")

        # Generate direct UPI QR string
        upi_string, qr_image_url = self.generate_upi_qr_string(
            merchant_upi_id=active_upi,
            merchant_transaction_id=merchant_transaction_id,
            order_number=order_number,
            amount=amount,
            merchant_name="Detective Zone"
        )

        payment_url = None
        
        # If not simulated, call PhonePe endpoint or return formatted payload
        if self.env != "SIMULATED":
            try:
                url = f"{self.base_url}/pg/v1/pay"
                req_data = json.dumps({"request": base64_payload}).encode("utf-8")
                req = urllib.request.Request(
                    url,
                    data=req_data,
                    headers={
                        "Content-Type": "application/json",
                        "X-VERIFY": checksum,
                        "X-MERCHANT-ID": self.merchant_id,
                        "Accept": "application/json"
                    },
                    method="POST"
                )
                with urllib.request.urlopen(req, timeout=10) as response:
                    resp_data = json.loads(response.read().decode("utf-8"))
                    if resp_data.get("success") and "data" in resp_data:
                        instrument = resp_data["data"].get("instrumentResponse", {})
                        if "redirectInfo" in instrument:
                            payment_url = instrument["redirectInfo"].get("url")
            except Exception as e:
                # Log and fallback gracefully to standard UPI gateway QR
                pass

        return {
            "merchant_transaction_id": merchant_transaction_id,
            "order_number": order_number,
            "amount": amount,
            "amount_in_paise": amount_in_paise,
            "upi_id": active_upi,
            "qr_payload": upi_string,
            "qr_image_url": qr_image_url,
            "payment_url": payment_url,
            "base64_request": base64_payload,
            "checksum": checksum,
            "status": "PENDING"
        }

    def check_payment_status(self, merchant_transaction_id: str) -> Dict[str, Any]:
        """
        Calls official PhonePe Status Check API:
        GET /pg/v1/status/{merchantId}/{merchantTransactionId}
        """
        endpoint = f"/pg/v1/status/{self.merchant_id}/{merchant_transaction_id}"
        checksum = self.generate_status_checksum(endpoint)
        url = f"{self.base_url}{endpoint}"

        if self.env == "SIMULATED":
            return {
                "success": False,
                "code": "PAYMENT_PENDING",
                "message": "Payment is currently pending",
                "data": {
                    "merchantId": self.merchant_id,
                    "merchantTransactionId": merchant_transaction_id,
                    "state": "PENDING",
                    "responseCode": "PAYMENT_PENDING"
                }
            }

        try:
            req = urllib.request.Request(
                url,
                headers={
                    "Content-Type": "application/json",
                    "X-VERIFY": checksum,
                    "X-MERCHANT-ID": self.merchant_id,
                    "Accept": "application/json"
                },
                method="GET"
            )
            with urllib.request.urlopen(req, timeout=10) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            try:
                err_body = e.read().decode("utf-8")
                return json.loads(err_body)
            except Exception:
                return {"success": False, "code": "HTTP_ERROR", "message": str(e)}
        except Exception as e:
            return {"success": False, "code": "CONNECTION_ERROR", "message": str(e)}

phonepe_service = PhonePeService()
