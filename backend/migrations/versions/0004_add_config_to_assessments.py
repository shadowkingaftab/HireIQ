"""add config to assessments

Revision ID: 0004
Revises: 0003
Create Date: 2026-08-23 01:30:00.000000

"""
import sqlalchemy as sa
from alembic import op

revision = "0004"
down_revision = "0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('assessments', sa.Column('config', sa.JSON(), server_default='{}', nullable=True))


def downgrade() -> None:
    op.drop_column('assessments', 'config')
