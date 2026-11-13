from backend.app.models.report import Report
from backend.app.repositories.base_repository import BaseRepository


class ReportRepository(BaseRepository[Report]):
    pass

report_repository = ReportRepository(Report)

