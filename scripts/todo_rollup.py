#!/usr/bin/env python3
"""
todo_rollup.py — Firmwide To-Do Rollup (v2)

Two-stage pipeline:
  Stage 1: Classify emails → ACTION_REQUIRED, WAITING_ON_OTHER, INFO_ONLY, NO_ACTION
  Stage 2: Generate verb-first lawyer tasks from ACTION_REQUIRED emails only

Usage:
    python scripts/todo_rollup.py [--days 14] [--dry-run]

Output:
    06_RUNS/ops/todo_rollup_YYYY-MM-DD.md

Does NOT:
- Modify matter records
- Change delivery status
- Run automatically
"""

import os
import re
import sys
import yaml
import base64
import hashlib
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional, List, Dict, Any, Tuple
from collections import defaultdict
from email.utils import parseaddr

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from gmail_integration import GmailClient

# Paths
REPO_ROOT = Path(__file__).parent.parent
MATTERS_ROOT = REPO_ROOT / '05_MATTERS'
OUTPUT_DIR = REPO_ROOT / '06_RUNS' / 'ops'


# =============================================================================
# Email Classification (Stage 1)
# =============================================================================

class EmailClass:
    ACTION_REQUIRED = 'ACTION_REQUIRED'      # Lawyer must act
    WAITING_ON_OTHER = 'WAITING_ON_OTHER'    # Awaiting response from others
    INFO_ONLY = 'INFO_ONLY'                  # FYI, no action needed
    NO_ACTION = 'NO_ACTION'                  # Automated/marketing/noise


# Special pseudo-matter IDs (not real matters)
SPECIAL_MATTER_IDS = {
    'SKIP',              # Exclude from task extraction entirely
    'FIRM_INTERNAL',     # Internal/admin, not client work
    'NEW_INQUIRY',       # Potential client, needs intake
    'HILLSIDE-PENDING',  # Personal business, matter not yet created
}

# Patterns for NO_ACTION classification (automated notifications)
NO_ACTION_PATTERNS = [
    r'no further action is needed',
    r'your site has updated',
    r'plugins were auto',
    r'plugins and themes have been updated',
    r'invoice.*(?:ready|available|attached)',
    r'your (?:document|invoice|export) (?:is|has been)',
    r'multi-factor authentication',
    r'verification code',
    r'password reset',
    r'unsubscribe',
    r'wordpress.*update',
    r'your subscription',
    r'marketing preferences',
    r'newsletter',
    # Office closures / holidays
    r'office will be closed',
    r'the office will be (?:closed|open)',
    r'(?:family|victoria|canada|civic|labour|thanksgiving|christmas|boxing|new year).*day',
    r'holiday.*(?:notice|hours|schedule)',
    r'stat(?:utory)? holiday',
]

# Patterns for INFO_ONLY classification
INFO_ONLY_PATTERNS = [
    r'^(?:re:|fwd:).*(?:fyi|for your (?:information|records))',
    r'just (?:letting you know|wanted to update)',
    r'(?:for your|fyi)',
    r'no action (?:required|needed)',
    r'update on',
    r'status update',
    r'confirming (?:receipt|that)',
    r'we have received',
    r'thank(?:s| you) for',
    r'acknowledg(?:e|ing)',
]

# Patterns for WAITING_ON_OTHER classification
WAITING_PATTERNS = [
    r"i(?:'ll| will) (?:follow up|get back|send|provide|review)",
    r"we(?:'ll| will) (?:follow up|get back|send|provide|review)",
    r"(?:will|going to) (?:send|forward|provide|review|get back)",
    r"awaiting (?:your|their|client|counsel)",
    r"pending (?:their|client|other|external)",
    r"waiting (?:for|on) (?:their|client|other)",
    r"once (?:i|we) (?:receive|hear|get)",
    r"let me (?:check|review|look into)",
    r"i(?:'ll| will) aim to follow up",
]

