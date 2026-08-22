from app.core.database import SessionLocal
from app.models.order import Order
from app.api.v1.orders import create_order, process_order_payment
from app.schemas.order import OrderCreate, OrderItemCreate, PaymentProcessRequest

db = SessionLocal()
try:
    print("Placing Cash on Delivery Order...")
    test_req = OrderCreate(
        customer_name="Agent Priya Sharma",
        customer_email="priya.sharma@example.com",
        customer_phone="+91 98765 43210",
        shipping_address="Villa 42, Palm Meadows, Whitefield",
        city="Bengaluru",
        state="Karnataka",
        postal_code="560066",
        country="India",
        payment_method="COD",
        items=[
            OrderItemCreate(
                product_id=None,
                item_title="Case 001 - The St. Jude Enigma Physical Box",
                sku="CASE-001-PHYS",
                image_url="/assets/case-001.png",
                unit_price=1499.0,
                quantity=1
            )
        ]
    )
    
    order = create_order(req=test_req, db=db)
    print(f"Created order #{order.order_number}")
    
    # Process confirmation
    pay_req = PaymentProcessRequest(payment_method="COD")
    confirmed = process_order_payment(order_id=order.id, req=pay_req, db=db)
    print(f"Confirmed Order #{confirmed.order_number} for {confirmed.customer_email}")
finally:
    db.close()
