import os
import time
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# Determine absolute path for AWS RDS SSL CA bundle
bundle_paths = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "global-bundle.pem")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "global-bundle.pem")),
    os.path.abspath("global-bundle.pem"),
]
ssl_ca_path = None
for p in bundle_paths:
    if os.path.exists(p):
        ssl_ca_path = p
        break

db_url = settings.DATABASE_URL
connect_args = {}

if "rds.amazonaws.com" in db_url:
    # Strip any raw query param from url and provide proper ssl dict in connect_args
    if "?" in db_url:
        db_url = db_url.split("?")[0]
    connect_args["connect_timeout"] = 15
    connect_args["read_timeout"] = 30
    connect_args["write_timeout"] = 30
    if ssl_ca_path:
        connect_args["ssl"] = {"ca": ssl_ca_path}
elif db_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False

try:
    engine = create_engine(
        db_url,
        connect_args=connect_args,
        pool_pre_ping=True,
        pool_recycle=1800,
        pool_size=10,
        max_overflow=20,
        pool_timeout=30,
    )
except Exception as e:
    fallback_url = "sqlite:///./detective_zone.db"
    print(f"Warning: Primary database connection failed ({e}). Falling back to SQLite at {fallback_url}")
    engine = create_engine(fallback_url, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
