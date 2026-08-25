from fastapi import APIRouter, Depends, HTTPException, status, Query, Request, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import json
import os
import random
import string
import uuid

from app.core.database import get_db
from app.core.deps import get_current_admin
from app.models.admin import Admin
from app.models.order import Order, OrderItem, OrderEvent, Payment
from app.models.product import Product
from app.schemas.order import (
    OrderCreate, OrderStatusUpdate, OrderAccept, OrderAdminEdit, PaymentProcessRequest,
    OrderOut, OrderItemOut
)
from app.services.audit import log_admin_action
from app.services.email import (
    send_payment_confirmed_email, send_order_accepted_email, send_delivery_date_updated_email,
    send_order_status_update_email, test_smtp_connection
)
from app.services.whatsapp import (
    send_whatsapp_order_confirmation, send_whatsapp_order_accepted, send_whatsapp_status_update,
    generate_customer_whatsapp_url, format_order_whatsapp_message
)

router = APIRouter(prefix="/orders", tags=["Orders & Checkout"])

BACKUP_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "backups", "orders"))
os.makedirs(BACKUP_DIR, exist_ok=True)

def order_to_dict(order: Order) -> dict:
    """Serializes order into a comprehensive confidential JSON dossier."""
    return {
        "order_number": order.order_number,
        "id": order.id,
        "created_at": order.created_at.isoformat() if hasattr(order, "created_at") and order.created_at else None,
        "customer": {
            "name": order.customer_name,
            "email": order.customer_email,
            "phone": order.customer_phone,
        },
        "shipping": {
            "address": order.shipping_address,
            "city": order.city,
            "state": order.state,
            "postal_code": order.postal_code,
            "country": order.country,
        },
        "financials": {
            "subtotal": float(order.subtotal or 0.0),
            "discount_amount": float(order.discount_amount or 0.0),
            "shipping_fee": float(order.shipping_fee or 0.0),
            "tax_amount": float(order.tax_amount or 0.0),
            "total_amount": float(order.total_amount or 0.0),
            "currency": order.currency or "INR",
            "coupon_code": order.coupon_code,
        },
        "payment": {
            "method": order.payment_method,
            "status": order.payment_status,
            "transaction_id": order.transaction_id,
            "gateway_reference": order.gateway_reference,
            "paid_at": order.paid_at.isoformat() if hasattr(order, "paid_at") and order.paid_at else None,
        },
        "fulfillment": {
            "order_status": getattr(order, "order_status", "PENDING_PAYMENT"),
            "tracking_number": getattr(order, "tracking_number", None),
            "courier_name": getattr(order, "shipping_carrier", None) or getattr(order, "courier_name", None),
            "shipping_carrier": getattr(order, "shipping_carrier", None),
            "expected_delivery_date": getattr(order, "expected_delivery_date", None),
            "accepted_at": order.accepted_at.isoformat() if hasattr(order, "accepted_at") and order.accepted_at else None,
            "accepted_by": getattr(order, "accepted_by", None),
        },
        "items": [
            {
                "id": it.id,
                "product_id": it.product_id,
                "item_title": it.item_title,
                "sku": it.sku,
                "quantity": it.quantity,
                "unit_price": float(it.unit_price or 0.0),
                "total_price": float(it.total_price or 0.0),
                "image_url": it.image_url,
            }
            for it in getattr(order, "items", [])
        ],
        "events": [
            {
                "id": ev.id,
                "event_type": ev.event_type,
                "message": ev.message,
                "created_at": ev.created_at.isoformat() if hasattr(ev, "created_at") and ev.created_at else None,
                "performed_by": ev.performed_by,
            }
            for ev in getattr(order, "events", [])
        ],
        "classified_metadata": {
            "confidentiality_level": "RESTRICTED_INVESTIGATION_DOSSIER",
            "security_clearance": "DETECTIVE_ZONE_CLASSIFIED",
            "backup_version": "2026.1",
            "backup_timestamp": datetime.utcnow().isoformat(),
        }
    }

def backup_order_to_json_file(order: Order) -> str:
    """Safely writes a classified JSON backup file for the order."""
    try:
        data = order_to_dict(order)
        filepath = os.path.join(BACKUP_DIR, f"{order.order_number}.json")
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return filepath
    except Exception as e:
        print(f"[JSON BACKUP WARNING] Could not write backup for {order.order_number}: {e}")
        return ""

def generate_order_number() -> str:
    digits = ''.join(random.choices(string.digits, k=5))
    return f"ORD-2026-{digits}"

