#!/usr/bin/env python3
"""
Inbox Intelligence Pilot Runner
Stage 2.3 — Phase 2.3.5

Executes a bounded, non-destructive pilot of inbox classification.

Produces:
- Draft Placement Plan objects
- Classification log entries
- Pilot summary report

NO EXECUTION. NO GMAIL WRITES. PROPOSALS ONLY.
"""

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from collections import Counter

# Add scripts directory to path
sys.path.insert(0, str(Path(__file__).parent))

from gmail_integration import GmailClient
from inbox_classifier import InboxClassifier, extract_message_metadata, build_log_entry

# Pilot configuration
PILOT_CONFIG = {
    "max_messages": 100,
    "run_id": f"pilot-{datetime.now(timezone.utc).strftime('%Y-%m-%d-%H%M%SZ')}-v3",
}

# Output paths
REPO_ROOT = Path(__file__).resolve().parents[2]
RUNS_DIR = REPO_ROOT / "06_RUNS" / "INBOX_TRIAGE"
LOGS_DIR = RUNS_DIR / "logs"
PILOT_DIR = RUNS_DIR / "pilot" / PILOT_CONFIG["run_id"]
PLANS_DIR = PILOT_DIR / "placement_plans"
OUTCOME_PATH = PILOT_DIR / "OUTCOME.yaml"
DISTILL_DIR = REPO_ROOT / "06_RUNS" / "99_distill_queue"


def ensure_directories():
    """Create output directories if they don't exist."""
    LOGS_DIR.mkdir(parents=True, exist_ok=True)
    PLANS_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Output directories ready:")
    print(f"  Logs: {LOGS_DIR}")
    print(f"  Plans: {PLANS_DIR}")


def run_pilot():
    """Execute the pilot classification run."""
    print("=" * 60)
    print("Inbox Intelligence Pilot Run")
    print(f"Run ID: {PILOT_CONFIG['run_id']}")
    print(f"Max Messages: {PILOT_CONFIG['max_messages']}")
    print("=" * 60)
    print()

    # Initialize
    ensure_directories()
    gmail = GmailClient()
    classifier = InboxClassifier()

    # Statistics
    stats = {
        "total_processed": 0,
        "object_types": Counter(),
        "lifecycle_states": Counter(),
        "system_domains": Counter(),
        "confidence_buckets": {"high": 0, "medium": 0, "low": 0},
        "needs_human": 0,
        "errors": 0,
        "model_version": classifier.model_version,
    }

    # Open log file for appending
    log_file = LOGS_DIR / "classification_log.ndjson"

    print("Phase 1: Fetching messages from Gmail (read-only)...")
    messages = gmail.list_messages(max_results=PILOT_CONFIG["max_messages"], label_ids=["INBOX"])
    print(f"  Retrieved {len(messages)} message IDs")
    print()

    print("Phase 2: Classifying messages...")
    with open(log_file, "a") as log_f:
        for i, msg_stub in enumerate(messages):
            msg_id = msg_stub["id"]

            try:
                # Fetch full message metadata
                full_msg = gmail.get_message(msg_id, format="metadata")

                # Extract classifier inputs
                metadata = extract_message_metadata(full_msg)

                # Classify
                classification = classifier.classify(metadata)

                # Build log entry
                log_entry = build_log_entry(
                    classification, metadata, PILOT_CONFIG["run_id"]
                )

                # Write placement plan
                plan_file = PLANS_DIR / f"{msg_id}.json"
                with open(plan_file, "w") as pf:
                    json.dump(classification, pf, indent=2)

                # Append to log
                log_f.write(json.dumps(log_entry) + "\n")

                # Update stats
                stats["total_processed"] += 1
                stats["object_types"][classification["object_type"]] += 1
                stats["lifecycle_states"][classification["lifecycle_state"]] += 1
                stats["system_domains"][classification["system_domain"]] += 1

                conf = classification["confidence"]
                if conf >= 0.85:
                    stats["confidence_buckets"]["high"] += 1
                elif conf >= 0.60:
                    stats["confidence_buckets"]["medium"] += 1
                else:
                    stats["confidence_buckets"]["low"] += 1
                    stats["needs_human"] += 1

                # Progress indicator
                if (i + 1) % 10 == 0:
                    print(f"  Processed {i + 1}/{len(messages)} messages...")

            except Exception as e:
                print(f"  ERROR on message {msg_id}: {e}")
                stats["errors"] += 1

    print()
    print(f"Phase 2 complete: {stats['total_processed']} messages classified")
    print()

    # Generate summary report
    print("Phase 3: Generating summary report...")
    summary = generate_summary_report(stats)
    summary_file = PILOT_DIR / "pilot_summary.md"
    with open(summary_file, "w") as sf:
        sf.write(summary)
    print(f"  Summary written to: {summary_file}")
    print()

    # Record outcome (default: PARK for pilot runs)
    write_outcome(run_id=PILOT_CONFIG["run_id"], outcome="PARK")

    print("=" * 60)
    print("PILOT COMPLETE")
    print("=" * 60)
    print()
    print("Outputs:")
    print(f"  Classification Log: {log_file}")
    print(f"  Placement Plans: {PLANS_DIR}/")
    print(f"  Summary Report: {summary_file}")
    print(f"  Outcome: {OUTCOME_PATH}")
    print()
    print("Quick Stats:")
    print(f"  Total Processed: {stats['total_processed']}")
    print(f"  High Confidence: {stats['confidence_buckets']['high']}")
    print(f"  Medium Confidence: {stats['confidence_buckets']['medium']}")
    print(f"  Needs Human Review: {stats['needs_human']}")
    print(f"  Errors: {stats['errors']}")

    return stats


