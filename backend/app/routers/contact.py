from fastapi import APIRouter, Depends, HTTPException
from .. import models, schemas, security


router = APIRouter(prefix="/api/contact", tags=["contact"])

def _to_out(msg: models.ContactMessage) -> schemas.ContactMessageOut:
    return schemas.ContactMessageOut(
        id=str(msg.id), name=msg.name, phone=msg.phone, email=msg.email,
        message=msg.message, created_at=msg.created_at, is_read=msg.is_read,
    )

@router.post("", response_model=schemas.ContactMessageOut)
async def submit_message(payload: schemas.ContactMessageCreate):
    msg = models.ContactMessage(**payload.model_dump())
    await msg.insert()
    return _to_out(msg)


@router.get("", response_model=list[schemas.ContactMessageOut])
async def list_messages(
    current_admin: models.AdminUser = Depends(security.get_current_admin),
):
    messages = await models.ContactMessage.find_all().sort(
        -models.ContactMessage.created_at
    ).to_list()
    return [_to_out(m) for m in messages]


@router.put("/{message_id}/read", response_model=schemas.ContactMessageOut)
async def mark_read(
    message_id: str,
    current_admin: models.AdminUser = Depends(security.get_current_admin),
):
    msg = await models.ContactMessage.get(message_id)
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_read = True
    await msg.save()
    return _to_out(msg)


@router.delete("/{message_id}")
async def delete_message(
    message_id: str,
    current_admin: models.AdminUser = Depends(security.get_current_admin),
):
    msg = await models.ContactMessage.get(message_id)
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    await msg.delete()
    return {"ok": True}
