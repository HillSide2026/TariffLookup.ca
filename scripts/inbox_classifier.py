#!/usr/bin/env python3
"""
Inbox Classifier Module
Stage 2.3 / 2.4 — Inbox Intelligence Layer

Deterministic inbox triage classifier that:
- Reads Gmail messages (read-only)
- Produces classification proposals
- Logs every decision
- Generates Draft Placement Plan artifacts

NO EXECUTION. NO WRITES TO GMAIL. PROPOSALS ONLY.

Taxonomy v1.3 (2026-01-29)
"""

import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple

# Classifier version
MODEL_VERSION = "inbox-triage-v0.3"

# Valid taxonomy values (v1.3)
OBJECT_TYPES = [
    "Matters — Activity",
    "Matters — Client",
    "Operations — Fulfillment",
    "Operations — Inquiries",
    "Firm Management — Vendors / Billing",
    "Promotions",
    "System Notification",
    "Noise"
]

LIFECYCLE_STATES = [
    "Action Required",
    "Waiting",
    "Reference",
    "Archive Candidate"
]

SYSTEM_DOMAINS = [
    "Matters",
    "Operations",
    "Firm Management",
    "System Operations",
    "Personal Noise"
]

DESTINATION_MAP = {
    "Matters": "05_MATTERS",
    "Operations": "04_OPERATIONS",
    "Firm Management": "07_FIRM_MANAGEMENT",
    "System Operations": "00_SYSTEM",
    "Personal Noise": "09_ARCHIVE"
}

# Object Type → System Domain mapping
OBJECT_TO_DOMAIN = {
    "Matters — Activity": "Matters",
    "Matters — Client": "Matters",
    "Operations — Fulfillment": "Operations",
    "Operations — Inquiries": "Operations",
    "Firm Management — Vendors / Billing": "Firm Management",
    "Promotions": "Personal Noise",
    "System Notification": "System Operations",
    "Noise": "Personal Noise"
}

# Classification rules (pattern-based)
# These are heuristics - not ML models

# Sender domain patterns
LEGAL_DOMAINS = [
    r"court", r"judiciary", r"\.gov$", r"law\.com",
    r"legal", r"attorney", r"barrister", r"solicitor",
    r"levinelegal"
]

VENDOR_DOMAINS = [
    r"asana\.com", r"quickbooks", r"xero", r"freshbooks",
    r"stripe", r"paypal", r"slack\.com", r"zoom\.us",
    r"microsoft\.com", r"google\.com", r"github\.com"
]

FULFILLMENT_DOMAINS = [
    r"clio\.com"  # Legal practice management = fulfillment
]

PROMOTIONS_DOMAINS = [
    r"mailchimp", r"sendgrid", r"hubspot", r"marketo",
    r"constantcontact", r"newsletter", r"promo",
    r"canadapost", r"marketing"
]

SYSTEM_DOMAINS_PATTERNS = [
    r"noreply", r"no-reply", r"donotreply",
    r"notification", r"alert", r"automated"
]

# ============================================================
# CALIBRATED RULES (v0.3) - ML1 Approved 2026-01-30
# See: 02_PLAYBOOKS/EXECUTION/CALIBRATION_LOG.md
# ============================================================

# Known noise senders (OBS-20260130-002)
NOISE_DOMAINS = [
    r"barberismo\.com"
]

# Known CRM senders - NOT system notifications (OBS-20260130-001)
# May be Inquiries OR Client depending on context
CRM_DOMAINS = [
    r"soulpepper\.com"
]

# Government promotional outreach domains (OBS-20260130-004)
GOV_PROMO_DOMAINS = [
    r"\.gc\.ca$"
]

# Zoom Clips subject pattern → Operations Fulfillment (OBS-20260130-003)
ZOOM_CLIPS_PATTERN = r"clips.*view|your clip"

# Subject patterns
ACTION_PATTERNS = [
    r"urgent", r"asap", r"deadline", r"due\s", r"action\s*required",
    r"please\s*(respond|reply|review|sign|approve)",
    r"need\s*(your|a)\s*(response|decision|signature)",
    r"by\s*(end\s*of|eod|cob|tomorrow|monday|tuesday|wednesday|thursday|friday)"
]

