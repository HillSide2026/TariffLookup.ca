#!/usr/bin/env python3
"""
Extract placeholder markers from DOCX templates on SharePoint.

Downloads each template registered in TEMPLATE_REGISTRY.json via Graph API,
scans all text in body, headers, footers, and tables for {{ }} and << >>
delimited placeholders, normalizes to PascalCase canonical field IDs,
and outputs the results as JSON.

Usage:
    python extract_template_fields.py
"""

from __future__ import annotations

import io
import json
import os
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

import msal
import requests

GRAPH_BASE = "https://graph.microsoft.com/v1.0"
REPO_ROOT = Path(__file__).resolve().parents[1]
REGISTRY_PATH = REPO_ROOT / "02_PLAYBOOKS" / "EXECUTION" / "TEMPLATE_REGISTRY.json"

# Namespaces used in .docx OpenXML
NS = {
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}

# Placeholder patterns: {{ Field Name }} and << Field Name >>
PLACEHOLDER_RE = re.compile(
    r"\{\{\s*(.+?)\s*\}\}"   # {{ ... }}
    r"|"
    r"<<\s*(.+?)\s*>>"       # << ... >>
    r"|"
    r"\u00ab\s*(.+?)\s*\u00bb"  # « ... » (Word auto-converts << >> to guillemets)
)

# Special normalization mappings
SPECIAL_MAPPINGS = {
    "client surname": "ClientLastName",
    "client last name": "ClientLastName",
    "client firstname": "ClientFirstName",
    "client first name": "ClientFirstName",
    "io firstname": "InstructingOfficerFirstName",
    "io first name": "InstructingOfficerFirstName",
    "io surname": "InstructingOfficerLastName",
    "io last name": "InstructingOfficerLastName",
    "firm reference": "FirmReference",
    "our reference": "FirmReference",
    "our ref": "FirmReference",
    "first name": "ClientFirstName",
    "firstname": "ClientFirstName",
    "surname": "ClientLastName",
    "last name": "ClientLastName",
    "day": "Day",
    "month": "Month",
    "year": "Year",
    "date": "Date",
}

# Pattern for reference number format like ##-###-#####
REF_NUMBER_RE = re.compile(r"^[#\-]+$")


def get_token() -> str:
    tenant = os.getenv("AZURE_TENANT_ID")
    client_id = os.getenv("AZURE_CLIENT_ID")
    client_secret = os.getenv("AZURE_CLIENT_SECRET")
    if not all([tenant, client_id, client_secret]):
        print("ERROR: Missing AZURE_* env vars", file=sys.stderr)
        sys.exit(1)
    app = msal.ConfidentialClientApplication(
        client_id=client_id,
        authority=f"https://login.microsoftonline.com/{tenant}",
        client_credential=client_secret,
    )
    result = app.acquire_token_for_client(scopes=["https://graph.microsoft.com/.default"])
    if "access_token" not in result:
        print(f"ERROR: Token failure: {result}", file=sys.stderr)
        sys.exit(1)
    return result["access_token"]


def download_template(token: str, drive_id: str, file_id: str) -> bytes:
    url = f"{GRAPH_BASE}/drives/{drive_id}/items/{file_id}/content"
    r = requests.get(url, headers={"Authorization": f"Bearer {token}"}, timeout=120, allow_redirects=True)
    if r.status_code >= 400:
        print(f"  ERROR downloading {file_id}: {r.status_code} {r.text[:300]}", file=sys.stderr)
        return b""
    return r.content


def extract_text_from_xml_part(zip_file: zipfile.ZipFile, part_name: str) -> str:
    """Extract all text runs from an OpenXML part."""
    if part_name not in zip_file.namelist():
        return ""
    xml_bytes = zip_file.read(part_name)
    root = ET.fromstring(xml_bytes)
    # Get all <w:t> text elements
    texts = []
    for t_elem in root.iter(f'{{{NS["w"]}}}t'):
        if t_elem.text:
            texts.append(t_elem.text)
    return "".join(texts)


def extract_all_text(docx_bytes: bytes) -> str:
    """Extract text from all parts of a .docx file."""
    all_text = []
    with zipfile.ZipFile(io.BytesIO(docx_bytes)) as zf:
        # Main document body
        all_text.append(extract_text_from_xml_part(zf, "word/document.xml"))

        # Headers and footers
        for name in zf.namelist():
            if name.startswith("word/header") or name.startswith("word/footer"):
                all_text.append(extract_text_from_xml_part(zf, name))

        # Endnotes, footnotes
        for name in ["word/endnotes.xml", "word/footnotes.xml"]:
            all_text.append(extract_text_from_xml_part(zf, name))

    return "\n".join(all_text)


def normalize_field_name(raw: str) -> str:
    """Normalize a raw placeholder to a PascalCase canonical field ID."""
    raw = raw.strip()
    lower = raw.lower()

    # Check special mappings first
    if lower in SPECIAL_MAPPINGS:
        return SPECIAL_MAPPINGS[lower]

    # Check for reference number pattern (##-###-#####)
    if REF_NUMBER_RE.match(raw.replace(" ", "")):
        return "FirmReference"

    # General PascalCase: split on spaces/underscores, capitalize each word
    words = re.split(r"[\s_]+", raw)
    return "".join(w.capitalize() for w in words if w)


def extract_placeholders(text: str) -> list[str]:
    """Find all {{ }}, << >>, and « » placeholders in text, return normalized field IDs."""
    fields = set()
    for m in PLACEHOLDER_RE.finditer(text):
        # One of the three groups will have content
        raw = m.group(1) or m.group(2) or m.group(3)
        if raw:
            normalized = normalize_field_name(raw)
            if normalized:
                fields.add(normalized)
    return sorted(fields)


def main():
    # Load .env
    env_path = REPO_ROOT / ".env"
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, val = line.partition("=")
                os.environ.setdefault(key.strip(), val.strip())

    # Load registry
    registry = json.loads(REGISTRY_PATH.read_text())
    templates = registry["templates"]

    # Get drive_id from the first template's known location
    # All templates are on the Doc Pro Workspace drive
    drive_id = "b!aepYh7XvLkaJQFKWL0yhBXltDNo4pJRJpSPL-X-uZ-tNtZwBKQHoRYMyWJLL2q-P"

    print(f"Authenticating...", file=sys.stderr)
    token = get_token()
    print(f"Authenticated. Processing {len(templates)} templates.\n", file=sys.stderr)

    results = {}
    for tmpl in templates:
        file_id = tmpl["file_id"]
        name = tmpl["canonical_name"]
        print(f"--- {name} ({file_id}) ---", file=sys.stderr)

        docx_bytes = download_template(token, drive_id, file_id)
        if not docx_bytes:
            print(f"  SKIP: empty download", file=sys.stderr)
            results[file_id] = {"name": name, "fields": [], "error": "download_failed"}
            continue

        print(f"  Downloaded: {len(docx_bytes)} bytes", file=sys.stderr)

        text = extract_all_text(docx_bytes)
        print(f"  Extracted text: {len(text)} chars", file=sys.stderr)

        # Also dump raw text for debugging
        print(f"  --- RAW TEXT SNIPPET (first 2000 chars) ---", file=sys.stderr)
        print(text[:2000], file=sys.stderr)
        print(f"  --- END SNIPPET ---\n", file=sys.stderr)

        fields = extract_placeholders(text)
        print(f"  Placeholders found: {fields}", file=sys.stderr)

        results[file_id] = {"name": name, "fields": fields}

    # Output JSON to stdout
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
