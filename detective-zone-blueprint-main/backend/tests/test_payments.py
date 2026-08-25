import pytest
import os
import sys
import json
import base64
import hashlib
from datetime import datetime, timedelta

# Ensure backend root is in sys.path
backend_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.core.database import Base, get_db
from app.models.product import Product
from app.models.order import Order, OrderItem, Payment, StockReservation, PaymentWebhook, Invoice
from app.services.phonepe import phonepe_service
from app.services.inventory import (
    reserve_stock_for_order, commit_stock_reservation, release_stock_reservation,
    cleanup_expired_reservations, get_available_stock
)
from app.services.invoice import create_or_get_invoice
from app.main import app

from sqlalchemy.pool import StaticPool

# Test SQLite in-memory engine with StaticPool
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

Base.metadata.create_all(bind=test_engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)
    yield


def create_sample_product(db, name="The Last Voicemail Case Kit", price=1199.0, stock=10):
    prod = Product(
        name=name,
        slug="the-last-voicemail",
        price=price,
        sale_price=price,
        sku="CASE 001",
        stock_quantity=stock,
        is_published=True
    )
    db.add(prod)
    db.commit()
    db.refresh(prod)
    return prod


def test_server_side_price_calculation_and_stock_reservation():
    """Test 1: Backend recalculates prices from DB and reserves stock for 10 minutes without deducting permanently."""
    db = TestingSessionLocal()
    prod = create_sample_product(db, stock=5)

    order_payload = {
        "customer_name": "Detective Sherlock",
        "customer_email": "sherlock@221b.co.uk",
        "customer_phone": "9876543210",
        "shipping_address": "221B Baker Street",
        "city": "London",
        "state": "London",
        "postal_code": "NW16XE",
        "payment_method": "UPI",
        "items": [
            {
                "product_id": prod.id,
                "item_title": "Forged Title",
                "sku": "CASE 001",
                "unit_price": 1.0, # Attempted client-side price tampering (₹1 instead of ₹1199)
                "quantity": 2
            }
        ]
    }

    resp = client.post("/api/v1/orders", json=order_payload)
    assert resp.status_code in [200, 201]
    data = resp.json()

    # Verify price was recalculated from DB (2 * 1199 = 2398)
    assert data["subtotal"] == 2398.0
    assert data["order_status"] == "PENDING_PAYMENT"
    assert data["payment_status"] == "PENDING"

    # Verify stock reservation exists and is RESERVED
    reservations = db.query(StockReservation).filter(StockReservation.order_id == data["id"]).all()
    assert len(reservations) == 1
    assert reservations[0].quantity == 2
    assert reservations[0].status == "RESERVED"

    # Available stock should be 5 - 2 = 3, but product.stock_quantity is still 5
    db.refresh(prod)
    assert prod.stock_quantity == 5
    assert get_available_stock(db, prod.id) == 3


def test_payment_creation_and_checksum_integrity():
    """Test 2: PhonePe transaction creation generates valid checksum and 10-minute expiry."""
    db = TestingSessionLocal()
    prod = create_sample_product(db)

    order_resp = client.post("/api/v1/orders", json={
        "customer_name": "John Watson",
        "customer_email": "watson@221b.co.uk",
        "customer_phone": "9876543210",
        "shipping_address": "221B Baker Street",
        "payment_method": "UPI",
        "items": [{"product_id": prod.id, "item_title": prod.name, "sku": prod.sku, "quantity": 1}]
    })
    order_id = order_resp.json()["id"]

    pay_resp = client.post("/api/v1/payments/create", json={"order_id": order_id, "payment_method": "UPI"})
    assert pay_resp.status_code == 201
    pay_data = pay_resp.json()

    assert pay_data["merchant_transaction_id"].startswith("MTXN_")
    assert pay_data["status"] == "PENDING"
    assert pay_data["expires_in_seconds"] == 600
    assert "upi://" in pay_data["qr_payload"]


