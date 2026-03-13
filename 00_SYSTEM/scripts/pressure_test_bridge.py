#!/usr/bin/env python3
"""
SB Graph Bridge — Pressure Test Suite

Tests that the bridge correctly rejects malformed, corrupt, and adversarial
requests across all validation phases. No Graph API calls required — all
tests exercise offline validation (schema, consistency, QA, registry).

Usage:
    python pressure_test_bridge.py [--verbose]

Exit codes:
    0 — All tests passed
    1 — One or more tests failed
"""

from __future__ import annotations

import copy
import json
import logging
import sys
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, Tuple

# Import bridge validation functions
sys.path.insert(0, str(Path(__file__).resolve().parent))
from sb_graph_bridge import (
    validate_request,
    check_consistency,
    load_template_registry,
    validate_template_against_registry,
)

log = logging.getLogger(__name__)

REPO_ROOT = Path(__file__).resolve().parents[1]
SCHEMA_PATH = REPO_ROOT / "scripts" / "sb_bridge_request.schema.json"
REQUEST_PATH = REPO_ROOT / "scripts" / "request.json"


def load_baseline() -> Tuple[dict, dict]:
    """Load schema and known-good request."""
    schema = json.loads(SCHEMA_PATH.read_text())
    request = json.loads(REQUEST_PATH.read_text())
    return schema, request


def deep_set(d: dict, path: str, value: Any) -> dict:
    """Set a nested value by dot-separated path. Returns modified copy."""
    out = copy.deepcopy(d)
    keys = path.split(".")
    target = out
    for k in keys[:-1]:
        target = target[k]
    target[keys[-1]] = value
    return out


def deep_del(d: dict, path: str) -> dict:
    """Delete a nested key by dot-separated path. Returns modified copy."""
    out = copy.deepcopy(d)
    keys = path.split(".")
    target = out
    for k in keys[:-1]:
        target = target[k]
    del target[keys[-1]]
    return out


def deep_add(d: dict, path: str, value: Any) -> dict:
    """Add a new nested key by dot-separated path. Returns modified copy."""
    out = copy.deepcopy(d)
    keys = path.split(".")
    target = out
    for k in keys[:-1]:
        target = target[k]
    target[keys[-1]] = value
    return out


# =============================
# Test Result Tracking
# =============================


class TestResult:
    def __init__(self, name: str, category: str, passed: bool, detail: str):
        self.name = name
        self.category = category
        self.passed = passed
        self.detail = detail


results: List[TestResult] = []


def expect_reject(
    name: str,
    category: str,
    request: dict,
    schema: dict,
    phase: str,
    registry: Optional[dict] = None,
) -> None:
    """Assert that a mutated request is rejected by the specified phase."""
    if phase == "schema":
        errors = validate_request(request, schema)
        if errors:
            results.append(TestResult(name, category, True, f"Rejected: {errors[0]}"))
        else:
            results.append(TestResult(name, category, False, "SHOULD HAVE BEEN REJECTED by schema"))

    elif phase == "consistency":
        # Must pass schema first
        schema_errors = validate_request(request, schema)
        if schema_errors:
            results.append(TestResult(name, category, True, f"Rejected at schema (earlier): {schema_errors[0]}"))
            return
        errors = check_consistency(request)
        if errors:
            results.append(TestResult(name, category, True, f"Rejected: {errors[0]}"))
        else:
            results.append(TestResult(name, category, False, "SHOULD HAVE BEEN REJECTED by consistency"))

    elif phase == "registry":
        if registry is None:
            registry = load_template_registry()
        errors = validate_template_against_registry(request, registry)
        if errors:
            results.append(TestResult(name, category, True, f"Rejected: {errors[0]}"))
        else:
            results.append(TestResult(name, category, False, "SHOULD HAVE BEEN REJECTED by registry"))

    elif phase == "any":
        # Should be rejected by at least one offline phase
        schema_errors = validate_request(request, schema)
        if schema_errors:
            results.append(TestResult(name, category, True, f"Rejected at schema: {schema_errors[0]}"))
            return
        consistency_errors = check_consistency(request)
        if consistency_errors:
            results.append(TestResult(name, category, True, f"Rejected at consistency: {consistency_errors[0]}"))
            return
        if registry is None:
            registry = load_template_registry()
        registry_errors = validate_template_against_registry(request, registry)
        if registry_errors:
            results.append(TestResult(name, category, True, f"Rejected at registry: {registry_errors[0]}"))
            return
        results.append(TestResult(name, category, False, "SHOULD HAVE BEEN REJECTED by some phase"))


