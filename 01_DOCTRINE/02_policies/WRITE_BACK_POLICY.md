---
id: 00_system__write_back_policy_md
title: System Write-Back Policy
owner: ML1
status: draft
version: 1.0
created_date: 2026-02-09
last_updated: 2026-02-27
tags: []
---

# System Write-Back Policy

**Version:** v1.0
**Status:** ACTIVE
**Effective:** Stage 2.1 onwards

---

## Purpose

Define rules governing how agents write data to the repository and external systems.

---

## Precedence

For operational external writes, `01_DOCTRINE/02_policies/INTEGRATION_CONTROL_POLICY.md` governs and supersedes this policy.
This policy remains authoritative for repository write permissions and for explicit constraints not overridden by Integration Control.

---

## Core Principles

### 0. System Scope (Amendment Approved 2026-02-26)
The **system** includes the ML2 repository **plus explicitly incorporated integration surfaces** (e.g., Gmail, Calendar, SharePoint) governed by ML2 policy.

- The repo remains the system of record.
- Integrated surfaces are external execution surfaces governed by ML2.
- Integration does not grant write authority; all write-backs remain approval-gated.

### 1. Local-First
All agent work lands in the repository first. The repo is the system of record.

### 2. Read-Only External Access (Default)
External integrations are **read-only** unless an operational write is authorized under the Integration Control Policy.
- Gmail: Read emails only
- SharePoint: Read documents only
- Word/OneDrive: Read documents only

No agent may write, create, update, or delete data in external systems unless allowed by Integration Control or an explicit write-back capability is approved.

### 3. Explicit Authorization Required (Write-Back Capabilities)
Write-back capabilities are **not** implied by system scope. The following high-risk write-backs remain explicitly gated and require ML1 approval per run:
- Google Drive Ledger write-back (Stage 2.11)
- Gmail matter labeling write-back (Stage 2.13)

All other write-back capabilities remain prohibited unless explicitly added and approved, or permitted under Integration Control.

Any approved write-back requires:
- ML1 explicit approval
- Change summary documenting what will be written
- Rollback plan documenting how to undo changes
- Audit logging of all write operations

---

## Agent Write Permissions

### Allowed Write Locations (Repository)

| Agent | Allowed Write Locations |
|-------|------------------------|
| SMA-001 System Governance | Compliance reports, governance audit outputs |
| SMA-002 Portfolio Planning | Backlog updates, stage closure recommendations, roadmap proposals |
| SMA-003 Integration Steward | Integration specs (versioned), capability matrices, verification reports |
| SMA-004 Knowledge Curation | Triage recommendations, artifact promotion proposals, index updates |
| SMA-005 Runbook & QA | QA validation reports, runbook drafts |

### Prohibited Actions (All Agents)

- Writing to external systems (Gmail, SharePoint, Word, etc.) outside Integration Control or explicit approvals
- Modifying credentials or secrets
- Changing doctrine without ML1 approval
- Writing outside designated output folders
- Deleting artifacts without governance review

---

## Enforcement

### Pre-Commit Checks
Safety rails validate:
- `.env` is not tracked
- Agent outputs only in allowed folders
- Required frontmatter present for artifact types

### Governance Review
System Governance Agent (SMA-001) validates:
- Output placement compliance
- Write permission boundaries
- Escalation when violations detected

---

## Future Stages

When external write-back is authorized (Stage 3+), the following additional requirements apply:

1. **Change Summary Required**
   - What will be written
   - Target system and location
   - Expected outcome

2. **Rollback Plan Required**
   - How to undo the change
   - Who can execute rollback
   - Time window for rollback

3. **Audit Trail Required**
   - Timestamp of write
   - Agent identifier
   - Exact data written
   - Success/failure status

---

## References

- Agent definitions: `00_SYSTEM/AGENTS/`
- Stage 2.1 Action Plan: `01_ACTIVE_ROADMAPS/STAGE2/STAGE2.1_ACTION_PLAN.md`
- Stage 2 Authorization: `01_ACTIVE_ROADMAPS/STAGE2/STAGE5_AUTHORIZATION_KICKOFF.md`
---

## Stage 2.11 — Matter Dashboard Write-Back (Drive Ledger)

### Purpose
Define what the Matter Management Agent may and may not modify when writing to the authoritative ledger.
This policy prevents silent corruption of human judgment and ensures auditability.

### Authoritative Store
- The Google Drive Ledger document is the sole authoritative store
- Local state may support idempotency but never overrides the ledger

### Permitted Writes
The agent MAY:
- Add new task rows
- Update system-owned fields (status, timestamps, routing tags)
- Append run metadata (run_id, last_seen, system_notes)

### Prohibited Writes
The agent MUST NOT:
- Overwrite human-entered notes or commentary fields
- Delete rows unless explicitly marked system-deletable
- Modify structure or schema of the ledger
- Write to any document outside the approved Drive folder

### Conflict Handling
If a conflict is detected between system output and human edits:
- Preserve human edits
- Flag the row as `needs_review`
- Record the conflict in the run log

### Enforcement
- All writes must pass the Drive boundary guard
- Any violation results in immediate refusal and NO-OP

---

## Stage 2.13 — Gmail Matter Labeling (Write-Back)

### Purpose
Define Gmail write-back boundaries for applying matter-number labels.

### Authoritative Behavior
- Labels only (add/remove)
- No message content changes
- No move/delete operations

### Permitted Writes
The agent MAY:
- Add or remove labels in the `LL/1./<delivery_status>/<matter_id>` format
- Create labels on demand at first authorized use

### Prohibited Writes
The agent MUST NOT:
- Modify message bodies or headers
- Move, delete, trash, or archive messages
- Write to any mailbox outside the approved account

### Approval Gate
- Each run requires an explicit human approval artifact
- Absence of approval must hard-block execution

### Audit Logging
- All label writes must be logged in an append-only audit file
- Each entry must include message_id, label, operation, timestamp, approving_human, and reason
