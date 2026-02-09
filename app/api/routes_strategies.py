from __future__ import annotations

import os
from datetime import datetime

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.core.config import settings
from app.models import Strategy, User
from app.schemas import StrategyCreate, StrategyOut

router = APIRouter()


def to_out(s: Strategy) -> StrategyOut:
    return StrategyOut(
        id=s.id,
        owner_id=s.owner_id,
        name=s.name,
        description=s.description,
        file_path=s.file_path,
        created_at=s.created_at,
        updated_at=s.updated_at,
    )


@router.post("", response_model=StrategyOut)
async def create_strategy(
    payload: StrategyCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> StrategyOut:
    s = Strategy(owner_id=user.id, name=payload.name, description=payload.description)
    db.add(s)
    await db.commit()
    await db.refresh(s)
    return to_out(s)


@router.get("", response_model=list[StrategyOut])
async def list_strategies(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[StrategyOut]:
    res = await db.execute(select(Strategy).where(Strategy.owner_id == user.id).order_by(Strategy.created_at.desc()))
    return [to_out(x) for x in res.scalars().all()]


@router.get("/{strategy_id}", response_model=StrategyOut)
async def get_strategy(
    strategy_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> StrategyOut:
    res = await db.execute(select(Strategy).where(Strategy.id == strategy_id, Strategy.owner_id == user.id))
    s = res.scalar_one_or_none()
    if not s:
        raise HTTPException(status_code=404, detail="Strategy not found")
    return to_out(s)


@router.put("/{strategy_id}", response_model=StrategyOut)
async def update_strategy(
    strategy_id: str,
    payload: StrategyCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> StrategyOut:
    res = await db.execute(select(Strategy).where(Strategy.id == strategy_id, Strategy.owner_id == user.id))
    s = res.scalar_one_or_none()
    if not s:
        raise HTTPException(status_code=404, detail="Strategy not found")

    s.name = payload.name
    s.description = payload.description
    s.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(s)
    return to_out(s)


@router.post("/{strategy_id}/upload", response_model=StrategyOut)
async def upload_strategy_file(
    strategy_id: str,
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> StrategyOut:
    if not file.filename or not file.filename.endswith(".py"):
        raise HTTPException(status_code=400, detail="Only .py files are allowed")

    res = await db.execute(select(Strategy).where(Strategy.id == strategy_id, Strategy.owner_id == user.id))
    s = res.scalar_one_or_none()
    if not s:
        raise HTTPException(status_code=404, detail="Strategy not found")

    os.makedirs(settings.strategy_upload_dir, exist_ok=True)
    dst = os.path.join(settings.strategy_upload_dir, f"{s.id}.py")

    content = await file.read()
    if len(content) > 200_000:
        raise HTTPException(status_code=400, detail="File too large")

    with open(dst, "wb") as f:
        f.write(content)

    s.file_path = dst
    s.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(s)
    return to_out(s)
