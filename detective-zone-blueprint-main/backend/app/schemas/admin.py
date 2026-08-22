from pydantic import BaseModel, EmailStr, model_validator
from typing import Optional
from datetime import datetime

class AdminBase(BaseModel):
    email: str
    username: str
    full_name: Optional[str] = None
    role: Optional[str] = "superadmin"
    is_active: Optional[bool] = True

class AdminCreate(AdminBase):
    password: str

class AdminUpdate(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None

class AdminOut(AdminBase):
    id: int
    last_login: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    admin: AdminOut

class RefreshRequest(BaseModel):
    refresh_token: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None
    type: Optional[str] = None

class LoginRequest(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    username_or_email: Optional[str] = None
    password: str

    @model_validator(mode="before")
    @classmethod
    def check_identity(cls, values: dict):
        if isinstance(values, dict):
            identity = values.get("email") or values.get("username") or values.get("username_or_email")
            if identity:
                values["username_or_email"] = identity.strip()
        return values

# Alias for Blueprint compatibility
AdminLogin = LoginRequest

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
