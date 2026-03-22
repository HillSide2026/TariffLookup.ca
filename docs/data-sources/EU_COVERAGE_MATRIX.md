# EU HS-6 Coverage Matrix

**Catalog version:** 0.2.0
**Schema version:** v1
**Basis:** HS 2022
**Effective date:** 2026-03-22
**Authoritative source:** `data/catalog/eu-hs6-catalog.json`
**Active batch:** `batch-2026-03-22-a` (in_queue — 20 codes pending Access2Markets fetch)

This matrix is derived from the catalog. Update the catalog file first; regenerate this view from it.

## Gate Requirement

All four conditions must be true before the EU MVP is considered complete:

- `active_eu_hs6_catalog_count >= 5000` → **current: 56 touched of ~5,224 estimated** (1.1%)
  - 31 normalized, 5 blocked_with_guidance, 20 in_queue
- Every catalog entry resolves to a terminal state: `normalized`, `blocked_with_guidance`, or `manual_review`
- No active-catalog EU lookup depends on an unsafe seed fallback when it should be categorized explicitly
- Normalized rows, blocked guidance, manual-review tracking, tests, and queue documentation are in sync

## State Legend

| State | Meaning |
|---|---|
| `normalized` | Verified EU row, live in `data/normalized/eu/tariff-records.json` |
| `blocked_with_guidance` | System returns detail request; cannot normalize without more info |
| `manual_review` | Not resolvable automatically; tracked explicitly |
| `in_queue` | Selected for next fetch batch; Access2Markets query not yet run |
| `not_started` | Not yet touched; counted via chapter estimates only |

## Overall Coverage

| Metric | Count | Of Estimated Total |
|---|---|---|
| Normalized (live, verified) | 31 | 31 / 5,224 = 0.6% |
| Blocked-with-guidance | 5 | 5 / 5,224 = 0.1% |
| Manual review | 0 | — |
| In queue (batch-2026-03-22-a) | 20 | 20 / 5,224 = 0.4% |
| Not yet started | ~5,168 | ~98.9% |
| **Total touched entries** | **56** | **1.1%** |

## Coverage by HS Section

### Section I — Live Animals and Animal Products (Chapters 01–05)

| Chapter | Description | Est. Subheadings | Normalized | Blocked | Manual Review | Not Yet Rep. |
|---|---|---|---|---|---|---|
| 01 | Live animals | 7 | 0 | 0 | 0 | 7 |
| 02 | Meat and edible meat offal | 53 | 0 | 0 | 0 | 53 |
| 03 | Fish and crustaceans | 61 | 0 | 0 | 0 | 61 |
| 04 | Dairy, eggs, honey | 22 | 0 | 0 | 0 | 22 |
| 05 | Other animal products | 15 | 0 | 0 | 0 | 15 |
| **Section I total** | | **158** | **0** | **0** | **0** | **158** |

### Section II — Vegetable Products (Chapters 06–14)

| Chapter | Description | Est. Subheadings | Normalized | Blocked | In Queue | Not Yet Rep. |
|---|---|---|---|---|---|---|
| 06 | Live trees and plants | 6 | 0 | 0 | 0 | 6 |
| 07 | Edible vegetables | 54 | 0 | 0 | 0 | 54 |
| **08** | **Edible fruit and nuts** | **46** | **0** | **1** | **0** | **45** |
| **09** | **Coffee, tea, spices** | **22** | **1** | **0** | **6** | **15** |
| 10 | Cereals | 12 | 0 | 0 | 0 | 12 |
| 11 | Milling products | 17 | 0 | 0 | 0 | 17 |
| 12 | Oil seeds, misc grains | 23 | 0 | 0 | 0 | 23 |
| 13 | Lacs, gums, resins | 6 | 0 | 0 | 0 | 6 |
| 14 | Vegetable plaiting materials | 4 | 0 | 0 | 0 | 4 |
| **Section II total** | | **190** | **1** | **1** | **6** | **182** |

Active codes in Section II:
- `0811.90` — **blocked_with_guidance** (multiple frozen-fruit branches, duty formulas diverge)
- `0901.21` — **normalized** (roasted coffee, 7.5% MFN / 0% CETA)
- `0901.12`, `0901.22`, `0902.10`, `0902.20`, `0902.30`, `0902.40` — **in_queue** (batch-2026-03-22-a)

