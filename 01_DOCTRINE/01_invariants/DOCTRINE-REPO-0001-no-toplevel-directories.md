---
id: 01_doctrine__01_invariants__doctrine-repo-0001-no-toplevel-directories_md
title: Doctrine: Claude Code Must Not Create Top-Level Directories
owner: ML1
status: draft
version: 1.0
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Doctrine: Claude Code Must Not Create Top-Level Directories

**Status:** INVARIANT
**Doctrine ID:** DOCTRINE-REPO-0001
**Effective:** 2026-02-07
**Authority:** ML1
**Applies To:** Claude Code; any agent writing to the LL-Secondbrain repo

---

## 1. Rule

Claude Code MUST NOT create new **top-level directories** in the repository.

Top-level directories are those that appear at the repository root (same level as `00_SYSTEM`, `01_DOCTRINE`, etc.).

Claude Code MAY create, move, or modify files and subdirectories **only within existing top-level directories**.

---

## 2. Allowed Root Changes (Explicit Exceptions)

Claude Code MAY modify or create files at the repo root ONLY if they already exist or are explicitly authorized, including:

- `README.md`
- `LICENSE`
- `.gitignore`
- `.gitattributes` (if present)
- `.env.example` (if present)

Claude Code MUST NOT create new root-level folders such as:
- `05_MATTER_DOCKETING/`
- `TESTS/`
- `SPECS/`
- `outputs/`
- any folder containing spaces or display labels

---

## 3. Path Construction Constraint (Display Labels ≠ Paths)

Claude Code MUST NOT construct filesystem paths from display labels.

Specifically:
- Strings containing `" / "` MUST NOT be used as directory names.
- Slash (`/`) MUST be treated only as a path separator, never as literal folder text.
- Folder names at root MUST match canonical identifiers exactly.

---

## 4. Required Behavior When a New Root Folder Would Be Needed

If Claude Code believes a new top-level directory is required, it MUST:

1. STOP
2. Produce a short proposal stating:
   - intended folder name
   - why it is needed
   - where it fits in the repo taxonomy
3. Await ML1 instruction / approval

No directory creation occurs until approval is received.

---

## 5. Validation Check (Pre-Write Guard)

Before writing any files, Claude Code MUST:

- list the current repo root directories
- verify all target paths begin with an existing top-level directory name
- refuse any write that would add a new root directory

---

## 6. Examples

### Allowed
- Create: `04_INITIATIVES/LL_PORTFOLIO/05_MATTER_DOCKETING/SPECS/MATTER_TODO_REPORT.md`
- Move: `03_TESTS/...` → `06_RUNS/03_TESTS/...`

### Forbidden
- Create: `05_MATTER_DOCKETING/` at repo root
- Create: `05_MATTER_DOCKETING / SPECS` as a literal folder name
- Create any new root folder not already present

---

## 7. Rationale

The repository root is a controlled taxonomy.
Root drift breaks retrieval, indexing, and governance.
All new domains require ML1 approval.

---
