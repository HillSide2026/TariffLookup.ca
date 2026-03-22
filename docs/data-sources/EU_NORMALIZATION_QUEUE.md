# EU Normalization Queue

This file tracks the European Union Step 3 queue against the current prototype behavior.
Source of truth for live count: `data/normalized/eu/tariff-records.json` (31 entries as of 2026-03-22).
Catalog reference: `data/catalog/eu-hs6-catalog.json`.

## Verified Local Rows (31 normalized, 2026-03-22)

### Batch 1 — 2026-03-13 (first Access2Markets snapshot, 24 codes)

- `8208.30` - normalized and live
- `0901.21` - normalized and live
- `6109.10` - normalized and live
- `9403.60` - normalized and live
- `3923.21` - normalized and live
- `9403.30` - normalized and live
- `3924.10` - normalized and live
- `4819.10` - normalized and live
- `9403.50` - normalized and live
- `7013.49` - normalized and live
- `6302.60` - normalized and live
- `6302.91` - normalized and live
- `7323.93` - normalized and live
- `3924.90` - normalized and live
- `9403.40` - normalized and live
- `9401.61` - normalized and live
- `6911.10` - normalized and live
- `4419.90` - normalized and live with stricter wooden-tableware classification
- `7615.20` - normalized and live
- `7615.10` - normalized and live with stricter aluminium-household classification
- `8302.50` - normalized and live
- `8306.29` - normalized and live with stricter decorative-metal classification
- `9401.69` - normalized and live with stricter non-upholstered-seat classification
- `9403.20` - normalized and live

### Batch 2 — 2026-03-17 (household-packaging follow-on, 7 codes)

- `3923.29` - normalized and live (other-plastic sacks and bags, 6.5% MFN / 0% CETA)
- `3923.30` - normalized and live (plastic bottles and flasks, 6.5% MFN / 0% CETA)
- `4819.20` - normalized and live (folding non-corrugated cartons, 0% MFN / 0% CETA)
- `4819.40` - normalized and live (other paper sacks and bags, 0% MFN / 0% CETA)
- `4823.69` - normalized and live (paper table articles, 0% MFN / 0% CETA)
- `6302.31` - normalized and live (cotton bedlinen printed, 12% MFN / 0% CETA)
- `9403.70` - normalized and live (furniture of plastics, 0% MFN / 0% CETA)

## Ambiguity-Blocked Rows

- `0811.90`
  Current state: blocked
  Why blocked: official EU source returns multiple frozen-fruit branches with materially different duty formulas
  More detail needed: exact fruit, added sugar or spirit, prepared form, branch-narrowing specs

- `8501.52`
  Current state: blocked
  Why blocked: official EU source returns multiple motor branches and end-use contexts
  More detail needed: application, power rating, current type, whether imported alone or within a larger machine, special end-use treatment

- `6912.00`
  Current state: blocked
  Why blocked: official EU source splits ceramic tableware into multiple material and quality branches with different MFN outcomes
  More detail needed: material type such as porcelain, china, stoneware, earthenware, or handmade ceramic

- `8215.99`
  Current state: blocked
  Why blocked: official EU source splits kitchen utensils by stainless-steel versus other material, producing different MFN outcomes
  More detail needed: utensil material and whether the goods are stainless steel or another base material

- `6307.10`
  Current state: blocked
  Why blocked: official EU source splits cleaning-cloth goods across knitted, nonwoven, hand-made, and other branches with materially different MFN outcomes
  More detail needed: fabric construction, material type, and whether the article is knitted, nonwoven, hand-made, or another textile form

## Held For Classification Review

- none currently

## Explicit Prototype Fallback

- `8479.89`
  Current state: explicit seed fallback
  Why retained: low-confidence catch-all for uncovered EU prototype requests that do not map to a normalized row

## Active Batch: batch-2026-03-22-a

**Status:** `in_queue` — Access2Markets queries not yet run
**Manifest:** `data/catalog/batches/batch-2026-03-22-a.json`
**Metrics:** `data/catalog/eu-coverage-metrics.jsonl`
**State model:** `data/catalog/eu-hs6-catalog.json` (catalog version 0.2.0, schema v1)
**Coverage when batch opened:** 56 entries touched (31 normalized, 5 blocked_with_guidance, 20 in_queue)

### Processing instructions

For each code in the batch:
1. Query Access2Markets: `CA → DE` — record raw response in `data/raw/eu/`
2. All branches same base-duty outcome → normalize:
   - Add to `data/normalized/eu/tariff-records.json`
   - Update catalog entry: `state: "normalized"`, set `mfnRate`, `preferentialRate`, `agreement`, `classifierProfileId`
   - Add classifier profile to `backend/src/services/classification-service.ts`
   - Add regression test to `backend/src/routes/lookups.test.ts`
3. Branches diverge materially → block with guidance:
   - Update catalog entry: `state: "blocked_with_guidance"`, set `blockedReason`
   - Add to Ambiguity-Blocked Rows section below
4. After each code: update catalog `lastUpdatedAt`, append to metrics log
5. After batch: run `npm test`, update this file, select next batch via `select-eu-batch.ts`

### Queued codes (20)

| HS Code | Chapter | Description |
|---|---|---|
| `0901.12` | 09 | Coffee, not roasted, decaffeinated |
| `0901.22` | 09 | Coffee, roasted, decaffeinated |
| `0902.10` | 09 | Green tea (not fermented), immediate packings ≤ 3 kg |
| `0902.20` | 09 | Other green tea (not fermented) |
| `0902.30` | 09 | Black tea (fermented), immediate packings ≤ 3 kg |
| `0902.40` | 09 | Other black tea (fermented) |
| `4819.30` | 48 | Sacks and bags, base width ≥ 40 cm |
| `4820.10` | 48 | Registers, notebooks, account books (paper) |
| `6109.90` | 61 | T-shirts of other textile materials (knitted) |
| `6110.20` | 61 | Cotton jerseys, pullovers, sweatshirts (knitted) |
| `6110.30` | 61 | Man-made fibre jerseys and pullovers (knitted) |
| `6115.95` | 61 | Other cotton hosiery (knitted) |
| `6302.10` | 63 | Bedlinen, knitted or crocheted |
| `6302.21` | 63 | Cotton bedlinen, not knitted, not printed |
| `6304.91` | 63 | Cotton furnishing articles, not knitted |
| `7013.28` | 70 | Other drinking glasses (not glass-ceramics) |
| `7013.37` | 70 | Lead-crystal table/kitchen glassware |
| `9401.30` | 94 | Swivel seats with variable height adjustment |
| `9401.71` | 94 | Upholstered seats with metal frames |
| `9403.10` | 94 | Metal office furniture |
