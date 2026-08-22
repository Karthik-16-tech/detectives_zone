import sqlite3
import os

db_path = "detective_zone.db"
conn = sqlite3.connect(db_path)
cur = conn.cursor()

cur.execute("PRAGMA table_info(orders);")
cols = [r[1] for r in cur.fetchall()]
if "email_status" not in cols:
    cur.execute("ALTER TABLE orders ADD COLUMN email_status VARCHAR(50) DEFAULT 'PENDING';")
    conn.commit()
    print("Added email_status column to orders table.")
else:
    print("email_status column already exists.")

conn.close()
