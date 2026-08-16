from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from proofhire.backend.app.database import get_db
from proofhire.backend.app.services.analytics_service import analytics_service
from proofhire.backend.app.contracts.analytics import AnalyticsSummary

router = APIRouter()


@router.get("/organizations/{organization_id}/summary", response_model=AnalyticsSummary)
def get_analytics_summary(organization_id: int, db: Session = Depends(get_db)):
    return analytics_service.summary(db=db, organization_id=organization_id)
