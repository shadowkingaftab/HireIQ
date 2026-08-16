from sqlalchemy import Column, Integer, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class FileAsset(Base, TimestampMixin):
    __tablename__ = "file_assets"

    id = Column(Integer, primary_key=True, index=True)
    path = Column(String(512), nullable=False)
    content_type = Column(String(100))
    size = Column(Integer)
    uploaded_by = Column(Integer, ForeignKey("users.id"))
