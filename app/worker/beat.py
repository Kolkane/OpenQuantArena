from __future__ import annotations

import os

from celery.schedules import crontab

# Minimal beat schedule.
# NOTE: enable by running celery worker with -B or separate beat process.

CELERY_BEAT_SCHEDULE = {
    # Example: every 5 minutes collect predictions for current arena.
    # The arena id should be injected by env for V1; later we can query DB.
    "arena_collect_predictions": {
        "task": "arena.collect_predictions",
        "schedule": 300.0,
        "args": (os.getenv("ARENA_ID", ""),),
    },
}
