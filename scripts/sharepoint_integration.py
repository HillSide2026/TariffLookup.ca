#!/usr/bin/env python3
"""
SharePoint Integration (Stage 2.2.2) — READ ONLY

What this does:
- Loads + validates sharepoint_sources.yaml
- Validates Azure env vars
- Acquires Microsoft Graph token (client credentials)
- Enumerates SharePoint drive folders (metadata only)
- Writes audit logs
- Writes state (unless --dry-run)

SAFE BY DESIGN:
- GET requests only
- No write operations
"""

from __future__ import annotations

import argparse
import json
import logging
import os
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

import requests
import yaml
import msal


# =============================
# Paths (repo-relative)
# =============================

REPO_ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = REPO_ROOT / "sharepoint_sources.yaml"

SOURCES_DIR = REPO_ROOT / "09_INBOX" / "_sources" / "sharepoint"
STATE_DIR = SOURCES_DIR / "state"
AUDIT_DIR = SOURCES_DIR / "audit"
STATE_FILE = STATE_DIR / "legalmatters_library.json"


# =============================
# Helpers
# =============================

def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def setup_logging(verbose: bool) -> None:
    logging.basicConfig(
        level=logging.DEBUG if verbose else logging.INFO,
        format="%(asctime)sZ [%(levelname)s] %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%S",
    )


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")


# =============================
# Config
# =============================

@dataclass
class SharePointConfig:
    site: str
    drive_id: str
    intake_paths: List[str]


def load_config(path: Path) -> SharePointConfig:
    if not path.exists():
        raise FileNotFoundError(f"Missing config: {path}")

    raw = yaml.safe_load(path.read_text())
    if not isinstance(raw, dict):
        raise ValueError("sharepoint_sources.yaml must be a mapping")

    cfg = raw.get("sharepoint", raw)

    drive_id = cfg.get("drive_id")
    intake_paths = cfg.get("intake_paths")

    if not drive_id:
        raise ValueError("Missing drive_id in sharepoint_sources.yaml")
    if not isinstance(intake_paths, list) or not intake_paths:
        raise ValueError("intake_paths must be a non-empty list")

    intake_paths = [p.lstrip("/") for p in intake_paths]

    return SharePointConfig(
        site=str(cfg.get("site", "")),
        drive_id=drive_id,
        intake_paths=intake_paths,
    )


# =============================
# Environment
# =============================

def require_env() -> tuple[str, str, str]:
    tenant = os.getenv("AZURE_TENANT_ID")
    client_id = os.getenv("AZURE_CLIENT_ID")
    client_secret = os.getenv("AZURE_CLIENT_SECRET")

    missing = [k for k, v in {
        "AZURE_TENANT_ID": tenant,
        "AZURE_CLIENT_ID": client_id,
        "AZURE_CLIENT_SECRET": client_secret,
    }.items() if not v]

    if missing:
        raise RuntimeError(f"Missing environment variables: {missing}")

    return tenant, client_id, client_secret


# =============================
# Graph Client
# =============================

class GraphClient:
    def __init__(self, tenant: str, client_id: str, client_secret: str):
        self.app = msal.ConfidentialClientApplication(
            client_id=client_id,
            authority=f"https://login.microsoftonline.com/{tenant}",
            client_credential=client_secret,
        )

    def token(self) -> str:
        result = self.app.acquire_token_for_client(
            scopes=["https://graph.microsoft.com/.default"]
        )
        if "access_token" not in result:
            raise RuntimeError(f"Token failure: {result}")
        return result["access_token"]

    def get(self, url: str, params: Optional[dict] = None) -> dict:
        headers = {"Authorization": f"Bearer {self.token()}"}
        r = requests.get(url, headers=headers, params=params, timeout=60)
        if r.status_code >= 400:
            raise RuntimeError(f"Graph error {r.status_code}: {r.text}")
        return r.json()

    def paged_get(self, url: str, params: Optional[dict] = None) -> List[dict]:
        items: List[dict] = []
        while url:
            payload = self.get(url, params=params)
            items.extend(payload.get("value", []))
            url = payload.get("@odata.nextLink")
            params = None
        return items
