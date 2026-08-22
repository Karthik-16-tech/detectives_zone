from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class ActivityItem(BaseModel):
    id: int
    admin_username: Optional[str] = None
    action: str
    target_model: str
    target_id: Optional[str] = None
    details: Optional[str] = None
    created_at: datetime

class DashboardStatsOut(BaseModel):
    # Case stats
    total_cases: int
    published_cases: int
    draft_cases: int
    
    # Store & Kit stats
    total_products: int
    available_products: int
    out_of_stock_products: int
    total_kits: int
    available_kits: int
    
    # Order stats
    total_orders: int
    pending_orders: int
    completed_orders: int
    total_revenue: float
    
    # Inquiries & Media
    unread_messages: int
    total_messages: int
    total_media_files: int
    total_storage_bytes: int
    storage_formatted: str
    
    # Recent activity log
    recent_activity: List[ActivityItem] = []
