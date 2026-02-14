from __future__ import annotations

from fastapi import APIRouter

from app.api.routes_auth import router as auth_router
from app.api.routes_backtests import router as backtests_router
from app.api.routes_leaderboard import router as leaderboard_router
from app.api.routes_strategies import router as strategies_router

# Predictive Arena V1
from app.api.routes_pred_agents import router as pred_agents_router
from app.api.routes_pred_arena import router as pred_arena_router
from app.api.routes_pred_leaderboard import router as pred_leaderboard_router

router = APIRouter(prefix="/api")
router.include_router(auth_router, tags=["auth"], prefix="/auth")
router.include_router(strategies_router, tags=["strategies"], prefix="/strategies")
router.include_router(backtests_router, tags=["backtests"], prefix="/backtests")
router.include_router(leaderboard_router, tags=["leaderboard"], prefix="/leaderboard")

# Predictive Arena V1 endpoints (public for V1)
router.include_router(pred_arena_router, tags=["arena"], prefix="/arena")
router.include_router(pred_leaderboard_router, tags=["arena-leaderboard"], prefix="/leaderboard")
router.include_router(pred_agents_router, tags=["agents"], prefix="/agents")
