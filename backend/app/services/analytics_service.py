from typing import List, Dict, Any
from sqlalchemy.orm import Session
from proofhire.backend.app.contracts.analytics import AnalyticsSummary

class AnalyticsService:
    def summary(self, db: Session, *, organization_id: int) -> AnalyticsSummary:
        from sqlalchemy import func
        from proofhire.backend.app.models.application import Application
        from proofhire.backend.app.models.job import Job
        total_applications = db.query(func.count(Application.id)).scalar() or 0
        total_jobs = db.query(func.count(Job.id)).filter(Job.organization_id == organization_id).scalar() or 0
        return AnalyticsSummary(total_applications=total_applications, total_jobs=total_jobs, conversion_rate=0.0, time_to_hire_days=0.0)


analytics_service = AnalyticsService()
