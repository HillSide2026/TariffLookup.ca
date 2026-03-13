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

REPO_ROOT = Path(__file__).resolve().parents[2]
CONFIG_PATH = REPO_ROOT / "00_SYSTEM" / "integrations" / "sharepoint" / "sharepoint_sources.yaml"

SOURCES_DIR = REPO_ROOT / "09_INBOX" / "_sources" / "sharepoint"
STATE_DIR = SOURCES_DIR / "state"
AUDIT_DIR = SOURCES_DIR / "audit"
GRAPH_BASE = "https://graph.microsoft.com/v1.0"


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
class DriveSpec:
    name: str
    site: str
    drive_id: str
    intake_paths: List[str]


@dataclass
class SharePointConfig:
    drives: List[DriveSpec]


def _slugify(value: str) -> str:
    out = []
    for ch in value.lower():
        if ch.isalnum():
            out.append(ch)
        else:
            out.append("_")
    slug = "".join(out).strip("_")
    return slug or "drive"


def _normalize_intake_paths(paths: List[str]) -> List[str]:
    return [p.lstrip("/") for p in paths]


def load_config(path: Path) -> SharePointConfig:
    if not path.exists():
        raise FileNotFoundError(f"Missing config: {path}")

    raw = yaml.safe_load(path.read_text())
    if not isinstance(raw, dict):
        raise ValueError("sharepoint_sources.yaml must be a mapping")

    cfg = raw.get("sharepoint", raw)

    drives: List[DriveSpec] = []

    if isinstance(cfg.get("drives"), list) and cfg["drives"]:
        for entry in cfg["drives"]:
            if not isinstance(entry, dict):
                continue
            drive_id = entry.get("drive_id")
            intake_paths = entry.get("intake_paths")
            if not drive_id or not isinstance(intake_paths, list) or not intake_paths:
                raise ValueError("Each drive must include drive_id and non-empty intake_paths")
            name = str(entry.get("name") or entry.get("label") or drive_id)
            site = str(entry.get("site", ""))
            drives.append(
                DriveSpec(
                    name=name,
                    site=site,
                    drive_id=drive_id,
                    intake_paths=_normalize_intake_paths(intake_paths),
                )
            )
    else:
        # Backward-compatible single-drive config
        drive_id = cfg.get("drive_id")
        intake_paths = cfg.get("intake_paths")
        if not drive_id:
            raise ValueError("Missing drive_id in sharepoint_sources.yaml")
        if not isinstance(intake_paths, list) or not intake_paths:
            raise ValueError("intake_paths must be a non-empty list")
        drives.append(
            DriveSpec(
                name=str(cfg.get("name") or cfg.get("site") or drive_id),
                site=str(cfg.get("site", "")),
                drive_id=drive_id,
                intake_paths=_normalize_intake_paths(intake_paths),
            )
        )

    return SharePointConfig(drives=drives)


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


# =============================
# Delta + Metadata Scan
# =============================


def load_state(path: Path) -> Dict[str, Any]:
    if path.exists():
        try:
            return json.loads(path.read_text())
        except Exception:
            return {}
    return {}


def save_state(path: Path, data: Dict[str, Any]) -> None:
    write_json(path, data)


def delta_scan_path(
    graph: GraphClient,
    drive_id: str,
    intake_path: str,
    delta_link: Optional[str],
    select_fields: str,
) -> tuple[List[dict], Optional[str]]:
    url = delta_link or f"{GRAPH_BASE}/drives/{drive_id}/root:/{intake_path}:/delta"
    params = {"$select": select_fields}

    items: List[dict] = []
    latest_delta = None

    while url:
        payload = graph.get(url, params=params)
        items.extend(payload.get("value", []))
        latest_delta = payload.get("@odata.deltaLink", latest_delta)
        url = payload.get("@odata.nextLink")
        params = None

    return items, latest_delta


