---
id: 10_archive__initiatives__system_portfolio__stage3__stage3_1__stage3_1_stage_separation_md
title: Stage 3.1 — Stage 2.x / Stage 3 Separation Rules
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Stage 3.1 — Stage 2.x / Stage 3 Separation Rules

## Purpose

Establish a hard boundary between "things to decide" (Stage 2) and "things to think with" (Stage 3). No object may belong to both.

---

## The Core Rule

> **No object may belong to both Stage 2 and Stage 3.**

This is not a conceptual distinction. It is an architectural boundary.

---

## Stage 2.x Characteristics

| Property | Stage 2.x Behavior |
|----------|-------------------|
| Purpose | Operational proposals |
| Lifecycle | Pending → Approved/Rejected → Executed |
| Authority | Can cause action |
| Persistence | Permanent record |
| Identity | Has ID (e.g., PROPOSAL-001) |
| Review | Requires decision |
| Outcome | Execution or rejection |

**Stage 2 objects are work items.**

---

## Stage 3 Characteristics

| Property | Stage 3 Behavior |
|----------|-----------------|
| Purpose | Cognitive scaffolding |
| Lifecycle | Generated → Used/Ignored/Deleted |
| Authority | Cannot cause action |
| Persistence | Ephemeral by default |
| Identity | No persistent ID |
| Review | No review required |
| Outcome | Thinking, not execution |

**Stage 3 objects are thinking aids.**

---

## Prohibited Crossings

### Stage 3 → Stage 2 (Forbidden)

A Stage 3 artifact CANNOT:
- Become a proposal
- Enter a queue
- Get a Stage 2 ID
- Trigger a review
- Cause execution

**If a Stage 3 artifact needs to become a Stage 2 proposal:**
ML1 must manually create a new Stage 2 object.
The Stage 3 artifact does not "promote" — it is discarded.

### Stage 2 → Stage 3 (Forbidden)

A Stage 2 object CANNOT:
- Lose its proposal status
- Become "just a draft"
- Avoid review
- Skip the approval path

**Stage 2 objects cannot demote to Stage 3.**

---

## Object Type Separation

| Object Type | Stage | Can Cross? |
|-------------|-------|------------|
| Proposal | Stage 2 | No |
| Batch | Stage 2 | No |
| Classification | Stage 2 | No |
| Execution log | Stage 2 | No |
| Outline | Stage 3 | No |
| Coverage list | Stage 3 | No |
| Summary | Stage 3 | No |
| Brainstorm | Stage 3 | No |

**No shared object types.**

---

## System Separation

### Stage 2 Systems

- `06_RUNS/EXECUTION/` — Execution records
- `06_RUNS/EXECUTION/batches/` — Batch worksheets
- `06_RUNS/EXECUTION/proposals/` — Individual proposals
- `manifests/` — Queue state
- `logs/decision_log.ndjson` — Approval records

### Stage 3 Systems

- No persistent location by default
- If saved: `06_RUNS/SCAFFOLDING/` (reference only)
- No manifest
- No decision log
- No queue

**These paths do not intersect.**

---

## Queue Isolation

### Stage 2 Queues

- `queue/pending/`
- `queue/approved/`
- `queue/rejected/`
- `queue/deferred/`
- `queue/executed/`

### Stage 3 Queues

**None.**

Stage 3 has no queue. If it has a queue, it has become Stage 2.

---

## ID Schemes

### Stage 2 IDs

- `PROPOSAL-001`
- `BATCH-20260130-001`
- `19c0d87538b6f0d7` (message IDs)

### Stage 3 IDs

**None by default.**

If tracking is needed:
- Use session-scoped, ephemeral identifiers
- Never use persistent IDs
- IDs do not survive session end

---

## Decision Flow Comparison

### Stage 2 Flow

```
Generate proposal
    ↓
Queue for review
    ↓
ML1 reviews
    ↓
Approve / Reject / Defer
    ↓
Execute (if approved)
    ↓
Log decision
```

### Stage 3 Flow

```
Generate scaffolding
    ↓
ML1 sees it
    ↓
Use / Ignore / Delete
    ↓
(nothing else happens)
```

**No overlap.**

---

## Test: Is This Properly Separated?

| Question | Required Answer |
|----------|-----------------|
| Does the Stage 3 artifact have a queue location? | No |
| Does the Stage 3 artifact have a persistent ID? | No |
| Can the Stage 3 artifact trigger execution? | No |
| Does the Stage 3 artifact require a decision? | No |
| Is the Stage 3 artifact logged in decision_log? | No |

If any answer is wrong, separation has failed.

---

## Failure Recovery

If an object crosses the boundary:

1. **Identify** the crossing
2. **Remove** the object from the wrong stage
3. **Audit** how the crossing occurred
4. **Fix** the design flaw that allowed it
5. **Verify** no other crossings exist

---

## Governance

- Separation is enforced architecturally, not by convention
- No "shared" object types are permitted
- Any proposed crossing requires explicit Stage 3.1 exception review
- Exceptions should be extremely rare and well-documented
