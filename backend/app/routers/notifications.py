from backend.app.contracts.notifications import Notification
from backend.app.database import get_db
from backend.app.dependencies.auth import get_current_active_user
from backend.app.models.user import User
from backend.app.services.notification_service import notification_service
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/", response_model=list[Notification])
def list_notifications(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)
):
    return notification_service.list_for_user(db=db, user_id=int(current_user.id))


@router.patch("/{notification_id}/read", response_model=Notification)
def mark_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    notification = notification_service.mark_read(
        db=db, notification_id=notification_id, user_id=int(current_user.id)
    )
    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    return notification

