---
id: 02_playbooks__execution__failure_modes_md
title: Trust, Audit, and Failure Modes — Stage 2.6
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Trust, Audit, and Failure Modes — Stage 2.6

## Purpose

Ensure the system is **boring under stress**.

---

## Core Failure Behaviors

| Condition | Required Behavior |
|-----------|-------------------|
| If uncertain | Propose, don't act |
| If conflicted | Surface ambiguity explicitly |
| If broken | Stop queue growth, not approvals |

---

## Audit Guarantees

At any point, ML1 must be able to answer:

| Question | Where to Find Answer |
|----------|---------------------|
| What did the system suggest? | `queue/pending/` + manifest |
| What did I approve? | `queue/approved/` + `queue/executed/` |
| What changed as a result? | `execution_log.md` + `decision_log.ndjson` |
| What rule caused this suggestion? | Proposal `reasoning_trace` field |

---

## Red Flags Checklist

During any review session, watch for:

### Trust Erosion Signals

- [ ] ML1 hesitates because they "don't fully get" a proposal
- [ ] ML1 approves without reading (rubber-stamping)
- [ ] ML1 feels the need to spot-check external systems
- [ ] Decisions feel rushed or coerced
- [ ] "I'm not sure what that will do"
- [ ] Batches feel too large to review properly
- [ ] Rejections require extensive investigation

### System Health Signals

- [ ] Queue grows faster than review capacity
- [ ] Same classification errors repeat
- [ ] Manifest doesn't match directory contents
- [ ] Decision log has gaps or inconsistencies
- [ ] Proposals reference non-existent sources

**If ANY red flag appears → Stage pauses for review.**

---

## Pause Criteria

The system should pause (stop generating new proposals) when:

1. **Trust threshold breached** — 3+ red flags in one session
2. **Error rate spike** — >20% rejections in a batch
3. **Audit failure** — Manifest/log inconsistency detected
4. **ML1 request** — "Stop" at any time
5. **Execution failure** — Any action fails unexpectedly

### Pause Procedure

1. Stop proposal generation
2. Log pause reason
3. Preserve queue state
4. Notify ML1
5. Await ML1 decision to resume or investigate

---

## Recovery Procedures

### After Trust Issue

1. Review recent approvals (last batch)
2. Identify pattern that caused concern
3. Document in calibration log
4. Adjust proposal generation if needed
5. Resume with smaller batch size

### After System Error

1. Check manifest consistency
2. Verify log integrity
3. Identify root cause
4. Fix issue
5. Resume with verification batch

### After Execution Failure

1. Document failure
2. Attempt rollback if possible
3. Investigate cause
4. Update action taxonomy if needed
5. Resume with manual verification

---

## Inspection Commands

```bash
# Verify manifest matches directories
ls queue/pending/ | wc -l
cat manifests/queue_manifest.json | jq '.summary.total_pending'

# Check for orphaned proposals
diff <(ls queue/pending/) <(cat manifests/queue_manifest.json | jq -r '.proposals[] | select(.status=="pending") | .id')

# View recent decisions
tail -20 logs/decision_log.ndjson | jq '.'

# Check for execution failures
grep '"result":"failure"' logs/decision_log.ndjson
```

---

## Trust Verification Questions

Before closing Stage 2.6, ML1 should be able to say "yes" to all:

- [ ] I understand how proposals are generated
- [ ] I can review a batch without feeling overwhelmed
- [ ] Rejections feel cheap, not frustrating
- [ ] I know where to look if something goes wrong
- [ ] The system has never surprised me in a bad way
- [ ] I would notice if something "slipped through"

---

## Escalation Path

| Severity | Action |
|----------|--------|
| Minor concern | Note in calibration log, continue |
| Moderate issue | Pause, investigate, resume when resolved |
| Major failure | Stage 2.6 suspended, full review required |
| Trust breach | Rollback to Stage 2.5, reassess approach |

---

## Documentation Requirements

Every issue must be documented:

```markdown
## ISSUE-YYYYMMDD-NNN: [Brief Title]

**Severity:** Minor / Moderate / Major
**Detected:** [timestamp]
**Detected By:** ML1 / System / Audit

### Description
[What happened]

### Impact
[What was affected]

### Resolution
[How it was fixed]

### Prevention
[What changes to prevent recurrence]

### Status
- [ ] Detected
- [ ] Investigated
- [ ] Resolved
- [ ] Prevention implemented
```
