#!/usr/bin/env python3
"""Run the Matter Dashboard daily cycle.

Steps:
1) Fetch emails (Gmail API, last N days)
2) Prefilter noise (deterministic)
3) Classify + attribute to matters
4) Update participant_mapping.yaml (auto-discovered senders)
5) Reconcile ledger → MATTER_TODO_LEDGER.json
6) Push ledger to Google Sheets (new dated tab)
7) Generate MATTER_TODO_REPORT.md
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import subprocess
from copy import deepcopy
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Tuple, Optional

import yaml
from dotenv import load_dotenv

# Local imports
from todo_rollup import (
    EmailClass,
    SPECIAL_MATTER_IDS,
    build_participant_mapping,
    create_dedup_key,
    extract_deadline,
    fetch_emails,
    generate_report,
    load_matters,
    map_email_to_matter,
    normalize_task,
)
import prefilter_emails as prefilter


REPO_ROOT = Path(__file__).resolve().parent.parent
OPS_DIR = REPO_ROOT / "06_RUNS" / "ops"

GMAIL_FETCH_PATH = OPS_DIR / "gmail_fetch_latest.json"
PREFILTER_PATH = OPS_DIR / "emails_prefiltered.json"
ATTRIBUTED_PATH = OPS_DIR / "emails_attributed.json"
LEDGER_PATH = OPS_DIR / "MATTER_TODO_LEDGER.json"
REPORT_PATH = OPS_DIR / "MATTER_TODO_REPORT.md"
LABEL_MANIFEST_PATH = OPS_DIR / "gmail_label_manifest_proposed.json"

PARTICIPANT_MAPPING_PATH = REPO_ROOT / "00_SYSTEM" / "participant_mapping.yaml"

# Optional Google Sheets integration lives in todo_runner
TODO_RUNNER_DIR = REPO_ROOT / "04_INITIATIVES" / "LL_PORTFOLIO" / "05_MATTER_DOCKETING" / "todo_runner"
if str(TODO_RUNNER_DIR) not in sys.path:
    sys.path.insert(0, str(TODO_RUNNER_DIR))


def normalize_for_task_id(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def stable_task_id(task_text: str, matter_id: str, message_ref: str) -> str:
    normalized = normalize_for_task_id(task_text)
    seed = f"{normalized}|{matter_id}|{message_ref}"
    return hashlib.md5(seed.encode("utf-8")).hexdigest()[:12]


def today_str() -> str:
    return datetime.now().strftime("%Y-%m-%d")


def parse_internal_date(email: Dict) -> str:
    internal_date = email.get("internal_date", "")
    if internal_date:
        try:
            dt = datetime.fromtimestamp(int(internal_date) / 1000)
            return dt.strftime("%Y-%m-%d")
        except Exception:
            return ""
    return ""


def extract_evidence_quote(body: str, snippet: str) -> str:
    text = body or snippet or ""
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) > 200:
        return text[:197] + "..."
    return text


def compute_routing_defaults() -> Tuple[str, str, str, str, str]:
    return ("UNROUTED", "UNROUTED", "LOW", "Default routing (not classified)", "OTHER")


def load_ledger() -> Dict:
    if LEDGER_PATH.exists():
        return json.loads(LEDGER_PATH.read_text())
    return {"version": "2.0", "last_run": None, "entries": []}


# Human-editable fields that the Sheets read-back should honor
HUMAN_FIELDS = {"STATUS", "OWNER", "DUE"}
# Map Sheets header names → ledger JSON field names
SHEETS_TO_LEDGER = {"STATUS": "ledger_status", "OWNER": "owner", "DUE": "due"}


def read_back_from_sheets(ledger: Dict, dry_run: bool) -> int:
    """Read the most recent Sheets tab and merge human edits into the ledger.

    Returns the number of fields updated.
    """
    if dry_run:
        return 0

    try:
        from auth_google import get_sheets
    except Exception:
        return 0

    doc_id = os.environ.get("LEDGER_DOC_ID")
    if not doc_id:
        return 0

    sheets = get_sheets()

    # Get all sheet tabs, find the most recent (index 0 = leftmost = newest)
    meta = sheets.spreadsheets().get(
        spreadsheetId=doc_id, fields="sheets.properties"
    ).execute()
    sheet_tabs = meta.get("sheets", [])
    if not sheet_tabs:
        return 0

    # Sort by index to find the leftmost (most recent) tab
    sheet_tabs.sort(key=lambda s: s["properties"]["index"])
    latest_tab = sheet_tabs[0]["properties"]["title"]

    # Read all values from the latest tab
    result = sheets.spreadsheets().values().get(
        spreadsheetId=doc_id, range="{}!A:R".format(latest_tab)
    ).execute()
    rows = result.get("values", [])
    if len(rows) < 2:
        return 0

    header = rows[0]
    # Find column indices for TASK_ID and human-editable fields
    col_map = {}
    for i, h in enumerate(header):
        if h in ("TASK_ID",) or h in HUMAN_FIELDS:
            col_map[h] = i

    if "TASK_ID" not in col_map:
        return 0

    task_id_col = col_map["TASK_ID"]

    # Build lookup: task_id → {field: value} from Sheets
    sheets_edits = {}
    for row in rows[1:]:
        if len(row) <= task_id_col:
            continue
        tid = row[task_id_col].strip()
        if not tid:
            continue
        edits = {}
        for field_name in HUMAN_FIELDS:
            if field_name not in col_map:
                continue
            idx = col_map[field_name]
            val = row[idx].strip() if len(row) > idx else ""
            edits[field_name] = val
        sheets_edits[tid] = edits

    # Merge into ledger entries
    updated = 0
    for entry in ledger.get("entries", []):
        tid = entry.get("task_id", "")
        if tid not in sheets_edits:
            continue
        for sheets_field, ledger_field in SHEETS_TO_LEDGER.items():
            sheets_val = sheets_edits[tid].get(sheets_field, "")
            if not sheets_val:
                continue
            current = entry.get(ledger_field) or ""
            if str(current) != sheets_val:
                entry[ledger_field] = sheets_val if sheets_val else None
                updated += 1

    return updated


def write_ledger(ledger: Dict) -> None:
    LEDGER_PATH.parent.mkdir(parents=True, exist_ok=True)
    LEDGER_PATH.write_text(json.dumps(ledger, indent=2, ensure_ascii=False))


def reconcile_ledger(actions: List[Dict], ledger: Dict) -> Tuple[Dict, int]:
    entries = ledger.get("entries", [])
    by_id = {e.get("task_id"): e for e in entries if e.get("task_id")}

    seen_today = set()
    for task in actions:
        task_id = task["task_id"]
        seen_today.add(task_id)
        if task_id in by_id:
            entry = by_id[task_id]
            entry["last_seen"] = today_str()
            # Append evidence if new
            new_evidence = task.get("evidence", [])
            if new_evidence:
                existing = entry.get("evidence", [])
                existing_refs = {e.get("message_ref") for e in existing}
                for ev in new_evidence:
                    if ev.get("message_ref") not in existing_refs:
                        existing.append(ev)
                entry["evidence"] = existing
            continue

        # New entry
        workstream, lane, routing_conf, routing_reason, next_action = compute_routing_defaults()
        entry = {
            "task_id": task_id,
            "matter_id": task["matter_id"],
            "classification": "ACTION_REQUIRED",
            "task": task["task_text"],
            "why": task.get("why"),
            "due": task.get("deadline"),
            "owner": None,
            "confidence": task.get("confidence", "medium"),
            "badge": "NEW",
            "last_seen": today_str(),
            "first_seen": today_str(),
            "ledger_status": "NEW",
            "suggested_workstream": workstream,
            "suggested_lane": lane,
            "routing_confidence": routing_conf,
            "routing_reason": routing_reason,
            "next_action_type": next_action,
            "evidence": task.get("evidence", []),
        }
        entries.append(entry)
        by_id[task_id] = entry

    # Staleness check for NEW tasks
    stale_count = 0
    threshold = datetime.now() - timedelta(days=14)
    for entry in entries:
        if entry.get("ledger_status") != "NEW":
            continue
        last_seen = entry.get("last_seen")
        if not last_seen:
            continue
        try:
            dt = datetime.strptime(last_seen, "%Y-%m-%d")
        except Exception:
            continue
        if dt < threshold:
            entry["ledger_status"] = "STALE"
            stale_count += 1

    ledger["entries"] = entries
    ledger["last_run"] = datetime.now().isoformat()
    if "version" not in ledger:
        ledger["version"] = "2.0"

    # Carry-forward count: unresolved ledger tasks not seen today
    carry_forward = 0
    for entry in entries:
        if entry.get("ledger_status") in {"NEW", "TRIAGED", "WAITING", "STALE"}:
            if entry.get("task_id") not in seen_today:
                carry_forward += 1

    return ledger, carry_forward


def prefilter_emails(emails: List[Dict]) -> Tuple[List[Dict], Dict, Dict]:
    results = {
        "no_action": [],
        "self_sent": [],
        "candidates": [],
    }

    for email in emails:
        from_field = email.get("from", "")
        subject = email.get("subject", "")
        email_addr = prefilter.extract_email_address(from_field)
        domain = prefilter.extract_domain(email_addr)

        if prefilter.is_self_sent(from_field):
            results["self_sent"].append({
                "message_id": email.get("id"),
                "from": from_field,
                "subject": subject,
                "date": email.get("date", ""),
                "reason": "self_sent",
            })
            continue

        if prefilter.is_excluded_domain(domain):
            results["no_action"].append({
                "message_id": email.get("id"),
                "from": from_field,
                "subject": subject,
                "date": email.get("date", ""),
                "reason": f"excluded_domain:{domain}",
            })
            continue

        if prefilter.is_automated_sender(from_field):
            results["no_action"].append({
                "message_id": email.get("id"),
                "from": from_field,
                "subject": subject,
                "date": email.get("date", ""),
                "reason": "automated_sender",
            })
            continue

        if prefilter.is_no_action_subject(subject):
            results["no_action"].append({
                "message_id": email.get("id"),
                "from": from_field,
                "subject": subject,
                "date": email.get("date", ""),
                "reason": "no_action_subject",
            })
            continue

        results["candidates"].append(email)

    summary = {
        "total_emails": len(emails),
        "no_action_count": len(results["no_action"]),
        "self_sent_count": len(results["self_sent"]),
        "candidate_count": len(results["candidates"]),
    }

    output = {
        "prefilter_summary": summary,
        "input_window_days": None,
        "candidates": results["candidates"],
        "no_action": results["no_action"],
        "self_sent": results["self_sent"],
    }

    return results["candidates"], summary, output


def update_participant_mapping(new_mappings: Dict[str, str]) -> int:
    if not new_mappings:
        return 0

    existing = {}
    if PARTICIPANT_MAPPING_PATH.exists():
        try:
            with open(PARTICIPANT_MAPPING_PATH, "r") as f:
                data = yaml.safe_load(f) or {}
                if isinstance(data, dict):
                    existing = {k.lower(): v for k, v in data.items()}
        except Exception:
            existing = {}

    # Filter out existing keys
    additions = {k: v for k, v in new_mappings.items() if k not in existing}
    if not additions:
        return 0

    backup_path = PARTICIPANT_MAPPING_PATH.with_suffix(".yaml.bak")
    if PARTICIPANT_MAPPING_PATH.exists():
        backup_path.write_text(PARTICIPANT_MAPPING_PATH.read_text())

    content = PARTICIPANT_MAPPING_PATH.read_text() if PARTICIPANT_MAPPING_PATH.exists() else ""
    marker = "# AUTO-DISCOVERED MAPPINGS"
    if marker not in content:
        content = content.rstrip() + "\n\n# =============================================================================\n" + marker + "\n# Added by run_matter_dashboard.py\n"

    block_lines = [f"# Generated: {datetime.now().strftime('%Y-%m-%d')}"]
    for key in sorted(additions.keys()):
        block_lines.append(f"{key}: \"{additions[key]}\"")

    content = content.rstrip() + "\n" + "\n".join(block_lines) + "\n"
    PARTICIPANT_MAPPING_PATH.write_text(content)
    return len(additions)


def push_ledger_to_sheets(ledger: Dict, matters: Dict, dry_run: bool) -> None:
    if dry_run:
        print("[DRY RUN] Skipping Google Sheets push")
        return

    try:
        from auth_google import get_drive, get_sheets
        from boundary import assert_doc_in_approved_folder
    except Exception as e:
        print(f"Sheets push skipped: auth modules unavailable ({e})")
        return

    doc_id = os.environ.get("LEDGER_DOC_ID")
    if not doc_id:
        print("Sheets push skipped: LEDGER_DOC_ID not set")
        return

    drive = get_drive()
    sheets = get_sheets()
    assert_doc_in_approved_folder(drive, doc_id)

    # Timestamped tab name per spec
    tab_name = datetime.now().strftime("%Y-%m-%d_%H%M")
    body = {"requests": [{"addSheet": {"properties": {"title": tab_name, "index": 0}}}]}
    sheets.spreadsheets().batchUpdate(spreadsheetId=doc_id, body=body).execute()

    # Sort per Ledger Spec Section 8:
    #   1. suggested_workstream (DELIVERY → FULFILLMENT → MARKETING → MANAGEMENT → UNROUTED)
    #   2. delivery_status (ESSENTIAL → STRATEGIC → STANDARD → PARKED)
    #   3. matter_id (ascending, groups matter tasks together)
    #   4. task_id (ascending within matter)
    WORKSTREAM_ORDER = {"DELIVERY": 0, "FULFILLMENT": 1, "MARKETING": 2, "MANAGEMENT": 3, "UNROUTED": 4}
    DELIVERY_STATUS_ORDER = {"essential": 0, "strategic": 1, "standard": 2, "parked": 3}

    entries = list(ledger.get("entries", []))
    entries.sort(key=lambda e: (
        WORKSTREAM_ORDER.get(e.get("suggested_workstream", "UNROUTED"), 99),
        DELIVERY_STATUS_ORDER.get(
            matters.get(e.get("matter_id", ""), {}).get("delivery_status", ""), 99
        ),
        e.get("matter_id", ""),
        e.get("task_id", ""),
    ))

    headers = [
        "TASK_ID", "MATTER_ID", "CLASSIFICATION", "TASK", "WHY", "DUE",
        "STATUS", "OWNER", "CONFIDENCE", "BADGE", "LAST_SEEN", "FIRST_SEEN",
        "SUGGESTED_WORKSTREAM", "SUGGESTED_LANE", "ROUTING_CONFIDENCE",
        "ROUTING_REASON", "NEXT_ACTION_TYPE", "EVIDENCE_SUMMARY",
    ]

    values = [headers]
    for entry in entries:
        evidence = entry.get("evidence", [])
        ev_summary = ""
        if evidence:
            parts = []
            for ev in evidence:
                parts.append("{}: {} ({})".format(
                    ev.get("from", ""), ev.get("subject", ""), ev.get("email_date", "")
                ))
            ev_summary = "; ".join(parts)

        values.append([
            entry.get("task_id", ""),
            entry.get("matter_id", ""),
            entry.get("classification", ""),
            entry.get("task", ""),
            entry.get("why", ""),
            entry.get("due") or "",
            entry.get("ledger_status", ""),
            entry.get("owner") or "",
            entry.get("confidence", ""),
            entry.get("badge", ""),
            entry.get("last_seen", ""),
            entry.get("first_seen", ""),
            entry.get("suggested_workstream", ""),
            entry.get("suggested_lane", ""),
            entry.get("routing_confidence", ""),
            entry.get("routing_reason", ""),
            entry.get("next_action_type", ""),
            ev_summary,
        ])

    sheets.spreadsheets().values().update(
        spreadsheetId=doc_id,
        range="{}!A1".format(tab_name),
        valueInputOption="RAW",
        body={"values": values},
    ).execute()

    print("Ledger pushed to Sheets tab: {} ({} rows)".format(tab_name, len(values) - 1))


DELIVERY_STATUS_LABELS = {
    "essential": "1.1 - Essential",
    "strategic": "1.2 - Strategic",
    "standard": "1.3 - Standard",
    "parked": "1.4 - Parked",
}


def label_schema(delivery_status: str, matter_id: str, matter_name: str = "") -> str:
    status_label = DELIVERY_STATUS_LABELS.get(delivery_status.lower(), delivery_status)
    label = f"LL/1./{status_label}/{matter_id}"
    if matter_name:
        label += f" -- {matter_name}"
    return label


def label_schema_valid(label: str, matter_id: str) -> bool:
    pattern = r"^LL/1\./\d+\.\d+ - [A-Z][a-z]+/\d{2}-\d{3,4}-\d{5}( -- .+)?$"
    if not re.match(pattern, label):
        return False
    # Extract matter segment (4th /-delimited part) and verify it starts with matter_id
    parts = label.split("/")
    if len(parts) < 4:
        return False
    matter_segment = parts[3]
    return matter_segment == matter_id or matter_segment.startswith(f"{matter_id} -- ")


def mapping_method_allowed(method: str) -> bool:
    return method in {
        "clio_tag",
        "clio_tag_fuzzy",
        "thread_reuse",
        "participant_domain",
        "participant_email",
        "participant_name",
    }


def build_label_manifest(attributed: List[Dict], matters: Dict[str, Dict], approval_artifact: str) -> Dict:
    actions = []
    for email in attributed:
        matter_id = email.get("matter_id")
        if not matter_id or matter_id == "UNASSIGNED" or matter_id in SPECIAL_MATTER_IDS:
            continue
        method = email.get("mapping_method")
        if not mapping_method_allowed(method):
            continue

        matter = matters.get(matter_id, {})
        delivery_status = matter.get("delivery_status")
        if not delivery_status:
            continue

        matter_name = matter.get("matter_name", "")
        label = label_schema(delivery_status, matter_id, matter_name)
        if not label_schema_valid(label, matter_id):
            continue

        actions.append({
            "message_id": email.get("id") or email.get("message_id"),
            "gmail_thread_id": email.get("thread_id", ""),
            "matter_id": matter_id,
            "label": label,
            "operation": "add",
            "reason": f"deterministic mapping: {method}",
        })

    return {
        "run_id": f"RUN-{today_str()}-gmail-labeling",
        "approved_by": "ML1",
        "approval_artifact": approval_artifact or "",
        "actions": actions,
    }


def main() -> int:
    load_dotenv(REPO_ROOT / ".env")

    parser = argparse.ArgumentParser(description="Run Matter Dashboard daily cycle")
    parser.add_argument("--days", type=int, default=2, help="Email lookback window")
    parser.add_argument("--dry-run", action="store_true", help="Skip external I/O")
    parser.add_argument("--label-manifest", action="store_true", help="Generate Gmail label manifest")
    parser.add_argument("--label-execute", action="store_true", help="Execute Gmail labeling via gmail_labeler.py")
    parser.add_argument("--approval-artifact", type=str, default="", help="Approval artifact path for labeling run")
    args = parser.parse_args()

    print("=" * 60)
    print("Matter Dashboard — Daily Run")
    print("=" * 60)

    # Step 1: Fetch emails
    emails = fetch_emails(days=args.days, dry_run=args.dry_run)

    # Persist fetch output (best effort)
    OPS_DIR.mkdir(parents=True, exist_ok=True)
    with open(GMAIL_FETCH_PATH, "w") as f:
        json.dump({
            "fetched_at": datetime.now().isoformat(),
            "input_window_days": args.days,
            "emails_count": len(emails),
            "emails": emails,
        }, f, indent=2, ensure_ascii=False)

    if args.dry_run and not emails:
        print("[DRY RUN] No emails fetched")
        return 0

    # Step 2: Prefilter
    candidates, prefilter_summary, prefilter_output = prefilter_emails(emails)
    prefilter_output["input_window_days"] = args.days
    PREFILTER_PATH.write_text(json.dumps(prefilter_output, indent=2, ensure_ascii=False))

    # Step 3: Load matters + mapping
    matters = load_matters()
    participant_mapping = build_participant_mapping(matters)

    # Step 4: Attribute emails
    thread_mapping = {}
    attributed = []
    new_mappings = {}

    for email in candidates:
        matter_id, mapping_method, suggested = map_email_to_matter(
            email, participant_mapping, thread_mapping, matters
        )

        if email.get("thread_id") and matter_id != "UNASSIGNED":
            thread_mapping[email["thread_id"]] = matter_id

        email_copy = deepcopy(email)
        email_copy["matter_id"] = matter_id
        email_copy["mapping_method"] = mapping_method
        email_copy["suggested_match"] = suggested
        attributed.append(email_copy)

        # Auto-discover sender → matter mapping
        sender = email.get("sender", {}).get("email") or ""
        sender = sender.lower()
        if not sender or matter_id in SPECIAL_MATTER_IDS or matter_id == "UNASSIGNED":
            continue

        if prefilter.is_self_sent(sender):
            continue

        if "@" in sender:
            prefix = re.sub(r"[^a-z0-9]", "", sender.split("@")[0])
            domain_full = sender.split("@")[1].lower()
            domain_root = domain_full.split(".")[0]

            for key in [prefix, domain_full, domain_root]:
                if not key:
                    continue
                if key not in participant_mapping:
                    new_mappings[key] = matter_id

    ATTRIBUTED_PATH.write_text(json.dumps({
        "generated_at": datetime.now().isoformat(),
        "emails": attributed,
    }, indent=2, ensure_ascii=False))

    # Step 5: Extract tasks
    actions = []
    waiting = []
    excluded = prefilter_output["no_action"]
    seen_dedup = set()

    for email in attributed:
        classification = email.get("classification")
        matter_id = email.get("matter_id", "UNASSIGNED")
        mapping_method = email.get("mapping_method")
        suggested = email.get("suggested_match")

        evidence_date = parse_internal_date(email)

        if classification == EmailClass.WAITING_ON_OTHER:
            body = email.get("body", email.get("snippet", ""))
            summary = body[:100].replace("\n", " ").strip()
            if len(body) > 100:
                summary += "..."
            waiting.append({
                "matter_id": matter_id,
                "summary": summary,
                "from": email.get("from", ""),
                "subject": email.get("subject", ""),
                "evidence_date": evidence_date,
            })
            continue

        if classification != EmailClass.ACTION_REQUIRED:
            continue

        body = email.get("body", email.get("snippet", ""))
        task_text = normalize_task(body)
        if not task_text:
            continue

        dedup_key = create_dedup_key(matter_id, task_text)
        if dedup_key in seen_dedup:
            continue
        seen_dedup.add(dedup_key)

        deadline = extract_deadline(body)
        message_ref = email.get("id") or ""
        task_id = stable_task_id(task_text, matter_id, message_ref)

        evidence = [{
            "email_date": evidence_date,
            "from": email.get("from", ""),
            "subject": email.get("subject", ""),
            "quote": extract_evidence_quote(body, email.get("snippet", "")),
            "message_ref": message_ref,
        }]

        task = {
            "task_id": task_id,
            "matter_id": matter_id,
            "task_text": task_text,
            "deadline": deadline,
            "evidence_date": evidence_date,
            "evidence_subject": email.get("subject", ""),
            "evidence_from": email.get("from", ""),
            "mapping_method": mapping_method,
            "suggested_match": suggested,
            "why": "Derived from email request",
            "confidence": "medium",
            "evidence": evidence,
        }
        actions.append(task)

    # Step 6a: Load ledger and read back human edits from Sheets
    ledger = load_ledger()
    edits = read_back_from_sheets(ledger, dry_run=args.dry_run)
    if edits:
        print("Read back {} human edit(s) from Sheets".format(edits))

    # Step 6b: Reconcile ledger with today's extracted tasks
    ledger, carry_forward = reconcile_ledger(actions, ledger)
    write_ledger(ledger)

    # Step 7: Update participant mapping
    added = update_participant_mapping(new_mappings)
    if added:
        print(f"Updated participant_mapping.yaml with {added} new entries")

    # Step 8: Generate report
    summary = {
        "days": args.days,
        "emails_scanned": len(candidates),
        "action_required": sum(1 for e in candidates if e.get("classification") == EmailClass.ACTION_REQUIRED),
        "waiting_on_other": sum(1 for e in candidates if e.get("classification") == EmailClass.WAITING_ON_OTHER),
        "info_only": sum(1 for e in candidates if e.get("classification") == EmailClass.INFO_ONLY),
        "no_action": prefilter_summary["no_action_count"],
        "total_tasks": len(actions),
        "with_deadlines": sum(1 for t in actions if t.get("deadline")),
        "unassigned": sum(1 for t in actions if t["matter_id"] == "UNASSIGNED"),
    }

    report_body = generate_report(actions, waiting, excluded, summary, matters)

    frontmatter = {
        "generated_on": datetime.now().isoformat(),
        "input_window_days": args.days,
        "emails_scanned": len(candidates),
        "classification_counts": {
            "ACTION_REQUIRED": summary["action_required"],
            "WAITING_ON_OTHER": summary["waiting_on_other"],
            "INFO_ONLY": summary["info_only"],
            "NO_ACTION": summary["no_action"],
        },
        "tasks_generated": len(actions),
        "tasks_with_deadlines": summary["with_deadlines"],
        "tasks_unassigned": summary["unassigned"],
        "tasks_unrouted": 0,
        "ledger_carry_forward_count": carry_forward,
        "version": "3.0",
    }

    REPORT_PATH.write_text(
        "---\n" + yaml.safe_dump(frontmatter, sort_keys=False).strip() + "\n---\n\n" + report_body
    )

    # Step 9: Push ledger to Sheets
    push_ledger_to_sheets(ledger, matters, dry_run=args.dry_run)

    # Step 10: Optional Gmail labeling manifest + execution
    if args.label_manifest:
        manifest = build_label_manifest(attributed, matters, args.approval_artifact)
        LABEL_MANIFEST_PATH.write_text(json.dumps(manifest, indent=2))
        print(f"Wrote Gmail label manifest: {LABEL_MANIFEST_PATH}")

        if args.label_execute:
            if args.dry_run:
                print("[DRY RUN] Skipping Gmail label execution")
            else:
                cmd = [
                    sys.executable,
                    str(REPO_ROOT / "scripts" / "gmail_labeler.py"),
                    "--manifest",
                    str(LABEL_MANIFEST_PATH),
                    "--execute",
                ]
                subprocess.run(cmd, check=False)

    print("Matter Dashboard complete")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
