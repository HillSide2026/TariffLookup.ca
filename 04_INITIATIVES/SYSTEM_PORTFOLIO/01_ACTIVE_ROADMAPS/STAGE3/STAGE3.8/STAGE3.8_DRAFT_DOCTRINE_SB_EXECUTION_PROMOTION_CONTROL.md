---
id: 04_initiatives__system_portfolio__01_active_roadmaps__stage3__stage3_8__draft_doctrine_sb_execution_promotion_control_md
title: DRAFT DOCTRINE — SB Execution Promotion Control (v0.1)
owner: ML1
status: draft
created_date: 2026-02-12
last_updated: 2026-02-12
tags: [stage3, draft, doctrine, sharepoint, promotion]
---

# DRAFT DOCTRINE
SB Execution Promotion Control

**Status:** Draft
**Stage:** Pre-3.8 Pressure Test
**Version:** v0.1

**Note:** Draft only. Non-authoritative until explicitly approved under DOCTRINE-2026-001.

---

## 1. Purpose

To define the governance model for document generation and controlled promotion from DRAFTS to FINAL within the SharePoint -> Second Brain execution bridge.

This doctrine defines authority, boundaries, and invariants.
It does not define technical implementation details (see Draft Spec).

---

## 2. Hierarchy Enforcement

- ML1 retains sole authority to approve publication.
- ML2 may generate drafts and execute promotion only upon ML1 trigger.
- LL consumes FINAL outputs only; drafts are non-authoritative.
- No automation may substitute for ML1 approval.

---

## 3. Scope Boundary (Execution Enclave)

ML2 write authority is strictly limited to:

```
SB Execution/
    DRAFTS/
    FINAL/
    RUN_LOGS/
    TEMPLATES/
```

ML2 may not:

- Modify content outside this subtree
- Overwrite any existing file in DRAFTS
- Edit or overwrite any file in FINAL

---

## 4. Lifecycle Model

Documents progress through deterministic states:

GENERATED -> (ML1 Trigger) -> PROMOTED -> IMMUTABLE

**GENERATED**
- System-created
- Stored in DRAFTS
- Non-authoritative

**PROMOTED**
- Triggered only by ML1 metadata action
- Copied to FINAL
- Logged in RUN_LOGS

**IMMUTABLE**
- FINAL files are append-only
- Revisions create new FINAL files

---

## 5. Promotion Authority

Promotion requires:

- Explicit ML1 action via SharePoint column metadata change
- System detection of that state transition
- Successful audit log creation

If metadata is ambiguous, missing, or invalid:

- Promotion must not occur.

---

## 6. Non-Overwriting Rule

- DRAFTS are write-once.
- FINAL is append-only.
- No silent corrections.
- No background revision.
- No auto-improvement of ML1-approved content.

---

## 7. Audit Integrity

Every promotion must produce a durable run record.

If logging fails:

- Promotion fails.
- No silent publication.

---

## 8. Stage 3.8 Pressure Test Notice

This doctrine is provisional and will be pressure tested in Stage 3.8 for:

- Edge-case ambiguity
- Race conditions
- Metadata corruption scenarios
- SharePoint permissions drift
- Human error patterns
- Accidental re-promotion
- Cross-matter contamination
- Rollback feasibility

No elevation to "Released Doctrine" until Stage 3.8 validation is complete.
