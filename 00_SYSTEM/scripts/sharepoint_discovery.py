#!/usr/bin/env python3
"""
SharePoint Discovery Scanner — READ ONLY

What this does:
- Enumerates SharePoint sites, drives, folders, and columns via Microsoft Graph
- Cross-validates via SharePoint REST API
- Produces machine-readable inventory (inventory.json)
- Produces human-readable gap report (gaps.md)
- Produces suggested config patch (sharepoint_sources.suggested.yaml)

SAFE BY DESIGN:
- GET requests only (both Graph and REST)
- No writes to SharePoint
- No overwrites of existing config files
- Generates suggested config; does not apply it
"""

from __future__ import annotations

import argparse
import json
import logging
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional
from urllib.parse import quote

import msal
import requests
import yaml

# =============================
# Paths (repo-relative)
# =============================

REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT_DIR = REPO_ROOT / "09_INBOX" / "_sources" / "sharepoint" / "discovery"
CURRENT_CONFIG_PATH = REPO_ROOT / "00_SYSTEM" / "integrations" / "sharepoint" / "sharepoint_sources.yaml"
CURRENT_CONFIG_ALT = (
    REPO_ROOT / "09_INBOX" / "_sources" / "sharepoint" / "sharepoint_sources.yaml"
)

GRAPH_BASE = "https://graph.microsoft.com/v1.0"

# Expected SB_* columns from Stage 3.8 spec
EXPECTED_COLUMNS: Dict[str, str] = {
    "SB_Status": "Choice",
    "SB_RunID": "Text",
    "SB_TemplateVersion": "Text",
    "SB_GeneratedAt": "DateTime",
    "SB_GeneratedBy": "Text",
    "SB_ApprovedBy": "User",
    "SB_ApprovedAt": "DateTime",
    "SB_FinalizedAt": "DateTime",
    "SB_FinalFileRef": "Text",  # or URL — accept either
}

EXPECTED_SB_STATUS_VALUES = [
    "DRAFT",
    "READY_FOR_REVIEW",
    "APPROVED_FOR_FINAL",
    "FINALIZED",
    "PROMOTION_INCOMPLETE",
    "REJECTED",
]

EXPECTED_SUBFOLDERS = ["DRAFTS", "FINAL", "RUN_LOGS", "TEMPLATES"]

log = logging.getLogger(__name__)


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


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


# =============================
# Environment
# =============================


def require_env() -> tuple[str, str, str]:
    tenant = os.getenv("AZURE_TENANT_ID")
    client_id = os.getenv("AZURE_CLIENT_ID")
    client_secret = os.getenv("AZURE_CLIENT_SECRET")

    missing = [
        k
        for k, v in {
            "AZURE_TENANT_ID": tenant,
            "AZURE_CLIENT_ID": client_id,
            "AZURE_CLIENT_SECRET": client_secret,
        }.items()
        if not v
    ]

    if missing:
        raise RuntimeError(f"Missing environment variables: {missing}")

    return tenant, client_id, client_secret  # type: ignore[return-value]


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
        self._token: Optional[str] = None

    def token(self) -> str:
        if self._token:
            return self._token
        result = self.app.acquire_token_for_client(
            scopes=["https://graph.microsoft.com/.default"]
        )
        if "access_token" not in result:
            raise RuntimeError(f"Token failure: {result}")
        self._token = result["access_token"]
        return self._token

    def get(self, url: str, params: Optional[dict] = None) -> dict:
        headers = {"Authorization": f"Bearer {self.token()}"}
        r = requests.get(url, headers=headers, params=params, timeout=60)
        if r.status_code >= 400:
            log.warning("Graph error %d for %s: %s", r.status_code, url, r.text[:500])
            return {"error": {"code": r.status_code, "message": r.text[:500]}}
        return r.json()

    def paged_get(self, url: str, params: Optional[dict] = None) -> List[dict]:
        items: List[dict] = []
        while url:
            payload = self.get(url, params=params)
            if "error" in payload:
                break
            items.extend(payload.get("value", []))
            url = payload.get("@odata.nextLink")
            params = None
        return items


# =============================
# SharePoint REST Client
# =============================


