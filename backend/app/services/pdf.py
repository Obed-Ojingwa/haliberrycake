import os
import tempfile
from io import BytesIO
from typing import Optional
from fpdf import FPDF
import httpx
from app.models.order import Order
from app.models.inquiry import Inquiry


def _download_logo(logo_url: str) -> Optional[str]:
    try:
        response = httpx.get(logo_url, timeout=15)
        response.raise_for_status()
        content_type = response.headers.get('content-type', '').lower()
        suffix = '.png'
        if 'jpeg' in content_type or 'jpg' in content_type:
            suffix = '.jpg'
        elif 'gif' in content_type:
            suffix = '.gif'

        tmp_file = tempfile.NamedTemporaryFile(suffix=suffix, delete=False)
        try:
            tmp_file.write(response.content)
            return tmp_file.name
        finally:
            tmp_file.close()
    except Exception:
        return None


def _write_logo(pdf: FPDF, logo_url: Optional[str]) -> None:
    if not logo_url:
        return
    logo_path = _download_logo(logo_url)
    if not logo_path:
        return

    try:
        pdf.image(logo_path, x=15, y=12, w=35)
        pdf.ln(25)
    except Exception:
        pass
    finally:
        try:
            os.unlink(logo_path)
        except Exception:
            pass


def _format_currency(amount: float) -> str:
    return f'£{amount:.2f}'


def create_order_receipt(order: Order, logo_url: Optional[str] = None) -> bytes:
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    _write_logo(pdf, logo_url)

    pdf.set_font('Helvetica', 'B', 18)
    pdf.cell(0, 10, 'Haliberry Cake', ln=True)
    pdf.set_font('Helvetica', 'B', 14)
    pdf.cell(0, 8, 'Order Receipt', ln=True)
    pdf.ln(4)

    pdf.set_font('Helvetica', '', 11)
    pdf.cell(0, 6, f'Receipt reference: {order.id}', ln=True)
    pdf.cell(0, 6, f'Status: {order.status.capitalize()}', ln=True)
    if order.sumup_transaction_id:
        pdf.cell(0, 6, f'Transaction ID: {order.sumup_transaction_id}', ln=True)
    pdf.cell(0, 6, f'Customer: {order.customer_name}', ln=True)
    pdf.cell(0, 6, f'Email: {order.email}', ln=True)
    if order.phone:
        pdf.cell(0, 6, f'Phone: {order.phone}', ln=True)
    if order.delivery_date:
        pdf.cell(0, 6, f'Delivery date: {order.delivery_date}', ln=True)
    pdf.ln(4)

    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 7, 'Order details', ln=True)
    pdf.ln(1)
    pdf.set_font('Helvetica', '', 11)

    for item in order.items:
        pdf.multi_cell(0, 6, f'{item.quantity} × {item.product_name} @ {_format_currency(float(item.unit_price))} = {_format_currency(float(item.total_price))}')
        if item.custom_message:
            pdf.set_font('Helvetica', 'I', 10)
            pdf.multi_cell(0, 5, f'  Note: {item.custom_message}')
            pdf.set_font('Helvetica', '', 11)

    pdf.ln(2)
    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 7, f'Total amount: {_format_currency(float(order.total_amount))}', ln=True)

    if order.notes:
        pdf.ln(4)
        pdf.set_font('Helvetica', 'B', 12)
        pdf.cell(0, 7, 'Special instructions', ln=True)
        pdf.set_font('Helvetica', '', 10)
        pdf.multi_cell(0, 5, order.notes)

    pdf.ln(6)
    pdf.set_font('Helvetica', 'I', 10)
    pdf.multi_cell(0, 5, 'Thank you for choosing Haliberry Cake. This receipt is your premium order record and can be printed or saved for your event.')

    buffer = BytesIO()
    buffer.write(pdf.output(dest='S').encode('latin-1', errors='replace'))
    return buffer.getvalue()


def create_inquiry_receipt(inquiry: Inquiry, logo_url: Optional[str] = None) -> bytes:
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    _write_logo(pdf, logo_url)

    pdf.set_font('Helvetica', 'B', 18)
    pdf.cell(0, 10, 'Haliberry Cake', ln=True)
    pdf.set_font('Helvetica', 'B', 14)
    pdf.cell(0, 8, 'ENQUIRY RECEIPT', ln=True)
    pdf.ln(4)

    pdf.set_font('Helvetica', '', 11)
    pdf.cell(0, 6, f'Receipt reference: {inquiry.id}', ln=True)
    pdf.cell(0, 6, f'Contact: {inquiry.name}', ln=True)
    pdf.cell(0, 6, f'Email: {inquiry.email}', ln=True)
    if inquiry.phone:
        pdf.cell(0, 6, f'Phone: {inquiry.phone}', ln=True)
    pdf.cell(0, 6, f'Service requested: {inquiry.service_type}', ln=True)
    if inquiry.event_date:
        pdf.cell(0, 6, f'Event date: {inquiry.event_date}', ln=True)
    if inquiry.budget_range:
        pdf.cell(0, 6, f'Budget range: {inquiry.budget_range}', ln=True)

    pdf.ln(4)
    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 7, 'Message', ln=True)
    pdf.set_font('Helvetica', '', 11)
    pdf.multi_cell(0, 6, inquiry.message)

    pdf.ln(6)
    pdf.set_font('Helvetica', 'I', 10)
    pdf.multi_cell(0, 5, 'We have received your enquiry and will contact you soon. Save this receipt for your records.')

    buffer = BytesIO()
    buffer.write(pdf.output(dest='S').encode('latin-1', errors='replace'))
    return buffer.getvalue()
