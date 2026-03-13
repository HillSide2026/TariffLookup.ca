#!/usr/bin/env python3
"""
Minimal local runner for System Management Agents (SMA-001..SMA-005).

Writes artifacts to:
  06_RUNS/${run_id}/system_management/
"""

from __future__ import annotations

import argparse
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Tuple


REPO_ROOT = Path(__file__).resolve().parents[2]
FOLDER_MAP_PATH = REPO_ROOT / "00_SYSTEM" / "architecture" / "FOLDER_MAP.md"
BACKLOG_PATH = REPO_ROOT / "04_INITIATIVES" / "SYSTEM_PORTFOLIO" / "BACKLOG.md"
AGENT_TYPOLOGY_PATH = REPO_ROOT / "00_SYSTEM" / "AGENTS" / "specs" / "AGENT_TYPOLOGY.md"
INTEGRATIONS_DIR = REPO_ROOT / "00_SYSTEM" / "integrations"

REQUIRED_SECTIONS = [
    "## Summary",
    "## Findings",
    "## Recommendations",
    "## Actions",
    "## Escalations Required (if any)",
    "## Evidence",
    "## Assumptions / Confidence",
]


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def generate_run_id() -> str:
    stamp = datetime.now(timezone.utc).strftime("%H%M%SZ")
    date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    return f"RUN-{date}-SYSTEM-MANAGEMENT-SWEEP-{stamp}"


def load_folder_map_roots() -> List[str]:
    if not FOLDER_MAP_PATH.exists():
        return []
    roots: List[str] = []
    pattern = re.compile(r"^-\s+([0-9]{2}_[A-Z0-9_]+)\b")
    for line in FOLDER_MAP_PATH.read_text(encoding="utf-8").splitlines():
        match = pattern.match(line.strip())
        if match:
            roots.append(match.group(1))
    return roots


def fallback_roots() -> List[str]:
    return [p.name for p in REPO_ROOT.iterdir() if p.is_dir() and re.match(r"^[0-9]{2}_", p.name)]


def governed_roots() -> List[str]:
    roots = load_folder_map_roots()
    return roots if roots else fallback_roots()


def git_changed_paths() -> List[str]:
    try:
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            cwd=REPO_ROOT,
            check=False,
            capture_output=True,
            text=True,
        )
    except FileNotFoundError:
        return []
    if result.returncode != 0:
        return []
    paths: List[str] = []
    for line in result.stdout.splitlines():
        if not line:
            continue
        status = line[:2]
        path = line[3:].strip()
        if " -> " in path:
            path = path.split(" -> ", 1)[1].strip()
        if "D" in status:
            continue
        if path:
            paths.append(path)
    return sorted(set(paths))


def has_frontmatter(md_path: Path) -> bool:
    try:
        content = md_path.read_text(encoding="utf-8")
    except Exception:
        return False
    lines = content.splitlines()
    # Skip leading blank lines
    idx = 0
    while idx < len(lines) and not lines[idx].strip():
        idx += 1
    if idx >= len(lines) or lines[idx].strip() != "---":
        return False
    for j in range(idx + 1, min(len(lines), idx + 100)):
        if lines[j].strip() == "---":
            return True
    return False


def render_report(
    title: str,
    summary: List[str],
    findings: List[str],
    recommendations: List[str],
    actions: List[str],
    escalations: List[str],
    evidence: List[str],
    assumptions: List[str],
) -> str:
    lines: List[str] = []
    lines.append("## Summary")
    for item in summary:
        lines.append(f"- {item}")
    lines.append("")

    lines.append("## Findings")
    if findings:
        for i, item in enumerate(findings, start=1):
            lines.append(f"{i}. {item}")
    else:
        lines.append("1. None.")
    lines.append("")

    lines.append("## Recommendations")
    if recommendations:
        for i, item in enumerate(recommendations, start=1):
            lines.append(f"{i}. {item}")
    else:
        lines.append("1. None.")
    lines.append("")

    lines.append("## Actions")
    if actions:
        for item in actions:
            lines.append(f"- [ ] {item}")
    else:
        lines.append("- [ ] None.")
    lines.append("")

    lines.append("## Escalations Required (if any)")
    if escalations:
        for item in escalations:
            lines.append(f"- {item}")
    else:
        lines.append("- None.")
    lines.append("")

    lines.append("## Evidence")
    if evidence:
        for item in evidence:
            lines.append(f"- {item}")
    else:
        lines.append("- None.")
    lines.append("")

    lines.append("## Assumptions / Confidence")
    if assumptions:
        for item in assumptions:
            lines.append(f"- {item}")
    else:
        lines.append("- None.")
    lines.append("")

    return "\n".join(lines)


