from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from . import models
from .config import settings
from .database import engine, SessionLocal
from .routers import auth, categories, products, uploads, contact
from .security import hash_password

models.Base.metadata.create_all(bind=engine)

UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

app = FastAPI(title="Mood Foam Mattresses API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(products.router)
app.include_router(uploads.router)
app.include_router(contact.router)


@app.on_event("startup")
def ensure_admin_user():
    db = SessionLocal()
    try:
        existing = (
            db.query(models.AdminUser)
            .filter(models.AdminUser.username == settings.admin_username)
            .first()
        )
        if not existing:
            db.add(
                models.AdminUser(
                    username=settings.admin_username,
                    hashed_password=hash_password(settings.admin_password),
                )
            )
            db.commit()
    finally:
        db.close()


@app.get("/api/config")
def public_config():
    """Non-secret config the frontend needs (WhatsApp number etc.)."""
    return {"whatsapp_number": settings.whatsapp_number}


@app.get("/api/health")
def health():
    return {"status": "ok"}
