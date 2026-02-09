from __future__ import annotations

import os
import subprocess

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router as api_router


def create_app() -> FastAPI:
    app = FastAPI(title="OpenQuantArena", version="0.1.0")

    # CORS: allow the Next.js frontend (Vercel) to call the API from the browser.
    # For MVP we allow all origins. Tighten this later to your app domain(s).
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    async def _auto_migrate() -> None:
        # Railway doesn't reliably run "pre-deploy" hooks. To keep the demo stable,
        # we run Alembic migrations on startup (idempotent). Disable by setting
        # AUTO_MIGRATE=0.
        if os.getenv("AUTO_MIGRATE", "1") in {"0", "false", "False"}:
            return

        cmd = ["alembic", "-c", "/app/alembic.ini", "upgrade", "head"]
        print(f"[auto-migrate] running: {' '.join(cmd)}")
        proc = subprocess.run(cmd, capture_output=True, text=True)
        if proc.stdout:
            print(f"[auto-migrate][stdout]\n{proc.stdout}")
        if proc.stderr:
            print(f"[auto-migrate][stderr]\n{proc.stderr}")
        if proc.returncode != 0:
            raise RuntimeError(f"Auto-migrate failed with exit code {proc.returncode}")

    @app.get("/health")
    async def health() -> dict[str, str]:
        return {"status": "ok"}

    app.include_router(api_router)
    return app


app = create_app()