# Patterns for ACTION_REQUIRED classification (lawyer must act)
ACTION_REQUIRED_PATTERNS = [
    # Direct requests to lawyer
    r'(?:can|could|would) you (?:please )?(?:send|review|prepare|draft|file|provide|confirm)',
    r'please (?:send|review|prepare|draft|file|provide|confirm|advise|let)',
    r'(?:need|require)(?:s|d)? (?:you to|your)',
    r'kindly (?:send|review|provide|confirm)',
    r'(?:your|immediate) (?:attention|action|review) (?:is )?(?:needed|required)',
    # Deadlines directed at lawyer
    r'by (?:monday|tuesday|wednesday|thursday|friday|tomorrow|end of day|eod|cob)',
    r'deadline[:\s]+\w+\s+\d+',
    r'due (?:by|on|before)',
    r'urgent(?:ly)?',
    r'asap',
    r'time[- ]?sensitive',
    # Document requests
    r'(?:attached|enclosed) (?:is|are|please find).*(?:for your|please) review',
    r'please (?:sign|execute|review and sign)',
    r'(?:review|sign) the attached',
    # Follow-up requests
    r'following up on (?:my|our|the)',
    r'just following up',
    r'checking (?:in|updates?) on',
    r'any update(?:s)? on',
]

# Excluded domains - skip completely
EXCLUDED_DOMAINS = {
    'levinelegal', 'levinelegalservices', 'levine-law',
    'google', 'github', 'slack', 'asana', 'clio', 'upwork', 'zoom',
    'microsoft', 'amazon', 'calendly', 'docusign', 'adobe', 'dropbox',
    'soulpepper', 'wordpress', 'automattic', 'jetpack', 'regus',
}


def classify_email(subject: str, body: str, snippet: str, sender_domain: str) -> Tuple[str, str]:
    """
    Stage 1: Classify email into one of four categories.

    Returns: (classification, reason)
    """
    text = f"{subject} {body or snippet}".lower()

    # Check excluded domains first
    if sender_domain in EXCLUDED_DOMAINS:
        return EmailClass.NO_ACTION, 'excluded_domain'

    # Check NO_ACTION patterns (automated notifications)
    for pattern in NO_ACTION_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            return EmailClass.NO_ACTION, f'pattern:{pattern[:30]}'

    # Check ACTION_REQUIRED patterns (strongest signal)
    for pattern in ACTION_REQUIRED_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            return EmailClass.ACTION_REQUIRED, f'pattern:{pattern[:30]}'

    # Check WAITING_ON_OTHER patterns
    for pattern in WAITING_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            return EmailClass.WAITING_ON_OTHER, f'pattern:{pattern[:30]}'

    # Check INFO_ONLY patterns
    for pattern in INFO_ONLY_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            return EmailClass.INFO_ONLY, f'pattern:{pattern[:30]}'

    # Default: if has attachment language or request-like structure → ACTION_REQUIRED
    if re.search(r'attach|please|review|send|provide', text):
        return EmailClass.ACTION_REQUIRED, 'default_request_language'

    return EmailClass.INFO_ONLY, 'default'


# =============================================================================
# Task Normalization (Stage 2)
# =============================================================================

# Verb-first task templates for normalization
TASK_VERBS = {
    # Review/Analyze
    'review': ['review', 'look at', 'examine', 'check', 'analyze', 'assess'],
    'draft': ['draft', 'prepare', 'write', 'create', 'compose'],
    'revise': ['revise', 'edit', 'update', 'modify', 'amend', 'redline'],
    'execute': ['sign', 'execute', 'finalize'],
    'send': ['send', 'forward', 'transmit', 'email', 'provide', 'share'],
    'file': ['file', 'submit', 'register'],
    'follow up': ['follow up', 'follow-up', 'check in'],
    'confirm': ['confirm', 'verify', 'acknowledge'],
    'respond': ['respond', 'reply', 'answer'],
    'advise': ['advise', 'counsel', 'recommend'],
    'schedule': ['schedule', 'arrange', 'book', 'set up'],
    'call': ['call', 'phone', 'contact'],
}

