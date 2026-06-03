# C:\Users\Melody\Documents\haliberrycake\backend\app\schemas\site_setting.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SiteSettingResponse(BaseModel):
    id: str
    key: str
    image_url: Optional[str] = None
    caption: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class SiteSettingUpdate(BaseModel):
    image_url: Optional[str] = None
    caption: Optional[str] = None