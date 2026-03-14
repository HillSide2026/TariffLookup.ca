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

## Ambiguity-Blocked Rows

- `0811.90`
  Current state: blocked
  Why blocked: official EU source returns multiple frozen-fruit branches with materially different duty formulas
  More detail needed: exact fruit, added sugar or spirit, prepared form, branch-narrowing specs

- `8501.52`
  Current state: blocked
  Why blocked: official EU source returns multiple motor branches and end-use contexts
  More detail needed: application, power rating, current type, whether imported alone or within a larger machine, special end-use treatment

## Explicit Prototype Fallback

- `8479.89`
  Current state: explicit seed fallback
  Why retained: low-confidence catch-all for uncovered EU prototype requests that do not map to a normalized row

## Next Safe Candidates

- add more high-signal furniture and consumer-goods rows only where all returned EU branches share the same base-duty outcome
- do not collapse official EU rows when branch duties diverge or when end-use distinctions change the tariff result
- prioritize rows that improve common packaging, machinery-component, apparel-accessory, and household-goods coverage without reopening ambiguity already called out above
