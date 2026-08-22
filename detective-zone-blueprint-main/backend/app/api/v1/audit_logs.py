from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.deps import get_current_admin
from app.models.admin import Admin
from app.models.audit_log import AuditLog
from app.schemas.dashboard import ActivityItem

router = APIRouter(prefix="/audit-logs", tags=["Audit Trail"])

@router.get("", response_model=List[ActivityItem])
def get_audit_logs(
    limit: int = Query(50, le=200),
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit).all()
    return [
        ActivityItem(
            id=log.id,
            admin_username=log.admin_username,
            action=log.action,
            target_model=log.target_model,
            target_id=log.target_id,
            details=log.details,
            created_at=log.created_at
        )
        for log in logs
    ]
