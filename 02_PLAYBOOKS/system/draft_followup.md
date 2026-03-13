---
id: 02_playbooks__system__draft_followup_md
title: Runbook: draft_followup (v0.1)
owner: ML1
status: draft
version: 1.0
created_date: 2026-02-26
last_updated: 2026-02-26
tags: [runbook, mcp, gmail]
---
# Runbook: draft_followup (v0.1)

## Intent
Produce a thread summary and a draft follow-up email for ML1 review. Draft only; never send.

## Inputs
- matter_keywords: array<string>
- optional: additional_gmail_query_filters: string
- optional: time_range_days (default 90; max 365 without Manual)

## Steps (Capabilities)
1) Gmail.SearchThreads (Auto)
   - query composed from matter_keywords (+ optional filters)
2) Gmail.GetThread (Auto)
   - for top N threads (N bounded by capability max_threads)
3) Generate artifacts (Local, Auto)
   - `outputs/gmail/<thread_id>_summary.md`
   - `outputs/gmail/<thread_id>_commitments.md` ("who promised what")
4) Gmail.CreateDraft (Propose)
   - Create a draft reply/follow-up
   - Save `outputs/gmail/<thread_id>_draft.md`
   - Log `draft_id` in actions.jsonl

## Outputs (Required)
- `outputs/gmail/<thread_id>_summary.md`
- `outputs/gmail/<thread_id>_commitments.md`
- `outputs/gmail/<thread_id>_draft.md`
- actions.jsonl + manifest.json at run root

## Approval Gates
- Draft creation is Propose (no send). ML1 reviews and sends manually outside runner.

## Failure Modes
- No threads found: emit brief output explaining zero results; run still produces manifest/actions.
- Policy block (e.g., forbidden recipient domain if enabled): action result=blocked; emit draft.md explaining block.

## Audit
- All actions logged to actions.jsonl.
- All outputs indexed with sha256 in manifest.json.
