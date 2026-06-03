# C:\Users\Melody\Documents\haliberrycake\backend\app\models\site.py
import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.database.session import Base


class SiteSetting(Base):
    __tablename__ = "site_settings"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    # Key to identify the setting, e.g., 'hero_background', 'founder_portrait', 'about_image_1'
    key: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    image_url: Mapped[str | None] = mapped_column(String(500))
    # Optional caption or description for the image
    caption: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )