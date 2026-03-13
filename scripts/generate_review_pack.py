#!/usr/bin/env python3
"""Generate Matter Summary Review Pack and publish to Google Drive.

Consolidates ESSENTIAL + STRATEGIC matter data into a single Google Doc.
Data sources: MATTER.yaml, MATTER_BRIEF.md, README.md, ledger, participant mapping.
"""

from __future__ import annotations

import json
import os
import re
import sys
from datetime import date
from pathlib import Path
from typing import Dict, List, Tuple

import yaml
from dotenv import load_dotenv

REPO_ROOT = Path(__file__).resolve().parent.parent
MATTERS_ROOT = REPO_ROOT / "05_MATTERS"
LEDGER_PATH = REPO_ROOT / "06_RUNS" / "ops" / "MATTER_TODO_LEDGER.json"
MAPPING_PATH = REPO_ROOT / "00_SYSTEM" / "participant_mapping.yaml"

sys.path.insert(0, str(REPO_ROOT / "04_INITIATIVES" / "LL_PORTFOLIO" / "05_MATTER_DOCKETING" / "todo_runner"))

DELIVERY_ORDER = ["ESSENTIAL", "STRATEGIC"]
PLACEHOLDER_PHRASES = [
    "(Plain-language description",
    "(Where things stand",
    "(High-signal bullets",
    "(Bullets; not a task",
    "(Bullets)",
    "YYYY-MM-DD",
    "[list]",
    "[What is the current",
]


def load_env() -> None:
    load_dotenv(REPO_ROOT / ".env")


def load_matters() -> Dict[str, Dict]:
    matters = {}
    for tier in DELIVERY_ORDER:
        folder = MATTERS_ROOT / tier
        if not folder.exists():
            continue
        for item in sorted(folder.iterdir()):
            if not item.is_dir() or item.name.startswith("."):
                continue
            yaml_path = item / "MATTER.yaml"
            matter = {
                "matter_id": item.name,
                "delivery_status": tier.lower(),
                "path": item,
            }
            if yaml_path.exists():
                try:
                    data = yaml.safe_load(yaml_path.read_text())
                    if data:
                        matter.update(data)
                except Exception:
                    pass
            readme = item / "README.md"
            if "matter_name" not in matter and readme.exists():
                first_line = readme.read_text().split("\n")[0].strip()
                if first_line.startswith("# "):
                    matter["matter_name"] = first_line[2:]
            matters[item.name] = matter
    return matters


def read_brief(matter_path: Path) -> Dict[str, str]:
    brief_path = matter_path / "MATTER_BRIEF.md"
    sections = {}
    if not brief_path.exists():
        return sections
    text = brief_path.read_text()
    # Strip YAML frontmatter
    if text.startswith("---"):
        end = text.find("---", 3)
        if end > 0:
            text = text[end + 3:]
    current_heading = None
    current_lines = []
    for line in text.split("\n"):
        if line.startswith("## "):
            if current_heading:
                sections[current_heading] = "\n".join(current_lines).strip()
            current_heading = line[3:].strip().lower()
            current_lines = []
        elif current_heading:
            current_lines.append(line)
    if current_heading:
        sections[current_heading] = "\n".join(current_lines).strip()
    return sections


def is_placeholder(text: str) -> bool:
    for phrase in PLACEHOLDER_PHRASES:
        if phrase in text:
            return True
    return not text.strip() or text.strip() in ("- Client:", "- Counterparties:", "- Key contacts:")


def read_readme_summary(matter_path: Path) -> str:
    readme = matter_path / "README.md"
    if not readme.exists():
        return ""
    text = readme.read_text()
    if text.startswith("---"):
        end = text.find("---", 3)
        if end > 0:
            text = text[end + 3:]
    for line in text.split("\n"):
        line = line.strip()
        if line.startswith("## Description"):
            continue
        if line and not line.startswith("#"):
            return line
    return ""


def load_ledger_tasks() -> Dict[str, List[Dict]]:
    tasks_by_matter: Dict[str, List[Dict]] = {}
    if not LEDGER_PATH.exists():
        return tasks_by_matter
    ledger = json.loads(LEDGER_PATH.read_text())
    for entry in ledger.get("entries", []):
        status = entry.get("ledger_status", "NEW")
        if status in ("DONE", "DROPPED"):
            continue
        mid = entry.get("matter_id", "")
        tasks_by_matter.setdefault(mid, []).append(entry)
    return tasks_by_matter


