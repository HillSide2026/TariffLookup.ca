#!/usr/bin/env python3
"""Fetch inbound Gmail messages for the Todo Report pipeline."""

import os
import sys
import json
import base64
import re
from datetime import datetime, timedelta
from pathlib import Path
from email.utils import parsedate_to_datetime

from dotenv import load_dotenv
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

# Load .env from repo root
REPO_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(REPO_ROOT / ".env")

CLIENT_ID = os.environ["GMAIL_CLIENT_ID"]
CLIENT_SECRET = os.environ["GMAIL_CLIENT_SECRET"]
REFRESH_TOKEN = os.environ["GMAIL_REFRESH_TOKEN"]

OUTPUT_PATH = REPO_ROOT / "06_RUNS" / "ops" / "gmail_fetch_latest.json"
BODY_CHAR_LIMIT = 1000


def get_gmail_service():
    creds = Credentials(
        token=None,
        refresh_token=REFRESH_TOKEN,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        scopes=["https://www.googleapis.com/auth/gmail.readonly"],
    )
    return build("gmail", "v1", credentials=creds)


def fetch_messages(service, days=14, max_results=500):
    after_date = (datetime.now() - timedelta(days=days)).strftime("%Y/%m/%d")
    query = f"in:inbox after:{after_date}"

    messages = []
    page_token = None
    while True:
        resp = service.users().messages().list(
            userId="me", q=query, maxResults=min(max_results - len(messages), 100),
            pageToken=page_token
        ).execute()
        batch = resp.get("messages", [])
        messages.extend(batch)
        page_token = resp.get("nextPageToken")
        if not page_token or len(messages) >= max_results:
            break

    return messages


def get_message_detail(service, msg_id):
    msg = service.users().messages().get(
        userId="me", id=msg_id, format="full"
    ).execute()

    headers = {h["name"].lower(): h["value"] for h in msg["payload"].get("headers", [])}

    # Extract plain text body
    body = ""
    payload = msg["payload"]
    if payload.get("body", {}).get("data"):
        body = base64.urlsafe_b64decode(payload["body"]["data"]).decode("utf-8", errors="replace")
    elif payload.get("parts"):
        for part in payload["parts"]:
            if part.get("mimeType") == "text/plain" and part.get("body", {}).get("data"):
                body = base64.urlsafe_b64decode(part["body"]["data"]).decode("utf-8", errors="replace")
                break

    # Truncate very long bodies
    if len(body) > BODY_CHAR_LIMIT:
        body = body[:BODY_CHAR_LIMIT] + "\n[TRUNCATED]"

    return {
        "message_id": msg_id,
        "date": headers.get("date", ""),
        "from": headers.get("from", ""),
        "to": headers.get("to", ""),
        "subject": headers.get("subject", ""),
        "body": body,
        "labels": msg.get("labelIds", []),
    }


def main():
    days = int(sys.argv[1]) if len(sys.argv) > 1 else 14
    print(f"Fetching Gmail inbox messages from the last {days} days...")

    service = get_gmail_service()
    message_stubs = fetch_messages(service, days=days)
    print(f"Found {len(message_stubs)} messages. Fetching details...")

    emails = []
    for i, stub in enumerate(message_stubs):
        if i % 25 == 0 and i > 0:
            print(f"  ...fetched {i}/{len(message_stubs)}")
        try:
            detail = get_message_detail(service, stub["id"])
            emails.append(detail)
        except Exception as e:
            print(f"  Warning: failed to fetch {stub['id']}: {e}")

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump({
            "fetched_at": datetime.now().isoformat(),
            "input_window_days": days,
            "emails_count": len(emails),
            "emails": emails,
        }, f, indent=2, ensure_ascii=False)

    print(f"Done. {len(emails)} emails saved to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
