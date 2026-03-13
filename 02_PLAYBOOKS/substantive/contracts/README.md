---
id: 02_playbooks__contracts__readme_md
title: Contracts Practice Area
owner: ML1
status: draft
version: 1.0
supersedes:
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

## Playbook Header
Playbook ID: 02_playbooks__contracts__readme_md
Version: 1.0
Status: draft

Principles Referenced: PRN-001, PRN-002, PRN-003, PRN-004, PRN-006, PRN-009
Policies Applied: POL-003, POL-004, POL-006, POL-009, POL-011
Protocols Enforced: PRO-003, PRO-004, PRO-006, PRO-009, PRO-011
Doctrine Invoked: 00_SYSTEM/constitution.md, 01_DOCTRINE/index.yaml

Inputs: TBD
Outputs: TBD
Acceptance Criteria: TBD


# Contracts Practice Area

TODO: Split into workflow-specific folders (e.g., `contract_review/`, `contract_drafting/`).

Solution frames, decision support, and agent infrastructure for contract matters.

---

## Scope

This practice area covers the preparation, review, and assembly of contractual instruments where LL acts for one party. It does not cover:
- Contract disputes beyond demand letter (separate scope)
- Corporate governance instruments (see CORPORATE)
- Real estate agreements (separate scope)

---

## Dispute Boundary

LL may draft and send a demand letter within this practice area. After demand letter, the matter transitions to a separate disputes scope.

---

## Structure

| Directory | Purpose |
|-----------|---------|
| [solutions/](solutions/) | Solution frames for contract types |
| [issue_maps/](issue_maps/) | Structured taxonomies of contract issues |
| [decision_lenses/](decision_lenses/) | Analytical frameworks for contract decisions |
| [failure_modes/](failure_modes/) | Known failure patterns in contract matters |
| [question_banks/](question_banks/) | Structured intake/scoping questions per Solution |
| [regulatory_surfaces/](regulatory_surfaces/) | Statutory/regulatory touchpoints |
| [agents/](agents/) | Agent specifications and supporting references |

---

## Relationship to CORPORATE

These are parallel practice areas with shared architectural patterns but independent content. Cross-practice-area routing (e.g., incorporation + vendor contract for new entity) is TBD.

---

## Architectural Reference

This practice area follows the Practice Area Master Agent Spec v1.0:
- [PRACTICE_AREA_MASTER_AGENT_SPEC](../../../00_SYSTEM/agents/specs/PRACTICE_AREA_MASTER_AGENT_SPEC.md)
- [AGENT_TYPOLOGY](../../../00_SYSTEM/agents/specs/AGENT_TYPOLOGY.md)
