from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from datetime import datetime

from app.core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, nullable=True)
    admin_username = Column(String(100), nullable=True)
    action = Column(String(100), nullable=False) # CREATE, UPDATE, DELETE, PUBLISH, LOGIN
    target_model = Column(String(100), nullable=False) # Case, Product, Kit, Evidence, Order
    target_id = Column(String(100), nullable=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
