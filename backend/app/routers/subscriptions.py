from backend.app.contracts.subscriptions import Subscription, SubscriptionCreate
from backend.app.database import get_db
from backend.app.services.payment_service import payment_service
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/", response_model=list[Subscription])
def list_subscriptions(organization_id: int, db: Session = Depends(get_db)):
    return payment_service.list_subscriptions(db=db, organization_id=organization_id)


@router.post("/", response_model=Subscription, status_code=status.HTTP_201_CREATED)
def create_subscription(sub_in: SubscriptionCreate, db: Session = Depends(get_db)):
    return payment_service.create_subscription(db=db, sub_in=sub_in)

