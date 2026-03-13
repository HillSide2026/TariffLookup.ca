---
id: 10_archive__initiatives__system_portfolio__stage3__stage3_1__stage3_1_labeling_schema_md
title: Stage 3.1 — Artifact Labeling Schema
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Stage 3.1 — Artifact Labeling Schema

## Purpose

Ensure every system-generated artifact is unmistakably "other" — psychologically and visually distinct from ML1-authored content.

---

## Label Prefixes (Required)

Every Stage 3 artifact MUST begin with one of these prefixes:

| Artifact Type | Required Prefix |
|---------------|-----------------|
| Outline | `[System-generated outline]` |
| Structure | `[System-generated structure]` |
| Coverage list | `[System-generated coverage list]` |
| Summary | `[System-generated summary]` |
| Brainstorm | `[System-generated brainstorm]` |
| Issue list | `[System-generated issue list]` |
| Framing options | `[System-generated framing options]` |

---

## Label Format

```
[System-generated {type}]

{content}

---
Origin: ML2 scaffolding | Not ML1-authored | Use/Ignore/Delete only
```

---

## Visual Treatment

### In Markdown/Text Outputs

```markdown
> **[System-generated outline]**
>
> - Header 1: [INSERT: your summary of X]
> - Header 2: [INSERT: your position on Y]
> - Header 3: [INSERT: next steps you decide]
>
> ---
> *Origin: ML2 scaffolding | Not ML1-authored | Use/Ignore/Delete only*
```

### Key Visual Markers

1. **Blockquote container** — Visually set apart from normal text
2. **Bold prefix** — Impossible to miss
3. **Placeholder markers** — `[INSERT: ...]` makes incompleteness obvious
4. **Footer origin line** — Reinforces non-authorship even when scrolling

---

## Placeholder Syntax

All Stage 3 content that requires ML1 judgment uses explicit placeholders:

| Placeholder | Meaning |
|-------------|---------|
| `[INSERT: ...]` | ML1 must write this |
| `[DECIDE: ...]` | ML1 must choose this |
| `[JUDGMENT: ...]` | ML1's professional opinion needed |
| `[YOUR POSITION: ...]` | ML1's stance required |

**No placeholder may be auto-filled.** The system cannot complete these.

---

## Anti-Patterns (Violations)

These are labeling failures:

| Violation | Why It's Wrong |
|-----------|----------------|
| Label in metadata only | Not visible when copying |
| Small/subtle label | Easy to overlook |
| Label at end only | Skipped when reading |
| No placeholders | Feels complete when it isn't |
| Prose instead of structure | Tempts verbatim use |

---

## Copy/Paste Test

**The test for correct labeling:**

If ML1 copies content from a Stage 3 artifact into another document, the origin MUST still be obvious.

Options to satisfy this:
1. Prefix is part of the copied text
2. Placeholder markers remain visible
3. Visual treatment (blockquote) transfers

If you can paste and the origin disappears, labeling has failed.

---

## Example: Email Outline

```markdown
> **[System-generated outline]**
>
> **Subject:** [INSERT: your subject line]
>
> **Opening:**
> - [INSERT: greeting appropriate to relationship]
> - [INSERT: acknowledge context/situation]
>
> **Core Message:**
> - [INSERT: the main point you want to make]
> - [INSERT: supporting reason 1]
> - [INSERT: supporting reason 2 if needed]
>
> **Ask/Next Step:**
> - [INSERT: what you want them to do]
> - [INSERT: timeline if relevant]
>
> **Closing:**
> - [INSERT: your sign-off]
>
> ---
> *Origin: ML2 scaffolding | Not ML1-authored | Use/Ignore/Delete only*
```

---

## Example: Coverage List

```markdown
> **[System-generated coverage list]**
>
> **Points to consider covering:**
> - [ ] [Topic A] — [why it might matter]
> - [ ] [Topic B] — [why it might matter]
> - [ ] [Topic C] — [why it might matter]
>
> **Questions the recipient might have:**
> - [ ] [Question 1]
> - [ ] [Question 2]
>
> **Potential misunderstandings to preempt:**
> - [ ] [Misunderstanding 1]
>
> *No prioritization applied. All items optional.*
>
> ---
> *Origin: ML2 scaffolding | Not ML1-authored | Use/Ignore/Delete only*
```

---

## Example: Summary

```markdown
> **[System-generated summary]**
>
> **Source:** [thread/document name]
> **Scope:** [what this covers]
>
> **Key points (source-bound):**
> - [Point 1 — from message X]
> - [Point 2 — from message Y]
> - [Point 3 — from document Z]
>
> **Open items mentioned:**
> - [Item 1]
> - [Item 2]
>
> *No inference or synthesis. Reconstructable from source.*
>
> ---
> *Origin: ML2 scaffolding | Not ML1-authored | Use/Ignore/Delete only*
```

---

## Governance

- Labels are not optional
- Labels cannot be turned off
- Absence of label = system bug
- Any "clean" output is a Stage 3.1 violation
