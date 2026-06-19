from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import (
    OrderCreate, OrderResponse, OrderStatusUpdate,
    OrderCheckoutResponse,
)
from app.core.auth import get_current_admin
from app.services.payments import create_sumup_checkout
from app.services.pdf import create_order_receipt
from app.services.email import send_order_notification
from app.core.config import settings

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=OrderCheckoutResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    payload: OrderCreate,
    db: Session = Depends(get_db),
):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Order must include at least one item")

    product_ids = [item.product_id for item in payload.items]
    products = db.query(Product).filter(Product.id.in_(product_ids)).all()
    product_map = {product.id: product for product in products}

    if len(product_map) != len(product_ids):
        missing = set(product_ids) - set(product_map.keys())
        raise HTTPException(status_code=400, detail=f"Invalid product id(s): {', '.join(missing)}")

    order = Order(
        customer_name=payload.customer_name,
        email=payload.email,
        phone=payload.phone,
        delivery_date=payload.delivery_date,
        notes=payload.notes,
        payment_method=payload.payment_method or 'sumup',
        total_amount=0.0,
        status='pending',
    )

    total_amount = 0.0
    for item_payload in payload.items:
        product = product_map[item_payload.product_id]
        item_total = float(product.price) * item_payload.quantity
        order_item = OrderItem(
            product_id=product.id,
            product_name=product.name,
            quantity=item_payload.quantity,
            unit_price=float(product.price),
            total_price=item_total,
            custom_message=item_payload.custom_message,
        )
        total_amount += item_total
        order.items.append(order_item)

    order.total_amount = round(total_amount, 2)
    db.add(order)
    db.commit()
    db.refresh(order)

    payment_url = None
    if order.payment_method == 'sumup':
        success_url = f"{settings.frontend_url.rstrip('/')}/order-success?order_id={order.id}"
        cancel_url = f"{settings.frontend_url.rstrip('/')}/shop"
        payment_url = create_sumup_checkout(order, success_url, cancel_url)
        if payment_url:
            order.sumup_checkout_url = payment_url
            db.commit()
            db.refresh(order)

    receipt_pdf = create_order_receipt(order)
    if settings.email_admin:
        send_order_notification(
            order,
            recipient=settings.email_admin,
            subject=f"New Haliberry Cake order: {order.id}",
            body=f"A new order has been placed by {order.customer_name}. Total £{order.total_amount}",
            attachment=receipt_pdf,
        )
    send_order_notification(
        order,
        recipient=payload.email,
        subject="Your Haliberry Cake order receipt",
        body=f"Thank you for your order, {payload.customer_name}! Your order number is {order.id}.",
        attachment=receipt_pdf,
    )

    return OrderCheckoutResponse(
        order_id=order.id,
        payment_url=payment_url,
        message="Order created successfully.",
        order=order,
    )


@router.get("", response_model=List[OrderResponse])
def list_orders(
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    return db.query(Order).order_by(Order.created_at.desc()).all()


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: str, db: Session = Depends(get_db), _: str = Depends(get_current_admin)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(order_id: str, payload: OrderStatusUpdate, db: Session = Depends(get_db), _: str = Depends(get_current_admin)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = payload.status
    db.commit()
    db.refresh(order)
    return order


@router.get("/{order_id}/receipt")
def get_order_receipt(order_id: str, db: Session = Depends(get_db), _: str = Depends(get_current_admin)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    receipt_pdf = create_order_receipt(order)
    return Response(content=receipt_pdf, media_type="application/pdf")
