# C:\Users\Melody\Documents\haliberrycake\backend\app\api\inquiries.py
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database.session import get_db
from app.models.inquiry import Inquiry
from app.schemas.gallery import InquiryCreate, InquiryResponse
from app.core.auth import get_current_admin

limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/inquiries", tags=["Inquiries"])


@router.post("", response_model=InquiryResponse, status_code=201)
@limiter.limit("5/hour")
def submit_inquiry(
    request: Request,
    payload: InquiryCreate,
    db: Session = Depends(get_db),
):
    """Rate-limited public endpoint — 5 submissions per IP per hour."""
    inquiry = Inquiry(**payload.model_dump())
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return inquiry


# ── Admin endpoints ───────────────────────────────────────────────

@router.get("", response_model=list[InquiryResponse])
def list_inquiries(
    db: Session = Depends(get_db),
    unread_only: bool = False,
    _: str = Depends(get_current_admin),
):
    q = db.query(Inquiry)
    if unread_only:
        q = q.filter(Inquiry.is_read == False)
    return q.order_by(Inquiry.created_at.desc()).all()


@router.patch("/{inquiry_id}/read", response_model=InquiryResponse)
def mark_read(
    inquiry_id: str,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    inq = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inq:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    inq.is_read = True
    db.commit()
    db.refresh(inq)
    return inq


@router.delete("/{inquiry_id}", status_code=204)
def delete_inquiry(
    inquiry_id: str,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    inq = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inq:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    db.delete(inq)
    db.commit()