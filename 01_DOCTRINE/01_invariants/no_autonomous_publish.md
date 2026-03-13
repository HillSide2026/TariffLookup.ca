---
id: inv-no-autonomous-publish
title: No Autonomous Publish (Binding Invariant)
owner: ML1
status: draft
version: 0.1
created_date: 2026-02-26
last_updated: 2026-02-26
tags: [invariant, safety, external]
---
# Invariant: No Autonomous Publish (v0.1)

## Statement (Hard Rule)
The ML2 Orchestrator and all MCP servers MUST NOT autonomously finalize outward actions.

### Forbidden autonomous actions (non-exhaustive)
- Sending email (including scheduled send)
- Publishing, filing, committing, or moving documents into final/non-WIP locations
- Editing calendar events or attendees
- Issuing invites
- Creating tasks/tickets in external systems
- Expanding permissions/scopes without ML1 approval record

## Allowed "Propose" Outputs
The system MAY:
- Create email drafts (not send)
- Copy templates into allowlisted WIP destinations (not publish)
- Generate local prep packets and briefs (markdown artifacts)

## Defense-in-Depth Requirements
1) Tool surface safety:
   - MCP servers must not expose forbidden operations.
2) Orchestrator policy enforcement:
   - If a forbidden operation is requested or surfaced, the Orchestrator must block it.
3) Audit trail:
   - Every violation attempt must be logged as `result=blocked` in `actions.jsonl`.

## Operational Implication
Any workflow requiring a final action must produce:
- A proposal artifact, AND
- A clear "human action required" step for ML1/LL, outside the orchestrator.
