from backend.app.database import Base
from backend.app.models.base import TimestampMixin
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship


class Permission(Base, TimestampMixin):
    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False) # e.g., "job:create", "user:edit"
    description = Column(String(255))
    
    # Relationships
    roles = relationship("Role", secondary="role_permissions", back_populates="permissions")

    def __repr__(self):
        return f"<Permission(name={self.name})>"

