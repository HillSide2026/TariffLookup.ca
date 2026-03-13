#!/usr/bin/env python3
"""Fetch inbound Gmail messages for the Todo Report pipeline.

Mode A — Sync (default):
    Uses history.list to fetch only messages added since the last run.
    Falls back to messages.list (after last_message_date) on first run or
    expired historyId. No rolling window — only messages after the stored date.
    Fetches metadata only (From, To, Subject, Date). No body download.
    Hard cap: HARD_LIMIT messages per run.
    Deduplicates against processed_ids stored in state file.

Mode B — Deep fetch (--deep <id> [<id> ...]):
    Fetches full body for a specified list of message IDs.
    Use sparingly — one full HTTP payload per message.

Usage:
    python scripts/fetch_gmail.py              # Mode A: sync
    python scripts/fetch_gmail.py --deep <id>  # Mode B: deep fetch
"""

import os
import sys
import json
import base64
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

# ── Config ─────────────────────────────────────────────────────────────────
REPO_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(REPO_ROOT / ".env", override=True)

CLIENT_ID     = os.environ["GMAIL_CLIENT_ID"]
CLIENT_SECRET = os.environ["GMAIL_CLIENT_SECRET"]
REFRESH_TOKEN = os.environ["GMAIL_REFRESH_TOKEN"]

HARD_LIMIT       = 100
METADATA_HEADERS = ["From", "To", "Subject", "Date"]

STATE_FILE  = REPO_ROOT / "state" / "gmail_sync_state.json"
OUTPUT_PATH = REPO_ROOT / "06_RUNS" / "ops" / "gmail_fetch_latest.json"


# ── Auth ────────────────────────────────────────────────────────────────────
def get_gmail_service():
    creds = Credentials(
        token=None,
        refresh_token=REFRESH_TOKEN,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        scopes=["https://www.googleapis.com/auth/gmail.modify"],
    )
    return build("gmail", "v1", credentials=creds)


# ── State ───────────────────────────────────────────────────────────────────
def load_state() -> dict:
    if STATE_FILE.exists():
        with open(STATE_FILE) as f:
            return json.load(f)
    # First run: start from today — no rolling window
    return {
        "history_id":        None,
        "last_message_date": datetime.now(tz=timezone.utc).strftime("%Y/%m/%d"),
        "processed_ids":     [],
    }


def save_state(state: dict):
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)


def get_current_history_id(service) -> str:
    profile = service.users().getProfile(userId="me").execute()
    return str(profile["historyId"])


# ── Mode A: Sync ─────────────────────────────────────────────────────────────
def sync_mode(service, state: dict) -> list:
    processed_ids     = set(state.get("processed_ids", []))
    history_id        = state.get("history_id")
    last_message_date = state.get("last_message_date")

    if history_id is None:
        print(f"First run — fetching messages after {last_message_date} (cap {HARD_LIMIT})...")
        stubs = _initial_fetch(service, last_message_date)
    else:
        print(f"Sync run — fetching changes since historyId {history_id}...")
        stubs = _history_fetch(service, history_id, last_message_date)

    new_stubs = [m for m in stubs if m["id"] not in processed_ids]
    print(f"  {len(stubs)} messages found, {len(new_stubs)} new after dedup (cap {HARD_LIMIT})")

    emails = []
    for stub in new_stubs[:HARD_LIMIT]:
        try:
            msg = service.users().messages().get(
                userId="me",
                id=stub["id"],
                format="metadata",
                metadataHeaders=METADATA_HEADERS,
            ).execute()
            emails.append(_extract_metadata(msg))
            processed_ids.add(stub["id"])
        except Exception as e:
            print(f"  Warning: failed to fetch {stub['id']}: {e}")

    # Advance last_message_date to the most recent internalDate seen
    if emails:
        latest_ms = max(
            int(e["internal_date"]) for e in emails if e.get("internal_date")
        )
        new_date = datetime.fromtimestamp(latest_ms / 1000, tz=timezone.utc).strftime("%Y/%m/%d")
        state["last_message_date"] = new_date
        print(f"  last_message_date advanced to {new_date}")

    new_history_id = get_current_history_id(service)
    state["history_id"]    = new_history_id
    state["processed_ids"] = list(processed_ids)
    save_state(state)

    print(f"  Fetched {len(emails)} messages. State updated (historyId={new_history_id}).")
    return emails


