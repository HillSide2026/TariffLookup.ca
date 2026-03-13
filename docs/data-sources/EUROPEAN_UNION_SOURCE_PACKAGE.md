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

## Current Status

- the official source package has been identified
- the local file layout is in place
- the first verified normalized EU tariff rows are now committed for `8208.30` and `0901.21`
- raw official payloads for those rows are stored in `data/raw/eu/access2markets-tariffs-2026-03-13.json`
- backend lookup code now prefers `data/normalized/eu/tariff-records.json` for matching European Union requests and falls back to seed data for codes that are not normalized yet

## First Committed Rows

- `8208.30` -> MFN `1.70%`, Canada preference `0%`
- `0901.21` -> MFN `7.50%`, Canada preference `0%`

## Current Limitations

- the EU normalized dataset is still a narrow first slice, not full European Union tariff coverage
- the official endpoint requires an EU member-state destination; the current normalized rows use `DE` as the query destination while mapping the resulting customs duty into the app's `European Union` market abstraction
- codes that still resolve to multiple product branches or have not been normalized yet continue to fall back to the local seed dataset
- this is not yet production-grade tariff intelligence or legal advice

## Implementation Rule

Do not label European Union tariff rows as real-data outputs in the application until:

- the specific row has been extracted from an official EU source path
- the normalized record has been reviewed for code, rate, and effective-date accuracy
- the provenance can be traced back to the source package documented here
