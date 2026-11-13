from backend.app.contracts.analytics import AnalyticsSummary
from sqlalchemy.orm import Session


class AnalyticsService:
    def summary(self, db: Session, *, organization_id: int) -> AnalyticsSummary:
        from backend.app.models.application import Application
        from backend.app.models.job import Job
        from sqlalchemy import func
        total_applications = db.query(func.count(Application.id)).scalar() or 0
        total_jobs = db.query(func.count(Job.id)).filter(Job.organization_id == organization_id).scalar() or 0
        return AnalyticsSummary(total_applications=total_applications, total_jobs=total_jobs, conversion_rate=0.0, time_to_hire_days=0.0)


analytics_service = AnalyticsService()

