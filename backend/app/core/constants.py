from enum import Enum


class UserRole(str, Enum):
    ADMIN = "admin"
    RECRUITER = "recruiter"
    CANDIDATE = "candidate"
    ORGANIZATION_ADMIN = "org_admin"


class JobStatus(str, Enum):
    DRAFT = "draft"
    OPEN = "open"
    CLOSED = "closed"
    CANCELLED = "cancelled"


class ApplicationStatus(str, Enum):
    APPLIED = "applied"
    REVIEWING = "reviewing"
    INTERVIEWING = "interviewing"
    OFFERED = "offered"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"


class EvidenceType(str, Enum):
    GITHUB_REPO = "github_repo"
    GITHUB_COMMIT = "github_commit"
    ASSESSMENT_RESULT = "assessment_result"
    CERTIFICATION = "certification"
    RESUME = "resume"
    LINKEDIN = "linkedin"


class VerificationStatus(str, Enum):
    UNVERIFIED = "unverified"
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"


MAX_PAGE_SIZE = 100
DEFAULT_PAGE_SIZE = 20
