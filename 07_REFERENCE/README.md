---
id: 07_reference__readme_md
title: Reference Directory
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-10
tags: [reference]
---

# Reference Directory

## Purpose

This directory contains stable, authoritative reference material that the system consults but does not actively work on. Reference material supports decision-making, research, and governance but is not itself exploratory.

**Think of this directory as a library, not a workspace.**

---

## What Belongs Here

Reference materials have the following characteristics:

- Stable and low-churn
- Non-speculative
- Cited repeatedly across the system
- Treated as inputs to thinking, not outputs of thinking
- Often external in origin, sometimes internal but canonical

Examples include:

- Laws, regulations, and case material
- Vendor documentation snapshots
- Technical standards (e.g., OAuth, security frameworks)
- Canonical definitions and models
- Prior, finalized decisions that are still relied upon

---

## What Does NOT Belong Here

The following must never live in Reference:

- Drafts or working notes
- Opinions, hypotheses, or exploratory analysis
- Competing interpretations
- Summaries that have not been promoted deliberately
- Anything expected to change frequently

**If the content is still being figured out, it does not belong here.**

---

## Structural Expectations

All reference artifacts should:

- Clearly identify their source (external or internal)
- Include a date or version if applicable
- Avoid editorializing or speculative language
- Feel "read-only" in practice, even if not technically locked

External references should prefer snapshots over live links when feasible.

---

## Change Discipline

Changes to Reference material should be:

- Rare
- Intentional
- Reviewable

Promotion of material into Reference is a deliberate act, not cleanup. Most promotions require ML1 approval or an approved governance pathway.

---

## Agent Behavior

| Agent | Behavior |
|-------|----------|
| SMA-004 | May index and flag reference material but may not rewrite or reinterpret it as truth |
| SMA-005 | May check attribution, structure, and completeness |
| SMA-001 | Enforces stricter governance standards here than elsewhere |

---

## Quick Test

Ask:

> If this were wrong tomorrow, would anything break?

- **Yes** → it does not belong here
- **No** → it might belong here

**When in doubt, place the material in Research instead.**

---

## Naming + Metadata Standards

All reference notes in `07_REFERENCE/` must use:

**File naming pattern**
`YYYY-MM-DD__Topic__Descriptor__vX.Y.md`

Example:
`2026-02-09__Corporate-Law__Shareholder-Agreements_Checklist__v1.0.md`

Rules:
- Date = creation or last major revision date
- Use kebab-case inside segments if needed (e.g., `Corporate-Law`, `Minute-Book`)
- `v1.0+` = reference-grade

**Required YAML metadata (reference notes)**
```yaml
---
layer: 07_REFERENCE
domain: corporate-law
status: stable
owner: ML2
authority: ML1-approved
approved_by: "ML1"
approved_on: 2026-02-09
version: v1.0
scope: "ON - general"
supersedes: null
sources:
  - type: statute|rule|case|policy|memo
    citation: ""
---
```

---

## Folder-Level Convention

`07_REFERENCE` is stabilized, citable, and reusable.

Promotion from `08_RESEARCH` requires:
- `supersedes` if replacing an older 07 item
- A link back to the originating 08 artifact (path or ID) in the 07 header
- Updating the 08 artifact:
  - `status: promoted`
  - `promoted_to: <path or id>`

---

## Structure

```
07_REFERENCE/
├── EXTERNAL/
│   ├── vendors/         # Google, OpenAI, Claude docs
│   ├── standards/       # OAuth2, ISO, NIST
│   └── law/             # Statutes, regulations, cases
├── INTERNAL/
│   ├── definitions/     # Canonical terms
│   ├── canonical_models/# Stable models
│   └── prior_decisions/ # Historical decisions
└── INDEX.md
```
