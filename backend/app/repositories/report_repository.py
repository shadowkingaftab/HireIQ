from sqlalchemy.orm import Session
from backend.app.repositories.base_repository import BaseRepository
from backend.app.models.report import Report

class ReportRepository(BaseRepository[Report]):
    pass

report_repository = ReportRepository(Report)

