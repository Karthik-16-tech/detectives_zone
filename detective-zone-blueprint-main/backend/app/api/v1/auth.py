from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

from app.core.database import get_db
from app.core.security import verify_password, hash_password
from app.core.jwt_handler import create_access_token, create_refresh_token, verify_token
from app.core.deps import get_current_admin
from app.models.admin import Admin
from app.schemas.admin import AdminOut, Token, LoginRequest, RefreshRequest, ChangePasswordRequest
from app.services.auth_service import authenticate_admin
from app.services.audit import log_admin_action

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.options("/login")
def options_login():
    """Handle preflight CORS requests for login"""
    return Response(status_code=200)

@router.post("/login", response_model=Token)
async def login(
    request: Request,
    db: Session = Depends(get_db)
):
    content_type = request.headers.get("content-type", "")
    username_or_email = ""
    password = ""
    
    if "application/json" in content_type:
        try:
            body = await request.json()
            username_or_email = body.get("email") or body.get("username_or_email") or body.get("username", "")
            password = body.get("password", "")
        except Exception:
            pass
    else:
        try:
            form = await request.form()
            username_or_email = form.get("username") or form.get("email") or form.get("username_or_email", "")
            password = form.get("password", "")
        except Exception:
            pass
            
    admin = authenticate_admin(db, username_or_email, password)
    
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    admin.last_login = datetime.utcnow()
    db.commit()
    db.refresh(admin)
    
    access_token = create_access_token(subject=admin.email)
    refresh_token = create_refresh_token(subject=admin.email)
    
    log_admin_action(
        db, action="LOGIN", target_model="Admin", target_id=str(admin.id),
        details=f"Admin logged in: {admin.email}", admin=admin,
        ip_address=request.client.host if request.client else None
    )
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "admin": admin
    }

@router.post("/refresh", response_model=Token)
def refresh_token_endpoint(
    req: RefreshRequest,
    db: Session = Depends(get_db)
):
    sub = verify_token(req.refresh_token, expected_type="refresh")
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if str(sub).isdigit():
        admin = db.query(Admin).filter(Admin.id == int(sub)).first()
    else:
        admin = db.query(Admin).filter(
            (func.lower(Admin.email) == str(sub).lower()) | 
            (func.lower(Admin.username) == str(sub).lower())
        ).first()
        
    if not admin or not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin account not found or inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    new_access_token = create_access_token(subject=admin.email)
    new_refresh_token = create_refresh_token(subject=admin.email)
    
    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
        "admin": admin
    }

@router.get("/me", response_model=AdminOut)
def get_current_user_profile(
    current_admin: Admin = Depends(get_current_admin)
):
    return current_admin

@router.post("/change-password")
def change_password(
    req: ChangePasswordRequest,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    if not verify_password(req.current_password, current_admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    current_admin.hashed_password = hash_password(req.new_password)
    db.commit()
    
    log_admin_action(
        db, action="CHANGE_PASSWORD", target_model="Admin", target_id=str(current_admin.id),
        details="Admin changed password", admin=current_admin
    )
    return {"status": "success", "message": "Password changed successfully"}
