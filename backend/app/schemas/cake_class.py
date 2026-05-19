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
    created_at: datetime

    # Pydantic v2 needs @computed_field to serialize @property from SQLAlchemy models.
    # We calculate it here directly from the raw fields instead.
    available_slots: int = 0

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_with_slots(cls, obj: object) -> "CakeClassResponse":
        """
        Use this instead of model_validate() when building from an ORM object,
        so that available_slots is correctly computed.
        """
        data = {
            c.key: getattr(obj, c.key)
            for c in obj.__class__.__table__.columns  # type: ignore[attr-defined]
        }
        total  = data.get("total_slots", 0)
        booked = data.get("booked_slots", 0)
        data["available_slots"] = max(0, total - booked)
        return cls.model_validate(data)



# # C:\Users\Melody\Documents\haliberrycake\backend\app\schemas\cake_class.py
# from datetime import datetime, date
# from pydantic import BaseModel, Field
# from typing import Optional


# class CakeClassBase(BaseModel):
#     title: str = Field(..., min_length=2, max_length=200)
#     description: Optional[str] = None
#     class_date: date
#     duration_hours: float = Field(..., gt=0)
#     price: float = Field(..., gt=0)
#     total_slots: int = Field(..., gt=0)
#     location: Optional[str] = None
#     level: str = "beginner"
#     image_url: Optional[str] = None
#     is_active: bool = True


# class CakeClassCreate(CakeClassBase):
#     pass


# class CakeClassUpdate(BaseModel):
#     title: Optional[str] = None
#     description: Optional[str] = None
#     class_date: Optional[date] = None
#     duration_hours: Optional[float] = None
#     price: Optional[float] = None
#     total_slots: Optional[int] = None
#     location: Optional[str] = None
#     level: Optional[str] = None
#     image_url: Optional[str] = None
#     is_active: Optional[bool] = None


# class CakeClassResponse(CakeClassBase):
#     id: str
#     booked_slots: int
#     available_slots: int
#     created_at: datetime

#     model_config = {"from_attributes": True}