from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.deps import get_current_admin
from app.models.admin import Admin
from app.models.contact import ContactMessage
from app.schemas.contact import ContactMessageCreate, ContactMessageUpdate, ContactMessageOut
from app.services.audit import log_admin_action

router = APIRouter(prefix="/contact", tags=["Contact & Messages"])

@router.post("", response_model=ContactMessageOut, status_code=status.HTTP_201_CREATED)
def submit_contact_message(
    req: ContactMessageCreate,
    db: Session = Depends(get_db)
):
    msg = ContactMessage(
        name=req.name,
        email=req.email,
        subject=req.subject or "Direct Investigation Inquiry",
        message=req.message,
        status="unread"
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg

# Admin Inbox
@router.get("/admin/inbox", response_model=List[ContactMessageOut])
def admin_get_inbox(
    status_filter: Optional[str] = Query(None, alias="status"),
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    query = db.query(ContactMessage)
    if status_filter and status_filter.upper() != "ALL":
        query = query.filter(ContactMessage.status == status_filter)
    return query.order_by(ContactMessage.created_at.desc()).all()

@router.put("/admin/inbox/{message_id}", response_model=ContactMessageOut)
def admin_update_message(
    message_id: int,
    req: ContactMessageUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    
    for key, val in req.dict(exclude_unset=True).items():
        setattr(msg, key, val)
    db.commit()
    db.refresh(msg)
    return msg

@router.delete("/admin/inbox/{message_id}")
def admin_delete_message(
    message_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(msg)
    db.commit()
    log_admin_action(db, "DELETE", "ContactMessage", str(message_id), f"Deleted inquiry from {msg.email}", current_admin)
    return {"message": "Message deleted"}