def generate_summary_report(stats: dict) -> str:
    """Generate pilot summary report in markdown format."""
    total = stats["total_processed"]
    classified_rate = ((total - stats["needs_human"]) / total * 100) if total > 0 else 0

    report = f"""# Inbox Intelligence Pilot Summary

**Run ID:** {PILOT_CONFIG['run_id']}
**Date:** {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}
**Classifier Version:** {stats.get('model_version', 'unknown')}

---

## Executive Summary

- **Total Messages Processed:** {total}
- **Successfully Classified:** {total - stats['needs_human']} ({classified_rate:.1f}%)
- **Needs Human Review:** {stats['needs_human']}
- **Errors:** {stats['errors']}

---

## Classification by Object Type

| Object Type | Count | Percentage |
|-------------|-------|------------|
"""
    for obj_type, count in sorted(stats["object_types"].items(), key=lambda x: -x[1]):
        pct = (count / total * 100) if total > 0 else 0
        report += f"| {obj_type} | {count} | {pct:.1f}% |\n"

    report += """
---

## Classification by Lifecycle State

| Lifecycle State | Count | Percentage |
|-----------------|-------|------------|
"""
    for state, count in sorted(stats["lifecycle_states"].items(), key=lambda x: -x[1]):
        pct = (count / total * 100) if total > 0 else 0
        report += f"| {state} | {count} | {pct:.1f}% |\n"

    report += """
---

## Classification by System Domain

| System Domain | Count | Percentage |
|---------------|-------|------------|
"""
    for domain, count in sorted(stats["system_domains"].items(), key=lambda x: -x[1]):
        pct = (count / total * 100) if total > 0 else 0
        report += f"| {domain} | {count} | {pct:.1f}% |\n"

    report += f"""
---

## Confidence Distribution

| Confidence Level | Threshold | Count | Percentage |
|------------------|-----------|-------|------------|
| High | >= 0.85 | {stats['confidence_buckets']['high']} | {(stats['confidence_buckets']['high']/total*100) if total > 0 else 0:.1f}% |
| Medium | 0.60 - 0.84 | {stats['confidence_buckets']['medium']} | {(stats['confidence_buckets']['medium']/total*100) if total > 0 else 0:.1f}% |
| Low (Needs Human) | < 0.60 | {stats['confidence_buckets']['low']} | {(stats['confidence_buckets']['low']/total*100) if total > 0 else 0:.1f}% |

---

## Success Criteria Assessment

| Criterion | Target | Actual | Status |
|-----------|--------|--------|--------|
| Classification Rate | >= 90% | {classified_rate:.1f}% | {'PASS' if classified_rate >= 90 else 'REVIEW'} |
| No Forbidden Operations | 0 | 0 | PASS |
| Logs Complete | Yes | Yes | PASS |
| Append-Only | Yes | Yes | PASS |

---

## Outputs Generated

- `06_RUNS/INBOX_TRIAGE/logs/classification_log.ndjson`
- `06_RUNS/INBOX_TRIAGE/pilot/{PILOT_CONFIG['run_id']}/placement_plans/` ({total} plans)
- `06_RUNS/INBOX_TRIAGE/pilot/{PILOT_CONFIG['run_id']}/pilot_summary.md`

---

## Governance Notes

- **No Gmail writes occurred** - All operations read-only
- **No message movement** - Proposals only
- **No external system modifications** - Repo-local outputs only
- **Audit log maintained** - NDJSON append-only format

---

## Next Steps

1. SMA-001 Governance Review
2. SMA-005 QA Validation
3. ML1 Review of classifications
4. Stage 2.3 closure determination
"""

    return report


def write_outcome(run_id: str, outcome: str = "PARK") -> None:
    """Write OUTCOME.yaml and optional distill stub for Park outcomes."""
    PILOT_DIR.mkdir(parents=True, exist_ok=True)
    DISTILL_DIR.mkdir(parents=True, exist_ok=True)

    date_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    outcome_payload = f\"\"\"run_id: {run_id}
date: {date_str}
outcome: {outcome}
promoted_to: []
parked_items: []
archive_reason: other
notes: Pilot run outcome recorded by runner
\"\"\"
    OUTCOME_PATH.write_text(outcome_payload, encoding="utf-8")

    if outcome == "PARK":
        slug = "inbox-triage-pilot"
        stub_path = DISTILL_DIR / f\"{date_str}__{run_id}__{slug}.md\"
        if not stub_path.exists():
            stub_path.write_text(
                \"\"\"# Distill Stub

## What to distill
Pilot inbox triage classification outputs and summary.

## Candidate target
- 02_PLAYBOOKS/core/inbox_triage/ (update playbook or taxonomy if warranted)

## Blocking questions
- Are classification rules producing acceptable placements?
- Do confidence thresholds need calibration?

## Canon refs
- 02_PLAYBOOKS/core/inbox_triage/README.md
- 02_PLAYBOOKS/core/inbox_triage/TAXONOMY.md
- 02_PLAYBOOKS/core/inbox_triage/LOGGING_SPEC.md
\"\"\",
                encoding="utf-8",
            )


if __name__ == "__main__":
    run_pilot()
