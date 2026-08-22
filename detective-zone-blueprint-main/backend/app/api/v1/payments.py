from fastapi import APIRouter, Depends, HTTPException, Header, Request, status
from sqlalchemy.orm import Session
from datetime import datetime
import json
import base64
import uuid
from typing import Optional, Dict, Any

from app.core.database import get_db
from app.core.deps import get_current_admin
from app.models.admin import Admin
from app.models.order import Order, OrderItem, OrderEvent, Payment
from app.models.product import Product
from app.models.setting import SiteSetting
from app.schemas.order import (
    PaymentCreateRequest, PaymentCreateResponse, PaymentStatusResponse,
    PhonePeWebhookRequest, AdminReconcilePaymentRequest
)
from app.services.phonepe import phonepe_service
from app.services.email import send_payment_confirmed_email
from app.services.whatsapp import send_whatsapp_order_confirmation
from app.services.audit import log_admin_action
from app.core.config import settings

router = APIRouter(prefix="/payments", tags=["PhonePe UPI Payments & Verification"])


def backup_order_dossier(order: Order):
    """Safely triggers JSON backup dossier write without crashing main request."""
    try:
        from app.api.v1.orders import backup_order_to_json_file
        backup_order_to_json_file(order)
    except Exception as e:
        print(f"[BACKUP DOSSIER WRITE ERROR] {e}")


def get_active_upi_id(db: Session) -> str:
    """Retrieve configured merchant UPI ID from database settings or env default."""
    setting = db.query(SiteSetting).filter(SiteSetting.key == "upi_id").first()
    if setting and setting.value and setting.value.strip():
        return setting.value.strip()
    return settings.DEFAULT_UPI_ID


def execute_order_confirmation(
    db: Session,
    payment: Payment,
    order: Order,
    provider_transaction_id: Optional[str] = None,
    raw_response: Optional[str] = None,
    performed_by: str = "PhonePe Gateway Verification"
) -> bool:
    """
    Idempotent payment confirmation & inventory adjustment.
    Ensures payment is marked PAID and order CONFIRMED only once.
    """
    # Check if already confirmed
    already_confirmed = (
        payment.status == "PAID" and
        order.payment_status == "PAID" and
        order.order_status in ["PAYMENT_CONFIRMED", "ACCEPTED", "PREPARING", "SHIPPED", "DELIVERED"]
    )
    if already_confirmed:
        return True

    now = datetime.utcnow()
    
    # 1. Update Payment record
    payment.status = "PAID"
    payment.provider_transaction_id = provider_transaction_id or payment.provider_transaction_id or f"PPE_{uuid.uuid4().hex[:10].upper()}"
    payment.verified_at = now
    payment.paid_at = now
    if raw_response:
        payment.raw_response = raw_response

    # 2. Update Order
    order.payment_status = "PAID"
    order.order_status = "PAYMENT_CONFIRMED"
    order.transaction_id = payment.transaction_id
    order.gateway_reference = payment.provider_transaction_id
    order.paid_at = now

    # 3. Deduct product stocks atomically
    for oi in order.items:
        if oi.product_id:
            p = db.query(Product).filter(Product.id == oi.product_id).first()
            if p and p.stock_quantity is not None:
                p.stock_quantity = max(0, p.stock_quantity - oi.quantity)

    # 4. Log timeline event
    msg = f"Payment of ₹{order.total_amount:,.2f} verified via PhonePe Gateway (Txn ID: {payment.transaction_id}, Ref: {payment.provider_transaction_id}). Order confirmed."
    db.add(OrderEvent(
        order_id=order.id,
        event_type="PAYMENT_RECEIVED",
        previous_status="PENDING_PAYMENT",
        new_status="PAYMENT_CONFIRMED",
        message=msg,
        performed_by=performed_by
    ))

    db.commit()
    db.refresh(order)
    db.refresh(payment)

    # 5. Dual Notification: Email + WhatsApp
    try:
        send_payment_confirmed_email(order)
        db.commit()
    except Exception as e:
        print(f"[PAYMENT EMAIL ERROR] {e}")

    try:
        send_whatsapp_order_confirmation(order)
    except Exception as e:
        print(f"[PAYMENT WHATSAPP ERROR] {e}")

    # 6. Persistent Dual-Storage JSON Dossier Backup to Disk
    backup_order_dossier(order)

    return True


