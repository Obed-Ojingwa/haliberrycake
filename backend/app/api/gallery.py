# C:\Users\Melody\Documents\haliberrycake\backend\app\api\gallery.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database.session import get_db
from app.models.gallery import GalleryImage
from app.schemas.gallery import GalleryImageCreate, GalleryImageUpdate, GalleryImageResponse
from app.core.auth import get_current_admin
from app.services.storage import upload_image

router = APIRouter(prefix="/gallery", tags=["Gallery"])


@router.get("", response_model=list[GalleryImageResponse])
def list_gallery(
    db: Session = Depends(get_db),
    category: Optional[str] = Query(None),
    featured_only: bool = False,
):
    q = db.query(GalleryImage)
    if category:
        q = q.filter(GalleryImage.category == category)
    if featured_only:
        q = q.filter(GalleryImage.is_featured == True)
    return q.order_by(GalleryImage.sort_order.asc(), GalleryImage.created_at.desc()).all()


@router.post("/upload", response_model=GalleryImageResponse, status_code=201)
async def upload_gallery_image(
    file: UploadFile = File(...),
    category: str = "general",
    caption: Optional[str] = None,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    url = await upload_image(file, folder="gallery")
    img = GalleryImage(image_url=url, category=category, caption=caption)
    db.add(img)
    db.commit()
    db.refresh(img)
    return img


@router.patch("/{image_id}", response_model=GalleryImageResponse)
def update_gallery_image(
    image_id: str,
    payload: GalleryImageUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    img = db.query(GalleryImage).filter(GalleryImage.id == image_id).first()
    if not img:
        raise HTTPException(status_code=404, detail="Image not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(img, field, value)
    db.commit()
    db.refresh(img)
    return img


@router.delete("/{image_id}", status_code=204)
def delete_gallery_image(
    image_id: str,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    img = db.query(GalleryImage).filter(GalleryImage.id == image_id).first()
    if not img:
        raise HTTPException(status_code=404, detail="Image not found")
    db.delete(img)
    db.commit()