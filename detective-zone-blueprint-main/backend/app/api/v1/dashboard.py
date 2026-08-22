from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.core.deps import get_current_admin
from app.models.admin import Admin
from app.models.case import Case
from app.models.product import Product
from app.models.kit import CaseKit
from app.models.order import Order
from app.models.contact import ContactMessage
from app.models.media import MediaFile
from app.models.audit_log import AuditLog
from app.schemas.dashboard import DashboardStatsOut, ActivityItem

router = APIRouter(tags=["Admin Dashboard"])

def format_bytes(size: int) -> str:
    if size < 1024:
        return f"{size} B"
    elif size < 1024 * 1024:
        return f"{size / 1024:.1f} KB"
    elif size < 1024 * 1024 * 1024:
        return f"{size / (1024 * 1024):.1f} MB"
    else:
        return f"{size / (1024 * 1024 * 1024):.2f} GB"

@router.get("/dashboard/stats", response_model=DashboardStatsOut)
@router.get("/dashboard", response_model=DashboardStatsOut)
@router.get("/admin/dashboard", response_model=DashboardStatsOut)
@router.get("/admin/dashboard/stats", response_model=DashboardStatsOut)
def get_dashboard_metrics(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Cases
    total_cases = db.query(Case).count()
    published_cases = db.query(Case).filter(Case.is_published == True).count()
    draft_cases = total_cases - published_cases

    # Products & Kits
    total_products = db.query(Product).count()
    available_products = db.query(Product).filter(Product.availability_status == "available").count()
    out_of_stock_products = db.query(Product).filter(Product.availability_status == "out_of_stock").count()
    
    total_kits = db.query(CaseKit).count()
    available_kits = db.query(CaseKit).filter(CaseKit.availability.ilike("%stock%")).count()

    # Orders
    total_orders = db.query(Order).count()
    pending_orders = db.query(Order).filter(Order.order_status.in_(["pending", "processing", "PENDING_PAYMENT", "PAYMENT_CONFIRMED", "ACCEPTED", "PREPARING", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY"])).count()
    completed_orders = db.query(Order).filter(Order.order_status.in_(["delivered", "DELIVERED"])).count()
    revenue_sum = db.query(func.sum(Order.total_amount)).filter(Order.payment_status.in_(["paid", "SUCCESS"])).scalar() or 0.0

    # Messages
    total_messages = db.query(ContactMessage).count()
    unread_messages = db.query(ContactMessage).filter(ContactMessage.status == "unread").count()

    # Media Storage
    total_media_files = db.query(MediaFile).count()
    total_storage_bytes = db.query(func.sum(MediaFile.file_size)).scalar() or 0
    storage_formatted = format_bytes(total_storage_bytes)

    # Recent Audit Log Activity
    recent_logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(10).all()
    activity_items = [
        ActivityItem(
            id=log.id,
            admin_username=log.admin_username,
            action=log.action,
            target_model=log.target_model,
            target_id=log.target_id,
            details=log.details,
            created_at=log.created_at
        )
        for log in recent_logs
    ]

    return DashboardStatsOut(
        total_cases=total_cases,
        published_cases=published_cases,
        draft_cases=draft_cases,
        total_products=total_products,
        available_products=available_products,
        out_of_stock_products=out_of_stock_products,
        total_kits=total_kits,
        available_kits=available_kits,
        total_orders=total_orders,
        pending_orders=pending_orders,
        completed_orders=completed_orders,
        total_revenue=float(revenue_sum),
        unread_messages=unread_messages,
        total_messages=total_messages,
        total_media_files=total_media_files,
        total_storage_bytes=total_storage_bytes,
        storage_formatted=storage_formatted,
        recent_activity=activity_items
    )
