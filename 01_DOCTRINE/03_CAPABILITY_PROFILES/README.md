---
id: 01_doctrine__03_capability_profiles__readme_md
title: Agent Capability Profiles
owner: ML1
status: draft
version: 1.0
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Agent Capability Profiles

Definition: Opt-in profiles that grant scoped, revocable relaxations to default agent constraints under ML1 control.
Boundary: Does not change binding doctrine, policies, or protocols; profiles only permit constrained exceptions.

This directory contains **opt-in capability profiles** that grant specific, limited relaxations to the Canonical Agent Doctrine (`DOCTRINE-AGENTS-0001`).

---

## Relationship to Doctrine

| Layer | Analogy | Changeability |
|-------|---------|---------------|
| Canonical Doctrine | Constitutional law | Rarely changed |
| Capability Profiles | Statutes / Permits | Task-specific, revocable |

Doctrine defines **what agents cannot do by default**.
Profiles define **what specific agents may do under controlled conditions**.

---

## Relaxation Axes

Profiles relax constraints along **one axis at a time**:

| Axis | Example Relaxation |
|------|-------------------|
| Write access | Read-only → draft-only → scoped edits |
| Scope | Single folder → project class → portfolio |
| Autonomy | On-demand → batch → scheduled |
| Confidence | Conservative → moderate (never assertive) |
| Memory | Stateless → session → scoped retrieval |

---

## Progression Model

| Phase | Capability | Constraints |
|-------|-----------|-------------|
| 1 — Analysis Only | Read, summarize, recommend | No writes, no memory |
| 2 — Draft Generation | Create draft files | No overwrites, no lifecycle changes |
| 3 — Maintenance Edits | Update drafts | Append-only logs, no deletions |
| 4 — Structured Updates | Schema-bound updates | Still no authority, still reversible |

At no point does an agent: **decide**, **approve**, **execute**, or **enforce**.

---

## Profile Index

| ID | Name | Status | Scope |
|----|------|--------|-------|
| 0001 | Draft Write Access | ACTIVE | Documentation synthesis |

---

## Creating a New Profile

1. Copy `_TEMPLATE.md`
2. Assign next sequential ID
3. Define scope narrowly
4. Document all relaxations explicitly
5. Require ML1 approval

---

## Revocation

To revoke a profile:
1. Change status to `REVOKED`
2. Add revocation date
3. No justification required
