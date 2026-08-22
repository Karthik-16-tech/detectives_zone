from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    cover_image = Column(String(500), nullable=True)
    price = Column(Float, nullable=False)
    sale_price = Column(Float, nullable=True)
    sku = Column(String(100), unique=True, index=True, nullable=True)
    category = Column(String(100), default="Physical Case Kits")
    short_description = Column(Text, nullable=True)
    full_description = Column(Text, nullable=True)
    stock_quantity = Column(Integer, default=10)
    weight = Column(String(50), nullable=True) # e.g. "1.2 kg"
    dimensions = Column(String(100), nullable=True) # e.g. "30 x 22 x 6 cm"
    
    # Availability: available, preorder, coming_soon, out_of_stock, discontinued
    availability_status = Column(String(50), default="available")
    is_published = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan", order_by="ProductImage.sort_order")


class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String(500), nullable=False)
    alt_text = Column(String(255), nullable=True)
    sort_order = Column(Integer, default=0)

    product = relationship("Product", back_populates="images")
