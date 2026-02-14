from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.pred_models import PredictiveAgent
from app.schemas import AgentOut, AgentRegisterRequest

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
