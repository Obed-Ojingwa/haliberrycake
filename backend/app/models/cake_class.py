# C:\Users\Melody\Documents\haliberrycake\backend\app\models\cake_class.py
import uuid
from datetime import datetime, timezone, date
from sqlalchemy import String, Text, Numeric, Integer, DateTime, Date
from sqlalchemy.orm import Mapped, mapped_column
from app.database.session import Base


class CakeClass(Base):
    __tablename__ = "cake_classes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    class_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    duration_hours: Mapped[float] = mapped_column(Numeric(4, 1), nullable=False)
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    total_slots: Mapped[int] = mapped_column(Integer, nullable=False)
    booked_slots: Mapped[int] = mapped_column(Integer, default=0)
    location: Mapped[str | None] = mapped_column(String(300))
    level: Mapped[str] = mapped_column(String(50), default="beginner")
    # level: beginner | intermediate | advanced
    image_url: Mapped[str | None] = mapped_column(String(500))
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    @property
    def available_slots(self) -> int:
        return max(0, self.total_slots - self.booked_slots)