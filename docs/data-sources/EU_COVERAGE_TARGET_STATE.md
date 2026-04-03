# EU Coverage Target State

Status: Active working target state  
Last updated: 2026-04-03  
Owner: ML1  
Scope: European Union coverage only for the current stage

## Purpose

This document defines the operating end state for TariffLookup.ca's current EU-only data-quality and coverage work.

It exists so product, data, and QA work can optimize toward one explicit goal instead of drifting toward raw row-count expansion.

## Current Baseline

As of 2026-04-03, the live EU catalog and normalized dataset currently reflect:

- `94` merged EU raw-query rows in the current official-source working set
- `118` active EU catalog entries currently tracked in `data/catalog/eu-hs6-catalog.json`
- `89` safe normalized candidates already live in `data/normalized/eu/tariff-records.json`
- `5` blocked rows
- `22` manual-review rows
- `2` rows still in queue for the remaining glassware batch

Current live trusted EU dataset:

- `89` normalized EU rows in `data/normalized/eu/tariff-records.json`

Current floor gap:

- about `4,911` additional groups remain before the product reaches the HS-6 floor of about `5,000` groups, measured against the current normalized-row baseline only

Current raw-source note:

- the merged official raw-source package in the repo currently reproduces `71` normalized rows, `1` blocked row, and `22` manual-review rows, so the live dataset is ahead of the current raw-source package by `18` promoted rows and must still be tracked explicitly

## Coverage Floor

The current stage is not aiming for a small “useful starter set” anymore.

The explicit floor is now about `5,000` HS-6 commodity groups for EU coverage. That does not mean every group must be normalized immediately, but it does mean the system must be able to place every active-catalog group into an explicit end state.

## Working End State

Every HS code in the active EU target catalog must end up in exactly one of these states:

1. `normalized`
   Safe to expose as a verified EU row with truthful notes and no unresolved branch conflict.
2. `blocked-with-guidance`
   Not safe to collapse into one row yet, but the system can tell the user what extra detail is needed.
3. `manual-review`
   Not safe to normalize automatically and not yet resolved into a stable guided path.

Preferred terminal state:

- `normalized` whenever safe

Safety rule:

- Never force a row into `normalized` when branch outcomes materially diverge or when product-description routing is too loose to support a trustworthy result.

## Success Definition

The EU system is operating at the intended target state when:

- the active EU target catalog reaches the HS-6 floor of about `5,000` commodity groups
- every code in the active EU target catalog is classified into one of the three states above
- every `normalized` row is backed by the official-source normalization workflow
- every `blocked-with-guidance` row has specific detail prompts in `backend/src/services/eu-coverage-service.ts`
- every `manual-review` row is explicitly tracked in `docs/data-sources/EU_NORMALIZATION_QUEUE.md`
- the live normalized dataset, normalization script output, and queue documentation stay in sync
- no unsafe seed fallback is used for active-catalog EU lookups that should instead be `normalized` or `blocked-with-guidance`

## Non-Goals For This Stage

- Expanding beyond the European Union
- Maximizing total row count without regard to trustworthiness
- Hiding ambiguity behind broad or misleading normalized rows
- Reframing seed/demo coverage as verified EU coverage

## Operating Priorities

1. Improve classification quality for active EU product descriptions
2. Normalize additional EU rows only when the base-duty outcome is stable and safe
3. Convert ambiguity into guided follow-up questions where possible
4. Keep tests and queue documentation synchronized with the live dataset

## Source Of Truth Files

- `backend/src/services/classification-service.ts`
- `backend/src/services/eu-normalization-service.ts`
- `backend/src/services/eu-coverage-service.ts`
- `backend/src/routes/lookups.test.ts`
- `backend/src/scripts/normalize-eu-source.ts`
- `data/normalized/eu/tariff-records.json`
- `docs/data-sources/EU_NORMALIZATION_QUEUE.md`
- `docs/engineering/TARIFF_DATA_REFRESH_RUNBOOK.md`

## Governance Rule

If product scope changes and other jurisdictions return to scope, this document must be revised before the EU agents are treated as working toward a broader target state.
