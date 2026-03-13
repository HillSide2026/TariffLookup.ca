---
id: 01_doctrine__03_capability_profiles__sharepoint_diff_docs_md
title: Capability Profile: SharePoint.DiffDocs
owner: ML1
status: draft
version: 0.1
created_date: 2026-02-26
last_updated: 2026-02-26
tags: [capability, sharepoint, mcp]
---
# Capability Profile: SharePoint.DiffDocs (v0.1)

## Purpose
Generate a read-only diff summary between two SharePoint documents.

## Allowed Actions
- Read doc A and doc B
- Produce diff summary markdown artifact

## Disallowed Actions
- Writing changes back to either document
- Publishing

## Inputs (Typed)
- doc_a_id: string
- doc_b_id: string

## Outputs (Typed)
- diff_summary_md: string
- change_counts:
  - additions: integer
  - deletions: integer
  - edits: integer

## Required Logs
- doc_a_id, doc_b_id
- size estimates
- method identifier (e.g., "text-diff-v1")

## Approval Mode
- Auto

## Boundary Rules
- Read-only.
