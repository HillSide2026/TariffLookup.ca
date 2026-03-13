---
id: 02_playbooks__corporate__agents__decision_registry_md
title: Decision Registry
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Decision Registry

Named decision points the Corporate Law Master Agent must recognize and label.

---

## Purpose

For each decision point, the agent must output:
- Choice made
- Confidence interval
- Evidence signals (facts used)
- Why it matters (1 line)
- Escalation trigger hit? (Y/N)

This enables auditability without killing expertise.

---

## Decision Points

### D01: Statute Selection

| Field | Value |
|-------|-------|
| **ID** | `D01_STATUTE_SELECTION` |
| **Question** | OBCA or CBCA? |
| **Options** | OBCA, CBCA, TBD |
| **Escalation Trigger** | Choice has strategic impact and client intent unclear |
| **Default** | OBCA (if Ontario operations, no cross-provincial needs) |

**Evidence signals:**
- Client's principal place of business
- Multi-provincial operations?
- Name protection needs
- Director residency constraints
- Future expansion plans

---

### D02: Governance Allocation

| Field | Value |
|-------|-------|
| **ID** | `D02_GOVERNANCE_ALLOCATION` |
| **Question** | Board-centric or shareholder-centric governance? |
| **Options** | BOARD_CENTRIC, SHAREHOLDER_CENTRIC |
| **Escalation Trigger** | Allocation materially affects control or liability |
| **Default** | BOARD_CENTRIC (standard corporate norm) |

**Evidence signals:**
- Number of shareholders
- Active vs passive shareholders
- Management participation by shareholders
- Desire to restrict directors
- USA indicators

---

### D03: Agreement Type

| Field | Value |
|-------|-------|
| **ID** | `D03_AGREEMENT_TYPE` |
| **Question** | SA or USA? |
| **Options** | SA, USA, N/A |
| **Escalation Trigger** | Classification is consequential and non-obvious |
| **Default** | SA (unless explicit intent to restrict directors) |

**Evidence signals:**
- Intent to restrict/transfer director powers
- Shareholder management expectations
- Liability awareness
- Unanimity available?
- Complexity of governance desired

---

### D04: Standard vs Bespoke

| Field | Value |
|-------|-------|
| **ID** | `D04_STANDARD_VS_BESPOKE` |
| **Question** | Does this fit standard Solution patterns or require bespoke treatment? |
| **Options** | STANDARD, BESPOKE |
| **Escalation Trigger** | Bespoke = mandatory escalation |
| **Default** | STANDARD (Solution scope assumed) |

**Evidence signals:**
- Share structure complexity
- Regulatory overlay
- Non-standard governance mechanics
- Tax-driven structuring
- Institutional investor involvement

---

### D05: Multi-Solution Collision

| Field | Value |
|-------|-------|
| **ID** | `D05_MULTI_SOLUTION_COLLISION` |
| **Question** | Do multiple Solutions apply? How should they be sequenced? |
| **Options** | SINGLE, SEQUENCE, PARALLEL, COLLISION |
| **Escalation Trigger** | COLLISION (competing requirements) |
| **Default** | SINGLE (unless facts clearly span Solutions) |

**Evidence signals:**
- Transaction involves formation + agreement
- Ownership change embedded in acquisition
- Advisory matter reveals conflict
- Timing dependencies between Solutions

---

### D06: Exit Mechanism Selection

| Field | Value |
|-------|-------|
| **ID** | `D06_EXIT_MECHANISM` |
| **Question** | What exit/liquidity mechanisms are appropriate? |
| **Options** | ROFR, TAG_DRAG, SHOTGUN, PUT_CALL, NONE, COMBINATION |
| **Escalation Trigger** | Mechanism choice materially affects minority rights |
| **Default** | ROFR + TAG_DRAG (standard private company) |

**Evidence signals:**
- Shareholder count and relationships
- Anticipated exit horizon
- Minority shareholder concerns
- Control concentration
- Financing implications

---

### D07: Transfer Restriction Scope

| Field | Value |
|-------|-------|
| **ID** | `D07_TRANSFER_RESTRICTIONS` |
| **Question** | What level of transfer restriction is appropriate? |
| **Options** | OPEN, CONSENT_REQUIRED, ROFR, LOCK_UP, PROHIBITED |
| **Escalation Trigger** | Lock-up or prohibition may have securities implications |
| **Default** | CONSENT_REQUIRED + ROFR (standard private company) |

**Evidence signals:**
- Private company status
- Shareholder sophistication
- Family business considerations
- Financing requirements
- Control preservation needs

---

## Output Format

When a decision point is triggered, output:

```
DECISION: D01_STATUTE_SELECTION
CHOICE: OBCA
CONFIDENCE: HIGH
EVIDENCE: Ontario-based operations, no cross-provincial needs stated, single-province client
WHY IT MATTERS: Affects filing jurisdiction, director residency rules, and ongoing compliance
ESCALATION TRIGGERED: N
```

---

## Adding New Decision Points

New decision points may be added when:
1. A recurring choice is identified across multiple matters
2. The choice has material downstream effects
3. Auditability would benefit from explicit labeling

New points require ML1 approval before addition to registry.
