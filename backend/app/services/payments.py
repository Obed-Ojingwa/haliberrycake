import time
import hashlib
import hmac
from typing import Optional
import httpx
from app.core.config import settings
from app.models.order import Order

_token_cache: dict[str, Optional[object]] = {
    'access_token': None,
    'expires_at': 0,
}


def _credentials_ready() -> bool:
    return bool(settings.sumup_client_id and settings.sumup_client_secret)


def _get_sumup_access_token() -> Optional[str]:
    if not _credentials_ready():
        return None

    now = time.time()
    if _token_cache['access_token'] and _token_cache['expires_at'] > now + 60:
        return _token_cache['access_token']

    token_url = f"{settings.sumup_base_url.rstrip('/')}/token"
    payload = {
        'grant_type': 'client_credentials',
        'client_id': settings.sumup_client_id,
        'client_secret': settings.sumup_client_secret,
    }
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    response = httpx.post(token_url, data=payload, headers=headers, timeout=20)
    response.raise_for_status()
    data = response.json()
    access_token = data.get('access_token')
    if not access_token:
        return None

    expires_in = int(data.get('expires_in', 3600))
    _token_cache['access_token'] = access_token
    _token_cache['expires_at'] = now + expires_in
    return access_token


def create_sumup_checkout(order: Order, success_url: str, cancel_url: str) -> Optional[dict[str, str]]:
    access_token = _get_sumup_access_token()
    if not access_token:
        return None

    checkout_url = f"{settings.sumup_base_url.rstrip('/')}/v1/checkouts"
    description = f'Order {order.id} — Haliberry Cake'
    payload = {
        'amount': str(float(order.total_amount)),
        'currency': 'GBP',
        'checkout_reference': order.id,
        'return_url': success_url,
        'cancel_url': cancel_url,
        'title': 'Haliberry Cake Order',
        'description': description,
    }
    if settings.sumup_pay_to_email:
        payload['pay_to_email'] = settings.sumup_pay_to_email

    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json',
    }
    response = httpx.post(checkout_url, json=payload, headers=headers, timeout=20)
    response.raise_for_status()
    result = response.json()

    return {
        'checkout_url': result.get('hosted_checkout_url') or result.get('checkout_url'),
        'checkout_id': result.get('id'),
    }


def retrieve_sumup_checkout(checkout_id: str) -> Optional[dict[str, object]]:
    access_token = _get_sumup_access_token()
    if not access_token:
        return None

    checkout_url = f"{settings.sumup_base_url.rstrip('/')}/v1/checkouts/{checkout_id}"
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json',
    }

    response = httpx.get(checkout_url, headers=headers, timeout=20)
    if response.status_code == 404:
        return None
    response.raise_for_status()
    return response.json()
