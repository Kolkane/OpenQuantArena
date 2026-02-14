from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import asc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.pred_models import Arena, ArenaScore, PredictiveAgent
from app.schemas import ArenaLeaderboardItem, ArenaLeaderboardResponse

router = APIRouter()


@router.get("", response_model=ArenaLeaderboardResponse)
async def leaderboard(db: AsyncSession = Depends(get_db)) -> ArenaLeaderboardResponse:
    arena = (await db.execute(select(Arena).order_by(Arena.start_at.desc()).limit(1))).scalar_one_or_none()
    if not arena:
        raise HTTPException(status_code=404, detail="no arena")

    q = (
        select(ArenaScore, PredictiveAgent)
        .join(PredictiveAgent, PredictiveAgent.id == ArenaScore.agent_id)
        .where(ArenaScore.arena_id == arena.id)
        .order_by(asc(ArenaScore.mean_brier).nullslast())
        .limit(200)
    )
    res = await db.execute(q)
    items: list[ArenaLeaderboardItem] = []
    for score, agent in res.all():
        items.append(
            ArenaLeaderboardItem(
                agent_id=agent.id,
                agent_name=agent.name,
                n_resolved=score.n_resolved,
                mean_brier=score.mean_brier,
            )
        )

    return ArenaLeaderboardResponse(arena_id=arena.id, items=items)
