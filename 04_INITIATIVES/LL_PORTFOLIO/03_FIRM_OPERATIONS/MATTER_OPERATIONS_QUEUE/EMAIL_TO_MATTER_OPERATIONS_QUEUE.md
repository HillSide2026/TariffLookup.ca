---
id: 04_initiatives__ll_portfolio__03_firm_operations__matter_operations_queue__email_to_matter_operations_queue_md
title: Email-to-Matter Operations Queue Workflow
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Email-to-Matter Operations Queue Workflow

**Location:** `LL_PORTFOLIO/03_FIRM_OPERATIONS/MATTER_OPERATIONS_QUEUE/`

**Status:** Draft — Requires ML1 Approval

---

## 1. Purpose

The Email-to-Matter Operations Queue defines how **inbound email signals** are mapped to **Matter Activity Periods** within the Matter Operations Queue.

It enables ML2 agents to:

* Suggest Activity Period transitions based on email content
* Flag emails that indicate delivery state changes
* Exclude administrative and accounting noise from delivery processing

---

## 2. Hard Scope Boundary

This workflow applies **only to delivery-relevant email signals**.

### In Scope

* Emails from clients regarding substantive legal work
* Emails from counterparties (opposing counsel, negotiating parties)
* Emails from courts, regulators, or filing authorities
* Internal emails indicating delivery progress or blockers

### Out of Scope

* Administrative emails (scheduling, logistics)
* Accounting and billing emails
* Marketing or promotional emails
* System notifications without delivery relevance

---

## 3. Claude Code Operational Instructions

When processing emails for matter-to-activity-period mapping, ML2 agents:

### MUST

* Identify the associated matter (if any)
* Classify the email against the Event Taxonomy
* Check the Admin/Accounting Exclusion List before processing
* Suggest Activity Period changes (never auto-apply without authorization)
* Preserve uncertainty — flag ambiguous cases for ML1 review

### MUST NOT

* Automatically transition matter states
* Infer matter relationships without explicit identifiers
* Override system of record (Clio) status fields
* Process excluded email categories as delivery signals
* Make judgment calls on matter prioritization

---

## 4. Event Taxonomy

Email events map to suggested Activity Periods based on content signals:

### Client Communications → Delivery Work Periods

| Email Signal | Suggested Activity Period |
|-------------|--------------------------|
| Client provides requested information | Resume: Drafting |
| Client requests status update | No change (informational) |
| Client provides feedback on draft | Review |
| Client approves deliverable | Implementation |
| Client raises new issue within scope | Analysis |

### Counterparty Communications → Delivery Work Periods

| Email Signal | Suggested Activity Period |
|-------------|--------------------------|
| Counterparty sends draft | Review |
| Counterparty provides comments | Review / Negotiation |
| Counterparty requests negotiation | Negotiation |
| Counterparty agrees to terms | Implementation |

### Regulatory/Court Communications → Delivery Work Periods

| Email Signal | Suggested Activity Period |
|-------------|--------------------------|
| Filing confirmation received | Implementation |
| Court sets hearing date | Waiting on Regulator / Court |
| Regulatory inquiry received | Analysis |
| Approval/rejection received | Implementation |

### Internal Communications → Internal Delivery Periods

| Email Signal | Suggested Activity Period |
|-------------|--------------------------|
| Draft ready for partner review | Partner Review |
| QC checklist requested | Quality Control |
| Internal feedback provided | Internal Review |

### Waiting Signals → Waiting / Dormancy Periods

| Email Signal | Suggested Activity Period |
|-------------|--------------------------|
| "Waiting for client to..." | Waiting on Client |
| "Pending counterparty response" | Waiting on Counterparty |
| "Awaiting court/regulatory..." | Waiting on Regulator / Court |
| "On hold due to external..." | External Hold |

---

## 5. Admin/Accounting Exclusion List

The following email categories are **explicitly excluded** from delivery operations queue processing:

### Administrative Exclusions

* Calendar invitations and meeting requests
* Office logistics and facility notifications
* IT system notifications
* HR communications
* General firm announcements

### Accounting Exclusions

* Invoice transmittals
* Payment confirmations
* Billing inquiries
* Trust account notifications
* Fee arrangement discussions
* Expense reports
* Accounts receivable communications

### Marketing/Business Development Exclusions

* Newsletters and alerts
* Event invitations (non-matter-specific)
* CLE announcements
* Promotional materials

> **Rule:** Emails matching these categories should be routed to appropriate administrative or accounting workflows, not processed as delivery signals.

---

## 6. Decision Rules: Suggest vs Auto-Apply

### Suggest (Default)

All Activity Period transitions are **suggested only** by default.

The ML2 agent:
1. Identifies the email signal
2. Maps to the Event Taxonomy
3. Generates a suggested Activity Period transition
4. Queues the suggestion for ML1 review

### Auto-Apply (Requires Explicit Authorization)

Auto-apply may be enabled **only with explicit ML1 authorization** for:

* Specific matter types
* Specific event categories
* Time-bounded automation windows

Auto-apply authorization must specify:
* Scope (which matters, which events)
* Duration (start/end dates)
* Rollback procedures

> **Rule:** When in doubt, suggest. Never auto-apply without explicit authorization.

---

## 7. Escalation Triggers

The following conditions require **immediate escalation to ML1**:

### Ambiguity Triggers

* Email references multiple matters without clear primary
* Event signal could map to multiple Activity Periods
* Sender identity is unclear or potentially spoofed
* Content appears to contradict current matter state

### Authority Triggers

* Email appears to request state transition (not just period change)
* Email indicates potential matter closure
* Email indicates client dissatisfaction or dispute
* Email contains privileged or highly sensitive content

### Pattern Triggers

* Matter has been in "Waiting" period for extended duration
* Multiple conflicting signals received in short window
* Email chain indicates escalating urgency

---

## 8. Relationship to Matter Operations Queue

This workflow **supplements** the Matter Operations Queue:

* Matter States (Initiating, Backlog, Docketing Active, Paused, Closing) remain ML1-controlled
* Activity Periods may be suggested by this workflow
* The system of record (Clio) remains authoritative for all status fields

---

## 9. What This Workflow Does NOT Do

This workflow does not:

* Create or close matters
* Change matter states
* Override system of record status
* Make client-facing communications
* Evaluate matter performance or efficiency
* Prioritize matters
* Make billing or accounting decisions

---

## ML1 Authority Statement

ML1 is the sole authority for:
- Approving suggested Activity Period transitions
- Authorizing auto-apply rules
- Defining new event taxonomy mappings
- Modifying exclusion lists
- Interpreting ambiguous email signals

## Explicit Prohibitions

ML2 must NOT:
- Auto-apply Activity Period transitions without authorization
- Process excluded email categories as delivery signals
- Infer matter associations without explicit identifiers
- Make state transition decisions
- Override system of record fields
- Execute based on ambiguous signals

## Approval State

**Draft** — Requires ML1 Approval

## Last ML1 Review Date

*Pending initial review*
