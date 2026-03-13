#!/usr/bin/env python3
"""
validate_matter_yaml.py — Matter Schema Validation

Scans 05_MATTERS/ and validates each matter against the schema defined in
00_SYSTEM/schemas/SCHEMAS.md.

Usage:
    python 00_SYSTEM/scripts/validate_matter_yaml.py [--fix-missing] [--verbose]

Options:
    --fix-missing   Create missing MATTER.yaml files with placeholder values
    --verbose       Show details for passing matters too

Exit codes:
    0 = All matters valid
    1 = Validation errors found
"""

import os
import sys
import yaml
from pathlib import Path
from datetime import datetime

# Schema definition per 00_SYSTEM/schemas/SCHEMAS.md
REQUIRED_FIELDS = {
    'matter_id': str,
    'matter_name': str,
    'status': str,
    'delivery_status': str,
    'fulfillment_status': str,
    'created_date': str,
}

STATUS_VALUES = ['Open', 'Pending', 'Closed']
DELIVERY_STATUS_VALUES = ['Essential', 'Strategic', 'Standard', 'Parked']
FULFILLMENT_STATUS_VALUES = ['urgent', 'active', 'keep in view', 'dormant', 'inactive', 'pausing']

MATTERS_ROOT = Path(__file__).parent.parent / '05_MATTERS'


def validate_matter(matter_path: Path) -> dict:
    """Validate a single matter directory."""
    result = {
        'path': str(matter_path),
        'matter_id': matter_path.name,
        'valid': True,
        'errors': [],
        'warnings': [],
    }

    yaml_path = matter_path / 'MATTER.yaml'
    readme_path = matter_path / 'README.md'

    # Check MATTER.yaml exists
    if not yaml_path.exists():
        result['valid'] = False
        result['errors'].append('Missing MATTER.yaml')
        if readme_path.exists():
            result['warnings'].append('Has README.md but no MATTER.yaml')
        return result

    # Parse YAML
    try:
        with open(yaml_path, 'r') as f:
            data = yaml.safe_load(f)
    except yaml.YAMLError as e:
        result['valid'] = False
        result['errors'].append(f'Invalid YAML: {e}')
        return result

    if data is None:
        result['valid'] = False
        result['errors'].append('Empty MATTER.yaml')
        return result

    # Check required fields
    for field, field_type in REQUIRED_FIELDS.items():
        if field not in data:
            result['valid'] = False
            result['errors'].append(f'Missing required field: {field}')
        elif not isinstance(data[field], field_type):
            result['valid'] = False
            result['errors'].append(f'Invalid type for {field}: expected {field_type.__name__}')

    # Validate enum values
    if 'status' in data and data['status'] not in STATUS_VALUES:
        result['warnings'].append(f"status '{data['status']}' not in standard values: {STATUS_VALUES}")

    if 'delivery_status' in data and data['delivery_status'] not in DELIVERY_STATUS_VALUES:
        result['valid'] = False
        result['errors'].append(f"delivery_status '{data['delivery_status']}' not in: {DELIVERY_STATUS_VALUES}")

    if 'fulfillment_status' in data and data['fulfillment_status'] not in FULFILLMENT_STATUS_VALUES:
        result['warnings'].append(f"fulfillment_status '{data['fulfillment_status']}' not standard: {FULFILLMENT_STATUS_VALUES}")

    # Check folder placement matches delivery_status
    if 'delivery_status' in data:
        expected_folder = data['delivery_status'].upper()
        actual_folder = matter_path.parent.name
        if expected_folder != actual_folder:
            result['valid'] = False
            result['errors'].append(f"Folder mismatch: delivery_status='{data['delivery_status']}' but in {actual_folder}/")

    # Check matter_id matches folder name
    if 'matter_id' in data and data['matter_id'] != matter_path.name:
        result['warnings'].append(f"matter_id '{data['matter_id']}' != folder name '{matter_path.name}'")

    return result


