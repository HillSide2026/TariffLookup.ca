---
id: 00_system__architecture__arch-2026-00x-integration-plan_md
title: ARCH 2026 00X integration plan
owner: ML1
status: draft
created_date: 2026-01-25
last_updated: 2026-01-25
tags: []
---

LL Second Brain — Integration Plan (DRAFT)

Purpose and Status
This document defines the current, approved integration scope for the LL Second Brain.
It is DRAFT and intended to capture the system as it exists today, not future plans.
The LL Second Brain integrates only with the systems listed below, and only within the explicitly defined scopes.

Integration Scope
Inbound Integrations
Unless explicitly stated otherwise, integrations are read-only and used for contextual reference and reasoning only.

Gmail
Purpose
Ingest communications as reference material.
Scope
Read email content and metadata
Prepare draft responses
Apply mailbox tagging and labels
Limitations
No sending of emails
No autonomous replies
Drafts require human review and action

Google Calendar
Purpose
Provide contextual awareness of events, deadlines, and timelines.
Scope
Read-only access to calendar data
Limitations
No event creation
No edits or deletions
No invitations or responses

Clio (Read-Only)
Purpose
Provide matter context, metadata, and reference facts.
Scope
Read-only access to approved matter data
Limitations
No writes
No task updates
No workflow actions
No status changes

OneDrive
Purpose
Document ingestion and reference.
Scope
Read-only access to documents
Limitations
No file creation
No edits
No deletion

SharePoint
Purpose
Access firm knowledge and reference documents.
Scope
Read-only access
Limitations
No publishing
No syncing
No write-back

Microsoft Word
Purpose
Document creation and drafting.
Scope
Read-write access for document drafting
Limitations
Documents do not become authoritative until reviewed and approved
No automatic promotion into LL Second Brain without explicit governance steps

Governance Rules (Non-Negotiable)
Contextual Use Only
Integrations exist to provide context and inputs to reasoning, not to execute work autonomously.

Not an Execution Surface
The LL Second Brain does not independently act in external systems.

Sole Reasoning and Codification System
The LL Second Brain remains the exclusive system for reasoning, synthesis, and codification used by Levine Law.

No Implicit Authority
Integration with a system does not grant authority to modify that system unless explicitly stated.

Explicit Scope Control
Any integration not listed in this document is not approved.

Draft Status Notice (recommended footer)
Status: Draft
This document reflects current intent and configuration but has not yet been finalized or approved as authoritative doctrine.
