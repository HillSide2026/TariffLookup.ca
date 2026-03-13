---
id: 04_initiatives__system_portfolio__01_active_roadmaps__stage2__stage2_9__stage2_9_action_plan_md
title: Stage 2.9 — Google Drive Integration Setup (Backlog)
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-10
tags: []
---

# Stage 2.9 — Google Drive Integration Setup (Backlog)

## Status

- **Status:** ✅ COMPLETE
- **Owner:** ML1
- **Effective Start:** 2026-02-10
- **Closed:** 2026-02-10
- **Authority Gate:** ML1-approved auth model + scope boundaries

---

## Stage 2.9 Core Question

> Can the system securely read/write Google Drive artifacts (Drive + Docs/Sheets) within a strictly scoped folder boundary?

**Stage 2.9 succeeds if authenticated access is established with a least-privilege scope and verified by test reads/writes to an approved folder only.**

---

## 1. Scope Definition

### In-Scope

| Activity | Purpose |
|----------|---------|
| Set up authenticated API access (Drive + Docs/Sheets) | Enable controlled read/write |
| Define permitted scopes (folder-only boundary) | Prevent privilege creep |
| Establish service account or OAuth flow + key management | Durable auth mechanism |
| Create target Drive folder structure + naming conventions | Canonical “write surface” |

### Out-of-Scope

| Element | Why Excluded |
|---------|--------------|
| Migrating the authoritative ledger | Covered in Stage 2.10 |
| Broad Drive access beyond the approved folder | Violates least-privilege |
| Autonomous execution inside LL | Human-gated only |

---

## 2. Implementation Notes (Normative Constraints)

1. Access MUST be limited to a single approved Drive folder (or explicit allowlist).
2. Secrets MUST NOT be committed to the repo.
3. A minimal integration test MUST demonstrate:
   - successful read/write inside approved folder
   - failed access outside boundary (expected denial)

---

## 3. Deliverables

- Auth approach selected and documented (service account vs OAuth)
- Config recorded for:
  - approved folder ID(s)
  - scopes
  - credential loading method
- Minimal test script or runbook proving boundary behavior
- Naming convention for Drive artifacts used by the system

---

## 4. Acceptance Criteria (Shared for Stages 2.9–2.10)

- Ledger persists in Drive and survives daily regeneration
- Lawyer 1 can mark `DONE` / `TRIAGED` / `WAITING` / `DROPPED` directly in Drive
- Daily report uses Drive ledger as the starting point (email extraction only augments)
- No task disappears due to email window expiration

---

## 5. Execution Tracking (Backlog)

### Phase 1: Auth & Scope (Complete)
| Item | Status | Notes |
|------|--------|-------|
| Choose auth model (service account vs OAuth) | ✅ | ML1-approved |
| Define folder boundary + scopes | ✅ | Least-privilege |
| Key management approach | ✅ | No secrets in repo |

### Phase 2: Folder & Naming (Complete)
| Item | Status | Notes |
|------|--------|-------|
| Create approved Drive folder | ✅ | Folder created |
| Establish naming conventions | ✅ | Ledger + snapshots |

### Phase 3: Verification (Complete)
| Item | Status | Notes |
|------|--------|-------|
| Test read/write inside folder | ✅ | Pass |
| Test denial outside folder | ✅ | Pass (expected denial) |
| Auth + boundary smoke test | ✅ | Pass |
