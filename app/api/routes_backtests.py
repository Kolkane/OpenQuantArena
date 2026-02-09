from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models import BacktestRun, Strategy, User
from app.schemas import BacktestCreate, BacktestOut
from app.worker.tasks import run_backtest

router = APIRouter()


def to_out(r: BacktestRun) -> BacktestOut:
    return BacktestOut(
        id=r.id,
        strategy_id=r.strategy_id,
        start_date=r.start_date,
        end_date=r.end_date,
        status=r.status.value,
        error=r.error,
        cagr=r.cagr,
        max_drawdown=r.max_drawdown,
        sharpe=r.sharpe,
        created_at=r.created_at,
        updated_at=r.updated_at,
    )


@router.post("", response_model=BacktestOut)
async def create_backtest(
    payload: BacktestCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> BacktestOut:
    # Ensure strategy exists and belongs to user
    sres = await db.execute(select(Strategy).where(Strategy.id == payload.strategy_id, Strategy.owner_id == user.id))
    if sres.scalar_one_or_none() is None:
        raise HTTPException(status_code=404, detail="Strategy not found")

    run = BacktestRun(strategy_id=payload.strategy_id, start_date=payload.start_date, end_date=payload.end_date)
    db.add(run)
    await db.commit()
    await db.refresh(run)

    # Enqueue worker
    run_backtest.delay(run.id)

    return to_out(run)


@router.get("/{run_id}", response_model=BacktestOut)
async def get_backtest(
    run_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> BacktestOut:
    q = (
        select(BacktestRun)
        .join(Strategy, Strategy.id == BacktestRun.strategy_id)
        .where(BacktestRun.id == run_id, Strategy.owner_id == user.id)
    )
    res = await db.execute(q)
    run = res.scalar_one_or_none()
    if not run:
        raise HTTPException(status_code=404, detail="Backtest not found")
    return to_out(run)