def _initial_fetch(service, after_date: str) -> list:
    """messages.list filtered after after_date. No rolling window. Cap HARD_LIMIT."""
    query = f"in:inbox after:{after_date}"
    messages = []
    page_token = None
    while len(messages) < HARD_LIMIT:
        resp = service.users().messages().list(
            userId="me",
            q=query,
            maxResults=min(HARD_LIMIT - len(messages), 100),
            pageToken=page_token,
        ).execute()
        messages.extend(resp.get("messages", []))
        page_token = resp.get("nextPageToken")
        if not page_token:
            break
    return messages


def _history_fetch(service, start_history_id: str, fallback_date: str) -> list:
    """history.list since start_history_id. Falls back to _initial_fetch on expiry."""
    messages = []
    page_token = None
    while len(messages) < HARD_LIMIT:
        try:
            resp = service.users().history().list(
                userId="me",
                startHistoryId=start_history_id,
                historyTypes=["messageAdded"],
                labelId="INBOX",
                pageToken=page_token,
            ).execute()
        except Exception as e:
            print(f"  historyId expired or invalid ({e}) — falling back to date-based fetch after {fallback_date}.")
            return _initial_fetch(service, fallback_date)

        for record in resp.get("history", []):
            for added in record.get("messagesAdded", []):
                msg = added["message"]
                if "INBOX" in msg.get("labelIds", []):
                    messages.append({"id": msg["id"], "threadId": msg["threadId"]})

        page_token = resp.get("nextPageToken")
        if not page_token:
            break

    return messages


# ── Mode B: Deep Fetch ───────────────────────────────────────────────────────
def deep_fetch_mode(service, message_ids: list) -> list:
    """Fetch full body for specific message IDs. Use sparingly."""
    print(f"Deep fetch mode — {len(message_ids)} message(s), format=full...")
    emails = []
    for msg_id in message_ids:
        try:
            msg = service.users().messages().get(
                userId="me", id=msg_id, format="full"
            ).execute()
            emails.append(_extract_full(msg))
        except Exception as e:
            print(f"  Warning: failed to fetch {msg_id}: {e}")
    print(f"  Done. {len(emails)} messages fetched.")
    return emails


# ── Extractors ───────────────────────────────────────────────────────────────
def _extract_metadata(msg: dict) -> dict:
    headers = {h["name"].lower(): h["value"] for h in msg["payload"].get("headers", [])}
    return {
        "message_id":    msg["id"],
        "internal_date": msg.get("internalDate"),
        "date":          headers.get("date", ""),
        "from":          headers.get("from", ""),
        "to":            headers.get("to", ""),
        "subject":       headers.get("subject", ""),
        "labels":        msg.get("labelIds", []),
        "body":          None,
    }


def _extract_full(msg: dict) -> dict:
    headers = {h["name"].lower(): h["value"] for h in msg["payload"].get("headers", [])}
    body = ""
    payload = msg["payload"]
    if payload.get("body", {}).get("data"):
        body = base64.urlsafe_b64decode(payload["body"]["data"]).decode("utf-8", errors="replace")
    elif payload.get("parts"):
        for part in payload["parts"]:
            if part.get("mimeType") == "text/plain" and part.get("body", {}).get("data"):
                body = base64.urlsafe_b64decode(part["body"]["data"]).decode("utf-8", errors="replace")
                break
    if len(body) > 3000:
        body = body[:3000] + "\n[TRUNCATED]"
    return {
        "message_id":    msg["id"],
        "internal_date": msg.get("internalDate"),
        "date":          headers.get("date", ""),
        "from":          headers.get("from", ""),
        "to":            headers.get("to", ""),
        "subject":       headers.get("subject", ""),
        "body":          body,
        "labels":        msg.get("labelIds", []),
    }


# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    deep     = "--deep" in sys.argv
    deep_ids = [a for a in sys.argv[1:] if not a.startswith("--")]

    service = get_gmail_service()

    if deep:
        if not deep_ids:
            print("ERROR: --deep requires one or more message IDs as arguments.")
            sys.exit(1)
        emails = deep_fetch_mode(service, deep_ids)
    else:
        state  = load_state()
        emails = sync_mode(service, state)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump({
            "fetched_at":   datetime.now(tz=timezone.utc).isoformat(),
            "mode":         "deep" if deep else "sync",
            "emails_count": len(emails),
            "emails":       emails,
        }, f, indent=2, ensure_ascii=False)

    print(f"Output written to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
