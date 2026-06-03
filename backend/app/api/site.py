# C:\Users\Melody\Documents\haliberrycake\backend\app\api\site.py
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import Optional

from app.database.session import get_db
from app.models.site import SiteSetting
from app.schemas.site import SiteSettingCreate, SiteSettingUpdate, SiteSettingResponse
from app.core.auth import get_current_admin
from app.services.storage import upload_image

router = APIRouter(prefix="/site-settings", tags=["Site Settings"])


# ── Public endpoints (no auth required) ───────────────────────────────────
@router.get("", response_model=list[SiteSettingResponse])
def list_site_settings(
    db: Session = Depends(get_db),
):
    settings = db.query(SiteSetting).order_by(SiteSetting.key).all()
    return settings


@router.get("/{setting_id}", response_model=SiteSettingResponse)
def get_site_setting(
    setting_id: str,
    db: Session = Depends(get_db),
):
    setting = db.query(SiteSetting).filter(SiteSetting.id == setting_id).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Site setting not found")
    return setting


# ── Admin endpoints (auth required) ───────────────────────────────────────

@router.post("", response_model=SiteSettingResponse, status_code=status.HTTP_201_CREATED)
def create_site_setting(
    payload: SiteSettingCreate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    # Check if key already exists
    existing = db.query(SiteSetting).filter(SiteSetting.key == payload.key).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Site setting with key '{payload.key}' already exists",
        )
    setting = SiteSetting(**payload.model_dump())
    db.add(setting)
    db.commit()
    db.refresh(setting)
    return setting


@router.patch("/{setting_id}", response_model=SiteSettingResponse)
def update_site_setting(
    setting_id: str,
    payload: SiteSettingUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    setting = db.query(SiteSetting).filter(SiteSetting.id == setting_id).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Site setting not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(setting, field, value)

    db.commit()
    db.refresh(setting)
    return setting


@router.delete("/{setting_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_site_setting(
    setting_id: str,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    setting = db.query(SiteSetting).filter(SiteSetting.id == setting_id).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Site setting not found")
    db.delete(setting)
    db.commit()


@router.post("/{setting_id}/image", response_model=SiteSettingResponse)
async def upload_site_setting_image(
    setting_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    setting = db.query(SiteSetting).filter(SiteSetting.id == setting_id).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Site setting not found")

    url = await upload_image(file, folder="site-images")
    setting.image_url = url
    db.commit()
    db.refresh(setting)
    return setting