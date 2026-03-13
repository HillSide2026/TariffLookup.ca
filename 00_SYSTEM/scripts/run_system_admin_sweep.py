#!/usr/bin/env python3
"""
Minimal local runner for the System Admin Sweep.

Writes required artifacts to:
  06_RUNS/${run_id}/system_admin/

Scope:
- Builds an inventory of governed artifacts.
- Runs a minimal folder-map drift check.
- Produces empty findings for other SAAs.
"""

from __future__ import annotations

import argparse
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Iterable, List, Tuple


REPO_ROOT = Path(__file__).resolve().parents[2]
FOLDER_MAP_PATH = REPO_ROOT / "00_SYSTEM" / "architecture" / "FOLDER_MAP.md"

SAA_AGENTS = [
    "SAA_REPO_LINTER",
    "SAA_FOLDER_MAP_DRIFT",
    "SAA_METADATA_ENFORCER",
    "SAA_REFERENCE_INTEGRITY",
    "SAA_REGISTRY_SYNC",
]

SEVERITY_ORDER = {"BLOCKER": 0, "MAJOR": 1, "MINOR": 2, "INFO": 3}

EXCLUDE_DIR_NAMES = {
    ".git",
    ".github",
    ".idea",
    ".vscode",
    "__pycache__",
    "node_modules",
    ".venv",
    "venv",
    "dist",
    "build",
}


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def slugify(text: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9]+", "-", text.strip().lower()).strip("-")
    return cleaned or "finding"


def generate_run_id() -> str:
    stamp = datetime.now(timezone.utc).strftime("%H%M%SZ")
    date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    return f"RUN-{date}-SYSTEM-ADMIN-SWEEP-{stamp}"


def load_folder_map_roots() -> List[str]:
    if not FOLDER_MAP_PATH.exists():
        return []
    roots: List[str] = []
    numbered_pattern = re.compile(r"^-\s+([0-9]{2}_[A-Z0-9_]+)\b")
    section: str | None = None
    for line in FOLDER_MAP_PATH.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if stripped.startswith("## "):
            header = stripped[3:].strip().lower()
            if header.startswith("ml2 governed roots"):
                section = "numbered"
            elif header.startswith("non-ml2 root folders"):
                section = "non_numbered"
            else:
                section = None
            continue
        if not line.startswith("- "):
            continue
        if section == "numbered":
            match = numbered_pattern.match(stripped)
            if match:
                roots.append(match.group(1))
        elif section == "non_numbered":
            name = stripped[2:].split("—", 1)[0].strip()
            if name and not name.startswith("."):
                roots.append(name)
    return roots


def governed_roots() -> List[str]:
    roots = load_folder_map_roots()
    if roots:
        return roots
    # Fallback to numbered roots if folder map is missing.
    return [d.name for d in REPO_ROOT.iterdir() if d.is_dir() and re.match(r"^[0-9]{2}_", d.name)]


def is_excluded_dir(path: Path) -> bool:
    return any(part in EXCLUDE_DIR_NAMES for part in path.parts) or "scripts" in path.parts


def type_guess(path: Path) -> str:
    ext = path.suffix.lower()
    if ext == ".md":
        return "markdown"
    if ext == ".json":
        return "json"
    if ext in {".yaml", ".yml"}:
        return "yaml"
    if ext == ".txt":
        return "text"
    if ext == ".csv":
        return "csv"
    if ext == ".pdf":
        return "pdf"
    return "file"


def category_guess(rel_path: Path) -> str:
    if not rel_path.parts:
        return "other"
    top = rel_path.parts[0]
    mapping = {
        "00_SYSTEM": "system",
        "01_DOCTRINE": "doctrine",
        "02_PLAYBOOKS": "playbook",
        "03_TEMPLATES": "template",
        "04_INITIATIVES": "initiative",
        "05_MATTERS": "matter",
        "06_RUNS": "runs",
        "07_REFERENCE": "reference",
        "08_RESEARCH": "research",
        "09_INBOX": "inbox",
        "10_ARCHIVE": "archive",
    }
    return mapping.get(top, "other")


