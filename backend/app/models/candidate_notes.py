from backend.app.database import Base
from backend.app.models.base import TimestampMixin
from sqlalchemy import Boolean, Column, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship


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
