# C:\Users\Melody\Documents\haliberrycake\backend\app\api\testimonials.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.testimonial import Testimonial
from app.schemas.testimonial import TestimonialCreate, TestimonialUpdate, TestimonialResponse
from app.core.auth import get_current_admin

router = APIRouter(prefix="/testimonials", tags=["Testimonials"])


# ── Public: approved only ─────────────────────────────────────────

@router.get("", response_model=list[TestimonialResponse])
def list_testimonials(
    db: Session = Depends(get_db),
    featured_only: bool = False,
):
    """Public endpoint — returns only approved testimonials."""
    q = db.query(Testimonial).filter(Testimonial.is_approved == True)
    if featured_only:
        q = q.filter(Testimonial.is_featured == True)
    return q.order_by(Testimonial.is_featured.desc(), Testimonial.created_at.desc()).all()


# ── Admin: all reviews including pending ─────────────────────────

@router.get("/admin/all", response_model=list[TestimonialResponse])
def list_all_testimonials(
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    """Admin endpoint — returns ALL testimonials including unapproved ones."""
    return (
        db.query(Testimonial)
        .order_by(Testimonial.is_approved.asc(), Testimonial.created_at.desc())
        .all()
    )


# ── Public: submit a review (goes to pending) ─────────────────────

@router.post("", response_model=TestimonialResponse, status_code=status.HTTP_201_CREATED)
def create_testimonial(payload: TestimonialCreate, db: Session = Depends(get_db)):
    """
    Public submission — saved with is_approved=False.
    Admin must approve via PATCH before it appears publicly.
    """
    t = Testimonial(**payload.model_dump(), is_approved=False)
    db.add(t)
    db.commit()
    db.refresh(t)
    return t


# ── Admin: approve / edit / feature ──────────────────────────────

@router.patch("/{testimonial_id}", response_model=TestimonialResponse)
def update_testimonial(
    testimonial_id: str,
    payload: TestimonialUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    t = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(t, field, value)
    db.commit()
    db.refresh(t)
    return t


@router.patch("/{testimonial_id}/approve", response_model=TestimonialResponse)
def approve_testimonial(
    testimonial_id: str,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    """Convenience endpoint — approve a pending testimonial."""
    t = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    t.is_approved = True
    db.commit()
    db.refresh(t)
    return t


@router.delete("/{testimonial_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_testimonial(
    testimonial_id: str,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    t = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    db.delete(t)
    db.commit()



@router.get("", response_model=list[TestimonialResponse])
def list_testimonials(
    db: Session = Depends(get_db),
    featured_only: bool = False,
):
    q = db.query(Testimonial).filter(Testimonial.is_approved == True)
    if featured_only:
        q = q.filter(Testimonial.is_featured == True)
    return q.order_by(Testimonial.is_featured.desc(), Testimonial.created_at.desc()).all()


@router.post("", response_model=TestimonialResponse, status_code=201)
def create_testimonial(payload: TestimonialCreate, db: Session = Depends(get_db)):
    # Public submission — requires admin approval before showing
    t = Testimonial(**payload.model_dump(), is_approved=False)
    db.add(t)
    db.commit()
    db.refresh(t)
    return t


@router.patch("/{testimonial_id}", response_model=TestimonialResponse)
def update_testimonial(
    testimonial_id: str,
    payload: TestimonialUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    t = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(t, field, value)
    db.commit()
    db.refresh(t)
    return t


@router.delete("/{testimonial_id}", status_code=204)
def delete_testimonial(
    testimonial_id: str,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    t = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    db.delete(t)
    db.commit()



# # C:\Users\Melody\Documents\haliberrycake\backend\app\api\testimonials.py
# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session

# from app.database.session import get_db
# from app.models.testimonial import Testimonial
# from app.schemas.testimonial import TestimonialCreate, TestimonialUpdate, TestimonialResponse
# from app.core.auth import get_current_admin

# router = APIRouter(prefix="/testimonials", tags=["Testimonials"])


# @router.get("", response_model=list[TestimonialResponse])
# def list_testimonials(
#     db: Session = Depends(get_db),
#     featured_only: bool = False,
# ):
#     q = db.query(Testimonial).filter(Testimonial.is_approved == True)
#     if featured_only:
#         q = q.filter(Testimonial.is_featured == True)
#     return q.order_by(Testimonial.is_featured.desc(), Testimonial.created_at.desc()).all()


# @router.post("", response_model=TestimonialResponse, status_code=201)
# def create_testimonial(payload: TestimonialCreate, db: Session = Depends(get_db)):
#     # Public submission — requires admin approval before showing
#     t = Testimonial(**payload.model_dump(), is_approved=False)
#     db.add(t)
#     db.commit()
#     db.refresh(t)
#     return t


# @router.patch("/{testimonial_id}", response_model=TestimonialResponse)
# def update_testimonial(
#     testimonial_id: str,
#     payload: TestimonialUpdate,
#     db: Session = Depends(get_db),
#     _: str = Depends(get_current_admin),
# ):
#     t = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
#     if not t:
#         raise HTTPException(status_code=404, detail="Testimonial not found")
#     for field, value in payload.model_dump(exclude_none=True).items():
#         setattr(t, field, value)
#     db.commit()
#     db.refresh(t)
#     return t


# @router.delete("/{testimonial_id}", status_code=204)
# def delete_testimonial(
#     testimonial_id: str,
#     db: Session = Depends(get_db),
#     _: str = Depends(get_current_admin),
# ):
#     t = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
#     if not t:
#         raise HTTPException(status_code=404, detail="Testimonial not found")
#     db.delete(t)
#     db.commit()