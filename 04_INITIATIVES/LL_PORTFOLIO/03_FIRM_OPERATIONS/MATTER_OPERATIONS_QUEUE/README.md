---
id: 04_initiatives__ll_portfolio__03_firm_operations__matter_operations_queue__readme_md
title: Matter Operations Queue
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Matter Operations Queue

**Location:** `LL_PORTFOLIO/03_FIRM_OPERATIONS/MATTER_OPERATIONS_QUEUE/`

**Status:** Draft — Requires ML1 Approval

---

## 1. Purpose

The Matter Operations Queue defines **delivery and docketing flow** for matters once a matter has been formally opened.

It models **legal delivery work only** — not administrative, accounting, or billing activity.

Administrative and accounts work exists as a **parallel workstream** that may create dependencies (e.g., billing readiness, account setup), but is **explicitly excluded from the delivery operations queue**.

The operations queue is therefore optimized to answer:

* Which matters are docketing-ready?
* Which matters are actively being delivered?
* How much delivery capacity is currently in use?

It is **not a linear workflow**. Legal delivery is episodic, cyclical, and frequently dormant. The operations queue therefore models matters as:

* **States** — stable, low-cardinality delivery conditions describing what a matter *is*
* **Activity Periods** — repeatable, high-cardinality descriptions of what is *happening (or not happening)* in delivery over time

---

## 2. Hard Scope Boundary

The Matter Operations Queue applies **only to matters**.

It explicitly excludes:

* Leads
* Prospects
* Pre-engagement evaluation
* Sales funnels or CRM stages

If a matter has not been formally opened, it is **out of scope** by definition.

### Relationship to System of Record

The Matter Operations Queue **does not replace or modify** existing matter status fields in the system of record.

Matters already carry authoritative tags such as:

| Field | Source | Authority |
|-------|--------|-----------|
| Status (e.g., Pending / Open / Closed) | Clio | Source of truth |
| Fulfillment Status | Clio | Source of truth |
| Delivery Status | Clio | Source of truth |

**These remain the source-of-truth fields.**

The Matter Operations Queue introduces **additional, real-time operational tags**:

| Field | Source | Purpose |
|-------|--------|---------|
| State | Matter Operations Queue | Delivery posture |
| Activity Period(s) | Matter Operations Queue | What is happening now |

The operations queue tags are **supplementary** — they do not override or conflict with system of record fields.

---

## 3. Matter States (Delivery-Focused)

Matter States describe the **delivery posture** of a matter — not its administrative or accounting status.

They are:

* Mutually exclusive
* Few in number
* Infrequently changed
* Oriented around docketing and legal work

> **Scope note:** This taxonomy applies **only to matters that are open in the system of record (Clio)**. Closed matters are out of scope and not modeled here.

### Minimal, Neutral State Set

1. **Initiating**

   * Matter has been opened in the system of record
   * Engagement approved
   * Delivery setup and docketing readiness activities may occur
   * No assumption of substantive legal work yet

2. **Backlog**

   * Matter is open and valid
   * Not currently selected for delivery
   * Awaiting prioritization, triggering event, or delivery capacity
   * Explicitly *not* a failure or delay signal

3. **Docketing Active**

   * Matter is actively occupying delivery capacity
   * Legal work is currently expected or underway
   * Activity periods may start, stop, and repeat

4. **Paused**

   * Matter is temporarily removed from delivery flow
   * Pause may be client-driven, external, regulatory, or strategic
   * Distinct from Backlog (which implies not yet selected or re-selected for delivery)

5. **Closing**

   * Substantive delivery work largely complete
   * Final delivery wrap-up in progress

> **Rule:** A matter must always be in exactly one delivery state while it remains open in the system of record.

---

## 4. Activity Periods (Delivery Only)

Activity Periods describe **what is happening in legal delivery** during a span of time.

They:

* May occur when a matter is in **Initiating**, **Backlog**, or **Docketing Active**
* Are repeatable
* Are descriptive, not evaluative

They explicitly **exclude**:

* Billing activity
* Accounting work
* Administrative processing

A matter may cycle through the same period type multiple times.

### Core Period Taxonomy (Extensible)

#### Delivery Work Periods

* Drafting
* Review
* Analysis
* Negotiation
* Filing / Submission
* Implementation

#### Waiting / Dormancy Periods

* Waiting on Client
* Waiting on Counterparty
* Waiting on Regulator / Court
* External Hold

#### Internal Delivery Periods

* Internal Review
* Partner Review
* Quality Control

> **Rule:** Waiting and inactivity are normal delivery conditions, not signals of inefficiency.

---

## 5. Relationship Between States and Periods

* Activity Periods may only exist **within Initiating, Backlog, or Docketing Active**
* Activity Periods do not advance or regress states
* Entering or exiting a state is a separate, explicit action

Example:

* State: Active

  * Period: Drafting
  * Period: Waiting on Client
  * Period: Drafting

The matter remains **Active** throughout.

---

## 6. What the Matter Operations Queue Does NOT Do

The operations queue does not:

* Evaluate performance
* Judge efficiency
* Predict outcomes
* Rank matters
* Imply sales velocity or success

It records **conditions**, not opinions.

---

## 7. Interaction With Other Portfolios

* **Matter Docketing (`05_MATTER_DOCKETING`)**

  * Overlay for tracking delivery states and activity periods
  * Houses lawyer to-do protocol

* **Risk & Compliance (`04_RISK_COMPLIANCE`)**

  * May require checks at certain states
  * Cannot change states

* **Financial Portfolio (`06_FINANCIAL_PORTFOLIO`)**

  * May analyze time-in-state or period patterns
  * May not define, modify, or advance states or periods

---

## 8. Capacity Intent (Non-Prescriptive)

The firm's operational intent is to maintain approximately **6–10 matters** in a **Docketing Active** state at any given time.

This is:

* A **target**
* A planning reference for delivery capacity
* Explicitly non-binding

ML2 may **observe and report** against this intent but must not:

* Enforce it
* Automatically move matters between states
* Treat deviations as errors or failures

---

## 9. Enforcement Rules

* The Matter Operations Queue governs **delivery only**
* Admin, accounting, and billing are parallel workstreams and must not be modeled as delivery states or periods
* No linear progression assumptions are permitted
* No lead, funnel, or sales concepts may be introduced
* States must remain minimal and stable
* Period taxonomy may expand but must remain delivery-descriptive

If uncertainty exists:
**STOP. FLAG. ESCALATE TO ML1.**

---

## ML1 Authority Statement

ML1 is the sole authority for:
- Approving state transitions
- Defining new states or periods
- Setting capacity targets
- Interpreting operations queue conditions

## Explicit Prohibitions

ML2 must NOT:
- Evaluate matter performance
- Judge delivery efficiency
- Predict outcomes
- Automatically advance states
- Enforce capacity targets
- Model leads, prospects, or sales funnels

## Approval State

**Draft** — Requires ML1 Approval

## Last ML1 Review Date

*Pending initial review*