def load_participants() -> Tuple[Dict[str, List[str]], Dict[str, str]]:
    """Returns (matter_id → [participant_keys], key → block_comment_context)."""
    by_matter: Dict[str, List[str]] = {}
    comments: Dict[str, str] = {}  # key → block comment context
    if not MAPPING_PATH.exists():
        return by_matter, comments
    lines = MAPPING_PATH.read_text().split("\n")
    block_comments: List[str] = []
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("#"):
            block_comments.append(stripped)
            continue
        if not stripped:
            block_comments = []
            continue
        if ":" not in stripped:
            continue
        key, val = stripped.split(":", 1)
        key = key.strip()
        val = val.strip().strip('"').strip("'")
        if val and val[0].isdigit():
            by_matter.setdefault(val, []).append(key)
            if block_comments:
                comments[key] = " ".join(block_comments)
    return by_matter, comments


def classify_participant(key: str, comment: str, brief_parties: str) -> str:
    comment_lower = comment.lower()
    brief_lower = brief_parties.lower()
    # Check if mentioned in brief's Client line
    if key.lower() in brief_lower:
        for line in brief_lower.split("\n"):
            if "client:" in line and key.lower() in line:
                return "Client"
            if "counterpart" in line and key.lower() in line:
                return "Conflicting Parties"
    # Check comment context
    if any(w in comment_lower for w in ["primary contact", "primary"]):
        return "Client"
    if any(w in comment_lower for w in ["subsidiary", "related", "daughter", "family"]):
        return "Client Related Parties"
    if any(w in comment_lower for w in ["counterpart", "opposing", "ila counsel", "ila", "co-counsel"]):
        return "Conflicting Parties"
    return "Undetermined"


def confidence_flags(matter: Dict, brief: Dict, tasks: List[Dict], participants: List[str]) -> List[str]:
    flags = []
    gist = brief.get("one-paragraph gist", "")
    if not gist or is_placeholder(gist):
        flags.append("BRIEF_EMPTY")
    if not tasks:
        flags.append("NO_TASKS")
    if tasks and all(t.get("ledger_status") == "STALE" for t in tasks):
        flags.append("STALE_TASKS")
    if any(t.get("routing_confidence") == "LOW" for t in tasks):
        flags.append("LOW_CONFIDENCE")
    if not participants:
        flags.append("NO_PARTICIPANTS")
    return flags