def build_inventory(roots: Iterable[str]) -> List[Dict]:
    inventory: List[Dict] = []
    for root in roots:
        root_path = REPO_ROOT / root
        if not root_path.exists() or not root_path.is_dir():
            continue
        for path in root_path.rglob("*"):
            if path.is_dir():
                if is_excluded_dir(path):
                    continue
                continue
            if is_excluded_dir(path):
                continue
            rel = path.relative_to(REPO_ROOT)
            stat = path.stat()
            inventory.append(
                {
                    "path": rel.as_posix(),
                    "type_guess": type_guess(path),
                    "category_guess": category_guess(rel),
                    "exists": True,
                    "size_bytes": stat.st_size,
                    "last_modified": datetime.fromtimestamp(stat.st_mtime, timezone.utc).isoformat(timespec="seconds"),
                }
            )
    inventory.sort(key=lambda x: x["path"])
    return inventory


def folder_map_drift_findings() -> List[Dict]:
    mapped_roots = set(load_folder_map_roots())
    actual_roots = {
        p.name
        for p in REPO_ROOT.iterdir()
        if p.is_dir() and not p.name.startswith(".") and p.name not in EXCLUDE_DIR_NAMES
    }
    extras = sorted(actual_roots - mapped_roots)
    missing = sorted(mapped_roots - actual_roots)

    findings: List[Dict] = []

    if extras:
        findings.append(
            {
                "id": f"SAA_FOLDER_MAP_DRIFT-drift-{slugify('Root directories not documented in FOLDER_MAP.md')}",
                "agent": "SAA_FOLDER_MAP_DRIFT",
                "severity": "MAJOR",
                "category": "drift",
                "title": "Root directories not documented in FOLDER_MAP.md",
                "description": "Root directories exist that are not listed in the folder map.",
                "affected_paths": [f"{name}/" for name in extras],
                "suggested_fix": "Update FOLDER_MAP.md or relocate these directories into documented locations.",
                "created_at": utc_now(),
            }
        )

    if missing:
        findings.append(
            {
                "id": f"SAA_FOLDER_MAP_DRIFT-drift-{slugify('Folder map entries missing on disk')}",
                "agent": "SAA_FOLDER_MAP_DRIFT",
                "severity": "MINOR",
                "category": "drift",
                "title": "Folder map entries missing on disk",
                "description": "Folder map lists root directories that do not exist in the repo.",
                "affected_paths": [f"{name}/" for name in missing],
                "suggested_fix": "Remove or correct missing roots in FOLDER_MAP.md.",
                "created_at": utc_now(),
            }
        )

    return findings


def merge_findings(findings_by_agent: Dict[str, List[Dict]]) -> List[Dict]:
    merged: List[Dict] = []
    seen: set[Tuple[str, str, Tuple[str, ...]]] = set()
    for findings in findings_by_agent.values():
        for finding in findings:
            key = (
                finding.get("category", ""),
                finding.get("title", ""),
                tuple(finding.get("affected_paths", [])),
            )
            if key in seen:
                continue
            seen.add(key)
            merged.append(finding)
    merged.sort(
        key=lambda f: (
            SEVERITY_ORDER.get(f.get("severity", "INFO"), 3),
            f.get("category", ""),
            f.get("title", ""),
            f.get("agent", ""),
        )
    )
    return merged


def summarize_counts(findings: List[Dict]) -> Dict[str, int]:
    counts = {"BLOCKER": 0, "MAJOR": 0, "MINOR": 0, "INFO": 0}
    for finding in findings:
        sev = finding.get("severity", "INFO")
        counts[sev] = counts.get(sev, 0) + 1
    return counts


def render_findings_md(findings: List[Dict]) -> str:
    counts = summarize_counts(findings)
    lines = [
        "# System Admin Findings",
        "",
        "## Summary",
        f"- BLOCKER: {counts['BLOCKER']}",
        f"- MAJOR: {counts['MAJOR']}",
        f"- MINOR: {counts['MINOR']}",
        f"- INFO: {counts['INFO']}",
        "",
    ]
    if not findings:
        lines.append("No findings.")
        return "\n".join(lines) + "\n"

    for finding in findings:
        lines.extend(
            [
                f"## {finding['severity']} — {finding['title']}",
                f"Agent: {finding['agent']}",
                "",
                finding["description"],
                "",
                "Affected paths:",
            ]
        )
        for path in finding.get("affected_paths", []):
            lines.append(f"- {path}")
        if finding.get("suggested_fix"):
            lines.extend(["", f"Suggested fix: {finding['suggested_fix']}"])
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def render_system_admin_report(run_id: str, run_root: Path, findings: List[Dict]) -> str:
    counts = summarize_counts(findings)
    categories: Dict[str, int] = {}
    for finding in findings:
        cat = finding.get("category", "unknown")
        categories[cat] = categories.get(cat, 0) + 1

    lines = [
        "# SYSTEM ADMIN REPORT",
        "",
        f"Run ID: {run_id}",
        f"Run Root: {run_root.as_posix()}",
        "",
        "## Summary",
        f"- BLOCKER: {counts['BLOCKER']}",
        f"- MAJOR: {counts['MAJOR']}",
        f"- MINOR: {counts['MINOR']}",
        f"- INFO: {counts['INFO']}",
        "",
        "Status: COMPLETED",
        "",
        "## Category Totals",
    ]
    if categories:
        for cat in sorted(categories):
            lines.append(f"- {cat}: {categories[cat]}")
    else:
        lines.append("- none")
    lines.extend(
        [
            "",
            "## Next Actions",
            "- Review appendices for agent-specific detail.",
            "- Triage BLOCKER/MAJOR findings first.",
            "",
        ]
    )
    return "\n".join(lines)


