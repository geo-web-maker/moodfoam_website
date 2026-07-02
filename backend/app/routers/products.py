from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from .. import models, schemas, security
from ..database import get_db

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=list[schemas.ProductOut])
def list_products(
    category: str | None = Query(None, description="Filter by category slug"),
    featured: bool | None = Query(None),
    search: str | None = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(models.Product)
    if category:
        q = q.join(models.Category).filter(models.Category.slug == category)
    if featured is not None:
        q = q.filter(models.Product.is_featured == featured)
    if search:
        like = f"%{search}%"
        q = q.filter(models.Product.name.ilike(like))
    q = q.order_by(models.Product.sort_order, models.Product.name)
    return q.all()


@router.get("/{slug}", response_model=schemas.ProductOut)
def get_product(slug: str, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.slug == slug).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("", response_model=schemas.ProductOut)
def create_product(
    payload: schemas.ProductCreate,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(security.get_current_admin),
):
    if db.query(models.Product).filter(models.Product.slug == payload.slug).first():
        raise HTTPException(status_code=400, detail="Slug already in use")
    if not db.query(models.Category).get(payload.category_id):
        raise HTTPException(status_code=400, detail="Category does not exist")
    product = models.Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=schemas.ProductOut)
def update_product(
    product_id: int,
    payload: schemas.ProductUpdate,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(security.get_current_admin),
):
    product = db.query(models.Product).get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(security.get_current_admin),
):
    product = db.query(models.Product).get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"ok": True}
