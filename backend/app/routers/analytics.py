from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.services.analytics_service import analytics_service
from backend.app.contracts.analytics import AnalyticsSummary

router = APIRouter()


@router.get("/organizations/{organization_id}/summary", response_model=AnalyticsSummary)
def get_analytics_summary(organization_id: int, db: Session = Depends(get_db)):
    return analytics_service.summary(db=db, organization_id=organization_id)