def render_appendix(agent: str, findings: List[Dict]) -> str:
    lines = [f"# Appendix — {agent}", ""]
    if not findings:
        lines.append("No findings.")
        return "\n".join(lines) + "\n"
    for finding in findings:
        lines.extend(
            [
                f"## {finding['severity']} — {finding['title']}",
                "",
                finding["description"],
                "",
                "Affected paths:",
            ]
        )
        for path in finding.get("affected_paths", []):
            lines.append(f"- {path}")
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def write_json(path: Path, data: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Run minimal System Admin Sweep locally.")
    parser.add_argument("--run-id", help="Override run ID (default: auto)")
    args = parser.parse_args()

    run_id = args.run_id or generate_run_id()
    run_root = REPO_ROOT / "06_RUNS" / run_id / "system_admin"
    run_root.mkdir(parents=True, exist_ok=True)

    start_time = utc_now()

    roots = governed_roots()
    inventory = build_inventory(roots)

    findings_by_agent: Dict[str, List[Dict]] = {agent: [] for agent in SAA_AGENTS}
    findings_by_agent["SAA_FOLDER_MAP_DRIFT"] = folder_map_drift_findings()

    merged_findings = merge_findings(findings_by_agent)

    # Write required outputs
    write_json(run_root / "inventory.json", inventory)
    for agent in SAA_AGENTS:
        write_json(run_root / f"findings_{agent}.json", findings_by_agent.get(agent, []))
    write_json(run_root / "findings.json", merged_findings)

    findings_md = render_findings_md(merged_findings)
    (run_root / "findings.md").write_text(findings_md, encoding="utf-8")

    report_md = render_system_admin_report(run_id, run_root, merged_findings)
    (run_root / "SYSTEM_ADMIN_REPORT.md").write_text(report_md, encoding="utf-8")

    appendix_map = {
        "SAA_REPO_LINTER": "appendix_repo_linter.md",
        "SAA_FOLDER_MAP_DRIFT": "appendix_folder_map_drift.md",
        "SAA_METADATA_ENFORCER": "appendix_metadata_enforcer.md",
        "SAA_REFERENCE_INTEGRITY": "appendix_reference_integrity.md",
        "SAA_REGISTRY_SYNC": "appendix_registry_sync.md",
    }
    for agent, filename in appendix_map.items():
        content = render_appendix(agent, findings_by_agent.get(agent, []))
        (run_root / filename).write_text(content, encoding="utf-8")

    # Minimal runlog + provenance
    runlog = "\n".join(
        [
            "# System Admin Sweep Run Log",
            "",
            f"Run ID: {run_id}",
            f"Start: {start_time}",
            f"End: {utc_now()}",
            "",
            f"Inventory entries: {len(inventory)}",
            f"Total findings: {len(merged_findings)}",
            "",
            "Outputs:",
            f"- {run_root / 'inventory.json'}",
            f"- {run_root / 'findings.json'}",
            f"- {run_root / 'findings.md'}",
            f"- {run_root / 'SYSTEM_ADMIN_REPORT.md'}",
            "",
        ]
    )
    (run_root / "runlog.md").write_text(runlog, encoding="utf-8")
    write_json(
        run_root / "provenance.json",
        {
            "run_id": run_id,
            "started_at": start_time,
            "ended_at": utc_now(),
            "runner": "00_SYSTEM/scripts/run_system_admin_sweep.py",
            "notes": "Minimal local sweep runner (folder map drift only).",
        },
    )

    print(f"System admin sweep complete: {run_root}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
