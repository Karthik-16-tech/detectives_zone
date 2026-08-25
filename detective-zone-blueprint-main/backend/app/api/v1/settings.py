from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.core.database import get_db
from app.core.deps import get_current_admin
from app.models.admin import Admin
from app.models.setting import SiteSetting
from app.schemas.setting import SiteSettingBase, SiteSettingOut, BulkSettingsUpdate
from app.services.audit import log_admin_action

router = APIRouter(prefix="/settings", tags=["Site Settings & Global CMS"])


@router.get("", response_model=Dict[str, str])
def get_public_settings(db: Session = Depends(get_db)):
    """Retrieve all public site settings."""
    settings_records = db.query(SiteSetting).all()
    return {s.key: s.value for s in settings_records}


@router.get("/admin/all", response_model=List[SiteSettingOut])
def get_all_settings_admin(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Retrieve all settings with full metadata for admin."""
    return db.query(SiteSetting).all()


@router.put("", response_model=Dict[str, str])
def update_settings_root(
    payload: Dict[str, Any] = Body(...),
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """PUT endpoint to update key-value settings dictionary."""
    for key, value in payload.items():
        if value is not None:
            setting = db.query(SiteSetting).filter(SiteSetting.key == key).first()
            if setting:
                setting.value = str(value)
            else:
                db.add(SiteSetting(key=key, value=str(value)))
    db.commit()
    log_admin_action(db, "UPDATE_SETTINGS", "SiteSetting", details=f"Updated {len(payload)} settings", admin=current_admin)
    
    all_settings = db.query(SiteSetting).all()
    return {s.key: s.value for s in all_settings}


@router.post("/admin/bulk", response_model=Dict[str, str])
@router.put("/admin/bulk", response_model=Dict[str, str])
def bulk_update_settings(
    req: BulkSettingsUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Bulk update site settings."""
    for key, value in req.settings.items():
        if value is not None:
            setting = db.query(SiteSetting).filter(SiteSetting.key == key).first()
            if setting:
                setting.value = str(value)
            else:
                db.add(SiteSetting(key=key, value=str(value)))
    db.commit()
    log_admin_action(db, "UPDATE_SETTINGS", "SiteSetting", details=f"Updated {len(req.settings)} settings", admin=current_admin)
    
    all_settings = db.query(SiteSetting).all()
    return {s.key: s.value for s in all_settings}


@router.put("/upi-id")
def update_upi_id(
    payload: Dict[str, str] = Body(...),
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Dedicated endpoint to update active merchant UPI ID."""
    upi_id = payload.get("upi_id", "").strip()
    if not upi_id or "@" not in upi_id:
        raise HTTPException(status_code=400, detail="Invalid UPI ID format. Must include '@' handle (e.g. 8885296645@ybl)")

    setting = db.query(SiteSetting).filter(SiteSetting.key == "upi_id").first()
    if setting:
        setting.value = upi_id
    else:
        db.add(SiteSetting(key="upi_id", value=upi_id, description="Active merchant UPI ID"))

    db.commit()
    log_admin_action(db, "UPDATE_UPI_ID", "SiteSetting", details=f"Admin changed merchant UPI ID to '{upi_id}'", admin=current_admin)
    return {"success": True, "upi_id": upi_id, "message": f"Merchant UPI ID successfully updated to {upi_id}"}
