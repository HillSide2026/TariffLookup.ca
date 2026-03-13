---
id: 01_doctrine__03_capability_profiles__sharepoint_find_latest_template_md
title: Capability Profile: SharePoint.FindLatestTemplate
owner: ML1
status: draft
version: 0.1
created_date: 2026-02-26
last_updated: 2026-02-26
tags: [capability, sharepoint, mcp]
---
# Capability Profile: SharePoint.FindLatestTemplate (v0.1)

## Purpose
Find the latest template in an allowlisted Templates library.

## Allowed Actions
- Search templates by key/name
- Read metadata (name, modified time, version, URL)

## Disallowed Actions
- Writing or copying documents
- Reading outside allowlisted template sites/libraries

## Inputs (Typed)
- template_key: string
- template_library_id: string
- max_results: integer (default 10; max 20)

## Outputs (Typed)
- templates: array of
  - doc_id: string
  - name: string
  - version: string (optional)
  - last_modified_ts: string (ISO-8601)
  - url: string

## Required Logs
- template_key
- template_library_id
- result_count
- selected_doc_id (if any)

## Approval Mode
- Auto

## Boundary Rules
- Read/search permitted only within allowlisted template sites/libraries from `00_SYSTEM/security/sharepoint_allowlist.json`.
