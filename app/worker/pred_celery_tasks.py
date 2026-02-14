from __future__ import annotations

import asyncio

from app.worker.celery_app import celery_app
from app.worker.pred_tasks import arena_collect_predictions


@celery_app.task(name="openquantarena.arena.collect_predictions")
def collect_predictions(arena_id: str) -> None:
    if not arena_id:
        return
    asyncio.run(arena_collect_predictions(arena_id))
