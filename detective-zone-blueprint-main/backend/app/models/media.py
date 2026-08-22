from sqlalchemy import Column, Integer, String, BigInteger, DateTime
from datetime import datetime

from app.core.database import Base

class MediaFile(Base):
    __tablename__ = "media"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    original_name = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=False)
    
    # file_type: image, video, audio, document
    file_type = Column(String(50), nullable=False)
    mime_type = Column(String(100), nullable=False)
    file_size = Column(BigInteger, default=0) # in bytes
    folder = Column(String(100), default="general") # cases, store, kits, evidence, general
    
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