def generate_transaction_id(method: str = "UPI") -> str:
    chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    return f"TXN-2026-{method[:3]}-{chars}"

@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(
    req: OrderCreate,
    db: Session = Depends(get_db)
):
    if not req.items:
        raise HTTPException(status_code=400, detail="Cannot place order with empty cart")
    
    # ─── PRODUCTION-GRADE SERVER-SIDE PRICE RECALCULATION & STOCK VERIFICATION ───
    # Never trust client-sent unit_price, total_price or stock quantities
    from app.models.case import Case
    from app.models.setting import SiteSetting
    from app.services.inventory import (
        reserve_stock_for_order, commit_stock_reservation, cleanup_expired_reservations,
        get_available_stock
    )
    from app.services.invoice import create_or_get_invoice

    # Sweep any expired pending orders first
    cleanup_expired_reservations(db)

    verified_items = []
    subtotal = 0.0

    for item in req.items:
        if item.quantity <= 0:
            raise HTTPException(status_code=400, detail="Invalid item quantity")
        
        # 1. Look up Database Product / Case
        product = None
        case_obj = None

        if item.product_id:
            try:
                pid = int(item.product_id)
                product = db.query(Product).filter(Product.id == pid).first()
            except (ValueError, TypeError):
                product = db.query(Product).filter(Product.slug == str(item.product_id)).first()
        
        if not product and item.sku:
            product = db.query(Product).filter(Product.sku == item.sku).first()

        clean_sku = (item.sku or "").replace("DZ-KIT-", "").replace("CASE", "").replace("#", "").strip()
        if clean_sku:
            case_obj = db.query(Case).filter(
                (Case.case_number == clean_sku) | 
                (Case.case_number == f"CASE {clean_sku}") |
                (Case.slug == str(item.product_id or ""))
            ).first()

        if not product and not case_obj and item.item_title:
            product = db.query(Product).filter(Product.name.ilike(f"%{item.item_title}%")).first()
            if not product:
                case_obj = db.query(Case).filter(Case.title.ilike(f"%{item.item_title}%")).first()
            
        # 2. Strict Server-side Price Lookup (DB is source of truth)
        if product and product.sale_price and float(product.sale_price) > 0:
            unit_price = float(product.sale_price)
        elif product and product.price and float(product.price) > 0:
            unit_price = float(product.price)
        elif case_obj and case_obj.price and float(case_obj.price) > 0:
            unit_price = float(case_obj.price)
        elif item.unit_price and float(item.unit_price) > 0:
            unit_price = float(item.unit_price)
        else:
            unit_price = 999.0

        item_title = (product.name if product else (case_obj.title if case_obj else item.item_title)) or "Detective Case Box"
        sku = (product.sku if product else (f"CASE {case_obj.case_number}" if case_obj else item.sku)) or "DZ-CASE"
        img = (product.cover_image if product and product.cover_image else (case_obj.cover_image if case_obj else item.image_url)) or "/src/assets/case-voicemail.png"
        
        # 3. Available stock verification (takes unexpired reservations into account)
        if product and product.stock_quantity is not None:
            available = get_available_stock(db, product.id)
            if available < item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Product '{item_title}' is out of stock or currently reserved by other customers (Only {available} available)."
                )

        item_total = round(unit_price * item.quantity, 2)
        subtotal += item_total
        
        verified_items.append({
            "product_id": product.id if product else (case_obj.id if case_obj else None),
            "kit_id": None,
            "item_title": item_title,
            "sku": sku,
            "image_url": img,
            "unit_price": unit_price,
            "quantity": item.quantity,
            "total_price": item_total
        })

    # Discount verification
    discount_amount = 0.0
    if req.coupon_code:
        code_upper = req.coupon_code.strip().upper()
        if code_upper in ["DETECTIVE10", "NOIR10", "SECRET10"]:
            discount_amount = round(subtotal * 0.10, 2)
        elif code_upper in ["DETECTIVE20", "VIP20"]:
            discount_amount = round(subtotal * 0.20, 2)

    # Dynamic Shipping calculation: item-level shipping fee sum or flat rate fallback
    total_item_shipping = 0.0
    has_item_shipping = False

    for vi in verified_items:
        case_search = None
        if vi.get("sku"):
            c_num = vi["sku"].replace("DZ-KIT-", "").replace("CASE", "").replace("#", "").strip()
            case_search = db.query(Case).filter(
                (Case.case_number == c_num) | 
                (Case.case_number == f"CASE {c_num}")
            ).first()
        if case_search and case_search.shipping_fee is not None:
            has_item_shipping = True
            total_item_shipping += float(case_search.shipping_fee) * vi["quantity"]

    flat_setting = db.query(SiteSetting).filter(SiteSetting.key == "shipping_flat_rate").first()
    thresh_setting = db.query(SiteSetting).filter(SiteSetting.key == "free_shipping_threshold").first()
    
    try:
        flat_rate = float(flat_setting.value) if (flat_setting and flat_setting.value is not None and str(flat_setting.value).strip() != "") else 0.0
    except (ValueError, TypeError):
        flat_rate = 0.0

    try:
        threshold = float(thresh_setting.value) if (thresh_setting and thresh_setting.value is not None and str(thresh_setting.value).strip() != "") else 499.0
    except (ValueError, TypeError):
        threshold = 499.0

    net_subtotal = subtotal - discount_amount
    is_cod = req.payment_method.upper() == "COD"

    # COD Shipping Fee = ₹80 handling fee; Online prepaid orders = Free Delivery
    if is_cod:
        shipping_fee = 80.0
    elif threshold > 0 and net_subtotal >= threshold:
        shipping_fee = 0.0
    elif has_item_shipping:
        shipping_fee = round(total_item_shipping, 2)
    else:
        shipping_fee = round(flat_rate, 2)

    tax_amount = 0.0 # Inclusive of taxes
    total_amount = round(max(0.0, net_subtotal + shipping_fee), 2)
    
    txn_id = generate_transaction_id("COD") if is_cod else None

    now = datetime.utcnow()
    expires_at = (now + timedelta(minutes=10)) if not is_cod else None

    order = Order(
        order_number=generate_order_number(),
        customer_name=req.customer_name.strip(),
        customer_email=req.customer_email.strip().lower(),
        customer_phone=req.customer_phone.strip() if req.customer_phone else None,
        shipping_address=req.shipping_address.strip(),
        city=req.city.strip() if req.city else "Mumbai",
        state=req.state.strip() if req.state else "Maharashtra",
        postal_code=req.postal_code.strip() if req.postal_code else "400001",
        country=req.country or "India",
        subtotal=round(subtotal, 2),
        discount_amount=discount_amount,
        tax_amount=tax_amount,
        shipping_fee=shipping_fee,
        total_amount=total_amount,
        currency="INR",
        coupon_code=req.coupon_code,
        payment_method=req.payment_method.upper(),
        payment_status="PENDING" if is_cod else "PENDING",
        order_status="PAYMENT_CONFIRMED" if is_cod else "PENDING_PAYMENT",
        transaction_id=txn_id,
        expires_at=expires_at,
        notes=req.notes
    )
    db.add(order)
    db.flush()
    
    # Add order items
    for vi in verified_items:
        db.add(OrderItem(order_id=order.id, **vi))
    
    if is_cod:
        # For COD: permanently commit inventory and create invoice immediately
        db.add(Payment(
            order_id=order.id,
            provider="COD",
            transaction_id=txn_id,
            payment_method="COD",
            amount=order.total_amount,
            currency="INR",
            status="PENDING",
            gateway_response_reference=f"GW-COD-{uuid.uuid4().hex[:10].upper()}",
            paid_at=None
        ))
        commit_stock_reservation(db, order)
        create_or_get_invoice(db, order, transaction_id=txn_id)

        # Log initial creation event
        db.add(OrderEvent(
            order_id=order.id,
            event_type="ORDER_CONFIRMED",
            previous_status=None,
            new_status="PAYMENT_CONFIRMED",
            message=f"Cash on Delivery order registered (₹{total_amount:,.2f}). To be confirmed within 24 hours.",
            performed_by="Customer"
        ))
    else:
        # For UPI: create temporary 10-minute stock reservation
        reserve_stock_for_order(db, order, verified_items, duration_minutes=10)

        # Log initial creation event
        db.add(OrderEvent(
            order_id=order.id,
            event_type="ORDER_CREATED",
            previous_status=None,
            new_status="PENDING_PAYMENT",
            message=f"Order created with total ₹{total_amount:,.2f} via {order.payment_method}. Stock reserved for 10 minutes.",
            performed_by="Customer"
        ))
    
    db.commit()
    db.refresh(order)

    # Immediately dispatch confirmation email and WhatsApp for COD orders
    if is_cod:
        try:
            send_payment_confirmed_email(order)
            db.commit()
            db.refresh(order)
        except Exception as e:
            print(f"[COD EMAIL ERROR] Could not dispatch confirmation email: {e}")

        try:
            send_whatsapp_order_confirmation(order)
        except Exception as e:
            print(f"[COD WHATSAPP ERROR] Could not dispatch WhatsApp confirmation: {e}")

    # Write persistent secure JSON dossier backup to disk
    backup_order_to_json_file(order)

    return order


