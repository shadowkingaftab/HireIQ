from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.contracts.notifications import Notification
from backend.app.services.notification_service import notification_service

router = APIRouter()


@router.get("/", response_model=list[Notification])
def list_notifications(user_id: int, db: Session = Depends(get_db)):
    return notification_service.list_for_user(db=db, user_id=user_id)


@router.patch("/{notification_id}/read", response_model=Notification)
def mark_read(notification_id: int, db: Session = Depends(get_db)):
    notification = notification_service.mark_read(db=db, notification_id=notification_id)
    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    return notification

