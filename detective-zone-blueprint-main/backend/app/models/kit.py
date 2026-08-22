from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base

class CaseKit(Base):
    __tablename__ = "kits"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    kit_code = Column(String(100), unique=True, index=True, nullable=False) # e.g. "KIT-001"
    slug = Column(String(255), unique=True, index=True, nullable=False)
    cover_image = Column(String(500), nullable=True)
    price = Column(Float, nullable=False)
    sale_price = Column(Float, nullable=True)
    difficulty = Column(String(50), default="HARD")
    estimated_time = Column(String(100), default="3–4 HOURS")
    availability = Column(String(50), default="In Stock")
    description = Column(Text, nullable=True)
    included_items = Column(JSON, nullable=True) # list of items: ["Crime scene dossier", "Evidence bags", "Police reports"]
    
    is_published = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    images = relationship("KitImage", back_populates="kit", cascade="all, delete-orphan", order_by="KitImage.sort_order")
    signatures = relationship("SignatureEvidence", back_populates="kit", cascade="all, delete-orphan", order_by="SignatureEvidence.sort_order")


class KitImage(Base):
    __tablename__ = "kit_images"

    id = Column(Integer, primary_key=True, index=True)
    kit_id = Column(Integer, ForeignKey("kits.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String(500), nullable=False)
    caption = Column(String(255), nullable=True)
    sort_order = Column(Integer, default=0)

    kit = relationship("CaseKit", back_populates="images")


class SignatureEvidence(Base):
    __tablename__ = "signatures"

    id = Column(Integer, primary_key=True, index=True)
    kit_id = Column(Integer, ForeignKey("kits.id", ondelete="CASCADE"), nullable=True)
    label = Column(String(255), nullable=False)
    image_url = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    authenticity_note = Column(String(255), default="Verified Authentic Field Clue")
    sort_order = Column(Integer, default=0)

    kit = relationship("CaseKit", back_populates="signatures")
