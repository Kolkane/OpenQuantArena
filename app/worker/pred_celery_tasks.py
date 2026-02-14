from __future__ import annotations

import asyncio

from app.worker.celery_app import celery_app
from app.worker.pred_tasks import arena_collect_predictions


from app.worker.pred_tasks import arena_collect_predictions, arena_sync_markets, arena_sync_outcomes_and_scores


@celery_app.task(name="openquantarena.arena.collect_predictions")
def collect_predictions() -> None:
    asyncio.run(arena_collect_predictions())


@celery_app.task(name="openquantarena.arena.sync_markets")
def sync_markets() -> None:
    asyncio.run(arena_sync_markets())


@celery_app.task(name="openquantarena.arena.sync_outcomes_and_scores")
def sync_outcomes_and_scores() -> None:
    asyncio.run(arena_sync_outcomes_and_scores())