LEGAL_SUBJECT_PATTERNS = [
    r"matter", r"case", r"docket", r"filing", r"motion",
    r"settlement", r"agreement", r"contract", r"litigation",
    r"opposing\s*counsel", r"court\s*date", r"hearing",
    r"deposition", r"discovery", r"subpoena", r"draft"
]

BILLING_SUBJECT_PATTERNS = [
    r"invoice", r"receipt", r"payment", r"billing",
    r"subscription", r"renewal", r"charge", r"statement",
    r"confirmation"
]

INQUIRY_PATTERNS = [
    r"inquiry", r"inquiries", r"consultation", r"voicemail",
    r"missed\s*call", r"new\s*lead", r"contact\s*form"
]

FULFILLMENT_PATTERNS = [
    r"surplus", r"trust", r"retainer", r"accounting",
    r"client\s*payment", r"matter\s*payment"
]


class InboxClassifier:
    """
    Deterministic inbox classifier.

    Authority Constraints:
    - READ-ONLY: No Gmail writes
    - PROPOSALS ONLY: No execution
    - LOGGED: Every decision recorded

    Taxonomy: v1.3
    """

    def __init__(self):
        self.model_version = MODEL_VERSION

    def classify(self, message_metadata: Dict[str, Any]) -> Dict[str, Any]:
        """
        Classify a single message.

        Args:
            message_metadata: Dict with message_id, subject, sender, snippet, timestamp, labels

        Returns:
            Classification result with object_type, lifecycle_state, system_domain, confidence
        """
        message_id = message_metadata.get("message_id", "")
        subject = message_metadata.get("subject", "").lower()
        sender = message_metadata.get("sender", "").lower()
        snippet = message_metadata.get("snippet", "").lower()
        labels = [l.lower() for l in message_metadata.get("labels", [])]
        timestamp = message_metadata.get("timestamp", "")

        # Extract sender domain
        sender_domain = self._extract_domain(sender)

        # Classify
        object_type, obj_confidence, obj_reasons = self._classify_object_type(
            subject, sender_domain, snippet, labels
        )

        lifecycle_state, life_confidence, life_reasons = self._classify_lifecycle_state(
            subject, snippet, labels
        )

        # Get system domain from object type mapping
        system_domain = OBJECT_TO_DOMAIN.get(object_type, "Personal Noise")

        # Aggregate confidence (geometric mean)
        confidence = round((obj_confidence * life_confidence) ** 0.5, 2)

        # Combine reasoning traces (max 3)
        reasoning_trace = (obj_reasons + life_reasons)[:3]

        # Check for Unknown / Needs Human
        if confidence < 0.60:
            reasoning_trace = ["Low confidence - needs human review"] + reasoning_trace[:2]

        # Build result
        result = {
            "message_id": message_id,
            "object_type": object_type,
            "lifecycle_state": lifecycle_state,
            "system_domain": system_domain,
            "confidence": confidence,
            "reasoning_trace": reasoning_trace,
            "proposed_destination": DESTINATION_MAP.get(system_domain, "09_ARCHIVE"),
            "status": "proposal_only",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "model_version": self.model_version
        }

        return result

    def _extract_domain(self, email: str) -> str:
        """Extract domain from email address."""
        match = re.search(r"@([\w.-]+)", email)
        return match.group(1) if match else ""

    def _classify_object_type(
        self, subject: str, sender_domain: str, snippet: str, labels: List[str]
    ) -> Tuple[str, float, List[str]]:
        """Classify object type based on patterns."""
        reasons = []
        scores = {t: 0.0 for t in OBJECT_TYPES}

        # ============================================================
        # CALIBRATED RULES (v0.3) - Check these first
        # ============================================================

        # OBS-20260130-002: barberismo.com is Noise
        for pattern in NOISE_DOMAINS:
            if re.search(pattern, sender_domain):
                scores["Noise"] += 0.8
                reasons.append(f"Known noise sender ({sender_domain})")
                # Return early - high confidence noise
                return "Noise", 0.90, reasons

        # OBS-20260130-004: .gc.ca consultations are Promotions
        for pattern in GOV_PROMO_DOMAINS:
            if re.search(pattern, sender_domain):
                if re.search(r"consultation", subject):
                    scores["Promotions"] += 0.7
                    reasons.append("Government consultation outreach (promotional)")
                    return "Promotions", 0.85, reasons

        # OBS-20260130-003: Zoom Clips are Operations — Fulfillment
        if "zoom.us" in sender_domain and re.search(ZOOM_CLIPS_PATTERN, subject):
            scores["Operations — Fulfillment"] += 0.7
            reasons.append("Zoom Clips (team communication)")
            return "Operations — Fulfillment", 0.85, reasons

        # OBS-20260130-001: CRM senders are NOT System Notification
        # Default to Inquiries but may need human review for Client vs Inquiry
        for pattern in CRM_DOMAINS:
            if re.search(pattern, sender_domain):
                scores["Operations — Inquiries"] += 0.5
                reasons.append(f"CRM sender ({sender_domain}) - verify if inquiry or client")
                # Don't return early - let other rules contribute
                break

        # ============================================================
        # END CALIBRATED RULES
        # ============================================================

        # Check for Promotions first (via Gmail label)
        if "category_promotions" in labels:
            scores["Promotions"] += 0.6
            reasons.append("Gmail labeled as promotions")

        for pattern in PROMOTIONS_DOMAINS:
            if re.search(pattern, sender_domain):
                scores["Promotions"] += 0.4
                reasons.append("Sender is promotional")
                break

        # Check for System Notification (but not if already handled by CRM rules)
        is_crm = any(re.search(p, sender_domain) for p in CRM_DOMAINS)
        if not is_crm:
            for pattern in SYSTEM_DOMAINS_PATTERNS:
                if re.search(pattern, sender_domain):
                    scores["System Notification"] += 0.5
                    reasons.append("Sender is automated system")
                    break

        # Check for Firm Management — Vendors / Billing
        for pattern in VENDOR_DOMAINS:
            if re.search(pattern, sender_domain):
                # Check if it's about client payment (fulfillment) vs firm payment (vendor)
                is_fulfillment = any(re.search(p, subject + snippet) for p in FULFILLMENT_PATTERNS)
                if is_fulfillment:
                    scores["Operations — Fulfillment"] += 0.5
                    reasons.append("Client-related billing")
                else:
                    scores["Firm Management — Vendors / Billing"] += 0.4
                    reasons.append("Vendor/firm billing")
                break

        for pattern in BILLING_SUBJECT_PATTERNS:
            if re.search(pattern, subject):
                # Distinguish fulfillment vs vendor
                is_fulfillment = any(re.search(p, subject + snippet) for p in FULFILLMENT_PATTERNS)
                if is_fulfillment:
                    scores["Operations — Fulfillment"] += 0.3
                else:
                    scores["Firm Management — Vendors / Billing"] += 0.3
                reasons.append("Subject contains billing term")
                break

        # Check for Fulfillment (Clio, client payments)
        for pattern in FULFILLMENT_DOMAINS:
            if re.search(pattern, sender_domain):
                scores["Operations — Fulfillment"] += 0.5
                reasons.append("Practice management system (fulfillment)")
                break

        for pattern in FULFILLMENT_PATTERNS:
            if re.search(pattern, subject + snippet):
                scores["Operations — Fulfillment"] += 0.3
                reasons.append("Fulfillment-related content")
                break

        # Check for Inquiries (voicemails, missed calls, new leads)
        for pattern in INQUIRY_PATTERNS:
            if re.search(pattern, subject + snippet):
                scores["Operations — Inquiries"] += 0.5
                reasons.append("Inquiry/lead indicator")
                break

        # Check for Matters — Activity (legal work)
        for pattern in LEGAL_SUBJECT_PATTERNS:
            if re.search(pattern, subject):
                scores["Matters — Activity"] += 0.4
                reasons.append("Subject contains legal term")
                break

        for pattern in LEGAL_DOMAINS:
            if re.search(pattern, sender_domain):
                scores["Matters — Activity"] += 0.3
                reasons.append("Sender domain suggests legal")
                break

        # Check labels for spam/noise
        if "spam" in labels:
            scores["Noise"] += 0.8
            reasons.append("Gmail labeled as spam")

        # Default logic: if nothing strong, check if from own domain (client communication)
        if max(scores.values()) < 0.3:
            if "levinelegal" in sender_domain:
                scores["Matters — Activity"] += 0.4
                reasons.append("From firm domain")
            elif "important" in labels or "starred" in labels:
                scores["Matters — Client"] += 0.4
                reasons.append("Marked important - potential client")
            else:
                # True fallback: Operations — Inquiries (unknown sender)
                scores["Operations — Inquiries"] += 0.35
                reasons.append("Unknown sender - treating as inquiry")

        # Pick highest
        object_type = max(scores, key=scores.get)
        confidence = min(0.95, scores[object_type] + 0.35)  # Base + score, capped

        return object_type, confidence, reasons[:2]

    def _classify_lifecycle_state(
        self, subject: str, snippet: str, labels: List[str]
    ) -> Tuple[str, float, List[str]]:
        """Classify lifecycle state."""
        reasons = []

        # Check for action required
        for pattern in ACTION_PATTERNS:
            if re.search(pattern, subject) or re.search(pattern, snippet):
                reasons.append("Contains action language")
                return "Action Required", 0.85, reasons

        if "important" in labels or "starred" in labels:
            reasons.append("Marked important/starred")
            return "Action Required", 0.75, reasons

        # Check for waiting indicators
        if re.search(r"(fyi|for your (info|information|records)|just letting you know)", subject + snippet):
            reasons.append("FYI language detected")
            return "Reference", 0.80, reasons

        if re.search(r"(thank|received|confirmed|acknowledged)", subject + snippet):
            reasons.append("Acknowledgment language")
            return "Waiting", 0.75, reasons

        # Check for archive candidates
        if "trash" in labels or "spam" in labels:
            reasons.append("In trash/spam")
            return "Archive Candidate", 0.90, reasons

        # Default to Reference
        reasons.append("No action indicators")
        return "Reference", 0.65, reasons