def expect_pass(
    name: str,
    category: str,
    request: dict,
    schema: dict,
    registry: Optional[dict] = None,
) -> None:
    """Assert that a request passes all offline validation phases."""
    schema_errors = validate_request(request, schema)
    if schema_errors:
        results.append(TestResult(name, category, False, f"Unexpected schema rejection: {schema_errors[0]}"))
        return
    consistency_errors = check_consistency(request)
    if consistency_errors:
        results.append(TestResult(name, category, False, f"Unexpected consistency rejection: {consistency_errors[0]}"))
        return
    if registry is None:
        registry = load_template_registry()
    registry_errors = validate_template_against_registry(request, registry)
    if registry_errors:
        results.append(TestResult(name, category, False, f"Unexpected registry rejection: {registry_errors[0]}"))
        return
    results.append(TestResult(name, category, True, "Passed all offline phases"))


# =============================
# Test Categories
# =============================


def test_baseline(schema: dict, request: dict, registry: dict) -> None:
    """Sanity: valid request passes all offline checks."""
    expect_pass("PT-00: Baseline valid request", "baseline", request, schema, registry)


def test_edge_cases(schema: dict, request: dict, registry: dict) -> None:
    """Edge-case ambiguity testing."""
    cat = "edge-case"

    # Missing top-level keys
    for key in ["action", "run_id", "template", "output", "fields", "metadata", "qa"]:
        r = deep_del(request, key)
        expect_reject(f"PT-E01: Missing top-level key '{key}'", cat, r, schema, "schema")

    # Empty run_id
    r = deep_set(request, "run_id", "")
    expect_reject("PT-E02: Empty run_id", cat, r, schema, "schema")

    # Malformed run_id format
    r = deep_set(request, "run_id", "RUN-BAD-FORMAT")
    expect_reject("PT-E03: Malformed run_id pattern", cat, r, schema, "schema")

    # run_id with SQL injection attempt
    r = deep_set(request, "run_id", "RUN-2026-02-12-001'; DROP TABLE--")
    expect_reject("PT-E04: run_id injection attempt", cat, r, schema, "schema")

    # Invalid action
    r = deep_set(request, "action", "delete_all")
    expect_reject("PT-E05: Invalid action", cat, r, schema, "schema")

    # Extra top-level key (additionalProperties: false)
    r = deep_add(request, "evil_key", "payload")
    expect_reject("PT-E06: Extra top-level key", cat, r, schema, "schema")

    # Filename without .docx extension
    r = deep_set(request, "output.filename", "2026-02-12__RUN-2026-02-12-001__DRAFT.pdf")
    expect_reject("PT-E07: Filename not .docx", cat, r, schema, "schema")

    # Filename missing date prefix
    r = deep_set(request, "output.filename", "RUN-2026-02-12-001__DRAFT.docx")
    expect_reject("PT-E08: Filename missing date prefix", cat, r, schema, "schema")

    # Empty template file_id
    r = deep_set(request, "template.file_id", "")
    expect_reject("PT-E09: Empty template file_id", cat, r, schema, "schema")

    # Template version wrong format
    r = deep_set(request, "template.version", "v2")
    expect_reject("PT-E10: Template version wrong format", cat, r, schema, "schema")


