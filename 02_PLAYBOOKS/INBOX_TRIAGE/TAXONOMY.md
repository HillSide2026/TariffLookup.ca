---
id: 02_playbooks__inbox_triage__taxonomy_md
title: Inbox Triage Taxonomy
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Inbox Triage Taxonomy

**Status:** Active (ML1 approved)
**Version:** 1.3
**Stage:** 2.3 / 2.4 — Inbox Intelligence Layer
**Purpose:** Define a deterministic classification vocabulary for Gmail messages.
No execution, movement, or external writes are permitted.

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-28 | Initial taxonomy |
| 1.1 | 2026-01-29 | Added Operations - Inquiries, Operations - Fulfillment; Added Operations domain |
| 1.2 | 2026-01-29 | Renamed "Marketing" → "Promotions" per ML1 preference |
| 1.3 | 2026-01-29 | Reorganized into hierarchical structure with parent domains |

---

## 1. Object Type (What is this?)

Each message MUST be classified into exactly one Object Type.

### Matters

#### 1.1 Matters — Activity
Criteria (one or more):
- Mentions a client matter, case, dispute, transaction, or legal issue
- Sender is client, opposing counsel, court, regulator
- Contains legal documents, deadlines, filings, or strategy
- Active legal work product

#### 1.2 Matters — Client
Criteria:
- Sender is an **existing client** (has active or past matter)
- Message relates to relationship management, updates, scheduling
- No immediate legal work product attached

---

### Operations

#### 1.3 Operations — Fulfillment
Criteria:
- Client-facing **administrative and accounts work**
- Includes: trust accounting, retainer management, billing inquiries from clients
- Includes: admin tasks for client matters (scheduling, document requests)
- Distinct from Vendors/Billing (which is firm's own vendor payments)

#### 1.4 Operations — Inquiries
Criteria:
- Communication from **non-clients who may become clients**
- Initial consultations, intake requests, general questions
- No existing matter relationship
- Includes: missed calls from unknown numbers, website inquiries, referrals

---

### Firm Management

#### 1.5 Firm Management — Vendors / Billing
Criteria:
- **Firm's own** invoices, receipts, SaaS vendors, payment confirmations
- Accounting, billing, payroll, subscriptions (firm-facing, not client-facing)

---

### Other

#### 1.6 Promotions
Criteria:
- Newsletters, promotions, sales outreach
- Events, webinars, thought leadership not tied to an active matter
- Aligns with Gmail's `CATEGORY_PROMOTIONS` label

#### 1.7 System Notification
Criteria:
- Automated alerts (GitHub, Google, Slack, monitoring)
- No human sender expectation
- **Note:** If content references specific client/matter, elevate to appropriate category

#### 1.8 Noise
Criteria:
- Spam-like, irrelevant, personal clutter
- No plausible business, legal, or operational value

---

## 2. Lifecycle State (What attention does it require?)

Each message MUST be assigned one lifecycle state.

### 2.1 Action Required
- Explicit request
- Deadline, task, decision, or response required

### 2.2 Waiting
- No action required until an external event occurs
- Follow-ups, acknowledgments, FYIs pending others

### 2.3 Reference
- Informational, should be retained
- No immediate or future action implied

### 2.4 Archive Candidate
- No ongoing relevance
- Retention optional or short-term only

---

## 3. System Domain (Where does it belong conceptually?)

Each message MUST be mapped to one system domain.

- **Matters** — legal work, cases, transactions (for existing clients)
- **Operations** — inquiries, fulfillment, firm administration
- **Firm Management** — vendors, billing, firm-level administration
- **System Operations** — infrastructure, tools, alerts
- **Personal Noise** — promotions, noise, non-system material

---

## 4. Object Type → System Domain Mapping

| Object Type | Default System Domain |
|-------------|----------------------|
| Matters — Activity | Matters |
| Matters — Client | Matters |
| Operations — Fulfillment | Operations |
| Operations — Inquiries | Operations |
| Firm Management — Vendors / Billing | Firm Management |
| Promotions | Personal Noise |
| System Notification | System Operations |
| Noise | Personal Noise |

---

## 5. Confidence Policy

### 5.1 Confidence Score
- Float between `0.00 – 1.00`
- Represents classifier confidence, not correctness

### 5.2 Thresholds
- **≥ 0.85** → High confidence
- **0.60 – 0.84** → Medium confidence
- **< 0.60** → Low confidence

### 5.3 Unknown / Needs Human
A message MUST be classified as `Unknown / Needs Human` if:
- Confidence < 0.60, OR
- Object Type and System Domain disagree materially, OR
- Evidence is insufficient or conflicting

---

## 6. Hard Constraints
- Exactly one Object Type
- Exactly one Lifecycle State
- Exactly one System Domain
- No message may be unclassified
- Classification does not imply permission to act

---

## 7. Destination Mapping

| System Domain | Proposed Destination |
|---------------|---------------------|
| Matters | `05_MATTERS` |
| Operations | `04_OPERATIONS` |
| Firm Management | `07_FIRM_MANAGEMENT` |
| System Operations | `00_SYSTEM` |
| Personal Noise | `09_ARCHIVE` |

---

## 8. Quick Reference

| Parent | Object Type | Domain |
|--------|-------------|--------|
| **Matters** | Activity | Matters |
| **Matters** | Client | Matters |
| **Operations** | Fulfillment | Operations |
| **Operations** | Inquiries | Operations |
| **Firm Management** | Vendors / Billing | Firm Management |
| — | Promotions | Personal Noise |
| — | System Notification | System Operations |
| — | Noise | Personal Noise |
