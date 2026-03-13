---
id: DOCTRINE-2026-001
title: What Qualifies as Doctrine
owner: ML1
status: approved
version: 1.0
created_date: 2026-01-04
last_updated: 2026-01-04
tags: [doctrine, authority, governance]

effective_date:
supersedes:

provenance:
  decided_by: ML1
  decided_on: 04/01/2026
  context: Defines what constitutes authoritative doctrine within the Second Brain system
---

# What Qualifies as Doctrine

**Document ID:** DOCTRINE-2026-001
**Status:** APPROVED
**Effective:** 2026-01-04
**Authority:** ML1

---

## Purpose

This doctrine defines what qualifies as **doctrine** within the Second Brain system.

Its purpose is to:
- Prevent authority creep
- Preserve ML1’s decisional supremacy
- Ensure that only explicitly approved materials are treated as authoritative

No artifact may be treated as doctrine unless it satisfies the criteria defined here.

---

## Definition of Doctrine

**Doctrine** is a written articulation of a rule, principle, standard, or policy that:

1. Expresses **normative guidance** (what should or must be done)
2. Is intended to apply **beyond a single instance or case**
3. Has been **explicitly approved by ML1**
4. Is recorded in the `/01_DOCTRINE` directory
5. Is marked with `status: approved` or `status: active`

Doctrine represents **binding authority** within the system.

---

## What Is Not Doctrine

The following are **not doctrine**, regardless of content quality or usage frequency:

- Research notes
- Personal opinions or reflections
- Drafts or exploratory writing
- Playbooks or SOPs
- Templates or forms
- Agent outputs
- AI-generated analyses
- Repeated practices that lack explicit approval

Usage does **not** create authority.  
Repetition does **not** create authority.  
Automation does **not** create authority.

Only explicit ML1 approval creates doctrine.

---

## Authority Model

- **ML1** is the sole authority empowered to approve doctrine.
- ML2 (the Second Brain system) records and enforces approved doctrine.
- LL and other execution environments may consume doctrine but may not create it.

No agent, workflow, or downstream system may:
- Invent doctrine
- Infer doctrine
- Promote content to doctrine implicitly

---

## Doctrine Lifecycle

All doctrine follows this lifecycle:

1. **Draft**  
   Proposed articulation; non-authoritative

2. **Approved / Active**  
   Explicitly approved by ML1; authoritative. `Active` denotes approved doctrine currently in force.

3. **Deprecated**  
   No longer authoritative; retained for audit history

Status must be explicitly set in YAML frontmatter.

---

## Relationship to Other Artifacts

- **Playbooks** implement doctrine but do not override it
- **Templates** operationalize doctrine but do not define it
- **Research** may inform doctrine but is not doctrine
- **Archives** preserve deprecated doctrine without deleting history

In case of conflict:
> **Doctrine always prevails.**

---

## Enforcement

Any artifact treated as authoritative **without meeting the criteria above** is invalid and must be corrected, reclassified, or removed from authoritative use.

This doctrine governs all future doctrine.
