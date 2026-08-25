"""Check and fix price values in the production database."""
import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.database import engine
from sqlalchemy import text

def main():
    with engine.connect() as conn:
        # Check current price values
        result = conn.execute(text("SELECT id, case_number, title, price, original_price, shipping_fee FROM cases"))
        rows = result.fetchall()
        
        print("Current price data in cases table:")
        print("-" * 80)
        for row in rows:
            print(f"  ID={row[0]} | Case={row[1]} | Title={row[2]}")
            print(f"    price={row[3]} | original_price={row[4]} | shipping_fee={row[5]}")
            print()
    
    # Update NULL prices to defaults
    with engine.begin() as conn:
        r1 = conn.execute(text("UPDATE cases SET price = 999.0 WHERE price IS NULL"))
        print(f"Updated {r1.rowcount} rows with default price=999.0")
        r2 = conn.execute(text("UPDATE cases SET original_price = 1499.0 WHERE original_price IS NULL"))
        print(f"Updated {r2.rowcount} rows with default original_price=1499.0")
        r3 = conn.execute(text("UPDATE cases SET shipping_fee = 0.0 WHERE shipping_fee IS NULL"))
        print(f"Updated {r3.rowcount} rows with default shipping_fee=0.0")
    
    # Verify
    with engine.connect() as conn:
        result = conn.execute(text("SELECT id, case_number, price, original_price, shipping_fee FROM cases"))
        rows = result.fetchall()
        print("\nAfter fix:")
        print("-" * 80)
        for row in rows:
            print(f"  ID={row[0]} | Case={row[1]} | price={row[2]} | original_price={row[3]} | shipping_fee={row[4]}")
    
    print("\nDone!")

if __name__ == "__main__":
    main()
