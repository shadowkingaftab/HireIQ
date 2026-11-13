from backend.app.database import Base
from backend.app.models.base import TimestampMixin
from sqlalchemy import Column, ForeignKey, Integer, String


class FileAsset(Base, TimestampMixin):
    __tablename__ = "file_assets"

    id = Column(Integer, primary_key=True, index=True)
    path = Column(String(512), nullable=False)
    content_type = Column(String(100))
    size = Column(Integer)
    uploaded_by = Column(Integer, ForeignKey("users.id"))

