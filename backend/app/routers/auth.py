from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas, security
from ..database import get_db

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=schemas.Token)
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.AdminUser).filter(
        models.AdminUser.username == payload.username
    ).first()
    if not user or not security.verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    token = security.create_access_token(subject=user.username)
    return schemas.Token(access_token=token)


@router.get("/me")
def me(current_admin: models.AdminUser = Depends(security.get_current_admin)):
    return {"username": current_admin.username}
