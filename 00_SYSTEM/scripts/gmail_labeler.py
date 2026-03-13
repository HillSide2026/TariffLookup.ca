#!/usr/bin/env python3
"""Gmail matter labeler — Stage 2.13 (labels only).

Requires:
- GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN
- Approval manifest with approval_artifact present

Writes audit logs to: 06_RUNS/ops/gmail_label_audit.ndjson
"""

from __future__ import annotations

import argparse
import json
import os
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, List

from dotenv import load_dotenv
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

REPO_ROOT = Path(__file__).resolve().parent.parent
OPS_DIR = REPO_ROOT / "06_RUNS" / "ops"
AUDIT_LOG = OPS_DIR / "gmail_label_audit.ndjson"


def load_env() -> None:
    load_dotenv(REPO_ROOT / ".env")


def gmail_service():
    client_id = os.environ.get("GMAIL_CLIENT_ID")
    client_secret = os.environ.get("GMAIL_CLIENT_SECRET")
    refresh_token = os.environ.get("GMAIL_REFRESH_TOKEN")
    if not all([client_id, client_secret, refresh_token]):
        raise RuntimeError("Missing Gmail credentials in .env")

    creds = Credentials(
        token=None,
        refresh_token=refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=client_id,
        client_secret=client_secret,
        scopes=["https://www.googleapis.com/auth/gmail.modify"],
    )
    return build("gmail", "v1", credentials=creds)


def append_audit(entry: Dict) -> None:
    OPS_DIR.mkdir(parents=True, exist_ok=True)
    with AUDIT_LOG.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")


def ensure_label(service, label_name: str) -> str:
    labels = service.users().labels().list(userId="me").execute().get("labels", [])
    for l in labels:
        if l.get("name") == label_name:
            return l.get("id")

    body = {"name": label_name, "labelListVisibility": "labelShow", "messageListVisibility": "show"}
    created = service.users().labels().create(userId="me", body=body).execute()
    return created.get("id")


def apply_label(service, message_id: str, add_ids: List[str], remove_ids: List[str]) -> None:
    service.users().messages().modify(
        userId="me",
        id=message_id,
        body={"addLabelIds": add_ids, "removeLabelIds": remove_ids},
    ).execute()


def main() -> int:
    parser = argparse.ArgumentParser(description="Apply Gmail matter labels (labels only)")
    parser.add_argument("--manifest", required=True, help="Path to approval manifest JSON")
    parser.add_argument("--execute", action="store_true", help="Perform writes (default is dry-run)")
    args = parser.parse_args()

    load_env()

    manifest_path = Path(args.manifest)
    if not manifest_path.exists():
        raise SystemExit(f"Manifest not found: {manifest_path}")

    manifest = json.loads(manifest_path.read_text())
    approval_artifact = manifest.get("approval_artifact")
    approved_by = manifest.get("approved_by")

    if args.execute:
        if not approval_artifact:
            raise SystemExit("Approval artifact required for execution")
        artifact_path = Path(approval_artifact)
        if not artifact_path.is_absolute():
            artifact_path = REPO_ROOT / approval_artifact
        if not artifact_path.exists():
            raise SystemExit(f"Approval artifact not found: {artifact_path}")

    actions = manifest.get("actions", [])
    if not actions:
        print("No actions in manifest")
        return 0

    if not args.execute:
        print("DRY RUN: No Gmail writes will be performed")

    service = None
    if args.execute:
        service = gmail_service()

    for action in actions:
        message_id = action.get("message_id")
        thread_id = action.get("gmail_thread_id", "")
        matter_id = action.get("matter_id")
        label = action.get("label")
        operation = action.get("operation")
        reason = action.get("reason")

        pattern = r"^LL/1\./\d+\.\d+ - [A-Z][a-z]+/\d{2}-\d{3,4}-\d{5}( -- .+)?$"
        if not label or not re.match(pattern, label):
            entry = {
                "message_id": message_id,
                "gmail_thread_id": thread_id,
                "label_applied_or_removed": label or "",
                "matter_id": matter_id,
                "operation": operation,
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "approving_human": approved_by,
                "approval_artifact_reference": approval_artifact,
                "reason": reason or "invalid label schema",
                "status": "refused",
            }
            append_audit(entry)
            continue

        matter_segment = label.split("/")[3] if len(label.split("/")) >= 4 else ""
        if not (matter_segment == matter_id or matter_segment.startswith(f"{matter_id} -- ")):
            entry = {
                "message_id": message_id,
                "gmail_thread_id": thread_id,
                "label_applied_or_removed": label,
                "matter_id": matter_id,
                "operation": operation,
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "approving_human": approved_by,
                "approval_artifact_reference": approval_artifact,
                "reason": reason or "label/matter_id mismatch",
                "status": "refused",
            }
            append_audit(entry)
            continue

        entry = {
            "message_id": message_id,
            "gmail_thread_id": thread_id,
            "label_applied_or_removed": label,
            "matter_id": matter_id,
            "operation": operation,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "approving_human": approved_by,
            "approval_artifact_reference": approval_artifact,
            "reason": reason,
            "status": "ok",
        }

        if not args.execute:
            append_audit(entry)
            continue

        try:
            label_id = ensure_label(service, label)
            if operation == "add":
                apply_label(service, message_id, [label_id], [])
            elif operation == "remove":
                apply_label(service, message_id, [], [label_id])
            else:
                raise ValueError(f"Unsupported operation: {operation}")
        except Exception as e:
            entry["status"] = "failed"
            entry["error"] = str(e)
        finally:
            append_audit(entry)

    print("Done")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
