---
id: 06_runs__03_tests__fixtures__pr_changeset__readme_md
title: Test Fixture: PR Changeset
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Test Fixture: PR Changeset

**Fixture ID:** FIXTURE-004
**Purpose:** Test governance review of a simulated PR

---

## Scenario

This directory simulates a PR that adds/modifies multiple files.
Used to test SYS-005 and SYS-009 compliance validation.

## Simulated Changes

| File | Action | Issue |
|------|--------|-------|
| `new_playbook.md` | Added | Missing frontmatter |
| `modified_runbook.md` | Modified | Valid change |
| `wrong_folder_doc.md` | Added | Wrong folder placement |

---

## Files

- `new_playbook.md` — New file missing required YAML frontmatter
- `modified_runbook.md` — Valid modification to existing runbook
- `wrong_folder_doc.md` — Doctrine-like content in wrong location
