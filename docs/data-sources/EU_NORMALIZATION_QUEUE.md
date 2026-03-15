# EU Normalization Queue

This file tracks the European Union Step 3 queue against the current prototype behavior.

## Verified Local Rows

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

## Next Safe Candidates

- add more high-signal furniture and consumer-goods rows only where all returned EU branches share the same base-duty outcome
- do not collapse official EU rows when branch duties diverge or when end-use distinctions change the tariff result
- prioritize rows that improve common packaging, apparel, household-goods, and tableware coverage without reopening ambiguity already called out above
- prefer new rows that can be paired with strict positive and negative classifier rules when the official EU branch wording is generic
