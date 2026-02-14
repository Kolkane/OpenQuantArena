"""Seed single active arena (V1)

Revision ID: 0003_seed_single_arena_v1
Revises: 0002_predictive_arena_v1
Create Date: 2026-02-14
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from uuid import uuid4

from alembic import op
import sqlalchemy as sa

revision = "0003_seed_single_arena_v1"
down_revision = "0002_predictive_arena_v1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    now = datetime.now(timezone.utc)
    start_at = now
    end_at = now + timedelta(days=7)
    slug = f"polymarket-7d-{now.strftime('%Y%m%d')}"

    # Use explicit casts to keep Postgres happy with bindparam typing
    op.execute(
        sa.text(
            """
            INSERT INTO arenas (id, slug, start_at, end_at, status, markets, created_at)
            VALUES (:id::uuid, :slug, :start_at, :end_at, 'active', '[]'::jsonb, :created_at)
            ON CONFLICT (slug) DO NOTHING
            """
        ).bindparams(
            id=str(uuid4()),
            slug=slug,
            start_at=start_at,
            end_at=end_at,
            created_at=now,
        )
    )


def downgrade() -> None:
    # Non-destructive: do nothing
    pass
