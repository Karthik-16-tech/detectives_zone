from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MediaFileOut(BaseModel):
    id: int
    filename: str
    original_name: str
    file_url: str
    file_type: str # image, video, audio, document
    mime_type: str
    file_size: int
    folder: str
    width: Optional[int] = None
    height: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

class MediaFolderOut(BaseModel):
    name: str
    count: int
