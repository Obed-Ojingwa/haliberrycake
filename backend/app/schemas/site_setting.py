# C:\Users\Melody\Documents\haliberrycake\backend\app\schemas\site_setting.py

from pydantic import BaseModel, field_validator
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

    @field_validator("id", mode="before")
    @classmethod
    def coerce_uuid(cls, v):
        return str(v)


class SiteSettingUpdate(BaseModel):
    image_url: Optional[str] = None
    caption: Optional[str] = None

# C:\Users\Melody\Documents\haliberrycake\backend\app\schemas\site_setting.py
# from pydantic import BaseModel
# from typing import Optional
# from datetime import datetime


# class SiteSettingResponse(BaseModel):
#     id: str
#     key: str
#     image_url: Optional[str] = None
#     caption: Optional[str] = None
#     created_at: datetime
#     updated_at: datetime

#     model_config = {"from_attributes": True}


# class SiteSettingUpdate(BaseModel):
#     image_url: Optional[str] = None
#     caption: Optional[str] = None