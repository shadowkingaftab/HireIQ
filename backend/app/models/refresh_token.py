from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin


class RecruiterPreferences(Base, TimestampMixin):
    __tablename__ = "recruiter_preferences"

    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("recruiters.id", ondelete="CASCADE"), unique=True, nullable=False)
    preferences = Column(JSON, default=dict)
    search_aliases = Column(JSON, default=list)

    recruiter = relationship("Recruiter", back_populates="preferences")


class Recommendation(Base, TimestampMixin):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=True)
    score = Column(Integer, nullable=False)
    reason = Column(Text)

    candidate = relationship("Candidate")
    job = relationship("Job")


class Project(Base, TimestampMixin):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    url = Column(String(512))
    technologies = Column(JSON, default=list)

    candidate = relationship("Candidate")


class Portfolio(Base, TimestampMixin):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), unique=True, nullable=False)
    items = Column(JSON, default=list)
    is_public = Column(Boolean, default=False)

    candidate = relationship("Candidate", back_populates="portfolio")


class Permission(Base, TimestampMixin):
    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(String(255))

    roles = relationship("Role", secondary="role_permissions", back_populates="permissions")


class OrganizationMember(Base, TimestampMixin):
    __tablename__ = "organization_members"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(50), nullable=False)

    organization = relationship("Organization", back_populates="members")
    user = relationship("User")


class Notification(Base, TimestampMixin):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), nullable=False)
    is_read = Column(Boolean, default=False)

    user = relationship("User", back_populates="notifications")


class MatchResult(Base, TimestampMixin):
    __tablename__ = "match_results"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    score = Column(Integer, nullable=False)
    reasoning = Column(JSON)
    matched_skills = Column(JSON, default=list)
    missing_skills = Column(JSON, default=list)

    job = relationship("Job", back_populates="match_results")
    candidate = relationship("Candidate")


class MatchExplanation(Base, TimestampMixin):
    __tablename__ = "match_explanations"

    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey("match_results.id", ondelete="CASCADE"), nullable=False)
    summary = Column(Text)
    details = Column(JSON, default=dict)


class Invitation(Base, TimestampMixin):
    __tablename__ = "invitations"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    email = Column(String(255), nullable=False)
    token = Column(String(255), unique=True, nullable=False)
    status = Column(String(50), default="pending")

    organization = relationship("Organization", back_populates="invitations")


class Interview(Base, TimestampMixin):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    location = Column(String(255))
    status = Column(String(50), default="scheduled")
    interviewers = Column(JSON, default=list)

    application = relationship("Application", back_populates="interviews")


class InterviewQuestion(Base, TimestampMixin):
    __tablename__ = "interview_questions"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id", ondelete="CASCADE"), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text)
    rating = Column(Integer)


class IntegrationConnection(Base, TimestampMixin):
    __tablename__ = "integration_connections"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    provider = Column(String(100), nullable=False)
    config = Column(JSON, default=dict)
    is_active = Column(Boolean, default=True)

    organization = relationship("Organization", back_populates="integration_connections")


class FileAsset(Base, TimestampMixin):
    __tablename__ = "file_assets"

    id = Column(Integer, primary_key=True, index=True)
    path = Column(String(512), nullable=False)
    content_type = Column(String(100))
    size = Column(Integer)
    uploaded_by = Column(Integer, ForeignKey("users.id"))


class Feedback(Base, TimestampMixin):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    interviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text)

    application = relationship("Application", back_populates="feedbacks")


class ExternalAccount(Base, TimestampMixin):
    __tablename__ = "external_accounts"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    provider = Column(String(50), nullable=False)
    username = Column(String(255), nullable=False)
    access_token = Column(String(512))
    refresh_token = Column(String(512))
    metadata = Column(JSON, default=dict)

    candidate = relationship("Candidate", back_populates="external_accounts")


class EvidenceSource(Base, TimestampMixin):
    __tablename__ = "evidence_sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    base_url = Column(String(255))
    is_active = Column(Boolean, default=True)

    evidence = relationship("Evidence", back_populates="source")


class EvidenceSnapshot(Base, TimestampMixin):
    __tablename__ = "evidence_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(Integer, ForeignKey("evidence.id", ondelete="CASCADE"), nullable=False)
    snapshot_data = Column(JSON, nullable=False)
    captured_at = Column(DateTime(timezone=True), server_default=func.now())

    evidence = relationship("Evidence", back_populates="snapshots")


class EvidenceSkillLink(Base, TimestampMixin):
    __tablename__ = "evidence_skill_links"

    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(Integer, ForeignKey("evidence.id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(String(100), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    proficiency_score = Column(Integer)
    confidence_score = Column(Integer)

    evidence = relationship("Evidence", back_populates="skill_links")
    skill = relationship("Skill")


class Endorsement(Base, TimestampMixin):
    __tablename__ = "endorsements"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    endorser_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(String(100), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    comment = Column(Text)

    candidate = relationship("Candidate", back_populates="endorsements")
    skill = relationship("Skill")


class DataConsent(Base, TimestampMixin):
    __tablename__ = "data_consents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    purpose = Column(String(100), nullable=False)
    granted = Column(Boolean, default=False)
    consent_text = Column(Text)


class Contribution(Base, TimestampMixin):
    __tablename__ = "contributions"

    id = Column(Integer, primary_key=True, index=True)
    repository_id = Column(Integer, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50))
    external_id = Column(String(255))
    details = Column(JSON)

    repository = relationship("Repository", back_populates="contributions")
    candidate = relationship("Candidate")


class Certification(Base, TimestampMixin):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    issuer = Column(String(255))
    issued_at = Column(DateTime(timezone=True))
    expires_at = Column(DateTime(timezone=True))
    credential_url = Column(String(512))


class CodingSession(Base, TimestampMixin):
    __tablename__ = "coding_sessions"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    language = Column(String(50))
    code = Column(Text)
    result = Column(JSON)


class CapabilityScore(Base, TimestampMixin):
    __tablename__ = "capability_scores"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(String(100), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    score = Column(Integer, nullable=False)
    confidence = Column(Integer)
    source = Column(String(100))

    candidate = relationship("Candidate", back_populates="capability_scores")
    skill = relationship("Skill")


class CandidateNote(Base, TimestampMixin):
    __tablename__ = "candidate_notes"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=True)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    is_private = Column(Boolean, default=True)

    candidate = relationship("Candidate", back_populates="notes")
    application = relationship("Application", back_populates="notes")


class AuditLog(Base, TimestampMixin):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    actor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    resource_type = Column(String(100))
    resource_id = Column(String(100))
    metadata = Column(JSON, default=dict)

    actor = relationship("User", back_populates="audit_logs")


class ApiKey(Base, TimestampMixin):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    key_hash = Column(String(255), unique=True, nullable=False)
    last_used_at = Column(DateTime(timezone=True))


class ActivityLog(Base, TimestampMixin):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    action = Column(String(100), nullable=False)
    metadata = Column(JSON, default=dict)


class Achievement(Base, TimestampMixin):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    earned_at = Column(DateTime(timezone=True))
