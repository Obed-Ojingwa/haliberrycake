# C:\Users\Melody\Documents\haliberrycake\backend\app\services\storage.py
"""
Image upload service.

- In PRODUCTION (APP_ENV=production): uploads to Supabase Storage, returns CDN URL.
- In DEVELOPMENT (APP_ENV=development): saves to local /tmp/haliberry-uploads/ folder
  and returns a local path string. This means you can run and test the API without
  a Supabase account configured yet.
"""
import os
import uuid
import mimetypes
from pathlib import Path
from fastapi import UploadFile, HTTPException

from app.core.config import settings

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_SIZE_MB   = 8
BUCKET_NAME   = "haliberry-assets"

# Local dev upload folder
LOCAL_UPLOAD_DIR = Path("/tmp/haliberry-uploads")


def _get_supabase():
    """
    Lazy-initialise the Supabase client — only when actually needed.
    This means the app starts cleanly even if Supabase keys are not yet set.
    """
    try:
        from supabase import create_client
        return create_client(settings.supabase_url, settings.supabase_service_key)
    except Exception as exc:
        raise RuntimeError(
            "Supabase client could not be initialised. "
            "Check SUPABASE_URL and SUPABASE_SERVICE_KEY in your .env file."
        ) from exc


async def upload_image(file: UploadFile, folder: str = "general") -> str:
    """
    Validate and upload an image. Returns the public URL (Supabase) or
    a local file path (dev mode).
    """
    # ── Validate MIME type ──────────────────────────────────────────
    content_type = file.content_type or ""
    if content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{content_type}'. Allowed: JPEG, PNG, WebP, GIF",
        )

    # ── Read file and check size ────────────────────────────────────
    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_SIZE_MB:
        raise HTTPException(
            status_code=413,
            detail=f"File too large ({size_mb:.1f} MB). Max allowed is {MAX_SIZE_MB} MB",
        )

    # ── Build unique filename ───────────────────────────────────────
    ext          = mimetypes.guess_extension(content_type) or ".jpg"
    unique_name  = f"{folder}/{uuid.uuid4()}{ext}"

    # ── Dev mode: save locally ─────────────────────────────────────
    if settings.app_env != "production":
        dest = LOCAL_UPLOAD_DIR / unique_name
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(contents)
        # Return a URL the frontend can use via the /static mount (see main.py)
        return f"/static/uploads/{unique_name}"

    # ── Production: upload to Supabase Storage ─────────────────────
    client = _get_supabase()
    client.storage.from_(BUCKET_NAME).upload(
        path=unique_name,
        file=contents,
        file_options={"content-type": content_type},
    )
    return client.storage.from_(BUCKET_NAME).get_public_url(unique_name)


# # C:\Users\Melody\Documents\haliberrycake\backend\app\services\storage.py
# """
# Image upload service using Supabase Storage.
# Validates file type and size, then uploads to the appropriate bucket folder.
# """
# import uuid
# import mimetypes
# from fastapi import UploadFile, HTTPException
# from supabase import create_client

# from app.core.config import settings

# ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
# MAX_SIZE_MB = 8
# BUCKET_NAME = "haliberry-assets"

# _supabase = create_client(settings.supabase_url, settings.supabase_service_key)


# async def upload_image(file: UploadFile, folder: str = "general") -> str:
#     """Upload an image to Supabase Storage and return its public URL."""

#     # Validate MIME type
#     content_type = file.content_type or ""
#     if content_type not in ALLOWED_TYPES:
#         raise HTTPException(
#             status_code=400,
#             detail=f"Invalid file type '{content_type}'. Allowed: JPEG, PNG, WebP, GIF",
#         )

#     # Read and validate size
#     contents = await file.read()
#     size_mb = len(contents) / (1024 * 1024)
#     if size_mb > MAX_SIZE_MB:
#         raise HTTPException(
#             status_code=413,
#             detail=f"File too large ({size_mb:.1f} MB). Max size is {MAX_SIZE_MB} MB",
#         )

#     # Build unique path
#     ext = mimetypes.guess_extension(content_type) or ".jpg"
#     unique_name = f"{folder}/{uuid.uuid4()}{ext}"

#     # Upload
#     _supabase.storage.from_(BUCKET_NAME).upload(
#         path=unique_name,
#         file=contents,
#         file_options={"content-type": content_type},
#     )

#     # Return public URL
#     public_url = _supabase.storage.from_(BUCKET_NAME).get_public_url(unique_name)
#     return public_url