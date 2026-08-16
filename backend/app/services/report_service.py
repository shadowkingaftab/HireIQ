from typing import List, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.contracts.reports import ReportCreate
from proofhire.backend.app.models.report import Report
from proofhire.backend.app.storage.file_service import file_service
from proofhire.backend.app.templates.reports import render_template

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
