from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Database
    database_url: str = "postgresql+asyncpg://oqa:oqa_secret@localhost:5432/openquantarena"
    database_url_sync: str = "postgresql://oqa:oqa_secret@localhost:5432/openquantarena"

    # Redis / Celery
    redis_url: str = "redis://localhost:6379/0"

    # Security
    secret_key: str = "change-me"
    access_token_exp_minutes: int = 60 * 24

    # File storage
    strategy_upload_dir: str = "/data/strategies"


settings = Settings()