def test_authority_violations(schema: dict, request: dict, registry: dict) -> None:
    """Authority model violations."""
    cat = "authority"

    # executor != ML2
    r = deep_set(request, "metadata.executor", "ML1")
    expect_reject("PT-A01: executor=ML1 (must be ML2)", cat, r, schema, "schema")

    # authority != ML1
    r = deep_set(request, "metadata.authority", "ML2")
    expect_reject("PT-A02: authority=ML2 (must be ML1)", cat, r, schema, "schema")

    # GeneratedBy != ML2
    r = deep_set(request, "fields.SB_GeneratedBy", "ML1")
    expect_reject("PT-A03: SB_GeneratedBy=ML1", cat, r, schema, "schema")

    # SB_Status = FINAL on generation (should be DRAFT)
    r = deep_set(request, "fields.SB_Status", "FINAL")
    expect_reject("PT-A04: SB_Status=FINAL on generation", cat, r, schema, "any")

    # Pre-populated approval fields on generation
    r = deep_set(request, "fields.SB_ApprovedBy", "ML1")
    expect_reject("PT-A05: SB_ApprovedBy set on generation", cat, r, schema, "consistency")

    r = deep_set(request, "fields.SB_FinalizedAt", "2026-02-12T10:00:00Z")
    expect_reject("PT-A06: SB_FinalizedAt set on generation", cat, r, schema, "consistency")


def test_write_once_violations(schema: dict, request: dict, registry: dict) -> None:
    """Write-once and overwrite protection."""
    cat = "write-once"

    # overwrite = true
    r = deep_set(request, "output.overwrite", True)
    expect_reject("PT-W01: overwrite=true", cat, r, schema, "schema")

    # overwrite missing (schema requires it to be false)
    r = deep_del(request, "output.overwrite")
    expect_reject("PT-W02: overwrite missing", cat, r, schema, "schema")

    # overwrite = null
    r = deep_set(request, "output.overwrite", None)
    expect_reject("PT-W03: overwrite=null", cat, r, schema, "schema")


def test_qa_gate(schema: dict, request: dict, registry: dict) -> None:
    """QA gate enforcement."""
    cat = "qa-gate"

    # QA result = FAIL
    r = deep_set(request, "qa.result", "FAIL")
    expect_reject("PT-Q01: QA result=FAIL", cat, r, schema, "schema")

    # QA required = false
    r = deep_set(request, "qa.required", False)
    expect_reject("PT-Q02: QA required=false", cat, r, schema, "schema")

    # QA total_score below minimum
    r = deep_set(request, "qa.total_score", 10)
    expect_reject("PT-Q03: total_score=10 (below 11)", cat, r, schema, "any")

    # Required perfect dimension not 2/2
    r = deep_set(request, "qa.dimensions.correctness", 1)
    expect_reject("PT-Q04: correctness=1 (must be 2)", cat, r, schema, "any")

    r = deep_set(request, "qa.dimensions.no_hallucinations", 0)
    expect_reject("PT-Q05: no_hallucinations=0", cat, r, schema, "any")

    r = deep_set(request, "qa.dimensions.scope_authority", 1)
    expect_reject("PT-Q06: scope_authority=1", cat, r, schema, "any")

    # Score mismatch: declared != computed
    r = deep_set(request, "qa.total_score", 14)
    expect_reject("PT-Q07: total_score mismatch (14 vs 12)", cat, r, schema, "consistency")


