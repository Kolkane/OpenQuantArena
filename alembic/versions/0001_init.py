"""init

Revision ID: 0001
Revises: 
Create Date: 2026-02-09

"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.dialects.postgresql.UUID(as_uuid=False), primary_key=True),
        sa.Column("email", sa.String(length=320), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "strategies",
        sa.Column("id", sa.dialects.postgresql.UUID(as_uuid=False), primary_key=True),
        sa.Column("owner_id", sa.dialects.postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("file_path", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["owner_id"], ["users.id"]),
    )
    op.create_index("ix_strategies_owner_id", "strategies", ["owner_id"], unique=False)

    op.create_table(
        "backtest_runs",
        sa.Column("id", sa.dialects.postgresql.UUID(as_uuid=False), primary_key=True),
        sa.Column("strategy_id", sa.dialects.postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column("start_date", sa.Date(), nullable=False),
        sa.Column("end_date", sa.Date(), nullable=False),
        sa.Column("status", sa.Enum("queued", "running", "succeeded", "failed", name="backteststatus"), nullable=False),
        sa.Column("error", sa.Text(), nullable=True),
        sa.Column("cagr", sa.Float(), nullable=True),
        sa.Column("max_drawdown", sa.Float(), nullable=True),
        sa.Column("sharpe", sa.Float(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["strategy_id"], ["strategies.id"]),
    )
    op.create_index("ix_backtest_runs_strategy_id", "backtest_runs", ["strategy_id"], unique=False)
    op.create_index("ix_backtest_runs_status", "backtest_runs", ["status"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_backtest_runs_status", table_name="backtest_runs")
    op.drop_index("ix_backtest_runs_strategy_id", table_name="backtest_runs")
    op.drop_table("backtest_runs")

    op.drop_index("ix_strategies_owner_id", table_name="strategies")
    op.drop_table("strategies")

    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")

    op.execute("DROP TYPE IF EXISTS backteststatus")
