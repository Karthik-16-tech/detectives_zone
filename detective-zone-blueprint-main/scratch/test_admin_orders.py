from app.core.database import SessionLocal
from app.models.order import Order
from app.models.admin import Admin
from app.api.v1.orders import admin_list_orders

db = SessionLocal()
try:
    admin = db.query(Admin).first()
    if not admin:
        admin = Admin(email="admin@detectivezone.com", username="admin", role="admin")
    
    orders = admin_list_orders(status_filter="ALL", search=None, sort_by="newest", current_admin=admin, db=db)
    print(f"Admin retrieved {len(orders)} orders successfully:")
    for o in orders:
        print(f" -> #{o.order_number} | Customer: {o.customer_name} | Method: {o.payment_method} | Status: {o.order_status} | Txn: {o.transaction_id}")
finally:
    db.close()
