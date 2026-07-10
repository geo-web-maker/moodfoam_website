from fastapi import APIRouter, Depends, HTTPException


from .. import models, schemas, security


router = APIRouter(prefix="/api/categories", tags=["categories"])


async def _to_out(category: models.Category) -> schemas.CategoryOut:
    count = await models.Product.find(
        models.Product.category_id == str(category.id)
    ).count()
    return schemas.CategoryOut(
        id=str(category.id),
        name=category.name,
        slug=category.slug,
        description=category.description,
        sort_order=category.sort_order,
        product_count=count,
     )
    
@router.get("", response_model=list[schemas.CategoryOut])
async def list_categories():
    categories = await models.Category.find_all().sort(
        +models.Category.sort_order, +models.Category.name
    ).to_list()
    return [await _to_out(c) for c in categories]

@router.get("/{slug}", response_model=schemas.CategoryOut)
async def get_category(slug: str):
    category = await models.Category.find_one(models.Category.slug == slug)
    if not category:
         raise HTTPException(status_code=404, detail="Category not found")
    return await _to_out(category)
    
@router.post("", response_model=schemas.CategoryOut)
async def create_category(
    payload: schemas.CategoryCreate,
    current_admin: models.AdminUser = Depends(security.get_current_admin),
):
    if await models.Category.find_one(models.Category.slug == payload.slug):
        raise HTTPException(status_code=400, detail="Slug already in use")
    category = models.Category(**payload.model_dump())
    await category.insert()
    return await _to_out(category)


@router.put("/{category_id}", response_model=schemas.CategoryOut)
async def update_category(
    category_id: str,
    payload: schemas.CategoryUpdate,
    current_admin: models.AdminUser = Depends(security.get_current_admin),
):
    category = await models.Category.get(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(category, field, value)
    await category.save()
    return await _to_out(category)


@router.delete("/{category_id}")
async def delete_category(
    category_id: str,
    current_admin: models.AdminUser = Depends(security.get_current_admin),
):
    category = await models.Category.get(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    # Categories cascaded via SQL foreign keys before -- Mongo has no such
    # thing automatically, so products in this category are deleted explicitly.
    await models.Product.find(models.Product.category_id == str(category.id)).delete()
    await category.delete()
    return {"ok": True}
