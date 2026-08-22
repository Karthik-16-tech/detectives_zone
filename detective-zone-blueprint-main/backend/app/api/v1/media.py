import os
import uuid
import aiofiles
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.config import settings
from app.core.database import get_db
from app.core.deps import get_current_admin
from app.models.admin import Admin
from app.models.media import MediaFile
from app.schemas.media import MediaFileOut, MediaFolderOut
from app.services.audit import log_admin_action

router = APIRouter(prefix="/media", tags=["Media Library & File Uploads"])

def detect_file_type(mime_type: str, filename: str) -> str:
    mime = mime_type.lower()
    ext = os.path.splitext(filename)[1].lower()
    if mime.startswith("image/") or ext in [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]:
        return "image"
    elif mime.startswith("video/") or ext in [".mp4", ".mov", ".webm", ".avi", ".mkv"]:
        return "video"
    elif mime.startswith("audio/") or ext in [".mp3", ".wav", ".ogg", ".aac", ".m4a"]:
        return "audio"
    else:
        return "document"

@router.post("/upload", response_model=MediaFileOut)
async def upload_file(
    file: UploadFile = File(...),
    folder: Optional[str] = Form("general"),
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Ensure upload directory exists
    folder_clean = "".join(c for c in folder if c.isalnum() or c in ("-", "_")).lower() or "general"
    target_dir = os.path.join(settings.UPLOAD_DIR, folder_clean)
    os.makedirs(target_dir, exist_ok=True)
    
    # Generate unique filename
    ext = os.path.splitext(file.filename)[1].lower()
    unique_filename = f"{uuid.uuid4().hex[:12]}_{file.filename.replace(' ', '_')}"
    file_path = os.path.join(target_dir, unique_filename)
    
    # Write file
    file_size = 0
    async with aiofiles.open(file_path, 'wb') as out_file:
        while content := await file.read(1024 * 1024): # 1MB chunks
            file_size += len(content)
            await out_file.write(content)
            
    # Public URL path
    file_url = f"/uploads/{folder_clean}/{unique_filename}"
    file_type = detect_file_type(file.content_type or "", file.filename)
    
    media = MediaFile(
        filename=unique_filename,
        original_name=file.filename,
        file_url=file_url,
        file_type=file_type,
        mime_type=file.content_type or "application/octet-stream",
        file_size=file_size,
        folder=folder_clean
    )
    db.add(media)
    db.commit()
    db.refresh(media)
    
    log_admin_action(db, "UPLOAD", "Media", str(media.id), f"Uploaded {file.filename} ({file_type})", current_admin)
    return media

@router.get("", response_model=List[MediaFileOut])
def list_media(
    folder: Optional[str] = None,
    file_type: Optional[str] = None,
    search: Optional[str] = None,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    query = db.query(MediaFile)
    if folder and folder.lower() != "all":
        query = query.filter(MediaFile.folder == folder)
    if file_type and file_type.lower() != "all":
        query = query.filter(MediaFile.file_type == file_type)
    if search:
        query = query.filter(MediaFile.original_name.ilike(f"%{search}%"))
    return query.order_by(MediaFile.created_at.desc()).all()

@router.delete("/{media_id}")
def delete_media(
    media_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    media = db.query(MediaFile).filter(MediaFile.id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media file not found")
    
    # Try deleting local file
    try:
        relative_path = media.file_url.replace("/uploads/", "")
        local_path = os.path.join(settings.UPLOAD_DIR, relative_path.replace("/", os.sep))
        if os.path.exists(local_path):
            os.remove(local_path)
    except Exception as e:
        print(f"Warning: could not delete local media file: {e}")
    
    db.delete(media)
    db.commit()
    log_admin_action(db, "DELETE", "Media", str(media_id), f"Deleted {media.original_name}", current_admin)
    return {"message": "Media file deleted"}