def test_consistency_violations(schema: dict, request: dict, registry: dict) -> None:
    """Cross-field consistency violations."""
    cat = "consistency"

    # run_id != fields.SB_RunID
    r = deep_set(request, "fields.SB_RunID", "RUN-2026-02-12-999")
    expect_reject("PT-C01: SB_RunID mismatch", cat, r, schema, "consistency")

    # template.version != fields.SB_TemplateVersion
    r = deep_set(request, "fields.SB_TemplateVersion", "9.9")
    expect_reject("PT-C02: SB_TemplateVersion mismatch", cat, r, schema, "consistency")

    # output.drive_id != metadata.drive_id
    r = deep_set(request, "metadata.drive_id", "WRONG_DRIVE")
    expect_reject("PT-C03: drive_id mismatch", cat, r, schema, "consistency")

    # output.folder != metadata.target_folders.drafts_id
    r = deep_set(request, "output.folder", "WRONG_FOLDER_ID")
    expect_reject("PT-C04: output.folder != drafts_id", cat, r, schema, "consistency")

    # lifecycle_state != GENERATED
    r = deep_set(request, "metadata.lifecycle_state", "FINALIZED")
    expect_reject("PT-C05: lifecycle_state=FINALIZED", cat, r, schema, "schema")

    # write_boundary not SB Execution/
    r = deep_set(request, "metadata.write_boundary", "Other Folder/")
    expect_reject("PT-C06: write_boundary outside enclave", cat, r, schema, "schema")


def test_metadata_corruption(schema: dict, request: dict, registry: dict) -> None:
    """Metadata corruption and injection."""
    cat = "metadata"

    # Extra field in fields (additionalProperties: false)
    r = deep_add(request, "fields.SB_EvilField", "injected")
    expect_reject("PT-M01: Extra metadata field injection", cat, r, schema, "schema")

    # Extra field in metadata
    r = deep_add(request, "metadata.evil_key", "injected")
    expect_reject("PT-M02: Extra metadata key injection", cat, r, schema, "schema")

    # Extra field in template
    r = deep_add(request, "template.evil_key", "injected")
    expect_reject("PT-M03: Extra template key injection", cat, r, schema, "schema")

    # Extra field in output
    r = deep_add(request, "output.evil_key", "injected")
    expect_reject("PT-M04: Extra output key injection", cat, r, schema, "schema")

    # Extra target folder
    r = deep_add(request, "metadata.target_folders.evil_folder", "INJECT")
    expect_reject("PT-M05: Extra target folder injection", cat, r, schema, "schema")

    # SB_Status invalid value
    r = deep_set(request, "fields.SB_Status", "PUBLISHED")
    expect_reject("PT-M06: SB_Status=PUBLISHED (not in enum)", cat, r, schema, "any")

    # Missing required metadata field
    r = deep_del(request, "metadata.execution_root_id")
    expect_reject("PT-M07: Missing execution_root_id", cat, r, schema, "schema")


def test_registry_violations(schema: dict, request: dict, registry: dict) -> None:
    """Template registry enforcement."""
    cat = "registry"

    # Unknown template file_id
    r = deep_set(request, "template.file_id", "FAKE_FILE_ID_NOT_IN_REGISTRY")
    expect_reject("PT-R01: Unknown template file_id", cat, r, schema, "registry", registry)

    # Correct file_id but wrong version
    real_template = registry["templates"][0]
    r = deep_set(request, "template.file_id", real_template["file_id"])
    r = deep_set(r, "template.version", "99.0")
    # Also fix consistency fields
    r = deep_set(r, "fields.SB_TemplateVersion", "99.0")
    expect_reject("PT-R02: Template version mismatch vs registry", cat, r, schema, "registry", registry)


def test_cross_matter_contamination(schema: dict, request: dict, registry: dict) -> None:
    """RunID isolation — ensure RunID must be internally consistent."""
    cat = "contamination"

    # RunID in filename doesn't match run_id field
    r = deep_set(request, "output.filename", "2026-02-12__RUN-2026-02-12-999__DRAFT.docx")
    # run_id is still RUN-2026-02-12-001 but filename says 999
    # Schema pattern won't catch this — but it's a logical inconsistency
    # The bridge doesn't currently validate filename-to-runid, so document this gap
    schema_errors = validate_request(r, schema)
    consistency_errors = check_consistency(r)
    if schema_errors or consistency_errors:
        results.append(TestResult(
            "PT-X01: Filename RunID != request run_id",
            cat, True,
            f"Rejected: {(schema_errors or consistency_errors)[0]}"
        ))
    else:
        results.append(TestResult(
            "PT-X01: Filename RunID != request run_id",
            cat, False,
            "GAP: Bridge does not validate filename-to-runid consistency. "
            "Consider adding filename RunID cross-check."
        ))


