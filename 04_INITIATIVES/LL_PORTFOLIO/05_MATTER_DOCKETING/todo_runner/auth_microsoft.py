"""Microsoft OAuth2 — Outlook / Graph API.

Stage 2.9  Reads Azure AD app registration credentials from .env.
First run opens a browser for consent; token is cached locally via MSAL.
"""

from __future__ import annotations

import json
import os
from pathlib import Path

import msal


def _scopes() -> list[str]:
    raw = os.environ.get("MICROSOFT_SCOPES", "").strip()
    scopes = raw.split()
    if not scopes:
        raise RuntimeError("MICROSOFT_SCOPES is empty. Set it in .env.")
    return scopes


def _load_cache(cache_path: Path) -> msal.SerializableTokenCache:
    cache = msal.SerializableTokenCache()
    if cache_path.exists():
        cache.deserialize(cache_path.read_text(encoding="utf-8"))
    return cache


def _save_cache(cache: msal.SerializableTokenCache, cache_path: Path) -> None:
    if cache.has_state_changed:
        cache_path.parent.mkdir(parents=True, exist_ok=True)
        cache_path.write_text(cache.serialize(), encoding="utf-8")


def get_ms_token() -> str:
    """Return a valid Microsoft Graph access token (string).

    Uses device-code flow on first run, then caches the refresh token.
    """
    client_id = os.environ.get("MICROSOFT_CLIENT_ID")
    authority = os.environ.get(
        "MICROSOFT_AUTHORITY", "https://login.microsoftonline.com/common"
    )
    token_cache_path = os.environ.get("MICROSOFT_TOKEN_PATH")

    if not client_id:
        raise RuntimeError("MICROSOFT_CLIENT_ID not set in env.")
    if not token_cache_path:
        raise RuntimeError("MICROSOFT_TOKEN_PATH not set in env.")

    cache_path = Path(token_cache_path).expanduser()
    cache = _load_cache(cache_path)

    scopes = _scopes()

    app = msal.PublicClientApplication(
        client_id, authority=authority, token_cache=cache
    )

    # Try silent acquisition first (cached refresh token)
    accounts = app.get_accounts()
    if accounts:
        result = app.acquire_token_silent(scopes, account=accounts[0])
        if result and "access_token" in result:
            _save_cache(cache, cache_path)
            return result["access_token"]

    # Interactive: device-code flow (works in headless / SSH environments too)
    flow = app.initiate_device_flow(scopes=scopes)
    if "user_code" not in flow:
        raise RuntimeError(f"Device flow initiation failed: {flow}")

    print(flow["message"])  # Tells user to visit URL and enter code
    result = app.acquire_token_by_device_flow(flow)

    if "access_token" not in result:
        raise RuntimeError(
            f"Microsoft auth failed: {result.get('error_description', result)}"
        )

    _save_cache(cache, cache_path)
    return result["access_token"]
