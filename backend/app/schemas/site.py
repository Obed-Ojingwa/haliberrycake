# C:\Users\Melody\Documents\haliberrycake\backend\app\schemas\site.py
from pydantic import BaseModel, Field
from typing import Optional

class SiteSettingBase(BaseModel):
    key: str = Field(..., max_length=100)
    image_url: Optional[str] = Field(None, max_length=500)
    caption: Optional[str] = None

class SiteSettingCreate(SiteSettingBase):
    pass

class SiteSettingUpdate(BaseModel):
    image_url: Optional[str] = Field(None, max_length=500)
    caption: Optional[str] = None

class SiteSettingResponse(SiteSettingBase):
    id: str
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True