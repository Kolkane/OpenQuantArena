from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings


def get_engine() -> AsyncEngine:
    return create_async_engine(settings.database_url, echo=False, pool_pre_ping=True)


engine = get_engine()
SessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
