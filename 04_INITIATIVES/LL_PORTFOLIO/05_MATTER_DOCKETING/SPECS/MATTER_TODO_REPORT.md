---
id: 04_initiatives__ll_portfolio__05_matter_docketing__specs__matter_todo_report_md
title: Matter To-Do Report Specification
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Matter To-Do Report Specification

**Status:** NORMATIVE
**Version:** 3.0
**Effective:** 2026-02-07

---

## 1. Purpose and Authority

This specification defines the structure, generation rules, and constraints for a Matter To-Do Report.

**Authority Level:** DERIVED / ADVISORY

- The report is non-authoritative and does not constitute a docket entry.
- Tasks extracted are candidates for review, not confirmed obligations.
- Matter assignments are suggestions pending human verification.

**Supplementary Documents:**
- `MATTER_TODO_OUTPUT_SCHEMA.md` — Authoritative schema for report structure and fields
- `MATTER_TODO_CONFIDENCE_MODEL.md` — Authoritative model for task confidence scoring
- `MATTER_TODO_LEDGER.md` — Task ledger specification for carry-forward behavior

---

## 2. Input Specification

### 2.1 Source

The report MUST be generated exclusively from inbound email messages retrieved via authenticated API access.

### 2.2 Time Window

- The report MUST specify an input time window in days.
- The window MUST be stated in report metadata.
- Default window SHOULD be 14 days unless otherwise specified.

### 2.3 Scope

- Only emails received within the time window SHALL be processed.
- Sent emails MAY be used for thread context but MUST NOT generate tasks.

---

## 3. Daily Run Behavior (Two-Phase)

Each daily run MUST perform both phases. Phase 1 is unchanged from v1.0. Phase 2 is new.

### Phase 1 — Extract Candidates

1. Extract task candidates from today's inbound emails using the existing pipeline (Sections 4–9 below).
2. Apply all classification, refusal, evidence, and attribution rules unchanged.
3. Only emails classified as `ACTION_REQUIRED` may produce candidates.

### Phase 2 — Reconcile Against Ledger

After extraction, reconcile candidates against the persistent task ledger.

For each extracted candidate:
- **If it matches an existing ledger task:** Reuse the existing `task_id`, update `last_seen`, append new evidence if materially different.
- **If it does not match:** Create a new ledger entry with status `NEW`, set `first_seen` and `last_seen` to today.

For ledger tasks not observed today:
- DO NOT delete them.
- Retain them in the ledger.
- If `last_seen` exceeds the staleness threshold and status is `NEW`, mark as `STALE`.

Full reconciliation rules are defined in `MATTER_TODO_LEDGER.md`.

---

## 4. Classification Pipeline

All emails MUST pass through a classification pipeline before task extraction.

### 4.1 Classification Categories

The pipeline MUST use exactly four categories:

| Category | Code | Description |
|----------|------|-------------|
| Action Required | `ACTION_REQUIRED` | Email contains a request or obligation directed at the lawyer |
| Waiting on Other | `WAITING_ON_OTHER` | Email indicates the sender or third party will take action |
| Info Only | `INFO_ONLY` | Email is informational with no action expected |
| No Action | `NO_ACTION` | Email is automated, marketing, or noise |

### 4.2 Classification Rules

1. Classification MUST occur before task extraction.
2. Each email MUST receive exactly one classification.
3. Classification MUST be deterministic given the same input.

### 4.3 Classification Precedence

When multiple signals are present, apply in order:

1. `NO_ACTION` patterns (automated notifications, unsubscribe links) — highest priority
2. `ACTION_REQUIRED` patterns (direct requests, deadlines, asks)
3. `WAITING_ON_OTHER` patterns (sender commits to future action)
4. `INFO_ONLY` — default when no other pattern matches

---

## 5. Task Generation

### 5.1 Source Constraint

Tasks MUST be generated ONLY from emails classified as `ACTION_REQUIRED`.

Emails classified as `WAITING_ON_OTHER`, `INFO_ONLY`, or `NO_ACTION` MUST NOT produce tasks.

### 5.2 Task Format

Each task MUST be normalized to a verb-first imperative form.

**Acceptable:** "Review attached agreement for indemnity clause"
**Unacceptable:** "The agreement is attached for your review"

### 5.3 Refusal Rules

The system MUST NOT generate tasks from:

- Emails containing "no action needed" or "no further action required"
- Automated system notifications (WordPress, Clio, calendar invites)
- Marketing or newsletter content
- Courtesy messages (thank you, acknowledgments) without an embedded ask
- "See attached" without an explicit request

The system MUST NOT:

- Invent deadlines not present in source text
- Assign owners unless explicitly stated in the email
- Truncate evidence in a way that alters meaning
- Include HTML artifacts or encoding errors in task text

---

## 6. Matter Attribution

### 6.1 Attribution Precedence

Matter assignment MUST follow this strict precedence:

