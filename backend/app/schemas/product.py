# C:\Users\Melody\Documents\haliberrycake\backend\app\schemas\product.py
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class ProductBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = None
    category: str = Field(..., pattern="^(wedding|birthday|cupcakes|desserts|treats)$")
    image_url: Optional[str] = None
    price: float = Field(..., gt=0)
    featured: bool = False
    in_stock: bool = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    featured: Optional[bool] = None
    in_stock: Optional[bool] = None


class ProductResponse(ProductBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ProductListResponse(BaseModel):
    items: list[ProductResponse]
    total: int
    page: int
    page_size: int