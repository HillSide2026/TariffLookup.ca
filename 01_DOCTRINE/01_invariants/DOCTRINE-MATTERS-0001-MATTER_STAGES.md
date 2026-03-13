---
id: DOCTRINE-MATTERS-0001
title: Matter Stages Doctrine
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

# Matter Stages Doctrine

**Document ID:** DOCTRINE-MATTERS-0001  
**Status:** DRAFT  
**Effective:** TBD  
**Authority:** ML1

---

## Purpose
Matter stage represents the economic and control state of the client engagement, not the work being performed.

It answers:
- Is revenue secured?
- Is the matter progressing?
- Is it constrained?
- Is it monetizing?
- Is it decaying?
- Is it closing?

Matter stage must be:
- Mutually exclusive (exactly one per matter)
- Determinable by objective triggers
- Auditable
- Stable across practice types

Solution activity does not define matter stage. Economic and control state defines matter stage.

## Canonical Matter States

### 1. Prospective
Engagement not executed. No secured revenue.

Entry:
- Matter opened pre-engagement.

Exit:
- Engagement letter executed -> Engaged - Active
- Declined -> Closed

### 2. Engaged - Active
Engagement executed. Work progressing. No material decision or external constraint.

Entry:
- Engagement signed.
- No defined stall condition.

Exit:
- Decision required -> Engaged - Decision Constrained
- External dependency blocking -> Engaged - Externally Blocked
- Substantive work complete -> Revenue Realization
- Inactivity threshold exceeded -> Dormant
- Instability detected -> At-Risk

### 3. Engaged - Decision Constrained
Material progress requires a defined internal or client decision.

Requirements:
- next_decision_required must be non-null.

Exit:
- Decision made -> Engaged - Active or Revenue Realization

### 4. Engaged - Externally Blocked
Material progress requires action from client, counterparty, regulator, or third party.

Requirements:
- blocking_actor must be defined.

Exit:
- External input received -> Engaged - Active

### 5. Revenue Realization
Substantive work complete. Primary activity is billing, collection, or closing mechanics.

Entry:
- Core solutions delivered.

Exit:
- Payment received -> Pending Close or Closed
- Payment delay beyond threshold -> At-Risk

### 6. Ongoing Advisory
Standing engagement with recurring or episodic revenue. No defined end state. This is not an active project; it is a persistent advisory container.

Exit:
- Terminated -> Pending Close
- Revenue instability -> At-Risk

### 7. At-Risk
Economic or relational instability.

Triggers may include:
- A/R beyond threshold
- Client disengagement
- Scope conflict
- Concentration risk spike
- Revenue dependency instability

Exit:
- Risk resolved -> prior appropriate state
- Engagement terminated -> Pending Close

### 8. Dormant
Engaged but no material movement beyond defined inactivity threshold. No active blocker recorded.

Dormant is decay. It must be time-triggered.

Exit:
- Activity resumes -> Engaged - Active
- Termination -> Pending Close

### 9. Pending Close
Work complete. Administrative close-out pending.

Exit:
- Closed

### 10. Closed
No further economic activity expected. Immutable state.
