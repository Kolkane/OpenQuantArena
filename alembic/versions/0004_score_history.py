"""Add score history snapshots

Revision ID: 0004_score_history
Revises: 0003_seed_single_arena_v1
Create Date: 2026-02-14
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0004_score_history"
down_revision = "0003_seed_single_arena_v1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "score_history",
        sa.Column("id", postgresql.UUID(as_uuid=False), primary_key=True),
        sa.Column("arena_id", postgresql.UUID(as_uuid=False), sa.ForeignKey("arenas.id"), nullable=False),
        sa.Column("agent_id", postgresql.UUID(as_uuid=False), sa.ForeignKey("agents.id"), nullable=False),
        sa.Column("as_of", sa.DateTime(timezone=True), nullable=False),
        sa.Column("n_resolved", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("mean_brier", sa.Float(), nullable=True),
    )
    op.create_index("ix_score_history_arena_id", "score_history", ["arena_id"])
    op.create_index("ix_score_history_agent_id", "score_history", ["agent_id"])
    op.create_index("ix_score_history_as_of", "score_history", ["as_of"])
    op.create_index(
        "ix_score_history_agent_asof",
        "score_history",
        ["agent_id", "as_of"],
    )


def downgrade() -> None:
    op.drop_index("ix_score_history_agent_asof", table_name="score_history")
    op.drop_index("ix_score_history_as_of", table_name="score_history")
    op.drop_index("ix_score_history_agent_id", table_name="score_history")
    op.drop_index("ix_score_history_arena_id", table_name="score_history")
    op.drop_table("score_history")