def test_boundary_escape(schema: dict, request: dict, registry: dict) -> None:
    """Execution boundary escape attempts."""
    cat = "boundary"

    # Path traversal in filename
    r = deep_set(request, "output.filename", "../../etc/2026-02-12__RUN-2026-02-12-001__DRAFT.docx")
    expect_reject("PT-B01: Path traversal in filename", cat, r, schema, "schema")

    # Folder targeting FINAL instead of DRAFTS
    r = deep_set(request, "output.folder", request["metadata"]["target_folders"]["final_id"])
    expect_reject("PT-B02: Output folder = FINAL (should be DRAFTS)", cat, r, schema, "consistency")

    # Drive ID pointing elsewhere
    r = deep_set(request, "output.drive_id", "b!DIFFERENT_DRIVE_ID")
    r = deep_set(r, "metadata.drive_id", "b!DIFFERENT_DRIVE_ID")
    # This passes consistency (they match) but would fail preconditions (live)
    # Offline phases won't catch this — it's a live-only check
    schema_errors = validate_request(r, schema)
    consistency_errors = check_consistency(r)
    if schema_errors or consistency_errors:
        results.append(TestResult("PT-B03: Redirect to different drive", cat, True, "Rejected offline"))
    else:
        results.append(TestResult(
            "PT-B03: Redirect to different drive",
            cat, True,
            "Accepted offline (expected). Live Phase 6 precondition check will reject."
        ))


# =============================
# Runner
# =============================


def run_all() -> None:
    schema, request = load_baseline()
    registry = load_template_registry()

    test_baseline(schema, request, registry)
    test_edge_cases(schema, request, registry)
    test_authority_violations(schema, request, registry)
    test_write_once_violations(schema, request, registry)
    test_qa_gate(schema, request, registry)
    test_consistency_violations(schema, request, registry)
    test_metadata_corruption(schema, request, registry)
    test_registry_violations(schema, request, registry)
    test_cross_matter_contamination(schema, request, registry)
    test_boundary_escape(schema, request, registry)


def print_results() -> None:
    passed = [r for r in results if r.passed]
    failed = [r for r in results if not r.passed]

    categories = {}
    for r in results:
        categories.setdefault(r.category, []).append(r)

    log.info("=" * 60)
    log.info("SB Graph Bridge — Pressure Test Results")
    log.info("=" * 60)

    for cat, cat_results in categories.items():
        cat_passed = sum(1 for r in cat_results if r.passed)
        cat_total = len(cat_results)
        status = "PASS" if cat_passed == cat_total else "FAIL"
        log.info("")
        log.info("--- %s [%s] (%d/%d) ---", cat, status, cat_passed, cat_total)
        for r in cat_results:
            icon = "PASS" if r.passed else "FAIL"
            log.info("  [%s] %s", icon, r.name)
            log.info("         %s", r.detail)

    log.info("")
    log.info("=" * 60)
    log.info("TOTAL: %d/%d passed, %d failed", len(passed), len(results), len(failed))
    log.info("=" * 60)

    if failed:
        log.info("")
        log.info("FAILURES:")
        for r in failed:
            log.error("  [FAIL] %s — %s", r.name, r.detail)


def main() -> None:
    import argparse
    parser = argparse.ArgumentParser(description="SB Graph Bridge pressure tests")
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)sZ [%(levelname)s] %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%S",
    )

    run_all()
    print_results()

    failed = [r for r in results if not r.passed]
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
