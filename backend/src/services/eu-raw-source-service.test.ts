import { describe, expect, it } from "vitest";
import {
  buildEuRawSnapshotRelativePath,
  mergeEuRawSourcePackages,
} from "./eu-raw-source-service.js";

describe("mergeEuRawSourcePackages", () => {
  it("dedupes repeated query snapshots and preserves the latest record metadata", () => {
    const merged = mergeEuRawSourcePackages([
      {
        retrievedAt: "2026-03-13",
        source: "European Commission Access2Markets tariff endpoint",
        notes: ["first batch"],
        records: [
          {
            query: {
              product: "481920",
              origin: "CA",
              destination: "DE",
              lang: "EN",
            },
            endpoint: "https://example.test/481920",
            responseSummary: {
              branchDescriptions: ["Folding cartons"],
              sharedMeasuresOfInterest: [
                {
                  measureType: "103",
                  origin: "ERGA OMNES",
                  tariffFormula: "0%",
                },
                {
                  measureType: "142",
                  origin: "Canada",
                  tariffFormula: "0%",
                },
              ],
              notes: [],
            },
          },
        ],
      },
      {
        retrievedAt: "2026-03-16",
        source: "European Commission Access2Markets tariff endpoint",
        notes: ["second batch"],
        records: [
          {
            query: {
              product: "481920",
              origin: "CA",
              destination: "DE",
              lang: "EN",
            },
            endpoint: "https://example.test/481920-refresh",
            responseSummary: {
              branchDescriptions: ["Folding cartons", "Other cartons"],
              sharedMeasuresOfInterest: [
                {
                  measureType: "103",
                  origin: "ERGA OMNES",
                  tariffFormula: "0%",
                },
                {
                  measureType: "142",
                  origin: "Canada",
                  tariffFormula: "0%",
                },
              ],
              notes: [],
            },
          },
          {
            query: {
              product: "940370",
              origin: "CA",
              destination: "DE",
              lang: "EN",
            },
            endpoint: "https://example.test/940370",
            responseSummary: {
              branchDescriptions: ["Plastic furniture"],
              sharedMeasuresOfInterest: [
                {
                  measureType: "103",
                  origin: "ERGA OMNES",
                  tariffFormula: "0%",
                },
              ],
              notes: [],
            },
          },
        ],
      },
    ]);

    expect(merged.retrievedAt).toBe("2026-03-16");
    expect(merged.notes).toEqual(["first batch", "second batch"]);
    expect(merged.records).toHaveLength(2);
    expect(merged.records[0]).toMatchObject({
      query: {
        product: "481920",
      },
      endpoint: "https://example.test/481920-refresh",
      retrievedAt: "2026-03-16",
      source: "European Commission Access2Markets tariff endpoint",
    });
    expect(merged.records[1]).toMatchObject({
      query: {
        product: "940370",
      },
      retrievedAt: "2026-03-16",
    });
  });
});

describe("buildEuRawSnapshotRelativePath", () => {
  it("builds a stable batch filename from the intake label", () => {
    expect(
      buildEuRawSnapshotRelativePath({
        retrievedAt: "2026-03-16",
        label: "Household Goods Batch 1",
      }),
    ).toBe("data/raw/eu/access2markets-tariffs-2026-03-16-household-goods-batch-1.json");
  });
});
