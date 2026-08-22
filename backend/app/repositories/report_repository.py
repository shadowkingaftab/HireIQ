from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.report import Report

class ReportRepository(BaseRepository[Report]):
    pass

report_repository = ReportRepository(Report)
