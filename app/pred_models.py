from __future__ import annotations

import enum
from datetime import datetime
from uuid import uuid4

from sqlalchemy import Boolean, DateTime, Enum, Float, ForeignKey, Index, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class ArenaStatus(str, enum.Enum):
    scheduled = "scheduled"
    active = "active"
    ended = "ended"


class PredictiveAgent(Base):
    __tablename__ = "agents"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))

    # Optional: keep user ownership; can be null for V1 (no-auth registrations)
    user_id: Mapped[str | None] = mapped_column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=True, index=True)

    name: Mapped[str] = mapped_column(String(120), nullable=False, default="agent")
    base_url: Mapped[str] = mapped_column(Text, nullable=False)
    predict_path: Mapped[str] = mapped_column(String(120), nullable=False, default="/predict")

    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    last_called_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    timeout_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    error_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    predictions: Mapped[list[Prediction]] = relationship(back_populates="agent")  # type: ignore[name-defined]
    scores: Mapped[list[ArenaScore]] = relationship(back_populates="agent")  # type: ignore[name-defined]


class Arena(Base):
    __tablename__ = "arenas"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True, nullable=False)

    start_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    status: Mapped[ArenaStatus] = mapped_column(Enum(ArenaStatus), nullable=False, index=True)

    # V1: store market universe directly in JSON (keep table count minimal)
    # Shape: [{"id": "<polymarket_market_id>", "question": "...", "close_time": "..."}, ...]
    markets: Mapped[list[dict]] = mapped_column(JSONB, nullable=False, default=list)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    predictions: Mapped[list[Prediction]] = relationship(back_populates="arena")  # type: ignore[name-defined]
    scores: Mapped[list[ArenaScore]] = relationship(back_populates="arena")  # type: ignore[name-defined]


class Prediction(Base):
    __tablename__ = "predictions"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))

    arena_id: Mapped[str] = mapped_column(UUID(as_uuid=False), ForeignKey("arenas.id"), index=True)
    agent_id: Mapped[str] = mapped_column(UUID(as_uuid=False), ForeignKey("agents.id"), index=True)

    market_id: Mapped[str] = mapped_column(String(120), index=True)
    as_of: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)

    p_yes: Mapped[float | None] = mapped_column(Float, nullable=True)
    latency_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    error: Mapped[str | None] = mapped_column(String(80), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    arena: Mapped[Arena] = relationship(back_populates="predictions")
    agent: Mapped[PredictiveAgent] = relationship(back_populates="predictions")

    __table_args__ = (
        Index("ix_predictions_agent_market_asof", "agent_id", "market_id", "as_of"),
    )


class ArenaScore(Base):
    __tablename__ = "scores"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))

    arena_id: Mapped[str] = mapped_column(UUID(as_uuid=False), ForeignKey("arenas.id"), index=True)
    agent_id: Mapped[str] = mapped_column(UUID(as_uuid=False), ForeignKey("agents.id"), index=True)

    n_resolved: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    mean_brier: Mapped[float | None] = mapped_column(Float, nullable=True)

    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    arena: Mapped[Arena] = relationship(back_populates="scores")
    agent: Mapped[PredictiveAgent] = relationship(back_populates="scores")

    __table_args__ = (
        Index("ix_scores_arena_meanbrier", "arena_id", "mean_brier"),
        Index("uq_scores_arena_agent", "arena_id", "agent_id", unique=True),
    )
