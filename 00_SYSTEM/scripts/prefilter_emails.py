#!/usr/bin/env python3
"""Pre-filter emails: remove noise, apply excluded domains, extract metadata."""

import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
INPUT_PATH = REPO_ROOT / "06_RUNS" / "ops" / "gmail_fetch_latest.json"
OUTPUT_PATH = REPO_ROOT / "06_RUNS" / "ops" / "emails_prefiltered.json"

# Excluded domains (noise/system/SaaS)
EXCLUDED_DOMAINS = {
    "google.com", "github.com", "slack.com", "asana.com", "clio.com",
    "upwork.com", "zoom.us", "microsoft.com", "amazon.ca", "amazon.com",
    "wordpress.org", "wordpress.com", "calendly.com", "docusign.com",
    "dropbox.com", "notifications.google.com", "noreply",
    "soulpepper.com",  # marketing consultant
    "facebookmail.com", "linkedin.com", "twitter.com",
    "mailchimp.com", "constantcontact.com", "hubspot.com",
    "squarespace.com", "wix.com", "shopify.com",
    "intuit.com", "quickbooks.com",
    # Financial/banking noise
    "td.com", "e.email-td.com", "bell.ca", "lawpay.info",
    # Newsletters/marketing
    "substack.com", "bizbuysell.com", "mercor.com",
    # Government notifications (no task — info only)
    "notification.canada.ca",
}

# Automated sender patterns
AUTO_PATTERNS = [
    r"noreply@", r"no-reply@", r"donotreply@", r"notifications@",
    r"mailer-daemon@", r"postmaster@", r"calendar-notification@",
    r"notification@", r"updates@", r"alert@", r"system@",
    r"wordpress@", r"admin@.*wordpress",
]

# NO_ACTION subject patterns
NO_ACTION_SUBJECTS = [
    r"(?i)unsubscribe", r"(?i)newsletter", r"(?i)your.*password",
    r"(?i)verification code", r"(?i)MFA", r"(?i)two.factor",
    r"(?i)calendar.*(?:invite|update|reminder)",
    r"(?i)out of office", r"(?i)automatic reply",
    r"(?i)delivery.*(?:status|failure|notification)",
]


def extract_email_address(from_field):
    """Extract email address from 'Name <email>' format."""
    match = re.search(r'<([^>]+)>', from_field)
    if match:
        return match.group(1).lower()
    return from_field.strip().lower()


def extract_domain(email_addr):
    """Extract domain from email address."""
    if "@" in email_addr:
        return email_addr.split("@")[1]
    return ""


def is_excluded_domain(domain):
    for excl in EXCLUDED_DOMAINS:
        if excl in domain:
            return True
    return False


def is_automated_sender(from_field):
    email = extract_email_address(from_field)
    for pat in AUTO_PATTERNS:
        if re.search(pat, email):
            return True
    return False


def is_no_action_subject(subject):
    for pat in NO_ACTION_SUBJECTS:
        if re.search(pat, subject):
            return True
    return False


def is_self_sent(from_field):
    """Check if email is from the firm's own domains."""
    email = extract_email_address(from_field)
    domain = extract_domain(email)
    firm_domains = {"levinelegal.ca", "levinelegalservices.com", "levine-law.ca"}
    return domain in firm_domains


def main():
    with open(INPUT_PATH) as f:
        data = json.load(f)

    emails = data["emails"]
    results = {
        "no_action": [],
        "self_sent": [],
        "candidates": [],
    }

    for email in emails:
        from_field = email.get("from", "")
        subject = email.get("subject", "")
        email_addr = extract_email_address(from_field)
        domain = extract_domain(email_addr)

        # Pre-filter: self-sent (sent mail appearing in inbox / internal)
        if is_self_sent(from_field):
            results["self_sent"].append({
                "message_id": email["message_id"],
                "from": from_field,
                "subject": subject,
                "date": email.get("date", ""),
                "reason": "self_sent",
            })
            continue

        # Pre-filter: excluded domain
        if is_excluded_domain(domain):
            results["no_action"].append({
                "message_id": email["message_id"],
                "from": from_field,
                "subject": subject,
                "date": email.get("date", ""),
                "reason": f"excluded_domain:{domain}",
            })
            continue

        # Pre-filter: automated sender
        if is_automated_sender(from_field):
            results["no_action"].append({
                "message_id": email["message_id"],
                "from": from_field,
                "subject": subject,
                "date": email.get("date", ""),
                "reason": "automated_sender",
            })
            continue

        # Pre-filter: NO_ACTION subject
        if is_no_action_subject(subject):
            results["no_action"].append({
                "message_id": email["message_id"],
                "from": from_field,
                "subject": subject,
                "date": email.get("date", ""),
                "reason": "no_action_subject",
            })
            continue

        # Passes pre-filter — candidate for LLM classification
        results["candidates"].append(email)

    summary = {
        "total_emails": len(emails),
        "no_action_count": len(results["no_action"]),
        "self_sent_count": len(results["self_sent"]),
        "candidate_count": len(results["candidates"]),
    }

    output = {
        "prefilter_summary": summary,
        "input_window_days": data["input_window_days"],
        "candidates": results["candidates"],
        "no_action": results["no_action"],
        "self_sent": results["self_sent"],
    }

    with open(OUTPUT_PATH, "w") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"Pre-filter results:")
    print(f"  Total emails:  {summary['total_emails']}")
    print(f"  NO_ACTION:     {summary['no_action_count']}")
    print(f"  Self-sent:     {summary['self_sent_count']}")
    print(f"  Candidates:    {summary['candidate_count']}")
    print(f"Saved to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
