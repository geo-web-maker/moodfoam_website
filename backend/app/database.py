from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings
from . import models

async def init_db():
    client = AsyncIOMotorClient(settings.mongodb_uri)
    await init_beanie(
        database=client[settings.mongodb_db_name],
        document_models=[models.Category, models.Product, models.AdminUser, models.ContactMessage],
    )