class SPRestClient:
    """SharePoint REST API client reusing the same Graph token."""

    def __init__(self, graph_client: GraphClient, site_url: str):
        self.graph = graph_client
        # Normalize: https://tenant.sharepoint.com/sites/SiteName
        self.site_url = site_url.rstrip("/")

    def get(self, endpoint: str, params: Optional[dict] = None) -> dict:
        url = f"{self.site_url}/_api/{endpoint.lstrip('/')}"
        headers = {
            "Authorization": f"Bearer {self.graph.token()}",
            "Accept": "application/json;odata=nometadata",
        }
        r = requests.get(url, headers=headers, params=params, timeout=60)
        if r.status_code >= 400:
            log.warning("REST error %d for %s: %s", r.status_code, url, r.text[:500])
            return {"error": {"code": r.status_code, "message": r.text[:500]}}
        return r.json()


# =============================
# Graph Discovery Functions
# =============================


def discover_sites(graph: GraphClient, search_term: str = "Documentation") -> List[dict]:
    """Enumerate accessible SharePoint sites."""
    log.info("Discovering sites (search=%s)...", search_term)
    url = f"{GRAPH_BASE}/sites?search={quote(search_term)}"
    sites = graph.paged_get(url)

    if sites:
        log.info("Found %d site(s) via search", len(sites))
        return [
            {
                "id": s.get("id"),
                "displayName": s.get("displayName"),
                "webUrl": s.get("webUrl"),
                "hostname": s.get("siteCollection", {}).get("hostname"),
                "discovery_method": "search",
            }
            for s in sites
        ]

    # Fallback: resolve known site from config directly
    log.warning("Site search returned 0 results (may lack Sites.Read.All). Trying direct lookup...")
    current = load_current_config()
    cfg = current.get("content") or {}
    site_host = None
    site_path = None

    if "sharepoint" in cfg:
        # Format: "levinellp.sharepoint.com/sites/LegalMatters"
        site_str = cfg["sharepoint"].get("site", "")
        if "/" in site_str:
            parts = site_str.split("/", 1)
            site_host = parts[0]
            site_path = "/" + parts[1]
    elif "sources" in cfg and isinstance(cfg["sources"], list):
        for src in cfg["sources"]:
            if src.get("site_host"):
                site_host = src["site_host"]
                site_path = src.get("site_path", "")
                break

    if site_host and site_path:
        # GET /sites/{hostname}:{site_path}
        direct_url = f"{GRAPH_BASE}/sites/{site_host}:{site_path}"
        log.info("Direct site lookup: %s", direct_url)
        resp = graph.get(direct_url)
        if "error" not in resp and resp.get("id"):
            log.info("Direct lookup succeeded: %s", resp.get("displayName"))
            return [
                {
                    "id": resp.get("id"),
                    "displayName": resp.get("displayName"),
                    "webUrl": resp.get("webUrl"),
                    "hostname": resp.get("siteCollection", {}).get("hostname"),
                    "discovery_method": "direct_lookup",
                }
            ]
        else:
            log.warning("Direct site lookup also failed: %s", resp.get("error", resp))

    return []


def discover_drives_from_known_id(graph: GraphClient, drive_id: str) -> Optional[dict]:
    """Fallback: probe a known drive_id directly when site-level discovery fails."""
    log.info("Probing known drive_id directly: %s", drive_id)
    url = f"{GRAPH_BASE}/drives/{drive_id}"
    resp = graph.get(url)
    if "error" in resp:
        log.warning("Direct drive probe failed: %s", resp["error"])
        return None
    return {
        "id": resp.get("id"),
        "name": resp.get("name"),
        "driveType": resp.get("driveType"),
        "webUrl": resp.get("webUrl"),
        "description": resp.get("description", ""),
        "discovery_method": "direct_probe",
    }


def discover_drives(graph: GraphClient, site_id: str) -> List[dict]:
    """List all document libraries (drives) for a site."""
    log.info("Discovering drives for site %s...", site_id)
    url = f"{GRAPH_BASE}/sites/{site_id}/drives"
    drives = graph.paged_get(url)
    log.info("Found %d drive(s)", len(drives))
    return [
        {
            "id": d.get("id"),
            "name": d.get("name"),
            "driveType": d.get("driveType"),
            "webUrl": d.get("webUrl"),
            "description": d.get("description", ""),
        }
        for d in drives
    ]


def discover_root_children(graph: GraphClient, drive_id: str) -> List[dict]:
    """List root-level folders in a drive."""
    log.info("Listing root children for drive %s...", drive_id)
    url = f"{GRAPH_BASE}/drives/{drive_id}/root/children"
    items = graph.paged_get(url)
    return [
        {
            "name": i.get("name"),
            "type": "folder" if "folder" in i else "file",
            "id": i.get("id"),
            "webUrl": i.get("webUrl"),
            "childCount": i.get("folder", {}).get("childCount"),
        }
        for i in items
    ]


