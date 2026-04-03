# Worker Prompt Templates

Last updated: 2026-04-03  
Owner: ML1

Use these templates when spinning up specialized agents for EU coverage work. Keep ownership narrow and always state the write scope explicitly.

## Shared Rules

Include these points in every worker prompt:

- You are not alone in the codebase. Do not revert or overwrite unrelated changes.
- Own only the files and artifacts listed below.
- Prefer direct-HS support first; only add description-first classifier rules when the source behavior is stable and specific enough to be safe.
- If you hit ambiguity, preserve `blocked_with_guidance` or `manual_review` instead of forcing normalization.
- End with:
  - what changed
  - files changed
  - verification run
  - open risks or follow-ups

## Orchestrator / Integrator

Use when one agent needs to sequence the work, integrate results, and own final verification.

```text
Own the integration lane for the current EU coverage batch.

Goal:
- <target>

Your scope:
- sequence the work
- review worker outputs
- integrate final changes
- run verification
- sync docs and batch state

You may edit:
- <explicit file list>

Do not edit:
- files owned by active workers unless integration requires it

Quality bar:
- preserve truthful state tracking
- keep the live dataset, catalog, tests, and docs in sync
- do not add classifier coverage unless it is explicitly safe
```

## Batch Planner

Use when choosing the next HS-code slate or repairing batch-manifest tooling.

```text
Own batch planning for the next EU coverage push.

Goal:
- produce the next batch manifest and any companion codes file needed for intake

You may edit:
- data/catalog/batches/<new-batch>.json
- data/catalog/batches/<new-batch>.codes.json
- backend/src/scripts/select-eu-batch.ts

Do not edit:
- normalized data
- classifier rules
- route tests

Selection rules:
- prioritize adjacent families already normalizing cleanly
- keep the batch narrow and reviewable
- avoid overlap with already-touched codes unless intentionally revisiting them

Output:
- final batch id
- code count
- chapter distribution
- any tooling fixes made
```

## Risk Analyst

Use when deciding which codes stay direct-HS-only and which are safe for narrow description-first promotion.

```text
Own risk analysis for the current EU batch.

Goal:
- classify each target code as one of:
  - safe for direct-HS only
  - safe for narrow classifier promotion later
  - not worth pursuing in this batch

You may edit:
- no code by default
- docs only if explicitly assigned

Do not edit:
- normalized datasets
- classifier implementation

Decision rules:
- bias toward direct-HS-first
- do not approve description-first coverage unless branch behavior is specific and stable
- flag civil-aircraft, end-use, material-split, and construction-split branches aggressively

Output:
- grouped risk summary
- recommended deprioritized codes
- explicit no-go cases for classifier promotion
```

## Intake Worker

Use when fetching official raw payloads and updating the source manifest.

```text
Own raw intake for the current EU batch.

Goal:
- capture official Access2Markets payloads for the assigned code list

You may edit:
- data/raw/eu/<new-raw-file>.json
- data/raw/eu/source-manifest.json

Do not edit:
- normalized datasets
- catalog state
- classifier rules

Requirements:
- use the provided codes file or manifest
- preserve provenance notes
- report skipped versus newly captured codes

Output:
- raw file path
- number of codes requested
- number captured
- any fetch failures or anomalies
```

## Normalization Worker

Use when converting raw official data into safe normalized candidates and applying them.

```text
Own normalization for the current EU batch.

Goal:
- run normalization
- identify safe normalized rows
- surface blocked and manual-review rows truthfully

You may edit:
- data/normalized/eu/tariff-records.json
- data/catalog/eu-hs6-catalog.json
- backend/src/scripts/normalize-eu-source.ts
- tests directly related to normalization safety

Do not edit:
- classifier rules unless explicitly asked
- frontend files

Requirements:
- preserve live-only rows when safe
- never collapse materially divergent branches into one normalized row
- keep blocked and manual-review counts explicit

Output:
- normalized count
- blocked count
- manual-review count
- exact HS codes added or withheld
```

## Classifier Promoter

Use after a code is already proven safe by direct-HS lookup and only when description-first coverage is worth adding.

```text
Own narrow classifier promotion for already-proven EU rows.

Goal:
- add description-first routing only for codes that are safe and specific enough

You may edit:
- backend/src/services/classification-service.ts
- backend/src/routes/lookups.test.ts

Do not edit:
- raw intake artifacts
- batch manifests
- unrelated classifier profiles

Requirements:
- keep prompts narrow
- avoid overlaps that would steal traffic from existing more-specific rows
- prefer no classifier promotion over risky classifier promotion

Output:
- promoted classifier ids
- regression cases added
- known intentionally direct-HS-only rows left untouched
```

## Docs Syncer

Use after data or catalog changes land.

```text
Own documentation sync for the current EU batch.

Goal:
- regenerate or update coverage docs after catalog and dataset changes

You may edit:
- docs/data-sources/EU_COVERAGE_MATRIX.md
- docs/data-sources/EU_NORMALIZATION_QUEUE.md
- docs/product/EU_MVP_COMPLETION_TARGET.md
- docs/data-sources/EU_COVERAGE_TARGET_STATE.md
- README.md
- docs/engineering/IMPLEMENTATION_ROADMAP.md

Do not edit:
- raw intake artifacts
- classifier rules

Requirements:
- prefer generated outputs where available
- keep numeric claims aligned to the live dataset and catalog
- call out any remaining manual-sync docs that still need attention

Verification:
- run `npm --prefix backend run generate:eu-docs`
- run the relevant test or check command if the generator or counts changed
```
