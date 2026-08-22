from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class SiteSettingBase(BaseModel):
    key: str
    value: str
    group: Optional[str] = "general"
    description: Optional[str] = None

class SiteSettingCreate(SiteSettingBase):
    pass

class SiteSettingUpdate(BaseModel):
    value: str
    group: Optional[str] = None
    description: Optional[str] = None

class SiteSettingOut(SiteSettingBase):
    id: int
    updated_at: datetime
    class Config:
        from_attributes = True

class BulkSettingsUpdate(BaseModel):
    settings: Dict[str, str]
