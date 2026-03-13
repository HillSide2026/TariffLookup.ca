---
id: 02_playbooks__execution__calibration_log_md
title: Classifier Calibration Log — Stage 2.6
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Classifier Calibration Log — Stage 2.6

## Purpose

Track observations, proposed heuristics, and ML1-approved calibrations.

---

## Core Rule

> **ML2 may propose new heuristics.**
> **ML1 is the only entity that ratifies them.**

No calibration becomes "hard" without explicit ML1 approval.

---

## Log Format

### Observation Entry

```markdown
## OBS-YYYYMMDD-NNN: [Brief Title]

**Date:** YYYY-MM-DD
**Source:** [proposal review / execution / manual observation]
**Proposal ID:** (if applicable)

### Observation
[What was observed]

### Current Behavior
[How the classifier currently handles this]

### Proposed Adjustment
[What should change]

### Impact Assessment
- Affected object types:
- Estimated frequency:
- Risk of over-correction:

### Status
- [ ] Proposed
- [ ] ML1 Reviewed
- [ ] Approved
- [ ] Rejected
- [ ] Implemented

### ML1 Decision
**Decision:** [Approve / Reject / Modify]
**Date:**
**Notes:**
```

---

## Current Calibration Entries

### OBS-20260130-001: Soulpepper CRM Sender

**Date:** 2026-01-30
**Source:** Proposal review (PROPOSAL-001)
**Proposal ID:** PROPOSAL-001

### Observation
Messages from `noreply@donotreply.soulpepper.com` were classified as "System Notification" but are actually CRM-routed client inquiries.

### Current Behavior
Classifier sees `noreply` in sender domain and defaults to System Notification.

### Proposed Adjustment
Add sender pattern rule:
```
if sender_domain contains "soulpepper.com":
    # NOT System Notification - it's CRM traffic
    # Could be Operations — Inquiries (new lead) OR Matters — Client (existing client)
    # Default to Operations — Inquiries, flag for human review
    object_type = "Operations — Inquiries"  # default, may need override
    reasoning = "CRM sender (soulpepper.com) - verify if new inquiry or existing client"
```

### Impact Assessment
- Affected object types: System Notification → Operations — Inquiries (with possible client override)
- Estimated frequency: ~3-5 messages/week
- Risk of over-correction: Medium (may need per-message review for client vs inquiry)

### Status
- [x] Proposed
- [x] ML1 Reviewed
- [x] Approved (with refinement)
- [ ] Rejected
- [x] Implemented (v0.3)
- [x] Verified (pilot-2026-01-30-v3)

### ML1 Decision
**Decision:** Approved with refinement
**Date:** 2026-01-30
**Notes:** soulpepper.com is CRM - could be Inquiries OR Client depending on whether client address was captured. Not System Notification.

---

### OBS-20260130-002: Barberismo.com is Noise

**Date:** 2026-01-30
**Source:** Batch review (BATCH-20260130-001)
**Batch ID:** BATCH-20260130-001

### Observation
6 messages from `barberismo.com` with subject "[Barberismo] Please moderate..." were classified as "Operations — Inquiries" but are actually Noise.

### Current Behavior
Classifier sees unknown sender and defaults to Operations — Inquiries.

### Proposed Adjustment
Add sender pattern rule:
```
if sender_domain contains "barberismo.com":
    object_type = "Noise"
    system_domain = "Personal Noise"
    reasoning = "Known noise sender (barberismo.com)"
```

### Impact Assessment
- Affected object types: Operations — Inquiries → Noise
- Estimated frequency: ~6+ messages/batch
- Risk of over-correction: Low (domain is specific)

### Status
- [x] Proposed
- [x] ML1 Reviewed
- [x] Approved
- [ ] Rejected
- [x] Implemented (v0.3)
- [x] Verified (pilot-2026-01-30-v3: 17% Noise classification)

### ML1 Decision
**Decision:** Approved
**Date:** 2026-01-30
**Notes:** barberismo.com is noise

---

### OBS-20260130-003: Zoom Clips are Operations

**Date:** 2026-01-30
**Source:** Batch review (BATCH-20260130-001)
**Batch ID:** BATCH-20260130-001

### Observation
Message "Clips - your clip got its first view" from `zoom.us` was classified as "Firm Management — Vendors / Billing" but should be "Operations — Fulfillment" or "Operations — Inquiries".

### Current Behavior
Classifier sees zoom.us and classifies as vendor/billing (SaaS tool).

### Proposed Adjustment
Add subject pattern rule:
```
if sender_domain == "zoom.us" AND subject contains "Clips":
    object_type = "Operations — Fulfillment"
    reasoning = "Zoom Clips used for team communication"
```

### Impact Assessment
- Affected object types: Firm Management → Operations — Fulfillment
- Estimated frequency: Variable (depends on Clips usage)
- Risk of over-correction: Low (specific subject pattern)

