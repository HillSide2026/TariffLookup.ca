---
id: 01_doctrine__03_capability_profiles__agent-capability-profile-0001-draft_write_access_md
title: AGENT-CAPABILITY-PROFILE-0001: Draft Write Access
owner: ML1
status: draft
version: 1.0
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# AGENT-CAPABILITY-PROFILE-0001: Draft Write Access

**Status:** ACTIVE
**Effective:** 2026-02-04
**Supersedes:** None
**Parent Doctrine:** DOCTRINE-AGENTS-0001

---

## 1. Purpose

Defines narrowly scoped exceptions to the Canonical Agent Doctrine for agents performing documentation synthesis and draft maintenance tasks.

This profile does not replace doctrine. It grants explicit, limited permissions under controlled conditions.

---

## 2. Applies To

**Agent Role(s):**
- project-manager
- system-governance
- todo-rollup

**Task Classes:**
- Project status synthesis
- Draft documentation maintenance
- Report generation
- Index and summary generation

---

## 3. Doctrine Clauses Relaxed

| Doctrine Section | Default Rule | Relaxation |
|------------------|--------------|------------|
| §3 Scope of Action | Analysis-only | May write draft files |
| §2 Authority Boundary | No commits | May create/update drafts in scoped directories |

All other clauses remain fully in force.

---

## 4. Explicit Permissions Granted

The agent MAY:
- Create new draft files
- Update existing draft files
- Append to changelogs and logs
- Generate reports and indices

Only within:
- `04_INITIATIVES/**`
- `05_MATTERS/**/README.md` (append only)
- `06_RUNS/**`
- `05_MATTER_DOCKETING/**`

---

## 5. Explicit Prohibitions (Still Enforced)

The agent MAY NOT:
- Rename files
- Delete files
- Move files between directories
- Mark drafts as approved
- Alter ML1 decisions
- Change matter lifecycle stage
- Modify `01_DOCTRINE/**` without explicit instruction
- Write to `00_SYSTEM/**` without explicit instruction

---

## 6. Provenance & Labeling Requirements

All outputs MUST:
- Be labeled `status: draft` where applicable
- Include agent role attribution
- Include generation timestamp
- Include source references where derivation is non-trivial

---

## 7. Confidence & Halt Conditions (Inherited + Tightened)

In addition to Canonical Doctrine §5:
- If file path ambiguity exists → halt
- If schema conflict exists → halt
- If instruction conflicts with doctrine → halt
- If write would overwrite non-draft content → halt

---

## 8. Review & Revocation

- Profile is valid until explicitly revoked
- ML1 may revoke at any time
- Revocation requires no justification

---

## 9. Approval Record

| Field | Value |
|-------|-------|
| Approved By | ML1 |
| Date | 2026-02-04 |
| Scope Notes | Initial profile for documentation synthesis agents |
