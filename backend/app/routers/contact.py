from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas, security
from ..database import get_db

router = APIRouter(prefix="/api/contact", tags=["contact"])


@router.post("", response_model=schemas.ContactMessageOut)
def submit_message(payload: schemas.ContactMessageCreate, db: Session = Depends(get_db)):
    msg = models.ContactMessage(**payload.model_dump())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


@router.get("", response_model=list[schemas.ContactMessageOut])
def list_messages(
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(security.get_current_admin),
):
    return (
        db.query(models.ContactMessage)
        .order_by(models.ContactMessage.created_at.desc())
        .all()
    )


@router.put("/{message_id}/read", response_model=schemas.ContactMessageOut)
def mark_read(
    message_id: int,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(security.get_current_admin),
):
    msg = db.query(models.ContactMessage).get(message_id)
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_read = True
    db.commit()
    db.refresh(msg)
    return msg


@router.delete("/{message_id}")
def delete_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(security.get_current_admin),
):
    msg = db.query(models.ContactMessage).get(message_id)
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(msg)
    db.commit()
    return {"ok": True}
