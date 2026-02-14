from __future__ import annotations

from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, Float, ForeignKey, Index, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class ScoreHistory(Base):
    __tablename__ = "score_history"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))
    arena_id: Mapped[str] = mapped_column(UUID(as_uuid=False), ForeignKey("arenas.id"), index=True)
    agent_id: Mapped[str] = mapped_column(UUID(as_uuid=False), ForeignKey("agents.id"), index=True)

    as_of: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    n_resolved: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    mean_brier: Mapped[float | None] = mapped_column(Float, nullable=True)

    __table_args__ = (
        Index("ix_score_history_agent_asof", "agent_id", "as_of"),
    )
