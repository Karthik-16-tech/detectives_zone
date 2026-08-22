import os
from typing import List, Union
from dotenv import load_dotenv
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings

# Explicitly load backend/.env
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
if os.path.exists(env_path):
    load_dotenv(env_path, override=True)


class Settings(BaseSettings):
    PROJECT_NAME: str = "Detective Zone Backend API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Secret Key for JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30 days
    
    # Database: Supports MySQL, PostgreSQL, SQLite
    # Example MySQL: mysql+pymysql://root:password@localhost:3306/detective_zone
    # Example PostgreSQL: postgresql://postgres:postgres@localhost:5432/detective_zone
    # Fallback default: canonical absolute path to backend/detective_zone.db
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'detective_zone.db'))}"
    )
    
    # CORS Origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://localhost:8081",
        "http://localhost:8082",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:8081",
        "http://127.0.0.1:8082",
    ]
    
    # Uploads Storage
    UPLOAD_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "uploads"))
    MAX_UPLOAD_SIZE_MB: int = 100
    
    # SMTP / Email Server Configuration (supports both SMTP_* and EMAIL_* env names)
    SMTP_HOST: str = os.getenv("SMTP_HOST") or os.getenv("EMAIL_HOST") or "smtp.gmail.com"
    SMTP_PORT: int = int(os.getenv("SMTP_PORT") or os.getenv("EMAIL_PORT") or "587")
    SMTP_USER: str = os.getenv("SMTP_USER") or os.getenv("EMAIL_USERNAME") or os.getenv("EMAIL_USER") or "pallasrikarcharan@gmail.com"
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD") or os.getenv("EMAIL_PASSWORD") or ""
    SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL") or os.getenv("EMAIL_FROM") or "pallasrikarcharan@gmail.com"
    SMTP_FROM_NAME: str = os.getenv("SMTP_FROM_NAME") or os.getenv("EMAIL_FROM_NAME") or "Detectives Zone"
    SMTP_USE_TLS: bool = (os.getenv("SMTP_USE_TLS") or os.getenv("EMAIL_USE_TLS") or "true").lower() in ("true", "1", "yes")
    SMTP_USE_SSL: bool = (os.getenv("SMTP_USE_SSL") or os.getenv("EMAIL_USE_SSL") or "false").lower() in ("true", "1", "yes")

    # PhonePe Payment Gateway Configuration
    PHONEPE_MERCHANT_ID: str = os.getenv("PHONEPE_MERCHANT_ID", "PGTESTPAYUAT")
    PHONEPE_SALT_KEY: str = os.getenv("PHONEPE_SALT_KEY", "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399")
    PHONEPE_SALT_INDEX: str = os.getenv("PHONEPE_SALT_INDEX", "1")
    PHONEPE_CLIENT_ID: str = os.getenv("PHONEPE_CLIENT_ID", "")
    PHONEPE_CLIENT_SECRET: str = os.getenv("PHONEPE_CLIENT_SECRET", "")
    PHONEPE_CLIENT_VERSION: str = os.getenv("PHONEPE_CLIENT_VERSION", "1")
    PHONEPE_ENV: str = os.getenv("PHONEPE_ENV", "UAT") # UAT, PRODUCTION, SIMULATED
    PHONEPE_CALLBACK_URL: str = os.getenv("PHONEPE_CALLBACK_URL", "http://127.0.0.1:8000/api/v1/payments/phonepe/webhook")
    
    # Default Merchant UPI ID (editable via Admin Settings CMS)
    DEFAULT_UPI_ID: str = os.getenv("DEFAULT_UPI_ID", "8885296645@ybl")
    
    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "allow"

settings = Settings()
