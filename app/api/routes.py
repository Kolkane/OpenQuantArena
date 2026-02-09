from __future__ import annotations

from fastapi import APIRouter

from app.api.routes_auth import router as auth_router
from app.api.routes_backtests import router as backtests_router
from app.api.routes_leaderboard import router as leaderboard_router
from app.api.routes_strategies import router as strategies_router

router = APIRouter(prefix="/api")
router.include_router(auth_router, tags=["auth"], prefix="/auth")
router.include_router(strategies_router, tags=["strategies"], prefix="/strategies")
router.include_router(backtests_router, tags=["backtests"], prefix="/backtests")
router.include_router(leaderboard_router, tags=["leaderboard"], prefix="/leaderboard")
