# Detective Zone — Backend & Database Architecture

## 1. Overview
The Detective Zone backend is powered by **FastAPI (Python 3.11)** with **SQLAlchemy 2.0 ORM** connected to **MySQL 8.0**.

---

## 2. Database Configuration
- **Host**: `localhost:3306`
- **Database**: `detective_zone`
- **Driver**: `pymysql` (`mysql+pymysql://root:password@localhost:3306/detective_zone`)

### Tables (24 Total):
1. `admins` — Admin user credentials and permissions.
2. `audit_logs` — Immutable audit trail of admin actions.
3. `cases` — Master case records for all 6 cases.
4. `case_page_content` — CMS page content for dynamic case dossiers.
5. `case_sections` — Markdown investigation briefing files.
6. `evidence` — Forensic evidence exhibits with S3 URLs.
7. `clues` — Riddles, decryption ciphers, and validation rules.
8. `case_notes` — Detective field observations.
9. `case_gallery_images` — Crime scene photos.
10. `case_videos` — Supplementary video reels.
11. `products` — Physical case kits and merchandise items.
12. `product_images` — Product gallery photos.
13. `kits` — Deluxe case boxes and collector trunks.
14. `kit_images` — Unboxing images.
15. `signatures` — Verified authentic evidence artifacts.
16. `orders` — Customer orders and shipping details.
17. `order_items` — Itemized order contents.
18. `order_events` — Real-time order progress timeline.
19. `payments` — PhonePe transaction records and verification status.
20. `carts` — Shopping cart sessions.
21. `cart_items` — Items inside shopping cart.
22. `contact_messages` — Inbound contact inquiries and responses.
23. `media` — Media library files with MIME types.
24. `settings` — Global site CMS settings and UPI payment configuration.

---

## 3. Running Backend Locally
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Run Database Migrations & Seeds
python master_seed.py

# Start FastAPI Server
uvicorn app.main:app --reload --port 8000
```

---

## 4. API Documentation
- Interactive Swagger UI: `http://localhost:8000/docs`
- Redoc Documentation: `http://localhost:8000/redoc`

---

## 5. Payment Flow (PhonePe Gateway)
- **Initiation**: `POST /api/v1/payments/create-transaction`
- **Status Check**: `GET /api/v1/payments/status/{order_id}`
- **Webhook**: `POST /api/v1/payments/webhook`
- **Reconciliation**: `POST /api/v1/payments/admin/reconcile`
