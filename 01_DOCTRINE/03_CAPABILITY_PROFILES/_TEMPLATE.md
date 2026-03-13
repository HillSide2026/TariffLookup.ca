---
id: 01_doctrine__03_capability_profiles___template_md
title: AGENT-CAPABILITY-PROFILE-XXXX: [Profile Name]
owner: ML1
status: draft
version: 1.0
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# AGENT-CAPABILITY-PROFILE-XXXX: [Profile Name]

**Status:** DRAFT | ACTIVE | REVOKED
**Effective:** YYYY-MM-DD
**Supersedes:** None
**Parent Doctrine:** DOCTRINE-AGENTS-0001

---

## 1. Purpose

Defines narrowly scoped exceptions to the Canonical Agent Doctrine for a specific agent role and task class.

This profile does not replace doctrine. It grants explicit, limited permissions under controlled conditions.

---

## 2. Applies To

**Agent Role(s):**
- [role-name]

**Task Classes:**
- [task-class-1]
- [task-class-2]

---

## 3. Doctrine Clauses Relaxed

| Doctrine Section | Default Rule | Relaxation |
|------------------|--------------|------------|
| §X | [default] | [relaxed to] |

All other clauses remain fully in force.

---

## 4. Explicit Permissions Granted

The agent MAY:
- [permission-1]
- [permission-2]

Only within:
- [scope-path]

---

## 5. Explicit Prohibitions (Still Enforced)

The agent MAY NOT:
- [prohibition-1]
- [prohibition-2]

---

## 6. Provenance & Labeling Requirements

All outputs MUST:
- Be labeled `status: draft`
- Include agent role attribution
- Include generation timestamp
- Include source references

---

## 7. Confidence & Halt Conditions (Inherited + Tightened)

In addition to Canonical Doctrine §5:
- [additional-halt-condition-1]
- [additional-halt-condition-2]

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
| Date | YYYY-MM-DD |
| Scope Notes | |
