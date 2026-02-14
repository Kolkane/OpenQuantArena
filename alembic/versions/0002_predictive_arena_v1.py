"""Predictive Arena V1

Revision ID: 0002_predictive_arena_v1
Revises: 0001_init
Create Date: 2026-02-14
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "0002_predictive_arena_v1"
down_revision = "0001_init"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # agents (predictive)
    op.create_table(
        "agents",
        sa.Column("id", postgresql.UUID(as_uuid=False), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=False), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("name", sa.String(length=120), nullable=False, server_default="agent"),
        sa.Column("base_url", sa.Text(), nullable=False),
        sa.Column("predict_path", sa.String(length=120), nullable=False, server_default="/predict"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("last_called_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("timeout_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("error_count", sa.Integer(), nullable=False, server_default="0"),
    )
    op.create_index("ix_agents_user_id", "agents", ["user_id"])

    # arenas
    op.create_table(
        "arenas",
        sa.Column("id", postgresql.UUID(as_uuid=False), primary_key=True),
        sa.Column("slug", sa.String(length=80), nullable=False),
        sa.Column("start_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("end_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column(
            "status",
            sa.Enum("scheduled", "active", "ended", name="arenastatus"),
            nullable=False,
        ),
        sa.Column("markets", postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default=sa.text("'[]'::jsonb")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_arenas_slug", "arenas", ["slug"], unique=True)
    op.create_index("ix_arenas_status", "arenas", ["status"])

    # predictions
    op.create_table(
        "predictions",
        sa.Column("id", postgresql.UUID(as_uuid=False), primary_key=True),
        sa.Column("arena_id", postgresql.UUID(as_uuid=False), sa.ForeignKey("arenas.id"), nullable=False),
        sa.Column("agent_id", postgresql.UUID(as_uuid=False), sa.ForeignKey("agents.id"), nullable=False),
        sa.Column("market_id", sa.String(length=120), nullable=False),
        sa.Column("as_of", sa.DateTime(timezone=True), nullable=False),
        sa.Column("p_yes", sa.Float(), nullable=True),
        sa.Column("latency_ms", sa.Integer(), nullable=True),
        sa.Column("error", sa.String(length=80), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_predictions_arena_id", "predictions", ["arena_id"])
    op.create_index("ix_predictions_agent_id", "predictions", ["agent_id"])
    op.create_index("ix_predictions_market_id", "predictions", ["market_id"])
    op.create_index("ix_predictions_as_of", "predictions", ["as_of"])
    op.create_index("ix_predictions_agent_market_asof", "predictions", ["agent_id", "market_id", "as_of"])

    # scores
    op.create_table(
        "scores",
        sa.Column("id", postgresql.UUID(as_uuid=False), primary_key=True),
        sa.Column("arena_id", postgresql.UUID(as_uuid=False), sa.ForeignKey("arenas.id"), nullable=False),
        sa.Column("agent_id", postgresql.UUID(as_uuid=False), sa.ForeignKey("agents.id"), nullable=False),
        sa.Column("n_resolved", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("mean_brier", sa.Float(), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_scores_arena_id", "scores", ["arena_id"])
    op.create_index("ix_scores_agent_id", "scores", ["agent_id"])
    op.create_index("ix_scores_arena_meanbrier", "scores", ["arena_id", "mean_brier"])
    op.create_index("uq_scores_arena_agent", "scores", ["arena_id", "agent_id"], unique=True)


def downgrade() -> None:
    op.drop_index("uq_scores_arena_agent", table_name="scores")
    op.drop_index("ix_scores_arena_meanbrier", table_name="scores")
    op.drop_index("ix_scores_agent_id", table_name="scores")
    op.drop_index("ix_scores_arena_id", table_name="scores")
    op.drop_table("scores")

    op.drop_index("ix_predictions_agent_market_asof", table_name="predictions")
    op.drop_index("ix_predictions_as_of", table_name="predictions")
    op.drop_index("ix_predictions_market_id", table_name="predictions")
    op.drop_index("ix_predictions_agent_id", table_name="predictions")
    op.drop_index("ix_predictions_arena_id", table_name="predictions")
    op.drop_table("predictions")

    op.drop_index("ix_arenas_status", table_name="arenas")
    op.drop_index("ix_arenas_slug", table_name="arenas")
    op.drop_table("arenas")

    op.drop_index("ix_agents_user_id", table_name="agents")
    op.drop_table("agents")

    op.execute("DROP TYPE IF EXISTS arenastatus")
