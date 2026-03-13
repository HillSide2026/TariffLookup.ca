---
id: 02_playbooks__contracts__decision_lenses__readme_md
title: Contract Decision Lenses
owner: ML1
status: draft
version: 1.0
supersedes:
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

## Playbook Header
Playbook ID: 02_playbooks__contracts__decision_lenses__readme_md
Version: 1.0
Status: draft

Principles Referenced: PRN-001, PRN-002, PRN-003, PRN-004, PRN-006, PRN-009
Policies Applied: POL-004, POL-006, POL-009, POL-011
Protocols Enforced: PRO-004, PRO-006, PRO-009, PRO-011
Doctrine Invoked: 00_SYSTEM/constitution.md, 01_DOCTRINE/index.yaml

Inputs: TBD
Outputs: TBD
Acceptance Criteria: TBD


# Contract Decision Lenses

Analytical frameworks for contract decisions.

---

## Purpose

Decision Lenses provide structured frameworks for analyzing recurring contract decisions. They identify factors and tradeoffs, not answers.

---

## Planned Decision Lenses

| ID | Name | Application |
|----|------|-------------|
| DL-RISK-01 | Risk Allocation | Balancing liability exposure between parties |
| DL-TERM-01 | Term vs Evergreen | Fixed term, auto-renewal, or evergreen |
| DL-EXIT-01 | Exit Flexibility | Termination for convenience vs cause-only |
| DL-STD-01 | Standard vs Bespoke | When to accept standard terms vs negotiate |
| DL-GOV-01 | Governing Law Selection | Jurisdiction selection factors |
| DL-DISP-01 | Dispute Resolution Mechanism | Litigation vs arbitration vs mediation |

---

## Decision Lens Format

```markdown
# [DECISION LENS NAME]

## Lens ID: DL-XXX-NN

## When to Use
Scenarios where this lens applies

## Decision Factors
| Factor | Weight | Considerations |
|--------|--------|----------------|

## Red Flags
- If X, reconsider Y

## Default Recommendation Logic
If [conditions], then [recommendation]
```
