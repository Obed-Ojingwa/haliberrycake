# C:\Users\Melody\Documents\haliberrycake\backend\app\schemas\testimonial.py
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class TestimonialBase(BaseModel):
    customer_name: str = Field(..., min_length=2, max_length=150)
    customer_role: Optional[str] = None
    message: str = Field(..., min_length=10)
    image_url: Optional[str] = None
    rating: int = Field(5, ge=1, le=5)
    is_featured: bool = False


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialUpdate(BaseModel):
    customer_name: Optional[str] = None
    customer_role: Optional[str] = None
    message: Optional[str] = None
    image_url: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    is_featured: Optional[bool] = None
    is_approved: Optional[bool] = None


class TestimonialResponse(TestimonialBase):
    id: str
    is_approved: bool
    created_at: datetime

    model_config = {"from_attributes": True}