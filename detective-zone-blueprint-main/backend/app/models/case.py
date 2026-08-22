from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base

class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String(50), unique=True, index=True, nullable=False) # e.g. "001", "CASE 001"
    slug = Column(String(100), unique=True, index=True, nullable=False)       # e.g. "case-001", "the-last-voicemail"
    title = Column(String(255), nullable=False)
    subtitle = Column(String(255), nullable=True)
    cover_image = Column(String(500), nullable=True)
    thumbnail = Column(String(500), nullable=True)
    hero_image = Column(String(500), nullable=True)
    hero_video = Column(String(500), nullable=True)
    tagline = Column(String(255), nullable=True)
    intro_text = Column(Text, nullable=True)
    
    # Status & Meta
    status = Column(String(50), default="UNSOLVED") # Available, Coming soon, Unsolved, Solved
    difficulty = Column(String(50), default="HARD")  # Easy, Medium, Hard, Expert
    estimated_duration = Column(String(100), default="3–5 HOURS")
    rating = Column(Float, default=5.0)
    short_description = Column(Text, nullable=True)
    
    featured = Column(Boolean, default=False)
    is_published = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)
    
    # SEO
    seo_title = Column(String(255), nullable=True)
    meta_description = Column(Text, nullable=True)
    keywords = Column(String(255), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    sections = relationship("CaseSection", back_populates="case", cascade="all, delete-orphan", order_by="CaseSection.sort_order")
    evidence = relationship("Evidence", back_populates="case", cascade="all, delete-orphan", order_by="Evidence.sort_order")
    videos = relationship("CaseVideo", back_populates="case", cascade="all, delete-orphan", order_by="CaseVideo.sort_order")
    gallery = relationship("CaseGalleryImage", back_populates="case", cascade="all, delete-orphan", order_by="CaseGalleryImage.sort_order")
    notes = relationship("CaseNote", back_populates="case", cascade="all, delete-orphan", order_by="CaseNote.sort_order")
    clues = relationship("Clue", back_populates="case", cascade="all, delete-orphan", order_by="Clue.sort_order")
    page_content = relationship("CasePageContent", back_populates="case", uselist=False, cascade="all, delete-orphan")


class CaseSection(Base):
    __tablename__ = "case_sections"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    section_type = Column(String(50), default="story") # story, briefing, suspects, timeline, narrative
    title = Column(String(255), nullable=False)
    content_markdown = Column(Text, nullable=False)
    sort_order = Column(Integer, default=0)

    case = relationship("Case", back_populates="sections")


class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False) # image, video, audio, document, note, voice, cctv, map, pdf
    file_url = Column(String(500), nullable=True)
    thumbnail_url = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    date_recorded = Column(String(100), nullable=True)
    is_locked = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)
    meta_info = Column(JSON, nullable=True)

    case = relationship("Case", back_populates="evidence")


class CaseVideo(Base):
    __tablename__ = "case_videos"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    video_url = Column(String(500), nullable=False)
    video_type = Column(String(50), default="mp4") # mp4, youtube, vimeo
    description = Column(Text, nullable=True)
    transcript = Column(Text, nullable=True)
    timestamp_markers = Column(JSON, nullable=True) # [{"time": "01:23", "label": "Key evidence identified"}]
    sort_order = Column(Integer, default=0)

    case = relationship("Case", back_populates="videos")


class CaseGalleryImage(Base):
    __tablename__ = "case_gallery_images"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String(500), nullable=False)
    caption = Column(String(255), nullable=True)
    sort_order = Column(Integer, default=0)

    case = relationship("Case", back_populates="gallery")


class CaseNote(Base):
    __tablename__ = "case_notes"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    body = Column(Text, nullable=False)
    highlight_color = Column(String(50), default="blood") # blood, brass, ink, paper
    is_pinned = Column(Boolean, default=False)
    is_confidential = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)

    case = relationship("Case", back_populates="notes")


class Clue(Base):
    __tablename__ = "clues"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    correct_answer = Column(String(255), nullable=False)
    hint = Column(Text, nullable=True)
    unlock_condition = Column(String(255), nullable=True)
    sort_order = Column(Integer, default=0)

    case = relationship("Case", back_populates="clues")


class CasePageContent(Base):
    """Stores all editable content for a case's public-facing detail page."""
    __tablename__ = "case_page_content"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="CASCADE"), nullable=False, unique=True)

    # Hero section
    hero_video_url = Column(String(500), nullable=True)
    hero_subtitle = Column(String(255), nullable=True)
    hero_badge_text = Column(String(100), nullable=True, default="Case File")

    # Evidence wall
    evidence_wall_bg_url = Column(String(500), nullable=True)
    # JSON: [{id, x, y, label, note, image_url, links: [[from_idx, to_idx]]}]
    evidence_pins = Column(JSON, nullable=True, default=list)

    # Investigation modules (3 cards)
    # JSON: [{icon, heading, body}]
    investigation_modules = Column(JSON, nullable=True, default=list)

    # Quote banner
    quote_text = Column(Text, nullable=True)
    quote_author = Column(String(255), nullable=True)

    # Case meta displayed on page
    case_type = Column(String(100), nullable=True, default="Homicide")
    date_of_incident = Column(String(100), nullable=True)
    location = Column(String(255), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    case = relationship("Case", back_populates="page_content")
