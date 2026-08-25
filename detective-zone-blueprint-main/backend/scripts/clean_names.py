# -*- coding: utf-8 -*-
import sqlite3

conn = sqlite3.connect('detective_zone.db')
c = conn.cursor()

updates = [
    ('The Last Voicemail - Hybrid Case Kit', 'p1'),
    ('The Silent Witness - Investigation Dossier', 'p2'),
    ('Blood in the Letter - Physical File', 'p3'),
    ('The Vanished One - Cold Case Dossier', 'p4'),
    ('The Final Experiment - Classified Case', 'p5'),
    ('Shadows of Betrayal - Premium Collector Kit', 'p6'),
]

for name, slug in updates:
    c.execute("UPDATE products SET name = ? WHERE slug = ?", (name, slug))

conn.commit()

print("Products updated:")
for row in c.execute("SELECT id, slug, sku, name, price, sale_price FROM products"):
    print(row)