### Section III — Animal or Vegetable Fats (Chapter 15)

| Chapter | Description | Est. Subheadings | Normalized | Blocked | Manual Review | Not Yet Rep. |
|---|---|---|---|---|---|---|
| 15 | Animal or vegetable fats and oils | 34 | 0 | 0 | 0 | 34 |
| **Section III total** | | **34** | **0** | **0** | **0** | **34** |

### Section IV — Food Preparations (Chapters 16–24)

| Chapter | Description | Est. Subheadings | Normalized | Blocked | Manual Review | Not Yet Rep. |
|---|---|---|---|---|---|---|
| 16 | Preparations of meat | 12 | 0 | 0 | 0 | 12 |
| 17 | Sugars and confectionery | 14 | 0 | 0 | 0 | 14 |
| 18 | Cocoa preparations | 8 | 0 | 0 | 0 | 8 |
| 19 | Cereal/flour/starch preparations | 17 | 0 | 0 | 0 | 17 |
| 20 | Preparations of vegetables/fruit | 34 | 0 | 0 | 0 | 34 |
| 21 | Miscellaneous food preparations | 14 | 0 | 0 | 0 | 14 |
| 22 | Beverages, spirits, vinegar | 20 | 0 | 0 | 0 | 20 |
| 23 | Food industry residues | 10 | 0 | 0 | 0 | 10 |
| 24 | Tobacco | 8 | 0 | 0 | 0 | 8 |
| **Section IV total** | | **137** | **0** | **0** | **0** | **137** |

### Section V — Mineral Products (Chapters 25–27)

| Chapter | Description | Est. Subheadings | Normalized | Blocked | Manual Review | Not Yet Rep. |
|---|---|---|---|---|---|---|
| 25 | Salt, sulphur, stone | 40 | 0 | 0 | 0 | 40 |
| 26 | Ores, slag and ash | 21 | 0 | 0 | 0 | 21 |
| 27 | Mineral fuels | 36 | 0 | 0 | 0 | 36 |
| **Section V total** | | **97** | **0** | **0** | **0** | **97** |

### Section VI — Chemical Products (Chapters 28–38)

| Chapter | Description | Est. Subheadings | Normalized | Blocked | Manual Review | Not Yet Rep. |
|---|---|---|---|---|---|---|
| 28 | Inorganic chemicals | 165 | 0 | 0 | 0 | 165 |
| 29 | Organic chemicals | 1020 | 0 | 0 | 0 | 1020 |
| 30 | Pharmaceutical products | 16 | 0 | 0 | 0 | 16 |
| 31 | Fertilisers | 14 | 0 | 0 | 0 | 14 |
| 32 | Tanning and dyeing | 22 | 0 | 0 | 0 | 22 |
| 33 | Essential oils, cosmetics | 16 | 0 | 0 | 0 | 16 |
| 34 | Soap, waxes, polishes | 12 | 0 | 0 | 0 | 12 |
| 35 | Albuminoidal substances, glues | 12 | 0 | 0 | 0 | 12 |
| 36 | Explosives, pyrotechnics | 8 | 0 | 0 | 0 | 8 |
| 37 | Photographic goods | 8 | 0 | 0 | 0 | 8 |
| 38 | Miscellaneous chemical products | 65 | 0 | 0 | 0 | 65 |
| **Section VI total** | | **1,358** | **0** | **0** | **0** | **1,358** |

### Section VII — Plastics and Rubber (Chapters 39–40)

| Chapter | Description | Est. Subheadings | Normalized | Blocked | Manual Review | Not Yet Rep. |
|---|---|---|---|---|---|---|
| **39** | **Plastics and articles thereof** | **93** | **5** | **0** | **0** | **88** |
| 40 | Rubber and articles thereof | 37 | 0 | 0 | 0 | 37 |
| **Section VII total** | | **130** | **5** | **0** | **0** | **125** |

Active codes in Chapter 39:
- `3923.21` — **normalized** (polyethylene sacks/bags, 6.5% MFN / 0% CETA)
- `3923.29` — **normalized** (other-plastic sacks/bags, 6.5% MFN / 0% CETA)
- `3923.30` — **normalized** (plastic bottles and flasks, 6.5% MFN / 0% CETA)
- `3924.10` — **normalized** (plastic tableware/kitchenware, 6.5% MFN / 0% CETA)
- `3924.90` — **normalized** (other plastic household articles, 6.5% MFN / 0% CETA)

