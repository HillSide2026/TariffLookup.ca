#!/usr/bin/env python3
"""Generate internal-only draft response scaffolds from ledger entries.

Stage 3.6 — Draft Responses (Internal Only).

Steps:
1) Load ledger and filter entries by task_id or matter_id
2) Load matter data for context enrichment
3) Generate draft scaffold(s) using the template
4) Write drafts to 06_RUNS/STAGE3.6/DRAFTS/
5) Write run log to 06_RUNS/STAGE3.6/

Does NOT:
- Write to external systems (Gmail, Sheets, Drive)
- Export or send drafts
- Mutate the ledger or system-of-record
- Generate send-ready wording
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

import yaml


REPO_ROOT = Path(__file__).resolve().parent.parent
LEDGER_PATH = REPO_ROOT / "06_RUNS" / "ops" / "MATTER_TODO_LEDGER.json"
MATTERS_ROOT = REPO_ROOT / "05_MATTERS"

DRAFTS_DIR = REPO_ROOT / "06_RUNS" / "STAGE3.6" / "DRAFTS"
STAGE36_DIR = REPO_ROOT / "06_RUNS" / "STAGE3.6"

# ---------------------------------------------------------------------------
# Boundary guard
# ---------------------------------------------------------------------------

APPROVED_WRITE_DIRS = [
    REPO_ROOT / "06_RUNS" / "STAGE3.6" / "DRAFTS",
    REPO_ROOT / "06_RUNS" / "STAGE3.6",
]

FORBIDDEN_DIRS = [
    REPO_ROOT / "09_INBOX",
    REPO_ROOT / "00_SYSTEM",
    REPO_ROOT / "01_DOCTRINE",
    REPO_ROOT / "05_MATTERS",
]


def assert_write_path_allowed(target: Path) -> None:
    """Boundary guard: ensure target path is within approved write directories.

    Raises PermissionError if the path is outside the approved tree or
    inside an explicitly forbidden directory.
    """
    resolved = str(target.resolve())

    for forbidden in FORBIDDEN_DIRS:
        fb = str(forbidden.resolve())
        if resolved == fb or resolved.startswith(fb + "/"):
            raise PermissionError(
                f"Boundary violation: write target {resolved} is inside "
                f"forbidden directory {forbidden}"
            )

    for approved in APPROVED_WRITE_DIRS:
        ab = str(approved.resolve())
        if resolved == ab or resolved.startswith(ab + "/"):
            return

    raise PermissionError(
        f"Boundary violation: write target {resolved} is not inside any "
        f"approved directory. Approved: {[str(d) for d in APPROVED_WRITE_DIRS]}"
    )


def safe_write(target: Path, content: str, dry_run: bool = False) -> None:
    """Write content to target path after boundary guard validation."""
    assert_write_path_allowed(target)
    if dry_run:
        print(f"  [DRY RUN] Would write: {target.relative_to(REPO_ROOT)}")
        return
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content)
    print(f"  Wrote: {target.relative_to(REPO_ROOT)}")


# ---------------------------------------------------------------------------
# Data loading
# ---------------------------------------------------------------------------

def load_ledger() -> Dict:
    if not LEDGER_PATH.exists():
        print(f"Error: Ledger not found at {LEDGER_PATH}")
        sys.exit(1)
    return json.loads(LEDGER_PATH.read_text())


def load_matters() -> Dict[str, Dict]:
    matters = {}
    for delivery_folder in ["ESSENTIAL", "STRATEGIC", "STANDARD", "PARKED"]:
        folder = MATTERS_ROOT / delivery_folder
        if not folder.exists():
            continue
        for item in folder.iterdir():
            if not item.is_dir() or item.name.startswith("."):
                continue
            matter = {
                "matter_id": item.name,
                "delivery_status": delivery_folder.lower(),
                "path": str(item),
            }
            yaml_path = item / "MATTER.yaml"
            if yaml_path.exists():
                try:
                    data = yaml.safe_load(yaml_path.read_text())
                    if data:
                        matter.update(data)
                except Exception:
                    pass
            readme_path = item / "README.md"
            if "matter_name" not in matter and readme_path.exists():
                try:
                    first_line = readme_path.read_text().split("\n", 1)[0].strip()
                    if first_line.startswith("# "):
                        matter["matter_name"] = first_line[2:]
                except Exception:
                    pass
            matters[matter["matter_id"]] = matter
    return matters


TERMINAL_STATUSES = {"DONE", "DROPPED"}


def filter_entries(
    ledger: Dict,
    task_ids: Optional[List[str]] = None,
    matter_ids: Optional[List[str]] = None,
) -> List[Dict]:
    """Filter ledger entries by task_id or matter_id, excluding terminal statuses."""
    results = []
    for entry in ledger.get("entries", []):
        if (entry.get("ledger_status") or "").upper() in TERMINAL_STATUSES:
            continue
        if task_ids and entry.get("task_id") not in task_ids:
            continue
        if matter_ids and entry.get("matter_id") not in matter_ids:
            continue
        results.append(entry)
    return results


# ---------------------------------------------------------------------------
# Draft classification
# ---------------------------------------------------------------------------

CLASSIFICATION_TAGS = {
    "NO_DIST": "Internal Draft \u2014 No Distribution",
    "ML1_REV": "Draft for ML1 Revision",
    "LEGAL_JUDGMENT": "Draft Requires Substantive Legal Judgment",
    "STRUCT_COMPLETE": "Draft Structurally Complete \u2014 Substantive Review Needed",
}


def classify_draft(entry: Dict) -> str:
    """Select draft classification tag based on ledger entry context."""
    action_type = entry.get("next_action_type", "OTHER")
    lane = entry.get("suggested_lane", "")

    if action_type in ("RESPOND", "DRAFT", "SEND_REQUEST"):
        if lane == "LAWYER":
            return CLASSIFICATION_TAGS["LEGAL_JUDGMENT"]
        return CLASSIFICATION_TAGS["ML1_REV"]

    if action_type == "REVIEW":
        return CLASSIFICATION_TAGS["STRUCT_COMPLETE"]

    return CLASSIFICATION_TAGS["NO_DIST"]


def derive_confidence_band(entry: Dict) -> str:
    confidence = (entry.get("confidence") or "medium").lower()
    routing_conf = (entry.get("routing_confidence") or "MEDIUM").upper()
    if confidence == "high" and routing_conf == "HIGH":
        return "High"
    if confidence == "low" or routing_conf == "LOW":
        return "Low"
    return "Medium"


# ---------------------------------------------------------------------------
# Scaffold bullet builder
# ---------------------------------------------------------------------------

def _build_scaffold_bullets(
    entry: Dict,
    evidence_quotes: List[str],
    variant_label: Optional[str] = None,
) -> List[str]:
    """Build placeholder bullets for the draft scaffold.

    These are structural prompts for ML1, not send-ready content.
    """
    action_type = entry.get("next_action_type", "OTHER")
    bullets = []

    # Variant framing hint
    if variant_label:
        VARIANT_HINTS = {
            "direct": "[Framing: direct, concise, action-oriented]",
            "empathetic": "[Framing: empathetic, relationship-preserving, acknowledgment-first]",
            "procedural": "[Framing: procedural, process-focused, step-by-step]",
            "informational": "[Framing: informational, context-heavy, explanatory]",
        }
        bullets.append(VARIANT_HINTS.get(variant_label, f"[Framing: {variant_label}]"))

    bullets.append("[Opening: acknowledge context / reference prior communication]")

    if action_type == "RESPOND":
        bullets.append("[Address the specific question or request from sender]")
        bullets.append("[Provide substantive response points (ML1 judgment required)]")
        if evidence_quotes:
            truncated = evidence_quotes[0][:80]
            bullets.append(f'[Reference point: "{truncated}..."]')
        bullets.append("[Next steps or expected timeline]")

    elif action_type == "DRAFT":
        bullets.append("[State purpose of the document/communication]")
        bullets.append("[Key terms or positions to include (ML1 to specify)]")
        bullets.append("[Conditions or qualifications]")
        bullets.append("[Closing / call to action]")

    elif action_type == "SEND_REQUEST":
        bullets.append("[State what is being requested]")
        bullets.append("[Provide context for why it is needed]")
        bullets.append("[Specify deadline or timeline if applicable]")
        bullets.append("[Closing / contact information]")

    elif action_type == "REVIEW":
        bullets.append("[Acknowledge receipt of material for review]")
        bullets.append("[Note preliminary observations (ML1 to add)]")
        bullets.append("[Timeline for completion of review]")

    elif action_type == "SCHEDULE":
        bullets.append("[Propose specific time(s) or availability]")
        bullets.append("[State purpose/agenda of meeting]")
        bullets.append("[Any preparation needed from recipient]")

    else:
        bullets.append("[State the key point or update]")
        bullets.append("[Provide supporting detail (ML1 to fill)]")
        bullets.append("[Next steps if any]")

    bullets.append("[Closing: professional sign-off placeholder]")
    return bullets


# ---------------------------------------------------------------------------
# Draft content generator
# ---------------------------------------------------------------------------

VARIANT_LABELS = ["direct", "empathetic", "procedural", "informational"]


def make_slug(entry: Dict, variant: Optional[int] = None) -> str:
    matter = entry.get("matter_id", "unknown")
    task_id = entry.get("task_id", "unknown")
    slug = f"{matter}-{task_id}"
    if variant is not None:
        slug += f"-v{variant}"
    return slug


def generate_draft_content(
    entry: Dict,
    matter: Dict,
    classification_tag: str,
    confidence_band: str,
    variant_label: Optional[str] = None,
) -> str:
    """Generate a single draft scaffold markdown file."""
    today = datetime.now().strftime("%Y-%m-%d")
    task_id = entry.get("task_id", "unknown")
    matter_id = entry.get("matter_id", "unknown")
    matter_name = matter.get("matter_name", matter_id)
    delivery_status = matter.get("delivery_status", "unknown")

    evidence_list = entry.get("evidence", [])
    recipient = ""
    subject = ""
    evidence_quotes = []
    source_artifacts = []

    for ev in evidence_list:
        if not recipient:
            recipient = ev.get("from", "")
        if not subject:
            subject = ev.get("subject", "")
        quote = ev.get("quote", "")
        if quote:
            evidence_quotes.append(quote)
        ref = ev.get("message_ref", "")
        if ref:
            source_artifacts.append(
                f"Email: {ev.get('subject', '')} ({ev.get('email_date', '')}) [ref: {ref}]"
            )

    task_text = entry.get("task", "")
    why = entry.get("why", "")

    source_artifacts.append(f"MATTER.yaml: {matter_id} ({matter_name})")
    source_artifacts.append(f"Ledger entry: {task_id}")

    assumptions = []
    if entry.get("suggested_workstream"):
        assumptions.append(f"Workstream: {entry['suggested_workstream']}")
    if entry.get("suggested_lane"):
        assumptions.append(f"Lane: {entry['suggested_lane']}")
    if delivery_status:
        assumptions.append(f"Matter priority: {delivery_status}")
    if not assumptions:
        assumptions.append("[No system assumptions \u2014 ML1 to fill]")

    missing = []
    if not recipient:
        missing.append("Recipient not identified from evidence")
    if not evidence_quotes:
        missing.append("No email body/quote available for context")
    if not entry.get("due"):
        missing.append("No deadline specified")
    missing.append("[ML1 to identify additional missing context]")

    scaffold_bullets = _build_scaffold_bullets(entry, evidence_quotes, variant_label)

    variant_header = f" (Variant: {variant_label})" if variant_label else ""

    lines = [
        "---",
        f"id: DRAFT-{today}-{task_id}",
        f'title: "Stage 3.6 Draft Response \u2014 {matter_id}{variant_header}"',
        "owner: ML1",
        "status: draft",
        f"created_date: {today}",
        f"last_updated: {today}",
        "tags: [stage3, draft, system-generated]",
        f"task_id: {task_id}",
        f"matter_id: {matter_id}",
        "agent: Draft Response Assistant (Stage 3.6)",
        f'classification_tag: "{classification_tag}"',
        "---",
        "",
        f"# Stage 3.6 Draft Response{variant_header}",
        "",
        "[STAGE-3.6 | INTERNAL DRAFT | NO DISTRIBUTION]",
        "",
        "## Draft Classification",
        f"- Tag: {classification_tag}",
        "",
        "## Context",
        f"- Recipient: {recipient or '[ML1 to specify]'}",
        f"- Purpose: {task_text}",
        f"- Desired outcome: {why or '[ML1 to specify]'}",
        f"- Matter: {matter_id} \u2014 {matter_name} [{delivery_status.upper()}]",
        f"- Original subject: {subject or '[unknown]'}",
        "",
        "## Source Artifacts",
    ]
    for sa in source_artifacts:
        lines.append(f"- {sa}")

    lines += ["", "## Assumptions"]
    for a in assumptions:
        lines.append(f"- {a}")

    lines += ["", "## Missing Information"]
    for m in missing:
        lines.append(f"- {m}")

    lines += [
        "",
        "## Confidence Band",
        f"- {confidence_band}",
        "",
        "## Draft Scaffold (Internal Only)",
        "",
    ]
    for bullet in scaffold_bullets:
        lines.append(f"- {bullet}")

    lines += ["", "[USE / IGNORE / DELETE]", ""]
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Run log
# ---------------------------------------------------------------------------

def generate_run_log(
    entries: List[Dict],
    draft_paths: List[Path],
    args: argparse.Namespace,
    start_time: datetime,
) -> str:
    today = datetime.now().strftime("%Y-%m-%d")
    duration = (datetime.now() - start_time).total_seconds()

    lines = [
        "---",
        f"id: RUN-{today}-STAGE3.6-draft-response",
        "title: Run Log \u2014 Stage 3.6 Draft Response Generator",
        "owner: ML1",
        "status: draft",
        f"created_date: {today}",
        f"last_updated: {today}",
        "tags: [run, stage3, draft, system-generated]",
        "agent: Draft Response Assistant (Stage 3.6)",
        "---",
        "",
        "# Run Log \u2014 Stage 3.6 Draft Response Generator",
        "",
        f"**Run date:** {today}",
        "**Agent:** Draft Response Assistant (Stage 3.6)",
        "**Parent:** `04_INITIATIVES/SYSTEM_PORTFOLIO/01_ACTIVE_ROADMAPS/STAGE3/PLAYBOOKS/DRAFT_RESPONSE_ASSISTANT.md`",
        f"**Duration:** {duration:.1f}s",
        f"**Mode:** {'DRY RUN' if args.dry_run else 'LIVE'}",
        "",
        "## Inputs",
        "",
        f"- Task IDs: {args.task_id or 'all matching'}",
        f"- Matter IDs: {args.matter_id or 'all matching'}",
        f"- Variants: {args.variants or 1}",
        f"- Entries processed: {len(entries)}",
        "",
        "## Outputs",
        "",
    ]
    for path in draft_paths:
        lines.append(f"- `{path.relative_to(REPO_ROOT)}`")

    lines += [
        "",
        "## Boundary Check",
        "",
        "- All writes validated against approved directory list",
        "- Approved directories: `06_RUNS/STAGE3.6/DRAFTS/`, `06_RUNS/STAGE3.6/`",
        "- Forbidden directories checked: `09_INBOX/`, `00_SYSTEM/`, `01_DOCTRINE/`, `05_MATTERS/`",
        "- Result: PASS",
        "",
    ]
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> int:
    parser = argparse.ArgumentParser(
        description="Stage 3.6 \u2014 Generate internal-only draft response scaffolds"
    )
    parser.add_argument(
        "--task-id", nargs="+", default=None,
        help="One or more task IDs to generate drafts for",
    )
    parser.add_argument(
        "--matter-id", nargs="+", default=None,
        help="One or more matter IDs (all matching entries)",
    )
    parser.add_argument(
        "--variants", type=int, default=0,
        help="Number of framing variants per entry (0-4, default: 0 = single draft)",
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Show what would be generated without writing files",
    )
    args = parser.parse_args()

    start_time = datetime.now()
    today = datetime.now().strftime("%Y-%m-%d")

    print("=" * 60)
    print("Stage 3.6 \u2014 Draft Response Generator")
    print("[INTERNAL ONLY | NO DISTRIBUTION]")
    print("=" * 60)

    if not args.task_id and not args.matter_id:
        print("Error: must provide --task-id or --matter-id")
        return 1

    # Step 1: Load ledger
    print("\nStep 1: Loading ledger...")
    ledger = load_ledger()
    print(f"  Ledger contains {len(ledger.get('entries', []))} entries")

    # Step 2: Filter entries
    print("Step 2: Filtering entries...")
    entries = filter_entries(ledger, task_ids=args.task_id, matter_ids=args.matter_id)
    print(f"  Found {len(entries)} matching entries")

    if not entries:
        print("No matching entries found. Exiting.")
        return 0

    # Step 3: Load matters
    print("Step 3: Loading matters...")
    matters = load_matters()
    print(f"  Loaded {len(matters)} matters")

    # Step 4: Generate drafts
    print("Step 4: Generating drafts...")
    draft_paths: List[Path] = []
    variant_labels = (
        VARIANT_LABELS[: min(args.variants, len(VARIANT_LABELS))]
        if args.variants > 0
        else [None]
    )

    for entry in entries:
        task_id = entry.get("task_id", "unknown")
        matter_id = entry.get("matter_id", "unknown")
        matter = matters.get(matter_id, {"matter_id": matter_id, "delivery_status": "unknown"})

        classification_tag = classify_draft(entry)
        confidence_band = derive_confidence_band(entry)

        print(f"\n  Entry: {task_id} | {matter_id} | {entry.get('next_action_type', 'OTHER')}")
        print(f"  Classification: {classification_tag}")
        print(f"  Confidence: {confidence_band}")

        for variant_label in variant_labels:
            vi = variant_labels.index(variant_label) + 1 if variant_label else None
            slug = make_slug(entry, variant=vi)
            filename = f"DRAFT-{today}-{slug}.md"
            target = DRAFTS_DIR / filename

            content = generate_draft_content(
                entry, matter, classification_tag, confidence_band, variant_label,
            )

            safe_write(target, content, dry_run=args.dry_run)
            draft_paths.append(target)

    # Step 5: Write run log
    print("\nStep 5: Writing run log...")
    run_slug = f"draft-response-{datetime.now().strftime('%H%M')}"
    run_log_path = STAGE36_DIR / f"RUN-{today}-{run_slug}.md"
    run_log_content = generate_run_log(entries, draft_paths, args, start_time)
    safe_write(run_log_path, run_log_content, dry_run=args.dry_run)

    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Entries processed:  {len(entries)}")
    print(f"Drafts generated:   {len(draft_paths)}")
    print(f"Variants per entry: {len(variant_labels)}")
    print(f"Output directory:   {DRAFTS_DIR.relative_to(REPO_ROOT)}")
    print(f"Run log:            {run_log_path.relative_to(REPO_ROOT)}")
    if args.dry_run:
        print("\n[DRY RUN] No files were written.")
    print("\nDraft Response Generator complete.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
