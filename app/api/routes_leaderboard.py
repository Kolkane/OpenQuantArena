from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models import BacktestRun, Strategy, User
from app.schemas import LeaderboardEntry, LeaderboardResponse

router = APIRouter()


@router.get("", response_model=LeaderboardResponse)
async def leaderboard(
    metric: str = "sharpe",
    limit: int = 50,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> LeaderboardResponse:
    metric = metric.lower()
    if metric not in {"sharpe", "cagr", "max_drawdown"}:
        raise HTTPException(status_code=400, detail="metric must be one of sharpe|cagr|max_drawdown")

    # Latest backtest per strategy (by created_at)
    subq = (
        select(
            BacktestRun.strategy_id.label("strategy_id"),
            func.max(BacktestRun.created_at).label("max_created_at"),
        )
        .join(Strategy, Strategy.id == BacktestRun.strategy_id)
        .where(Strategy.owner_id == user.id, BacktestRun.status == "succeeded")
        .group_by(BacktestRun.strategy_id)
        .subquery()
    )

    q = (
        select(Strategy, BacktestRun)
        .join(subq, subq.c.strategy_id == Strategy.id)
        .join(
            BacktestRun,
            (BacktestRun.strategy_id == Strategy.id) & (BacktestRun.created_at == subq.c.max_created_at),
        )
    )

    order_col = {
        "sharpe": BacktestRun.sharpe,
        "cagr": BacktestRun.cagr,
        "max_drawdown": BacktestRun.max_drawdown,
    }[metric]

    # max_drawdown: lower is better (more negative is worse), so order ascending; others desc
    if metric == "max_drawdown":
        q = q.order_by(order_col.asc().nullslast())
    else:
        q = q.order_by(desc(order_col).nullslast())

    q = q.limit(min(max(limit, 1), 200))

    res = await db.execute(q)
    items: list[LeaderboardEntry] = []
    for strat, run in res.all():
        metric_val = getattr(run, metric)
        items.append(
            LeaderboardEntry(
                strategy_id=strat.id,
                strategy_name=strat.name,
                metric=metric_val,
                cagr=run.cagr,
                max_drawdown=run.max_drawdown,
                sharpe=run.sharpe,
            )
        )

    return LeaderboardResponse(metric=metric, items=items)
