from fastapi import APIRouter, Depends, HTTPException, Request, status
from slowapi import Limiter
from slowapi.util import get_remote_address


from .. import models, schemas, security


router = APIRouter(prefix="/api/auth", tags=["auth"])

# Precomputed so a nonexistent username still costs a real bcrypt verify —
# otherwise response time reveals whether the username exists.
_DUMMY_HASH = security.hash_password("not-a-real-password-just-for-timing")
limiter = Limiter(key_func=get_remote_address)

@router.post("/login", response_model=schemas.Token)
@limiter.limit("5/minute")
async def login(request: Request, payload: schemas.LoginRequest):
    user = await models.AdminUser.find_one(
        models.AdminUser.username == payload.username
    )
    hashed = user.hashed_password if user else _DUMMY_HASH
    password_ok = security.verify_password(payload.password, hashed)
    if not user or not password_ok:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    token = security.create_access_token(subject=user.username)
    return schemas.Token(access_token=token)


@router.get("/me")
async def me(current_admin: models.AdminUser = Depends(security.get_current_admin)):
    return {"username": current_admin.username}
