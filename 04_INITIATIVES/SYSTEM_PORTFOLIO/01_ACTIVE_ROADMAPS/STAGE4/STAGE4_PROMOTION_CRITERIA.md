---
id: 04_initiatives__system_portfolio__01_active_roadmaps__stage4__stage4_promotion_criteria_md
title: Stage 4 — Roadmap Promotion Criteria
owner: ML1
status: draft
created_date: 2026-02-11
last_updated: 2026-02-11
tags: []
---

# Stage 4 — Roadmap Promotion Criteria

## Status
- Status: APPROVED
- Owner: ML1
- Date: 2026-01-26

## Purpose
Define criteria for promoting roadmaps from Draft to Active status.

---

## Promotion Levels

| From | To | Approver | Criteria |
|------|-----|----------|----------|
| INBOX | Draft Roadmap | Portfolio Planning Agent | Structured, scoped |
| Draft Roadmap | Active Roadmap | **ML1** | Full criteria below |
| Active Roadmap | Archive | **ML1** | All stages closed |

---

## Draft → Active Promotion Criteria

### Required Evidence

| Criterion | Description | Validation |
|-----------|-------------|------------|
| **Scope Defined** | Clear boundaries, out-of-scope documented | Review roadmap header |
| **Stages Defined** | Each stage has DoD and backlog | Count stages, verify DoD |
| **Owners Assigned** | Each backlog item has owner | Scan backlog for TBD |
| **Dependencies Mapped** | Inter-stage and external dependencies | Review dependency notes |
| **Risks Logged** | Known risks documented | Risk section exists |
| **ML1 Questions Answered** | Decision questions resolved or logged | Review decision section |

### Promotion Checklist
```markdown
## Promotion Checklist — [Roadmap Name]

- [ ] Scope: Boundaries and out-of-scope documented
- [ ] Stages: Each stage has Definition of Done
- [ ] Backlog: Items populated for at least Stage 1
- [ ] Owners: No unassigned blockers (TBD resolved or flagged)
- [ ] Dependencies: Mapped and no circular dependencies
- [ ] Risks: At least one risk assessment pass completed
- [ ] ML1 Questions: Answered or explicitly deferred with rationale
- [ ] Naming: Follows ROADMAP-{scope}-{version}.md convention

Prepared by: [Agent]
Date: [YYYY-MM-DD]
ML1 Decision: [ ] APPROVE  [ ] REJECT  [ ] DEFER
```

---

## Promotion Process

### Step 1: Prepare Package
Portfolio Planning Agent assembles:
- Roadmap document
- Completed promotion checklist
- Summary of ML1 decision points

### Step 2: Governance Review
System Governance Agent validates:
- No doctrine conflicts
- Folder placement correct
- Schema compliance

### Step 3: ML1 Review
ML1 reviews package and:
- Approves → Roadmap moves to `01_ACTIVE_ROADMAPS/`
- Rejects → Feedback provided, stays in Draft
- Defers → Logged with timeline for re-review

### Step 4: Activation
If approved:
- Move roadmap to `01_ACTIVE_ROADMAPS/`
- Create Stage 1 folder
- Log promotion in DECISION_LOG.md

---

## Demotion Criteria (Active → Draft)

A roadmap may be demoted if:
- ML1 explicitly requests pause
- Blocking dependency discovered post-activation
- Scope change requires re-review

Demotion requires:
- ML1 approval
- Rationale documented
- Move back to `00_DRAFT_ROADMAPS/`

---

## Promotion Rules Summary

1. **ML1 is sole approver** for Draft → Active
2. **Evidence required** — no promotion without checklist
3. **Governance review** — System Governance validates before ML1
4. **Logged** — all promotions recorded in DECISION_LOG.md
5. **Reversible** — demotion possible with ML1 approval
