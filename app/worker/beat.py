from __future__ import annotations

import os

from celery.schedules import crontab

# Minimal beat schedule.
# NOTE: enable by running celery worker with -B or separate beat process.

CELERY_BEAT_SCHEDULE = {
    # Every 10 minutes: refresh markets snapshot
    "arena_sync_markets": {
        "task": "openquantarena.arena.sync_markets",
        "schedule": 600.0,
        "args": (),
    },
    # Every 5 minutes: call agents + store predictions
    "arena_collect_predictions": {
        "task": "openquantarena.arena.collect_predictions",
        "schedule": 300.0,
        "args": (),
    },
    # Every 10 minutes: try to sync outcomes + compute scores
    "arena_sync_outcomes_and_scores": {
        "task": "openquantarena.arena.sync_outcomes_and_scores",
        "schedule": 600.0,
        "args": (),
    },
}
