---
id: 02_playbooks__execution__review_ritual_md
title: Review Ritual — Stage 2.6
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Review Ritual — Stage 2.6

## Purpose

Define how ML1 conducts batch reviews to maximize trust and control.

---

## Core Principle

> Review is a **pull activity**, not a push.
> ML1 chooses when to review. The system never pressures.

---

## Review Cadence Options

ML1 selects their preferred cadence:

| Cadence | Description | Best For |
|---------|-------------|----------|
| Daily | 15-30 min morning review | High volume, routine items |
| Twice Weekly | Mon/Thu review sessions | Moderate volume |
| Weekly | Friday review session | Low volume, less urgent |
| Ad-hoc | "When I feel like it" | Variable workload |

**System behavior:** Generate batches on demand, never auto-notify.

---

## Review Session Structure

### Pre-Review (2 min)

1. Check queue manifest summary
2. Note total pending count
3. Decide batch size for this session

### Review Phase (10-30 min)

1. Open batch worksheet
2. Work through groups in order:
   - High confidence first (quick decisions)
   - Medium confidence second
   - Low confidence last (deliberate review)
3. For each proposal:
   - Scan subject/sender
   - Check classification
   - Mark decision (A/R/D)
   - Add note if rejecting
4. Complete batch sign-off

### Post-Review (2 min)

1. Submit batch decisions
2. Verify manifest updated
3. Note any calibration insights

---

## Decision Heuristics

### When to Approve (A)

- Classification matches your expectation
- Action is low-risk and reversible
- You would do this manually anyway

### When to Reject (R)

- Classification is wrong
- Action doesn't make sense
- Something feels off (trust your gut)

### When to Defer (D)

- Need more context
- Uncertain but not wrong
- Want to see similar items first

---

## Quality Signals

**Good review session:**
- Decisions feel clear
- Rejections have obvious reasons
- No "what did I just approve?" moments

**Warning signs:**
- Rushed feeling
- Many defers (need better proposals)
- Approving without reading (batch too large)

---

## Calibration Moments

During review, note patterns:
- "These soulpepper.com emails are always inquiries"
- "This sender is always noise"
- "This subject pattern means X"

These become calibration proposals for the classifier.

---

## Exit Criteria

Review session is complete when:
- All proposals in batch have decisions
- Batch worksheet is signed
- Manifest reflects new state
- Any calibration insights noted