def test_idempotent_order_confirmation_and_stock_commitment():
    """Test 3: Webhook verification commits stock (RESERVED -> SOLD), creates invoice, and is strictly idempotent."""
    db = TestingSessionLocal()
    prod = create_sample_product(db, stock=5)

    order_resp = client.post("/api/v1/orders", json={
        "customer_name": "Irene Adler",
        "customer_email": "adler@bohemia.com",
        "customer_phone": "9876543210",
        "shipping_address": "Kensington",
        "payment_method": "UPI",
        "items": [{"product_id": prod.id, "item_title": prod.name, "sku": prod.sku, "quantity": 2}]
    })
    order_id = order_resp.json()["id"]

    pay_resp = client.post("/api/v1/payments/create", json={"order_id": order_id, "payment_method": "UPI"})
    merchant_txn_id = pay_resp.json()["merchant_transaction_id"]

    # Construct PhonePe webhook payload
    webhook_raw = {
        "code": "PAYMENT_SUCCESS",
        "data": {
            "merchantTransactionId": merchant_txn_id,
            "transactionId": "PPE_TXN_998877",
            "amount": int(round(1199.0 * 2 * 100))
        }
    }
    b64_payload = base64.b64encode(json.dumps(webhook_raw).encode("utf-8")).decode("utf-8")

    # Generate valid X-VERIFY signature
    raw_sig_str = f"{b64_payload}{phonepe_service.salt_key}"
    sig = hashlib.sha256(raw_sig_str.encode("utf-8")).hexdigest() + f"###{phonepe_service.salt_index}"

    # First Webhook Delivery
    wb_resp1 = client.post(
        "/api/v1/payments/phonepe/webhook",
        json={"response": b64_payload},
        headers={"X-VERIFY": sig}
    )
    assert wb_resp1.status_code == 200
    assert wb_resp1.json()["success"] is True

    # Verify Order is CONFIRMED and stock is SOLD
    order = db.query(Order).filter(Order.id == order_id).first()
    assert order.order_status == "PAYMENT_CONFIRMED"
    assert order.payment_status == "PAID"

    db.refresh(prod)
    assert prod.stock_quantity == 3 # 5 - 2 = 3

    # Verify Invoice was created
    invoice = db.query(Invoice).filter(Invoice.order_id == order_id).first()
    assert invoice is not None
    assert invoice.total_amount == 2398.0

    # Second Webhook Delivery (Duplicate / Retry)
    wb_resp2 = client.post(
        "/api/v1/payments/phonepe/webhook",
        json={"response": b64_payload},
        headers={"X-VERIFY": sig}
    )
    assert wb_resp2.status_code == 200

    # Stock must NOT be deducted again
    db.refresh(prod)
    assert prod.stock_quantity == 3


def test_payment_expiration_and_stock_release():
    """Test 4: Expired payment sessions release stock reservations back to available."""
    db = TestingSessionLocal()
    prod = create_sample_product(db, stock=5)

    order_resp = client.post("/api/v1/orders", json={
        "customer_name": "Mycroft Holmes",
        "customer_email": "mycroft@diogenes.club",
        "shipping_address": "Pall Mall",
        "payment_method": "UPI",
        "items": [{"product_id": prod.id, "item_title": prod.name, "sku": prod.sku, "quantity": 3}]
    })
    order_id = order_resp.json()["id"]

    pay_resp = client.post("/api/v1/payments/create", json={"order_id": order_id, "payment_method": "UPI"})
    merchant_txn_id = pay_resp.json()["merchant_transaction_id"]

    # Artificially expire the order and payment
    order = db.query(Order).filter(Order.id == order_id).first()
    payment = db.query(Payment).filter(Payment.transaction_id == merchant_txn_id).first()
    res = db.query(StockReservation).filter(StockReservation.order_id == order_id).first()

    past_time = datetime.utcnow() - timedelta(minutes=15)
    order.expires_at = past_time
    payment.expires_at = past_time
    res.expires_at = past_time
    db.commit()

    # Status check triggers expiration
    status_resp = client.get(f"/api/v1/payments/{merchant_txn_id}/status")
    assert status_resp.status_code == 200
    assert status_resp.json()["payment_status"] == "EXPIRED"

    # Verify stock reservation was RELEASED and available stock restored
    db.refresh(prod)
    assert prod.stock_quantity == 5
    assert get_available_stock(db, prod.id) == 5


