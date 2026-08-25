from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from fastapi import HTTPException

from app.models.product import Product
from app.models.order import Order, OrderItem, StockReservation, Payment, OrderEvent

RESERVATION_DURATION_MINUTES = 10


def get_active_reserved_quantity(db: Session, product_id: int) -> int:
    """
    Computes total quantity currently held under active (unexpired) reservations.
    """
    now = datetime.utcnow()
    reserved = db.query(func.coalesce(func.sum(StockReservation.quantity), 0)).filter(
        StockReservation.product_id == product_id,
        StockReservation.status == "RESERVED",
        StockReservation.expires_at > now
    ).scalar()
    return int(reserved or 0)


def get_available_stock(db: Session, product_id: int) -> int:
    """
    Computes truly available stock for a product:
    stock_quantity - active_unexpired_reservations
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product or product.stock_quantity is None:
        return 0
    reserved = get_active_reserved_quantity(db, product_id)
    return max(0, product.stock_quantity - reserved)


def reserve_stock_for_order(
    db: Session,
    order: Order,
    items: List[Dict[str, Any]],
    duration_minutes: int = RESERVATION_DURATION_MINUTES
) -> List[StockReservation]:
    """
    Creates temporary 10-minute stock reservations for an order.
    Validates stock availability atomically without permanently deducting.
    """
    now = datetime.utcnow()
    expires_at = now + timedelta(minutes=duration_minutes)
    
    # 1. Clean up any existing active reservations for this specific order
    existing = db.query(StockReservation).filter(
        StockReservation.order_id == order.id,
        StockReservation.status == "RESERVED"
    ).all()
    for res in existing:
        res.status = "RELEASED"
        res.released_at = now

    reservations = []

    # 2. Check and allocate reservations
    for item in items:
        prod_id = item.get("product_id")
        qty = int(item.get("quantity") or 1)
        if not prod_id or qty <= 0:
            continue

        # Fetch product
        product = db.query(Product).filter(Product.id == prod_id).first()
        if not product:
            continue

        if product.stock_quantity is not None:
            # Active reserved for other orders
            other_reserved = db.query(func.coalesce(func.sum(StockReservation.quantity), 0)).filter(
                StockReservation.product_id == prod_id,
                StockReservation.order_id != order.id,
                StockReservation.status == "RESERVED",
                StockReservation.expires_at > now
            ).scalar() or 0

            available = max(0, product.stock_quantity - int(other_reserved))
            if available < qty:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for '{product.name}'. Available: {available}, Requested: {qty}"
                )

        # Create reservation record
        res = StockReservation(
            order_id=order.id,
            product_id=prod_id,
            quantity=qty,
            status="RESERVED",
            expires_at=expires_at,
            created_at=now
        )
        db.add(res)
        reservations.append(res)

    order.expires_at = expires_at
    db.flush()
    return reservations


def commit_stock_reservation(db: Session, order: Order) -> None:
    """
    Atomically converts RESERVED stock to SOLD and deducts actual product stock quantity.
    Idempotent: will not double deduct if already committed.
    """
    reservations = db.query(StockReservation).filter(
        StockReservation.order_id == order.id
    ).all()

    for res in reservations:
        if res.status == "RESERVED":
            res.status = "SOLD"
            if res.product_id:
                product = db.query(Product).filter(Product.id == res.product_id).first()
                if product and product.stock_quantity is not None:
                    product.stock_quantity = max(0, product.stock_quantity - res.quantity)

    # Fallback for any items in order that didn't have a reservation record
    if not reservations:
        for oi in order.items:
            if oi.product_id:
                product = db.query(Product).filter(Product.id == oi.product_id).first()
                if product and product.stock_quantity is not None:
                    product.stock_quantity = max(0, product.stock_quantity - oi.quantity)


def release_stock_reservation(db: Session, order: Order, reason: str = "EXPIRED") -> None:
    """
    Releases any active stock reservations back to AVAILABLE inventory.
    """
    now = datetime.utcnow()
    reservations = db.query(StockReservation).filter(
        StockReservation.order_id == order.id,
        StockReservation.status == "RESERVED"
    ).all()

    for res in reservations:
        res.status = "RELEASED"
        res.released_at = now


def cleanup_expired_reservations(db: Session) -> int:
    """
    Sweeps database for expired pending orders (past 10-minute expiry window)
    and transitions them:
      Order: PENDING_PAYMENT -> EXPIRED
      Payment: PENDING -> EXPIRED
      StockReservation: RESERVED -> RELEASED
    Returns count of expired orders processed.
    """
    now = datetime.utcnow()
    expired_orders = db.query(Order).filter(
        Order.order_status == "PENDING_PAYMENT",
        Order.expires_at != None,
        Order.expires_at <= now
    ).all()

    count = 0
    for order in expired_orders:
        order.order_status = "EXPIRED"
        order.payment_status = "EXPIRED"
        
        # Release reservations
        release_stock_reservation(db, order, reason="EXPIRED")

        # Mark pending payments as expired
        for p in order.payments:
            if p.status == "PENDING":
                p.status = "EXPIRED"

        db.add(OrderEvent(
            order_id=order.id,
            event_type="PAYMENT_EXPIRED",
            previous_status="PENDING_PAYMENT",
            new_status="EXPIRED",
            message="Payment window (10 minutes) expired. Stock reservations have been released back to inventory.",
            performed_by="System Expiration Sweeper"
        ))
        count += 1

    if count > 0:
        db.commit()

    return count
