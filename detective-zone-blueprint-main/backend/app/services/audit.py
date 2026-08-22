from sqlalchemy.orm import Session
from typing import Optional
from app.models.audit_log import AuditLog
from app.models.admin import Admin

def log_admin_action(
    db: Session,
    action: str,
    target_model: str,
    target_id: Optional[str] = None,
    details: Optional[str] = None,
    admin: Optional[Admin] = None,
    ip_address: Optional[str] = None
):
    try:
        log = AuditLog(
            admin_id=admin.id if admin else None,
            admin_username=admin.username if admin else "system",
            action=action,
            target_model=target_model,
            target_id=str(target_id) if target_id else None,
            details=details,
            ip_address=ip_address
        )
        db.add(log)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Failed to write audit log: {e}")
