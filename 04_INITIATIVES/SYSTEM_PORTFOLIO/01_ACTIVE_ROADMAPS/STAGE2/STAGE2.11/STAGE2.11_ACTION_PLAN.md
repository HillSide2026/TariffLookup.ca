---
id: STAGE2.11-ACTION-PLAN

title: Stage 2.11 — Matter Management Agent (Backlog)
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: [stage2, roadmap, matter-dashboard, agent]
---

# Stage 2.11 — Matter Management Agent (Backlog)

## Status

- **Status:** 🟨 BACKLOG
- **Owner:** UNASSIGNED
- **Effective Start:** TBD (after Stage 2.9/2.10)
- **Closed:** —
- **Authority Gate:** Requires ML1 approval of agent scope + calendar write-back rules

---

## Stage 2.11 Core Question

> Can we introduce a Matter Management Agent that runs the Matter Dashboard cycle during business hours without crossing write-back or scheduling boundaries?

**Stage 2.11 succeeds if the Matter Management Agent can run the Matter Dashboard cycle on an hourly cadence (9–5, Mon–Fri), including writing the authoritative ledger in Google Drive within approved boundaries.**

---

## 1. Scope Definition

### In-Scope

| Activity | Purpose |
|----------|---------|
| Define Matter Management Agent role + authority | Clarify responsibilities and boundaries |
| Hourly run schedule (9–5, Mon–Fri) | Consistent dashboard updates |
| Run orchestration for Matter Dashboard | Standard daily cycle execution |
| Logging + run tracking | Audit trail |

### Planned Coverage (Summary)

- Define the Matter Management Agent role, authority, and refusal conditions
- Establish Matter Dashboard runs during business hours (Mon–Fri, 09:00–17:00)
- Orchestrate the Matter Dashboard run (including Drive ledger writes within approved boundary)
- Logging + run tracking for each run

### Out-of-Scope

| Element | Why Excluded |
|---------|--------------|
| Calendar write-back | Deferred to Stage 2.12 |
| Automated task scheduling | Requires calendar integration |
| External writes beyond Drive ledger | Not authorized in this stage |

---

## 2. Implementation Notes (Normative Constraints)

1. Runs occur only **Mon–Fri, 09:00–17:00 local time**, with at most one run per hour.
2. The agent MAY write to the approved Drive ledger only; all other external writes are prohibited.
3. Outputs remain local to the repo (`06_RUNS/ops/`, `06_RUNS/EXECUTION/`) in addition to the Drive ledger.
4. All automation MUST be human-triggered until ML1 approves background scheduling.

---

## 3. Deliverables

- Matter Management Agent definition (role, authority, refusal conditions)
- Runbook for hourly Matter Dashboard cycle
- Schedule policy (business-hour cadence, manual trigger spec)
- Example run log(s) showing hourly execution
- Drive ledger write policy + boundary guard reference

---

## 4. Acceptance Criteria

- Matter Dashboard runs on hourly cadence within business hours
- Drive ledger writes occur only within approved boundary
- Run logs and outputs captured in repo
- SMA-001 governance validation passes

---

## 5. Execution Tracking (Backlog)

### Phase 1: Agent Definition (Planned)
| Item | Status | Notes |
|------|--------|-------|
| Define agent scope + authority | ⬜ | ML1 approval required |
| Create runbook | ⬜ | Must reference Matter Dashboard script |

### Phase 2: Cadence + Runs (Planned)
| Item | Status | Notes |
|------|--------|-------|
| Define hourly cadence policy | ⬜ | 09:00–17:00, Mon–Fri |
| Produce sample run logs | ⬜ | At least 3 runs |

---

## 6. Risks & Controls

| Risk | Likelihood | Impact | Control |
|------|------------|--------|---------|
| Background automation without approval | Medium | High | Manual trigger only until ML1 approval |
| Write-back boundary violations | Medium | High | Boundary guard + SMA-001 governance review |

---

## References

- Stage 2.9 Action Plan: `STAGE2.9/STAGE2.9_ACTION_PLAN.md`
- Stage 2.10 Action Plan: `STAGE2.10/STAGE2.10_ACTION_PLAN.md`
- Write-Back Policy: `01_DOCTRINE/02_policies/WRITE_BACK_POLICY.md`
