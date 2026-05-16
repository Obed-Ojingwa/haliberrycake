# C:\Users\Melody\Documents\haliberrycake\backend\app\schemas\cake_class.py
from datetime import datetime, date
from pydantic import BaseModel, Field
from typing import Optional


class CakeClassBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = None
    class_date: date
    duration_hours: float = Field(..., gt=0)
    price: float = Field(..., gt=0)
    total_slots: int = Field(..., gt=0)
    location: Optional[str] = None
    level: str = "beginner"
    image_url: Optional[str] = None
    is_active: bool = True


class CakeClassCreate(CakeClassBase):
    pass


class CakeClassUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    class_date: Optional[date] = None
    duration_hours: Optional[float] = None
    price: Optional[float] = None
    total_slots: Optional[int] = None
    location: Optional[str] = None
    level: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None


class CakeClassResponse(CakeClassBase):
    id: str
    booked_slots: int
    available_slots: int
    created_at: datetime

    model_config = {"from_attributes": True}