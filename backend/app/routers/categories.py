from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from .. import models, schemas, security
from ..database import get_db

router = APIRouter(prefix="/api/categories", tags=["categories"])


@router.get("", response_model=list[schemas.CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    rows = (
        db.query(models.Category, func.count(models.Product.id))
        .outerjoin(models.Product)
        .group_by(models.Category.id)
        .order_by(models.Category.sort_order, models.Category.name)
        .all()
    )
    result = []
    for cat, count in rows:
        out = schemas.CategoryOut.model_validate(cat)
        out.product_count = count
        result.append(out)
    return result


@router.get("/{slug}", response_model=schemas.CategoryOut)
def get_category(slug: str, db: Session = Depends(get_db)):
    cat = db.query(models.Category).filter(models.Category.slug == slug).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    out = schemas.CategoryOut.model_validate(cat)
    out.product_count = len(cat.products)
    return out


@router.post("", response_model=schemas.CategoryOut)
def create_category(
    payload: schemas.CategoryCreate,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(security.get_current_admin),
):
    if db.query(models.Category).filter(models.Category.slug == payload.slug).first():
        raise HTTPException(status_code=400, detail="Slug already in use")
    cat = models.Category(**payload.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    out = schemas.CategoryOut.model_validate(cat)
    out.product_count = 0
    return out


@router.put("/{category_id}", response_model=schemas.CategoryOut)
def update_category(
    category_id: int,
    payload: schemas.CategoryUpdate,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(security.get_current_admin),
):
    cat = db.query(models.Category).get(category_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(cat, field, value)
    db.commit()
    db.refresh(cat)
    out = schemas.CategoryOut.model_validate(cat)
    out.product_count = len(cat.products)
    return out


@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(security.get_current_admin),
):
    cat = db.query(models.Category).get(category_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(cat)
    db.commit()
    return {"ok": True}
