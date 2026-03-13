---
id: STAGE2.13-ACTION-PLAN

title: Stage 2.13 — Gmail Matter Labeling (Backlog)
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: [stage2, roadmap, gmail, labeling, writeback]
---

# Stage 2.13 — Gmail Matter Labeling (Backlog)

## Status

- **Status:** 🟨 BACKLOG
- **Owner:** UNASSIGNED
- **Effective Start:** TBD (after Stage 2.2 + Stage 2.11)
- **Closed:** —
- **Authority Gate:** Requires ML1 approval for Gmail write-back + audit controls

---

## Stage 2.13 Core Question

> Can the system apply matter-number labels to Gmail messages without violating write-back boundaries or mislabeling client communications?

**Stage 2.13 succeeds if matter-number labeling is accurate, auditable, and strictly bounded to approved write actions.**

---

## 1. Scope Definition

### In-Scope

| Activity | Purpose |
|----------|---------|
| Define Gmail labeling policy (matter-number labels) | Ensure deterministic, approved behavior |
| Implement Gmail write-back (labels only) | Apply matter labels to messages |
| Audit logging for label writes | Traceability + rollback |
| Boundary tests (allowed/denied) | Validate no unintended writes |

### Out-of-Scope

| Element | Why Excluded |
|---------|--------------|
| Moving or deleting messages | Beyond labeling scope |
| Editing message content | Not authorized |
| Automatic labeling without approval gate | Requires explicit ML1 approval |

---

## 2. Implementation Notes (Normative Constraints)

1. Only **label add/remove** operations are permitted.
2. Labels must follow the schema: `LL/1./<delivery_status>/<matter_id>` (e.g., `LL/1./1.1 - Essential/25-927-00003`).
3. Labeling must be based on deterministic attribution rules (no LLM inference).
4. Every label write must be logged with message_id, label, timestamp, and reason.
5. A human approval gate is required per run until ML1 authorizes automation.
6. **Matter attribution confidence standard:** Option B — attribution is permitted only when the message is deterministically associated to a matter via an approved structured source (e.g., pre-approved mapping table, prior authoritative linkage). Free-text inference is prohibited.
7. **Label lifecycle:** labels are created on demand at first authorized use. Label deletion is prohibited; labels may only be added to or removed from messages.

---

## Labeling Change (Approved)

We made a structural simplification to the Gmail label hierarchy to improve readability, durability, and governance, without changing attribution logic.

### What Changed

**Before**
```
LL
 └─ 1. Delivery
```

**Now**
```
LL
 └─ 1.
```

The descriptive text “Delivery” was removed from the container label and replaced with a semantic-free numeric container (1.).

At the same time, leaf labels were shortened to contain only the matter identifier (e.g., 25-927), instead of descriptive text.

### Why This Change Was Made

- **Separation of structure from meaning**  
  Container labels are now purely structural. Business meaning lives one level down, in `<delivery_status>` labels such as:
  - 1.1 - Essential
  - 1.2 - Strategic
  - 1.3 - Standard
  - 1.4 - Parked

- **Reduced write-back churn**  
  Descriptive container text (“Delivery”) is prone to cosmetic renames. Making the container numeric prevents future renames from forcing mass Gmail write-backs and audit noise.

- **Improved durability and audit safety**  
  Numeric, opaque containers are more stable over time and less likely to change for non-functional reasons.

- **Improved readability at the leaf level**  
  Leaf labels now show only the matter ID, which is the actual identifier humans and systems care about.

### What Did NOT Change

The authoritative schema is still:
`LL / 1. / <delivery_status> / <matter_id>`

`<matter_id>` remains the only canonical identifier used for:
- Matter attribution
- Audit logging
- Write-back eligibility

`<delivery_status>` remains presentation-only.

No inference, automation, or attribution logic changed.

All existing governance, approval, and audit rules still apply.

### Important Governance Note

Because Gmail labels are strings:

Any change to label text (including renaming containers or renumbering statuses) is a real write-back, not cosmetic.

This change was intentional, limited, and performed once to reduce future write-backs.

---

## Audit Log

All Gmail label write operations MUST emit an immutable audit record.

**Canonical Store:** ML2-controlled, local-first append-only log (Git-versioned).

**Required Fields:**

* message_id
* gmail_thread_id
* label_applied_or_removed
* matter_id
* operation (add | remove)
* timestamp (UTC, ISO-8601)
* approving_human (identifier)
* approval_artifact_reference
* reason

**Retention:** Indefinite unless superseded by ML1 directive.

**Access Control:** Readable by ML1; LL has no mutation rights.

---

## Human Approval Gate — Mechanism

Until explicitly automated by ML1, every labeling run requires affirmative human authorization.

**Approval Model:** Per-run batch approval.

**Mechanism:**

1. System produces a proposed action manifest (message_ids + labels).
2. Human reviewer (ML1 or delegate) signs approval via an explicit approval artifact (e.g., signed checklist file or CLI approval flag).
3. Approval artifact reference is written into the audit log for every label operation in the batch.
4. Absence of valid approval artifact hard-blocks execution.

---

## 3. Deliverables

- Gmail labeling policy + label naming conventions
- Approved label set and creation plan
- Implementation of label write-back (labels only)
- Audit logging format for label writes
- Minimal verification test (apply + remove label)

---

## 4. Acceptance Criteria

- Labels applied only when matter attribution confidence is sufficient
- No message content changes or moves
- Audit logs produced for every label write
- SMA-001 governance validation passes

---

## 5. Execution Tracking (Backlog)

### Phase 1: Policy + Boundaries (Planned)
| Item | Status | Notes |
|------|--------|-------|
| Define labeling policy | ✅ done | 2026-02-09 — ML1 approved |
| Define label naming convention | ✅ done | 2026-02-09 — schema approved |
| Confirm deterministic attribution sources (Option B only) | ✅ done | 2026-02-09 — ML1 approved |

### Phase 2: Implementation (Planned)
| Item | Status | Notes |
|------|--------|-------|
| Implement label write-back | ✅ done | 2026-02-09 — Gmail API labels only |
| Add audit logging | ✅ done | 2026-02-09 — Required for every write |
| Wire labeler into Matter Dashboard flow (optional) | ✅ done | 2026-02-09 — manifest + optional execute |
| Enforce label schema + attribution confidence | ✅ done | 2026-02-09 — checks in labeler + manifest build |

### Phase 3: Verification (Planned)
| Item | Status | Notes |
|------|--------|-------|
| Apply label to approved message | ⬜ | Must pass |
| Remove label (rollback) | ⬜ | Must pass |

---

## 6. Risks & Controls

| Risk | Likelihood | Impact | Control |
|------|------------|--------|---------|
| Mislabeling emails | Medium | High | Deterministic rules + approval gate |
| Unauthorized writes | Medium | High | Boundary enforcement + SMA-001 review |

---

## References

- Stage 2.2 Action Plan: `STAGE2.2/STAGE2.2_ACTION_PLAN.md`
- Stage 2.11 Action Plan: `STAGE2.11/STAGE2.11_ACTION_PLAN.md`
- Write-Back Policy: `01_DOCTRINE/02_policies/WRITE_BACK_POLICY.md`
