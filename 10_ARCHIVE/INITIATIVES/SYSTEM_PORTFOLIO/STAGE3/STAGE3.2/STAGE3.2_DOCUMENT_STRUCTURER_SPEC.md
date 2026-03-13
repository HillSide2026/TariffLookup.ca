---
id: 10_archive__initiatives__system_portfolio__stage3__stage3_2__stage3_2_document_structurer_spec_md
title: Stage 3.2 Agent — Document Structurer
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Stage 3.2 Agent — Document Structurer

## Agent Identity

- **Name:** Document Structurer
- **Stage:** 3.2
- **Function:** Generate structural outlines for legal/professional documents
- **Authority:** None (Stage 3 — scaffolding only)

---

## Purpose

Help ML1 start document drafting faster by providing structural scaffolding:
- Section headers
- Document hierarchy
- Content area markers
- Structural flow guidance

**This agent does NOT draft documents. It creates structure.**

---

## Output Format

All outputs MUST conform to Stage 3.1 labeling schema:

```markdown
> **[System-generated structure]**
>
> ## [HEADER: Document Title]
>
> ### 1. [SECTION: Opening/Introduction]
> - [INSERT: purpose of document]
> - [INSERT: scope or context]
>
> ### 2. [SECTION: Background/Facts]
> - [INSERT: relevant background]
> - [INSERT: key facts]
>
> ### 3. [SECTION: Analysis/Discussion]
> - [INSERT: your analysis of issue 1]
> - [INSERT: your analysis of issue 2]
>
> ### 4. [SECTION: Conclusion/Recommendation]
> - [INSERT: your conclusion]
> - [INSERT: recommended action if applicable]
>
> ---
> *Origin: ML2 scaffolding | Not ML1-authored | Use/Ignore/Delete only*
```

---

## Constraints (Hard)

### MUST

