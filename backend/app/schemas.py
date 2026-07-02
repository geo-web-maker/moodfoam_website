from datetime import datetime
from pydantic import BaseModel, ConfigDict


# ---------- Category ----------

class CategoryBase(BaseModel):
    name: str
    slug: str
    description: str = ""
    sort_order: int = 0


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    sort_order: int | None = None


class CategoryOut(CategoryBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    product_count: int = 0


# ---------- Product ----------

class ProductBase(BaseModel):
    name: str
    slug: str
    category_id: int
    short_description: str = ""
    description: str = ""
    sizes: list[str] = []
    images: list[str] = []
    price: str | None = None
    is_featured: bool = False
    sort_order: int = 0


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    category_id: int | None = None
    short_description: str | None = None
    description: str | None = None
    sizes: list[str] | None = None
    images: list[str] | None = None
    price: str | None = None
    is_featured: bool | None = None
    sort_order: int | None = None


class ProductOut(ProductBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    updated_at: datetime
    category: CategoryOut | None = None


# ---------- Auth ----------

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    username: str
    password: str


# ---------- Contact ----------

class ContactMessageCreate(BaseModel):
    name: str
    phone: str = ""
    email: str = ""
    message: str


class ContactMessageOut(ContactMessageCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    is_read: bool
