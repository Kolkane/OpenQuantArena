from __future__ import annotations

from celery import Celery

from app.core.config import settings

celery_app = Celery(
    "openquantarena",
    broker=settings.redis_url,
    backend=settings.redis_url,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

# Beat schedule (optional): enable with a celery beat process.
try:
    from app.worker.beat import CELERY_BEAT_SCHEDULE

    celery_app.conf.beat_schedule = CELERY_BEAT_SCHEDULE
except Exception:
    pass
