# C:\Users\Melody\Documents\haliberrycake\backend\app\models\cic.py
import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, Boolean, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.database.session import Base


class CICProgram(Base):
    __tablename__ = "cic_programs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    impact_stats: Mapped[dict | None] = mapped_column(JSON)
    # impact_stats shape: { "women_supported": 50, "classes_held": 12 }
    image_url: Mapped[str | None] = mapped_column(String(500))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )