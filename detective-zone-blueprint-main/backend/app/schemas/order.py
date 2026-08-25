from pydantic import BaseModel
from typing import Optional, List, Union, Any
from datetime import datetime

class OrderItemCreate(BaseModel):
    product_id: Optional[Any] = None
    kit_id: Optional[Any] = None
    item_title: str
    sku: Optional[str] = None
    image_url: Optional[str] = None
    unit_price: float = 999.0
    quantity: int = 1

class OrderItemOut(BaseModel):
    id: int
    order_id: int
    product_id: Optional[int] = None
    kit_id: Optional[int] = None
    item_title: str
    sku: Optional[str] = None
    image_url: Optional[str] = None
    unit_price: float
    quantity: int
    total_price: float

    class Config:
        from_attributes = True

class OrderEventOut(BaseModel):
    id: int
    order_id: int
    event_type: str
    previous_status: Optional[str] = None
    new_status: Optional[str] = None
    message: str
    performed_by: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class PaymentOut(BaseModel):
    id: int
    order_id: int
    provider: str
    transaction_id: str
    payment_method: str
    amount: float
    currency: str
    status: str
    gateway_response_reference: Optional[str] = None
    paid_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    shipping_address: str
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: str = "India"
    payment_method: str = "UPI" # UPI, CARD, COD
    coupon_code: Optional[str] = None
    notes: Optional[str] = None
    items: List[OrderItemCreate]

class OrderStatusUpdate(BaseModel):
    order_status: Optional[str] = None
    payment_status: Optional[str] = None
    expected_delivery_date: Optional[str] = None
    tracking_number: Optional[str] = None
    shipping_carrier: Optional[str] = None
    notes: Optional[str] = None

class OrderAccept(BaseModel):
    expected_delivery_date: str # e.g. "24 August 2026"
    notes: Optional[str] = None

class OrderAdminEdit(BaseModel):
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    shipping_address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    expected_delivery_date: Optional[str] = None
    tracking_number: Optional[str] = None
    courier_name: Optional[str] = None
    order_status: Optional[str] = None
    payment_status: Optional[str] = None
    notes: Optional[str] = None

class PaymentProcessRequest(BaseModel):
    payment_method: str = "UPI"
    upi_id: Optional[str] = None
    transaction_id: Optional[str] = None
    card_last4: Optional[str] = None

class OrderOut(BaseModel):
    id: int
    order_number: str
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    shipping_address: str
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: str
    subtotal: float
    discount_amount: float
    tax_amount: float
    shipping_fee: float
    total_amount: float
    currency: str
    coupon_code: Optional[str] = None
    payment_status: str
    order_status: str
    payment_method: Optional[str] = None
    transaction_id: Optional[str] = None
    gateway_reference: Optional[str] = None
    paid_at: Optional[datetime] = None
    expected_delivery_date: Optional[str] = None
    tracking_number: Optional[str] = None
    shipping_carrier: Optional[str] = None
    accepted_at: Optional[datetime] = None
    accepted_by: Optional[str] = None
    email_status: Optional[str] = "PENDING"
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemOut] = []
    events: List[OrderEventOut] = []
    payments: List[PaymentOut] = []

    class Config:
        from_attributes = True

class PaymentCreateRequest(BaseModel):
    order_id: int
    payment_method: str = "UPI"
    redirect_url: Optional[str] = None

class PaymentCreateResponse(BaseModel):
    success: bool = True
    merchant_transaction_id: str
    order_id: int
    order_number: str
    amount: float
    currency: str = "INR"
    upi_id: str
    qr_payload: str
    qr_image_url: str
    payment_url: Optional[str] = None
    redirect_url: Optional[str] = None
    status: str = "PENDING"
    expires_in_seconds: int = 600
    payment_created_at: Optional[datetime] = None
    payment_expires_at: Optional[datetime] = None

class PaymentStatusResponse(BaseModel):
    merchant_transaction_id: str
    order_id: int
    order_number: str
    amount: float
    currency: str = "INR"
    payment_status: str # PENDING, PAID, FAILED, EXPIRED, SUCCESS
    order_status: str # PENDING_PAYMENT, PAYMENT_CONFIRMED, PAYMENT_FAILED, EXPIRED
    provider: str = "PHONEPE"
    provider_transaction_id: Optional[str] = None
    verified_at: Optional[datetime] = None
    paid_at: Optional[datetime] = None
    payment_created_at: Optional[datetime] = None
    payment_expires_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    seconds_remaining: Optional[int] = None
    is_expired: bool = False
    message: str

class PhonePeWebhookRequest(BaseModel):
    response: str # Base64 encoded payload from PhonePe

class AdminReconcilePaymentRequest(BaseModel):
    reason: str
    provider_transaction_id: Optional[str] = None
    action: str = "CONFIRM_PAYMENT" # CONFIRM_PAYMENT, MARK_FAILED

class SubmitUtrRequest(BaseModel):
    utr_number: str

class RazorpayCreateOrderRequest(BaseModel):
    order_id: int

class RazorpayCreateOrderResponse(BaseModel):
    success: bool = True
    key_id: str
    order_id: int
    order_number: str
    razorpay_order_id: str
    amount: float
    amount_in_paise: int
    currency: str = "INR"
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    payment_url: Optional[str] = None

class RazorpayVerifyRequest(BaseModel):
    order_id: int
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: str
    razorpay_signature: str
    razorpay_payment_link_id: Optional[str] = None
    razorpay_payment_link_reference_id: Optional[str] = None
    razorpay_payment_link_status: Optional[str] = None

class RazorpayVerifyResponse(BaseModel):
    success: bool = True
    order_id: int
    order_number: str
    payment_status: str
    order_status: str
    razorpay_payment_id: str
    amount: float
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    message: str
