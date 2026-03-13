#!/usr/bin/env python3
"""Stage 3.8 — Push draft responses to Google Sheets.

Reads the ledger, generates draft response text for each actionable task,
and pushes to the DRAFT_RESPONSES sheet.
"""

from __future__ import annotations

import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List

import yaml
from dotenv import load_dotenv

REPO_ROOT = Path(__file__).resolve().parent.parent
LEDGER_PATH = REPO_ROOT / "06_RUNS" / "ops" / "MATTER_TODO_LEDGER.json"
MATTERS_ROOT = REPO_ROOT / "05_MATTERS"

# Google Sheets auth lives here
TODO_RUNNER_DIR = REPO_ROOT / "04_INITIATIVES" / "LL_PORTFOLIO" / "05_MATTER_DOCKETING" / "todo_runner"
if str(TODO_RUNNER_DIR) not in sys.path:
    sys.path.insert(0, str(TODO_RUNNER_DIR))

TERMINAL_STATUSES = {"DONE", "DROPPED"}
SKIP_MATTERS = {"UNASSIGNED", "FIRM_INTERNAL", "SKIP", "NEW_INQUIRY", "HILLSIDE-PENDING"}


def load_ledger() -> Dict:
    return json.loads(LEDGER_PATH.read_text())


def load_matters() -> Dict[str, Dict]:
    matters = {}
    for folder_name in ["ESSENTIAL", "STRATEGIC", "STANDARD", "PARKED"]:
        folder = MATTERS_ROOT / folder_name
        if not folder.exists():
            continue
        for item in folder.iterdir():
            if not item.is_dir() or item.name.startswith("."):
                continue
            matter = {"matter_id": item.name, "delivery_status": folder_name.lower()}
            yaml_path = item / "MATTER.yaml"
            if yaml_path.exists():
                try:
                    data = yaml.safe_load(yaml_path.read_text())
                    if data:
                        matter.update(data)
                except Exception:
                    pass
            readme = item / "README.md"
            if "matter_name" not in matter and readme.exists():
                try:
                    line = readme.read_text().split("\n", 1)[0].strip()
                    if line.startswith("# "):
                        matter["matter_name"] = line[2:]
                except Exception:
                    pass
            matters[matter["matter_id"]] = matter
    return matters


def extract_sender_name(from_field: str) -> str:
    """Extract just the name from 'Name <email>' format."""
    if "<" in from_field:
        return from_field.split("<")[0].strip().strip('"')
    return from_field.strip()


def generate_draft(entry: Dict, matter: Dict) -> str:
    """Generate an actual draft response based on the task evidence."""
    ev = (entry.get("evidence") or [{}])[0]
    sender_name = extract_sender_name(ev.get("from", ""))
    first_name = sender_name.split()[0] if sender_name else ""
    subject = ev.get("subject", "")
    quote = ev.get("quote", "")
    task = entry.get("task", "")
    action = entry.get("next_action_type", "OTHER")

    if not first_name:
        return ""

    # Build a real draft based on context
    lines = [f"Hi {first_name},"]

    if action == "RESPOND" or action == "OTHER":
        lines.append("")
        lines.append(f"Thank you for your email regarding {subject}.")
        if quote and len(quote) > 20:
            lines.append("")
            lines.append("[ML1: address the specific request below]")
            lines.append(f'> "{quote[:150]}..."')
        lines.append("")
        lines.append("Please let me know if you have any questions.")

    elif action == "REVIEW":
        lines.append("")
        lines.append(f"Thank you for sending this over. I have received the documents and will review them shortly.")
        lines.append("")
        lines.append("[ML1: add timeline / preliminary observations]")

    elif action == "SEND_REQUEST":
        lines.append("")
        lines.append(f"Following up on {subject} — [ML1: specify what is being requested].")
        lines.append("")
        lines.append("Please let me know if you need anything further from my end.")

    elif action == "SCHEDULE":
        lines.append("")
        lines.append(f"Thank you for confirming. [ML1: propose time / confirm availability].")
        lines.append("")
        lines.append("Looking forward to speaking with you.")

    elif action == "DRAFT":
        lines.append("")
        lines.append(f"Please find attached [ML1: specify document] for your review.")
        lines.append("")
        lines.append("[ML1: add key terms / context]")

    else:
        lines.append("")
        lines.append(f"Thank you for your email. [ML1: add response].")

    lines.append("")
    lines.append("Best regards,")
    lines.append("Matthew")

    return "\n".join(lines)