### Section VIII — Leather (Chapters 41–43)

| Chapter | Description | Est. Subheadings | Normalized | Blocked | Manual Review | Not Yet Rep. |
|---|---|---|---|---|---|---|
| 41 | Raw hides and skins, leather | 14 | 0 | 0 | 0 | 14 |
| 42 | Articles of leather | 16 | 0 | 0 | 0 | 16 |
| 43 | Furskins | 11 | 0 | 0 | 0 | 11 |
| **Section VIII total** | | **41** | **0** | **0** | **0** | **41** |

### Section IX — Wood and Articles (Chapters 44–46)

| Chapter | Description | Est. Subheadings | Normalized | Blocked | Manual Review | Not Yet Rep. |
|---|---|---|---|---|---|---|
| **44** | **Wood and articles of wood** | **50** | **1** | **0** | **0** | **49** |
| 45 | Cork and articles of cork | 7 | 0 | 0 | 0 | 7 |
| 46 | Straw, basketwork | 5 | 0 | 0 | 0 | 5 |
| **Section IX total** | | **62** | **1** | **0** | **0** | **61** |

Active codes in Chapter 44:
- `4419.90` — **normalized** (wooden tableware/kitchenware, 0% MFN / 0% CETA)

### Section X — Pulp, Paper (Chapters 47–49)

| Chapter | Description | Est. Subheadings | Normalized | Blocked | In Queue | Not Yet Rep. |
|---|---|---|---|---|---|---|
| 47 | Pulp of wood | 10 | 0 | 0 | 0 | 10 |
| **48** | **Paper and paperboard** | **74** | **4** | **0** | **2** | **68** |
| 49 | Printed books, newspapers | 16 | 0 | 0 | 0 | 16 |
| **Section X total** | | **100** | **4** | **0** | **2** | **94** |

Active codes in Chapter 48:
- `4819.10` — **normalized** (corrugated cartons/boxes, 0% MFN / 0% CETA)
- `4819.20` — **normalized** (folding non-corrugated cartons, 0% MFN / 0% CETA)
- `4819.40` — **normalized** (other paper sacks and bags, 0% MFN / 0% CETA)
- `4823.69` — **normalized** (paper table articles, 0% MFN / 0% CETA)
- `4819.30`, `4820.10` — **in_queue** (batch-2026-03-22-a)

### Section XI — Textiles (Chapters 50–63)

| Chapter | Description | Est. Subheadings | Normalized | Blocked | In Queue | Not Yet Rep. |
|---|---|---|---|---|---|---|
| 50 | Silk | 16 | 0 | 0 | 0 | 16 |
| 51 | Wool, fine animal hair | 24 | 0 | 0 | 0 | 24 |
| 52 | Cotton | 58 | 0 | 0 | 0 | 58 |
| 53 | Other vegetable textile fibres | 13 | 0 | 0 | 0 | 13 |
| 54 | Man-made filaments | 34 | 0 | 0 | 0 | 34 |
| 55 | Man-made staple fibres | 37 | 0 | 0 | 0 | 37 |
| 56 | Wadding, felt, nonwovens | 12 | 0 | 0 | 0 | 12 |
| 57 | Carpets | 8 | 0 | 0 | 0 | 8 |
| 58 | Special woven fabrics, lace | 12 | 0 | 0 | 0 | 12 |
| 59 | Impregnated fabrics | 13 | 0 | 0 | 0 | 13 |
| 60 | Knitted/crocheted fabrics | 7 | 0 | 0 | 0 | 7 |
| **61** | **Knitted/crocheted apparel** | **46** | **1** | **0** | **4** | **41** |
| 62 | Woven apparel | 55 | 0 | 0 | 0 | 55 |
| **63** | **Other made-up textile articles** | **27** | **3** | **1** | **3** | **20** |
| **Section XI total** | | **362** | **4** | **1** | **7** | **350** |

Active codes in Chapter 61:
- `6109.10` — **normalized** (cotton T-shirts, 12% MFN / 0% CETA)
- `6109.90`, `6110.20`, `6110.30`, `6115.95` — **in_queue** (batch-2026-03-22-a)

