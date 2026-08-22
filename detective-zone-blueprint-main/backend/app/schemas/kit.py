from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class KitImageBase(BaseModel):
    image_url: str
    caption: Optional[str] = None
    sort_order: int = 0

class KitImageCreate(KitImageBase):
    pass

class KitImageOut(KitImageBase):
    id: int
    kit_id: int
    class Config:
        from_attributes = True

class SignatureEvidenceBase(BaseModel):
    label: str
    image_url: str
    description: Optional[str] = None
    authenticity_note: str = "Verified Authentic Field Clue"
    sort_order: int = 0

class SignatureEvidenceCreate(SignatureEvidenceBase):
    kit_id: Optional[int] = None

class SignatureEvidenceUpdate(BaseModel):
    label: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    authenticity_note: Optional[str] = None
    sort_order: Optional[int] = None

class SignatureEvidenceOut(SignatureEvidenceBase):
    id: int
    kit_id: Optional[int] = None
    class Config:
        from_attributes = True

class CaseKitBase(BaseModel):
    name: str
    kit_code: str
    slug: str
    cover_image: Optional[str] = None
    price: float
    sale_price: Optional[float] = None
    difficulty: str = "HARD"
    estimated_time: str = "3–4 HOURS"
    availability: str = "In Stock"
    description: Optional[str] = None
    included_items: Optional[List[str]] = None
    is_published: bool = True
    sort_order: int = 0

class CaseKitCreate(CaseKitBase):
    gallery_images: Optional[List[KitImageCreate]] = None
    signatures: Optional[List[SignatureEvidenceCreate]] = None

class CaseKitUpdate(BaseModel):
    name: Optional[str] = None
    kit_code: Optional[str] = None
    slug: Optional[str] = None
    cover_image: Optional[str] = None
    price: Optional[float] = None
    sale_price: Optional[float] = None
    difficulty: Optional[str] = None
    estimated_time: Optional[str] = None
    availability: Optional[str] = None
    description: Optional[str] = None
    included_items: Optional[List[str]] = None
    is_published: Optional[bool] = None
    sort_order: Optional[int] = None

class CaseKitOut(CaseKitBase):
    id: int
    created_at: datetime
    updated_at: datetime
    images: List[KitImageOut] = []
    signatures: List[SignatureEvidenceOut] = []

    class Config:
        from_attributes = True