def discover_sb_execution(graph: GraphClient, drive_id: str) -> dict:
    """Check if SB Execution folder exists and enumerate subfolders."""
    log.info("Looking for SB Execution in drive %s...", drive_id)
    result: Dict[str, Any] = {
        "found": False,
        "drive_id": drive_id,
        "path": None,
        "subfolders": {sf: False for sf in EXPECTED_SUBFOLDERS},
        "subfolder_details": {},
    }

    # Try direct path lookup
    url = f"{GRAPH_BASE}/drives/{drive_id}/root:/SB Execution"
    resp = graph.get(url)
    if "error" in resp:
        log.info("SB Execution not found at drive root")
        return result

    result["found"] = True
    result["path"] = resp.get("webUrl", "")
    result["id"] = resp.get("id", "")
    log.info("Found SB Execution at %s", result["path"])

    # Enumerate children
    children_url = f"{GRAPH_BASE}/drives/{drive_id}/root:/SB Execution:/children"
    children = graph.paged_get(children_url)
    for child in children:
        name = child.get("name", "")
        if name in EXPECTED_SUBFOLDERS:
            result["subfolders"][name] = True
            result["subfolder_details"][name] = {
                "id": child.get("id"),
                "childCount": child.get("folder", {}).get("childCount"),
                "webUrl": child.get("webUrl"),
            }

    found = [k for k, v in result["subfolders"].items() if v]
    missing = [k for k, v in result["subfolders"].items() if not v]
    log.info("Subfolders found: %s | missing: %s", found, missing)

    return result


def discover_columns(graph: GraphClient, drive_id: str) -> dict:
    """Get column definitions from the library's underlying list."""
    log.info("Discovering columns for drive %s...", drive_id)
    url = f"{GRAPH_BASE}/drives/{drive_id}/list/columns"
    raw_columns = graph.paged_get(url)

    all_columns = []
    sb_columns: Dict[str, Any] = {}

    for col in raw_columns:
        name = col.get("name", "")
        col_info = {
            "name": name,
            "displayName": col.get("displayName", ""),
            "type": col.get("text", col.get("choice", col.get("dateTime", col.get("personOrGroup", {})))),
            "readOnly": col.get("readOnly", False),
            "hidden": col.get("hidden", False),
        }

        # Determine type string
        if col.get("choice"):
            col_info["type_name"] = "Choice"
            col_info["choices"] = col["choice"].get("choices", [])
        elif col.get("personOrGroup"):
            col_info["type_name"] = "User"
        elif col.get("dateTime"):
            col_info["type_name"] = "DateTime"
        elif col.get("text"):
            col_info["type_name"] = "Text"
        elif col.get("hyperlinkOrPicture"):
            col_info["type_name"] = "URL"
        elif col.get("boolean"):
            col_info["type_name"] = "Boolean"
        elif col.get("number"):
            col_info["type_name"] = "Number"
        elif col.get("lookup"):
            col_info["type_name"] = "Lookup"
        elif col.get("calculated"):
            col_info["type_name"] = "Calculated"
        else:
            col_info["type_name"] = "Unknown"

        all_columns.append(col_info)

        if name.startswith("SB_"):
            sb_columns[name] = col_info

    log.info(
        "Found %d total columns, %d SB_* columns", len(all_columns), len(sb_columns)
    )

    # Check against expected
    column_check: Dict[str, Any] = {}
    for col_name, expected_type in EXPECTED_COLUMNS.items():
        if col_name in sb_columns:
            actual_type = sb_columns[col_name].get("type_name", "Unknown")
            type_match = actual_type == expected_type
            # Accept URL as equivalent to Text for SB_FinalFileRef
            if col_name == "SB_FinalFileRef" and actual_type in ("Text", "URL"):
                type_match = True
            column_check[col_name] = {
                "found": True,
                "expected_type": expected_type,
                "actual_type": actual_type,
                "type_match": type_match,
            }
            # Check SB_Status choices
            if col_name == "SB_Status" and sb_columns[col_name].get("choices"):
                actual_choices = sb_columns[col_name]["choices"]
                missing_choices = [
                    v for v in EXPECTED_SB_STATUS_VALUES if v not in actual_choices
                ]
                extra_choices = [
                    v for v in actual_choices if v not in EXPECTED_SB_STATUS_VALUES
                ]
                column_check[col_name]["choices_ok"] = not missing_choices and not extra_choices
                column_check[col_name]["missing_choices"] = missing_choices
                column_check[col_name]["extra_choices"] = extra_choices
        else:
            column_check[col_name] = {
                "found": False,
                "expected_type": expected_type,
                "actual_type": None,
                "type_match": False,
            }

    return {
        "all_columns_count": len(all_columns),
        "sb_columns": sb_columns,
        "column_check": column_check,
    }


