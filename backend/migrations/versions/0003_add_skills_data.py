"""add skills_data to candidates

Revision ID: 0003
Revises: 0002
Create Date: 2026-08-23 01:15:00.000000

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "0003"
down_revision = "0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('candidates', sa.Column('skills_data', sa.JSON(), server_default='{}', nullable=True))


def downgrade() -> None:
    op.drop_column('candidates', 'skills_data')