# Deadline extraction patterns
DEADLINE_PATTERNS = [
    r'by\s+(\w+\s+\d{1,2}(?:,?\s*\d{4})?)',
    r'deadline[:\s]+(\w+\s+\d{1,2}(?:,?\s*\d{4})?)',
    r'due\s+(?:by\s+)?(\w+\s+\d{1,2}(?:,?\s*\d{4})?)',
    r'before\s+(\w+\s+\d{1,2}(?:,?\s*\d{4})?)',
    r'no later than\s+(\w+\s+\d{1,2}(?:,?\s*\d{4})?)',
    r'by\s+(eod|cob|end of (?:day|week|business))',
    r'by\s+(tomorrow|monday|tuesday|wednesday|thursday|friday)',
]


def normalize_task(raw_text: str) -> Optional[str]:
    """
    Normalize extracted text into a verb-first lawyer action.

    Examples:
      "Can you please review the attached agreement" → "Review attached agreement"
      "I need you to send the documents" → "Send documents"
      "Please let me know when available" → "Respond re availability"
    """
    if not raw_text or len(raw_text) < 10:
        return None

    text = raw_text.strip()

    # Remove common prefixes
    text = re.sub(r'^(?:hi|hello|dear|good (?:morning|afternoon|evening))[,.\s]*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'^(?:matthew|matt)[,.\s]*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'^(?:can|could|would) you (?:please )?', '', text, flags=re.IGNORECASE)
    text = re.sub(r'^(?:please|kindly) ', '', text, flags=re.IGNORECASE)
    text = re.sub(r'^(?:i (?:would|need|want) (?:you to|to ask you to) )', '', text, flags=re.IGNORECASE)
    text = re.sub(r'^(?:we (?:would|need) (?:you to|to ask you to) )', '', text, flags=re.IGNORECASE)

    # Remove trailing signatures and pleasantries
    text = re.sub(r'(?:thanks|regards|best|sincerely|cheers).*$', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\s*-+\s*$', '', text)

    # Clean up whitespace and newlines
    text = re.sub(r'\s+', ' ', text).strip()

    # Truncate if too long
    if len(text) > 120:
        # Try to cut at sentence boundary
        match = re.search(r'^(.{60,120})[.!?]\s', text)
        if match:
            text = match.group(1)
        else:
            text = text[:117] + '...'

    # Ensure starts with capital letter
    if text and len(text) > 1:
        text = text[0].upper() + text[1:]

    # Validate: must start with verb-like word or be actionable
    first_word = text.split()[0].lower() if text else ''
    verb_stems = set()
    for verb_list in TASK_VERBS.values():
        for v in verb_list:
            verb_stems.add(v.split()[0])  # First word of multi-word verbs

    # If doesn't start with a verb, try to identify and prepend one
    if first_word not in verb_stems:
        # Check if it's describing something to review
        if re.search(r'attach|document|agreement|contract|draft', text, re.IGNORECASE):
            text = 'Review: ' + text
        elif re.search(r'sign|execut', text, re.IGNORECASE):
            text = 'Execute: ' + text
        elif re.search(r'call|phone|contact', text, re.IGNORECASE):
            text = 'Call: ' + text

    return text if len(text) >= 10 else None


def extract_deadline(text: str) -> Optional[str]:
    """Extract deadline from text if present."""
    for pattern in DEADLINE_PATTERNS:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1)
    return None


# =============================================================================
# Matter Loading and Mapping
# =============================================================================

def load_matters() -> Dict[str, Dict]:
    """Load all matters from 05_MATTERS."""
    matters = {}

    for delivery_folder in ['ESSENTIAL', 'STRATEGIC', 'STANDARD', 'PARKED']:
        folder = MATTERS_ROOT / delivery_folder
        if not folder.exists():
            continue

        for item in folder.iterdir():
            if not item.is_dir() or item.name.startswith('.'):
                continue

            yaml_path = item / 'MATTER.yaml'
            readme_path = item / 'README.md'

            matter = {
                'matter_id': item.name,
                'delivery_status': delivery_folder.lower(),
                'path': str(item),
            }

            if yaml_path.exists():
                try:
                    with open(yaml_path, 'r') as f:
                        data = yaml.safe_load(f)
                        if data:
                            matter.update(data)
                except:
                    pass

            if 'matter_name' not in matter and readme_path.exists():
                try:
                    with open(readme_path, 'r') as f:
                        first_line = f.readline().strip()
                        if first_line.startswith('# '):
                            matter['matter_name'] = first_line[2:]
                except:
                    pass

            matters[matter['matter_id']] = matter

    return matters


