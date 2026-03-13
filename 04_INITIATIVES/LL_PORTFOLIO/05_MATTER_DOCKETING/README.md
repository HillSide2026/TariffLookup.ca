---
id: 04_initiatives__ll_portfolio__05_matter_docketing__readme_md
title: Matter Docketing Portfolio
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Matter Docketing Portfolio

**Location:** `04_INITIATIVES/LL_PORTFOLIO/05_MATTER_DOCKETING/`

**Status:** Draft — Requires ML1 Approval

---

## 1. Purpose

The Matter Docketing portfolio defines the **delivery and docketing overlay** for matters that exist in the system of record (Clio).

It provides a real-time, delivery-focused view of:

* Which matters are consuming delivery capacity
* What delivery work is currently happening
* What actions lawyers should take next

This portfolio does **not** represent the client relationship, financial lifecycle, or administrative handling of a matter.

---

## 2. Authority & System Boundaries

* **System of Record:** Clio
* **ML1:** Sole authority for judgment, prioritization, and acceptance of matters
* **ML2:** Observes, tags, suggests, and records delivery signals

The Matter Docketing portfolio:

* Does not replace Clio fields
* Does not create authoritative status
* Does not make or enforce decisions

---

## 3. Scope (Inclusions)

This portfolio includes **delivery-only artifacts** tied to an existing matter:

* Matter Operations Queue States (delivery posture)
* Activity Periods (what is happening now in delivery)
* Lawyer To-Do Lists (delivery actions)
* Delivery-relevant dependencies and blockers
* Read-only matter metadata required for delivery context

All artifacts must reference a valid `matter_id`.

---

## 4. Explicit Exclusions (Hard)

The following are explicitly **out of scope** and must not appear in this portfolio:

* Billing, invoicing, or payments
* Time tracking or productivity metrics
* Accounting or trust activity
* Client intake, leads, or sales processes
* Marketing or relationship management
* Strategic planning or pricing decisions

Admin and accounting workflows exist as **parallel systems** and may create dependencies, but are not modeled here.

---

## 5. Core Components

### 5.1 Matter Operations Queue

A non-linear, delivery-focused state model that indicates whether a matter is:

* Initiating
* Backlog
* Docketing Active
* Paused
* Closing

States are **real-time operational tags** and do not replace any system-of-record statuses.

---

### 5.2 Activity Periods

Repeatable, descriptive periods that capture what is happening in delivery at a given time.

Activity Periods:

* Exist only within Initiating, Backlog, or Docketing Active states
* May repeat or recur
* Carry no evaluative or performance meaning

---

### 5.3 Lawyer To-Do Lists

A delivery-scoped list of actionable items for lawyers working on a matter.

To-dos:

* Are derived from the current delivery context
* Do not advance states automatically
* Do not represent billing or time obligations

---

### 5.4 Delivery Dependencies

Explicit delivery blockers or prerequisites, such as:

* Awaiting inputs
* External dependencies
* Internal sequencing constraints

Dependencies are **facts**, not tasks.

---

## 6. Interaction With Other Portfolios

* **Practice Areas:** Provide reusable execution knowledge; do not own matter state
* **Firm Operations:** Define operations queue mechanics; do not track individual matters
* **Financial Portfolio:** May analyze delivery patterns; may not control them
* **Risk & Compliance:** May impose checks; may not advance delivery

---

## 7. Operating Principles

* Delivery reality over linear progress
* Capacity awareness without enforcement
* Signals, not judgments
* Observability without control

If scope or authority is unclear:

> Stop. Label. Escalate to ML1.

---

## ML1 Authority Statement

ML1 is the sole authority for:
- Judgment, prioritization, and acceptance of matters
- Approving State transitions
- Defining new States or Activity Periods
- Authorizing any automated operations queue changes

## Explicit Prohibitions

ML2 must NOT:
- Replace or modify Clio source-of-truth fields
- Create authoritative status
- Make or enforce decisions
- Track billing, accounting, or admin work
- Model intake, leads, sales, or marketing

## Approval State

**Draft** — Requires ML1 Approval

## Last ML1 Review Date

*Pending initial review*
