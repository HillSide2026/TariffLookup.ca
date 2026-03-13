---
id: PRO-012
title: Stage & Phase Numbering Enforcement
owner: ML1
status: active
version: 1.0
created_date: 2026-02-13
last_updated: 2026-02-13
tags: [protocol]
---

# PRO-012 — Stage & Phase Numbering Enforcement

Enforces Policy: POL-007

Trigger condition: Artifact creation or modification that references a stage or phase.
Enforcement rule: If stage/phase naming or placement is invalid, flag and block promotion.
Block condition: stage_phase_format_invalid == true OR phase_sequence_invalid == true OR stage_missing_in_roadmap == true.
Escalation path: Escalate to ML1 with the invalid artifact and expected correction.
Logging requirement: Record failed checks and required corrections in the audit log.

## Enforcement Responsibilities (moved from DOCTRINE-2026-004)

### SMA-001 (System Governance)
Must:
- Reject artifacts with malformed or inconsistent stage/phase numbers
- Reject artifacts whose phase does not belong to the referenced stage
- Flag skipped or duplicate phase numbers

### SMA-005 (Runbook & QA)
Must:
- Validate naming, directory placement, and numbering consistency
- Fail QA if:
  - stage/phase format is incorrect
  - phase numbering is out of sequence
  - artifact references a non-existent stage or phase

## Minimal enforcement checklist
- [ ] Stage number exists in roadmap
- [ ] Phase number belongs to stage
- [ ] Naming format matches `STAGE<stage>[.<phase>]_`
- [ ] Directory path matches stage/phase
- [ ] No duplicate or skipped phases
