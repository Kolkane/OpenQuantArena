from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.pred_models import Arena, ArenaStatus
from app.schemas import ArenaCurrentResponse

router = APIRouter()


@router.get("/current", response_model=ArenaCurrentResponse)
async def get_current_arena(db: AsyncSession = Depends(get_db)) -> ArenaCurrentResponse:
    res = await db.execute(
        select(Arena)
        .where(Arena.status.in_([ArenaStatus.active, ArenaStatus.scheduled]))
        .order_by(Arena.start_at.desc())
        .limit(1)
    )
    arena = res.scalar_one_or_none()
    if not arena:
        raise HTTPException(status_code=404, detail="no active arena")

    return ArenaCurrentResponse(
        id=arena.id,
        slug=arena.slug,
        start_at=arena.start_at,
        end_at=arena.end_at,
        status=arena.status.value,
        markets=arena.markets,
    )