| Priority | Method | Description |
|----------|--------|-------------|
| 1 | Explicit Clio ID | Matter ID pattern (XX-XXX-XXXXX) in subject line |
| 2 | Strong Heuristic | Participant domain/name match with >90% confidence |
| 3 | UNASSIGNED | No reliable match; requires manual triage |

### 6.2 UNASSIGNED Handling

When a task is marked `UNASSIGNED`:

- The system SHOULD provide a suggested match if partial signals exist.
- The system MUST include an explanation of why attribution failed.
- The task MUST appear in the Unassigned Triage List section.

### 6.3 Attribution Constraints

- The system MUST NOT guess matter assignments based on weak signals.
- Thread-based attribution MAY be used if the thread was previously mapped.
- Attribution confidence MUST be recorded per task.

---

## 7. Evidence Standard

### 7.1 Requirements

All tasks MUST include audit-safe evidence meeting these criteria:

- **Verbatim:** Quoted text MUST be exact, not paraphrased.
- **Complete:** Quotes MUST NOT be truncated in a way that removes context.
- **Clean:** Evidence MUST NOT contain HTML tags, encoding artifacts, or markup.
- **Traceable:** Each evidence item MUST include date, sender, and subject.

### 7.2 Evidence Fields

Per `MATTER_TODO_OUTPUT_SCHEMA.md`, each evidence item MUST include:

- `email_date` — Date in YYYY-MM-DD format
- `from` — Sender address or name
- `subject` — Email subject line
- `quote` — Verbatim sentence(s) supporting the task
- `message_ref` — Unique identifier if available; null otherwise

---

## 8. Workstream + Lane Routing

Each task MUST be classified into a workstream and lane to support operational triage. Routing is suggested metadata only — it is not an owner assignment.

### 8.1 Routing Fields

Every task MUST include:

| Field | Values | Description |
|-------|--------|-------------|
| `suggested_workstream` | DELIVERY, FULFILLMENT, MARKETING, MANAGEMENT, UNROUTED | Operational system the task belongs to |
| `suggested_lane` | LAWYER, NON_LAWYER, ADMIN_ACCOUNTS, INTAKE, UNROUTED | Role lane within the workstream |
| `routing_confidence` | HIGH, MEDIUM, LOW | Confidence in the routing classification |
| `routing_reason` | string | Short explanation anchored to evidence (quote-backed when possible) |
| `next_action_type` | RESPOND, REVIEW, DRAFT, FILE_SUBMIT, SCHEDULE, PAY_INVOICE, SEND_REQUEST, UPDATE_LOG, OTHER | Deterministic classification of the required action |

### 8.2 Non-Assignment Rule

Routing MUST be represented as suggested fields only. The system MUST NOT:

- Claim a person is responsible unless explicitly stated in the email
- Convert routing into an owner assignment
- Infer internal staffing roles from weak signals

### 8.3 Deterministic Routing Precedence

Routing MUST be deterministic given the same input. Apply rules in the following strict order:

**Tier 1 — Explicit Addressee / Role Mentions (Highest Priority)**

If the email explicitly directs action to a role/person/group, set lane/workstream accordingly with HIGH confidence.

| Signal | Lane | Workstream |
|--------|------|------------|
| "Matt / Matthew / counsel / attorney" | LAWYER | DELIVERY |
| "paralegal / assistant / team" | NON_LAWYER | DELIVERY |
| "billing / invoice / payment / trust / retainer" | ADMIN_ACCOUNTS | FULFILLMENT |
| "intake / onboarding / conflict check / engagement letter / consult scheduling" | INTAKE | MARKETING (or MANAGEMENT if internal ops) |
| "internal firm ops / systems / staffing / policy" | (best-fit) | MANAGEMENT |

`routing_reason` MUST cite the explicit phrase(s).

**Tier 2 — Task-Verb + Object Heuristics (Medium Priority)**

If no explicit addressee exists, infer routing from task type with MEDIUM confidence:

| Task Pattern | Lane | Workstream |
|--------------|------|------------|
| Contract / legal review / negotiation / legal advice / filings | LAWYER | DELIVERY |
| Drafting routine documents / collecting signatures / assembling exhibits | NON_LAWYER | DELIVERY |
| Paying, invoicing, retainer, trust, receipts, statements | ADMIN_ACCOUNTS | FULFILLMENT |
| New client intake steps, consult booking, onboarding docs | INTAKE | MARKETING |
| Internal coordination, staffing, process, tooling | UNROUTED (or best-fit lane if explicit) | MANAGEMENT |

`routing_reason` MUST reference the task text and any supporting quote.

**Tier 3 — Weak or Ambiguous Signals (Lowest Priority)**

If signals are weak or ambiguous:

- Set `suggested_workstream` = UNROUTED
- Set `suggested_lane` = UNROUTED
- Set `routing_confidence` = LOW
- Provide `routing_reason` describing ambiguity and what signal(s) were insufficient

The system MUST prefer UNROUTED over guessing.

---

## 9. Next Action Type Classification

For each task, `next_action_type` MUST be set deterministically using these rules:

