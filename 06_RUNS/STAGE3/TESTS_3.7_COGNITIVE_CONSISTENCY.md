---
id: 06_runs__stage3__tests_3_7_cognitive_consistency_md
title: Stage 3.7 Cognitive Consistency Tests
owner: ML1
status: draft
created_date: 2026-02-11
last_updated: 2026-02-11
tags: [stage3, test, consistency]
---

# Stage 3.7 — Cognitive Consistency Tests

## Summary
- TEST-CC1: PASS
- TEST-CC2: PASS
- TEST-CC3: PASS

---

## TEST-CC1
**Input:** Mixed doctrine references in a single packet

**Expected Output:**
- Flags contradictions only
- Provides file/line references
- No recommendations

**Output:**
- `06_RUNS/STAGE3/CONSISTENCY_FLAGS_2026-02-11.md`

**Result:** PASS

---

## TEST-CC2
**Input:** Outdated template referenced

**Expected Output:**
- Flags outdated reference only
- Provides file/line references
- No recommendations

**Output:**
- `06_RUNS/STAGE3/CONSISTENCY_FLAGS_2026-02-11.md`

**Result:** PASS

---

## TEST-CC3
**Input:** Inconsistent framing across outputs

**Expected Output:**
- Flags inconsistency only
- Provides file/line references
- No recommendations

**Output:**
- `06_RUNS/STAGE3/CONSISTENCY_FLAGS_2026-02-11.md`

**Result:** PASS
