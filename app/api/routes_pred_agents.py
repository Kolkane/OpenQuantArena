from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.pred_models import Arena, ArenaScore, PredictiveAgent
from app.pred_models_history import ScoreHistory
from app.schemas import AgentHistoryPoint, AgentHistoryResponse, AgentOut, AgentProfileResponse, AgentRegisterRequest

router = APIRouter()


@router.post("", response_model=AgentOut)
async def register_agent(payload: AgentRegisterRequest, db: AsyncSession = Depends(get_db)) -> AgentOut:
    agent = PredictiveAgent(
        name=payload.name,
        base_url=payload.base_url,
        predict_path=payload.predict_path,
        is_active=True,
    )
    db.add(agent)
    await db.commit()
    await db.refresh(agent)
    return AgentOut(
        id=agent.id,
        name=agent.name,
        base_url=agent.base_url,
        predict_path=agent.predict_path,
        is_active=agent.is_active,
        created_at=agent.created_at,
    )


@router.get("", response_model=list[AgentOut])
async def list_agents(db: AsyncSession = Depends(get_db)) -> list[AgentOut]:
    res = await db.execute(select(PredictiveAgent).order_by(PredictiveAgent.created_at.desc()).limit(200))
    items: list[AgentOut] = []
    for a in res.scalars().all():
        items.append(
            AgentOut(
                id=a.id,
                name=a.name,
                base_url=a.base_url,
                predict_path=a.predict_path,
                is_active=a.is_active,
                created_at=a.created_at,
            )
        )
    return items


@router.get("/{agent_id}", response_model=AgentProfileResponse)
async def get_agent_profile(agent_id: str, db: AsyncSession = Depends(get_db)) -> AgentProfileResponse:
    agent = (await db.execute(select(PredictiveAgent).where(PredictiveAgent.id == agent_id))).scalar_one_or_none()
    if not agent:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="agent not found")

    # pick latest arena score if available
    arena = (await db.execute(select(Arena).order_by(Arena.start_at.desc()).limit(1))).scalar_one_or_none()
    score = None
    if arena:
        score = (
            await db.execute(
                select(ArenaScore).where(ArenaScore.arena_id == arena.id, ArenaScore.agent_id == agent.id).limit(1)
            )
        ).scalar_one_or_none()

    agent_out = AgentOut(
        id=agent.id,
        name=agent.name,
        base_url=agent.base_url,
        predict_path=agent.predict_path,
        is_active=agent.is_active,
        created_at=agent.created_at,
    )

    return AgentProfileResponse(
        agent=agent_out,
        arena_id=arena.id if arena else None,
        n_resolved=score.n_resolved if score else 0,
        mean_brier=score.mean_brier if score else None,
    )


@router.get("/{agent_id}/history", response_model=AgentHistoryResponse)
async def get_agent_history(
    agent_id: str,
    limit: int = 120,
    db: AsyncSession = Depends(get_db),
) -> AgentHistoryResponse:
    agent = (await db.execute(select(PredictiveAgent.id).where(PredictiveAgent.id == agent_id))).scalar_one_or_none()
    if not agent:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="agent not found")

    arena = (await db.execute(select(Arena).order_by(Arena.start_at.desc()).limit(1))).scalar_one_or_none()

    q = (
        select(ScoreHistory)
        .where(ScoreHistory.agent_id == agent_id)
        .order_by(ScoreHistory.as_of.asc())
        .limit(min(max(limit, 1), 500))
    )
    res = await db.execute(q)
    points = [
        AgentHistoryPoint(as_of=row.as_of, n_resolved=row.n_resolved, mean_brier=row.mean_brier)
        for row in res.scalars().all()
    ]

    return AgentHistoryResponse(agent_id=agent_id, arena_id=arena.id if arena else None, points=points)
