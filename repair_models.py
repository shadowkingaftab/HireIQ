from pathlib import Path
import re

models = Path("backend/app/models")

# -------------------------------------------------
# 1. Repair candidate_notes.py
# -------------------------------------------------
(models / "candidate_notes.py").write_text('''\
from sqlalchemy import Column, Integer, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from backend.app.database import Base
from backend.app.models.base import TimestampMixin


class CandidateNote(Base, TimestampMixin):
    __tablename__ = "candidate_notes"

    id = Column(Integer, primary_key=True, index=True)

    candidate_id = Column(
        Integer,
        ForeignKey("candidates.id", ondelete="CASCADE"),
        nullable=False,
    )

    application_id = Column(
        Integer,
        ForeignKey("applications.id", ondelete="CASCADE"),
        nullable=True,
    )

    author_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    content = Column(Text, nullable=False)

    is_private = Column(Boolean, default=True)

    candidate = relationship("Candidate", back_populates="notes")
    application = relationship("Application", back_populates="notes")
''', encoding="utf-8")


# -------------------------------------------------
# 2. Repair refresh_token.py
# Keep ONLY the RefreshToken model in this file.
# -------------------------------------------------
(models / "refresh_token.py").write_text('''\
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from backend.app.database import Base
from backend.app.models.base import TimestampMixin


class RefreshToken(Base, TimestampMixin):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    token = Column(String(512), unique=True, nullable=False)

    expires_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    user = relationship(
        "User",
        back_populates="refresh_tokens",
    )
''', encoding="utf-8")


# -------------------------------------------------
# 3. Remove duplicate Contribution from repository.py
# Contribution belongs only in contribution.py.
# -------------------------------------------------
repo = models / "repository.py"
text = repo.read_text(encoding="utf-8")

marker = re.search(
    r'\nclass Contribution\(Base, TimestampMixin\):.*',
    text,
    flags=re.S,
)

if marker:
    text = text[:marker.start()].rstrip() + "\n"

repo.write_text(text, encoding="utf-8")


# -------------------------------------------------
# 4. Remove accidental duplicate model definitions
#    inside any model file.
#    This does NOT touch __init__.py or base.py.
# -------------------------------------------------
expected_files = {
    "achievement.py": ["Achievement"],
    "activity_log.py": ["ActivityLog"],
    "api_key.py": ["APIKey"],
    "application.py": ["Application"],
    "assessment.py": ["Assessment"],
    "audit_log.py": ["AuditLog"],
    "candidate_notes.py": ["CandidateNote"],
    "candidate.py": ["Candidate"],
    "capability_score.py": ["CapabilityScore"],
    "certification.py": ["Certification"],
    "coding_session.py": ["CodingSession"],
    "contribution.py": ["Contribution"],
    "data_consent.py": ["DataConsent"],
    "endorsement.py": ["Endorsement"],
    "evidence_skill_link.py": ["EvidenceSkillLink"],
    "evidence_snapshot.py": ["EvidenceSnapshot"],
    "evidence_source.py": ["EvidenceSource"],
    "evidence.py": ["Evidence"],
    "external_account.py": ["ExternalAccount"],
    "feedback.py": ["Feedback"],
    "file_asset.py": ["FileAsset"],
    "integration_connection.py": ["IntegrationConnection"],
    "interview_question.py": ["InterviewQuestion"],
    "interview.py": ["Interview"],
    "invitation.py": ["Invitation"],
    "job.py": ["Job"],
    "match_explanation.py": ["MatchExplanation"],
    "match_result.py": ["MatchResult"],
    "notification.py": ["Notification"],
    "organization_member.py": ["OrganizationMember"],
    "organization.py": ["Organization"],
    "permission.py": ["Permission"],
    "portfolio.py": ["Portfolio"],
    "project.py": ["Project"],
    "recommendation.py": ["Recommendation"],
    "recruiter_preferences.py": ["RecruiterPreferences"],
    "recruiter.py": ["Recruiter"],
    "refresh_token.py": ["RefreshToken"],
    "report.py": ["Report"],
    "repository.py": ["Repository"],
    "role.py": ["Role"],
    "score_version.py": ["ScoreVersion"],
    "search_index.py": ["SearchIndex"],
    "skill_graph.py": ["SkillGraph"],
    "skill.py": ["Skill"],
    "subscription.py": ["Subscription"],
    "team.py": ["Team"],
    "user.py": ["User"],
    "webhook_event.py": ["WebhookEvent"],
}

print("MODEL FILE AUDIT")
print("-" * 60)

for filename, expected in expected_files.items():
    path = models / filename

    if not path.exists():
        print(f"MISSING FILE: {filename}")
        continue

    content = path.read_text(encoding="utf-8")

    found = re.findall(
        r'^class\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(',
        content,
        flags=re.M,
    )

    status = "OK"

    if found != expected:
        status = f"CHECK  expected={expected} found={found}"

    print(f"{filename:35} {status}")


# -------------------------------------------------
# 5. Detect duplicate SQLAlchemy table names BEFORE
#    importing the application.
# -------------------------------------------------
print()
print("DUPLICATE TABLE CHECK")
print("-" * 60)

tables = {}

for path in models.glob("*.py"):
    if path.name in ("__init__.py", "base.py"):
        continue

    content = path.read_text(encoding="utf-8")

    for match in re.finditer(
        r'__tablename__\s*=\s*["\']([^"\']+)["\']',
        content,
    ):
        table = match.group(1)
        tables.setdefault(table, []).append(path.name)

duplicates = {
    table: files
    for table, files in tables.items()
    if len(files) > 1
}

if duplicates:
    for table, files in duplicates.items():
        print(f"DUPLICATE TABLE: {table} -> {files}")
else:
    print("NO DUPLICATE TABLE NAMES FOUND")
