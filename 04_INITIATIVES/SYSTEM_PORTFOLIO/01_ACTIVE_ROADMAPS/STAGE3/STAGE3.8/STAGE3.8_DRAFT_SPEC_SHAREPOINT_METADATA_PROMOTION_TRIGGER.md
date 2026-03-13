---
id: 04_initiatives__system_portfolio__01_active_roadmaps__stage3__stage3_8__draft_spec_sharepoint_metadata_promotion_trigger_md
title: DRAFT SPEC — SharePoint Metadata Promotion Trigger (v0.1)
owner: ML1
status: draft
created_date: 2026-02-12
last_updated: 2026-02-12
tags: [stage3, draft, spec, sharepoint, promotion]
---

# DRAFT SPEC
SharePoint Metadata Promotion Trigger

**Status:** Draft
**Stage:** Pre-3.8 Pressure Test
**Version:** v0.1

**Note:** Draft only. Non-enforceable until explicitly approved by ML1.

---

## 1. SharePoint Column Schema (Minimum Required)

On DRAFT items:

| Column Name | Type | Required | Notes |
|------------|------|----------|-------|
| SB_Status | Choice | Yes | Controlled state |
| SB_RunID | Text | Yes | Unique per generation |
| SB_TemplateVersion | Text | Yes | Template provenance |
| SB_GeneratedAt | DateTime | Yes | System-set |
| SB_GeneratedBy | Text | Yes | "ML2" identity |
| SB_ApprovedBy | Person | Conditional | ML1 only |
| SB_ApprovedAt | DateTime | Conditional | ML1-set |
| SB_FinalizedAt | DateTime | System | On promotion |
| SB_FinalFileRef | Text/Link | System | Path or ID |

---

## 2. Allowed SB_Status Values

- DRAFT
- READY_FOR_REVIEW
- APPROVED_FOR_FINAL
- FINALIZED
- PROMOTION_INCOMPLETE
- REJECTED

No free-text values permitted.

---

## 3. Promotion Trigger Contract

Promotion occurs only when:

- SB_Status transitions -> APPROVED_FOR_FINAL
- SB_ApprovedBy == ML1
- SB_ApprovedAt is populated
- SB_RunID is valid
- No existing FINAL artifact already tied to that RunID

If any condition fails:

- Do not promote.

---

## 4. Promotion Mechanics

Upon valid trigger:

- Copy draft file to FINAL/
- Apply FINAL naming convention:
  - `YYYY-MM-DD__RUNID__DocType__vX__FINAL.docx`
- Write immutable log entry in RUN_LOGS/
- Update draft metadata:
  - SB_Status = FINALIZED
  - SB_FinalizedAt = now
  - SB_FinalFileRef = <path>

---

## 5. Concurrency Protection (To Be Tested)

Spec must handle:

- Double-click promotion attempts
- Simultaneous metadata edits
- Network interruption mid-copy
- Partial log writes
- File lock during promotion

Fallback state:

- PROMOTION_INCOMPLETE

Requires manual reconciliation.

---

## 6. Logging Requirements

Each promotion log entry must contain:

- Timestamp
- RunID
- Draft file ID/path
- Final file ID/path
- Approver
- Approval timestamp
- Template version
- Promotion result
- Optional checksum/hash

Logs are immutable.

---

## 7. Explicit Non-Goals (Pre-3.8)

This version does NOT yet define:

- Rollback procedure
- Version auto-increment logic
- Template lock enforcement
- Permission hardening model
- External integration behavior

These are deferred for Stage 3.8 validation.

---

## Stage 3.8 Pressure Testing Scope (Preview)

Both Doctrine and Spec will be stress-tested for:

- Drift resistance
- Abuse resistance
- Human error resilience
- Audit sufficiency
- Legal defensibility
- Disaster recovery compatibility
- Scalability under volume

Only after Stage 3.8 will:

- v1.0 Doctrine be released
- Spec be marked enforceable