def discover_sample_item_metadata(graph: GraphClient, drive_id: str) -> Optional[dict]:
    """If DRAFTS has items, read one item's listItem fields to verify metadata round-trip."""
    log.info("Checking for sample item in DRAFTS...")
    url = f"{GRAPH_BASE}/drives/{drive_id}/root:/SB Execution/DRAFTS:/children"
    resp = graph.get(url, params={"$top": "1"})
    if "error" in resp:
        log.info("Cannot enumerate DRAFTS items")
        return None

    items = resp.get("value", [])
    if not items:
        log.info("DRAFTS is empty — no sample item to check")
        return None

    item = items[0]
    item_id = item.get("id")
    log.info("Reading metadata for sample item: %s", item.get("name"))

    fields_url = f"{GRAPH_BASE}/drives/{drive_id}/items/{item_id}/listItem?$expand=fields"
    fields_resp = graph.get(fields_url)
    if "error" in fields_resp:
        return {"error": "Could not read listItem fields", "item_name": item.get("name")}

    fields = fields_resp.get("fields", {})
    sb_fields = {k: v for k, v in fields.items() if k.startswith("SB_")}

    return {
        "item_name": item.get("name"),
        "item_id": item_id,
        "sb_fields_present": list(sb_fields.keys()),
        "sb_fields_values": sb_fields,
    }


# =============================
# SharePoint REST Validation
# =============================


def validate_libraries_via_rest(rest: SPRestClient) -> List[dict]:
    """List document libraries via REST and return summary."""
    log.info("REST: Listing document libraries...")
    resp = rest.get(
        "web/lists",
        params={
            "$filter": "BaseTemplate eq 101",
            "$select": "Title,Id,RootFolder/ServerRelativeUrl",
            "$expand": "RootFolder",
        },
    )
    if "error" in resp:
        log.warning("REST library enumeration failed: %s", resp["error"])
        return [{"error": resp["error"]}]

    libraries = []
    for lib in resp.get("value", []):
        libraries.append(
            {
                "title": lib.get("Title"),
                "id": lib.get("Id"),
                "rootFolder": lib.get("RootFolder", {}).get("ServerRelativeUrl"),
            }
        )
    log.info("REST: Found %d document libraries", len(libraries))
    return libraries


def validate_fields_via_rest(rest: SPRestClient, list_guid: str) -> List[dict]:
    """Get field definitions for a specific list via REST."""
    log.info("REST: Getting fields for list %s...", list_guid)
    resp = rest.get(
        f"web/lists(guid'{list_guid}')/fields",
        params={"$select": "InternalName,Title,TypeAsString"},
    )
    if "error" in resp:
        log.warning("REST field enumeration failed: %s", resp["error"])
        return [{"error": resp["error"]}]

    fields = []
    for f in resp.get("value", []):
        fields.append(
            {
                "internalName": f.get("InternalName"),
                "title": f.get("Title"),
                "type": f.get("TypeAsString"),
            }
        )
    return fields


# =============================
# Reconciliation + Output
# =============================


def load_current_config() -> dict:
    """Load existing sharepoint_sources.yaml for comparison."""
    for path in [CURRENT_CONFIG_PATH, CURRENT_CONFIG_ALT]:
        if path.exists():
            raw = yaml.safe_load(path.read_text())
            return {"path": str(path), "content": raw}
    return {"path": None, "content": None}


