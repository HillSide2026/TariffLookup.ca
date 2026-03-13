---
id: 10_archive__initiatives__system_portfolio__stage3__stage3_1__stage3_1_failure_signals_md
title: Stage 3.1 — Failure Signals & Kill-Switch Protocol
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Stage 3.1 — Failure Signals & Kill-Switch Protocol

## Purpose

Define what failure looks like before it happens, and establish the mandatory response when failure signals appear.

---

## Primary Failure Signals

**Any of the following is an immediate red flag:**

| Signal | Description | Why It's Failure |
|--------|-------------|------------------|
| **"Just clean it up and send"** | You feel tempted to use output with minimal edits | System is drafting, not scaffolding |
| **Wanting an "approve" button** | You look for a way to accept the output | Approval semantics have leaked in |
| **Authorship confusion** | You forget whether you wrote something | Labeling has failed |
| **Trusting the phrasing** | You use system wording without rewriting | System is writing, not structuring |
| **Feeling slower** | Scaffolding increases friction instead of reducing it | Value proposition has inverted |

---

## Secondary Warning Signs

These are early indicators that may precede full failure:

| Warning Sign | What It Suggests |
|--------------|------------------|
| Skipping the rewrite step | Output feels "good enough" |
| Not reading the full output | Trusting without verification |
| Copying prose sections | Using language, not structure |
| Wanting to save outputs | Treating scaffolding as work product |
| Comparing outputs to drafts | Mental model has shifted |

---

## Failure Signal Detection

### Self-Check Questions

Before proceeding to Stage 3.2, ML1 should be able to answer "no" to all:

1. Do I feel tempted to send something with light edits?
2. Have I wished for an "approve" button?
3. Have I ever been unsure whether wording was mine?
4. Have I trusted system phrasing without rewriting?
5. Do I feel slower than before?

**If any answer is "yes" → Stage 3 expansion pauses.**

### Behavioral Indicators

Watch for these behaviors in practice:

| Behavior | Healthy | Unhealthy |
|----------|---------|-----------|
| Reading output | Scanning for structure | Reading for content |
| Using output | Extracting ideas | Copying phrases |
| Rewriting | Always | Sometimes/never |
| Discarding | Often | Rarely |
| Feeling | "This helps me think" | "This is almost done" |

---

## Kill-Switch Protocol

When failure signals appear, this protocol is mandatory:

### Step 1: Immediate Pause

- Stop all Stage 3 development
- No new agents are introduced
- No scope is widened
- Current capabilities are frozen

### Step 2: Identification

Document:
- Which failure signal appeared
- When it appeared
- What triggered it
- How obvious it was

### Step 3: Root Cause Analysis

Determine:
- Is this a labeling failure?
- Is this an interaction model failure?
- Is this a separation failure?
- Is this a psychological drift?

### Step 4: Remediation

Based on root cause:
- **Labeling failure** → Strengthen visual treatment
- **Interaction failure** → Remove affordances
- **Separation failure** → Audit object boundaries
- **Psychological drift** → Increase friction intentionally

### Step 5: Verification

Before resuming:
- Confirm the fix addresses root cause
- Test with fresh examples
- Verify all self-check questions return "no"

### Step 6: Resume or Revert

- If fixed → Resume from pause point
- If unfixable → Revert to previous sub-stage

---

## Escalation Path

| Severity | Response |
|----------|----------|
| Single warning sign | Note and monitor |
| Primary failure signal | Immediate pause |
| Multiple failures | Revert to 3.1 foundation |
| Systemic failure | Reassess Stage 3 viability |

---

## Cultural Requirement

**The kill-switch must be acceptable before it's needed.**

This means:
- Pausing is not failure — ignoring signals is failure
- Reverting is not embarrassing — it's prudent
- Slowing down is not inefficient — it's safe

If there is pressure to "push through" failure signals, the culture has failed before the system has.

---

## Documentation Requirements

When a failure signal is triggered, document:

```markdown
## FAIL-YYYYMMDD-NNN: [Brief Description]

**Signal Type:** [Primary / Secondary]
**Detected:** [timestamp]
**Trigger:** [what caused it]

### Description
[What happened]

### Root Cause
[Why it happened]

### Remediation
[What was done]

### Verification
[How fix was verified]

### Status
- [ ] Detected
- [ ] Paused
- [ ] Analyzed
- [ ] Remediated
- [ ] Verified
- [ ] Resumed
```

---

## Governance

- Failure signals are not negotiable
- Kill-switch is not optional
- Cultural acceptance is a prerequisite
- Documentation is mandatory
