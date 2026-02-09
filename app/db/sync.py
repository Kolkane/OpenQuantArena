from __future__ import annotations

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

engine = create_engine(settings.database_url_sync, pool_pre_ping=True)
SessionLocalSync = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_sync_session() -> Session:
    return SessionLocalSync()
