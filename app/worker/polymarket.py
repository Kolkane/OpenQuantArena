from __future__ import annotations

from datetime import datetime
from typing import Any

import httpx

GAMMA_BASE = "https://gamma-api.polymarket.com"


async def fetch_markets(limit: int = 40) -> list[dict[str, Any]]:
    """Fetch a broad set of Polymarket markets (read-only).

    This uses the public Gamma API (no key). Schema can change; we only rely on a few fields.
    """

    params = {
        "active": "true",
        "closed": "false",
        "archived": "false",
        "limit": str(max(1, min(limit, 200))),
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        r = await client.get(f"{GAMMA_BASE}/markets", params=params)
        r.raise_for_status()
        data = r.json()

    # Gamma returns list[dict]
    markets: list[dict[str, Any]] = []
    for m in (data or []):
        mid = m.get("id") or m.get("conditionId") or m.get("condition_id")
        q = m.get("question") or m.get("title") or ""
        close_time = m.get("endDate") or m.get("end_date") or m.get("closeTime")
        url = m.get("url") or m.get("marketUrl")
        markets.append(
            {
                "id": str(mid),
                "question": str(q),
                "close_time": close_time,
                "url": url,
                "source": "polymarket",
            }
        )

    return markets


def extract_resolved_outcomes(markets: list[dict[str, Any]]) -> dict[str, int]:
    """Try to extract resolved outcomes from markets list.

    Returns {market_id: 0|1}.

    Note: Polymarket schemas vary. We keep this conservative.
    """

    out: dict[str, int] = {}
    for m in markets:
        mid = str(m.get("id"))
        # Attempt common fields
        resolved = m.get("resolved") or m.get("isResolved") or m.get("is_resolved")
        if resolved is not True:
            continue

        # outcome can be boolean-like or "YES"/"NO"
        outcome = m.get("outcome") or m.get("resolvedOutcome") or m.get("resolved_outcome")
        if isinstance(outcome, bool):
            out[mid] = 1 if outcome else 0
        elif isinstance(outcome, (int, float)):
            out[mid] = 1 if float(outcome) >= 0.5 else 0
        elif isinstance(outcome, str):
            o = outcome.strip().lower()
            if o in {"yes", "true", "1"}:
                out[mid] = 1
            elif o in {"no", "false", "0"}:
                out[mid] = 0

    return out
