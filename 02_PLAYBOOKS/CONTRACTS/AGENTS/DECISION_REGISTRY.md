---
id: 02_playbooks__contracts__agents__decision_registry_md
title: Decision Registry — Contracts
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Decision Registry — Contracts

Named decision points the Contracts Master Agent must recognize and label.

---

## Decision Points

### D01: Client Position

| Field | Value |
|-------|-------|
| **ID** | `D01_CLIENT_POSITION` |
| **Question** | Which side is our client on? |
| **Options** | VENDOR, CUSTOMER, LICENSOR, LICENSEE, RELATED_ENTITY |
| **Escalation Trigger** | Position unclear or client on both sides |
| **Default** | None (must be established) |

**Evidence signals:**
- Who initiated the engagement
- Direction of goods/services flow
- Who drafted the initial terms
- Fee arrangement structure

---

### D02: Relationship Type

| Field | Value |
|-------|-------|
| **ID** | `D02_RELATIONSHIP_TYPE` |
| **Question** | One-off transaction or ongoing framework? |
| **Options** | ONE_OFF, FRAMEWORK_MSA, FRAMEWORK_SOW, PROTECTIVE |
| **Escalation Trigger** | Client describes ongoing relationship but wants one-off document |
| **Default** | ONE_OFF (unless facts indicate otherwise) |

**Evidence signals:**
- Duration of intended relationship
- Multiple deliverables or phases anticipated
- Ongoing service component
- Recurring payment structure

---

### D03: Governing Law

| Field | Value |
|-------|-------|
| **ID** | `D03_GOVERNING_LAW` |
| **Question** | What governing law applies? |
| **Options** | ONTARIO, OTHER_PROVINCE, FEDERAL, FOREIGN, TBD |
| **Escalation Trigger** | Foreign governing law requested; multi-jurisdictional parties |
| **Default** | ONTARIO (if both parties in Ontario) |

**Evidence signals:**
- Party locations
- Place of performance
- Counterparty's standard terms
- Industry norms

---

### D04: Standard vs Bespoke

| Field | Value |
|-------|-------|
| **ID** | `D04_STANDARD_VS_BESPOKE` |
| **Question** | Standard terms or bespoke negotiation? |
| **Options** | STANDARD, BESPOKE |
| **Escalation Trigger** | BESPOKE = mandatory QA gate |
| **Default** | STANDARD (Solution scope assumed) |

**Evidence signals:**
- Contract value
- Counterparty sophistication
- Regulatory overlay
- Non-standard risk allocation
- Client-specific requirements

---

### D05: Multi-Solution Collision

| Field | Value |
|-------|-------|
| **ID** | `D05_MULTI_SOLUTION_COLLISION` |
| **Question** | Do multiple Solutions apply? |
| **Options** | SINGLE, SEQUENCE, PARALLEL, COLLISION |
| **Escalation Trigger** | COLLISION (competing requirements) |
| **Default** | SINGLE |

**Evidence signals:**
- NDA required before substantive agreement
- MSA wrapping multiple SOWs
- Licensing embedded in service agreement
- Intercompany overlay on vendor/customer

---

### D06: Dispute Proximity

| Field | Value |
|-------|-------|
| **ID** | `D06_DISPUTE_PROXIMITY` |
| **Question** | Is this matter approaching the dispute boundary? |
| **Options** | NO_DISPUTE, PRE_DISPUTE, DEMAND_LETTER, POST_DEMAND |
| **Escalation Trigger** | POST_DEMAND = out of scope, mandatory escalation |
| **Default** | NO_DISPUTE |

**Evidence signals:**
- Breach allegations
- Non-performance complaints
- Termination notices issued
- Counterparty counsel involved
- Demand or threat language

---

## Output Format

```
DECISION: D01_CLIENT_POSITION
CHOICE: VENDOR
CONFIDENCE: HIGH
EVIDENCE: Client procuring IT services; RFP issued by client
WHY IT MATTERS: Determines which protective clauses to prioritize
ESCALATION TRIGGERED: N
```
