# European Union Source Package

This document defines the first official source package for Step 3 European Union tariff integration.

## Source Priority

1. Access2Markets tariff endpoint payloads for row-level tariff measures
2. EU Customs Tariff (TARIC) reference pages
3. Combined Nomenclature reference pages
4. EU tariff-classification guidance pages
5. EU Binding Tariff Information context for difficult classification cases

## Official Source References

- Access2Markets tariff endpoint pattern: `https://trade.ec.europa.eu/access-to-markets/api/tariffs/get/{product}/{origin}/{destination}?lang=EN`
- EU Customs Tariff (TARIC): https://taxation-customs.ec.europa.eu/customs/common-customs-tariff-cct/tariff-classification-goods/eu-customs-tariff-taric_en
- Combined Nomenclature: https://taxation-customs.ec.europa.eu/customs/common-customs-tariff-cct/tariff-classification-goods/combined-nomenclature_en
- Tariff classification of goods: https://taxation-customs.ec.europa.eu/customs/common-customs-tariff-cct/tariff-classification-goods_en
- EU Binding Tariff Information (BTI): https://taxation-customs.ec.europa.eu/customs/common-customs-tariff-cct/tariff-classification-goods/eu-binding-tariff-information-bti_en

## Local File Layout

- Raw source manifest: `data/raw/eu/source-manifest.json`
- Raw Access2Markets snapshot: `data/raw/eu/access2markets-tariffs-2026-03-13.json`
- Normalized tariff records: `data/normalized/eu/tariff-records.json`
- Normalized record schema: `data/schemas/eu-normalized-tariff-record.schema.json`
- Normalization queue: `docs/data-sources/EU_NORMALIZATION_QUEUE.md`
- Normalization rules: `docs/data-sources/EU_NORMALIZATION_RULES.md`

## Current Status

- the official source package has been identified
- the local file layout is in place
- the first verified normalized EU tariff rows are now committed for `8208.30`, `0901.21`, `6109.10`, `9403.60`, `3923.21`, and `9403.30`
- raw official payloads and extracted measure summaries for those rows, plus ambiguity-review notes for blocked codes, are stored in `data/raw/eu/access2markets-tariffs-2026-03-13.json`
- backend lookup code now prefers `data/normalized/eu/tariff-records.json` for matching European Union requests, pauses on known ambiguous EU codes, and uses explicit seed fallback only for uncovered low-confidence prototype cases
- the Step 3 prototype threshold has been reached with a materially useful first EU normalized slice, while broader EU expansion remains future work

## First Committed Rows

- `8208.30` -> MFN `1.70%`, Canada preference `0%`
- `0901.21` -> MFN `7.50%`, Canada preference `0%`
- `6109.10` -> MFN `12.00%`, Canada preference `0%`
- `9403.60` -> MFN `0%`, normalized from a shared base-duty outcome across the returned wooden-furniture branches
- `3923.21` -> MFN `6.50%`, Canada preference `0%`
- `9403.30` -> MFN `0%`, normalized from a shared base-duty outcome across the returned wooden-office-furniture branches

## Current Limitations

- the EU normalized dataset is still a narrow first slice, not full European Union tariff coverage
- the official endpoint requires an EU member-state destination; the current normalized rows use `DE` as the query destination while mapping the resulting customs duty into the app's `European Union` market abstraction
- codes that still resolve to multiple product branches, such as `0811.90` and `8501.52`, now trigger a `needs more detail` path instead of silently falling back to seed data
- uncovered low-confidence EU lookups can still use the explicit seed fallback row while real normalized coverage expands
- this is not yet production-grade tariff intelligence or legal advice

## Implementation Rule

Do not label European Union tariff rows as real-data outputs in the application until:

- the specific row has been extracted from an official EU source path
- the normalized record has been reviewed for code, rate, and effective-date accuracy
- the provenance can be traced back to the source package documented here
