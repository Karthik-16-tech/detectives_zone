from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CartCreate(BaseModel):
    session_id: Optional[str] = None
    user_id: Optional[int] = None

class CartItemBase(BaseModel):
    item_title: str
    item_image: Optional[str] = None
    unit_price: float
    quantity: int = 1
    product_id: Optional[int] = None
    kit_id: Optional[int] = None

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemOut(CartItemBase):
    id: int
    cart_id: int
    class Config:
        from_attributes = True

class CartOut(BaseModel):
    id: int
    session_id: str
    user_id: Optional[int] = None
    items: List[CartItemOut] = []
    total_items: int
    total_price: float
    updated_at: datetime
    class Config:
        from_attributes = True