def build_participant_mapping(matters: Dict[str, Dict]) -> Dict[str, str]:
    """Build email domain/name → matter_id mapping."""
    mapping = {}

    mapping_file = REPO_ROOT / '00_SYSTEM' / 'participant_mapping.yaml'
    if mapping_file.exists():
        try:
            with open(mapping_file, 'r') as f:
                yaml_mapping = yaml.safe_load(f)
                if yaml_mapping:
                    for key, value in yaml_mapping.items():
                        if isinstance(value, str):
                            # Accept matter IDs (start with year) and special pseudo-IDs
                            if value.startswith(('2', '1')) or value in SPECIAL_MATTER_IDS:
                                mapping[key.lower()] = value
            print(f"  Loaded {len(mapping)} entries from participant_mapping.yaml")
        except Exception as e:
            print(f"  Warning: Could not load participant_mapping.yaml: {e}")

    # Auto-generate from matter names
    auto_count = 0
    for matter_id, matter in matters.items():
        name = matter.get('matter_name', '').lower()
        normalized = re.sub(r'[^a-z0-9]', '', name)
        if normalized and len(normalized) > 3 and normalized not in mapping:
            mapping[normalized] = matter_id
            auto_count += 1

    if auto_count > 0:
        print(f"  Auto-generated {auto_count} additional mappings from matter names")

    return mapping


def map_email_to_matter(email_data: Dict,
                        participant_mapping: Dict[str, str],
                        thread_mapping: Dict[str, str],
                        matters: Dict[str, Dict]) -> Tuple[str, str, Optional[str]]:
    """
    Map email to a matter with strict attribution.

    Returns: (matter_id, mapping_method, suggested_match)
    - matter_id: assigned matter or 'UNASSIGNED'
    - mapping_method: how it was mapped
    - suggested_match: for UNASSIGNED, a suggested matter based on fuzzy matching
    """
    thread_id = email_data.get('thread_id', '')
    subject = email_data.get('subject', '').lower()
    participants = email_data.get('participants', [])

    # Method 1: Explicit Clio matter ID in subject (strongest)
    matter_pattern = r'\b(\d{2}-\d{3,4}-\d{5})\b'
    match = re.search(matter_pattern, subject)
    if match:
        matter_id = match.group(1)
        # Verify it's a real matter
        if matter_id in matters:
            return matter_id, 'clio_tag', None
        # Check for close matches (year prefix might differ)
        for mid in matters.keys():
            if mid.endswith(matter_id[-6:]):  # Last 6 chars match
                return mid, 'clio_tag_fuzzy', None

    # Method 2: Thread reuse (if previously mapped)
    if thread_id and thread_id in thread_mapping:
        return thread_mapping[thread_id], 'thread_reuse', None

    # Method 3: Participant mapping
    suggested = None
    for participant in participants:
        email_addr = participant.get('email', '').lower()
        name = participant.get('name', '').lower()

        if '@' in email_addr:
            domain = email_addr.split('@')[1].split('.')[0]
            if domain in participant_mapping:
                return participant_mapping[domain], 'participant_domain', None

            prefix = email_addr.split('@')[0]
            normalized_prefix = re.sub(r'[^a-z0-9]', '', prefix)
            if normalized_prefix in participant_mapping:
                return participant_mapping[normalized_prefix], 'participant_email', None

        normalized_name = re.sub(r'[^a-z0-9]', '', name)
        if normalized_name and normalized_name in participant_mapping:
            return participant_mapping[normalized_name], 'participant_name', None

    # Method 4: Subject keyword matching (for suggested match only)
    subject_words = set(re.findall(r'\b\w{4,}\b', subject))
    best_match_score = 0
    for matter_id, matter in matters.items():
        matter_name = matter.get('matter_name', '').lower()
        matter_words = set(re.findall(r'\b\w{4,}\b', matter_name))
        overlap = len(subject_words & matter_words)
        if overlap > best_match_score:
            best_match_score = overlap
            suggested = matter_id

    return 'UNASSIGNED', 'no_match', suggested if best_match_score > 0 else None


