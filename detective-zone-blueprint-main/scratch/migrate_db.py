import sqlite3
import os

db_path = "detective_zone.db"
if not os.path.exists(db_path):
    print("DB not in current dir, searching...")
    for root, dirs, files in os.walk("."):
        if "detective_zone.db" in files:
            db_path = os.path.join(root, "detective_zone.db")
            break

print(f"Connecting to {db_path}...")
conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Get existing columns in orders
cur.execute("PRAGMA table_info(orders);")
cols = [row[1] for row in cur.fetchall()]
print(f"Existing columns in orders ({len(cols)}):", cols)

expected_cols = {
    "state": "VARCHAR(100)",
    "country": "VARCHAR(100) DEFAULT 'India'",
    "customer_phone": "VARCHAR(50)",
    "postal_code": "VARCHAR(20)",
    "city": "VARCHAR(100)",
    "subtotal": "FLOAT DEFAULT 0.0",
    "discount_amount": "FLOAT DEFAULT 0.0",
    "tax_amount": "FLOAT DEFAULT 0.0",
    "shipping_fee": "FLOAT DEFAULT 0.0",
    "total_amount": "FLOAT DEFAULT 0.0",
    "currency": "VARCHAR(10) DEFAULT 'INR'",
    "coupon_code": "VARCHAR(50)",
    "payment_method": "VARCHAR(50) DEFAULT 'UPI'",
    "payment_status": "VARCHAR(50) DEFAULT 'PENDING'",
    "order_status": "VARCHAR(50) DEFAULT 'PENDING_PAYMENT'",
    "transaction_id": "VARCHAR(100)",
    "gateway_reference": "VARCHAR(100)",
    "paid_at": "DATETIME",
    "expected_delivery_date": "VARCHAR(100)",
    "tracking_number": "VARCHAR(100)",
    "shipping_carrier": "VARCHAR(100)",
    "accepted_at": "DATETIME",
    "accepted_by": "VARCHAR(255)",
    "payment_success_email_sent": "BOOLEAN DEFAULT 0",
    "order_acceptance_email_sent": "BOOLEAN DEFAULT 0",
    "notes": "TEXT",
}

for col_name, col_type in expected_cols.items():
    if col_name not in cols:
        print(f"Adding missing column: {col_name} {col_type}...")
        try:
            cur.execute(f"ALTER TABLE orders ADD COLUMN {col_name} {col_type};")
            conn.commit()
            print(f"Added column {col_name} successfully.")
        except Exception as e:
            print(f"Error adding {col_name}: {e}")

# Check order_items columns
cur.execute("PRAGMA table_info(order_items);")
item_cols = [row[1] for row in cur.fetchall()]
print(f"Existing columns in order_items ({len(item_cols)}):", item_cols)

expected_item_cols = {
    "item_title": "VARCHAR(255)",
    "sku": "VARCHAR(100)",
    "image_url": "VARCHAR(500)",
    "unit_price": "FLOAT DEFAULT 0.0",
    "quantity": "INTEGER DEFAULT 1",
    "total_price": "FLOAT DEFAULT 0.0",
    "product_id": "INTEGER",
    "kit_id": "INTEGER",
}

for col_name, col_type in expected_item_cols.items():
    if col_name not in item_cols:
        print(f"Adding missing column to order_items: {col_name} {col_type}...")
        try:
            cur.execute(f"ALTER TABLE order_items ADD COLUMN {col_name} {col_type};")
            conn.commit()
            print(f"Added column {col_name} to order_items successfully.")
        except Exception as e:
            print(f"Error adding {col_name}: {e}")

conn.close()
print("Migration completed!")
