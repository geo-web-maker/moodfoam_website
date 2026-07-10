"""
R2 image upload/delete router.
Drop this file in as e.g. app/routers/images.py, then in main.py:
    from .routers import images
    app.include_router(images.router, prefix="/api/images", tags=["images"])
"""
import uuid
import io
import logging
import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from PIL import Image
from ..config import settings
from ..security import get_current_admin

logger = logging.getLogger(__name__)
router = APIRouter()

# --- Config / constants -----------------------------------------------
ALLOWED_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}
MAX_UPLOAD_BYTES = 8 * 1024 * 1024  # 8 MB, adjust to taste
MAX_DIMENSION = 1600  # longest side, in pixels, after downscaling

# --- R2 client -----------------------------------------------------------
# R2 is S3-compatible, so we just point boto3's S3 client at Cloudflare's
# endpoint instead of Amazon's, using R2 keys instead of AWS keys.
#
# Built lazily (on first upload) rather than at import time -- if this ran
# at module load and R2_ACCOUNT_ID was ever blank/misconfigured, the entire
# API would fail to start, not just image uploads.

_r2_client = None


def get_r2_client():
    global _r2_client
    if _r2_client is None:
        _r2_client = boto3.client(
            "s3",
            endpoint_url=f"https://{settings.r2_account_id}.r2.cloudflarestorage.com",
            aws_access_key_id=settings.r2_access_key_id,
            aws_secret_access_key=settings.r2_secret_access_key,
            config=Config(signature_version="s3v4"),
        )
    return _r2_client


def _downscale(contents: bytes, content_type: str) -> bytes:
    """Resize so the longest side is at most MAX_DIMENSION, re-encode to
    trim file size. Falls back to original bytes if Pillow can't process it."""
    try:
        img = Image.open(io.BytesIO(contents))
        img.thumbnail((MAX_DIMENSION, MAX_DIMENSION))
        buf = io.BytesIO()
        fmt = {"image/jpeg": "JPEG", "image/png": "PNG", "image/webp": "WEBP"}[content_type]
        save_kwargs = {"quality": 85} if fmt in ("JPEG", "WEBP") else {}
        img.save(buf, format=fmt, **save_kwargs)
        return buf.getvalue()
    except Exception:
        logger.warning("Pillow downscale failed, uploading original bytes", exc_info=True)
        return contents


# --- Routes ----------------------------------------------------------------
@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    current_admin=Depends(get_current_admin),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{file.content_type}'. Allowed: jpeg, png, webp.",
        )
    contents = await file.read()
    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"File too large ({len(contents) // 1024} KB). Max is {MAX_UPLOAD_BYTES // 1024} KB.",
        )
    contents = _downscale(contents, file.content_type)
    ext = ALLOWED_TYPES[file.content_type]
    filename = f"{uuid.uuid4().hex}{ext}"
    try:
        get_r2_client().put_object(
            Bucket=settings.r2_bucket_name,
            Key=filename,
            Body=contents,
            ContentType=file.content_type,
        )
    except ClientError:
        logger.error("R2 upload failed", exc_info=True)
        raise HTTPException(status_code=502, detail="Image upload to storage failed. Please try again.")
    url = f"{settings.r2_public_url}/{filename}"
    return {"filename": filename, "url": url}


@router.delete("/image/{filename}")
async def delete_image(
    filename: str,
    current_admin=Depends(get_current_admin),
):
    # Basic guard: only allow deleting keys that look like ones we generated.
    if "/" in filename or ".." in filename:
        raise HTTPException(status_code=400, detail="Invalid filename.")
    try:
        get_r2_client().delete_object(Bucket=settings.r2_bucket_name, Key=filename)
    except ClientError:
        logger.error("R2 delete failed for key=%s", filename, exc_info=True)
        raise HTTPException(status_code=502, detail="Image delete from storage failed. Please try again.")
    return {"deleted": filename}
