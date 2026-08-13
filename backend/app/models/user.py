from sqlalchemy import Boolean, Column, Integer, String, Enum, Table, ForeignKey
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin
from proofhire.backend.app.core.constants import UserRole

# Association table for User-Role (Many-to-Many)
user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("role_id", Integer, ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True),
)

class User(Base, TimestampMixin):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), index=True)
    is_active = Column(Boolean(), default=True)
    is_superuser = Column(Boolean(), default=False)
    
    # Relationships
    roles = relationship("Role", secondary=user_roles, back_populates="users")
    candidate_profile = relationship("Candidate", back_populates="user", uselist=False)
    recruiter_profile = relationship("Recruiter", back_populates="user", uselist=False)
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="actor")

    def __repr__(self):
        return f"<User(email={self.email}, full_name={self.full_name})>"
