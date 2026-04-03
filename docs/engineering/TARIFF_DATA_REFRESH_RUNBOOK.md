# Tariff Data Refresh Runbook

This runbook defines the Step 5 refresh procedure for tariff-data updates.

## Source refresh workflow

1. Capture the new official source payloads under `data/raw/`.
2. Update the relevant source manifest entries and provenance notes in
   `docs/data-sources/`.
3. Normalize the approved rows into `data/normalized/`.
4. Run `npm --prefix backend run generate:eu-docs` to regenerate the catalog-derived
   EU coverage docs.
5. Keep blocked or ambiguous rows documented in the normalization queue instead
   of forcing a false-positive normalized record.

## Verification workflow

1. Run backend tests.
2. Run `npm --prefix backend run check:eu-docs`.
3. Run frontend tests.
4. Run backend and frontend builds.
5. Spot-check at least one normalized lookup for each changed jurisdiction.
6. Update the roadmap or source-package docs if the normalization scope changed.

## Release workflow

1. Include the data refresh in the release checklist.
2. Deploy to staging first.
3. Run the staging smoke test.
4. Review `/health` and `/api/ops/metrics` after the data change.
5. Only promote after the refreshed rows behave correctly in staging.

## Rollback workflow

1. Revert the changed normalized data files and source manifest entries.
2. Redeploy the backend with the last known-good dataset.
3. Rerun the EU smoke path and confirm the restored rows are returned.
4. Record the rollback reason in the release notes or incident log.
