---
id: 02_playbooks__execution__grouping_logic_md
title: Proposal Grouping Logic — Stage 2.6
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Proposal Grouping Logic — Stage 2.6

## Purpose

Define how proposals are grouped for batch review to maximize decision throughput.

---

## Grouping Hierarchy

Proposals are grouped in this priority order:

### 1. Primary: Object Type

Group by Taxonomy v1.3 object types:
- Matters — Activity
- Matters — Client
- Operations — Inquiries
- Operations — Fulfillment
- Firm Management — Vendors / Billing
- Promotions
- System Notification
- Noise

**Rationale:** Similar items require similar mental models to evaluate.

### 2. Secondary: Confidence Band

Within each type, sub-group by confidence:
- **High** (≥0.85): Likely straightforward approvals
- **Medium** (0.60-0.84): Require attention
- **Low** (<0.60): Require careful review

**Rationale:** High-confidence items can be approved quickly; low-confidence items need deliberation.

### 3. Tertiary: Sender Domain

Within confidence bands, optionally group by sender:
- Known CRM domains (soulpepper.com)
- Known vendor domains (lawpro.ca)
- Google/system domains
- Unknown/other

**Rationale:** Familiar senders have predictable patterns.

---

## Batch Size Guidelines

| Scenario | Recommended Batch Size |
|----------|------------------------|
| High confidence only | 20-30 proposals |
| Mixed confidence | 10-15 proposals |
| Low confidence / complex | 5-10 proposals |
| First-time sender patterns | 5 proposals max |

**Rationale:** Cognitive load increases with uncertainty; smaller batches for harder decisions.

---

## Grouping Algorithm

```
1. Fetch all pending proposals
2. Group by object_type
3. For each type group:
   a. Sub-group by confidence_band
   b. For each confidence sub-group:
      i. Optionally sub-group by sender_domain
4. Generate batch with groups in order:
   - High confidence first (quick wins)
   - Medium confidence second
   - Low confidence last (focused review)
```

---

## Example Batch Structure

```
BATCH-20260130-001

## Group 1: Operations — Inquiries (High Confidence)
- PROP-001: soulpepper.com inquiry (0.90)
- PROP-002: lawpro.ca inquiry (0.87)

## Group 2: Operations — Inquiries (Medium Confidence)
- PROP-003: unknown sender inquiry (0.72)
- PROP-004: another inquiry (0.68)

## Group 3: System Notification (High Confidence)
- PROP-005: Google alert (0.92)

## Group 4: Matters — Activity (Medium Confidence)
- PROP-006: case update (0.75)
```

---

## Anti-Patterns to Avoid

1. **Mixed types in one group** — Don't group inquiries with system notifications
2. **Too large batches** — Cognitive fatigue leads to mistakes
3. **Random ordering** — Structure reduces decision cost
4. **Hiding low confidence** — Surface uncertainty, don't bury it
