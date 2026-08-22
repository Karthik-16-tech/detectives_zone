from app.core.database import SessionLocal
from app.models.order import Order
from app.api.v1.orders import process_order_payment
from app.schemas.order import PaymentProcessRequest

db = SessionLocal()
try:
    order = db.query(Order).first()
    print(f"Found order ID {order.id}: {order.order_number}")
    
    # Process COD payment confirmation
    req = PaymentProcessRequest(
        payment_method="COD"
    )
    confirmed_order = process_order_payment(order_id=order.id, req=req, db=db)
    print(f"Confirmed Order: {confirmed_order.order_number}, Status: {confirmed_order.order_status}, Payment Status: {confirmed_order.payment_status}, Txn: {confirmed_order.transaction_id}")
    
finally:
    db.close()
