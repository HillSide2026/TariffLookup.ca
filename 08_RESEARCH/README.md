---
id: 08_research__readme_md
title: Research Directory
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-10
tags: [research]
---

# Research Directory

## Purpose

This directory contains active thinking material. Research exists to explore, test, compare, and synthesize ideas that may later inform decisions, doctrine, or reference material.

**Think of this directory as a workspace or lab, not a record of truth.**

---

## What Belongs Here

Research materials typically:

- Are in progress or exploratory
- Contain opinions, hypotheses, or tentative conclusions
- May be partially wrong or later abandoned
- Change frequently
- Exist to reduce uncertainty

Examples include:

- Integration analyses and tradeoffs
- Draft interpretations
- Comparative evaluations
- Working memos and notes
- Early summaries of external material

---

## What Does NOT Belong Here

The following should not remain in Research indefinitely:

- Stabilized, repeatedly cited material
- Canonical definitions
- Finalized decisions meant to be relied upon as truth

Such material should be promoted deliberately or archived.

---

## Structure and Lifecycle

Research is expected to move through stages:

1. **Active** — ongoing thinking and exploration
2. **Synthesis** — structured findings or recommendations
3. **Promotion** — deliberate elevation elsewhere (doctrine, reference, etc.)
4. **Archive** — completed or abandoned work

**Not all research is promoted. Archiving is a valid outcome.**

---

## Promotion Rules

Promotion out of Research:

- Is explicit, not implicit
- Usually involves rewriting, not moving files
- Requires clarity on sources and assumptions
- Often requires ML1 approval depending on destination

**Research content should never be treated as authoritative until promoted.**

---

## Naming + Metadata Standards

All research notes in `08_RESEARCH/` must use:

**File naming pattern**
`YYYY-MM-DD__Topic__Descriptor__vX.Y.md`

Example:
`2026-02-09__Corporate-Law__Shareholder-Agreements_Issues-List__v0.1.md`

Rules:
- Date = creation or last major revision date
- Use kebab-case inside segments if needed (e.g., `Corporate-Law`, `Minute-Book`)
- `v0.x` = research/draft; promotion to `v1.0+` typically moves to `07_REFERENCE`

**Required YAML metadata (research notes)**
```yaml
---
layer: 08_RESEARCH
domain: corporate-law
status: draft
owner: ML2
authority: not-approved
confidence: exploratory
created: 2026-02-09
updated: 2026-02-09
scope: "ON - general"
matter_id: null
sources:
  - type: url|pdf|book|case|statute
    citation: ""
open_questions:
  - ""
next_actions:
  - ""
---
```

---

## Folder-Level Convention

`08_RESEARCH` is exploratory, provisional, and evolving.

Corporate law research must live under:
`08_RESEARCH/Corporate Law/`

---

## Agent Behavior

| Agent | Behavior |
|-------|----------|
| SMA-004 | May organize, summarize, and propose synthesis of research |
| SMA-005 | May check clarity and internal consistency |
| SMA-001 | Generally hands-off unless governance rules are implicated |

**Agents must clearly label outputs derived from Research as non-canonical.**

---

## Structure

```
08_RESEARCH/
├── Corporate Law/        # Corporate law research (Ontario)
├── ACTIVE/
│   ├── integrations/    # Integration research
│   ├── agents/          # Agent design research
│   ├── governance/      # Governance research
│   └── tooling/         # Tooling research
├── EXPERIMENTS/
│   ├── abandoned/       # Dead ends (kept for record)
│   └── spikes/          # Quick explorations
├── SYNTHESIS/
│   ├── findings/        # Consolidated findings
│   ├── comparisons/     # Pros/cons analyses
│   └── recommendations/ # Recommendations (not decisions)
└── ARCHIVE/             # Completed research
```
