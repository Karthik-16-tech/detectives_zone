import sqlite3
import os

db_path = "detective_zone.db"
if not os.path.exists(db_path):
    for root, dirs, files in os.walk("."):
        if "detective_zone.db" in files:
            db_path = os.path.join(root, "detective_zone.db")
            break

print(f"Connecting to {db_path}...")
conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Delete related order items, events, payments first
cur.execute("DELETE FROM order_items;")
cur.execute("DELETE FROM order_events;")
cur.execute("DELETE FROM payments;")
cur.execute("DELETE FROM orders;")

conn.commit()
print("Successfully deleted all test orders and related history from database.")

cur.execute("SELECT count(*) FROM orders;")
print("Remaining orders count:", cur.fetchone()[0])

conn.close()