def push_to_sheets(rows: List[List[str]], doc_id: str) -> None:
    """Push draft rows to the Google Sheet."""
    from auth_google import get_drive, get_sheets
    from boundary import assert_doc_in_approved_folder

    drive = get_drive()
    sheets = get_sheets()

    # Use first sheet (gid=0)
    tab_name = "drafts"

    # Check if tab exists, create if not
    meta = sheets.spreadsheets().get(
        spreadsheetId=doc_id, fields="sheets.properties"
    ).execute()

    tab_exists = False
    sheet_id = 0
    for s in meta.get("sheets", []):
        if s["properties"]["title"] == tab_name:
            tab_exists = True
            sheet_id = s["properties"]["sheetId"]
            break

    if not tab_exists:
        # Rename the first sheet to "drafts"
        first_sheet = meta["sheets"][0]
        sheet_id = first_sheet["properties"]["sheetId"]
        sheets.spreadsheets().batchUpdate(spreadsheetId=doc_id, body={
            "requests": [{
                "updateSheetProperties": {
                    "properties": {"sheetId": sheet_id, "title": tab_name},
                    "fields": "title",
                }
            }]
        }).execute()

    # Clear existing content
    sheets.spreadsheets().values().clear(
        spreadsheetId=doc_id, range=f"{tab_name}!A:H"
    ).execute()

    # Write all rows
    headers = [
        "MATTER_ID", "MATTER_NAME", "DELIVERY_STATUS",
        "RECIPIENT", "SUBJECT", "TASK_SUMMARY",
        "DRAFT_RESPONSE", "STATUS",
    ]
    values = [headers] + rows

    sheets.spreadsheets().values().update(
        spreadsheetId=doc_id,
        range=f"{tab_name}!A1",
        valueInputOption="RAW",
        body={"values": values},
    ).execute()

    # Formatting
    num_cols = len(headers)
    num_rows = len(values)
    status_col = headers.index("STATUS")

    fmt_requests = [
        # Freeze header
        {
            "updateSheetProperties": {
                "properties": {"sheetId": sheet_id, "gridProperties": {"frozenRowCount": 1}},
                "fields": "gridProperties.frozenRowCount",
            }
        },
        # Bold header
        {
            "repeatCell": {
                "range": {"sheetId": sheet_id, "startRowIndex": 0, "endRowIndex": 1,
                          "startColumnIndex": 0, "endColumnIndex": num_cols},
                "cell": {"userEnteredFormat": {"textFormat": {"bold": True}}},
                "fields": "userEnteredFormat.textFormat.bold",
            }
        },
        # STATUS dropdown
        {
            "setDataValidation": {
                "range": {"sheetId": sheet_id, "startRowIndex": 1, "endRowIndex": num_rows,
                          "startColumnIndex": status_col, "endColumnIndex": status_col + 1},
                "rule": {
                    "condition": {
                        "type": "ONE_OF_LIST",
                        "values": [
                            {"userEnteredValue": "DRAFT"},
                            {"userEnteredValue": "REVIEW"},
                            {"userEnteredValue": "SENT"},
                            {"userEnteredValue": "SKIP"},
                        ],
                    },
                    "showCustomUi": True,
                    "strict": True,
                },
            }
        },
        # Auto-resize
        {
            "autoResizeDimensions": {
                "dimensions": {"sheetId": sheet_id, "dimension": "COLUMNS",
                               "startIndex": 0, "endIndex": num_cols},
            }
        },
    ]
    sheets.spreadsheets().batchUpdate(
        spreadsheetId=doc_id, body={"requests": fmt_requests}
    ).execute()


def main() -> int:
    load_dotenv(REPO_ROOT / ".env")

    doc_id = os.environ.get("DRAFT_SHEET_ID", "1EwT_ATOTPiKbTPze_auwMaNEs8kffwOgVPMbNRNmepE")

    print("=" * 60)
    print("Stage 3.8 — Draft Responses to Sheets")
    print("=" * 60)

    ledger = load_ledger()
    matters = load_matters()

    DELIVERY_ORDER = {"essential": 0, "strategic": 1, "standard": 2, "parked": 3}

    # Filter to actionable entries with real matters
    entries = []
    for e in ledger.get("entries", []):
        if (e.get("ledger_status") or "").upper() in TERMINAL_STATUSES:
            continue
        mid = e.get("matter_id", "")
        if mid in SKIP_MATTERS:
            continue
        if mid not in matters:
            continue
        entries.append(e)

    # Sort by delivery status
    entries.sort(key=lambda e: (
        DELIVERY_ORDER.get(matters.get(e.get("matter_id", ""), {}).get("delivery_status", ""), 99),
        e.get("matter_id", ""),
    ))

    print(f"Actionable entries: {len(entries)}")

    # Deduplicate by message_ref (same email shouldn't produce multiple rows)
    seen_refs = set()
    deduped = []
    for e in entries:
        refs = tuple(ev.get("message_ref", "") for ev in e.get("evidence", []))
        key = (e.get("matter_id", ""), refs)
        if key in seen_refs:
            continue
        seen_refs.add(key)
        deduped.append(e)

    print(f"After dedup: {len(deduped)}")

    # Build rows
    rows = []
    for entry in deduped:
        mid = entry.get("matter_id", "")
        matter = matters.get(mid, {})
        ev = (entry.get("evidence") or [{}])[0]

        rows.append([
            mid,
            matter.get("matter_name", mid),
            matter.get("delivery_status", "").upper(),
            ev.get("from", ""),
            ev.get("subject", ""),
            entry.get("task", "")[:200],
            generate_draft(entry, matter),
            "DRAFT",
        ])

    print(f"Pushing {len(rows)} rows to Sheet...")
    push_to_sheets(rows, doc_id)
    print(f"Done — {len(rows)} drafts pushed to Sheet")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
