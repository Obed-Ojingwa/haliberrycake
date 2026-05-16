# C:\Users\Melody\Documents\haliberrycake\backend\app\schemas\gallery.py
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class GalleryImageBase(BaseModel):
    image_url: str
    category: str
    caption: Optional[str] = None
    alt_text: Optional[str] = None
    is_featured: bool = False
    sort_order: int = 0


class GalleryImageCreate(GalleryImageBase):
    pass


class GalleryImageUpdate(BaseModel):
    category: Optional[str] = None
    caption: Optional[str] = None
    alt_text: Optional[str] = None
    is_featured: Optional[bool] = None
    sort_order: Optional[int] = None


class GalleryImageResponse(GalleryImageBase):
    id: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Inquiry ───────────────────────────────────────────────────────

class InquiryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    email: str = Field(..., pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    phone: Optional[str] = None
    service_type: str
    message: str = Field(..., min_length=10, max_length=2000)
    event_date: Optional[str] = None
    budget_range: Optional[str] = None


class InquiryResponse(InquiryCreate):
    id: str
    is_read: bool
    is_replied: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# ── CIC Program ───────────────────────────────────────────────────

class CICProgramBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = None
    impact_stats: Optional[dict] = None
    image_url: Optional[str] = None
    is_active: bool = True
    sort_order: int = 0


class CICProgramCreate(CICProgramBase):
    pass


class CICProgramUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    impact_stats: Optional[dict] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None


class CICProgramResponse(CICProgramBase):
    id: str
    created_at: datetime

    model_config = {"from_attributes": True}