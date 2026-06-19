from io import BytesIO
from fpdf import FPDF
from app.models.order import Order


def create_order_receipt(order: Order) -> bytes:
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    pdf.set_font('Helvetica', 'B', 18)
    pdf.cell(0, 10, 'Haliberry Cake', ln=True)
    pdf.set_font('Helvetica', '', 12)
    pdf.cell(0, 8, 'Order Receipt', ln=True)
    pdf.ln(4)

    pdf.set_font('Helvetica', '', 11)
    pdf.cell(0, 6, f'Order ID: {order.id}', ln=True)
    pdf.cell(0, 6, f'Status: {order.status.capitalize()}', ln=True)
    pdf.cell(0, 6, f'Customer: {order.customer_name}', ln=True)
    pdf.cell(0, 6, f'Email: {order.email}', ln=True)
    if order.phone:
        pdf.cell(0, 6, f'Phone: {order.phone}', ln=True)
    if order.delivery_date:
        pdf.cell(0, 6, f'Delivery date: {order.delivery_date}', ln=True)
    pdf.ln(4)

    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 7, 'Items', ln=True)
    pdf.set_font('Helvetica', '', 11)
    pdf.ln(1)

    for item in order.items:
        pdf.cell(0, 6, f'{item.quantity} x {item.product_name} @ £{float(item.unit_price):.2f}', ln=True)
        if item.custom_message:
            pdf.set_font('Helvetica', 'I', 10)
            pdf.multi_cell(0, 5, f'  Note: {item.custom_message}')
            pdf.set_font('Helvetica', '', 11)

    pdf.ln(2)
    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 7, f'Total: £{float(order.total_amount):.2f}', ln=True)

    if order.notes:
        pdf.ln(3)
        pdf.set_font('Helvetica', 'B', 12)
        pdf.cell(0, 7, 'Special instructions', ln=True)
        pdf.set_font('Helvetica', '', 10)
        pdf.multi_cell(0, 5, order.notes)

    buffer = BytesIO()
    buffer.write(pdf.output(dest='S').encode('latin-1'))
    return buffer.getvalue()