def test_payment_retry_flow():
    """Test 5: Retrying payment creates fresh 10-minute reservation and new transaction ID."""
    db = TestingSessionLocal()
    prod = create_sample_product(db, stock=5)

    order_resp = client.post("/api/v1/orders", json={
        "customer_name": "Professor Moriarty",
        "customer_email": "moriarty@reichenbach.ch",
        "shipping_address": "Reichenbach",
        "payment_method": "UPI",
        "items": [{"product_id": prod.id, "item_title": prod.name, "sku": prod.sku, "quantity": 1}]
    })
    order_id = order_resp.json()["id"]

    # First attempt
    client.post("/api/v1/payments/create", json={"order_id": order_id, "payment_method": "UPI"})

    # Customer retries payment
    retry_resp = client.post(f"/api/v1/orders/{order_id}/payment/retry")
    assert retry_resp.status_code == 200
    retry_data = retry_resp.json()

    assert retry_data["status"] == "PENDING"
    assert retry_data["expires_in_seconds"] == 600

    order = db.query(Order).filter(Order.id == order_id).first()
    assert order.order_status == "PENDING_PAYMENT"
    assert order.transaction_id == retry_data["merchant_transaction_id"]


def test_invalid_webhook_signature_rejected():
    """Test 6: PhonePe Webhook with invalid or spoofed X-VERIFY signature is rejected with 401."""
    db = TestingSessionLocal()
    prod = create_sample_product(db)

    order_resp = client.post("/api/v1/orders", json={
        "customer_name": "Scam Artist",
        "customer_email": "scam@fake.com",
        "shipping_address": "Nowhere",
        "payment_method": "UPI",
        "items": [{"product_id": prod.id, "item_title": prod.name, "sku": prod.sku, "quantity": 1}]
    })
    order_id = order_resp.json()["id"]
    pay_resp = client.post("/api/v1/payments/create", json={"order_id": order_id, "payment_method": "UPI"})
    merchant_txn_id = pay_resp.json()["merchant_transaction_id"]

    webhook_raw = {
        "code": "PAYMENT_SUCCESS",
        "data": {
            "merchantTransactionId": merchant_txn_id,
            "transactionId": "FAKE_TXN_000",
            "amount": int(round(1199.0 * 100))
        }
    }
    b64_payload = base64.b64encode(json.dumps(webhook_raw).encode("utf-8")).decode("utf-8")

    # Temporarily set environment to UAT to enforce strict signature checks
    original_env = phonepe_service.env
    phonepe_service.env = "UAT"
    try:
        wb_resp = client.post(
            "/api/v1/payments/phonepe/webhook",
            json={"response": b64_payload},
            headers={"X-VERIFY": "INVALID_FORGED_SIGNATURE###1"}
        )
        assert wb_resp.status_code == 401
        assert "Invalid PhonePe webhook signature" in wb_resp.json()["detail"]

        # Order must remain PENDING_PAYMENT
        order = db.query(Order).filter(Order.id == order_id).first()
        assert order.payment_status == "PENDING"
    finally:
        phonepe_service.env = original_env


