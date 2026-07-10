from fastapi import APIRouter, Depends, HTTPException, Query
import re
from datetime import datetime

from .. import models, schemas, security


router = APIRouter(prefix="/api/products", tags=["products"])

async def _to_out(product: models.Product) -> schemas.ProductOut:
    category = await models.Category.get(product.category_id)
    category_out = None
    if category:
        count = await models.Product.find(
            models.Product.category_id == str(category.id)
        ).count()
        category_out = schemas.CategoryOut(
            id=str(category.id), name=category.name, slug=category.slug,
            description=category.description, sort_order=category.sort_order,
            product_count=count,
        )
    return schemas.ProductOut(
        id=str(product.id), name=product.name, slug=product.slug,
        category_id=product.category_id, short_description=product.short_description,
        description=product.description, sizes=product.sizes, images=product.images,
        price=product.price, is_featured=product.is_featured, sort_order=product.sort_order,
        created_at=product.created_at, updated_at=product.updated_at, category=category_out,
    )



@router.get("", response_model=list[schemas.ProductOut])
async def list_products(
    category: str | None = Query(None, description="Filter by category slug"),
    featured: bool | None = Query(None),
    search: str | None = Query(None),
):
    query = {}
    if category:
        cat = await models.Category.find_one(models.Category.slug == category)
        if not cat:
            return []
        query["category_id"] = str(cat.id)
        
    if featured is not None:
        query["is_featured"] = featured
        
    if search:
        query["name"] = {"$regex": re.escape(search), "$options": "i"}

    products = await models.Product.find(query).sort(
        +models.Product.sort_order, +models.Product.name
    ).to_list()
    return [await _to_out(p) for p in products]


@router.get("/{slug}", response_model=schemas.ProductOut)
async def get_product(slug: str):
    product = await models.Product.find_one(models.Product.slug == slug)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return await _to_out(product)


@router.post("", response_model=schemas.ProductOut)
async def create_product(
    payload: schemas.ProductCreate,
    current_admin: models.AdminUser = Depends(security.get_current_admin),
):
    if await models.Product.find_one(models.Product.slug == payload.slug):
        raise HTTPException(status_code=400, detail="Slug already in use")
    if not await models.Category.get(payload.category_id):
        raise HTTPException(status_code=400, detail="Category does not exist")
    product = models.Product(**payload.model_dump())
    await product.insert()
    return await _to_out(product)


@router.put("/{product_id}", response_model=schemas.ProductOut)
async def update_product(
    product_id: str,
    payload: schemas.ProductUpdate,
    current_admin: models.AdminUser = Depends(security.get_current_admin),
):
    product = await models.Product.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    product.updated_at = datetime.utcnow()
    await product.save()
    return await _to_out(product)


@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    current_admin: models.AdminUser = Depends(security.get_current_admin),
):
    product = await models.Product.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    await product.delete()
    return {"ok": True}
