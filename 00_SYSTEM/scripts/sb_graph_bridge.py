#!/usr/bin/env python3
"""
SB Graph Bridge — SharePoint Execution Bridge

Validates a bridge request JSON against schema, runs QA gate checks,
verifies preconditions via Microsoft Graph, and executes the action.

Usage:
    python sb_graph_bridge.py schema.json request.json [--dry-run] [--verbose]

Actions:
    generate_draft  — Copy template to DRAFTS, set SB_* metadata fields,
                      write run log to RUN_LOGS.

Phases:
  1. Schema validation
  2. Cross-field consistency
  3. QA gate
  4. Template registry validation (offline)
  5. Authentication
  6. Precondition checks (Graph)
  7. Content control validation (template introspection)
  8. Execute

SAFE BY DESIGN:
- Validates request before any API call
- QA gate must pass before execution
- Template must exist in registry with matching version
- Content controls validated against live template
- Verifies target folders exist before writing
- Checks for duplicate RunID (write-once rule)
- Logs every operation to RUN_LOGS
- --dry-run validates phases 1-4 without Graph API calls
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

import xml.etree.ElementTree as ET
import zipfile

import msal
import requests

log = logging.getLogger(__name__)

GRAPH_BASE = "https://graph.microsoft.com/v1.0"
REPO_ROOT = Path(__file__).resolve().parents[1]
TEMPLATE_REGISTRY_PATH = REPO_ROOT / "02_PLAYBOOKS" / "EXECUTION" / "TEMPLATE_REGISTRY.json"

WORD_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"


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

    def _headers(self) -> dict:
        return {"Authorization": f"Bearer {self.token()}"}

    def get(self, url: str, params: Optional[dict] = None) -> dict:
        r = requests.get(url, headers=self._headers(), params=params, timeout=60)
        if r.status_code >= 400:
            log.warning("Graph GET %d: %s — %s", r.status_code, url, r.text[:500])
            return {"error": {"code": r.status_code, "message": r.text[:500]}}
        return r.json()

    def get_raw(self, url: str) -> requests.Response:
        """GET returning raw response (for binary content like .docx)."""
        r = requests.get(url, headers=self._headers(), timeout=120, allow_redirects=True)
        return r

    def put(self, url: str, data: bytes, content_type: str = "application/octet-stream") -> dict:
        headers = {**self._headers(), "Content-Type": content_type}
        r = requests.put(url, headers=headers, data=data, timeout=120)
        if r.status_code >= 400:
            log.warning("Graph PUT %d: %s — %s", r.status_code, url, r.text[:500])
            return {"error": {"code": r.status_code, "message": r.text[:500]}}
        return r.json()

    def patch(self, url: str, json_body: dict) -> dict:
        headers = {**self._headers(), "Content-Type": "application/json"}
        r = requests.patch(url, headers=headers, json=json_body, timeout=60)
        if r.status_code >= 400:
            log.warning("Graph PATCH %d: %s — %s", r.status_code, url, r.text[:500])
            return {"error": {"code": r.status_code, "message": r.text[:500]}}
        return r.json()


# =============================
# Schema Validation
# =============================


def validate_request(request: dict, schema: dict) -> List[str]:
    """Validate request against schema. Returns list of error strings."""
    errors: List[str] = []

    # Try jsonschema if available
    try:
        import jsonschema
        validator = jsonschema.Draft202012Validator(schema)
        for err in sorted(validator.iter_errors(request), key=lambda e: list(e.path)):
            path = ".".join(str(p) for p in err.path) or "(root)"
            errors.append(f"Schema: {path} — {err.message}")
        return errors
    except ImportError:
        log.info("jsonschema not installed; falling back to manual validation")

    # Manual validation fallback
    import re

    RUN_ID_RE = re.compile(r"^RUN-[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{3}$")
    FILENAME_RE = re.compile(r"^[0-9]{4}-[0-9]{2}-[0-9]{2}__RUN-.*__DRAFT\.docx$")
    VERSION_RE = re.compile(r"^[0-9]+\.[0-9]+$")
    ALLOWED_SB_STATUS = [
        "DRAFT", "READY_FOR_REVIEW", "APPROVED_FOR_FINAL",
        "FINALIZED", "PROMOTION_INCOMPLETE", "REJECTED",
    ]

    # Top-level: required keys and no extras
    required_top = ["action", "run_id", "template", "output", "fields", "metadata", "qa"]
    for key in required_top:
        if key not in request:
            errors.append(f"Missing required key: {key}")
    extra_top = set(request.keys()) - set(required_top)
    if extra_top:
        errors.append(f"Extra top-level keys not allowed: {sorted(extra_top)}")

    # action
    if request.get("action") not in ("generate_draft",):
        errors.append(f"Invalid action: {request.get('action')}")

    # run_id pattern
    run_id = request.get("run_id", "")
    if not run_id or not RUN_ID_RE.match(run_id):
        errors.append(f"run_id must match RUN-YYYY-MM-DD-NNN, got '{run_id}'")

    # Template
    tmpl = request.get("template", {})
    if not tmpl.get("file_id"):
        errors.append("template.file_id is required")
    if not tmpl.get("version"):
        errors.append("template.version is required")
    elif not VERSION_RE.match(tmpl["version"]):
        errors.append(f"template.version must match MAJOR.MINOR, got '{tmpl['version']}'")
    allowed_tmpl_keys = {"file_id", "folder", "version"}
    extra_tmpl = set(tmpl.keys()) - allowed_tmpl_keys
    if extra_tmpl:
        errors.append(f"Extra template keys not allowed: {sorted(extra_tmpl)}")

    # Output
    out = request.get("output", {})
    if not out.get("folder"):
        errors.append("output.folder is required")
    if not out.get("filename"):
        errors.append("output.filename is required")
    elif not FILENAME_RE.match(out["filename"]):
        errors.append(f"output.filename must match YYYY-MM-DD__RUN-*__DRAFT.docx, got '{out['filename']}'")
    if not out.get("drive_id"):
        errors.append("output.drive_id is required")
    if out.get("overwrite") is not False:
        errors.append("output.overwrite must be false (write-once rule)")
    allowed_out_keys = {"folder", "folder_path", "filename", "drive_id", "overwrite"}
    extra_out = set(out.keys()) - allowed_out_keys
    if extra_out:
        errors.append(f"Extra output keys not allowed: {sorted(extra_out)}")

    # Fields
    fields = request.get("fields", {})
    for req_field in ["SB_Status", "SB_RunID", "SB_TemplateVersion", "SB_GeneratedAt", "SB_GeneratedBy"]:
        if not fields.get(req_field):
            errors.append(f"fields.{req_field} is required")
    if fields.get("SB_GeneratedBy") != "ML2":
        errors.append("fields.SB_GeneratedBy must be 'ML2'")
    if fields.get("SB_Status") and fields["SB_Status"] not in ALLOWED_SB_STATUS:
        errors.append(f"fields.SB_Status invalid value: '{fields['SB_Status']}'")
    allowed_field_keys = {
        "SB_Status", "SB_RunID", "SB_TemplateVersion", "SB_GeneratedAt",
        "SB_GeneratedBy", "SB_ApprovedBy", "SB_ApprovedAt", "SB_FinalizedAt", "SB_FinalFileRef",
    }
    extra_fields = set(fields.keys()) - allowed_field_keys
    if extra_fields:
        errors.append(f"Extra field keys not allowed: {sorted(extra_fields)}")

    # Metadata
    meta = request.get("metadata", {})
    if not meta.get("drive_id"):
        errors.append("metadata.drive_id is required")
    if not meta.get("execution_root_id"):
        errors.append("metadata.execution_root_id is required")
    if meta.get("lifecycle_state") != "GENERATED":
        errors.append("metadata.lifecycle_state must be 'GENERATED'")
    if meta.get("authority") != "ML1":
        errors.append("metadata.authority must be 'ML1'")
    if meta.get("executor") != "ML2":
        errors.append("metadata.executor must be 'ML2'")
    if meta.get("write_boundary") != "SB Execution/":
        errors.append(f"metadata.write_boundary must be 'SB Execution/', got '{meta.get('write_boundary')}'")
    allowed_meta_keys = {
        "drive_id", "execution_root_id", "target_folders",
        "lifecycle_state", "authority", "executor", "write_boundary",
    }
    extra_meta = set(meta.keys()) - allowed_meta_keys
    if extra_meta:
        errors.append(f"Extra metadata keys not allowed: {sorted(extra_meta)}")
    # target_folders
    tf = meta.get("target_folders", {})
    for tf_key in ["drafts_id", "final_id", "run_logs_id", "templates_id"]:
        if not tf.get(tf_key):
            errors.append(f"metadata.target_folders.{tf_key} is required")
    extra_tf = set(tf.keys()) - {"drafts_id", "final_id", "run_logs_id", "templates_id"}
    if extra_tf:
        errors.append(f"Extra target_folders keys not allowed: {sorted(extra_tf)}")

    # QA gate
    qa = request.get("qa", {})
    if qa.get("required") is not True:
        errors.append("qa.required must be true")
    if qa.get("result") != "PASS":
        errors.append("qa.result must be 'PASS'")

    return errors


# =============================
# Cross-Field Consistency
# =============================


def check_consistency(request: dict) -> List[str]:
    """Validate cross-field consistency rules."""
    errors: List[str] = []

    run_id = request.get("run_id", "")
    fields = request.get("fields", {})
    tmpl = request.get("template", {})
    out = request.get("output", {})
    meta = request.get("metadata", {})
    qa = request.get("qa", {})

    # run_id must match fields.SB_RunID
    if fields.get("SB_RunID") != run_id:
        errors.append(f"fields.SB_RunID ({fields.get('SB_RunID')}) != run_id ({run_id})")

    # run_id must appear in output filename
    filename = out.get("filename", "")
    if run_id and run_id not in filename:
        errors.append(f"output.filename does not contain run_id ({run_id})")

    # template.version must match fields.SB_TemplateVersion
    if fields.get("SB_TemplateVersion") != tmpl.get("version"):
        errors.append(
            f"fields.SB_TemplateVersion ({fields.get('SB_TemplateVersion')}) "
            f"!= template.version ({tmpl.get('version')})"
        )

    # output.drive_id must match metadata.drive_id
    if out.get("drive_id") != meta.get("drive_id"):
        errors.append(
            f"output.drive_id ({out.get('drive_id')}) != metadata.drive_id ({meta.get('drive_id')})"
        )

    # output.folder must match metadata.target_folders.drafts_id
    drafts_id = meta.get("target_folders", {}).get("drafts_id")
    if out.get("folder") != drafts_id:
        errors.append(
            f"output.folder ({out.get('folder')}) != metadata.target_folders.drafts_id ({drafts_id})"
        )

    # template.file_id should reference templates folder
    templates_id = meta.get("target_folders", {}).get("templates_id")
    if tmpl.get("file_id") == templates_id:
        # This means file_id IS the folder, not a file within it — may be intentional
        # if template hasn't been uploaded yet. Log but don't error.
        log.info("template.file_id matches templates_id (folder ID, not file ID)")

    # SB_Status must be DRAFT on generation
    if fields.get("SB_Status") != "DRAFT":
        errors.append(f"fields.SB_Status must be 'DRAFT' on generation, got '{fields.get('SB_Status')}'")

    # Approval fields must be null on generation
    for null_field in ["SB_ApprovedBy", "SB_ApprovedAt", "SB_FinalizedAt", "SB_FinalFileRef"]:
        if fields.get(null_field) is not None:
            errors.append(f"fields.{null_field} must be null on generation")

    # QA score validation
    dims = qa.get("dimensions", {})
    computed_total = sum(dims.values())
    declared_total = qa.get("total_score", 0)
    if computed_total != declared_total:
        errors.append(
            f"qa.total_score ({declared_total}) != sum of dimensions ({computed_total})"
        )

    # Required perfect dimensions
    required_perfect = qa.get("pass_criteria", {}).get("required_perfect", [])
    for dim in required_perfect:
        if dims.get(dim) != 2:
            errors.append(f"qa.dimensions.{dim} must be 2/2 (required_perfect), got {dims.get(dim)}")

    # Minimum total
    min_total = qa.get("pass_criteria", {}).get("minimum_total", 0)
    if computed_total < min_total:
        errors.append(f"qa total ({computed_total}) < minimum_total ({min_total})")

    return errors


# =============================
# Template Registry Validation
# =============================


def load_template_registry() -> Dict[str, Any]:
    """Load the authoritative template registry."""
    if not TEMPLATE_REGISTRY_PATH.exists():
        raise RuntimeError(f"Template registry not found: {TEMPLATE_REGISTRY_PATH}")
    return json.loads(TEMPLATE_REGISTRY_PATH.read_text())


def validate_template_against_registry(request: dict, registry: dict) -> List[str]:
    """Validate request template against registry. No Graph call needed."""
    errors: List[str] = []
    file_id = request.get("template", {}).get("file_id", "")
    version = request.get("template", {}).get("version", "")

    templates = registry.get("templates", [])
    match = [t for t in templates if t["file_id"] == file_id]

    if not match:
        errors.append(f"template.file_id ({file_id}) not found in template registry")
        return errors

    entry = match[0]
    if entry["version"] != version:
        errors.append(
            f"template.version ({version}) != registry version ({entry['version']}) "
            f"for {entry['canonical_name']}"
        )

    return errors


# =============================
# Content Control Extraction
# =============================


def extract_content_controls_from_docx(docx_bytes: bytes) -> List[str]:
    """Extract content control tag names from a .docx (OpenXML ZIP).

    Parses word/document.xml and header/footer parts for <w:sdt> elements,
    extracting <w:tag w:val="..."/> values.
    """
    import io

    tags: List[str] = []
    try:
        with zipfile.ZipFile(io.BytesIO(docx_bytes)) as zf:
            xml_parts = [
                n for n in zf.namelist()
                if n.startswith("word/") and n.endswith(".xml")
            ]
            for part in xml_parts:
                tree = ET.parse(zf.open(part))
                for sdt in tree.iter(f"{{{WORD_NS}}}sdt"):
                    sdt_pr = sdt.find(f"{{{WORD_NS}}}sdtPr")
                    if sdt_pr is not None:
                        tag_el = sdt_pr.find(f"{{{WORD_NS}}}tag")
                        if tag_el is not None:
                            val = tag_el.get(f"{{{WORD_NS}}}val")
                            if val and val not in tags:
                                tags.append(val)
    except zipfile.BadZipFile:
        raise RuntimeError("Template is not a valid .docx (ZIP) file")
    return tags


def validate_content_controls(
    graph: GraphClient, request: dict, registry: dict
) -> List[str]:
    """Download template and validate content controls against registry.

    Returns list of error strings. Requires Graph access.
    """
    errors: List[str] = []
    drive_id = request["output"]["drive_id"]
    file_id = request["template"]["file_id"]

    # Find registry entry
    templates = registry.get("templates", [])
    match = [t for t in templates if t["file_id"] == file_id]
    if not match:
        # Already caught by registry validation; skip here
        return errors
    entry = match[0]

    # Download template
    log.info("Downloading template for content control inspection (id=%s)...", file_id)
    download_url = f"{GRAPH_BASE}/drives/{drive_id}/items/{file_id}/content"
    resp = graph.get_raw(download_url)
    if resp.status_code >= 400:
        errors.append(f"Cannot download template for validation: HTTP {resp.status_code}")
        return errors

    # Extract tags from actual .docx
    try:
        live_tags = extract_content_controls_from_docx(resp.content)
    except RuntimeError as e:
        errors.append(str(e))
        return errors

    log.info("Template content controls: %s", live_tags)

    # Compare against registry
    registry_allowed = set(entry.get("allowed_content_controls", []))
    live_set = set(live_tags)

    # Tags in template not declared in registry (drift)
    undeclared = live_set - registry_allowed
    if undeclared:
        errors.append(
            f"Template has content controls not in registry: {sorted(undeclared)} — "
            f"registry may need update or template has drifted"
        )

    # Tags in registry but missing from template (drift)
    missing = registry_allowed - live_set
    if missing:
        errors.append(
            f"Registry declares controls missing from template: {sorted(missing)} — "
            f"template may have drifted"
        )

    return errors


# =============================
# Graph Precondition Checks
# =============================


def check_preconditions(graph: GraphClient, request: dict) -> List[str]:
    """Verify Graph API preconditions before execution."""
    errors: List[str] = []
    drive_id = request["output"]["drive_id"]

    # 1. Verify drive is accessible
    log.info("Verifying drive access...")
    resp = graph.get(f"{GRAPH_BASE}/drives/{drive_id}")
    if "error" in resp:
        errors.append(f"Drive not accessible: {resp['error']}")
        return errors  # Can't proceed with other checks

    # 2. Verify DRAFTS folder exists
    drafts_id = request["metadata"]["target_folders"]["drafts_id"]
    log.info("Verifying DRAFTS folder (id=%s)...", drafts_id)
    resp = graph.get(f"{GRAPH_BASE}/drives/{drive_id}/items/{drafts_id}")
    if "error" in resp:
        errors.append(f"DRAFTS folder not found (id={drafts_id}): {resp['error']}")
    elif "folder" not in resp:
        errors.append(f"DRAFTS target (id={drafts_id}) is not a folder")

    # 3. Verify RUN_LOGS folder exists
    run_logs_id = request["metadata"]["target_folders"]["run_logs_id"]
    log.info("Verifying RUN_LOGS folder (id=%s)...", run_logs_id)
    resp = graph.get(f"{GRAPH_BASE}/drives/{drive_id}/items/{run_logs_id}")
    if "error" in resp:
        errors.append(f"RUN_LOGS folder not found (id={run_logs_id}): {resp['error']}")

    # 4. Verify TEMPLATES folder exists
    templates_id = request["metadata"]["target_folders"]["templates_id"]
    log.info("Verifying TEMPLATES folder (id=%s)...", templates_id)
    resp = graph.get(f"{GRAPH_BASE}/drives/{drive_id}/items/{templates_id}")
    if "error" in resp:
        errors.append(f"TEMPLATES folder not found (id={templates_id}): {resp['error']}")

    # 5. Check for duplicate filename in DRAFTS (write-once rule)
    filename = request["output"]["filename"]
    log.info("Checking for duplicate: %s in DRAFTS...", filename)
    resp = graph.get(
        f"{GRAPH_BASE}/drives/{drive_id}/items/{drafts_id}/children",
        params={"$filter": f"name eq '{filename}'"},
    )
    if "error" not in resp:
        matches = resp.get("value", [])
        if matches:
            errors.append(
                f"Duplicate file '{filename}' already exists in DRAFTS (write-once violation)"
            )

    return errors


# =============================
# Execution
# =============================


def execute_generate_draft(graph: GraphClient, request: dict) -> dict:
    """Execute the generate_draft action."""
    drive_id = request["output"]["drive_id"]
    drafts_id = request["output"]["folder"]
    filename = request["output"]["filename"]
    template_file_id = request["template"]["file_id"]
    run_logs_id = request["metadata"]["target_folders"]["run_logs_id"]
    run_id = request["run_id"]
    result: Dict[str, Any] = {"run_id": run_id, "steps": [], "success": False}

    # Step 1: Download template content
    log.info("Step 1: Downloading template (id=%s)...", template_file_id)
    download_url = f"{GRAPH_BASE}/drives/{drive_id}/items/{template_file_id}/content"
    resp = graph.get_raw(download_url)
    if resp.status_code >= 400:
        result["steps"].append({"step": "download_template", "status": "FAILED", "error": resp.text[:500]})
        return result
    template_bytes = resp.content
    result["steps"].append({
        "step": "download_template",
        "status": "OK",
        "size_bytes": len(template_bytes),
    })
    log.info("Template downloaded: %d bytes", len(template_bytes))

    # Step 2: Upload draft to DRAFTS folder
    log.info("Step 2: Uploading draft as %s...", filename)
    upload_url = (
        f"{GRAPH_BASE}/drives/{drive_id}/items/{drafts_id}:/{filename}:/content"
    )
    resp_upload = graph.put(upload_url, data=template_bytes)
    if "error" in resp_upload:
        result["steps"].append({"step": "upload_draft", "status": "FAILED", "error": resp_upload["error"]})
        return result
    draft_item_id = resp_upload.get("id")
    draft_web_url = resp_upload.get("webUrl")
    result["steps"].append({
        "step": "upload_draft",
        "status": "OK",
        "item_id": draft_item_id,
        "webUrl": draft_web_url,
    })
    log.info("Draft uploaded: id=%s", draft_item_id)

    # Step 3: Set SB_* metadata fields on the listItem
    log.info("Step 3: Setting metadata fields...")
    fields_to_set = {}
    for k, v in request["fields"].items():
        if v is not None:
            fields_to_set[k] = v
    fields_url = f"{GRAPH_BASE}/drives/{drive_id}/items/{draft_item_id}/listItem/fields"
    resp_fields = graph.patch(fields_url, fields_to_set)
    if "error" in resp_fields:
        result["steps"].append({
            "step": "set_metadata",
            "status": "FAILED",
            "error": resp_fields["error"],
            "note": "Draft uploaded but metadata not set — manual remediation required",
        })
        return result
    result["steps"].append({"step": "set_metadata", "status": "OK", "fields_set": list(fields_to_set.keys())})
    log.info("Metadata set: %s", list(fields_to_set.keys()))

    # Step 4: Write run log to RUN_LOGS
    log.info("Step 4: Writing run log...")
    run_log = {
        "run_id": run_id,
        "timestamp": utc_now(),
        "action": "generate_draft",
        "template_file_id": template_file_id,
        "template_version": request["template"]["version"],
        "draft_file_id": draft_item_id,
        "draft_filename": filename,
        "draft_web_url": draft_web_url,
        "fields_set": fields_to_set,
        "qa_score": request["qa"]["total_score"],
        "qa_result": request["qa"]["result"],
        "executor": "ML2",
        "result": "SUCCESS",
    }
    log_filename = f"{run_id}__run_log.json"
    log_url = f"{GRAPH_BASE}/drives/{drive_id}/items/{run_logs_id}:/{log_filename}:/content"
    log_bytes = json.dumps(run_log, indent=2).encode("utf-8")
    resp_log = graph.put(log_url, data=log_bytes, content_type="application/json")
    if "error" in resp_log:
        result["steps"].append({
            "step": "write_run_log",
            "status": "FAILED",
            "error": resp_log["error"],
            "note": "Draft created but run log failed — audit gap",
        })
        return result
    result["steps"].append({
        "step": "write_run_log",
        "status": "OK",
        "log_item_id": resp_log.get("id"),
    })
    log.info("Run log written: %s", log_filename)

    result["success"] = True
    return result


# =============================
# Main
# =============================


def main() -> None:
    parser = argparse.ArgumentParser(
        description="SB Graph Bridge — validate and execute SharePoint bridge requests",
    )
    parser.add_argument("schema", type=Path, help="Path to JSON schema file")
    parser.add_argument("request", type=Path, help="Path to request JSON file")
    parser.add_argument("--dry-run", action="store_true", help="Validate only, no Graph writes")
    parser.add_argument("--verbose", action="store_true", help="Enable DEBUG logging")
    args = parser.parse_args()

    setup_logging(args.verbose)
    log.info("SB Graph Bridge starting")

    # Load files
    if not args.schema.exists():
        log.error("Schema file not found: %s", args.schema)
        sys.exit(1)
    if not args.request.exists():
        log.error("Request file not found: %s", args.request)
        sys.exit(1)

    schema = json.loads(args.schema.read_text())
    request = json.loads(args.request.read_text())
    log.info("Loaded schema: %s", args.schema)
    log.info("Loaded request: %s (run_id=%s)", args.request, request.get("run_id"))

    # Phase 1: Schema validation
    log.info("=== Phase 1: Schema Validation ===")
    schema_errors = validate_request(request, schema)
    if schema_errors:
        log.error("Schema validation FAILED:")
        for err in schema_errors:
            log.error("  - %s", err)
        sys.exit(2)
    log.info("Schema validation: PASS")

    # Phase 2: Cross-field consistency
    log.info("=== Phase 2: Consistency Check ===")
    consistency_errors = check_consistency(request)
    if consistency_errors:
        log.error("Consistency check FAILED:")
        for err in consistency_errors:
            log.error("  - %s", err)
        sys.exit(3)
    log.info("Consistency check: PASS")

    # Phase 3: QA gate
    log.info("=== Phase 3: QA Gate ===")
    qa = request.get("qa", {})
    if qa.get("result") != "PASS":
        log.error("QA gate: FAIL (result=%s)", qa.get("result"))
        sys.exit(4)
    log.info("QA gate: PASS (score=%d/%d)", qa.get("total_score", 0), 12)

    # Phase 4: Template registry validation (no Graph needed)
    log.info("=== Phase 4: Template Registry Validation ===")
    registry = load_template_registry()
    registry_errors = validate_template_against_registry(request, registry)
    if registry_errors:
        log.error("Template registry validation FAILED:")
        for err in registry_errors:
            log.error("  - %s", err)
        sys.exit(5)
    log.info("Template registry validation: PASS")

    if args.dry_run:
        log.info("=== DRY RUN — skipping Graph API execution ===")
        log.info("Would authenticate with AZURE_* credentials")
        log.info("Would verify: drive %s accessible", request["output"]["drive_id"])
        log.info("Would verify: DRAFTS folder %s exists", request["output"]["folder"])
        log.info("Would verify: RUN_LOGS folder %s exists", request["metadata"]["target_folders"]["run_logs_id"])
        log.info("Would verify: TEMPLATES folder %s exists", request["metadata"]["target_folders"]["templates_id"])
        log.info("Would verify: no duplicate %s in DRAFTS", request["output"]["filename"])
        log.info("Would download + inspect template content controls")
        log.info("Would upload draft: %s to DRAFTS", request["output"]["filename"])
        log.info("Would set fields: %s", [k for k, v in request["fields"].items() if v is not None])
        log.info("Would write run log: %s__run_log.json to RUN_LOGS", request["run_id"])
        log.info("=== Validation complete. All checks passed. ===")
        sys.exit(0)

    # Phase 5: Auth
    log.info("=== Phase 5: Authentication ===")
    tenant, client_id, client_secret = require_env()
    graph = GraphClient(tenant, client_id, client_secret)
    log.info("Token acquired")

    # Phase 6: Precondition checks
    log.info("=== Phase 6: Precondition Checks ===")
    precondition_errors = check_preconditions(graph, request)
    if precondition_errors:
        log.error("Precondition checks FAILED:")
        for err in precondition_errors:
            log.error("  - %s", err)
        sys.exit(6)
    log.info("Precondition checks: PASS")

    # Phase 7: Content control validation (live template introspection)
    log.info("=== Phase 7: Content Control Validation ===")
    cc_errors = validate_content_controls(graph, request, registry)
    if cc_errors:
        log.error("Content control validation FAILED:")
        for err in cc_errors:
            log.error("  - %s", err)
        sys.exit(7)
    log.info("Content control validation: PASS")

    # Phase 8: Execute
    log.info("=== Phase 8: Execute ===")
    action = request["action"]
    if action == "generate_draft":
        result = execute_generate_draft(graph, request)
    else:
        log.error("Unknown action: %s", action)
        sys.exit(8)

    # Report
    if result["success"]:
        log.info("=== BRIDGE COMPLETE ===")
        log.info("Run ID: %s", result["run_id"])
        for step in result["steps"]:
            log.info("  %s: %s", step["step"], step["status"])
        sys.exit(0)
    else:
        log.error("=== BRIDGE FAILED ===")
        for step in result["steps"]:
            status = step["status"]
            if status == "FAILED":
                log.error("  %s: FAILED — %s", step["step"], step.get("error", ""))
                if step.get("note"):
                    log.error("    Note: %s", step["note"])
            else:
                log.info("  %s: %s", step["step"], status)
        sys.exit(9)


if __name__ == "__main__":
    main()
