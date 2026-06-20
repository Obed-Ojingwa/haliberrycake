from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.session import get_db
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.site_setting import SiteSetting
from app.schemas.order import (
    OrderCreate, OrderResponse, OrderStatusUpdate,
    OrderCheckoutResponse, OrderPaymentVerifyRequest,
)
from app.core.auth import get_current_admin
from app.services.payments import create_sumup_checkout, retrieve_sumup_checkout
from app.services.pdf import create_order_receipt
from app.services.email import send_order_notification
from app.core.config import settings

router = APIRouter(prefix="/orders", tags=["Orders"])


def _get_brand_logo_url(db: Session) -> Optional[str]:
    setting = db.query(SiteSetting).filter(SiteSetting.key == 'brand_logo').first()
    return setting.image_url if setting else None


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

    payment_method = payload.payment_method or 'sumup'
    order = Order(
        customer_name=payload.customer_name,
        email=payload.email,
        phone=payload.phone,
        delivery_date=payload.delivery_date,
        notes=payload.notes,
        payment_method=payment_method,
        total_amount=0.0,
        status='pending_payment' if payment_method == 'sumup' else 'pending',
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

    payment_url = None
    if order.payment_method == 'sumup':
        success_url = f"{settings.frontend_url.rstrip('/')}/payment-success?checkout_id={{checkout_id}}"
        cancel_url = f"{settings.frontend_url.rstrip('/')}/shop"
        checkout_data = create_sumup_checkout(order, success_url, cancel_url)
        if not checkout_data:
            raise HTTPException(status_code=500, detail="Unable to create SumUp checkout. Please try again later.")
        order.sumup_checkout_url = checkout_data.get('checkout_url')
        order.sumup_checkout_id = checkout_data.get('checkout_id')
        payment_url = order.sumup_checkout_url

    db.add(order)
    db.commit()
    db.refresh(order)

    if order.payment_method == 'offline':
        receipt_pdf = create_order_receipt(order, logo_url=_get_brand_logo_url(db))
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




def _send_order_receipt(order: Order, db: Session) -> None:
    logo_url = _get_brand_logo_url(db)
    receipt_pdf = create_order_receipt(order, logo_url=logo_url)

    if settings.email_admin:
        send_order_notification(
            order,
            recipient=settings.email_admin,
            subject=f"Paid Haliberry Cake order: {order.id}",
            body=f"Order {order.id} has been paid. Total £{order.total_amount}",
            attachment=receipt_pdf,
        )

    send_order_notification(
        order,
        recipient=order.email,
        subject="Your Haliberry Cake payment receipt",
        body=f"Thank you for your payment, {order.customer_name}! Your order number is {order.id}.",
        attachment=receipt_pdf,
    )


def _finalize_sumup_payment(order: Order, checkout_data: dict[str, object], db: Session) -> Order:
    reference = str(checkout_data.get('checkout_reference') or checkout_data.get('merchant_reference') or '')
    if reference and reference != order.id:
        raise HTTPException(status_code=400, detail="Checkout reference does not match order")

    amount_value = checkout_data.get('amount')
    currency_value = None
    if isinstance(amount_value, dict):
        currency_value = amount_value.get('currency') or amount_value.get('currency_code')
        amount_value = amount_value.get('amount') or amount_value.get('value')

    if amount_value is not None:
        try:
            amount = float(amount_value)
        except (TypeError, ValueError):
            amount = None
        if amount is not None and round(amount, 2) != round(float(order.total_amount), 2):
            raise HTTPException(status_code=400, detail="Checkout amount does not match order total")

    if currency_value is not None and str(currency_value).upper() != 'GBP':
        raise HTTPException(status_code=400, detail="Checkout currency does not match order currency")

    state = str(checkout_data.get('state', '') or checkout_data.get('status', '') or '').upper()
    transaction_id = (
        checkout_data.get('transaction_id')
        or checkout_data.get('payment_id')
        or checkout_data.get('transaction')
        or checkout_data.get('payment')
    )
    if isinstance(transaction_id, dict):
        transaction_id = transaction_id.get('id') or transaction_id.get('transaction_id')

    if transaction_id:
        order.sumup_transaction_id = str(transaction_id)

    previous_status = order.status
    if state in {'PAID', 'COMPLETED'}:
        order.status = 'paid'
        if order.paid_at is None:
            order.paid_at = datetime.now(timezone.utc)
    elif state == 'CANCELLED':
        order.status = 'cancelled'
    elif state in {'FAILED', 'EXPIRED', 'DECLINED'}:
        order.status = 'failed'

    db.commit()
    db.refresh(order)

    if order.status == 'paid' and previous_status != 'paid':
        _send_order_receipt(order, db)

    return order


@router.post("/verify-payment", response_model=OrderResponse)
def verify_sumup_payment(payload: OrderPaymentVerifyRequest, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.sumup_checkout_id == payload.checkout_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    checkout_data = retrieve_sumup_checkout(payload.checkout_id)
    if not checkout_data:
        raise HTTPException(status_code=400, detail="Unable to retrieve SumUp checkout")

    return _finalize_sumup_payment(order, checkout_data, db)


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
    receipt_pdf = create_order_receipt(order, logo_url=_get_brand_logo_url(db))
    return Response(content=receipt_pdf, media_type="application/pdf")
