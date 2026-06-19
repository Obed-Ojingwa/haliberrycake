from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session
from typing import List, Optional
import hashlib
import hmac

from app.database.session import get_db
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.site_setting import SiteSetting
from app.schemas.order import (
    OrderCreate, OrderResponse, OrderStatusUpdate,
    OrderCheckoutResponse,
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


async def _verify_sumup_signature(request: Request, secret: str) -> bool:
    raw_body = await request.body()
    signature = request.headers.get('X-SumUp-Signature') or request.headers.get('X-Signature') or ''
    if not signature:
        return False
    expected = hmac.new(secret.encode(), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(signature, expected)


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

    payment_url = None
    if order.payment_method == 'sumup':
        success_url = f"{settings.frontend_url.rstrip('/')}/order-success?order_id={order.id}"
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


@router.post("/webhook", status_code=status.HTTP_204_NO_CONTENT)
async def sumup_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    secret = settings.sumup_webhook_secret
    if not secret:
        raise HTTPException(status_code=403, detail="Webhook secret is not configured")

    if not await _verify_sumup_signature(request, secret):
        raise HTTPException(status_code=403, detail="Invalid webhook signature")

    payload = await request.json()
    checkout_id = payload.get('id') or payload.get('checkout_id')
    if not checkout_id:
        checkout = payload.get('checkout') or {}
        checkout_id = checkout.get('id') or checkout.get('checkout_id')

    if not checkout_id:
        raise HTTPException(status_code=400, detail="Webhook payload missing checkout id")

    order = db.query(Order).filter(Order.sumup_checkout_id == checkout_id).first()
    if not order:
        # Attempt to locate by checkout reference if available
        checkout_reference = payload.get('checkout_reference') or payload.get('checkoutReference')
        if checkout_reference:
            order = db.query(Order).filter(Order.id == checkout_reference).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    checkout_data = retrieve_sumup_checkout(checkout_id)
    if not checkout_data:
        raise HTTPException(status_code=400, detail="Unable to retrieve SumUp checkout")

    state = str(checkout_data.get('state', '') or checkout_data.get('status', '') or '').upper()
    transaction_id = (
        checkout_data.get('transaction_id')
        or checkout_data.get('payment_id')
        or checkout_data.get('transaction')
        or checkout_data.get('payment')
    )
    if isinstance(transaction_id, dict):
        transaction_id = transaction_id.get('id') or transaction_id.get('transaction_id')

    if state == 'PAID' or state == 'COMPLETED':
        order.status = 'paid'
        if transaction_id:
            order.sumup_transaction_id = str(transaction_id)
        db.commit()
        db.refresh(order)

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

    return Response(status_code=status.HTTP_204_NO_CONTENT)


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
