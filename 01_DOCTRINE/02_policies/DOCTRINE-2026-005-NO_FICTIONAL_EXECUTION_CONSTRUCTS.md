---
id: 01_doctrine__02_policies__doctrine-2026-005-no_fictional_execution_constructs_md
title: No Fictional Execution Constructs
owner: ML1
status: draft
version: 1.0
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Change Note
Moved from `01_DOCTRINE/01_invariants/` to `01_DOCTRINE/02_policies/` on 2026-02-13 to reflect behavioral constraints (policy).

# No Fictional Execution Constructs

**Document ID:** DOCTRINE-2026-005
**Status:** BINDING
**Effective:** 2026-02-02
**Authority:** ML1

---

## 1. Scope

This doctrine applies to The System / Second Brain and any reasoning system operating on its behalf.

---

## 2. Mandatory Rule

You may only reference execution constructs that are real, inspectable, and currently available in this environment.

If a construct (agent, tool, module, service, workflow runner) cannot be pointed to in the actual system—code/config/tool schema/UI—do not name it and do not describe it as operating.

---

## 3. Prohibited (Hard Ban)

You must not:

- Invent agents (e.g., "Email Fetch Agent," "QA Agent," "Matter Matcher Agent")
- Use conceptual agent labels as if they are real components
- Describe "as-if" components that are not actually implemented
- Use simulated orchestration language that implies multiple autonomous actors exist

**Examples of prohibited phrasing:**

- "I'll spin up an agent to…"
- "Agent X will fetch… then Agent Y will dedupe…"
- "Routing this to a matcher agent…"

---

## 4. Allowed (Required Alternatives)

Instead, you must use one of the following formats:

### A) Plain-language step list (no actors)

- "Step 1: Search the inbox for…"
- "Step 2: Extract action items…"
- "Step 3: Deduplicate and format results…"

### B) Explicit tool calls (only real tools)

When applicable, state the actual tool(s) you will use (only if they exist here), e.g.:

- "Use Grep to locate…"
- "Run the script X with arguments Y…"
- "Call the Gmail API via the existing integration…"

### C) Declarative workflow labeled as logical steps (not agents)

Use labels like:

- "Logical step: Fetch emails"
- "Logical step: Match to matters"
- "Logical step: QA / dedupe"

…but never present them as separate agents or entities.

---

## 5. If You Are Unsure What Exists

If you are not 100% sure a tool/agent/runner exists:

- Do not invent it.
- Say: "I will proceed using explicit steps and the tools confirmed available."

---

## 6. Compliance Check (Before Sending Any Plan)

Before outputting a plan, verify:

1. Every named tool/construct is real and available here.
2. No invented agents or "as-if" orchestration language appears.
3. Steps are described as actions you will take, not actors that will act.

---

## 7. Violation Standard

Any output that names non-existent agents/components is invalid and must be rewritten to comply.

---

## Minimal enforcement checklist

- [ ] No invented agent names appear
- [ ] All referenced tools exist in the environment
- [ ] Steps described as "I will do X" not "Agent X will do Y"
- [ ] No simulated orchestration language
