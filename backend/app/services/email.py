import logging
import smtplib
from email.message import EmailMessage
from typing import Optional

from app.core.config import settings
from app.models.order import Order

logger = logging.getLogger('haliberry.email')


def send_email(
    subject: str,
    body: str,
    to_address: str,
    attachment: Optional[bytes] = None,
    attachment_name: str = 'receipt.pdf',
) -> None:
    if not settings.email_smtp_host or not settings.email_smtp_user or not settings.email_smtp_password or not settings.email_from:
        logger.warning('Email credentials not configured; skipping send_email')
        return

    message = EmailMessage()
    message['Subject'] = subject
    message['From'] = settings.email_from
    message['To'] = to_address
    message.set_content(body)

    if attachment is not None:
        message.add_attachment(
            attachment,
            maintype='application',
            subtype='pdf',
            filename=attachment_name,
        )

    try:
        if settings.email_use_tls:
            smtp = smtplib.SMTP(settings.email_smtp_host, settings.email_smtp_port, timeout=30)
            smtp.starttls()
        else:
            smtp = smtplib.SMTP_SSL(settings.email_smtp_host, settings.email_smtp_port, timeout=30)

        smtp.login(settings.email_smtp_user, settings.email_smtp_password)
        smtp.send_message(message)
        smtp.quit()
        logger.info('Email sent to %s', to_address)
    except Exception as exc:
        logger.error('Failed to send email to %s: %s', to_address, exc)


def send_order_notification(order: Order, recipient: str, subject: str, body: str, attachment: Optional[bytes] = None) -> None:
    send_email(subject, body, recipient, attachment)