# =============================================================================
# Email Fetching
# =============================================================================

def parse_email_headers(msg: Dict) -> Dict:
    """Extract useful headers from a Gmail message."""
    headers = msg.get('payload', {}).get('headers', [])
    header_dict = {h['name'].lower(): h['value'] for h in headers}

    participants = []
    sender_info = {'name': '', 'email': ''}

    from_value = header_dict.get('from', '')
    name, email = parseaddr(from_value)
    if email:
        sender_info = {'name': name, 'email': email}
        participants.append(sender_info)

    for field in ['to', 'cc']:
        value = header_dict.get(field, '')
        for part in value.split(','):
            name, email = parseaddr(part.strip())
            if email:
                participants.append({'name': name, 'email': email})

    return {
        'subject': header_dict.get('subject', ''),
        'from': header_dict.get('from', ''),
        'to': header_dict.get('to', ''),
        'date': header_dict.get('date', ''),
        'sender': sender_info,
        'participants': participants,
    }


def get_message_body(msg: Dict) -> str:
    """Extract plain text body from message."""
    payload = msg.get('payload', {})

    if 'parts' in payload:
        for part in payload['parts']:
            if part.get('mimeType') == 'text/plain':
                data = part.get('body', {}).get('data', '')
                if data:
                    return base64.urlsafe_b64decode(data).decode('utf-8', errors='ignore')

    body_data = payload.get('body', {}).get('data', '')
    if body_data:
        return base64.urlsafe_b64decode(body_data).decode('utf-8', errors='ignore')

    return msg.get('snippet', '')


def fetch_emails(days: int = 14, dry_run: bool = False) -> List[Dict]:
    """Fetch emails from the last N days."""
    if dry_run:
        print("[DRY RUN] Would fetch emails from Gmail")
        return []

    client = GmailClient()
    after_date = (datetime.now() - timedelta(days=days)).strftime('%Y/%m/%d')
    query = f"after:{after_date}"

    print(f"Fetching emails from last {days} days...")
    print(f"Query: {query}")

    messages = client.list_messages(max_results=500, query=query)
    print(f"Found {len(messages)} messages")

    results = []
    for i, msg_meta in enumerate(messages):
        msg_id = msg_meta['id']
        msg = client.get_message(msg_id, format='full')

        headers = parse_email_headers(msg)
        snippet = msg.get('snippet', '')
        body = get_message_body(msg)

        # Get sender domain for classification
        sender_email = headers.get('sender', {}).get('email', '')
        sender_domain = ''
        if '@' in sender_email:
            sender_domain = sender_email.split('@')[1].split('.')[0].lower()

        # Stage 1: Classify
        classification, class_reason = classify_email(
            headers['subject'], body, snippet, sender_domain
        )

        email_data = {
            'id': msg_id,
            'thread_id': msg.get('threadId', ''),
            'internal_date': msg.get('internalDate', ''),
            'snippet': snippet,
            'body': body,
            'label_ids': msg.get('labelIds', []),
            **headers,
            'sender_domain': sender_domain,
            'classification': classification,
            'classification_reason': class_reason,
        }

        results.append(email_data)

        if (i + 1) % 50 == 0:
            print(f"  Processed {i + 1}/{len(messages)} messages...")

    return results


# =============================================================================
# Deduplication
# =============================================================================

def normalize_for_dedup(text: str) -> str:
    """Normalize text for deduplication."""
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def create_dedup_key(matter_id: str, task_text: str) -> str:
    """Create deduplication key."""
    normalized = normalize_for_dedup(task_text)
    return f"{matter_id}:{hashlib.md5(normalized.encode()).hexdigest()[:8]}"


# =============================================================================
# Report Generation
# =============================================================================