Active codes in Chapter 63:
- `6302.31` — **normalized** (cotton bedlinen printed, 12% MFN / 0% CETA)
- `6302.60` — **normalized** (terry towels and kitchen linen, 12% MFN / 0% CETA)
- `6302.91` — **normalized** (cotton table and kitchen linen, 12% MFN / 0% CETA)
- `6307.10` — **blocked_with_guidance** (cleaning cloths; fabric construction/material required)
- `6302.10`, `6302.21`, `6304.91` — **in_queue** (batch-2026-03-22-a)

### Section XII — Footwear, Headgear (Chapters 64–67)

| Chapter | Description | Est. Subheadings | Normalized | Blocked | Manual Review | Not Yet Rep. |
|---|---|---|---|---|---|---|
| 64 | Footwear | 16 | 0 | 0 | 0 | 16 |
| 65 | Headgear | 8 | 0 | 0 | 0 | 8 |
| 66 | Umbrellas, walking-sticks | 5 | 0 | 0 | 0 | 5 |
| 67 | Feathers, artificial flowers | 7 | 0 | 0 | 0 | 7 |
| **Section XII total** | | **36** | **0** | **0** | **0** | **36** |

### Section XIII — Stone, Ceramics, Glass (Chapters 68–70)

| Chapter | Description | Est. Subheadings | Normalized | Blocked | In Queue | Not Yet Rep. |
|---|---|---|---|---|---|---|
| 68 | Articles of stone, plaster, cement | 23 | 0 | 0 | 0 | 23 |
| **69** | **Ceramic products** | **16** | **1** | **1** | **0** | **14** |
| **70** | **Glass and glassware** | **29** | **1** | **0** | **2** | **26** |
| **Section XIII total** | | **68** | **2** | **1** | **2** | **63** |

Active codes in Chapter 69:
- `6911.10` — **normalized** (porcelain/china tableware, 12% MFN / 0% CETA)
- `6912.00` — **blocked_with_guidance** (other ceramic tableware; material type required)

Active codes in Chapter 70:
- `7013.49` — **normalized** (other table glassware, 11% MFN / 0% CETA)
- `7013.28`, `7013.37` — **in_queue** (batch-2026-03-22-a)

### Section XIV — Precious Metals (Chapter 71)

| Chapter | Description | Est. Subheadings | Normalized | Blocked | Manual Review | Not Yet Rep. |
|---|---|---|---|---|---|---|
| 71 | Jewelry, precious metals | 37 | 0 | 0 | 0 | 37 |
| **Section XIV total** | | **37** | **0** | **0** | **0** | **37** |

### Section XV — Base Metals (Chapters 72–83)

| Chapter | Description | Est. Subheadings | Normalized | Blocked | Manual Review | Not Yet Rep. |
|---|---|---|---|---|---|---|
| 72 | Iron and steel | 65 | 0 | 0 | 0 | 65 |
| **73** | **Articles of iron or steel** | **64** | **1** | **0** | **0** | **63** |
| 74 | Copper and articles | 30 | 0 | 0 | 0 | 30 |
| 75 | Nickel and articles | 12 | 0 | 0 | 0 | 12 |
| **76** | **Aluminium and articles** | **28** | **2** | **0** | **0** | **26** |
| 77 | Reserved | 0 | — | — | — | — |
| 78 | Lead and articles | 8 | 0 | 0 | 0 | 8 |
| 79 | Zinc and articles | 9 | 0 | 0 | 0 | 9 |
| 80 | Tin and articles | 7 | 0 | 0 | 0 | 7 |
| 81 | Other base metals | 20 | 0 | 0 | 0 | 20 |
| **82** | **Tools, cutlery** | **30** | **1** | **1** | **0** | **28** |
| **83** | **Miscellaneous metal articles** | **27** | **2** | **0** | **0** | **25** |
| **Section XV total** | | **300** | **6** | **1** | **0** | **293** |

Active codes in Chapter 73:
- `7323.93` — **normalized** (stainless steel household articles, 3.2% MFN / 0% CETA)

