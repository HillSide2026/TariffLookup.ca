---
id: 01_doctrine__03_capability_profiles__gmail_search_threads_md
title: Capability Profile: Gmail.SearchThreads
owner: ML1
status: draft
version: 0.1
created_date: 2026-02-26
last_updated: 2026-02-26
tags: [capability, gmail, mcp]
---
# Capability Profile: Gmail.SearchThreads (v0.1)

## Purpose
Search Gmail for threads relevant to a matter using keywords and bounded filters.

## Allowed Actions
- Search/list thread IDs and basic metadata.

## Disallowed Actions
- Sending email
- Creating drafts (handled by separate capability)
- Modifying messages/labels
- Deleting messages

## Inputs (Typed)
- query: string
- time_range_days: integer (default 90; max 365 without Manual)
- max_threads: integer (default 20; max 50)

## Outputs (Typed)
- threads: array of
  - thread_id: string
  - subject: string
  - participants: array<string>
  - last_message_ts: string (ISO-8601)

## Required Logs
- query (redacted or hashed), time_range_days, max_threads
- result_count
- returned thread_ids

## Approval Mode
- Auto

## Boundary Rules
- Respect any configured Gmail query constraints (labels/domains) if enabled by policy.