| Signal | next_action_type |
|--------|-----------------|
| Request to reply / confirm / send answer | RESPOND |
| "review" / "take a look" / "analyze" | REVIEW |
| "draft" / "prepare" / "revise document" | DRAFT |
| "file" / "submit" / "serve" / "register" | FILE_SUBMIT |
| Meeting / call / book / reschedule | SCHEDULE |
| Invoice / retainer / pay / trust transfer | PAY_INVOICE |
| "send" / "request" / "ask for" / "obtain" | SEND_REQUEST |
| "update" / "log" / "record" / "note in file" | UPDATE_LOG |
| Otherwise | OTHER |

The system MUST NOT invent workflow steps beyond what the email supports.

---

## 10. Carry-Forward Rule

The daily report MUST include:

- All newly extracted tasks (status: `NEW`)
- All unresolved ledger tasks regardless of email window:
  - `NEW`
  - `TRIAGED`
  - `WAITING`
  - `STALE`

Tasks with status `DONE` or `DROPPED` MUST NOT appear in the report.

Tasks MUST NOT disappear from the report solely because they fall outside the email input window.

Full ledger rules are defined in `MATTER_TODO_LEDGER.md`.

---

## 11. Report Structure

The report MUST follow this fixed structure:

### 11.1 Section Order

1. **YAML Frontmatter** — Minimal metadata block
2. **Executive Summary** — High-level statistics (MUST fit one screen)
3. **Routing Summary** — Counts by lane, workstream, unrouted, and low-confidence
4. **Action Queue** — Tasks organized by routing lane/workstream, grouped by matter within each section
5. **Waiting / Follow-Up Queue** — Items classified as `WAITING_ON_OTHER`
6. **Unassigned Triage List** — Tasks requiring manual matter mapping
7. **Exclusions Summary** — Breakdown of `NO_ACTION` items by category

### 11.2 Section Requirements

**YAML Frontmatter:**
- MUST include: `generated_on`, `input_window_days`, `emails_scanned`, `tasks_generated`
- SHOULD include: `version`, `classification_counts`, `ledger_carry_forward_count`

**Executive Summary:**
- MUST display classification counts
- MUST display task counts (total, with deadlines, unassigned)
- MUST display carry-forward count (tasks from ledger not observed in today's extraction)
- MUST NOT exceed 20 lines

**Routing Summary:**
- MUST display counts by `suggested_lane`
- MUST display counts by `suggested_workstream`
- MUST display total UNROUTED count
- MUST display total `routing_confidence` = LOW count

**Action Queue:**
- MUST organize tasks in the following section order:
  1. Delivery — Lawyer
  2. Delivery — Non-lawyer
  3. Fulfillment — Admin/Accounts
  4. Marketing — Intake/Onboarding
  5. Management
  6. Unrouted / Needs Triage
- Within each section, MUST group tasks by matter
- Each task MUST display: task text, deadline (if any), evidence reference
- Each task MUST display a badge: `NEW`, `CARRY-FORWARD`, or `STALE`
- Each task MUST display `last_seen` date
- Each task MUST display `routing_confidence`

**Waiting / Follow-Up Queue:**
- MUST include items classified as `WAITING_ON_OTHER`
- MUST group by matter where possible

**Unassigned Triage List:**
- MUST include all `UNASSIGNED` tasks
- MUST display suggested match if available
- MUST include sender and subject for manual review

**Exclusions Summary:**
- MUST display count by exclusion category
- MAY include sample subjects for verification

### 11.3 Badge Definitions

| Badge | Condition |
|-------|-----------|
| `NEW` | Task was first observed in this run |
| `CARRY-FORWARD` | Task was observed in a prior run and carried forward from the ledger |
| `STALE` | Task has not been re-observed past the staleness threshold |

---

## 12. Validation

A compliant report MUST pass these checks:

1. All tasks derive from `ACTION_REQUIRED` emails or the carry-forward ledger.
2. No task contains an invented deadline.
3. All evidence quotes are verbatim and free of artifacts.
4. All required metadata fields are present.
5. Section order matches specification.
6. Classification counts sum to total emails scanned (extraction phase only; carry-forward tasks are additive).
7. Every task in the Action Queue displays a badge and `last_seen` date.
8. No task with ledger status `DONE` or `DROPPED` appears in the report.
9. Routing fields (`suggested_workstream`, `suggested_lane`, `routing_confidence`, `routing_reason`, `next_action_type`) exist for every task in both ledger and report.
10. `suggested_lane` and `suggested_workstream` values are from the allowed enums.
11. UNROUTED is used when signals are insufficient; routing MUST NOT guess.
12. Routing does not create an owner assignment unless the owner is explicitly stated in the email.
13. Routing is deterministic on identical inputs.

---

## 13. References

- `MATTER_TODO_OUTPUT_SCHEMA.md` — Defines field types, required vs. optional, JSON Schema
- `MATTER_TODO_CONFIDENCE_MODEL.md` — Defines HIGH/MEDIUM/LOW scoring and downgrade rules
- `MATTER_TODO_LEDGER.md` — Defines task ledger, stable IDs, status model, and reconciliation rules
