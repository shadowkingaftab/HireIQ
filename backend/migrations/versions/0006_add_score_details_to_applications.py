"""add score_details to applications

Revision ID: 0006
Revises: 0005
Create Date: 2026-08-23 01:32:00.000000

"""
import sqlalchemy as sa
from alembic import op

revision = "0006"
down_revision = "0005"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('applications', sa.Column('score_details', sa.JSON(), server_default='{}', nullable=True))


def downgrade() -> None:
    op.drop_column('applications', 'score_details')