Active codes in Chapter 76:
- `7615.10` — **normalized** (aluminium household/kitchen articles, 6% MFN / 0% CETA)
- `7615.20` — **normalized** (aluminium sanitary ware, 6% MFN / 0% CETA)

Active codes in Chapter 82:
- `8208.30` — **normalized** (kitchen/machine knives and blades, 1.7% MFN / 0% CETA)
- `8215.99` — **blocked-with-guidance** (kitchen utensils; stainless-steel vs other material required)

Active codes in Chapter 83:
- `8302.50` — **normalized** (metal hooks and brackets, 2.7% MFN / 0% CETA)
- `8306.29` — **normalized** (decorative metal ornaments, 0% MFN / 0% CETA)

### Section XVI — Machinery (Chapters 84–85)

| Chapter | Description | Est. Subheadings | Normalized | Blocked | Manual Review | Not Yet Rep. |
|---|---|---|---|---|---|---|
| 84 | Nuclear reactors, boilers, machinery | 614 | 0 | 0 | 0 | 614 |
| **85** | **Electrical machinery and equipment** | **282** | **0** | **1** | **0** | **281** |
| **Section XVI total** | | **896** | **0** | **1** | **0** | **895** |

Active codes in Chapter 85:
- `8501.52` — **blocked-with-guidance** (AC multi-phase motors; motor application and end-use required)

Note: `8479.89` (Chapter 84) is the explicit seed-fallback catch-all. It is not an active catalog entry; it is a prototype placeholder retained until coverage is sufficient.

### Section XVII — Transport (Chapters 86–89)

| Chapter | Description | Est. Subheadings | Normalized | Blocked | Manual Review | Not Yet Rep. |
|---|---|---|---|---|---|---|
| 86 | Railway rolling-stock | 11 | 0 | 0 | 0 | 11 |
| 87 | Vehicles | 49 | 0 | 0 | 0 | 49 |
| 88 | Aircraft, spacecraft | 10 | 0 | 0 | 0 | 10 |
| 89 | Ships and boats | 13 | 0 | 0 | 0 | 13 |
| **Section XVII total** | | **83** | **0** | **0** | **0** | **83** |

### Section XVIII — Instruments (Chapters 90–92)

| Chapter | Description | Est. Subheadings | Normalized | Blocked | Manual Review | Not Yet Rep. |
|---|---|---|---|---|---|---|
| 90 | Optical, measuring, medical instruments | 90 | 0 | 0 | 0 | 90 |
| 91 | Clocks and watches | 18 | 0 | 0 | 0 | 18 |
| 92 | Musical instruments | 13 | 0 | 0 | 0 | 13 |
| **Section XVIII total** | | **121** | **0** | **0** | **0** | **121** |

### Section XIX — Arms (Chapter 93)

| Chapter | Description | Est. Subheadings | Normalized | Blocked | Manual Review | Not Yet Rep. |
|---|---|---|---|---|---|---|
| 93 | Arms and ammunition | 12 | 0 | 0 | 0 | 12 |
| **Section XIX total** | | **12** | **0** | **0** | **0** | **12** |

### Section XX — Miscellaneous Manufactures (Chapters 94–96)

| Chapter | Description | Est. Subheadings | Normalized | Blocked | In Queue | Not Yet Rep. |
|---|---|---|---|---|---|---|
| **94** | **Furniture, bedding, lighting** | **40** | **8** | **0** | **3** | **29** |
| 95 | Toys, games, sports equipment | 17 | 0 | 0 | 0 | 17 |
| 96 | Miscellaneous manufactured articles | 26 | 0 | 0 | 0 | 26 |
| **Section XX total** | | **83** | **8** | **0** | **3** | **72** |

Active codes in Chapter 94:
- `9401.61` — **normalized** (upholstered seats w/ wooden frame, 0% MFN / 0% CETA)
- `9401.69` — **normalized** (other seats w/ wooden frame, 0% MFN / 0% CETA)
- `9403.20` — **normalized** (other metal furniture, 0% MFN / 0% CETA)
- `9403.30` — **normalized** (wooden office furniture, 0% MFN / 0% CETA)
- `9403.40` — **normalized** (wooden kitchen furniture, 2.7% MFN / 0% CETA)
- `9403.50` — **normalized** (wooden bedroom furniture, 0% MFN / 0% CETA)
- `9403.60` — **normalized** (other wooden furniture, 0% MFN / 0% CETA)
- `9403.70` — **normalized** (furniture of plastics, 0% MFN / 0% CETA)
- `9401.30`, `9401.71`, `9403.10` — **in_queue** (batch-2026-03-22-a)

