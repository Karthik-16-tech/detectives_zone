import os
import sys

# Ensure backend root is always in python path regardless of where uvicorn is called from
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_root = os.path.dirname(current_dir)
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import engine, Base
import app.models # Register all models

# Import Routers
from app.api.v1.auth import router as auth_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.cases import router as cases_router
from app.api.v1.products import router as products_router
from app.api.v1.kits import router as kits_router
from app.api.v1.cart import router as cart_router
from app.api.v1.orders import router as orders_router
from app.api.v1.payments import router as payments_router
from app.api.v1.contact import router as contact_router
from app.api.v1.media import router as media_router
from app.api.v1.settings import router as settings_router
from app.api.v1.audit_logs import router as audit_router

# Ensure tables exist
Base.metadata.create_all(bind=engine)

# Safe auto-migration for cases and payments table columns
from sqlalchemy import text
try:
    with engine.connect() as conn:
        for col_name, col_type in [
            ("price", "FLOAT DEFAULT 999.0"),
            ("original_price", "FLOAT DEFAULT 1499.0"),
            ("shipping_fee", "FLOAT DEFAULT 0.0"),
        ]:
            try:
                conn.execute(text(f"ALTER TABLE cases ADD COLUMN {col_name} {col_type};"))
                conn.commit()
            except Exception:
                pass

        for col_name, col_type in [
            ("merchant_transaction_id", "VARCHAR(100) NULL"),
            ("provider_transaction_id", "VARCHAR(100) NULL"),
            ("upi_id", "VARCHAR(100) NULL"),
            ("qr_payload", "TEXT NULL"),
            ("payment_url", "VARCHAR(500) NULL"),
            ("raw_response", "TEXT NULL"),
            ("verified_at", "DATETIME NULL"),
            ("expires_at", "DATETIME NULL"),
        ]:
            try:
                conn.execute(text(f"ALTER TABLE payments ADD COLUMN {col_name} {col_type};"))
                conn.commit()
            except Exception:
                pass

        for col_name, col_type in [
            ("expires_at", "DATETIME NULL"),
        ]:
            try:
                conn.execute(text(f"ALTER TABLE orders ADD COLUMN {col_name} {col_type};"))
                conn.commit()
            except Exception:
                pass
except Exception:
    pass

# Ensure upload directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
for sub in ["general", "cases", "evidence", "store", "kits"]:
    os.makedirs(os.path.join(settings.UPLOAD_DIR, sub), exist_ok=True)

# Auto-seed / sync default superadmin on startup
try:
    from app.core.database import SessionLocal
    from app.models.admin import Admin
    from app.core.security import hash_password
    
    with SessionLocal() as db_session:
        for admin_email in ["admin@detectiveszone.co", "admin@detectivezone.co"]:
            admin_user = db_session.query(Admin).filter(
                (Admin.email == admin_email) | (Admin.username == "admin")
            ).first()
            pwd_hash = hash_password("detective2026")
            if not admin_user:
                admin_user = Admin(
                    email=admin_email,
                    username="admin",
                    full_name="Lead Detective Investigator",
                    hashed_password=pwd_hash,
                    role="superadmin",
                    is_active=True
                )
                db_session.add(admin_user)
            else:
                admin_user.hashed_password = pwd_hash
                admin_user.is_active = True
                admin_user.role = "superadmin"
            db_session.commit()
            break
except Exception as e:
    pass

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration (Allows all web frontend origins & domains)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static Uploads
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(dashboard_router, prefix=settings.API_V1_STR)
app.include_router(cases_router, prefix=settings.API_V1_STR)
app.include_router(products_router, prefix=settings.API_V1_STR)
app.include_router(kits_router, prefix=settings.API_V1_STR)
app.include_router(cart_router, prefix=settings.API_V1_STR)
app.include_router(orders_router, prefix=settings.API_V1_STR)
app.include_router(payments_router, prefix=settings.API_V1_STR)
app.include_router(contact_router, prefix=settings.API_V1_STR)
app.include_router(media_router, prefix=settings.API_V1_STR)
app.include_router(settings_router, prefix=settings.API_V1_STR)
app.include_router(audit_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "status": "active",
        "service": "Detectives Zone API Backend",
        "version": settings.VERSION,
        "docs": "/docs",
        "api_v1": settings.API_V1_STR
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