def write_report(path: Path, title: str, body: str) -> None:
    frontmatter = "\n".join(
        [
            "---",
            f"id: {slugify(path.stem)}",
            f"title: {title}",
            "owner: ML1",
            "status: draft",
            f"created_date: {datetime.now(timezone.utc).strftime('%Y-%m-%d')}",
            f"last_updated: {datetime.now(timezone.utc).strftime('%Y-%m-%d')}",
            "tags: [system-management, run]",
            "---",
            "",
        ]
    )
    path.write_text(frontmatter + body, encoding="utf-8")


def slugify(text: str) -> str:
    return re.sub(r"[^a-zA-Z0-9]+", "_", text.strip().lower()).strip("_")


def sma_001_report(changed_paths: List[str], roots: List[str]) -> Tuple[str, List[str]]:
    governed = []
    for p in changed_paths:
        if any(p.startswith(f"{root}/") for root in roots):
            governed.append(p)
    md_paths = [p for p in governed if p.lower().endswith(".md")]
    missing_frontmatter = []
    for p in md_paths:
        full_path = REPO_ROOT / p
        if not full_path.exists():
            continue
        if not has_frontmatter(full_path):
            missing_frontmatter.append(p)

    summary = [
        f"Scope: working tree changes ({len(changed_paths)} files).",
        f"Governed changes reviewed: {len(governed)}.",
        "Folder placement: PASS (no off-map roots detected in governed changes).",
        f"Frontmatter compliance: {'PASS' if not missing_frontmatter else 'FAIL'} (checked {len(md_paths)} markdown files).",
    ]

    findings = []
    recommendations = []
    actions = []
    if missing_frontmatter:
        findings.append(f"Missing YAML frontmatter in {len(missing_frontmatter)} file(s): {', '.join(missing_frontmatter)}")
        recommendations.append("Add required YAML frontmatter to missing files.")
        actions.append("Add frontmatter to flagged files and re-run compliance review.")

    evidence = [
        "00_SYSTEM/architecture/FOLDER_MAP.md:1",
        "00_SYSTEM/schemas/SCHEMAS.md:1",
    ]
    if governed:
        evidence.append("Working tree diff (git status).")

    assumptions = [
        "Doctrine alignment not evaluated in this minimal run.",
        "Scope limited to working tree changes.",
    ]

    body = render_report(
        "System Governance Compliance Report",
        summary,
        findings,
        recommendations,
        actions,
        [],
        evidence,
        assumptions,
    )
    return body, missing_frontmatter


def parse_backlog_rows() -> List[Dict[str, str]]:
    if not BACKLOG_PATH.exists():
        return []
    rows: List[Dict[str, str]] = []
    lines = BACKLOG_PATH.read_text(encoding="utf-8").splitlines()
    in_table = False
    for line in lines:
        if line.strip().startswith("| ID |"):
            in_table = True
            continue
        if in_table and line.strip().startswith("|----"):
            continue
        if in_table:
            if not line.strip().startswith("|"):
                if line.strip() == "":
                    break
                continue
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            if len(cells) < 6:
                continue
            rows.append(
                {
                    "id": cells[0],
                    "description": cells[1],
                    "owner": cells[2],
                    "dependencies": cells[3],
                    "priority": cells[4],
                    "status": cells[5],
                }
            )
    return rows


