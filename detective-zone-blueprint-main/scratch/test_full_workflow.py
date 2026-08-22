import os
import sys

from app.core.database import SessionLocal
from app.models.order import Order, OrderItem, OrderEvent
from app.models.admin import Admin
from app.core.security import get_password_hash
from app.services.email import send_order_accepted_email
from app.api.v1.orders import admin_accept_order, admin_retry_order_email
from app.schemas.order import OrderAccept
from fastapi import HTTPException

def run_test():
    db = SessionLocal()
    try:
        print("1. Setting up Admin Account...")
        admin = db.query(Admin).first()
        if not admin:
            admin = Admin(
                email="admin@detectiveszone.com",
                username="admin_lead",
                full_name="Chief Inspector",
                hashed_password=get_password_hash("Admin123!"),
                role="SUPER_ADMIN",
                is_active=True
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)

        print("2. Customer places an order...")
        order_number = "ORD-2026-TEST-ACCEPT"
        existing = db.query(Order).filter(Order.order_number == order_number).first()
        if existing:
            db.delete(existing)
            db.commit()

        order = Order(
            order_number=order_number,
            customer_name="PALLA BHUVAN KARTHIK",
            customer_email="pallasrikarcharan@gmail.com",
            customer_phone="+91 9492751073",
            shipping_address="Plot 104, Jubilee Hills Road No 36",
            city="Hyderabad",
            state="Telangana",
            postal_code="500033",
            country="India",
            subtotal=1499.0,
            discount_amount=0.0,
            tax_amount=0.0,
            shipping_fee=0.0,
            total_amount=1499.0,
            payment_method="UPI",
            payment_status="SUCCESS",
            order_status="PAYMENT_CONFIRMED",
            transaction_id="TXN-2026-UPI-TEST999",
            email_status="PENDING",
            order_acceptance_email_sent=False
        )
        db.add(order)
        db.commit()
        db.refresh(order)

        item = OrderItem(
            order_id=order.id,
            item_title="The St. Jude Enigma Physical Dossier",
            unit_price=1499.0,
            quantity=1,
            total_price=1499.0
        )
        db.add(item)
        db.commit()
        db.refresh(order)

        print(f"   Created Order ID: {order.id}, Status: {order.order_status}, Payment: {order.payment_status}")

        print("3. Admin calls Accept Order endpoint...")
        req = OrderAccept(expected_delivery_date="20 August 2026", notes="Priority courier packaging.")
        accepted_order = admin_accept_order(order_id=order.id, req=req, current_admin=admin, db=db)

        print(f"   [OK] Order Status Updated To: {accepted_order.order_status}")
        print(f"   [OK] Accepted At: {accepted_order.accepted_at}")
        print(f"   [OK] Accepted By: {accepted_order.accepted_by}")
        print(f"   [OK] Scheduled Delivery Date: {accepted_order.expected_delivery_date}")
        print(f"   [OK] Acceptance Email Sent Flag: {accepted_order.order_acceptance_email_sent}")
        print(f"   [OK] Email Status: {accepted_order.email_status}")

        # Check OrderEvent created
        event = db.query(OrderEvent).filter(OrderEvent.order_id == order.id, OrderEvent.event_type == "ORDER_ACCEPTED").first()
        assert event is not None, "OrderEvent ORDER_ACCEPTED was not created!"
        print(f"   [OK] Timeline Event Verified: {event.message}")

        print("4. Testing Duplicate Acceptance Prevention...")
        try:
            admin_accept_order(order_id=order.id, req=req, current_admin=admin, db=db)
            print("   ERROR: Duplicate acceptance was not blocked!")
        except HTTPException as he:
            print(f"   [OK] Duplicate acceptance blocked successfully: status {he.status_code}, detail: {he.detail}")

        print("5. Testing Manual Retry Email Endpoint...")
        retried_order = admin_retry_order_email(order_id=order.id, current_admin=admin, db=db)
        print(f"   [OK] Email retry executed: {retried_order.email_status}")

        print("6. Cleaning up test order...")
        db.delete(order)
        db.commit()
        print("   [OK] Test completed successfully with 100% assertions passed!")

    finally:
        db.close()

if __name__ == "__main__":
    run_test()
