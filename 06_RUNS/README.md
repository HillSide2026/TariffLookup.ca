---
id: 06_runs__readme_md
title: Runs
owner: ML1
status: draft
created_date: 2026-01-25
last_updated: 2026-01-25
tags: []
---

# Runs

## Purpose
Concrete execution instances of playbooks, templates, or initiative stages.
Runs are ephemeral or repeatable and always linked to a parent context.

## Linkage Rules
- Every run must reference its parent: a **Matter**, **Initiative**, or **Stage**
- Runs do not create doctrine or modify system governance
- Run outputs may be promoted to other folders through standard review

## Naming Convention
```
RUN-{YYYY-MM-DD}-{parent-ref}-{short-description}/
```

Example:
```
RUN-2026-01-25-STAGE3-auth-kickoff/
```

## Folder Structure
Each run folder should contain:
- `RUN_LOG.md` — execution log and outcomes
- Supporting artifacts as needed

## Stage Linkage
Runs that execute initiative stages should:
1. Reference the stage in the run name (e.g., `STAGE3`)
2. Link back to the stage folder in `04_INITIATIVES/.../01_ACTIVE_ROADMAPS/`
3. Record stage DoD completion evidence in the run log
