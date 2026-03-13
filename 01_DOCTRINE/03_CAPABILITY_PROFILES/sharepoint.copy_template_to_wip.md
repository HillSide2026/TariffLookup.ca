---
id: 01_doctrine__03_capability_profiles__sharepoint_copy_template_to_wip_md
title: Capability Profile: SharePoint.CopyTemplateToWIP
owner: ML1
status: draft
version: 0.1
created_date: 2026-02-26
last_updated: 2026-02-26
tags: [capability, sharepoint, mcp]
---
# Capability Profile: SharePoint.CopyTemplateToWIP (v0.1)

## Purpose
Copy a selected template document into an allowlisted WIP destination for drafting.

## Allowed Actions
- Copy a document into a WIP folder allowlisted in `00_SYSTEM/security/sharepoint_allowlist.json`

## Disallowed Actions
- Writing outside allowlisted WIP destinations
- Publishing to final libraries
- Overwrite by default

## Inputs (Typed)
- source_doc_id: string
- dest_site_id: string
- dest_library_id: string
- dest_folder_path: string
- new_name: string
- overwrite: boolean (default false)

## Outputs (Typed)
- new_doc_id: string
- new_url: string

## Required Logs
- source_doc_id
- destination triple: dest_site_id, dest_library_id, dest_folder_path
- allowlist_check: pass/fail
- overwrite flag
- source_doc_id -> new_doc_id mapping

## Approval Mode
- Propose

## Boundary Rules
- Destination MUST match an allowlisted WIP destination.
- If overwrite=true, require Manual approval (policy gate).
