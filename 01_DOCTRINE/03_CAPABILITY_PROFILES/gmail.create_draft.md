---
id: 01_doctrine__03_capability_profiles__gmail_create_draft_md
title: Capability Profile: Gmail.CreateDraft
owner: ML1
status: draft
version: 0.1
created_date: 2026-02-26
last_updated: 2026-02-26
tags: [capability, gmail, mcp]
---
# Capability Profile: Gmail.CreateDraft (v0.1)

## Purpose
Create an email draft reply or follow-up message. Drafts only.

## Allowed Actions
- Create a draft (reply or new draft tied to a thread)

## Disallowed Actions
- Send email (including scheduled send)
- Auto-forward to unapproved recipients if domain allowlist is enabled

## Inputs (Typed)
- thread_id: string
- to: array<string>
- cc: array<string> (optional)
- subject: string
- body_md: string

## Outputs (Typed)
- draft_id: string
- draft_link: string (optional, provider dependent)

## Required Logs
- thread_id
- to_domains: array<string>
- cc_domains: array<string>
- draft_id
- policy check results (no-send, domain allowlist if enabled)

## Approval Mode
- Propose

## Boundary Rules
- If `00_SYSTEM/security/gmail_domain_allowlist.json` has `enabled=true`, recipients must match allowlisted domains.
- Regardless of allowlist, sending is forbidden by invariant.
