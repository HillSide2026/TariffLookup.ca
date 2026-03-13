---
id: 02_playbooks__stage3__consistency_metric_spec_md
title: Consistency Metric Spec v1.0 (Stage 3.9)
owner: ML1
status: draft
version: 1.0
supersedes:
created_date: 2026-02-12
last_updated: 2026-02-12
tags: [stage3, metric, consistency]
---

## Playbook Header
Playbook ID: 02_playbooks__stage3__consistency_metric_spec_md
Version: 1.0
Status: draft

Principles Referenced: PRN-001, PRN-002, PRN-003, PRN-004, PRN-005, PRN-006, PRN-008, PRN-009
Policies Applied: POL-003, POL-004, POL-006, POL-007, POL-009, POL-010
Protocols Enforced: PRO-003, PRO-004, PRO-006, PRO-007, PRO-009, PRO-010
Doctrine Invoked: 00_SYSTEM/constitution.md, 01_DOCTRINE/index.yaml

Inputs: TBD
Outputs: TBD
Acceptance Criteria: TBD


# Consistency Metric Spec v1.0 (Stage 3.9)

## Purpose
Define a read-only metric that measures internal consistency across system outputs without creating authority or enforcement.

## Scope
Applies to Stage 3 outputs only (scaffolding, summaries, drafts, flags). Not used as a gate for execution.

## Dimensions (Score 0–2 Each)

1. **Terminology Alignment**
- 2: Terminology is consistent across related artifacts
- 1: Minor terminology drift
- 0: Conflicting or inconsistent terminology

2. **Doctrine Reference Consistency**
- 2: Single, consistent doctrine references
- 1: Minor reference ambiguity
- 0: Conflicting doctrine references

3. **Template Version Alignment**
- 2: Correct template/version usage
- 1: Minor version ambiguity
- 0: Outdated or conflicting template versions

4. **Framing Coherence**
- 2: Framing consistent across related outputs
- 1: Minor framing drift
- 0: Conflicting framing (e.g., direct vs empathetic mismatch)

5. **Coverage Coherence**
- 2: Coverage lists align across artifacts
- 1: Minor omissions or overlaps
- 0: Material coverage gaps or contradictions

## Scoring
- **Total Score:** 0–10
- **Bands (initial):**
  - 9–10: Consistent
  - 7–8: Mostly consistent (review)
  - 0–6: Inconsistent (flag only, no action)

## Rules
- Read-only analysis only
- No recommendations or prescriptions
- No enforcement or gating

## Output Format
Use: `04_INITIATIVES/SYSTEM_PORTFOLIO/01_ACTIVE_ROADMAPS/STAGE3/PLAYBOOKS/CONSISTENCY_METRIC_WORKSHEET.md`
