"""add matching_score to applications

Revision ID: 0005
Revises: 0004
Create Date: 2026-08-23 01:31:00.000000

"""
import sqlalchemy as sa
from alembic import op

revision = "0005"
down_revision = "0004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('applications', sa.Column('matching_score', sa.Float(), nullable=True))


def downgrade() -> None:
    op.drop_column('applications', 'matching_score')
