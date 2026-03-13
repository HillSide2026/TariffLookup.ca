#!/usr/bin/env python3
"""
Weekly Operating Cycle Runner

Runs:
- System Admin Sweep
- System Management Sweep

Writes a run log to:
  06_RUNS/${run_id}/RUN_LOG.md
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Optional


REPO_ROOT = Path(__file__).resolve().parents[2]


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def generate_run_id() -> str:
    stamp = datetime.now(timezone.utc).strftime("%H%M%SZ")
    date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    return f"RUN-{date}-WEEKLY-CYCLE-{stamp}"


def run_script(script_path: Path) -> Dict[str, Optional[str]]:
    result = subprocess.run(
        ["python3", str(script_path)],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    stdout = result.stdout.strip()
    stderr = result.stderr.strip()

    run_root = None
    match = re.search(r"System .* sweep complete: (.*)$", stdout, flags=re.MULTILINE)
    if match:
        run_root = match.group(1).strip()

    return {
        "script": str(script_path.relative_to(REPO_ROOT)),
        "return_code": str(result.returncode),
        "run_root": run_root,
        "stdout": stdout,
        "stderr": stderr,
    }


def write_run_log(run_root: Path, admin_result: Dict[str, Optional[str]], mgmt_result: Dict[str, Optional[str]]) -> None:
    lines = [
        "# RUN LOG — Weekly Operating Cycle",
        "",
        f"Started: {utc_now()}",
        "",
        "## System Admin Sweep",
        f"- Script: {admin_result['script']}",
        f"- Return code: {admin_result['return_code']}",
        f"- Run root: {admin_result.get('run_root') or 'unknown'}",
        "",
        "## System Management Sweep",
        f"- Script: {mgmt_result['script']}",
        f"- Return code: {mgmt_result['return_code']}",
        f"- Run root: {mgmt_result.get('run_root') or 'unknown'}",
        "",
    ]
    run_root.mkdir(parents=True, exist_ok=True)
    (run_root / "RUN_LOG.md").write_text("\n".join(lines), encoding="utf-8")

    provenance = {
        "run_id": run_root.name,
        "started_at": utc_now(),
        "admin_sweep": admin_result,
        "management_sweep": mgmt_result,
    }
    (run_root / "provenance.json").write_text(json.dumps(provenance, indent=2), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Run the weekly operating cycle.")
    parser.add_argument("--run-id", help="Override run ID (default: auto)")
    args = parser.parse_args()

    run_id = args.run_id or generate_run_id()
    run_root = REPO_ROOT / "06_RUNS" / run_id

    admin_script = REPO_ROOT / "00_SYSTEM" / "scripts" / "run_system_admin_sweep.py"
    mgmt_script = REPO_ROOT / "00_SYSTEM" / "scripts" / "run_system_management_sweep.py"

    admin_result = run_script(admin_script)
    mgmt_result = run_script(mgmt_script)

    write_run_log(run_root, admin_result, mgmt_result)

    print(f"Weekly operating cycle complete: {run_root}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
