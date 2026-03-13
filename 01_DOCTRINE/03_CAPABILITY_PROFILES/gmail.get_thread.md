---
id: 01_doctrine__03_capability_profiles__gmail_get_thread_md
title: Capability Profile: Gmail.GetThread
owner: ML1
status: draft
version: 0.1
created_date: 2026-02-26
last_updated: 2026-02-26
tags: [capability, gmail, mcp]
---
# Capability Profile: Gmail.GetThread (v0.1)

## Purpose
Retrieve a thread and message contents for summarization and draft generation.

## Allowed Actions
- Read a thread
- Read messages within the thread

## Disallowed Actions
- Sending email
- Creating drafts (separate capability)
- Modifying or labeling messages
- Deleting messages

## Inputs (Typed)
- thread_id: string

## Outputs (Typed)
- thread:
  - thread_id: string
  - messages: array of
    - message_id: string
    - from: string
    - to: array<string>
    - cc: array<string>
    - date: string (ISO-8601)
    - subject: string
    - body_snippet: string
    - body_full_ref: string (reference pointer or truncated content marker)

## Required Logs
- thread_id
- message_count
- size_estimate_bytes (approx)

## Approval Mode
- Auto

## Boundary Rules
- Read-only.