@router.post("/create", response_model=PaymentCreateResponse, status_code=status.HTTP_201_CREATED)
def create_payment_transaction(
    req: PaymentCreateRequest,
    db: Session = Depends(get_db)
):
    """
    Creates a pending PhonePe payment transaction in the database and returns
    the standard UPI QR payload and deep link.
    """
    order = db.query(Order).filter(Order.id == req.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.payment_status == "PAID" and order.order_status != "PENDING_PAYMENT":
        raise HTTPException(status_code=400, detail="Order has already been paid and confirmed")

    # Generate unique merchant transaction ID for PhonePe
    # Format: MTXN_<timestamp>_<order_id>_<random>
    timestamp_str = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    rand_suffix = uuid.uuid4().hex[:6].upper()
    merchant_txn_id = f"MTXN_{timestamp_str}_{order.id}_{rand_suffix}"

    active_upi_id = get_active_upi_id(db)

    # Build PhonePe payload and standard UPI QR
    phonepe_data = phonepe_service.create_payment_request(
        merchant_transaction_id=merchant_txn_id,
        order_number=order.order_number,
        amount=order.total_amount,
        customer_id=str(order.id),
        customer_phone=order.customer_phone,
        redirect_url=req.redirect_url,
        merchant_upi_id=active_upi_id
    )

    # Store transaction in database before customer attempts payment
    payment_record = Payment(
        order_id=order.id,
        provider="PHONEPE",
        transaction_id=merchant_txn_id,
        merchant_transaction_id=merchant_txn_id,
        payment_method="UPI",
        amount=order.total_amount,
        currency=order.currency or "INR",
        status="PENDING",
        upi_id=active_upi_id,
        qr_payload=phonepe_data["qr_payload"],
        payment_url=phonepe_data.get("payment_url"),
        raw_response=json.dumps({"checksum": phonepe_data["checksum"]})
    )
    db.add(payment_record)

    # Update order with latest transaction ID
    order.transaction_id = merchant_txn_id
    order.order_status = "PENDING_PAYMENT"
    order.payment_status = "PENDING"

    db.commit()
    db.refresh(payment_record)

    return PaymentCreateResponse(
        merchant_transaction_id=merchant_txn_id,
        order_id=order.id,
        order_number=order.order_number,
        amount=order.total_amount,
        currency=order.currency or "INR",
        upi_id=active_upi_id,
        qr_payload=phonepe_data["qr_payload"],
        qr_image_url=phonepe_data["qr_image_url"],
        payment_url=phonepe_data.get("payment_url"),
        status="PENDING",
        expires_in_seconds=600
    )


@router.get("/{transaction_id}/status", response_model=PaymentStatusResponse)
def get_payment_status(
    transaction_id: str,
    db: Session = Depends(get_db)
):
    """
    Direct server-side verification of PhonePe payment status.
    Called automatically during QR polling or when customer clicks 'I've completed payment'.
    NEVER marks paid unless verified by PhonePe status API or database.
    """
    payment = db.query(Payment).filter(
        (Payment.transaction_id == transaction_id) | 
        (Payment.merchant_transaction_id == transaction_id)
    ).first()

    if not payment:
        raise HTTPException(status_code=404, detail="Payment transaction not found")

    order = db.query(Order).filter(Order.id == payment.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Associated order not found")

    # If already verified as PAID in database, return immediately
    if payment.status == "PAID":
        return PaymentStatusResponse(
            merchant_transaction_id=payment.transaction_id,
            order_id=order.id,
            order_number=order.order_number,
            amount=payment.amount,
            currency=payment.currency or "INR",
            payment_status="PAID",
            order_status=order.order_status,
            provider=payment.provider or "PHONEPE",
            provider_transaction_id=payment.provider_transaction_id,
            verified_at=payment.verified_at,
            paid_at=payment.paid_at,
            message="Payment successfully verified."
        )

    # Query PhonePe official status API
    status_resp = phonepe_service.check_payment_status(payment.transaction_id)
    
    code = status_resp.get("code")
    data = status_resp.get("data", {})
    state = data.get("state")
    provider_txn_id = data.get("transactionId") or status_resp.get("transactionId")

    if code == "PAYMENT_SUCCESS" or state == "COMPLETED":
        # Payment verified by PhonePe! Confirm order.
        execute_order_confirmation(
            db=db,
            payment=payment,
            order=order,
            provider_transaction_id=provider_txn_id,
            raw_response=json.dumps(status_resp),
            performed_by="PhonePe Status API Check"
        )
        return PaymentStatusResponse(
            merchant_transaction_id=payment.transaction_id,
            order_id=order.id,
            order_number=order.order_number,
            amount=payment.amount,
            currency=payment.currency or "INR",
            payment_status="PAID",
            order_status=order.order_status,
            provider="PHONEPE",
            provider_transaction_id=provider_txn_id,
            verified_at=payment.verified_at,
            paid_at=payment.paid_at,
            message="Payment successfully verified by PhonePe."
        )

    elif code in ["PAYMENT_FAILED", "PAYMENT_ERROR", "TRANSACTION_NOT_FOUND"] or state in ["FAILED", "DECLINED"]:
        payment.status = "FAILED"
        payment.raw_response = json.dumps(status_resp)
        order.payment_status = "FAILED"
        order.order_status = "PAYMENT_FAILED"
        db.commit()

        return PaymentStatusResponse(
            merchant_transaction_id=payment.transaction_id,
            order_id=order.id,
            order_number=order.order_number,
            amount=payment.amount,
            currency=payment.currency or "INR",
            payment_status="FAILED",
            order_status="PAYMENT_FAILED",
            provider="PHONEPE",
            provider_transaction_id=provider_txn_id,
            verified_at=None,
            paid_at=None,
            message=status_resp.get("message") or "Payment was not successful."
        )

    # Still Pending / Waiting for Customer action
    return PaymentStatusResponse(
        merchant_transaction_id=payment.transaction_id,
        order_id=order.id,
        order_number=order.order_number,
        amount=payment.amount,
        currency=payment.currency or "INR",
        payment_status="PENDING",
        order_status=order.order_status,
        provider="PHONEPE",
        provider_transaction_id=None,
        verified_at=None,
        paid_at=None,
        message="Awaiting payment from customer UPI app."
    )


@router.post("/phonepe/webhook")
async def phonepe_webhook_handler(
    request: Request,
    x_verify: Optional[str] = Header(None, alias="X-VERIFY"),
    db: Session = Depends(get_db)
):
    """
    Secure, idempotent PhonePe Webhook handler.
    Validates X-VERIFY signature, extracts payload, verifies payment state,
    and idempotently confirms the order.
    """
    try:
        body_bytes = await request.body()
        body_json = json.loads(body_bytes.decode("utf-8"))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON webhook body")

    response_base64 = body_json.get("response")
    if not response_base64:
        raise HTTPException(status_code=400, detail="Missing 'response' parameter in webhook payload")

    # In Production/UAT, verify checksum if x_verify is provided
    if x_verify and phonepe_service.env != "SIMULATED":
        is_valid = phonepe_service.verify_webhook_checksum(response_base64, x_verify)
        if not is_valid:
            raise HTTPException(status_code=401, detail="Invalid PhonePe webhook signature (X-VERIFY mismatch)")

    try:
        decoded_bytes = base64.b64decode(response_base64)
        webhook_data = json.loads(decoded_bytes.decode("utf-8"))
    except Exception:
        raise HTTPException(status_code=400, detail="Failed to decode base64 webhook response")

    code = webhook_data.get("code")
    data = webhook_data.get("data", {})
    merchant_txn_id = data.get("merchantTransactionId")
    provider_txn_id = data.get("transactionId")
    amount_in_paise = data.get("amount")

    if not merchant_txn_id:
        raise HTTPException(status_code=400, detail="Missing merchantTransactionId in decoded webhook")

    # Find corresponding payment
    payment = db.query(Payment).filter(
        (Payment.transaction_id == merchant_txn_id) | 
        (Payment.merchant_transaction_id == merchant_txn_id)
    ).first()

    if not payment:
        raise HTTPException(status_code=404, detail=f"Payment with ID {merchant_txn_id} not found")

    order = db.query(Order).filter(Order.id == payment.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Associated order not found")

    # Verify amount matches (within 1 rupee tolerance for float differences)
    if amount_in_paise is not None:
        expected_paise = int(round(order.total_amount * 100))
        if abs(expected_paise - int(amount_in_paise)) > 100: # mismatch > ₹1
            payment.status = "FAILED"
            payment.raw_response = json.dumps(webhook_data)
            db.commit()
            raise HTTPException(status_code=400, detail="Webhook payment amount does not match order total amount")

    # Idempotent State Transition
    if code == "PAYMENT_SUCCESS":
        execute_order_confirmation(
            db=db,
            payment=payment,
            order=order,
            provider_transaction_id=provider_txn_id,
            raw_response=json.dumps(webhook_data),
            performed_by="PhonePe Webhook"
        )
        return {"success": True, "message": "Payment verified and order confirmed successfully"}
    else:
        payment.status = "FAILED"
        payment.raw_response = json.dumps(webhook_data)
        order.payment_status = "FAILED"
        order.order_status = "PAYMENT_FAILED"
        db.commit()
        return {"success": False, "message": f"Payment reported as {code}"}


@router.post("/admin/reconcile/{transaction_id}")
def admin_reconcile_payment(
    transaction_id: str,
    req: AdminReconcilePaymentRequest,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Audited manual payment reconciliation.
    Requires Admin privileges, logs admin email, timestamp, reason, and updates order.
    """
    if not req.reason or len(req.reason.strip()) < 5:
        raise HTTPException(status_code=400, detail="A detailed reason is required for manual payment reconciliation")

    payment = db.query(Payment).filter(
        (Payment.transaction_id == transaction_id) | 
        (Payment.merchant_transaction_id == transaction_id)
    ).first()

    if not payment:
        raise HTTPException(status_code=404, detail="Payment record not found")

    order = db.query(Order).filter(Order.id == payment.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Associated order not found")

    if req.action == "CONFIRM_PAYMENT":
        execute_order_confirmation(
            db=db,
            payment=payment,
            order=order,
            provider_transaction_id=req.provider_transaction_id or f"MANUAL_RECON_{uuid.uuid4().hex[:8].upper()}",
            raw_response=json.dumps({"manual_reason": req.reason, "reconciled_by": current_admin.email}),
            performed_by=f"Admin: {current_admin.email} (Reason: {req.reason})"
        )
        log_admin_action(
            db=db,
            action="RECONCILE_PAYMENT_CONFIRMED",
            resource="Payment",
            resource_id=str(payment.id),
            details=f"Manually confirmed payment for order #{order.order_number}. Reason: {req.reason}",
            admin=current_admin
        )
        return {"success": True, "message": f"Payment manually confirmed by {current_admin.email}"}
    else:
        payment.status = "FAILED"
        order.payment_status = "FAILED"
        order.order_status = "PAYMENT_FAILED"
        db.commit()
        log_admin_action(
            db=db,
            action="RECONCILE_PAYMENT_FAILED",
            resource="Payment",
            resource_id=str(payment.id),
            details=f"Manually marked payment as failed for order #{order.order_number}. Reason: {req.reason}",
            admin=current_admin
        )
        return {"success": True, "message": f"Payment marked as failed by {current_admin.email}"}
