---
id: 01_doctrine__02_policies__system_mcp_policy_md
title: System MCP Policy (v0.1)
owner: ML1
status: draft
version: 0.1
created_date: 2026-02-26
last_updated: 2026-02-26
tags: [policy, mcp, orchestrator]
---
# System MCP Policy (v0.1)

## Status
- Type: Doctrine / Policy
- Scope: MCP integrations + ML2 Orchestrator (Runner)
- Effective: 2026-02-26
- Owner: ML1 (final authority)

## Purpose
Define the mandatory governance, boundaries, approval gates, and audit artifacts for any orchestrated MCP activity touching external systems (Gmail, SharePoint/Graph, Calendar).

This policy is the source-of-truth. Implementation (00_SYSTEM) must conform to this policy.

---

## Runtime Shape (Required)
### Architecture
- One MCP server per external system:
  - `mcp_gmail`
  - `mcp_sharepoint`
  - `mcp_calendar`
- A single ML2 Orchestrator ("Runner") that:
  1) calls MCP tools,
  2) enforces policy + boundaries,
  3) writes artifacts/logs into `06_RUNS`,
  4) outputs drafts and summaries (never finalizes).

### Orchestrator Responsibilities
The Orchestrator MUST:
- Validate requested actions against capability profiles in `01_DOCTRINE/03_capability_profiles`
- Enforce boundary rules (allowlists, time windows)
- Enforce approval modes (Auto / Propose / Manual)
- Emit auditable run artifacts for every run (success/failure/blocked)

The Orchestrator MUST NOT:
- Auto-send emails
- Publish final documents outside WIP
- Modify calendars (events/attendees/invites)
- Expand credentials/scopes without ML1 approval

---

## Global Invariants (Hard Rules)
1) **No Autonomous Publish**
   - No auto-send (email)
   - No auto-publish/commit (documents)
   - No calendar edits/invites
   - No external task creation
   - Any attempt must be BLOCKED and logged
   - See: `01_DOCTRINE/01_invariants/no_autonomous_publish.md`

2) **Least Privilege**
   - Gmail: `gmail.readonly` + `gmail.compose` only
   - SharePoint/Graph: delegated permissions preferred; write only to allowlisted WIP destinations
   - Calendar: read-only scopes only

3) **Tool Surface Safety**
   - MCP servers MUST NOT expose forbidden operations (e.g., `send_email`, `publish_doc`, `update_event`)
   - If a forbidden op is exposed, Orchestrator must still block it (defense in depth)

4) **Audit-First Execution**
   - No external call is permitted unless it is logged in `actions.jsonl`
   - Every run must have a `manifest.json` and output artifacts under `outputs/`

---

## Approval Modes
### Auto
- Bounded read operations and locally-generated summaries/packs
- No external writes

### Propose
- External writes that remain drafts/WIP-only
- Example: Gmail draft creation; SharePoint copy to WIP
- Output is a proposal artifact + external draft reference (ID/URL), not a final deliverable

### Manual
- Blocked by default; requires explicit ML1 approval token and recorded rationale
- Used for exceptional scope expansion, allowlist changes, or operations outside normal bounds

---

## Boundary Rules
### SharePoint / Graph
- Writes are permitted ONLY to destinations allowlisted in:
  - `00_SYSTEM/security/sharepoint_allowlist.json`
- Reads/search are permitted only within allowlisted template sites/libraries as configured
- Diff/compare is read-only

### Gmail (Optional Domain Allowlist)
- If `00_SYSTEM/security/gmail_domain_allowlist.json` is non-empty and `enabled=true`,
  then draft recipients must be within the allowlisted domains.
- Regardless of allowlist, send actions are forbidden.

### Calendar
- Default window: next 7 days
- Maximum window without ML1 Manual approval: 14 days
- Constraints live in: `00_SYSTEM/security/calendar_constraints.json`

---

## Required Audit Artifacts (Runs)
### Output Root
All runs MUST be written into:
- `06_RUNS/EXECUTION/` (preferred), OR
- `06_RUNS/MCP/` (if you create a dedicated namespace)

### Run Folder Naming
`RUN-YYYY-MM-DD-MCP-<slug>/`

### Required Files
- `manifest.json` (validated by `00_SYSTEM/schemas/run_manifest.schema.json`)
- `actions.jsonl` (each line validated by `00_SYSTEM/schemas/actions_log.schema.json`)
- `outputs/` folder with markdown + references
  - `outputs/*.md`
  - `outputs/gmail/`
  - `outputs/sharepoint/`
  - `outputs/prep_packets/` (calendar)

---

## Logging Requirements
### actions.jsonl Must Include
- timestamp, action_id, capability
- inputs_hash (redacted inputs summary lives in manifest)
- policy checks (pass/fail + rule name)
- result: success | fail | blocked
- output references (paths, external IDs)

### manifest.json Must Include
- run_id, timestamp, runner_version, requested_runbook
- approval_mode, policies_version
- outputs_index (path + sha256)
- exceptions (if any)

---

## Enforcement Guidance
- Anything not explicitly allowed by a capability profile is disallowed.
- Orchestrator must:
  1) fail closed,
  2) write a `blocked` action record,
  3) emit a minimal run manifest even on failure.

---

## References
- Capability profiles: `01_DOCTRINE/03_capability_profiles/*`
- Runbooks: `02_PLAYBOOKS/system/*`
- Schemas: `00_SYSTEM/schemas/*`
- Security allowlists: `00_SYSTEM/security/*`