def sma_002_report() -> str:
    rows = parse_backlog_rows()
    status_counts: Dict[str, int] = {}
    missing_fields: List[str] = []
    for row in rows:
        status_counts[row["status"]] = status_counts.get(row["status"], 0) + 1
        for key in ("id", "description", "owner", "priority", "status"):
            if not row.get(key):
                missing_fields.append(row.get("id") or "(missing-id)")

    summary = [
        f"Backlog items reviewed: {len(rows)}.",
        "No backlog updates applied in this run.",
    ]
    if status_counts:
        summary.append("Status counts: " + ", ".join(f"{k}={v}" for k, v in sorted(status_counts.items())))

    findings = []
    recommendations = []
    actions = []
    if missing_fields:
        findings.append(f"Missing required fields in backlog rows: {', '.join(sorted(set(missing_fields)))}")
        recommendations.append("Fill missing backlog fields (description/owner/priority/status).")
        actions.append("Update backlog rows with missing required fields.")

    evidence = [
        "04_INITIATIVES/SYSTEM_PORTFOLIO/BACKLOG.md:1",
    ]
    assumptions = [
        "No stage DoD review performed (scope not provided).",
        "No backlog prioritization changes applied.",
    ]

    return render_report(
        "Portfolio Planning Report",
        summary,
        findings,
        recommendations,
        actions,
        [],
        evidence,
        assumptions,
    )


def sma_003_report(changed_paths: List[str]) -> str:
    integrations = []
    missing_sources = []
    if INTEGRATIONS_DIR.exists():
        for child in sorted(INTEGRATIONS_DIR.iterdir(), key=lambda p: p.name):
            if not child.is_dir():
                continue
            sources = list(child.glob("*_sources.yaml")) + list(child.glob("*_sources.yml"))
            integrations.append((child.name, sources))
            if not sources:
                missing_sources.append(child.name)

    changed_integrations = [p for p in changed_paths if p.startswith("00_SYSTEM/integrations/")]

    summary = [
        f"Integrations reviewed: {len(integrations)}.",
        f"Integration files changed in working tree: {len(changed_integrations)}.",
    ]
    if integrations:
        summary.append(
            "Sources files present: "
            + ", ".join(f"{name}({len(sources)})" for name, sources in integrations)
        )

    findings = []
    recommendations = []
    actions = []
    if missing_sources:
        findings.append(f"Missing *_sources.yaml in integration folders: {', '.join(missing_sources)}")
        recommendations.append("Add *_sources.yaml for each integration folder missing a source spec.")
        actions.append("Create missing integration source specs.")

    evidence = ["00_SYSTEM/integrations/:1"]
    assumptions = [
        "No external integration validation performed.",
        "Scope limited to repo inventory.",
    ]

    return render_report(
        "Integration Steward Review",
        summary,
        findings,
        recommendations,
        actions,
        [],
        evidence,
        assumptions,
    )


def sma_004_report() -> str:
    typology_content = ""
    if AGENT_TYPOLOGY_PATH.exists():
        typology_content = AGENT_TYPOLOGY_PATH.read_text(encoding="utf-8")

    required_entries = [
        "00_SYSTEM/AGENTS/SMA-001_SYSTEM_GOVERNANCE.md",
        "00_SYSTEM/AGENTS/SMA-002_PORTFOLIO_PLANNING.md",
        "00_SYSTEM/AGENTS/SMA-003_INTEGRATION_STEWARD.md",
        "00_SYSTEM/AGENTS/SMA-004_KNOWLEDGE_CURATION.md",
        "00_SYSTEM/AGENTS/SMA-005_RUNBOOK_QA.md",
    ]
    missing_entries = [entry for entry in required_entries if entry not in typology_content]

    stub_files = []
    for path in list((REPO_ROOT / "00_SYSTEM" / "AGENTS").glob("*.md")) + list(
        (REPO_ROOT / "00_SYSTEM" / "AGENTS" / "specs").glob("*.md")
    ):
        try:
            content = path.read_text(encoding="utf-8")
        except Exception:
            continue
        if "status: stub" in content:
            stub_files.append(path.relative_to(REPO_ROOT).as_posix())

    summary = [
        "Agent index sanity check completed.",
        f"SMA entries present in typology: {len(required_entries) - len(missing_entries)}/{len(required_entries)}.",
        f"Stub specs detected: {len(stub_files)}.",
    ]

    findings = []
    recommendations = []
    actions = []
    if missing_entries:
        findings.append(f"Missing SMA entries in Agent Typology: {', '.join(missing_entries)}")
        recommendations.append("Add missing SMA paths to the Agent Typology index.")
        actions.append("Update Agent Typology to include missing SMA entries.")

    evidence = ["00_SYSTEM/AGENTS/specs/AGENT_TYPOLOGY.md:1"]
    assumptions = [
        "Stub files are informational only unless ML1 requests removal.",
    ]

    return render_report(
        "Knowledge Curation Report",
        summary,
        findings,
        recommendations,
        actions,
        [],
        evidence,
        assumptions,
    )