def generate_report(actions: List[Dict], waiting: List[Dict],
                   excluded: List[Dict], summary: Dict, matters: Dict) -> str:
    """Generate lawyer-readable markdown report."""
    lines = [
        "# Firmwide To-Do Rollup",
        "",
        f"_Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}_",
        "",
        "---",
        "",
        "## Executive Summary",
        "",
        f"| Metric | Count |",
        f"|--------|-------|",
        f"| Emails Scanned | {summary['emails_scanned']} |",
        f"| Action Required | {summary['action_required']} |",
        f"| Waiting on Other | {summary['waiting_on_other']} |",
        f"| Info Only | {summary['info_only']} |",
        f"| Excluded (No Action) | {summary['no_action']} |",
        "",
        f"**Actionable Tasks:** {len(actions)} ({summary['with_deadlines']} with deadlines)",
        f"**Unassigned:** {summary['unassigned']} (need manual mapping)",
        "",
        "---",
        "",
    ]

    # Action Queue by Matter
    lines.append("## Action Queue")
    lines.append("")
    lines.append("_Tasks requiring lawyer action, grouped by matter._")
    lines.append("")

    # Group by matter
    by_matter = defaultdict(list)
    for task in actions:
        by_matter[task['matter_id']].append(task)

    # Sort matters by delivery status (exclude UNASSIGNED and special pseudo-IDs)
    status_order = {'essential': 0, 'strategic': 1, 'standard': 2, 'parked': 3, 'unassigned': 4}
    sorted_matters = sorted(
        [m for m in by_matter.keys() if m != 'UNASSIGNED' and m not in SPECIAL_MATTER_IDS],
        key=lambda m: (status_order.get(matters.get(m, {}).get('delivery_status', 'unassigned'), 5), m)
    )

    for matter_id in sorted_matters:
        matter_tasks = by_matter[matter_id]
        matter_info = matters.get(matter_id, {})
        matter_name = matter_info.get('matter_name', matter_id)
        delivery = matter_info.get('delivery_status', 'unknown').upper()

        lines.append(f"### {matter_id} — {matter_name} [{delivery}]")
        lines.append("")

        # Sort by deadline (deadline tasks first), then by date
        matter_tasks.sort(key=lambda t: (
            0 if t.get('deadline') else 1,
            t.get('evidence_date', '')
        ), reverse=True)

        for task in matter_tasks:
            deadline_str = f" **[{task['deadline']}]**" if task.get('deadline') else ""
            lines.append(f"- [ ] {task['task_text']}{deadline_str}")
            lines.append(f"  - _Evidence: {task['evidence_date']} — {task['evidence_subject'][:50]}_")

        lines.append("")

    # Waiting/Follow-up Queue
    lines.append("---")
    lines.append("")
    lines.append("## Waiting / Follow-Up Queue")
    lines.append("")
    lines.append("_Items where we are awaiting response from others._")
    lines.append("")

    if waiting:
        # Group by matter
        waiting_by_matter = defaultdict(list)
        for item in waiting:
            waiting_by_matter[item['matter_id']].append(item)

        for matter_id in sorted(waiting_by_matter.keys()):
            matter_info = matters.get(matter_id, {})
            matter_name = matter_info.get('matter_name', matter_id)

            if matter_id != 'UNASSIGNED':
                lines.append(f"**{matter_id} — {matter_name}**")
            else:
                lines.append("**Unassigned**")

            for item in waiting_by_matter[matter_id]:
                lines.append(f"- {item['summary']}")
                lines.append(f"  - _From: {item['from'][:40]} | {item['evidence_date']}_")
            lines.append("")
    else:
        lines.append("_No items in waiting queue._")
        lines.append("")

    # Special Categories (pseudo-matter IDs)
    # New Inquiries (potential clients needing intake)
    new_inquiry_tasks = by_matter.get('NEW_INQUIRY', [])
    if new_inquiry_tasks:
        lines.append("---")
        lines.append("")
        lines.append("## New Inquiries")
        lines.append("")
        lines.append("_Potential new clients requiring intake/follow-up._")
        lines.append("")
        for task in new_inquiry_tasks:
            lines.append(f"- [ ] {task['task_text'][:80]}")
            lines.append(f"  - _From: {task.get('evidence_from', '')[:40]} | {task['evidence_date']}_")
        lines.append("")

    # Pending Matters (mapped but matter folder not yet created)
    pending_tasks = by_matter.get('HILLSIDE-PENDING', [])
    if pending_tasks:
        lines.append("---")
        lines.append("")
        lines.append("## Pending Matter: HillSide")
        lines.append("")
        lines.append("_Matter folder not yet created. Create matter to enable tracking._")
        lines.append("")
        for task in pending_tasks:
            lines.append(f"- [ ] {task['task_text'][:80]}")
            lines.append(f"  - _Evidence: {task['evidence_date']} — {task.get('evidence_subject', '')[:50]}_")
        lines.append("")

    # Unassigned Items
    unassigned_tasks = by_matter.get('UNASSIGNED', [])
    if unassigned_tasks:
        lines.append("---")
        lines.append("")
        lines.append("## Unassigned Items")
        lines.append("")
        lines.append("_Could not map to a matter. Suggested matches provided where possible._")
        lines.append("")
        lines.append("| Task | From | Subject | Suggested Match |")
        lines.append("|------|------|---------|-----------------|")

        for task in unassigned_tasks:
            from_addr = task.get('evidence_from', '')[:25]
            subject = task.get('evidence_subject', '')[:30]
            suggested = task.get('suggested_match', '')
            if suggested:
                suggested_name = matters.get(suggested, {}).get('matter_name', suggested)
                suggested = f"{suggested} ({suggested_name[:20]})"
            else:
                suggested = "_none_"
            task_text = task['task_text'][:50]
            lines.append(f"| {task_text} | {from_addr} | {subject} | {suggested} |")

        lines.append("")

    # Explicit Exclusions
    lines.append("---")
    lines.append("")
    lines.append("## Excluded (No Action)")
    lines.append("")
    lines.append(f"_Automated notifications, marketing, and noise ({len(excluded)} items)._")
    lines.append("")

    if excluded and len(excluded) <= 20:
        lines.append("<details>")
        lines.append("<summary>View excluded items</summary>")
        lines.append("")
        for item in excluded[:20]:
            lines.append(f"- {item['subject'][:60]} ({item['reason']})")
        lines.append("")
        lines.append("</details>")
    else:
        # Group by reason
        by_reason = defaultdict(int)
        for item in excluded:
            reason = item.get('reason', 'unknown')
            if ':' in reason:
                reason = reason.split(':')[0]
            by_reason[reason] += 1

        lines.append("| Reason | Count |")
        lines.append("|--------|-------|")
        for reason, count in sorted(by_reason.items(), key=lambda x: -x[1]):
            lines.append(f"| {reason} | {count} |")

    lines.append("")

    return '\n'.join(lines)


