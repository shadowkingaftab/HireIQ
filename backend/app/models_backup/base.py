from datetime import datetime
from sqlalchemy import Column, DateTime, func
from sqlalchemy.ext.declarative import declared_attr

class TimestampMixin:
    @declared_attr
    def created_at(cls):
        return Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    @declared_attr
    def updated_at(cls):
        return Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

class AuditMixin:
    @declared_attr
    def created_by(cls):
        return Column(DateTime(timezone=True), nullable=True) # Usually an ID, but keeping it simple for now

    @declared_attr
    def updated_by(cls):
        return Column(DateTime(timezone=True), nullable=True)
