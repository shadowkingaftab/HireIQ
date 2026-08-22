from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class Notification(Base, TimestampMixin):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50)) # system, job_match, interview_scheduled
    
    is_read = Column(Boolean, default=False)
    action_url = Column(String(512))
    payload = Column(JSON)
    
    # Relationships
    user = relationship("User", back_populates="notifications")

    def __repr__(self):
        return f"<Notification(user_id={self.user_id}, title={self.title})>"

class WebhookEvent(Base, TimestampMixin):
    __tablename__ = "webhook_events"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    
    event_type = Column(String(100), nullable=False)
    payload = Column(JSON, nullable=False)
    status = Column(String(20), default="pending") # pending, delivered, failed
    delivery_attempts = Column(Integer, default=0)
    last_attempt_at = Column(DateTime(timezone=True))
    
    target_url = Column(String(512), nullable=False)

class AuditLog(Base, TimestampMixin):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    actor_id = Column(Integer, ForeignKey("users.id"))
    
    action = Column(String(100), nullable=False) # create, update, delete
    resource_type = Column(String(100), nullable=False) # job, user, application
    resource_id = Column(String(100))
    
    old_values = Column(JSON)
    new_values = Column(JSON)
    ip_address = Column(String(45))
    
    # Relationships
    actor = relationship("User", back_populates="audit_logs")

class ActivityLog(Base, TimestampMixin):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    activity_type = Column(String(100)) # login, view_job, apply
    description = Column(Text)
    metadata_fields = Column(JSON)

class ApiKey(Base, TimestampMixin):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    
    key_hint = Column(String(10), nullable=False) # First 4 chars
    hashed_key = Column(String(255), unique=True, nullable=False)
    name = Column(String(255))
    
    is_active = Column(Boolean, default=True)
    last_used_at = Column(DateTime(timezone=True))

class RefreshToken(Base, TimestampMixin):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String(512), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    revoked = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("User", back_populates="refresh_tokens")

class FileAsset(Base, TimestampMixin):
    __tablename__ = "file_assets"

    id = Column(Integer, primary_key=True, index=True)
    uploader_id = Column(Integer, ForeignKey("users.id"))
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)
    mime_type = Column(String(100))
    file_size = Column(Integer) # in bytes
    
    is_public = Column(Boolean, default=False)

class DataConsent(Base, TimestampMixin):
    __tablename__ = "data_consents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    consent_type = Column(String(100), nullable=False) # gdpr, marketing, third_party_sharing
    is_granted = Column(Boolean, default=False)
    ip_address = Column(String(45))
    user_agent = Column(Text)
