---
id: 06_runs__03_tests__fixtures__misplaced_artifact_md
title: Test Fixture: Misplaced Artifact
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Test Fixture: Misplaced Artifact

**Fixture ID:** FIXTURE-001
**Purpose:** Test detection of artifacts in wrong folders

---

## Scenario

This artifact simulates a document that should be in `01_DOCTRINE/01_invariants/`
but is instead placed in `04_INITIATIVES/`.

**Current Location:** `04_INITIATIVES/SOME_DOCTRINE_FILE.md` (simulated)
**Correct Location:** `01_DOCTRINE/01_invariants/`

---

## Expected Agent Behavior

### SYS-005 (System Governance)
- Should flag folder placement violation
- Should reference FOLDER_MAP.md
- Should recommend move to correct location

### SYS-008 (Knowledge Curation)
- Should identify as misplaced during INBOX triage
- Should propose correct placement
- Should not move without governance validation

---

## Content of Misplaced File

```markdown
# Binding Rule: Example Policy

**Status:** BINDING
**Authority:** ML1

This is a doctrine document that was incorrectly placed.
It contains binding rules that should be in 01_DOCTRINE/01_invariants/.
```

---

## Validation Criteria

| Check | Expected Result |
|-------|-----------------|
| Folder violation detected | Yes |
| Correct folder identified | `01_DOCTRINE/01_invariants/` |
| Escalation triggered | No (clear case) |
| Output format compliant | Yes |
