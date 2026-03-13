---
id: DOCTRINE-MATTERS-0002
title: Matter Solutions Doctrine
owner: ML1
status: draft
version: 1.0
created_date: 2026-02-24
last_updated: 2026-02-24
tags: [doctrine, matters]

effective_date:
supersedes:

provenance:
  decided_by: ML1
  decided_on:
  context:
---

# Matter Solutions Doctrine

**Document ID:** DOCTRINE-MATTERS-0002  
**Status:** DRAFT  
**Effective:** TBD  
**Authority:** ML1

---

## Purpose
A Solution is a discrete monetizable work unit inside a Matter.

- A matter may contain multiple solutions.
- Solutions may overlap in time.
- Solutions may differ in billing structure.

Solutions are the unit of:
- Pricing
- Production
- Delivery
- Billing
- Collection
- Expansion

Matter = economic container. Solution = monetizable unit.

## Canonical Solution Lifecycle

### 1. Identified
Opportunity recognized. Not yet scoped or priced.

### 2. Scoped
Scope defined. Fee model defined.

### 3. Approved
Client has authorized work. Revenue probability = 1.0.

### 4. In Production
Substantive work underway.

### 5. Client Review
Delivered for client feedback.

### 6. Awaiting External Actor
Waiting on regulator, counterparty, or other external actor.

### 7. Delivered
Work complete.

### 8. Billed
Invoice issued.

### 9. Collected
Payment received. Terminal state.

## Matter-Solution Interaction Rules
- A matter may not be Closed while any solution stage < collected.
- Matter est_remaining_revenue = sum(solution_remaining_revenue).
- Matter state may be influenced by dominant solution condition, but matter state is not identical to solution stage.
- At-Risk can be triggered by:
  - Unpaid billed solutions
  - Stalled approved solutions
  - Identified but repeatedly unapproved high-value solutions

## Separation of State Systems
Matter state answers: Is this engagement stable, monetizing, blocked, or deteriorating?

Solution state answers: Where is each monetizable unit in its lifecycle?

These must not be collapsed into one stage system.