### Section XXI — Works of Art (Chapter 97)

| Chapter | Description | Est. Subheadings | Normalized | Blocked | Manual Review | Not Yet Rep. |
|---|---|---|---|---|---|---|
| 97 | Works of art, collectors' pieces | 7 | 0 | 0 | 0 | 7 |
| **Section XXI total** | | **7** | **0** | **0** | **0** | **7** |

## Summary Table: All Sections

| Section | Chapters | Est. Subheadings | Normalized | Blocked | In Queue | Not Yet Rep. | Touched % |
|---|---|---|---|---|---|---|---|
| I | 01–05 | 158 | 0 | 0 | 0 | 158 | 0% |
| II | 06–14 | 190 | 1 | 1 | 6 | 182 | 4.2% |
| III | 15 | 34 | 0 | 0 | 0 | 34 | 0% |
| IV | 16–24 | 137 | 0 | 0 | 0 | 137 | 0% |
| V | 25–27 | 97 | 0 | 0 | 0 | 97 | 0% |
| VI | 28–38 | 1,358 | 0 | 0 | 0 | 1,358 | 0% |
| VII | 39–40 | 130 | 5 | 0 | 0 | 125 | 3.8% |
| VIII | 41–43 | 41 | 0 | 0 | 0 | 41 | 0% |
| IX | 44–46 | 62 | 1 | 0 | 0 | 61 | 1.6% |
| X | 47–49 | 100 | 4 | 0 | 2 | 94 | 6.0% |
| XI | 50–63 | 362 | 4 | 1 | 7 | 350 | 3.3% |
| XII | 64–67 | 36 | 0 | 0 | 0 | 36 | 0% |
| XIII | 68–70 | 68 | 2 | 1 | 2 | 63 | 7.4% |
| XIV | 71 | 37 | 0 | 0 | 0 | 37 | 0% |
| XV | 72–83 | 300 | 6 | 1 | 0 | 293 | 2.3% |
| XVI | 84–85 | 896 | 0 | 1 | 0 | 895 | 0.1% |
| XVII | 86–89 | 83 | 0 | 0 | 0 | 83 | 0% |
| XVIII | 90–92 | 121 | 0 | 0 | 0 | 121 | 0% |
| XIX | 93 | 12 | 0 | 0 | 0 | 12 | 0% |
| XX | 94–96 | 83 | 8 | 0 | 3 | 72 | 13.3% |
| XXI | 97 | 7 | 0 | 0 | 0 | 7 | 0% |
| **Total** | | **~3,915*** | **31** | **5** | **20** | **~3,859** | **1.4%** |

*The chapter-level estimated subtotals sum to ~3,915. The WCO-published HS 2022 total is 5,224; the difference (~1,309) is distributed across chapters with many fine-grained subheadings, primarily Chapter 29 (organic chemicals) and Chapters 84–85 (machinery). The `data/catalog/eu-hs6-catalog.json` file uses 5,224 as the authoritative floor target and Chapter 29 is estimated at 1,020 subheadings to partially account for this. Individual chapter counts will be refined chapter-by-chapter as Access2Markets queries are made.*

## Active Batch: batch-2026-03-22-a

**Status:** in_queue — 20 codes selected, Access2Markets fetch not yet run.
**Manifest:** `data/catalog/batches/batch-2026-03-22-a.json`
**Metrics:** `data/catalog/eu-coverage-metrics.jsonl`

Target chapters: 09 (6 codes), 61 (4 codes), 63 (3 codes), 48 (2 codes), 70 (2 codes), 94 (3 codes).

When this batch completes, the touched-entries count will move from 56 toward 76, and normalized count could reach up to 51 if all 20 codes are clean-branch outcomes.

## Sync Rules

This file should be regenerated whenever:
- A code is added to `data/normalized/eu/tariff-records.json`
- A code is added to or removed from the blocked or manual-review sections of `docs/data-sources/EU_NORMALIZATION_QUEUE.md`
- `data/catalog/eu-hs6-catalog.json` is updated
