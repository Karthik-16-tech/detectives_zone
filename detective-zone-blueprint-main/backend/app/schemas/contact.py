from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str

class ContactMessageUpdate(BaseModel):
    status: Optional[str] = None # unread, read, replied, archived
    reply_notes: Optional[str] = None

class ContactMessageOut(BaseModel):
    id: int
    name: str
    email: str
    subject: Optional[str] = None
    message: str
    status: str
    reply_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
