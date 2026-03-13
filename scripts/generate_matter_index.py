#!/usr/bin/env python3
"""
generate_matter_index.py — Matter Index Generator

Scans 05_MATTERS/ and generates a consolidated index at 05_MATTERS/INDEX.md.

Usage:
    python scripts/generate_matter_index.py

Output:
    05_MATTERS/INDEX.md
"""

import os
import sys
import yaml
from pathlib import Path
from datetime import datetime
from collections import defaultdict

MATTERS_ROOT = Path(__file__).parent.parent / '05_MATTERS'
OUTPUT_FILE = MATTERS_ROOT / 'INDEX.md'


def load_matter(matter_path: Path) -> dict:
    """Load matter data from MATTER.yaml."""
    yaml_path = matter_path / 'MATTER.yaml'
    readme_path = matter_path / 'README.md'

    data = {
        'matter_id': matter_path.name,
        'path': str(matter_path.relative_to(MATTERS_ROOT.parent)),
        'folder': matter_path.parent.name,
    }

    if yaml_path.exists():
        try:
            with open(yaml_path, 'r') as f:
                yaml_data = yaml.safe_load(f)
                if yaml_data:
                    data.update(yaml_data)
        except yaml.YAMLError:
            pass

    # Fallback: extract name from README.md title
    if 'matter_name' not in data and readme_path.exists():
        with open(readme_path, 'r') as f:
            first_line = f.readline().strip()
            if first_line.startswith('# '):
                data['matter_name'] = first_line[2:]

    return data


def find_all_matters() -> list:
    """Find all matter directories."""
    matters = []
    for delivery_folder in ['ESSENTIAL', 'STRATEGIC', 'STANDARD', 'PARKED']:
        folder = MATTERS_ROOT / delivery_folder
        if folder.exists():
            for item in folder.iterdir():
                if item.is_dir() and not item.name.startswith('.'):
                    matters.append(load_matter(item))
    return matters


def generate_index(matters: list) -> str:
    """Generate markdown index content."""
    lines = [
        "# Matter Index",
        "",
        f"_Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}_",
        "",
        f"**Total Matters:** {len(matters)}",
        "",
    ]

    # Group by delivery status
    by_status = defaultdict(list)
    for m in matters:
        status = m.get('delivery_status', m.get('folder', 'Unknown'))
        by_status[status].append(m)

    # Status order
    status_order = ['Essential', 'Strategic', 'Standard', 'Parked']

    for status in status_order:
        status_matters = by_status.get(status, [])
        if not status_matters:
            continue

        lines.append(f"## {status} ({len(status_matters)})")
        lines.append("")
        lines.append("| Matter ID | Client/Name | Status | Fulfillment |")
        lines.append("|-----------|-------------|--------|-------------|")

        # Sort by matter_id
        status_matters.sort(key=lambda x: x.get('matter_id', ''))

        for m in status_matters:
            matter_id = m.get('matter_id', '?')
            name = m.get('matter_name', '?')
            clio_status = m.get('status', '?')
            fulfillment = m.get('fulfillment_status', '?')
            path = m.get('path', '')

            # Create link
            link = f"[{matter_id}]({path}/README.md)"
            lines.append(f"| {link} | {name} | {clio_status} | {fulfillment} |")

        lines.append("")

    # Summary by fulfillment status
    lines.append("## Summary by Fulfillment Status")
    lines.append("")
    fulfillment_counts = defaultdict(int)
    for m in matters:
        fulfillment_counts[m.get('fulfillment_status', 'unknown')] += 1

    for status, count in sorted(fulfillment_counts.items()):
        lines.append(f"- **{status}:** {count}")
    lines.append("")

    # Recent matters (by created_date if available)
    dated_matters = [m for m in matters if m.get('created_date')]
    if dated_matters:
        dated_matters.sort(key=lambda x: x.get('created_date', ''), reverse=True)
        recent = dated_matters[:10]

        lines.append("## Recently Created (Top 10)")
        lines.append("")
        lines.append("| Matter ID | Client/Name | Created |")
        lines.append("|-----------|-------------|---------|")
        for m in recent:
            lines.append(f"| {m.get('matter_id')} | {m.get('matter_name', '?')} | {m.get('created_date')} |")
        lines.append("")

    return '\n'.join(lines)


def main():
    print(f"Scanning {MATTERS_ROOT}...")
    matters = find_all_matters()
    print(f"Found {len(matters)} matters")

    index_content = generate_index(matters)

    with open(OUTPUT_FILE, 'w') as f:
        f.write(index_content)

    print(f"Index written to {OUTPUT_FILE}")
    return 0


if __name__ == '__main__':
    sys.exit(main())
