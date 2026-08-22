from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(100), unique=True, index=True, nullable=False) # e.g. "ORD-2026-00125"
    
    # Customer Info
    customer_name = Column(String(255), nullable=False)
    customer_email = Column(String(255), nullable=False, index=True)
    customer_phone = Column(String(50), nullable=True)
    
    # Shipping Info
    shipping_address = Column(Text, nullable=False)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    postal_code = Column(String(50), nullable=True)
    country = Column(String(100), default="India")
    
    # Financials (Computed strictly by backend)
    subtotal = Column(Float, nullable=False, default=0.0)
    discount_amount = Column(Float, nullable=False, default=0.0)
    tax_amount = Column(Float, nullable=False, default=0.0)
    shipping_fee = Column(Float, nullable=False, default=0.0)
    total_amount = Column(Float, nullable=False, default=0.0)
    currency = Column(String(10), default="INR")
    coupon_code = Column(String(50), nullable=True)
    
    # Statuses
    # payment_status: PENDING, SUCCESS, FAILED, CANCELLED, REFUNDED
    payment_status = Column(String(50), default="PENDING", index=True)
    # order_status: PENDING_PAYMENT, PAYMENT_CONFIRMED, ACCEPTED, PREPARING, PACKED, SHIPPED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
    order_status = Column(String(50), default="PENDING_PAYMENT", index=True)
    
    # Payment & Gateway info
    payment_method = Column(String(50), default="UPI") # UPI, CARD, NETBANKING, COD
    transaction_id = Column(String(100), unique=True, nullable=True, index=True)
    gateway_reference = Column(String(100), nullable=True)
    paid_at = Column(DateTime, nullable=True)
    
    # Delivery & Fulfillment
    expected_delivery_date = Column(String(50), nullable=True)
    tracking_number = Column(String(100), nullable=True)
    shipping_carrier = Column(String(100), nullable=True)
    accepted_at = Column(DateTime, nullable=True)
    accepted_by = Column(String(100), nullable=True)
    
    # Email Idempotency flags
    payment_success_email_sent = Column(Boolean, default=False)
    order_acceptance_email_sent = Column(Boolean, default=False)
    email_status = Column(String(50), default="PENDING") # PENDING, SENT, FAILED
    
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    events = relationship("OrderEvent", back_populates="order", cascade="all, delete-orphan", order_by="OrderEvent.created_at.desc()")
    payments = relationship("Payment", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, nullable=True)
    kit_id = Column(Integer, nullable=True)
    
    item_title = Column(String(255), nullable=False)
    sku = Column(String(100), nullable=True)
    image_url = Column(String(500), nullable=True)
    unit_price = Column(Float, nullable=False)
    quantity = Column(Integer, default=1)
    total_price = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")


class OrderEvent(Base):
    __tablename__ = "order_events"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    event_type = Column(String(50), nullable=False) # PAYMENT_RECEIVED, ORDER_ACCEPTED, STATUS_UPDATED, DELIVERY_DATE_CHANGED, etc.
    previous_status = Column(String(50), nullable=True)
    new_status = Column(String(50), nullable=True)
    message = Column(Text, nullable=False)
    performed_by = Column(String(100), nullable=True) # e.g. "System", "Admin: admin@detectiveszone.co"
    created_at = Column(DateTime, default=datetime.utcnow)

    order = relationship("Order", back_populates="events")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    provider = Column(String(50), default="PHONEPE") # PHONEPE, UPI, RAZORPAY, COD
    transaction_id = Column(String(100), unique=True, index=True, nullable=False) # Maps to merchant_transaction_id
    merchant_transaction_id = Column(String(100), index=True, nullable=True)
    provider_transaction_id = Column(String(100), index=True, nullable=True) # PhonePe transaction ID
    payment_method = Column(String(50), default="UPI")
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    status = Column(String(50), default="PENDING") # PENDING, PAYMENT_PROCESSING, SUCCESS, PAID, FAILED, EXPIRED
    upi_id = Column(String(100), nullable=True) # Merchant UPI ID used
    qr_payload = Column(Text, nullable=True)
    payment_url = Column(String(500), nullable=True)
    raw_response = Column(Text, nullable=True)
    gateway_response_reference = Column(String(255), nullable=True)
    verified_at = Column(DateTime, nullable=True)
    paid_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    order = relationship("Order", back_populates="payments")

