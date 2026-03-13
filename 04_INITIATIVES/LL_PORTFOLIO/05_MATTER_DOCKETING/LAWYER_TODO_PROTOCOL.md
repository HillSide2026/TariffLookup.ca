---
id: 04_initiatives__ll_portfolio__05_matter_docketing__lawyer_todo_protocol_md
title: Lawyer To-Do List Protocol
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Lawyer To-Do List Protocol

**Location:** `LL_PORTFOLIO/05_MATTER_DOCKETING/`

**Status:** Draft — Requires ML1 Approval

---

## 1. Purpose

This protocol defines how **lawyer to-do items** are created, updated, and consumed within a **matter's delivery workflow**.

The goal is to provide:

* A clear, lawyer-centric view of *what requires action*
* Tight alignment with the **Matter Operations Queue (delivery/docketing only)**
* Zero contamination from admin, billing, or accounting tasks

The to-do list is an **operational aid**, not a task manager of record and not a system of judgment.

---

## 2. Scope & Non-Scope

### In Scope

* Delivery-related lawyer actions tied to an existing matter
* Tasks that advance, unblock, or close **delivery Activity Periods**
* Tasks that require legal judgment, drafting, review, or coordination

### Explicitly Out of Scope

* Billing, invoicing, collections, trust accounting
* Internal admin or HR tasks
* Marketing, intake, or pre-engagement work
* Strategic planning or pricing decisions

Admin and accounts tasks live in **parallel workstreams** and must not appear on the lawyer to-do list.

---

## 3. Relationship to Other Systems (Critical)

### Matter Operations Queue

* To-do items are **derived from**:

  * Matter State
  * Current Activity Period(s)
* To-dos do **not** define or change State or Periods
* Completing a to-do may *suggest* a Period change but never applies it automatically

### Clio (System of Record)

* Clio Status / Fulfillment Status / Delivery Status remain authoritative
* To-dos are **overlay artifacts** only

### Email-to-Matter Operations Queue Workflow

* Emails may generate suggested to-dos
* No to-do is created without a valid matter_id

---

## 4. What a Lawyer To-Do Is (Definition)

A Lawyer To-Do is:

* A **discrete, actionable delivery task**
* Assigned to a specific lawyer (or role)
* Time-bounded or event-triggered
* Explicitly tied to one matter

A to-do must answer:

> "What does a lawyer need to do next on this matter?"

---

## 5. Required Fields for Every To-Do

Each to-do item MUST include:

| Field | Description |
|-------|-------------|
| **matter_id** | Required — links to exactly one matter |
| **task_title** | Clear action verb (e.g., "Review draft agreement") |
| **description / context** | Why this to-do exists |
| **linked_activity_period** | One of the approved delivery periods |
| **assigned_to** | Lawyer or role |
| **priority** | Low / Normal / High / Urgent |
| **due_trigger** | Date or event-based |
| **source** | manual / email / operations queue-derived |
| **created_at** | Timestamp |
| **status** | Open / In Progress / Blocked / Completed |

Optional but recommended:

* dependencies (other to-dos or external events)
* reference links (docs, emails, filings)

---

## 6. Creation Rules

To-dos may be created by:

* A lawyer (manual)
* ML2 (suggested, based on operations queue state or email events)

Creation constraints:

* Must be tied to an existing matter
* Must map to a valid **delivery Activity Period**
* Must not duplicate an existing open to-do

If ambiguity exists:

* Create as **Suggested To-Do** and flag for lawyer confirmation

---

## 7. Update & Completion Rules

### Allowed Updates

* Change status (Open → In Progress → Completed / Blocked)
* Update description or due trigger
* Reassign to another lawyer (with visibility)

### Completion Effects

* Completing a to-do does NOT automatically:

  * Change Matter State
  * Change Activity Period
  * Close the matter

Completion MAY:

* Trigger a **suggested** Activity Period change
* Trigger creation of follow-on to-dos

---

## 8. Prohibited Uses (Hard Rules)

The Lawyer To-Do List MUST NOT be used to:

* Track billing or time entries
* Enforce productivity metrics
* Replace legal judgment
* Act as a project plan or Gantt chart
* Auto-advance operations queue states

---

## 9. ML2 Automation Guardrails

ML2 may:

* Suggest to-dos based on operations queue state and email events
* De-duplicate similar tasks
* Surface overdue or blocked items

ML2 must NOT:

* Create to-dos without a matter_id
* Assign priorities beyond explicit signals
* Close or complete tasks autonomously
* Penalize inactivity or waiting

---

## 10. Enforcement & Escalation

If a proposed to-do:

* Is admin/accounting in nature
* Lacks a clear delivery Activity Period
* Attempts to substitute for judgment

Then:

* Reject creation
* Log the rejection
* Escalate to ML1 if unclear

---

## ML1 Authority Statement

ML1 is the sole authority for:
- Approving to-do creation rules and constraints
- Defining valid delivery Activity Periods for to-do linkage
- Authorizing any ML2 automation beyond suggestion
- Interpreting ambiguous to-do categorization

## Explicit Prohibitions

ML2 must NOT:
- Create to-dos without a valid matter_id
- Complete or close to-dos autonomously
- Use to-dos to track billing, admin, or accounting work
- Auto-advance operations queue states based on to-do completion
- Enforce productivity or efficiency metrics

## Approval State

**Draft** — Requires ML1 Approval

## Last ML1 Review Date

*Pending initial review*
