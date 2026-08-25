import sqlite3

conn = sqlite3.connect('detective_zone.db')
c = conn.cursor()

# Sync prices from cases to products
c.execute("""
UPDATE products 
SET price = (
    SELECT cases.price 
    FROM cases 
    WHERE cases.case_number = '001'
)
WHERE slug = 'p1' OR sku = 'DZ-KIT-001'
""")

c.execute("""
UPDATE products 
SET price = (
    SELECT cases.price 
    FROM cases 
    WHERE cases.case_number = '002'
)
WHERE slug = 'p2' OR sku = 'DZ-KIT-002'
""")

c.execute("""
UPDATE products 
SET price = (
    SELECT cases.price 
    FROM cases 
    WHERE cases.case_number = '003'
)
WHERE slug = 'p3' OR sku = 'DZ-KIT-003'
""")

c.execute("""
UPDATE products 
SET price = (
    SELECT cases.price 
    FROM cases 
    WHERE cases.case_number = '004'
)
WHERE slug = 'p4' OR sku = 'DZ-KIT-004'
""")

c.execute("""
UPDATE products 
SET price = (
    SELECT cases.price 
    FROM cases 
    WHERE cases.case_number = '005'
)
WHERE slug = 'p5' OR sku = 'DZ-KIT-005'
""")

c.execute("""
UPDATE products 
SET price = (
    SELECT cases.price 
    FROM cases 
    WHERE cases.case_number = '006'
)
WHERE slug = 'p6' OR sku = 'DZ-KIT-006'
""")

conn.commit()

print("=== CASES ===")
for r in c.execute("SELECT id, case_number, title, price, original_price FROM cases"):
    print(r)

print("=== PRODUCTS ===")
for r in c.execute("SELECT id, slug, sku, name, price, sale_price FROM products"):
    print(r)
