from app.core.database import SessionLocal
from app.models.order import Order, OrderItem, Payment, OrderEvent
from app.models.product import Product
from app.api.v1.orders import create_order
from app.schemas.order import OrderCreate, OrderItemCreate

db = SessionLocal()
try:
    print("Checking database connection...")
    order_count = db.query(Order).count()
    print(f"Total orders in DB: {order_count}")
    
    # Test creating order
    test_req = OrderCreate(
        customer_name="John Doe",
        customer_email="john@example.com",
        customer_phone="9876543210",
        shipping_address="123 Crime Alley",
        city="Mumbai",
        state="Maharashtra",
        postal_code="400001",
        country="India",
        payment_method="COD",
        items=[
            OrderItemCreate(
                product_id=None,
                item_title="Case 001 - The St. Jude Enigma",
                sku="CASE-001",
                image_url="/assets/case-001.png",
                unit_price=1499.0,
                quantity=1
            )
        ]
    )
    
    order = create_order(req=test_req, db=db)
    print(f"Successfully created test order ID: {order.id}, Number: {order.order_number}, Status: {order.order_status}")
    
    # Verify it can be listed
    orders = db.query(Order).all()
    print(f"Orders in DB now: {len(orders)}")
    for o in orders[-3:]:
        print(f" - #{o.order_number}: {o.customer_name} ({o.payment_method}) -> Status: {o.order_status}, Total: {o.total_amount}")
        
finally:
    db.close()
