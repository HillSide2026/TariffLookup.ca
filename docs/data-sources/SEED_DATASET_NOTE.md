# Seed Dataset Note

The current tariff lookup prototype is backed by a local seed/demo dataset at `data/seed/tariff-records.json`.

This dataset is intentionally limited and is not authoritative tariff intelligence.

Use it as:

- a prototype lookup source for UI and API development
- a contract fixture for tests
- a placeholder structure for future normalization and source-ingestion work

Do not use it as:

- a production tariff schedule
- legal, customs, or trade-compliance advice
- a substitute for validated jurisdiction-specific tariff research

Current characteristics:

- records are manually seeded for prototype purposes
- values are labeled as seed/demo data in both code and UI
- some markets appear in the seed file to support prototype coverage even if they are outside the currently emphasized MVP market set
- the backend reads the file locally; there is no external tariff API or real database integration in this stage
