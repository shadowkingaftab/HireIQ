from backend.app.contracts.reports import Report, ReportCreate
from backend.app.database import get_db
from backend.app.services.report_service import report_service
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/", response_model=list[Report])
def list_reports(organization_id: int, db: Session = Depends(get_db)):
    return report_service.list_by_organization(db=db, organization_id=organization_id)


@router.post("/", response_model=Report, status_code=status.HTTP_201_CREATED)
def create_report(report_in: ReportCreate, db: Session = Depends(get_db)):
    return report_service.create(db=db, report_in=report_in)