def find_all_matters() -> list:
    """Find all matter directories."""
    matters = []
    for delivery_folder in ['ESSENTIAL', 'STRATEGIC', 'STANDARD', 'PARKED']:
        folder = MATTERS_ROOT / delivery_folder
        if folder.exists():
            for item in folder.iterdir():
                if item.is_dir() and not item.name.startswith('.'):
                    matters.append(item)
    return sorted(matters)


def create_placeholder_yaml(matter_path: Path, delivery_status: str):
    """Create a placeholder MATTER.yaml file."""
    yaml_path = matter_path / 'MATTER.yaml'

    # Try to extract name from README.md
    readme_path = matter_path / 'README.md'
    matter_name = matter_path.name
    if readme_path.exists():
        with open(readme_path, 'r') as f:
            first_line = f.readline().strip()
            if first_line.startswith('# '):
                matter_name = first_line[2:]

    # Determine year from matter_id
    year_prefix = matter_path.name[:2]
    if year_prefix.isdigit():
        year = f"20{year_prefix}"
    else:
        year = "2025"

    data = {
        'matter_id': matter_path.name,
        'matter_name': matter_name,
        'status': 'Open',
        'delivery_status': delivery_status.capitalize(),
        'fulfillment_status': 'active' if delivery_status != 'PARKED' else 'inactive',
        'created_date': f'{year}-01-01',
    }

    with open(yaml_path, 'w') as f:
        yaml.dump(data, f, default_flow_style=False, sort_keys=False)

    return yaml_path


def main():
    verbose = '--verbose' in sys.argv
    fix_missing = '--fix-missing' in sys.argv

    print("=" * 60)
    print("MATTER.yaml Validation Report")
    print(f"Generated: {datetime.now().isoformat()}")
    print("=" * 60)
    print()

    matters = find_all_matters()
    print(f"Found {len(matters)} matter directories\n")

    results = []
    for matter in matters:
        result = validate_matter(matter)
        results.append(result)

    # Summary counts
    valid_count = sum(1 for r in results if r['valid'])
    invalid_count = len(results) - valid_count
    missing_yaml = sum(1 for r in results if 'Missing MATTER.yaml' in r['errors'])

    # Print errors
    print("VALIDATION ERRORS")
    print("-" * 40)
    error_results = [r for r in results if not r['valid']]
    if error_results:
        for r in error_results:
            print(f"\n{r['matter_id']} ({r['path']})")
            for err in r['errors']:
                print(f"  ERROR: {err}")
            for warn in r['warnings']:
                print(f"  WARN:  {warn}")

            # Fix missing if requested
            if fix_missing and 'Missing MATTER.yaml' in r['errors']:
                delivery = Path(r['path']).parent.name
                created = create_placeholder_yaml(Path(r['path']), delivery)
                print(f"  FIXED: Created {created}")
    else:
        print("None")

    # Print warnings for valid matters
    print("\n\nWARNINGS (valid matters)")
    print("-" * 40)
    warning_results = [r for r in results if r['valid'] and r['warnings']]
    if warning_results:
        for r in warning_results:
            print(f"\n{r['matter_id']}")
            for warn in r['warnings']:
                print(f"  WARN: {warn}")
    else:
        print("None")

    # Verbose: show passing
    if verbose:
        print("\n\nPASSING MATTERS")
        print("-" * 40)
        for r in results:
            if r['valid'] and not r['warnings']:
                print(f"  OK: {r['matter_id']}")

    # Summary
    print("\n")
    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total matters:    {len(results)}")
    print(f"Valid:            {valid_count}")
    print(f"Invalid:          {invalid_count}")
    print(f"Missing YAML:     {missing_yaml}")
    print()

    if invalid_count > 0:
        print("STATUS: FAIL")
        return 1
    else:
        print("STATUS: PASS")
        return 0


if __name__ == '__main__':
    sys.exit(main())
