from sqlalchemy import Column, Integer, String, JSON, DateTime, func
from proofhire.backend.app.database import Base
from proofhire.backend.app.models.base import TimestampMixin

class SearchIndex(Base, TimestampMixin):
    __tablename__ = "search_indices"

    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String(50), nullable=False, index=True) # job, candidate, organization
    entity_id = Column(Integer, nullable=False, index=True)
    
    content_vector = Column(JSON) # For semantic search
    searchable_text = Column(Text) # Combined text for full-text search
    metadata_fields = Column(JSON) # Boost factors, categories, etc.
    
    last_indexed_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<SearchIndex(entity={self.entity_type}, id={self.entity_id})>"