# =============================================================================
# Main Pipeline
# =============================================================================

def main():
    days = 14
    dry_run = '--dry-run' in sys.argv

    for i, arg in enumerate(sys.argv):
        if arg == '--days' and i + 1 < len(sys.argv):
            days = int(sys.argv[i + 1])

    print("=" * 60)
    print("Firmwide To-Do Rollup (v2 - Two-Stage Pipeline)")
    print("=" * 60)
    print()

    # Step A: Load matters
    print("Step A: Loading matters...")
    matters = load_matters()
    print(f"  Loaded {len(matters)} matters")

    # Step B: Build participant mapping
    print("Step B: Building participant mapping...")
    participant_mapping = build_participant_mapping(matters)
    print(f"  Built mapping with {len(participant_mapping)} entries")

    # Step C: Fetch and classify emails
    print(f"\nStep C: Fetching and classifying emails (last {days} days)...")
    emails = fetch_emails(days=days, dry_run=dry_run)

    if dry_run or not emails:
        print("\n[DRY RUN] Skipping remaining steps")
        return 0

    # Count classifications
    class_counts = defaultdict(int)
    for email in emails:
        class_counts[email['classification']] += 1

    print(f"\n  Classification results:")
    print(f"    ACTION_REQUIRED:  {class_counts[EmailClass.ACTION_REQUIRED]}")
    print(f"    WAITING_ON_OTHER: {class_counts[EmailClass.WAITING_ON_OTHER]}")
    print(f"    INFO_ONLY:        {class_counts[EmailClass.INFO_ONLY]}")
    print(f"    NO_ACTION:        {class_counts[EmailClass.NO_ACTION]}")

    # Step D: Process ACTION_REQUIRED → Tasks
    print("\nStep D: Extracting tasks from ACTION_REQUIRED emails...")

    thread_mapping = {}
    actions = []
    waiting = []
    excluded = []
    seen_dedup_keys = set()

    for email in emails:
        classification = email['classification']

        # Track excluded items
        if classification == EmailClass.NO_ACTION:
            excluded.append({
                'subject': email.get('subject', ''),
                'reason': email.get('classification_reason', ''),
                'date': email.get('date', ''),
            })
            continue

        # Map to matter
        matter_id, mapping_method, suggested = map_email_to_matter(
            email, participant_mapping, thread_mapping, matters
        )

        # Update thread mapping
        if email.get('thread_id') and matter_id != 'UNASSIGNED':
            thread_mapping[email['thread_id']] = matter_id

        # Parse date
        internal_date = email.get('internal_date', '')
        if internal_date:
            try:
                dt = datetime.fromtimestamp(int(internal_date) / 1000)
                evidence_date = dt.strftime('%Y-%m-%d')
            except:
                evidence_date = ''
        else:
            evidence_date = ''

        # Process based on classification
        if classification == EmailClass.WAITING_ON_OTHER:
            # Extract a summary for waiting items
            body = email.get('body', email.get('snippet', ''))
            summary = body[:100].replace('\n', ' ').strip()
            if len(body) > 100:
                summary += '...'

            waiting.append({
                'matter_id': matter_id,
                'summary': summary,
                'from': email.get('from', ''),
                'subject': email.get('subject', ''),
                'evidence_date': evidence_date,
            })
            continue

        if classification == EmailClass.INFO_ONLY:
            continue  # Skip info-only emails

        # ACTION_REQUIRED: Extract and normalize task
        body = email.get('body', email.get('snippet', ''))
        task_text = normalize_task(body)

        if not task_text:
            continue

        # Dedup check
        dedup_key = create_dedup_key(matter_id, task_text)
        if dedup_key in seen_dedup_keys:
            continue
        seen_dedup_keys.add(dedup_key)

        # Extract deadline
        deadline = extract_deadline(body)

        # Build task record
        matter_info = matters.get(matter_id, {})

        task = {
            'matter_id': matter_id,
            'matter_name': matter_info.get('matter_name', ''),
            'delivery_status': matter_info.get('delivery_status', 'unassigned'),
            'task_text': task_text,
            'deadline': deadline,
            'evidence_date': evidence_date,
            'evidence_subject': email.get('subject', ''),
            'evidence_from': email.get('from', ''),
            'mapping_method': mapping_method,
            'suggested_match': suggested,
        }

        actions.append(task)

    print(f"  Extracted {len(actions)} actionable tasks")
    print(f"  Found {len(waiting)} waiting/follow-up items")

    # Step E: Generate report
    print("\nStep E: Generating report...")

    summary = {
        'days': days,
        'emails_scanned': len(emails),
        'action_required': class_counts[EmailClass.ACTION_REQUIRED],
        'waiting_on_other': class_counts[EmailClass.WAITING_ON_OTHER],
        'info_only': class_counts[EmailClass.INFO_ONLY],
        'no_action': class_counts[EmailClass.NO_ACTION],
        'total_tasks': len(actions),
        'with_deadlines': sum(1 for t in actions if t.get('deadline')),
        'unassigned': sum(1 for t in actions if t['matter_id'] == 'UNASSIGNED'),
    }

    report = generate_report(actions, waiting, excluded, summary, matters)

    # Write report
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_file = OUTPUT_DIR / f"todo_rollup_{datetime.now().strftime('%Y-%m-%d')}.md"

    with open(output_file, 'w') as f:
        f.write(report)

    print(f"\n  Report written to: {output_file}")

    # Print summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Emails scanned:      {summary['emails_scanned']}")
    print(f"Action Required:     {summary['action_required']} → {len(actions)} tasks")
    print(f"Waiting on Other:    {summary['waiting_on_other']} → {len(waiting)} items")
    print(f"Excluded (noise):    {summary['no_action']}")
    print(f"Tasks with deadline: {summary['with_deadlines']}")
    print(f"Unassigned:          {summary['unassigned']}")
    print()

    return 0


if __name__ == '__main__':
    sys.exit(main())