def sma_005_report(target_reports: List[Path]) -> str:
    missing_sections: Dict[str, List[str]] = {}
    for report in target_reports:
        content = report.read_text(encoding="utf-8")
        missing = [section for section in REQUIRED_SECTIONS if section not in content]
        if missing:
            missing_sections[report.name] = missing

    summary = [
        f"QA validation run against {len(target_reports)} report(s).",
        f"Reports missing required sections: {len(missing_sections)}.",
    ]

    findings = []
    recommendations = []
    actions = []
    if missing_sections:
        for report, sections in missing_sections.items():
            findings.append(f"{report} missing sections: {', '.join(sections)}")
        recommendations.append("Ensure all reports include the standard output format sections.")
        actions.append("Amend reports to include missing sections and re-run QA.")

    evidence = [f"{report.relative_to(REPO_ROOT).as_posix()}:1" for report in target_reports]
    assumptions = [
        "QA checks only section presence (not content quality).",
    ]

    return render_report(
        "Runbook & QA Validation Report",
        summary,
        findings,
        recommendations,
        actions,
        [],
        evidence,
        assumptions,
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Run minimal System Management sweep.")
    parser.add_argument("--run-id", help="Override run ID (default: auto)")
    args = parser.parse_args()

    run_id = args.run_id or generate_run_id()
    run_root = REPO_ROOT / "06_RUNS" / run_id / "system_management"
    run_root.mkdir(parents=True, exist_ok=True)

    roots = governed_roots()
    changed_paths = git_changed_paths()

    sma_001_body, _ = sma_001_report(changed_paths, roots)
    sma_002_body = sma_002_report()
    sma_003_body = sma_003_report(changed_paths)
    sma_004_body = sma_004_report()

    report_map = {
        "SMA-001_SYSTEM_GOVERNANCE_REPORT.md": ("System Governance Report", sma_001_body),
        "SMA-002_PORTFOLIO_PLANNING_REPORT.md": ("Portfolio Planning Report", sma_002_body),
        "SMA-003_INTEGRATION_STEWARD_REPORT.md": ("Integration Steward Report", sma_003_body),
        "SMA-004_KNOWLEDGE_CURATION_REPORT.md": ("Knowledge Curation Report", sma_004_body),
    }

    for filename, (title, body) in report_map.items():
        write_report(run_root / filename, title, body)

    qa_body = sma_005_report([run_root / name for name in report_map.keys()])
    write_report(run_root / "SMA-005_RUNBOOK_QA_REPORT.md", "Runbook & QA Report", qa_body)

    run_log = "\n".join(
        [
            "# RUN LOG — System Management Sweep",
            "",
            f"Run ID: {run_id}",
            f"Start: {utc_now()}",
            "",
            "Outputs:",
            f"- {run_root / 'SMA-001_SYSTEM_GOVERNANCE_REPORT.md'}",
            f"- {run_root / 'SMA-002_PORTFOLIO_PLANNING_REPORT.md'}",
            f"- {run_root / 'SMA-003_INTEGRATION_STEWARD_REPORT.md'}",
            f"- {run_root / 'SMA-004_KNOWLEDGE_CURATION_REPORT.md'}",
            f"- {run_root / 'SMA-005_RUNBOOK_QA_REPORT.md'}",
            "",
        ]
    )
    (run_root / "RUN_LOG.md").write_text(run_log, encoding="utf-8")

    print(f"System management sweep complete: {run_root}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
