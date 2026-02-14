from __future__ import annotations

from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class TokenResponse(BaseModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: EmailStr
    created_at: datetime


class StrategyCreate(BaseModel):
    name: str
    description: str | None = None


class StrategyOut(BaseModel):
    id: str
    owner_id: str
    name: str
    description: str | None
    file_path: str | None
    created_at: datetime
    updated_at: datetime


class BacktestCreate(BaseModel):
    strategy_id: str
    start_date: date
    end_date: date


class BacktestOut(BaseModel):
    id: str
    strategy_id: str
    start_date: date
    end_date: date
    status: str
    error: str | None
    cagr: float | None
    max_drawdown: float | None
    sharpe: float | None
    created_at: datetime
    updated_at: datetime


class LeaderboardEntry(BaseModel):
    strategy_id: str
    strategy_name: str
    metric: float | None
    cagr: float | None
    max_drawdown: float | None
    sharpe: float | None


class LeaderboardResponse(BaseModel):
    metric: str
    items: list[LeaderboardEntry]


# --- Predictive Arena V1 ---

class AgentRegisterRequest(BaseModel):
    name: str = "agent"
    base_url: str
    predict_path: str = "/predict"


class AgentOut(BaseModel):
    id: str
    name: str
    base_url: str
    predict_path: str
    is_active: bool
    created_at: datetime


class ArenaCurrentResponse(BaseModel):
    id: str
    slug: str
    start_at: datetime
    end_at: datetime
    status: str
    markets: list[dict]


class ArenaLeaderboardItem(BaseModel):
    agent_id: str
    agent_name: str
    n_resolved: int
    mean_brier: float | None


class ArenaLeaderboardResponse(BaseModel):
    arena_id: str
    items: list[ArenaLeaderboardItem]
