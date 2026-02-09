from __future__ import annotations

from fastapi import FastAPI

from app.api.routes import router as api_router


def create_app() -> FastAPI:
    app = FastAPI(title="OpenQuantArena", version="0.1.0")

    @app.get("/health")
    async def health() -> dict[str, str]:
        return {"status": "ok"}

    app.include_router(api_router)
    return app


app = create_app()
