from __future__ import annotations

import random
from datetime import datetime

from sqlalchemy import select

from app.db.sync import get_sync_session
from app.models import BacktestRun, BacktestStatus
from app.worker.celery_app import celery_app


@celery_app.task(name="openquantarena.run_backtest")
def run_backtest(run_id: str) -> dict[str, float]:
    """Deterministic dummy backtest.

    We use a seeded RNG to produce stable-ish metrics for demo purposes.
    """

    session = get_sync_session()
    try:
        run = session.execute(select(BacktestRun).where(BacktestRun.id == run_id)).scalar_one_or_none()
        if run is None:
            return {}

        run.status = BacktestStatus.running
        run.updated_at = datetime.utcnow()
        session.commit()

        seed = hash(f"{run.strategy_id}:{run.start_date}:{run.end_date}") & 0xFFFFFFFF
        rng = random.Random(seed)

        # Fake plausible-ish metrics
        cagr = rng.uniform(-0.15, 0.45)
        max_dd = rng.uniform(0.05, 0.55)
        sharpe = rng.uniform(-0.5, 3.0)

        run.cagr = float(round(cagr, 4))
        run.max_drawdown = float(round(max_dd, 4))
        run.sharpe = float(round(sharpe, 4))
        run.status = BacktestStatus.succeeded
        run.updated_at = datetime.utcnow()
        session.commit()

        return {"cagr": run.cagr, "max_drawdown": run.max_drawdown, "sharpe": run.sharpe}
    except Exception as e:
        session.rollback()
        run = session.execute(select(BacktestRun).where(BacktestRun.id == run_id)).scalar_one_or_none()
        if run is not None:
            run.status = BacktestStatus.failed
            run.error = str(e)
            run.updated_at = datetime.utcnow()
            session.commit()
        raise
    finally:
        session.close()
