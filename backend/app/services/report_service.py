from typing import List, Optional

from backend.app.contracts.reports import ReportCreate
from backend.app.models.report import Report
from backend.app.templates.reports import render_template
from sqlalchemy.orm import Session


class ReportService:
    def list_by_organization(self, db: Session, *, organization_id: int) -> List[Report]:
        return db.query(Report).filter(Report.organization_id == organization_id).all()

    def create(self, db: Session, *, report_in: ReportCreate) -> Report:
        db_obj = Report(**report_in.dict())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def generate(self, *, report_id: int) -> Optional[Report]:
        return None

    def render(self, *, report_type: str, context: dict) -> str:
        return render_template(f"{report_type}.html", context)


report_service = ReportService()