def extract_message_metadata(gmail_message: Dict[str, Any]) -> Dict[str, Any]:
    """
    Extract classifier inputs from Gmail API message format.

    Args:
        gmail_message: Raw message from Gmail API (metadata format)

    Returns:
        Normalized metadata dict for classifier
    """
    headers = {}
    for header in gmail_message.get("payload", {}).get("headers", []):
        headers[header["name"].lower()] = header["value"]

    return {
        "message_id": gmail_message.get("id", ""),
        "subject": headers.get("subject", "(no subject)"),
        "sender": headers.get("from", ""),
        "snippet": gmail_message.get("snippet", ""),
        "timestamp": headers.get("date", ""),
        "labels": gmail_message.get("labelIds", [])
    }


def build_log_entry(
    classification: Dict[str, Any],
    metadata: Dict[str, Any],
    run_id: str
) -> Dict[str, Any]:
    """
    Build a log entry per LOGGING_SPEC.md.

    Redacts sensitive info per spec.
    """
    # Extract sender domain only (redaction)
    sender = metadata.get("sender", "")
    domain_match = re.search(r"@([\w.-]+)", sender)
    sender_domain = domain_match.group(1) if domain_match else "unknown"

    # Truncate subject
    subject = metadata.get("subject", "")[:120]

    return {
        "timestamp": classification["timestamp"],
        "message_id": classification["message_id"],
        "object_type": classification["object_type"],
        "lifecycle_state": classification["lifecycle_state"],
        "system_domain": classification["system_domain"],
        "confidence": classification["confidence"],
        "status": "proposal_only",
        "model_version": classification["model_version"],
        "inputs_summary": {
            "subject": subject,
            "sender_domain": sender_domain,
            "labels": metadata.get("labels", []),
            "received_at": metadata.get("timestamp", "")
        },
        "run_id": run_id
    }


if __name__ == "__main__":
    # Test the classifier with sample data
    test_message = {
        "message_id": "test123",
        "subject": "Re: Settlement Agreement - Jones v. Smith",
        "sender": "client@clientco.com",
        "snippet": "Please review the attached settlement terms by Friday.",
        "timestamp": "2026-01-28T10:00:00Z",
        "labels": ["INBOX", "IMPORTANT"]
    }

    classifier = InboxClassifier()
    result = classifier.classify(test_message)

    print("Test Classification Result:")
    print(json.dumps(result, indent=2))
