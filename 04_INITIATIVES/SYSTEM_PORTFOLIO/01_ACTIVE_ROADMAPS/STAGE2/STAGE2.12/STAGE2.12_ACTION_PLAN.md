---
id: STAGE2.12-ACTION-PLAN

title: Stage 2.12 — Calendar Scheduling (Backlog)
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: [stage2, roadmap, matter-dashboard, calendar]
---

# Stage 2.12 — Calendar Scheduling (Backlog)

## Status

- **Status:** 🟨 BACKLOG
- **Owner:** UNASSIGNED
- **Effective Start:** TBD (after Stage 2.11)
- **Closed:** —
- **Authority Gate:** Requires ML1 approval for external write-back to Google Calendar

---

## Stage 2.12 Core Question

> Can the system schedule top-priority Matter Dashboard tasks into Google Calendar with explicit scope boundaries and approval controls?

**Stage 2.12 succeeds if high-priority tasks can be scheduled into Google Calendar with audit logging, strict scope boundaries, and human approval for each write.**

---

## 1. Scope Definition

### In-Scope

| Activity | Purpose |
|----------|---------|
| Define calendar write-back boundaries | Prevent unintended scheduling |
| Select scheduling rule set for top-priority tasks | Deterministic eligibility |
| Implement calendar write-back (Google Calendar API) | Create events |
| Audit logging for calendar writes | Traceability |

### Out-of-Scope

| Element | Why Excluded |
|---------|--------------|
| Automatic task completion | Human-owned status only |
| Scheduling without human approval | Requires explicit approval gate |
| Cross-calendar scheduling | Single approved calendar only |

---

## 2. Implementation Notes (Normative Constraints)

1. Calendar writes MUST be human-approved (explicit gate per run).
2. Scheduling must target a single approved calendar ID.
3. Only tasks marked **top-priority** by deterministic rules may be scheduled.
4. Each calendar event must include a back-link to the Matter Dashboard task.
5. All writes must be logged with timestamp, task_id, and event_id.

---

## 3. Deliverables

- Calendar scheduling policy (eligibility rules)
- Approved calendar ID + scope boundaries
- Scheduling runbook and audit logging format
- Minimal integration test (create, read, delete in approved calendar)

---

## 4. Acceptance Criteria

- Calendar events created only for eligible top-priority tasks
- Human approval gate enforced for every write
- Audit logs produced for each scheduled event
- SMA-001 governance validation passes

---

## 5. Execution Tracking (Backlog)

### Phase 1: Policy + Boundaries (Planned)
| Item | Status | Notes |
|------|--------|-------|
| Define top-priority criteria | ⬜ | Deterministic rule set |
| Approve calendar ID + scope | ⬜ | ML1 approval required |

### Phase 2: Implementation (Planned)
| Item | Status | Notes |
|------|--------|-------|
| Implement scheduling write-back | ⬜ | Google Calendar API |
| Add audit logging | ⬜ | Required for every write |

### Phase 3: Verification (Planned)
| Item | Status | Notes |
|------|--------|-------|
| Create test event in approved calendar | ⬜ | Must pass |
| Validate denial outside boundary | ⬜ | Must fail as expected |

---

## 6. Risks & Controls

| Risk | Likelihood | Impact | Control |
|------|------------|--------|---------|
| Unapproved writes to calendar | Medium | High | Human approval gate + SMA-001 review |
| Scheduling wrong calendar | Medium | High | Boundary enforcement by calendar ID |

---

## References

- Stage 2.11 Action Plan: `STAGE2.11/STAGE2.11_ACTION_PLAN.md`
- Write-Back Policy: `01_DOCTRINE/02_policies/WRITE_BACK_POLICY.md`