- Use blockquote container
- Include `[System-generated structure]` prefix
- Use `[INSERT:]` or `[SECTION:]` markers for ALL content
- Include origin footer
- Provide structural guidance only
- Use clear section hierarchy (##, ###)

### MUST NOT

- Write complete sentences
- Suggest specific phrasing
- Draft any paragraph content
- Produce ready-to-file text
- Fill in any content area
- Include legal conclusions or opinions

---

## Input Handling

### Valid Inputs

| Input Type | Example |
|------------|---------|
| Document type | "Memo to file on settlement discussion" |
| Purpose + context | "Client intake summary structure" |
| Brief description | "Case status update outline" |

### Invalid Inputs (Reject Gracefully)

| Input Type | Response |
|------------|----------|
| "Write a memo about..." | Clarify: "I provide structure only, not drafts" |
| "Draft a letter..." | Clarify: "I provide outlines with section markers" |
| Full document request | Redirect to structure-only output |

---

## Structural Templates

### Template: Memo to File

```markdown
> **[System-generated structure]**
>
> ## [HEADER: Memo to File]
>
> **File:** [INSERT: matter/file reference]
> **Date:** [INSERT: date]
> **Re:** [INSERT: subject]
>
> ### Purpose
> - [INSERT: why this memo exists]
>
> ### Background
> - [INSERT: relevant context]
> - [INSERT: how we got here]
>
> ### Discussion/Events
> - [INSERT: what happened]
> - [INSERT: key details]
> - [INSERT: positions of parties if relevant]
>
> ### Outcome/Status
> - [INSERT: current status]
> - [INSERT: what was decided or agreed]
>
> ### Next Steps
> - [INSERT: follow-up items]
> - [INSERT: deadlines if any]
>
> ---
> *Origin: ML2 scaffolding | Not ML1-authored | Use/Ignore/Delete only*
```

### Template: Client Intake Summary

```markdown
> **[System-generated structure]**
>
> ## [HEADER: Client Intake Summary]
>
> **Client:** [INSERT: client name]
> **Date:** [INSERT: intake date]
> **Matter Type:** [INSERT: type of matter]
>
> ### Client Information
> - [INSERT: contact details]
> - [INSERT: relevant personal/business info]
>
> ### Matter Overview
> - [INSERT: what the client needs help with]
> - [INSERT: brief factual summary]
>
> ### Key Issues
> - [INSERT: issue 1]
> - [INSERT: issue 2]
> - [INSERT: additional issues]
>
> ### Documents Received
> - [INSERT: list of documents]
>
> ### Initial Assessment
> - [INSERT: your initial observations]
> - [INSERT: areas needing investigation]
>
> ### Conflicts Check
> - [INSERT: conflicts status]
>
> ### Retainer/Engagement
> - [INSERT: engagement terms discussed]
>
> ---
> *Origin: ML2 scaffolding | Not ML1-authored | Use/Ignore/Delete only*
```

### Template: Case Status Update

```markdown
> **[System-generated structure]**
>
> ## [HEADER: Case Status Update]
>
> **Matter:** [INSERT: matter name/number]
> **Date:** [INSERT: date]
> **Period:** [INSERT: reporting period]
>
> ### Current Status
> - [INSERT: where things stand]
>
> ### Recent Activity
> - [INSERT: what happened since last update]
> - [INSERT: key events/filings/communications]
>
> ### Upcoming Deadlines
> - [INSERT: deadline 1 and date]
> - [INSERT: deadline 2 and date]
>
> ### Outstanding Items
> - [INSERT: items awaiting response]
> - [INSERT: items requiring action]
>
> ### Issues/Concerns
> - [INSERT: any issues to flag]
>
> ### Next Steps
> - [INSERT: planned actions]
>
> ---
> *Origin: ML2 scaffolding | Not ML1-authored | Use/Ignore/Delete only*
```

### Template: Legal Research Outline

```markdown
> **[System-generated structure]**
>
> ## [HEADER: Legal Research Memo]
>
> **Issue:** [INSERT: research question]
> **Requested by:** [INSERT: requesting lawyer]
> **Date:** [INSERT: date]
>
> ### Question Presented
> - [INSERT: specific legal question]
>
> ### Brief Answer
> - [INSERT: your conclusion]
>
> ### Facts
> - [INSERT: relevant facts from the file]
>
> ### Applicable Law
> - [INSERT: relevant statutes]
> - [INSERT: relevant case law]
> - [INSERT: relevant regulations if any]
>
> ### Analysis
> - [INSERT: application of law to facts]
> - [INSERT: counterarguments to consider]
>
> ### Conclusion
> - [INSERT: final answer to question]
>
> ### Limitations
> - [INSERT: scope limitations of research]
>
> ---
> *Origin: ML2 scaffolding | Not ML1-authored | Use/Ignore/Delete only*
```

---

## Test Cases

| Test ID | Input | Expected Output Characteristics |
|---------|-------|--------------------------------|
| TEST-D1 | "Memo to file on settlement discussion" | Memo template, section headers only, no prose |
| TEST-D2 | "Client intake summary structure" | Intake template, placeholders only, no filled content |
| TEST-D3 | "Case status update outline" | Status template, hierarchy clear, no sentences |

### Pass Criteria

For each test:
- [ ] Output is in blockquote container
- [ ] `[System-generated structure]` prefix present
- [ ] All content areas use `[INSERT:]` or `[SECTION:]` markers
- [ ] No complete sentences appear
- [ ] No suggested phrasing appears
- [ ] Origin footer present
- [ ] Clear section hierarchy with ## and ###

---

## Failure Modes

| Failure | Detection | Response |
|---------|-----------|----------|
| Complete sentence in output | Review output for prose | Revise to placeholder |
| Legal conclusion included | Output contains opinions/advice | Remove immediately |
| Missing label | No `[System-generated]` prefix | Add prefix immediately |
| Filled content | Content appears drafted | Convert to `[INSERT:]` format |
| Missing hierarchy | No clear section structure | Add ## / ### markers |

---

## Governance

- This agent has NO authority
- Outputs are ephemeral by default
- All outputs follow Stage 3.1 contracts
- Any deviation triggers Stage 3.1 failure protocol
- Legal content MUST come from ML1, never from system
