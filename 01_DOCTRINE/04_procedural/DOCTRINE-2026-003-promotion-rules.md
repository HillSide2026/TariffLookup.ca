---
id: DOCTRINE-2026-003
title: Promotion Rules (Inbox → Research → Doctrine)
owner: ML1
status: approved
version: 1.0
effective_date: 2026-01-04
supersedes:
created_date: 2026-01-04
last_updated: 2026-02-14
tags: [promotion, workflow, governance]

provenance:
  decided_by: ML1
  decided_on: 2026-01-04
  context: Approved doctrine defining promotion lifecycle and preventing implicit authority
---

# Change Note
Moved from `01_DOCTRINE/01_invariants/` to `01_DOCTRINE/04_procedural/` on 2026-02-13 to reflect procedural (governance lifecycle) scope.

# Promotion Rules (Inbox → Research → Doctrine)

**Document ID:** DOCTRINE-2026-003
**Status:** APPROVED
**Effective:** 2026-01-04
**Authority:** ML1

---

## Purpose

This doctrine defines the **promotion lifecycle** of information within the Second Brain system.

Its purpose is to:
- Allow aggressive capture and exploration of ideas
- Prevent accidental or implicit creation of authority
- Ensure that doctrine is created **only through explicit approval**

Movement of information does **not** create authority.  
Only approval creates authority.

---

## Core Principle

> **Information may move freely. Authority may not.**

An artifact’s location, quality, reuse, frequency of reference, or automation does not grant it authority.

Authority is granted **only** when all of the following are true:
- The artifact qualifies as doctrine under DOCTRINE-2026-001
- The artifact is explicitly approved by ML1
- The artifact is marked `status: approved`
- The approval is recorded in the Decision Log

Absent these conditions, authority does not exist.

---

## The Three States

### 1. Inbox — Capture Only

**Purpose:** Prevent loss of ideas.

Inbox artifacts:
- Are raw, unprocessed inputs
- May be incomplete, speculative, or messy
- Have **no authority**
- Must not be relied upon by LL
- Must not be treated as guidance, instruction, or policy

Rules:
- Inbox artifacts are temporary
- Nothing may remain in the Inbox indefinitely
- Inbox items must be promoted, archived, or deleted

Inbox exists to hold ideas — not to develop them and not to authorize them.

---

### 2. Research — Exploration Without Authority

**Purpose:** Enable thinking, analysis, and investigation.

Research artifacts:
- May be thorough, well-written, and evidence-based
- May include AI-generated analysis or synthesis
- May inform future decisions
- Still have **no authority**

Rules:
- Research may not be cited as doctrine
- Research may not be treated as binding guidance
- Research does not become doctrine through quality, reuse, or repetition

High-quality analysis does not create authority.

---

### 3. Doctrine — Authority by Approval

**Purpose:** Establish binding rules, standards, and principles.

Promotion to doctrine requires:
- ML1 review
- Explicit approval
- Proper YAML frontmatter
- `status: approved`
- A Decision Log entry recording approval

No other pathway exists.

There is no automatic, implied, inferred, or accelerated promotion to doctrine.

---

## Prohibited Shortcuts

The following are explicitly prohibited:

- Treating research as “effectively doctrine”
- Inferring approval from silence or past usage
- Allowing AI or agents to promote artifacts
- Allowing LL to operationalize non-approved material
- Backdating or retroactively
