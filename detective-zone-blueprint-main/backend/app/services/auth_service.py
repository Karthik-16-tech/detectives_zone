from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.admin import Admin
from app.core.security import verify_password

def authenticate_admin(db: Session, email_or_username: str, password: str) -> Optional[Admin]:
    """
    Authenticate admin by email or username using bcrypt.
    Returns Admin instance if credentials match and account is active, else None.
    """
    if not email_or_username or not password:
        return None
    
    clean_identifier = email_or_username.strip().lower()
    
    admin = db.query(Admin).filter(
        (func.lower(Admin.email) == clean_identifier) | 
        (func.lower(Admin.username) == clean_identifier)
    ).first()
    
    if not admin:
        return None
    
    # Check status/active
    if not admin.is_active:
        return None
    
    # Verify bcrypt hash
    if not verify_password(password, admin.hashed_password):
        return None
    
    return admin
