# C:\Users\Melody\Documents\haliberrycake\backend\app\api\site_settings.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.site_setting import SiteSetting
from app.schemas.site_setting import SiteSettingResponse, SiteSettingUpdate
from app.core.auth import get_current_admin
from app.services.storage import upload_image

router = APIRouter(prefix="/site-settings", tags=["Site Settings"])

# All known setting keys — used to return a predictable dict to the frontend
SETTING_KEYS = [
    "hero_background",
    "founder_portrait",
    "about_image_1",
    "about_image_2",
]


@router.get("", response_model=list[SiteSettingResponse])
def get_site_settings(db: Session = Depends(get_db)):
    """Public endpoint — returns all site image settings."""
    return db.query(SiteSetting).order_by(SiteSetting.key).all()


@router.patch("/{key}", response_model=SiteSettingResponse)
def update_site_setting(
    key: str,
    payload: SiteSettingUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    """Admin only — update caption or image_url directly."""
    if key not in SETTING_KEYS:
        raise HTTPException(status_code=404, detail=f"Unknown setting key: {key}")
    setting = db.query(SiteSetting).filter(SiteSetting.key == key).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(setting, field, value)
    db.commit()
    db.refresh(setting)
    return setting


@router.post("/{key}/image", response_model=SiteSettingResponse)
async def upload_site_image(
    key: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    """Admin only — upload an image to Supabase Storage and save URL to site_settings."""
    if key not in SETTING_KEYS:
        raise HTTPException(status_code=404, detail=f"Unknown setting key: {key}")
    setting = db.query(SiteSetting).filter(SiteSetting.key == key).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")

    # Reuse the same upload_image service used by gallery and products
    url = await upload_image(file, folder="site-images")

    setting.image_url = url
    db.commit()
    db.refresh(setting)
    return setting