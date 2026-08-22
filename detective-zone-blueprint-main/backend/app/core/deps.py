from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.config import settings
from app.core.database import get_db
from app.core.jwt_handler import verify_token
from app.models.admin import Admin

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login",
    auto_error=False
)

def get_current_admin(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Admin:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not token:
        raise credentials_exception
    
    sub = verify_token(token, expected_type="access")
    if not sub:
        raise credentials_exception
    
    # Query admin by ID or Email
    if str(sub).isdigit():
        admin = db.query(Admin).filter(Admin.id == int(sub)).first()
    else:
        admin = db.query(Admin).filter(
            (func.lower(Admin.email) == str(sub).lower()) | 
            (func.lower(Admin.username) == str(sub).lower())
        ).first()
        
    if not admin:
        raise credentials_exception
        
    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin account is inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    return admin

def get_current_active_admin(
    current_admin: Admin = Depends(get_current_admin),
) -> Admin:
    return current_admin
