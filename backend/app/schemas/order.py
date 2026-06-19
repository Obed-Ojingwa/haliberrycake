from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, Field, EmailStr


class OrderItemCreate(BaseModel):
    product_id: str = Field(..., min_length=1)
    quantity: int = Field(..., gt=0)
    custom_message: Optional[str] = None


class OrderCreate(BaseModel):
    customer_name: str = Field(..., min_length=2)
    email: EmailStr
    phone: Optional[str] = None
    delivery_date: Optional[str] = None
    notes: Optional[str] = None
    payment_method: Optional[Literal['sumup', 'offline']] = 'sumup'
    items: list[OrderItemCreate]


class OrderItemResponse(BaseModel):
    id: str
    product_id: str
    product_name: str
    quantity: int
    unit_price: float
    total_price: float
    custom_message: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: str
    customer_name: str
    email: EmailStr
    phone: Optional[str] = None
    delivery_date: Optional[str] = None
    notes: Optional[str] = None
    total_amount: float
    status: str
    payment_method: str
    sumup_checkout_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: list[OrderItemResponse]

    model_config = {"from_attributes": True}


class OrderStatusUpdate(BaseModel):
    status: Literal['pending', 'paid', 'processing', 'completed', 'cancelled']


class OrderCheckoutResponse(BaseModel):
    order_id: str
    payment_url: Optional[str] = None
    message: str
    order: OrderResponse
