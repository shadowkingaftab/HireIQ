from backend.app.repositories.user_repository import UserRepository
from backend.app.repositories.candidate_repository import CandidateRepository
from backend.app.repositories.job_repository import JobRepository
from backend.app.repositories.matching_repository import MatchResultRepository
from backend.app.repositories.evidence_repository import EvidenceRepository
from backend.app.repositories.assessment_repository import AssessmentRepository

__all__ = [
    "UserRepository",
    "CandidateRepository",
    "JobRepository",
    "MatchResultRepository",
    "EvidenceRepository",
    "AssessmentRepository",
]