### Status
- [x] Proposed
- [x] ML1 Reviewed
- [x] Approved
- [ ] Rejected
- [x] Implemented (v0.3)
- [x] Verified (pilot-2026-01-30-v3: 5% Operations — Fulfillment)

### ML1 Decision
**Decision:** Approved
**Date:** 2026-01-30
**Notes:** Used to communicate with offshore teammates

---

### OBS-20260130-004: Government Consultations are Promotions

**Date:** 2026-01-30
**Source:** Batch review (BATCH-20260130-001)
**Batch ID:** BATCH-20260130-001

### Observation
Message "Global Affairs Canada Targeted Consultation..." from `international.gc.ca` was classified as "Operations — Inquiries" but should be "Promotions".

### Current Behavior
Classifier sees government sender and marks as inquiry (potential lead).

### Proposed Adjustment
Add subject pattern rule:
```
if subject contains "Consultation" AND sender_domain contains ".gc.ca":
    object_type = "Promotions"
    system_domain = "Personal Noise"
    reasoning = "Government consultation outreach (promotional)"
```

### Impact Assessment
- Affected object types: Operations — Inquiries → Promotions
- Estimated frequency: Occasional (government outreach)
- Risk of over-correction: Low (specific pattern)

### Status
- [x] Proposed
- [x] ML1 Reviewed
- [x] Approved
- [ ] Rejected
- [x] Implemented (v0.3)
- [x] Verified (pilot-2026-01-30-v3: 3% Promotions)

### ML1 Decision
**Decision:** Approved
**Date:** 2026-01-30
**Notes:** Government consultations are promotional outreach

---

### OBS-20260130-005: Bank Messages from Firm Domain

**Date:** 2026-01-30
**Source:** Batch review (BATCH-20260130-002)
**Batch ID:** BATCH-20260130-002

### Observation
Message "TD DOLLAR ERROR" from `levinelegalservices.com` was classified as "Matters — Activity" but should be "Firm Management — Vendors / Billing" (bank message).

### Current Behavior
Classifier sees firm domain (levinelegal*) and defaults to Matters — Activity.

### Proposed Adjustment
Add subject pattern rule:
```
if subject contains bank-related terms ("TD", "RBC", "BMO", "CIBC", "Scotiabank", "dollar error", "bank"):
    object_type = "Firm Management — Vendors / Billing"
    reasoning = "Bank-related message"
```

### Impact Assessment
- Affected object types: Matters — Activity → Firm Management — Vendors / Billing
- Estimated frequency: Occasional (bank notifications)
- Risk of over-correction: Low (specific pattern + bank names)

### Status
- [x] Proposed
- [x] ML1 Reviewed
- [x] Approved
- [ ] Rejected
- [ ] Implemented

### ML1 Decision
**Decision:** Approved
**Date:** 2026-01-30
**Notes:** Bank messages should be Vendors/Billing even when forwarded from firm domain.

---

## Heuristic Proposal Template

When proposing a new classifier rule:

```markdown
## HEUR-YYYYMMDD-NNN: [Rule Name]

### Rule Definition
```
[pseudocode or logic]
```

### Trigger Conditions
- When: [conditions]
- Result: [classification]

### Evidence
- Observation IDs: [list]
- Sample count: [N]
- Accuracy on samples: [%]

### Risks
- False positive scenario:
- False negative scenario:
- Mitigation:

### ML1 Approval
- [ ] Approved for implementation
- [ ] Approved for trial (N messages)
- [ ] Rejected
- [ ] Needs more evidence
```

---

## Ratification Workflow

1. **Observe** — Note classification issue during review
2. **Document** — Create observation entry
3. **Propose** — Draft heuristic if pattern is clear
4. **Review** — ML1 reviews proposal
5. **Decide** — ML1 approves, rejects, or requests more data
6. **Implement** — If approved, update classifier
7. **Verify** — Monitor for regressions

---

## Implementation Tracking

| Heuristic ID | Status | Implemented | Verified |
|--------------|--------|-------------|----------|
| OBS-20260130-001 | Approved | v0.3 (2026-01-30) | ✓ pilot-2026-01-30-v3 |
| OBS-20260130-002 | Approved | v0.3 (2026-01-30) | ✓ pilot-2026-01-30-v3 |
| OBS-20260130-003 | Approved | v0.3 (2026-01-30) | ✓ pilot-2026-01-30-v3 |
| OBS-20260130-004 | Approved | v0.3 (2026-01-30) | ✓ pilot-2026-01-30-v3 |
| OBS-20260130-005 | Approved | — | — |

---

## Governance Notes

- Calibrations are versioned with classifier
- All changes logged in classifier changelog
- Rollback procedure: revert to prior classifier version
- No "silent" calibrations — all must be documented
