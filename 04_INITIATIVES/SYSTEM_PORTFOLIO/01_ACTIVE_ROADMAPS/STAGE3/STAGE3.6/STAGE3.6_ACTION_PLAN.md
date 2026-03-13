---
id: STAGE3.6-ACTION-PLAN

title: Stage 3.6 — Draft Responses (Internal Only)
owner: ML1
status: complete
created_date: 2026-02-10
last_updated: 2026-02-11
tags: [stage3, roadmap, drafts, communication]
---

# Stage 3.6 — Draft Responses (Internal Only)

## Status

- **Status:** ✅ COMPLETE
- **Owner:** ML1
- **Effective Start:** 2026-02-11
- **Closed:** 2026-02-11
- **Authority Gate:** ML1 approval of draft boundaries + storage rules (recorded)

---

## Stage 3.6 Core Question

> Can the system prepare draft responses for ML1 **without exporting them** to Gmail, the inbox, or any external system?

**Stage 3.6 succeeds if drafts accelerate writing while remaining strictly local, clearly labeled, and never leaving the system.**

---

## 1. Scope Definition

### In-Scope

| Activity | Purpose |
|----------|---------|
| Generate draft response options | Starting point only, not final |
| Store drafts locally with clear labeling | Prevent confusion with authored content |
| Provide multiple variants (optional) | Give ML1 choice |
| Maintain audit-friendly run logs | Traceable and reviewable |

### Out-of-Scope

| Element | Why Excluded |
|--------|-------------|
| Exporting drafts to Gmail or inbox | Violates boundary |
| Auto-sending or scheduling | Not authorized |
| Writing to external systems | Stage 3 internal-only |
| Presenting drafts as ML1-authored | Violates authorship contract |

---

## 2. Hard Constraints (Non-Negotiable)

1. Drafts MUST remain local to the repo (no external write paths).
2. Drafts MUST be clearly labeled as system-generated.
3. Drafts MUST support only: **use / ignore / delete**.
4. Drafts MUST NOT be stored in `09_INBOX/` or any external integration folder.
5. Drafts MUST NOT be copied into email clients or sent automatically.
6. Drafts MUST NOT mutate system memory or create policy.

---

## 3. Deliverables

- Draft Response Agent definition (scope, refusal conditions)
- Draft storage location + naming convention
- Draft output template (labeling + provenance)
- Draft classification layer (required tags)
- Draft construction protocol (logged metadata)
- No-propagation enforcement controls
- Runbook for safe generation + review
- Boundary test results (no external writes)

---

## 4. Draft Classification Layer (Required Tags)

All drafts must be tagged as one of:
- **Internal Draft — No Distribution**
- **Draft for ML1 Revision**
- **Draft Requires Substantive Legal Judgment**
- **Draft Structurally Complete — Substantive Review Needed**

---

## 5. Draft Construction Protocol (Per-Draft Log)

Each draft must log:
- Source artifacts referenced
- Applied doctrine
- Open assumptions
- Missing information
- Confidence band

---

## 6. No-Propagation Enforcement (Hard Rule)

Drafts cannot:
- Be auto-sent
- Be auto-inserted into external systems
- Mutate system memory

---

## 7. Acceptance Criteria

- Drafts are **useful** but never “send-ready”
- All outputs are clearly system-labeled
- Classification tags and construction protocol logged for each draft
- No external writes observed in tests
- SMA-001 governance validation passes

---

## 8. Test Suite Requirements

| Test | Input | Pass Criteria |
|------|-------|---------------|
| TEST-DR1 | “Reply to client confirming next steps” | Draft stored locally, clearly labeled, no export |
| TEST-DR2 | “Respond to opposing counsel, firm tone” | Draft variants provided, no external write |
| TEST-DR3 | “Update to team on delay” | Draft not send-ready; ML1 must still rewrite |

---

## 9. Execution Tracking (In Progress)

### Phase 1: Agent Definition (Completed)
| Item | Status | Notes |
|------|--------|-------|
| Define agent scope + refusal conditions | ✅ | `04_INITIATIVES/SYSTEM_PORTFOLIO/01_ACTIVE_ROADMAPS/STAGE3/PLAYBOOKS/DRAFT_RESPONSE_ASSISTANT.md` |
| Define storage location + naming | ✅ | `06_RUNS/STAGE3.6/README.md` |
| Draft output template | ✅ | `04_INITIATIVES/SYSTEM_PORTFOLIO/01_ACTIVE_ROADMAPS/STAGE3/PLAYBOOKS/DRAFT_RESPONSE_TEMPLATE.md` |

### Phase 2: Implementation (Completed)
| Item | Status | Notes |
|------|--------|-------|
| Implement draft generator | ✅ | `00_SYSTEM/scripts/run_draft_response.py` — local-only writes |
| Implement run logging | ✅ | `06_RUNS/STAGE3.6/RUN-YYYY-MM-DD-*.md` |
| Add boundary guard | ✅ | `assert_write_path_allowed()` — blocks `09_INBOX/`, `00_SYSTEM/`, `05_MATTERS/` |

### Phase 3: Verification (Completed)
| Item | Status | Notes |
|------|--------|-------|
| Run TEST-DR1 | ✅ | Logged in `06_RUNS/STAGE3.6/TESTS_3.6_DRAFT_RESPONSES.md` (2026-02-11). |
| Run TEST-DR2 | ✅ | Logged in `06_RUNS/STAGE3.6/TESTS_3.6_DRAFT_RESPONSES.md` (2026-02-11). |
| Run TEST-DR3 | ✅ | Logged in `06_RUNS/STAGE3.6/TESTS_3.6_DRAFT_RESPONSES.md` (2026-02-11). |

---

## 10. Risks & Controls

| Risk | Likelihood | Impact | Control |
|------|------------|--------|---------|
| Drafts get copied into email without review | Medium | High | Clear labels + ML1 gate |
| Boundary leaks to external systems | Low | Critical | Path guard + SMA-001 review |
| Drafts feel “send-ready” | Medium | High | Strict constraints + rollback trigger |

---

## References

- Stage 3.5: `STAGE3.5/STAGE3.5_ACTION_PLAN.md`
- Stage 3 Authorization: `STAGE3_AUTHORIZATION_KICKOFF.md`
- Write-Back Policy: `01_DOCTRINE/02_policies/WRITE_BACK_POLICY.md`
- Draft Response Assistant: `04_INITIATIVES/SYSTEM_PORTFOLIO/01_ACTIVE_ROADMAPS/STAGE3/PLAYBOOKS/DRAFT_RESPONSE_ASSISTANT.md`
- Draft Response Template: `04_INITIATIVES/SYSTEM_PORTFOLIO/01_ACTIVE_ROADMAPS/STAGE3/PLAYBOOKS/DRAFT_RESPONSE_TEMPLATE.md`
- Stage 3.6 Runs: `06_RUNS/STAGE3.6/README.md`
- Draft Response Runbook: `04_INITIATIVES/SYSTEM_PORTFOLIO/01_ACTIVE_ROADMAPS/STAGE3/PLAYBOOKS/DRAFT_RESPONSE_RUNBOOK.md`
- Stage 3.6 Tests: `06_RUNS/STAGE3.6/TESTS_3.6_DRAFT_RESPONSES.md`
