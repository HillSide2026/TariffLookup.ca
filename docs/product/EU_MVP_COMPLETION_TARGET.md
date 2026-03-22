# EU MVP Completion Target

Status: Active execution target  
Last updated: 2026-03-22  
Owner: ML1  
Applies to: current implementation stage for TariffLookup.ca

## Purpose

This document defines the explicit MVP completion target for the current TariffLookup.ca implementation stage.

It supersedes the earlier six-jurisdiction planning assumption for day-to-day execution tracking, while preserving those planning artifacts as historical record.

## Current Stage Scope

- Jurisdiction scope: European Union only
- Coverage model: HS-6 floor
- Coverage floor: about `5,000` commodity groups
- Core workflow: one product description or one HS code + one destination country
- Output: probable HS code, MFN tariff rate, preferential tariff rate if applicable, agreement basis, and eligibility notes

## Completion Target

The current MVP completion target is reached when the EU coverage program has an active HS-6 catalog at the floor of about `5,000` commodity groups and every group in that catalog has an explicit system state.

## Required End State Per HS-6 Group

Every HS-6 group in the active EU catalog must end up in exactly one of these states:

1. `normalized`
   Safe to expose as a trustworthy verified EU row.
2. `blocked-with-guidance`
   Not safe to collapse into one verified row yet, but the product can ask for the extra detail needed to narrow the branch safely.
3. `manual-review`
   Not safe to normalize automatically and not yet resolved into a stable guided path.

Preferred state:

- `normalized` whenever safe

## Gate Definition

The current stage reaches its completion gate when all of the following are true:

- `active_eu_hs6_catalog_count >= 5000`
- every catalog entry is assigned to exactly one explicit state: `normalized`, `blocked-with-guidance`, or `manual-review`
- no active-catalog EU lookup depends on an unsafe seed fallback when it should instead be categorized explicitly
- normalized rows, blocked guidance, manual-review tracking, tests, and queue documentation are in sync

## Current Baseline

As of 2026-03-22:

- live normalized EU rows: `31`
- current merged EU working set in the repo: `34`
- current gap to the HS-6 floor, measured against live normalized rows only: about `4,969`

That `4,969` figure is a raw gap-to-floor number, not a promise that every remaining group should be normalized directly without blocked or manual-review states.

## Tracking Rule

Use this file and `docs/data-sources/EU_COVERAGE_TARGET_STATE.md` as the source of truth for current-stage completion tracking.

Older planning files in `docs/product/` remain valuable as record of the March 20, 2026 planning approval, but they should not be read as the live execution target where they still refer to the earlier six-jurisdiction scope.
