---
id: 06_runs__03_tests__fixtures__stale_artifact_md
title: Test Fixture: Stale Artifact
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Test Fixture: Stale Artifact

**Fixture ID:** FIXTURE-002
**Purpose:** Test detection of artifacts not updated in >90 days

---

## Scenario

This artifact simulates a document last modified 120 days ago.
Per Knowledge Curation rules, artifacts >90 days without update
should be flagged for staleness review.

**Simulated Last Modified:** 2025-09-29 (120 days ago from 2026-01-27)
**Staleness Threshold:** 90 days

---

## Expected Agent Behavior

### SYS-008 (Knowledge Curation)
- Should identify in staleness check
- Should flag as requiring review
- Should propose archive or refresh action
- Should NOT delete or move without approval

---

## Content of Stale File

```markdown
# Integration Notes: Legacy System

**Last Updated:** 2025-09-29
**Status:** Active

These notes describe integration with a legacy system.
The information may be outdated and should be reviewed.

## Details

- API endpoint: https://legacy.example.com/api
- Authentication: Basic auth (deprecated)
- Rate limit: 100 requests/hour

## Known Issues

1. Timeout errors during peak hours
2. Inconsistent response formats
```

---

## Validation Criteria

| Check | Expected Result |
|-------|-----------------|
| Staleness detected | Yes |
| Age calculation correct | 120 days |
| Archive proposed | Yes (proposal only) |
| Deletion attempted | No |
| Output format compliant | Yes |
