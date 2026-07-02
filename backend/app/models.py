from beanie import Document, Indexed
from pydantic import Field
from datetime import datetime
from typing import Optional

class Category(Document):
    name: str
    slug: Indexed(str, unique=True)
    description: str = ""
    sort_order: int = 0

    class Settings:
        name = "categories"

class Product(Document):
    name: str
    slug: Indexed(str, unique=True)
    category_id: str          # store Category's str(id)
    short_description: str = ""
    description: str = ""
    sizes: list[str] = []
    images: list[str] = []    # now full R2 URLs, not filenames
    price: Optional[str] = None
    is_featured: bool = False
    sort_order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "products"

class AdminUser(Document):
    username: Indexed(str, unique=True)
    hashed_password: str

    class Settings:
        name = "admin_users"

class ContactMessage(Document):
    name: str
    phone: str = ""
    email: str = ""
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_read: bool = False

    class Settings:
        name = "contact_messages"