def build_inventory(
    sites: List[dict],
    drives_by_site: Dict[str, List[dict]],
    root_children_by_drive: Dict[str, List[dict]],
    sb_execution_by_drive: Dict[str, dict],
    columns_by_drive: Dict[str, dict],
    sample_items: Dict[str, Optional[dict]],
    rest_libraries: List[dict],
    rest_fields: Dict[str, List[dict]],
    current_config: dict,
) -> dict:
    """Assemble complete inventory."""
    return {
        "scan_timestamp": utc_now(),
        "scanner_version": "1.0",
        "sites": sites,
        "drives_by_site": drives_by_site,
        "root_children_by_drive": root_children_by_drive,
        "sb_execution": sb_execution_by_drive,
        "columns": columns_by_drive,
        "sample_item_metadata": sample_items,
        "rest_validation": {
            "libraries": rest_libraries,
            "fields_by_library": rest_fields,
        },
        "current_config": current_config,
    }


def generate_gaps_report(inventory: dict) -> str:
    """Generate human-readable gap report."""
    lines = [
        "# SharePoint Discovery — Gap Report",
        "",
        f"**Scan timestamp:** {inventory['scan_timestamp']}",
        "",
        "---",
        "",
    ]

    # Sites
    sites = inventory.get("sites", [])
    lines.append(f"## Sites Discovered: {len(sites)}")
    for s in sites:
        lines.append(f"- **{s.get('displayName')}** — `{s.get('webUrl')}`")
    lines.append("")

    # Drives
    lines.append("## Document Libraries (Drives)")
    for site_id, drives in inventory.get("drives_by_site", {}).items():
        lines.append(f"\n### Site: `{site_id}`")
        for d in drives:
            lines.append(f"- **{d.get('name')}** — `{d.get('id')}`")
    lines.append("")

    # SB Execution status
    lines.append("## SB Execution Folder Status")
    sb_data = inventory.get("sb_execution", {})
    if not sb_data:
        lines.append("- **Not scanned** — no drives found")
    else:
        for drive_id, sb in sb_data.items():
            lines.append(f"\n### Drive: `{drive_id}`")
            if not sb.get("found"):
                lines.append("- **SB Execution: NOT FOUND**")
            else:
                lines.append(f"- **SB Execution: FOUND** at `{sb.get('path')}`")
                lines.append("- Subfolders:")
                for sf in EXPECTED_SUBFOLDERS:
                    status = "PRESENT" if sb["subfolders"].get(sf) else "MISSING"
                    lines.append(f"  - {sf}: **{status}**")
    lines.append("")

    # Columns
    lines.append("## SB_* Column Status")
    cols_data = inventory.get("columns", {})
    for drive_id, col_info in cols_data.items():
        lines.append(f"\n### Drive: `{drive_id}`")
        check = col_info.get("column_check", {})
        if not check:
            lines.append("- No column check data")
            continue
        lines.append("")
        lines.append("| Column | Found | Expected Type | Actual Type | Type Match |")
        lines.append("|--------|:-----:|---------------|-------------|:----------:|")
        for col_name, info in check.items():
            found = "Yes" if info["found"] else "**NO**"
            expected = info["expected_type"]
            actual = info.get("actual_type") or "—"
            match = "Yes" if info["type_match"] else "**NO**"
            lines.append(f"| {col_name} | {found} | {expected} | {actual} | {match} |")
            if col_name == "SB_Status" and info.get("found"):
                if info.get("missing_choices"):
                    lines.append(
                        f"| | | Missing choices: {info['missing_choices']} | | |"
                    )
                if info.get("extra_choices"):
                    lines.append(
                        f"| | | Extra choices: {info['extra_choices']} | | |"
                    )
    lines.append("")

    # Config drift
    lines.append("## Config Drift Check")
    current = inventory.get("current_config", {})
    if not current.get("content"):
        lines.append("- No current config found to compare against")
    else:
        cfg = current["content"]
        cfg_drive_id = None
        if isinstance(cfg, dict):
            if "sharepoint" in cfg:
                cfg_drive_id = cfg["sharepoint"].get("drive_id")
            elif "sources" in cfg and isinstance(cfg["sources"], list):
                for src in cfg["sources"]:
                    if src.get("drive_id"):
                        cfg_drive_id = src["drive_id"]
                        break

        if cfg_drive_id:
            discovered_drives = []
            for drives in inventory.get("drives_by_site", {}).values():
                discovered_drives.extend([d["id"] for d in drives])
            if cfg_drive_id in discovered_drives:
                lines.append(f"- Config drive_id `{cfg_drive_id}` — **CONFIRMED** in discovery")
            else:
                lines.append(
                    f"- Config drive_id `{cfg_drive_id}` — **NOT FOUND** in discovered drives"
                )
                lines.append(f"- Discovered drives: {discovered_drives}")
        else:
            lines.append("- Could not extract drive_id from current config")
    lines.append("")

    # Sample metadata
    lines.append("## Sample Item Metadata Round-Trip")
    samples = inventory.get("sample_item_metadata", {})
    for drive_id, sample in samples.items():
        if sample is None:
            lines.append(f"- Drive `{drive_id}`: No DRAFTS items to sample")
        elif "error" in sample:
            lines.append(f"- Drive `{drive_id}`: **ERROR** — {sample['error']}")
        else:
            lines.append(f"- Drive `{drive_id}`: Item `{sample.get('item_name')}`")
            lines.append(f"  - SB fields present: {sample.get('sb_fields_present', [])}")
    lines.append("")

    # REST cross-validation
    lines.append("## REST API Cross-Validation")
    rest = inventory.get("rest_validation", {})
    rest_libs = rest.get("libraries", [])
    if rest_libs and "error" not in rest_libs[0]:
        lines.append(f"- REST found {len(rest_libs)} document libraries")
        for lib in rest_libs:
            lines.append(f"  - **{lib.get('title')}** — `{lib.get('rootFolder')}`")
    else:
        lines.append("- REST library enumeration failed or returned errors")
    lines.append("")

    lines.append("---")
    lines.append(f"*Generated by sharepoint_discovery.py at {utc_now()}*")
    lines.append("")

    return "\n".join(lines)


