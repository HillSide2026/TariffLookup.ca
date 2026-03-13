---
id: 06_runs__03_tests__fixtures__readme_md
title: Test Fixtures
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Test Fixtures

This directory contains test fixtures for validating agent behavior.

## Contents

| Fixture | Purpose | Used By |
|---------|---------|---------|
| `misplaced_artifact.md` | Artifact in wrong folder | SYS-005, SYS-008 |
| `stale_artifact.md` | Artifact >90 days without update | SYS-008 |
| `conflicting_rules.md` | Rules that conflict with each other | SYS-005 |
| `pr_changeset/` | Simulated PR with multiple changes | SYS-005, SYS-009 |

## Usage

Agents should be invoked with these fixtures to validate:
1. Correct identification of issues
2. Standard output format compliance
3. Appropriate escalation behavior
