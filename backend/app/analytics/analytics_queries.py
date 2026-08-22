from typing import Any, Dict, List

from proofhire.backend.app.analytics.candidate_analytics import CandidateAnalytics
from proofhire.backend.app.analytics.recruiter_analytics import RecruiterAnalytics
from proofhire.backend.app.analytics.organization_analytics import OrganizationAnalytics
from proofhire.backend.app.analytics.funnel_analytics import FunnelAnalytics
from proofhire.backend.app.analytics.hiring_velocity import HiringVelocity
from proofhire.backend.app.analytics.sourcing_analytics import SourcingAnalytics
from proofhire.backend.app.analytics.model_analytics import ModelAnalytics
from proofhire.backend.app.analytics.evidence_analytics import EvidenceAnalytics
from proofhire.backend.app.analytics.assessment_analytics import AssessmentAnalytics


class AnalyticsQueries:
    def __init__(
        self,
        candidate_analytics: Optional[CandidateAnalytics] = None,
        recruiter_analytics: Optional[RecruiterAnalytics] = None,
        organization_analytics: Optional[OrganizationAnalytics] = None,
        funnel_analytics: Optional[FunnelAnalytics] = None,
        hiring_velocity: Optional[HiringVelocity] = None,
        sourcing_analytics: Optional[SourcingAnalytics] = None,
        model_analytics: Optional[ModelAnalytics] = None,
        evidence_analytics: Optional[EvidenceAnalytics] = None,
        assessment_analytics: Optional[AssessmentAnalytics] = None,
    ):
        self.candidate = candidate_analytics or CandidateAnalytics(db=None, search_index=None)
        self.recruiter = recruiter_analytics or RecruiterAnalytics(db=None)
        self.organization = organization_analytics or OrganizationAnalytics(db=None)
        self.funnel = funnel_analytics or FunnelAnalytics(db=None)
        self.velocity = hiring_velocity or HiringVelocity(db=None)
        self.sourcing = sourcing_analytics or SourcingAnalytics(db=None)
        self.model = model_analytics or ModelAnalytics(db=None)
        self.evidence = evidence_analytics or EvidenceAnalytics(db=None)
        self.assessment = assessment_analytics or AssessmentAnalytics(db=None)
