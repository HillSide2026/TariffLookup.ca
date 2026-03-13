---
id: 01_doctrine__03_capability_profiles__calendar_list_events_md
title: Capability Profile: Calendar.ListEvents
owner: ML1
status: draft
version: 0.1
created_date: 2026-02-26
last_updated: 2026-02-26
tags: [capability, calendar, mcp]
---
# Capability Profile: Calendar.ListEvents (v0.1)

## Purpose
List events for a bounded time window to generate daily/weekly briefs.

## Allowed Actions
- List events within a window
- Read event metadata (title, time, attendees, location, meeting link)

## Disallowed Actions
- Create/edit/delete events
- Modify attendees
- Send invites

## Inputs (Typed)
- start_ts: string (ISO-8601)
- end_ts: string (ISO-8601)
- calendars: array<string> (optional)

## Outputs (Typed)
- events: array of
  - event_id: string
  - title: string
  - start: string (ISO-8601)
  - end: string (ISO-8601)
  - attendees: array<string>
  - location: string (optional)
  - meeting_link: string (optional)

## Required Logs
- start_ts, end_ts
- window_days
- event_count
- calendar_ids_used

## Approval Mode
- Auto

## Boundary Rules
- Enforce constraints from `00_SYSTEM/security/calendar_constraints.json` (default 7 days, max 14 without Manual).