def generate_suggested_config(inventory: dict) -> str:
    """Generate suggested sharepoint_sources.yaml content."""
    entries = []

    for site in inventory.get("sites", []):
        site_id = site.get("id", "")
        site_url = site.get("webUrl", "")
        drives = inventory.get("drives_by_site", {}).get(site_id, [])

        for drive in drives:
            drive_id = drive.get("id", "")
            drive_name = drive.get("name", "")
            sb = inventory.get("sb_execution", {}).get(drive_id, {})

            entry = {
                "name": drive_name.lower().replace(" ", "_"),
                "site_url": site_url,
                "drive_id": drive_id,
                "drive_name": drive_name,
            }

            if sb.get("found"):
                entry["sb_execution"] = {
                    "root_path": "/SB Execution",
                    "subfolders_present": [
                        k for k, v in sb.get("subfolders", {}).items() if v
                    ],
                    "subfolders_missing": [
                        k for k, v in sb.get("subfolders", {}).items() if not v
                    ],
                }

            entries.append(entry)

    suggested = {
        "_generated_at": utc_now(),
        "_note": "Generated by sharepoint_discovery.py. Review before applying.",
        "sources": entries,
    }

    return yaml.dump(suggested, default_flow_style=False, sort_keys=False)


# =============================
# Main
# =============================


