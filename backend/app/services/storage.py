# C:\Users\Melody\Documents\haliberrycake\backend\app\services\storage.py
"""
Image upload service using Supabase Storage.
Validates file type and size, then uploads to the appropriate bucket folder.
"""
import uuid
import mimetypes
from fastapi import UploadFile, HTTPException
from supabase import create_client

from app.core.config import settings

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_SIZE_MB = 8
BUCKET_NAME = "haliberry-assets"

_supabase = create_client(settings.supabase_url, settings.supabase_service_key)


async def upload_image(file: UploadFile, folder: str = "general") -> str:
    """Upload an image to Supabase Storage and return its public URL."""

    # Validate MIME type
    content_type = file.content_type or ""
    if content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{content_type}'. Allowed: JPEG, PNG, WebP, GIF",
        )

    # Read and validate size
    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_SIZE_MB:
        raise HTTPException(
            status_code=413,
            detail=f"File too large ({size_mb:.1f} MB). Max size is {MAX_SIZE_MB} MB",
        )

    # Build unique path
    ext = mimetypes.guess_extension(content_type) or ".jpg"
    unique_name = f"{folder}/{uuid.uuid4()}{ext}"

    # Upload
    _supabase.storage.from_(BUCKET_NAME).upload(
        path=unique_name,
        file=contents,
        file_options={"content-type": content_type},
    )

    # Return public URL
    public_url = _supabase.storage.from_(BUCKET_NAME).get_public_url(unique_name)
    return public_url