def test_webhook_amount_mismatch_rejected():
    """Test 7: Webhook payment amount mismatch (e.g. customer paid less) is rejected."""
    db = TestingSessionLocal()
    prod = create_sample_product(db, price=1199.0)

    order_resp = client.post("/api/v1/orders", json={
        "customer_name": "Cheap Customer",
        "customer_email": "cheap@domain.com",
        "shipping_address": "Address",
        "payment_method": "UPI",
        "items": [{"product_id": prod.id, "item_title": prod.name, "sku": prod.sku, "quantity": 1}]
    })
    order_id = order_resp.json()["id"]
    pay_resp = client.post("/api/v1/payments/create", json={"order_id": order_id, "payment_method": "UPI"})
    merchant_txn_id = pay_resp.json()["merchant_transaction_id"]

    # Customer only paid ₹100 instead of ₹1199
    webhook_raw = {
        "code": "PAYMENT_SUCCESS",
        "data": {
            "merchantTransactionId": merchant_txn_id,
            "transactionId": "PPE_TXN_SHORTPAY",
            "amount": 10000 # ₹100 in paise
        }
    }
    b64_payload = base64.b64encode(json.dumps(webhook_raw).encode("utf-8")).decode("utf-8")
    raw_sig_str = f"{b64_payload}{phonepe_service.salt_key}"
    sig = hashlib.sha256(raw_sig_str.encode("utf-8")).hexdigest() + f"###{phonepe_service.salt_index}"

    wb_resp = client.post(
        "/api/v1/payments/phonepe/webhook",
        json={"response": b64_payload},
        headers={"X-VERIFY": sig}
    )
    assert wb_resp.status_code == 400
    assert "amount does not match" in wb_resp.json()["detail"]

    # Order must be marked FAILED
    order = db.query(Order).filter(Order.id == order_id).first()
    assert order.payment_status == "FAILED"


def test_concurrent_stock_reservation_exhaustion():
    """Test 8: Concurrent purchase cannot reserve more than available stock."""
    db = TestingSessionLocal()
    prod = create_sample_product(db, stock=2)

    # Customer A reserves 2 items (entire inventory)
    order_a = client.post("/api/v1/orders", json={
        "customer_name": "Customer A",
        "customer_email": "a@domain.com",
        "shipping_address": "Street A",
        "payment_method": "UPI",
        "items": [{"product_id": prod.id, "item_title": prod.name, "sku": prod.sku, "quantity": 2}]
    })
    assert order_a.status_code == 201

    # Customer B tries to buy 1 item while Customer A's 10-minute reservation is active
    order_b = client.post("/api/v1/orders", json={
        "customer_name": "Customer B",
        "customer_email": "b@domain.com",
        "shipping_address": "Street B",
        "payment_method": "UPI",
        "items": [{"product_id": prod.id, "item_title": prod.name, "sku": prod.sku, "quantity": 1}]
    })
    assert order_b.status_code == 400
    assert "out of stock or currently reserved" in order_b.json()["detail"]


def test_submit_payment_utr_confirms_order():
    """Test 9: Customer submitting valid 12-digit UPI UTR receipt confirms order and commits stock."""
    db = TestingSessionLocal()
    prod = create_sample_product(db, stock=5)

    order_resp = client.post("/api/v1/orders", json={
        "customer_name": "UTR Customer",
        "customer_email": "utr@domain.com",
        "shipping_address": "Baker St",
        "payment_method": "UPI",
        "items": [{"product_id": prod.id, "item_title": prod.name, "sku": prod.sku, "quantity": 1}]
    })
    order_id = order_resp.json()["id"]
    pay_resp = client.post("/api/v1/payments/create", json={"order_id": order_id, "payment_method": "UPI"})
    merchant_txn_id = pay_resp.json()["merchant_transaction_id"]

    # 1. Invalid short UTR is rejected with 400
    invalid_utr = client.post(f"/api/v1/payments/{merchant_txn_id}/submit-utr", json={"utr_number": "123"})
    assert invalid_utr.status_code == 400

    # 2. Valid 12-digit UPI UTR confirms order immediately
    utr_resp = client.post(f"/api/v1/payments/{merchant_txn_id}/submit-utr", json={"utr_number": "423456789012"})
    assert utr_resp.status_code == 200
    assert utr_resp.json()["payment_status"] == "PAID"
    assert utr_resp.json()["provider_transaction_id"] == "UTR-423456789012"

    # Verify order is confirmed and stock is committed
    order = db.query(Order).filter(Order.id == order_id).first()
    assert order.order_status == "PAYMENT_CONFIRMED"
    assert order.payment_status == "PAID"

    db.refresh(prod)
    assert prod.stock_quantity == 4 # 5 - 1 = 4