def run_discovery(dry_run: bool, output_dir: Path) -> None:
    """Execute the full discovery scan."""
    if dry_run:
        log.info("=== DRY RUN — no API calls will be made ===")
        log.info("Would query: GET %s/sites?search=LegalMatters", GRAPH_BASE)
        log.info("Would query: GET %s/sites/{site-id}/drives", GRAPH_BASE)
        log.info("Would query: GET %s/drives/{drive-id}/root/children", GRAPH_BASE)
        log.info("Would query: GET %s/drives/{drive-id}/root:/SB Execution", GRAPH_BASE)
        log.info("Would query: GET %s/drives/{drive-id}/root:/SB Execution:/children", GRAPH_BASE)
        log.info("Would query: GET %s/drives/{drive-id}/list/columns", GRAPH_BASE)
        log.info("Would query: GET %s/drives/{drive-id}/root:/SB Execution/DRAFTS:/children", GRAPH_BASE)
        log.info("Would query: REST GET _api/web/lists?$filter=BaseTemplate eq 101")
        log.info("Would query: REST GET _api/web/lists(guid'{id}')/fields")
        log.info("Output would be written to: %s", output_dir)
        return

    # === Auth ===
    tenant, client_id, client_secret = require_env()
    graph = GraphClient(tenant, client_id, client_secret)

    # === Step 1: Graph discovery ===
    sites = discover_sites(graph)
    if not sites:
        log.warning("No sites found via search or direct lookup.")

    drives_by_site: Dict[str, List[dict]] = {}
    root_children_by_drive: Dict[str, List[dict]] = {}
    sb_execution_by_drive: Dict[str, dict] = {}
    columns_by_drive: Dict[str, dict] = {}
    sample_items: Dict[str, Optional[dict]] = {}

    # Collect all drive IDs to scan (from site enumeration + known config)
    all_drives: List[dict] = []

    for site in sites:
        site_id = site["id"]
        drives = discover_drives(graph, site_id)
        drives_by_site[site_id] = drives
        all_drives.extend(drives)

    # Fallback: if no drives found via sites, probe known drive_id from config
    if not all_drives:
        current = load_current_config()
        cfg = current.get("content") or {}
        known_drive_id = None
        if "sharepoint" in cfg:
            known_drive_id = cfg["sharepoint"].get("drive_id")
        elif "sources" in cfg and isinstance(cfg["sources"], list):
            for src in cfg["sources"]:
                if src.get("drive_id"):
                    known_drive_id = src["drive_id"]
                    break

        if known_drive_id:
            probe = discover_drives_from_known_id(graph, known_drive_id)
            if probe:
                all_drives.append(probe)
                drives_by_site["_direct_probe"] = [probe]

    for drive in all_drives:
        drive_id = drive["id"]

        # Root children
        root_children_by_drive[drive_id] = discover_root_children(graph, drive_id)

        # SB Execution check
        sb = discover_sb_execution(graph, drive_id)
        sb_execution_by_drive[drive_id] = sb

        # Columns
        columns_by_drive[drive_id] = discover_columns(graph, drive_id)

        # Sample item metadata (only if SB Execution/DRAFTS exists)
        if sb.get("found") and sb.get("subfolders", {}).get("DRAFTS"):
            sample_items[drive_id] = discover_sample_item_metadata(graph, drive_id)
        else:
            sample_items[drive_id] = None

    # === Step 2: REST validation ===
    rest_libraries: List[dict] = []
    rest_fields: Dict[str, List[dict]] = {}

    # Build site URL from discovered site or config
    site_url = ""
    if sites:
        site_url = sites[0].get("webUrl", "")
    else:
        # Fall back to config
        current = load_current_config()
        cfg = current.get("content") or {}
        if "sharepoint" in cfg:
            site_str = cfg["sharepoint"].get("site", "")
            if site_str:
                site_url = f"https://{site_str}"

    if site_url:
        rest = SPRestClient(graph, site_url)
        rest_libraries = validate_libraries_via_rest(rest)

        # Get fields for each library found via REST
        for lib in rest_libraries:
            if "error" not in lib and lib.get("id"):
                fields = validate_fields_via_rest(rest, lib["id"])
                rest_fields[lib["id"]] = fields

    # === Step 3: Load current config for comparison ===
    current_config = load_current_config()

    # === Step 4: Build inventory and generate outputs ===
    inventory = build_inventory(
        sites=sites,
        drives_by_site=drives_by_site,
        root_children_by_drive=root_children_by_drive,
        sb_execution_by_drive=sb_execution_by_drive,
        columns_by_drive=columns_by_drive,
        sample_items=sample_items,
        rest_libraries=rest_libraries,
        rest_fields=rest_fields,
        current_config=current_config,
    )

    # Write outputs
    write_json(output_dir / "inventory.json", inventory)
    log.info("Wrote inventory.json")

    gaps = generate_gaps_report(inventory)
    write_text(output_dir / "gaps.md", gaps)
    log.info("Wrote gaps.md")

    suggested = generate_suggested_config(inventory)
    write_text(output_dir / "sharepoint_sources.suggested.yaml", suggested)
    log.info("Wrote sharepoint_sources.suggested.yaml")

    # Summary
    log.info("=== Discovery complete ===")
    log.info("Sites: %d", len(sites))
    total_drives = sum(len(d) for d in drives_by_site.values())
    log.info("Drives: %d", total_drives)
    sb_found = [did for did, sb in sb_execution_by_drive.items() if sb.get("found")]
    log.info("SB Execution found in: %s", sb_found if sb_found else "NONE")
    log.info("Outputs at: %s", output_dir)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="SharePoint Discovery Scanner — enumerates sites, drives, folders, columns",
    )
    parser.add_argument(
        "--verbose", action="store_true", help="Enable DEBUG logging"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show planned API calls without executing",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=DEFAULT_OUTPUT_DIR,
        help=f"Output directory (default: {DEFAULT_OUTPUT_DIR})",
    )
    args = parser.parse_args()

    setup_logging(args.verbose)
    run_discovery(dry_run=args.dry_run, output_dir=args.output_dir)


if __name__ == "__main__":
    main()