def normalize_item(drive_id: str, item: dict) -> dict:
    parent_path = item.get("parentReference", {}).get("path", "")
    if ":" in parent_path:
        parent_path = parent_path.split(":", 1)[1]
    parent_path = parent_path.lstrip("/")
    name = item.get("name", "")
    full_path = "/".join([p for p in [parent_path, name] if p])

    return {
        "id": item.get("id"),
        "name": name,
        "path": full_path,
        "size_bytes": item.get("size", 0),
        "last_modified": item.get("lastModifiedDateTime", ""),
        "web_url": item.get("webUrl", ""),
        "is_folder": bool(item.get("folder")),
        "is_file": bool(item.get("file")),
        "drive_id": drive_id,
        "removed": bool(item.get("@removed")),
    }


def scan_intake_paths(
    graph: GraphClient,
    drive_id: str,
    intake_paths: List[str],
    max_bytes: int,
    use_delta: bool,
    state: Dict[str, Any],
) -> Dict[str, Any]:
    select_fields = "id,name,size,lastModifiedDateTime,webUrl,file,folder,parentReference"

    delta_links = state.get("delta_links", {}) if isinstance(state.get("delta_links"), dict) else {}

    all_items: List[dict] = []
    removed_items: List[dict] = []
    skipped_large: List[dict] = []

    for path in intake_paths:
        prev_delta = delta_links.get(path) if use_delta else None
        items, new_delta = delta_scan_path(graph, drive_id, path, prev_delta, select_fields)
        if new_delta:
            delta_links[path] = new_delta

        for raw in items:
            meta = normalize_item(drive_id, raw)
            if meta["removed"]:
                removed_items.append(meta)
                continue

            if meta["size_bytes"] and meta["size_bytes"] > max_bytes:
                meta["skipped_reason"] = f"size_cap:{max_bytes}"
                skipped_large.append(meta)
                continue

            all_items.append(meta)

    return {
        "items": all_items,
        "removed": removed_items,
        "skipped_large": skipped_large,
        "delta_links": delta_links,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="SharePoint Integration — metadata-only delta scan")
    parser.add_argument("--dry-run", action="store_true", help="Log intent without API calls")
    parser.add_argument("--max-mb", type=int, default=10, help="Skip files larger than this size (MB)")
    parser.add_argument("--no-delta", action="store_true", help="Disable delta sync (full metadata scan)")
    args = parser.parse_args()

    setup_logging(verbose=False)
    cfg = load_config(CONFIG_PATH)

    if args.dry_run:
        for drive in cfg.drives:
            logging.info("[DRY RUN] Would scan drive %s (%s) paths: %s",
                         drive.name, drive.drive_id, drive.intake_paths)
        return 0

    tenant, client_id, client_secret = require_env()
    graph = GraphClient(tenant, client_id, client_secret)

    totals = {"items": 0, "removed": 0, "skipped_large": 0}
    for drive in cfg.drives:
        drive_key = _slugify(drive.name)
        state_file = STATE_DIR / f"{drive_key}.json"
        state = load_state(state_file)
        scan = scan_intake_paths(
            graph,
            drive.drive_id,
            drive.intake_paths,
            max_bytes=args.max_mb * 1024 * 1024,
            use_delta=not args.no_delta,
            state=state,
        )

        output = {
            "run_at": utc_now(),
            "drive_name": drive.name,
            "drive_id": drive.drive_id,
            "site": drive.site,
            "intake_paths": drive.intake_paths,
            "max_mb": args.max_mb,
            "delta_enabled": not args.no_delta,
            "counts": {
                "items": len(scan["items"]),
                "removed": len(scan["removed"]),
                "skipped_large": len(scan["skipped_large"]),
            },
            "items": scan["items"],
            "removed": scan["removed"],
            "skipped_large": scan["skipped_large"],
            "delta_links": scan["delta_links"],
        }

        save_state(state_file, output)
        audit_file = AUDIT_DIR / f"sharepoint_scan_{drive_key}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        write_json(audit_file, output["counts"])

        logging.info("Scan complete (%s). Items: %d, Removed: %d, Skipped (large): %d",
                     drive.name,
                     output["counts"]["items"],
                     output["counts"]["removed"],
                     output["counts"]["skipped_large"])

        totals["items"] += output["counts"]["items"]
        totals["removed"] += output["counts"]["removed"]
        totals["skipped_large"] += output["counts"]["skipped_large"]

    logging.info("All drives complete. Items: %d, Removed: %d, Skipped (large): %d",
                 totals["items"], totals["removed"], totals["skipped_large"])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
