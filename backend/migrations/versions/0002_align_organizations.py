"""align organizations with current model

Revision ID: 0002
Revises: 0001
Create Date: 2026-08-22 01:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "organizations",
        sa.Column("slug", sa.String(100), nullable=False),
    )
    op.add_column(
        "organizations",
        sa.Column(
            "is_active",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("true"),
        ),
    )

    op.create_index(
        "ix_organizations_slug",
        "organizations",
        ["slug"],
        unique=True,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_organizations_slug",
        table_name="organizations",
    )
    op.drop_column("organizations", "is_active")
    op.drop_column("organizations", "slug")
