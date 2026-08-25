from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- CaseSection ---
class CaseSectionBase(BaseModel):
    section_type: str = "story"
    title: str
    content_markdown: str
    sort_order: int = 0

class CaseSectionCreate(CaseSectionBase):
    case_id: Optional[int] = None

class CaseSectionUpdate(BaseModel):
    section_type: Optional[str] = None
    title: Optional[str] = None
    content_markdown: Optional[str] = None
    sort_order: Optional[int] = None

class CaseSectionOut(CaseSectionBase):
    id: int
    case_id: int
    class Config:
        from_attributes = True

# --- Evidence ---
class EvidenceBase(BaseModel):
    title: str
    type: str # image, video, audio, document, note, voice, cctv, map, pdf
    file_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    description: Optional[str] = None
    date_recorded: Optional[str] = None
    is_locked: bool = False
    sort_order: int = 0
    meta_info: Optional[Dict[str, Any]] = None

class EvidenceCreate(EvidenceBase):
    case_id: Optional[int] = None

class EvidenceUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    file_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    description: Optional[str] = None
    date_recorded: Optional[str] = None
    is_locked: Optional[bool] = None
    sort_order: Optional[int] = None
    meta_info: Optional[Dict[str, Any]] = None

class EvidenceOut(EvidenceBase):
    id: int
    case_id: int
    class Config:
        from_attributes = True

# --- Video ---
class CaseVideoBase(BaseModel):
    title: str
    video_url: str
    video_type: str = "mp4" # mp4, youtube, vimeo
    description: Optional[str] = None
    transcript: Optional[str] = None
    timestamp_markers: Optional[List[Dict[str, Any]]] = None
    sort_order: int = 0

class CaseVideoCreate(CaseVideoBase):
    case_id: Optional[int] = None

class CaseVideoUpdate(BaseModel):
    title: Optional[str] = None
    video_url: Optional[str] = None
    video_type: Optional[str] = None
    description: Optional[str] = None
    transcript: Optional[str] = None
    timestamp_markers: Optional[List[Dict[str, Any]]] = None
    sort_order: Optional[int] = None

class CaseVideoOut(CaseVideoBase):
    id: int
    case_id: int
    class Config:
        from_attributes = True

# --- Gallery ---
class CaseGalleryImageBase(BaseModel):
    image_url: str
    caption: Optional[str] = None
    sort_order: int = 0

class CaseGalleryImageCreate(CaseGalleryImageBase):
    case_id: Optional[int] = None

class CaseGalleryImageUpdate(BaseModel):
    image_url: Optional[str] = None
    caption: Optional[str] = None
    sort_order: Optional[int] = None

class CaseGalleryImageOut(CaseGalleryImageBase):
    id: int
    case_id: int
    class Config:
        from_attributes = True

# --- Note ---
class CaseNoteBase(BaseModel):
    title: str
    body: str
    highlight_color: str = "blood"
    is_pinned: bool = False
    is_confidential: bool = True
    sort_order: int = 0

class CaseNoteCreate(CaseNoteBase):
    case_id: Optional[int] = None

class CaseNoteUpdate(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None
    highlight_color: Optional[str] = None
    is_pinned: Optional[bool] = None
    is_confidential: Optional[bool] = None
    sort_order: Optional[int] = None

class CaseNoteOut(CaseNoteBase):
    id: int
    case_id: int
    class Config:
        from_attributes = True

# --- Clue ---
class ClueBase(BaseModel):
    title: str
    description: Optional[str] = None
    correct_answer: str
    hint: Optional[str] = None
    unlock_condition: Optional[str] = None
    sort_order: int = 0

class ClueCreate(ClueBase):
    case_id: Optional[int] = None

class ClueUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    correct_answer: Optional[str] = None
    hint: Optional[str] = None
    unlock_condition: Optional[str] = None
    sort_order: Optional[int] = None

class ClueOut(ClueBase):
    id: int
    case_id: int
    class Config:
        from_attributes = True

class ClueVerify(BaseModel):
    answer: str

class ClueVerifyResult(BaseModel):
    correct: bool
    message: str

# --- Case ---
class CaseBase(BaseModel):
    case_number: str
    slug: str
    title: str
    subtitle: Optional[str] = None
    cover_image: Optional[str] = None
    thumbnail: Optional[str] = None
    hero_image: Optional[str] = None
    hero_video: Optional[str] = None
    tagline: Optional[str] = None
    intro_text: Optional[str] = None
    
    status: str = "UNSOLVED"
    difficulty: str = "HARD"
    estimated_duration: str = "3–5 HOURS"
    rating: float = 5.0
    short_description: Optional[str] = None
    price: Optional[float] = 999.0
    original_price: Optional[float] = 1499.0
    shipping_fee: Optional[float] = 0.0
    
    featured: bool = False
    is_published: bool = True
    display_order: int = 0
    
    seo_title: Optional[str] = None
    meta_description: Optional[str] = None
    keywords: Optional[str] = None

class CaseCreate(CaseBase):
    pass

class CaseUpdate(BaseModel):
    case_number: Optional[str] = None
    slug: Optional[str] = None
    title: Optional[str] = None
    subtitle: Optional[str] = None
    cover_image: Optional[str] = None
    thumbnail: Optional[str] = None
    hero_image: Optional[str] = None
    hero_video: Optional[str] = None
    tagline: Optional[str] = None
    intro_text: Optional[str] = None
    
    status: Optional[str] = None
    difficulty: Optional[str] = None
    estimated_duration: Optional[str] = None
    rating: Optional[float] = None
    short_description: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    shipping_fee: Optional[float] = None
    
    featured: Optional[bool] = None
    is_published: Optional[bool] = None
    display_order: Optional[int] = None
    
    seo_title: Optional[str] = None
    meta_description: Optional[str] = None
    keywords: Optional[str] = None

class CaseOut(CaseBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CaseDetailOut(CaseOut):
    sections: List[CaseSectionOut] = []
    evidence: List[EvidenceOut] = []
    videos: List[CaseVideoOut] = []
    gallery: List[CaseGalleryImageOut] = []
    notes: List[CaseNoteOut] = []
    clues: List[ClueOut] = []

    class Config:
        from_attributes = True

class ReorderItem(BaseModel):
    id: int
    sort_order: int

class ReorderRequest(BaseModel):
    items: List[ReorderItem]


# --- CasePageContent ---
class EvidencePinSchema(BaseModel):
    id: str
    x: float
    y: float
    label: str
    note: Optional[str] = None
    image_url: Optional[str] = None
    links: Optional[List[List[int]]] = None

class InvestigationModuleSchema(BaseModel):
    icon: Optional[str] = None
    heading: str
    body: str

class CasePageContentBase(BaseModel):
    hero_video_url: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_badge_text: Optional[str] = "Case File"
    evidence_wall_bg_url: Optional[str] = None
    evidence_pins: Optional[List[EvidencePinSchema]] = []
    investigation_modules: Optional[List[InvestigationModuleSchema]] = []
    quote_text: Optional[str] = None
    quote_author: Optional[str] = None
    case_type: Optional[str] = None
    date_of_incident: Optional[str] = None
    location: Optional[str] = None

class CasePageContentCreate(CasePageContentBase):
    pass

class CasePageContentUpdate(CasePageContentBase):
    pass

class CasePageContentOut(CasePageContentBase):
    id: int
    case_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
