import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, Numeric, DateTime, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_name: Mapped[str] = mapped_column(String(150), nullable=False)
    email: Mapped[str] = mapped_column(String(254), nullable=False, index=True)
    phone: Mapped[str | None] = mapped_column(String(30))
    delivery_date: Mapped[str | None] = mapped_column(String(100))
    notes: Mapped[str | None] = mapped_column(Text)
    total_amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default='pending', index=True)
    payment_method: Mapped[str] = mapped_column(String(50), nullable=False, default='sumup')
    sumup_checkout_id: Mapped[str | None] = mapped_column(String(90), nullable=True, index=True)
    sumup_transaction_id: Mapped[str | None] = mapped_column(String(90), nullable=True, index=True)
    sumup_checkout_url: Mapped[str | None] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    items: Mapped[list['OrderItem']] = relationship(
        'OrderItem', back_populates='order', cascade='all, delete-orphan', lazy='joined'
    )


class OrderItem(Base):
    __tablename__ = 'order_items'

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id: Mapped[str] = mapped_column(ForeignKey('orders.id', ondelete='CASCADE'), nullable=False, index=True)
    product_id: Mapped[str] = mapped_column(String(36), nullable=False)
    product_name: Mapped[str] = mapped_column(String(200), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    unit_price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    total_price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    custom_message: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    order: Mapped['Order'] = relationship('Order', back_populates='items')
