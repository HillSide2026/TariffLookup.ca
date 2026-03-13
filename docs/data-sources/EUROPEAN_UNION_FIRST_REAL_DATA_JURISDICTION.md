# European Union First Real-Data Jurisdiction

The European Union is the selected first jurisdiction for Step 3 real-data integration.

Why this is the first target:

- it is already in active MVP scope
- it is a high-value destination market for Canadian exporters
- it provides a strong first test case for agreement-aware tariff handling under the current product direction

What Step 3 should deliver for this jurisdiction:

- a documented source package for European Union tariff records
- a normalized local data shape that maps into the existing lookup response contract
- at least one end-to-end lookup path that returns a real European Union tariff result instead of seed/demo data
- clear provenance, effective date handling, and notes about data limitations

What this does not mean yet:

- no real database is required for this stage
- no external tariff API is required for this stage
- no other jurisdiction needs to be productionized before the European Union path is working

Immediate implementation implication:

- any first real-data ingestion, normalization, and lookup replacement work should be centered on the European Union before expanding outward
