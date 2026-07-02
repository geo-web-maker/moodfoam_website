import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from PIL import Image

from .. import models, security

router = APIRouter(prefix="/api/uploads", tags=["uploads"])

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_DIMENSION = 2000  # px, images are downscaled if larger


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    current_admin: models.AdminUser = Depends(security.get_current_admin),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400, detail="Only JPEG, PNG or WEBP images are allowed"
        )

    ext = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}[
        file.content_type
    ]
    filename = f"{uuid.uuid4().hex}{ext}"
    dest = UPLOAD_DIR / filename

    contents = await file.read()
    dest.write_bytes(contents)

    # Downscale oversized images to keep the site fast
    try:
        with Image.open(dest) as img:
            if img.width > MAX_DIMENSION or img.height > MAX_DIMENSION:
                img.thumbnail((MAX_DIMENSION, MAX_DIMENSION))
                img.save(dest)
    except Exception:
        # If Pillow can't process it, we still keep the original upload
        pass

    return {"filename": filename, "url": f"/uploads/{filename}"}


@router.delete("/image/{filename}")
def delete_image(
    filename: str,
    current_admin: models.AdminUser = Depends(security.get_current_admin),
):
    target = (UPLOAD_DIR / filename).resolve()
    if UPLOAD_DIR.resolve() not in target.parents:
        raise HTTPException(status_code=400, detail="Invalid filename")
    if target.exists():
        target.unlink()
    return {"ok": True}
