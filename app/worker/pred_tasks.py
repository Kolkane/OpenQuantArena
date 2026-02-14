from __future__ import annotations

import asyncio
import json
import time
from datetime import datetime, timezone
from typing import Any

import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import async_session_maker
from app.pred_models import Arena, ArenaScore, ArenaStatus, Prediction, PredictiveAgent


DEFAULT_TIMEOUT_SECONDS = 5.0


async def _call_agent(agent: PredictiveAgent, markets: list[dict]) -> tuple[dict[str, float], int | None, str | None]:
    url = agent.base_url.rstrip("/") + agent.predict_path
    t0 = time.time()
    try:
        async with httpx.AsyncClient(timeout=DEFAULT_TIMEOUT_SECONDS) as client:
            r = await client.post(url, json={"markets": markets})
        latency_ms = int((time.time() - t0) * 1000)
        r.raise_for_status()
        data = r.json()
        # Expect: {"predictions": [{"market_id": "...", "p_yes": 0.42}, ...]}
        preds = {}
        for item in data.get("predictions", []):
            mid = str(item.get("market_id"))
            p = float(item.get("p_yes"))
            if p < 0:
                p = 0.0
            if p > 1:
                p = 1.0
            preds[mid] = p
        return preds, latency_ms, None
    except asyncio.TimeoutError:
        return {}, None, "timeout"
    except Exception:
        return {}, None, "error"


from app.worker.polymarket import extract_resolved_outcomes, fetch_markets


async def _get_active_arena(db: AsyncSession) -> Arena | None:
    return (
        await db.execute(
            select(Arena)
            .where(Arena.status == ArenaStatus.active)
            .order_by(Arena.start_at.desc())
            .limit(1)
        )
    ).scalar_one_or_none()


async def arena_sync_markets(limit: int = 40) -> None:
    async with async_session_maker() as db:
        arena = await _get_active_arena(db)
        if not arena:
            return

        markets = await fetch_markets(limit=limit)
        # Keep only minimal fields for V1
        arena.markets = [
            {
                "id": m.get("id"),
                "question": m.get("question"),
                "close_time": m.get("close_time"),
                "url": m.get("url"),
                "source": "polymarket",
            }
            for m in markets
            if m.get("id")
        ]
        await db.commit()


async def arena_collect_predictions() -> None:
    as_of = datetime.now(timezone.utc)

    async with async_session_maker() as db:
        arena = await _get_active_arena(db)
        if not arena:
            return

        markets = arena.markets
        agents = (await db.execute(select(PredictiveAgent).where(PredictiveAgent.is_active == True))).scalars().all()  # noqa: E712

        for agent in agents:
            preds, latency_ms, err = await _call_agent(agent, markets)
            agent.last_called_at = as_of
            if err == "timeout":
                agent.timeout_count += 1
            elif err == "error":
                agent.error_count += 1

            # Store per-market predictions (or errors)
            for m in markets:
                mid = str(m.get("id"))
                p = preds.get(mid)
                db.add(
                    Prediction(
                        arena_id=arena.id,
                        agent_id=agent.id,
                        market_id=mid,
                        as_of=as_of,
                        p_yes=p,
                        latency_ms=latency_ms,
                        error=err if p is None else None,
                    )
                )

        await db.commit()


async def arena_compute_scores(arena_id: str, resolved_outcomes: dict[str, int]) -> None:
    """Compute mean Brier for markets that have outcomes.

    resolved_outcomes: {market_id: 0|1}
    """

    async with async_session_maker() as db:
        agents = (await db.execute(select(PredictiveAgent).where(PredictiveAgent.is_active == True))).scalars().all()  # noqa: E712

        for agent in agents:
            total = 0.0
            n = 0
            for mid, outcome in resolved_outcomes.items():
                # Latest prediction for that market
                pred = (
                    await db.execute(
                        select(Prediction)
                        .where(Prediction.agent_id == agent.id, Prediction.arena_id == arena_id, Prediction.market_id == mid, Prediction.p_yes.isnot(None))
                        .order_by(Prediction.as_of.desc())
                        .limit(1)
                    )
                ).scalar_one_or_none()
                if not pred:
                    continue
                brier = (float(pred.p_yes) - float(outcome)) ** 2
                total += brier
                n += 1

            mean = (total / n) if n else None

            existing = (
                await db.execute(
                    select(ArenaScore).where(ArenaScore.arena_id == arena_id, ArenaScore.agent_id == agent.id).limit(1)
                )
            ).scalar_one_or_none()
            if existing:
                existing.n_resolved = n
                existing.mean_brier = mean
                existing.updated_at = datetime.utcnow()
            else:
                db.add(
                    ArenaScore(
                        arena_id=arena_id,
                        agent_id=agent.id,
                        n_resolved=n,
                        mean_brier=mean,
                        updated_at=datetime.utcnow(),
                    )
                )

        await db.commit()


async def arena_sync_outcomes_and_scores() -> None:
    """Best-effort outcomes sync + score recompute.

    Polymarket outcome schema can vary; if we cannot extract outcomes, we keep scores unchanged.
    """

    async with async_session_maker() as db:
        arena = await _get_active_arena(db)
        if not arena:
            return

        # Try to reuse current arena.markets snapshot; if empty, refresh once
        markets = arena.markets
        if not markets:
            await arena_sync_markets()
            arena = await _get_active_arena(db)
            markets = arena.markets if arena else []

        outcomes = extract_resolved_outcomes(markets)
        if not outcomes:
            return

    # compute scores outside the session to reuse helper
    await arena_compute_scores(arena_id=str(arena.id), resolved_outcomes=outcomes)
