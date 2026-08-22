from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ProductImageBase(BaseModel):
    image_url: str
    alt_text: Optional[str] = None
    sort_order: int = 0

class ProductImageCreate(ProductImageBase):
    pass

class ProductImageOut(ProductImageBase):
    id: int
    product_id: int
    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    slug: str
    cover_image: Optional[str] = None
    price: float
    sale_price: Optional[float] = None
    sku: Optional[str] = None
    category: str = "Physical Case Kits"
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    stock_quantity: int = 10
    weight: Optional[str] = None
    dimensions: Optional[str] = None
    availability_status: str = "available" # available, preorder, coming_soon, out_of_stock, discontinued
    is_published: bool = True
    sort_order: int = 0

class ProductCreate(ProductBase):
    gallery_images: Optional[List[ProductImageCreate]] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    cover_image: Optional[str] = None
    price: Optional[float] = None
    sale_price: Optional[float] = None
    sku: Optional[str] = None
    category: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    stock_quantity: Optional[int] = None
    weight: Optional[str] = None
    dimensions: Optional[str] = None
    availability_status: Optional[str] = None
    is_published: Optional[bool] = None
    sort_order: Optional[int] = None

class ProductOut(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    images: List[ProductImageOut] = []

    class Config:
        from_attributes = True
