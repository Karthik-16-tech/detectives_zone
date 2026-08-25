from sqlalchemy.orm import Session
from datetime import datetime
import random

from app.models.order import Order, Invoice


def generate_invoice_number(order_number: str) -> str:
    """Creates formatted invoice number matching order sequence."""
    clean_num = order_number.replace("ORD-", "")
    return f"INV-{clean_num}"


def create_or_get_invoice(db: Session, order: Order, transaction_id: str = None) -> Invoice:
    """
    Generates and saves immutable financial invoice record for confirmed order.
    Idempotent.
    """
    existing = db.query(Invoice).filter(Invoice.order_id == order.id).first()
    if existing:
        return existing

    invoice = Invoice(
        order_id=order.id,
        invoice_number=generate_invoice_number(order.order_number),
        subtotal=order.subtotal,
        discount_amount=order.discount_amount or 0.0,
        tax_amount=order.tax_amount or 0.0,
        shipping_fee=order.shipping_fee or 0.0,
        total_amount=order.total_amount,
        currency=order.currency or "INR",
        payment_method=order.payment_method or "UPI",
        transaction_id=transaction_id or order.transaction_id or order.gateway_reference,
        customer_name=order.customer_name,
        customer_email=order.customer_email,
        customer_phone=order.customer_phone,
        billing_address=f"{order.shipping_address}, {order.city or ''}, {order.state or ''} - {order.postal_code or ''}, {order.country or 'India'}",
        issued_at=datetime.utcnow(),
        created_at=datetime.utcnow()
    )
    db.add(invoice)
    db.flush()
    return invoice
