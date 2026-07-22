from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from . import models
from .config import settings
from .database import init_db
from .routers import auth, categories, products, uploads, contact
from .security import hash_password


app = FastAPI(
    title="Mood Foam Mattresses API",
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
    openapi_url="/openapi.json" if settings.debug else None,
)

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(products.router)
app.include_router(uploads.router, prefix="/api/uploads", tags=["uploads"])
app.include_router(contact.router)


@app.on_event("startup")
async def on_startup():
    await init_db()
    existing = await models.AdminUser.find_one(
        models.AdminUser.username == settings.admin_username
    )
    if not existing:
        await models.AdminUser(
            username=settings.admin_username,
            hashed_password=hash_password(settings.admin_password),
        ).insert()

@app.get("/api/config")
def public_config():
    """Non-secret config the frontend needs (WhatsApp number etc.)."""
    return {"whatsapp_number": settings.whatsapp_number}


@app.get("/api/health")
def health():
    return {"status": "ok"}