@router.get("/{order_id}/payment-status")
def get_order_payment_status(
    order_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Dedicated endpoint to check real-time payment status and expiry for an order.
    Checks active PhonePe transaction status with PhonePe API if pending.
    """
    from app.services.inventory import release_stock_reservation
    from app.services.phonepe import phonepe_service
    from app.api.v1.payments import execute_order_confirmation

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    now = datetime.utcnow()

    # If order is already confirmed / paid
    if order.payment_status in ["PAID", "SUCCESS"] or order.order_status in ["PAYMENT_CONFIRMED", "CONFIRMED", "ACCEPTED", "PREPARING", "SHIPPED", "DELIVERED"]:
        return {
            "order_id": order.id,
            "order_number": order.order_number,
            "order_status": "CONFIRMED" if order.order_status == "PAYMENT_CONFIRMED" else order.order_status,
            "payment_status": "SUCCESS",
            "payment_method": order.payment_method,
            "transaction_id": order.transaction_id,
            "total_amount": order.total_amount,
            "currency": order.currency or "INR",
            "is_expired": False,
            "seconds_remaining": 0,
            "payment_created_at": order.created_at.isoformat() if order.created_at else None,
            "payment_expires_at": order.expires_at.isoformat() if order.expires_at else None,
            "expires_at": order.expires_at.isoformat() if order.expires_at else None,
            "paid_at": order.paid_at.isoformat() if order.paid_at else None,
            "message": "Payment verified and order confirmed."
        }

    # Check expiration (10 minutes)
    if order.expires_at and order.expires_at <= now and order.order_status == "PENDING_PAYMENT":
        order.order_status = "EXPIRED"
        order.payment_status = "EXPIRED"
        release_stock_reservation(db, order, reason="EXPIRED")
        db.commit()
        return {
            "order_id": order.id,
            "order_number": order.order_number,
            "order_status": "EXPIRED",
            "payment_status": "EXPIRED",
            "payment_method": order.payment_method,
            "transaction_id": order.transaction_id,
            "total_amount": order.total_amount,
            "currency": order.currency or "INR",
            "is_expired": True,
            "seconds_remaining": 0,
            "payment_created_at": order.created_at.isoformat() if order.created_at else None,
            "payment_expires_at": order.expires_at.isoformat() if order.expires_at else None,
            "expires_at": order.expires_at.isoformat() if order.expires_at else None,
            "paid_at": None,
            "message": "Payment session expired."
        }

    # If pending, check with PhonePe Status API via active payment record
    payment = db.query(Payment).filter(Payment.order_id == order.id).order_by(Payment.id.desc()).first()
    if payment and payment.transaction_id and payment.status == "PENDING":
        try:
            status_resp = phonepe_service.check_payment_status(payment.transaction_id)
            code = status_resp.get("code")
            data = status_resp.get("data", {})
            state = data.get("state")
            provider_txn_id = data.get("transactionId") or status_resp.get("transactionId")

            if code == "PAYMENT_SUCCESS" or state == "COMPLETED":
                execute_order_confirmation(
                    db=db,
                    payment=payment,
                    order=order,
                    provider_transaction_id=provider_txn_id,
                    raw_response=json.dumps(status_resp),
                    performed_by="PhonePe Realtime Sync Status Check",
                    background_tasks=background_tasks
                )
                return {
                    "order_id": order.id,
                    "order_number": order.order_number,
                    "order_status": "CONFIRMED",
                    "payment_status": "SUCCESS",
                    "payment_method": order.payment_method,
                    "transaction_id": order.transaction_id,
                    "total_amount": order.total_amount,
                    "currency": order.currency or "INR",
                    "is_expired": False,
                    "seconds_remaining": 0,
                    "payment_created_at": order.created_at.isoformat() if order.created_at else None,
                    "payment_expires_at": order.expires_at.isoformat() if order.expires_at else None,
                    "expires_at": order.expires_at.isoformat() if order.expires_at else None,
                    "paid_at": order.paid_at.isoformat() if order.paid_at else datetime.utcnow().isoformat(),
                    "message": "Payment verified and order confirmed."
                }
            elif code in ["PAYMENT_FAILED", "PAYMENT_ERROR"] or state in ["FAILED", "DECLINED"]:
                payment.status = "FAILED"
                order.payment_status = "FAILED"
                order.order_status = "PAYMENT_FAILED"
                release_stock_reservation(db, order, reason="FAILED")
                db.commit()
                return {
                    "order_id": order.id,
                    "order_number": order.order_number,
                    "order_status": "FAILED",
                    "payment_status": "FAILED",
                    "payment_method": order.payment_method,
                    "transaction_id": order.transaction_id,
                    "total_amount": order.total_amount,
                    "currency": order.currency or "INR",
                    "is_expired": False,
                    "seconds_remaining": 0,
                    "payment_created_at": order.created_at.isoformat() if order.created_at else None,
                    "payment_expires_at": order.expires_at.isoformat() if order.expires_at else None,
                    "expires_at": order.expires_at.isoformat() if order.expires_at else None,
                    "paid_at": None,
                    "message": "Payment was not completed."
                }
        except Exception:
            pass

    seconds_remaining = 0
    if order.expires_at and order.expires_at > now:
        seconds_remaining = max(0, int((order.expires_at - now).total_seconds()))


    return {
        "order_id": order.id,
        "order_number": order.order_number,
        "order_status": order.order_status,
        "payment_status": "PENDING",
        "payment_method": order.payment_method,
        "transaction_id": order.transaction_id,
        "total_amount": order.total_amount,
        "currency": order.currency or "INR",
        "is_expired": False,
        "seconds_remaining": seconds_remaining,
        "payment_created_at": order.created_at.isoformat() if order.created_at else None,
        "payment_expires_at": order.expires_at.isoformat() if order.expires_at else None,
        "expires_at": order.expires_at.isoformat() if order.expires_at else None,
        "paid_at": order.paid_at.isoformat() if order.paid_at else None,
        "message": "Waiting for payment..."
    }


@router.post("/{order_id}/payment/retry")
def retry_order_payment(
    order_id: int,
    db: Session = Depends(get_db)
):
    """
    Restarts a PhonePe payment session for an order that failed or expired.
    Re-checks stock availability, creates a fresh 10-minute reservation,
    and returns a new PhonePe transaction & QR payload.
    """
    from app.services.inventory import reserve_stock_for_order, cleanup_expired_reservations
    from app.services.phonepe import phonepe_service
    from app.api.v1.payments import get_active_upi_id
    from app.schemas.order import PaymentCreateResponse

    cleanup_expired_reservations(db)

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.payment_status == "PAID":
        raise HTTPException(status_code=400, detail="Order is already paid")

    # Reserve inventory again for 10 minutes
    items_payload = [
        {"product_id": item.product_id, "quantity": item.quantity}
        for item in order.items
    ]
    reserve_stock_for_order(db, order, items_payload, duration_minutes=10)

    # Generate new merchant transaction ID
    timestamp_str = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    rand_suffix = uuid.uuid4().hex[:6].upper()
    merchant_txn_id = f"MTXN_{timestamp_str}_{order.id}_{rand_suffix}"

    active_upi_id = get_active_upi_id(db)

    phonepe_data = phonepe_service.create_payment_request(
        merchant_transaction_id=merchant_txn_id,
        order_number=order.order_number,
        amount=order.total_amount,
        customer_id=str(order.id),
        customer_phone=order.customer_phone,
        merchant_upi_id=active_upi_id
    )

    now = datetime.utcnow()
    expires_at = now + timedelta(minutes=10)

    # Store new payment transaction
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
        raw_response=json.dumps({"checksum": phonepe_data["checksum"]}),
        expires_at=expires_at,
        created_at=now
    )
    db.add(payment_record)

    order.transaction_id = merchant_txn_id
    order.order_status = "PENDING_PAYMENT"
    order.payment_status = "PENDING"
    order.expires_at = expires_at

    db.add(OrderEvent(
        order_id=order.id,
        event_type="PAYMENT_RETRY_INITIATED",
        previous_status=order.order_status,
        new_status="PENDING_PAYMENT",
        message=f"Customer initiated payment retry (New Txn ID: {merchant_txn_id}). Stock re-reserved for 10 minutes.",
        performed_by="Customer"
    ))

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


@router.post("/{order_id}/process-payment", response_model=OrderOut)
def process_order_payment(
    order_id: int,
    req: PaymentProcessRequest,
    db: Session = Depends(get_db)
):
    """
    Secure server-side payment completion & verification for COD or Direct flows.
    Processes transaction, sets status to PAYMENT_CONFIRMED, creates payment record,
    commits stock atomically, creates invoice, logs event, and sends confirmation email and WhatsApp.
    """
    from app.services.inventory import commit_stock_reservation
    from app.services.invoice import create_or_get_invoice

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Idempotency check: if already confirmed, return safely
    if order.payment_status in ["PAID", "SUCCESS"] and order.order_status in ["PAYMENT_CONFIRMED", "ACCEPTED", "PREPARING", "SHIPPED"]:
        backup_order_to_json_file(order)
        return order

    is_cod = req.payment_method.upper() == "COD"
    txn_id = req.upi_id or req.transaction_id or generate_transaction_id(req.payment_method)
    
    # Create Payment record
    payment_record = Payment(
        order_id=order.id,
        provider="COD" if is_cod else "SANDBOX_GATEWAY",
        transaction_id=txn_id,
        payment_method=req.payment_method.upper(),
        amount=order.total_amount,
        currency="INR",
        status="PENDING" if is_cod else "SUCCESS",
        gateway_response_reference=f"GW-REF-{uuid.uuid4().hex[:12].upper()}",
        paid_at=None if is_cod else datetime.utcnow()
    )
    db.add(payment_record)
    
    # Update Order
    order.payment_status = "PENDING" if is_cod else "SUCCESS"
    order.order_status = "PAYMENT_CONFIRMED"
    order.transaction_id = txn_id
    order.gateway_reference = payment_record.gateway_response_reference
    order.paid_at = None if is_cod else datetime.utcnow()
    order.payment_method = req.payment_method.upper()
    
    # Commit Stock Reservation: RESERVED -> SOLD & Deduct Inventory
    commit_stock_reservation(db, order)

    # Generate Financial Invoice
    create_or_get_invoice(db, order, transaction_id=txn_id)
    
    # Log timeline event
    msg = f"Cash on Delivery order confirmed (₹{order.total_amount:,.2f}). To be collected upon delivery." if is_cod else f"Payment of ₹{order.total_amount:,.2f} confirmed via {req.payment_method.upper()} (Txn ID: {txn_id})."
    db.add(OrderEvent(
        order_id=order.id,
        event_type="ORDER_CONFIRMED" if is_cod else "PAYMENT_RECEIVED",
        previous_status="PENDING_PAYMENT",
        new_status="PAYMENT_CONFIRMED",
        message=msg,
        performed_by="Customer / Gateway"
    ))
    
    db.commit()
    db.refresh(order)
    
    # Trigger transactional confirmation email
    try:
        send_payment_confirmed_email(order)
        db.commit()
        db.refresh(order)
    except Exception as e:
        print(f"[EMAIL SEND ERROR] {e}")

    # Trigger simultaneous WhatsApp confirmation
    try:
        send_whatsapp_order_confirmation(order)
    except Exception as e:
        print(f"[WHATSAPP SEND ERROR] {e}")

    # Write persistent secure JSON dossier backup to disk
    backup_order_to_json_file(order)
    
    return order


@router.get("/{order_id}/whatsapp-link")
def get_order_whatsapp_dispatch_link(
    order_id: int,
    db: Session = Depends(get_db)
):
    """
    Generates a pre-formatted WhatsApp message link for this order.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    url = generate_customer_whatsapp_url(order)
    msg = format_order_whatsapp_message(order)
    return {
        "order_number": order.order_number,
        "phone": order.customer_phone,
        "whatsapp_url": url,
        "message": msg
    }


@router.get("/lookup/{order_number}", response_model=OrderOut)
def lookup_order(
    order_number: str,
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(
        (Order.order_number == order_number) | (Order.id == int(order_number) if order_number.isdigit() else False)
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


# ═══════════════════════════════════════════════════════════════════
# ADMIN ORDERS MANAGEMENT & CLASSIFIED JSON BACKUP CONTROLLERS
# ═══════════════════════════════════════════════════════════════════

@router.get("/admin/export-json")
def admin_export_all_orders_json(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Exports all confidential orders in full JSON structure for encrypted backup and archival.
    """
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    export_payload = {
        "agency": "DETECTIVE ZONE",
        "archive_classification": "CONFIDENTIAL_CASE_ORDER_REGISTRY",
        "exported_at": datetime.utcnow().isoformat(),
        "exported_by": current_admin.email,
        "total_records": len(orders),
        "orders": [order_to_dict(o) for o in orders]
    }
    return export_payload


@router.get("/admin/{order_id}/export-json")
def admin_export_single_order_json(
    order_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Exports a single confidential order dossier in JSON format.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order_to_dict(order)


@router.get("/admin/all", response_model=List[OrderOut])
def admin_list_orders(
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = None,
    sort_by: Optional[str] = "newest",
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    query = db.query(Order)
    
    if status_filter and status_filter.upper() != "ALL":
        query = query.filter(Order.order_status == status_filter.upper())
        
    if search:
        search_pat = f"%{search.strip()}%"
        query = query.filter(
            (Order.order_number.ilike(search_pat)) |
            (Order.customer_name.ilike(search_pat)) |
            (Order.customer_email.ilike(search_pat)) |
            (Order.transaction_id.ilike(search_pat))
        )
        
    if sort_by == "oldest":
        query = query.order_by(Order.created_at.asc())
    elif sort_by == "highest":
        query = query.order_by(Order.total_amount.desc())
    elif sort_by == "lowest":
        query = query.order_by(Order.total_amount.asc())
    else:
        query = query.order_by(Order.created_at.desc())
        
    return query.all()


@router.get("/admin/{order_id}", response_model=OrderOut)
def admin_get_order(
    order_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("/admin/{order_id}/accept", response_model=OrderOut)
@router.put("/admin/{order_id}/accept", response_model=OrderOut)
def admin_accept_order(
    order_id: int,
    req: OrderAccept,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Admin accepts the order and sets the confirmed delivery date.
    Triggers the customer order acceptance email with delivery date.
    Strictly verifies admin permission, order existence, payment status, and idempotency.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Verify order state machine & idempotency
    if order.order_status == "ACCEPTED":
        raise HTTPException(status_code=400, detail="This order has already been accepted.")
    
    if order.order_status in ["CANCELLED", "REFUNDED"]:
        raise HTTPException(status_code=400, detail=f"Cannot accept a {order.order_status.lower()} order.")
        
    if order.payment_status not in ["SUCCESS", "PENDING"]:
        raise HTTPException(status_code=400, detail="Cannot accept an order with unverified payment.")
    
    prev_status = order.order_status
    order.order_status = "ACCEPTED"
    order.expected_delivery_date = req.expected_delivery_date.strip()
    order.accepted_at = datetime.utcnow()
    order.accepted_by = current_admin.email
    if req.notes:
        order.notes = req.notes
        
    db.add(OrderEvent(
        order_id=order.id,
        event_type="ORDER_ACCEPTED",
        previous_status=prev_status,
        new_status="ACCEPTED",
        message=f"Order officially accepted. Expected delivery date scheduled for {order.expected_delivery_date}.",
        performed_by=f"Admin ({current_admin.email})"
    ))
    
    db.commit()
    db.refresh(order)
    
    # Dispatch official acceptance & confirmation email
    try:
        send_order_accepted_email(order)
        db.commit()
        db.refresh(order)
    except Exception as e:
        print(f"[ACCEPT EMAIL ERROR] {e}")

    # Dispatch official acceptance WhatsApp notification
    try:
        send_whatsapp_order_accepted(order, order.expected_delivery_date)
    except Exception as e:
        print(f"[ACCEPT WHATSAPP ERROR] {e}")

    # Write persistent secure JSON dossier backup to disk
    backup_order_to_json_file(order)
    
    log_admin_action(
        db, "ACCEPT_ORDER", "Order", str(order.id),
        f"Accepted order #{order.order_number} for delivery on {order.expected_delivery_date}",
        current_admin
    )
    return order


@router.put("/admin/{order_id}/edit", response_model=OrderOut)
def admin_edit_order_details(
    order_id: int,
    req: OrderAdminEdit,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Allows admin to edit customer profile, delivery address, courier and tracking info directly.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    for key, val in req.dict(exclude_unset=True).items():
        if val is not None:
            setattr(order, key, val)
            
    db.add(OrderEvent(
        order_id=order.id,
        event_type="ORDER_EDITED",
        previous_status=order.order_status,
        new_status=order.order_status,
        message=f"Order dossier details updated by administrator ({current_admin.email}).",
        performed_by=f"Admin ({current_admin.email})"
    ))
    db.commit()
    db.refresh(order)
    backup_order_to_json_file(order)
    
    log_admin_action(
        db, "EDIT_ORDER", "Order", str(order.id),
        f"Edited dossier details for order #{order.order_number}",
        current_admin
    )
    return order


@router.post("/admin/{order_id}/retry-email", response_model=OrderOut)
def admin_retry_order_email(
    order_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Allows admin to manually trigger/retry sending the order confirmation email.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    send_order_accepted_email(order, force=True)
    db.commit()
    db.refresh(order)
    
    log_admin_action(
        db, "RETRY_EMAIL", "Order", str(order.id),
        f"Retried confirmation email for order #{order.order_number}",
        current_admin
    )
    return order


@router.post("/admin/email/test")
def admin_test_email(
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Sends a test email to the authenticated admin to verify SMTP configuration and live delivery.
    """
    return test_smtp_connection(to_email=current_admin.email)


@router.put("/admin/{order_id}/status", response_model=OrderOut)
def admin_update_order_status(
    order_id: int,
    req: OrderStatusUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    prev_status = order.order_status
    prev_delivery_date = order.expected_delivery_date

    for key, val in req.dict(exclude_unset=True).items():
        if val is not None:
            setattr(order, key, val)
            
    # If delivery date changed on an already accepted order, notify customer via Email & WhatsApp
    if req.expected_delivery_date and req.expected_delivery_date != prev_delivery_date and order.order_status != "PENDING_PAYMENT":
        db.add(OrderEvent(
            order_id=order.id,
            event_type="DELIVERY_DATE_CHANGED",
            previous_status=prev_status,
            new_status=order.order_status,
            message=f"Delivery date updated from '{prev_delivery_date}' to '{order.expected_delivery_date}'.",
            performed_by=f"Admin ({current_admin.email})"
        ))
        try:
            send_delivery_date_updated_email(order, order.expected_delivery_date)
        except Exception as e:
            print(f"[DELIVERY UPDATE EMAIL ERROR] {e}")

    if req.order_status and req.order_status != prev_status:
        db.add(OrderEvent(
            order_id=order.id,
            event_type="STATUS_UPDATED",
            previous_status=prev_status,
            new_status=req.order_status,
            message=f"Order status progressed to {req.order_status}.",
            performed_by=f"Admin ({current_admin.email})"
        ))
        # Trigger simultaneous Email & WhatsApp updates on state change
        try:
            send_order_status_update_email(order, req.order_status, req.tracking_number, req.shipping_carrier)
        except Exception as e:
            print(f"[STATUS EMAIL ERROR] {e}")
            
        try:
            send_whatsapp_status_update(order, req.order_status, req.tracking_number, req.shipping_carrier)
        except Exception as e:
            print(f"[STATUS WHATSAPP ERROR] {e}")
        
    db.commit()
    db.refresh(order)
    backup_order_to_json_file(order)
    
    log_admin_action(
        db, "UPDATE_STATUS", "Order", str(order.id),
        f"Updated order #{order.order_number} to {order.order_status}",
        current_admin
    )
    return order


@router.post("/admin/{order_id}/cancel", response_model=OrderOut)
def admin_cancel_order(
    order_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    prev = order.order_status
    order.order_status = "CANCELLED"
    if order.payment_status == "SUCCESS":
        order.payment_status = "REFUNDED"
        
    db.add(OrderEvent(
        order_id=order.id,
        event_type="ORDER_CANCELLED",
        previous_status=prev,
        new_status="CANCELLED",
        message=f"Order cancelled by administration.",
        performed_by=f"Admin ({current_admin.email})"
    ))
    db.commit()
    db.refresh(order)
    
    log_admin_action(
        db, "CANCEL_ORDER", "Order", str(order.id),
        f"Cancelled order #{order.order_number}",
        current_admin
    )
    return order


@router.delete("/admin/{order_id}")
def admin_delete_order(
    order_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Delete related records
    db.query(OrderItem).filter(OrderItem.order_id == order.id).delete()
    db.query(OrderEvent).filter(OrderEvent.order_id == order.id).delete()
    db.query(Payment).filter(Payment.order_id == order.id).delete()
    db.delete(order)
    db.commit()
    
    log_admin_action(
        db, "DELETE_ORDER", "Order", str(order_id),
        f"Deleted order #{order.order_number}",
        current_admin
    )
    return {"status": "success", "message": f"Order #{order.order_number} deleted successfully"}