def escape_html(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def build_html(matters: Dict[str, Dict], tasks_by_matter: Dict, participants_by_matter: Dict, participant_comments: Dict) -> str:
    today_str = date.today().isoformat()
    parts = [
        "<html><head><style>",
        "body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; max-width: 800px; margin: auto; }",
        "h1 { font-size: 18pt; border-bottom: 2px solid #333; padding-bottom: 6px; }",
        "h2 { font-size: 14pt; margin-top: 30px; border-bottom: 1px solid #999; padding-bottom: 4px; }",
        "h3 { font-size: 12pt; margin-top: 16px; }",
        "table { border-collapse: collapse; width: 100%; margin: 10px 0; }",
        "th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; font-size: 10pt; }",
        "th { background-color: #f0f0f0; }",
        ".flag { background: #fff3cd; padding: 2px 6px; border-radius: 3px; font-size: 9pt; }",
        ".essential { color: #d32f2f; font-weight: bold; }",
        ".strategic { color: #1565c0; font-weight: bold; }",
        "</style></head><body>",
        f"<h1>Matter Summary Review Pack &mdash; {today_str}</h1>",
    ]

    # Sort matters: Essential first, then Strategic, then by matter_id
    sorted_matters = sorted(
        matters.values(),
        key=lambda m: (DELIVERY_ORDER.index(m["delivery_status"].upper()) if m["delivery_status"].upper() in DELIVERY_ORDER else 99, m["matter_id"]),
    )

    # --- INDEX / TOC ---
    parts.append("<h2>Index</h2>")
    parts.append("<table><tr><th>Matter ID</th><th>Matter Name</th><th>Delivery Status</th><th>Confidence Flags</th></tr>")
    for m in sorted_matters:
        mid = m["matter_id"]
        name = escape_html(m.get("matter_name", mid))
        ds = m.get("delivery_status", "").capitalize()
        brief = read_brief(m["path"])
        tasks = tasks_by_matter.get(mid, [])
        plist = participants_by_matter.get(mid, [])
        flags = confidence_flags(m, brief, tasks, plist)
        flag_str = " ".join(f'<span class="flag">{f}</span>' for f in flags) if flags else "&mdash;"
        ds_class = m.get("delivery_status", "")
        parts.append(f'<tr><td><a href="#{mid}">{mid}</a></td><td>{name}</td><td class="{ds_class}">{ds}</td><td>{flag_str}</td></tr>')
    parts.append("</table>")

    # --- PER-MATTER SECTIONS ---
    for m in sorted_matters:
        mid = m["matter_id"]
        name = escape_html(m.get("matter_name", mid))
        ds = m.get("delivery_status", "").capitalize()
        ds_class = m.get("delivery_status", "")
        brief = read_brief(m["path"])
        tasks = tasks_by_matter.get(mid, [])
        plist = participants_by_matter.get(mid, [])
        flags = confidence_flags(m, brief, tasks, plist)

        parts.append(f'<h2 id="{mid}">{mid} &mdash; {name} <span class="{ds_class}">({ds})</span></h2>')

        # Summary
        parts.append("<h3>Summary</h3>")
        gist = brief.get("one-paragraph gist", "")
        if gist and not is_placeholder(gist):
            parts.append(f"<p>{escape_html(gist)}</p>")
        else:
            fallback = read_readme_summary(m["path"])
            if fallback:
                parts.append(f"<p><em>(From README)</em> {escape_html(fallback)}</p>")
            else:
                parts.append("<p><em>No summary available.</em></p>")

        # Current posture
        posture = brief.get("current posture", "")
        if posture and not is_placeholder(posture):
            parts.append("<h3>Current Posture</h3>")
            parts.append("<ul>")
            for line in posture.split("\n"):
                line = line.strip().lstrip("- ")
                if line:
                    parts.append(f"<li>{escape_html(line)}</li>")
            parts.append("</ul>")

        # Open Tasks
        parts.append("<h3>Open Tasks</h3>")
        if tasks:
            parts.append("<table><tr><th>Task</th><th>Status</th><th>Lane</th><th>Last Seen</th></tr>")
            for t in tasks:
                task_text = escape_html(t.get("task", ""))
                status = t.get("ledger_status", "NEW")
                lane = t.get("suggested_lane", "")
                last_seen = t.get("last_seen", "")
                parts.append(f"<tr><td>{task_text}</td><td>{status}</td><td>{lane}</td><td>{last_seen}</td></tr>")
            parts.append("</table>")
        else:
            parts.append("<p><em>No open tasks in ledger.</em></p>")

        # Key Parties (from brief)
        parties_text = brief.get("parties", "")
        if parties_text and not is_placeholder(parties_text):
            parts.append("<h3>Key Parties</h3>")
            parts.append("<ul>")
            for line in parties_text.split("\n"):
                line = line.strip().lstrip("- ")
                if line and not is_placeholder(line):
                    parts.append(f"<li>{escape_html(line)}</li>")
            parts.append("</ul>")

        # Confidence / Issues
        if flags:
            parts.append("<h3>Confidence / Issues</h3>")
            parts.append("<ul>")
            for f in flags:
                parts.append(f"<li><strong>{f}</strong></li>")
            parts.append("</ul>")

        # Participants
        parts.append("<h3>Participants</h3>")
        if plist:
            classified: Dict[str, List[str]] = {
                "Client": [],
                "Client Related Parties": [],
                "Conflicting Parties": [],
                "Undetermined": [],
            }
            for key in plist:
                comment = participant_comments.get(key, "")
                cat = classify_participant(key, comment, parties_text)
                classified[cat].append(key)
            for category, keys in classified.items():
                if keys:
                    parts.append(f"<p><strong>{category}:</strong> {', '.join(escape_html(k) for k in sorted(keys))}</p>")
        else:
            parts.append("<p><em>No participants mapped.</em></p>")

    parts.append("</body></html>")
    return "\n".join(parts)


def publish_to_drive(html_content: str) -> str:
    from auth_google import get_drive
    from googleapiclient.http import MediaInMemoryUpload

    drive = get_drive()
    folder_id = os.environ.get("SECOND_BRAIN_FOLDER_ID")
    if not folder_id:
        raise RuntimeError("SECOND_BRAIN_FOLDER_ID not set")

    today_str = date.today().isoformat()
    title = f"Matter Summary Review Pack — {today_str}"

    media = MediaInMemoryUpload(html_content.encode("utf-8"), mimetype="text/html")
    file_metadata = {
        "name": title,
        "mimeType": "application/vnd.google-apps.document",
        "parents": [folder_id],
    }
    doc = drive.files().create(body=file_metadata, media_body=media).execute()
    doc_id = doc.get("id")
    doc_url = f"https://docs.google.com/document/d/{doc_id}/edit"
    return doc_url


def main() -> int:
    load_env()

    print("Loading matters (ESSENTIAL + STRATEGIC)...")
    matters = load_matters()
    print(f"  {len(matters)} matters loaded")

    print("Loading ledger tasks...")
    tasks_by_matter = load_ledger_tasks()
    task_count = sum(len(v) for v in tasks_by_matter.values())
    print(f"  {task_count} open tasks across {len(tasks_by_matter)} matters")

    print("Loading participant mapping...")
    participants_by_matter, participant_comments = load_participants()

    print("Building HTML review pack...")
    html = build_html(matters, tasks_by_matter, participants_by_matter, participant_comments)

    print("Publishing to Google Drive...")
    url = publish_to_drive(html)
    print(f"Published: {url}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
