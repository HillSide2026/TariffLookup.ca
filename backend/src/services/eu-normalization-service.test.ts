import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { canonicalizeHsCode } from "./classification-service.js";
import { loadMergedEuRawSourcePackage } from "./eu-raw-source-service.js";
import { normalizeEuSourcePackage } from "./eu-normalization-service.js";

const normalizedDatasetPath = fileURLToPath(
  new URL("../../../data/normalized/eu/tariff-records.json", import.meta.url),
);

describe("normalizeEuSourcePackage", () => {
  it("derives the current normalized eu slice, blocked codes, and manual-review queue from the official snapshot", async () => {
    const { sourcePackage } = await loadMergedEuRawSourcePackage();
    const currentNormalizedDataset = JSON.parse(
      await readFile(normalizedDatasetPath, "utf8"),
    ) as Array<{
      hsCode: string;
      mfnRate: string;
      preferentialRate: string;
      agreement: string;
    }>;

    const result = normalizeEuSourcePackage(sourcePackage);

    expect(result.blocked).toHaveLength(1);
    expect(result.blocked[0]).toMatchObject({
      hsCode: "6307.10",
      productCode: "630710",
    });
    expect(result.manualReview).toHaveLength(2);
    expect(result.manualReview.map((candidate) => candidate.hsCode)).toEqual([
      "6302.53",
      "7615.19",
    ]);

    const normalizedCore = result.normalized.map((candidate) => ({
      hsCode: canonicalizeHsCode(candidate.record.hsCode),
      mfnRate: candidate.record.mfnRate,
      preferentialRate: candidate.record.preferentialRate,
      agreement: candidate.record.agreement,
    })).sort((left, right) => left.hsCode.localeCompare(right.hsCode));
    const currentCore = currentNormalizedDataset.map((record) => ({
      hsCode: canonicalizeHsCode(record.hsCode),
      mfnRate: record.mfnRate,
      preferentialRate: record.preferentialRate,
      agreement: record.agreement,
    })).sort((left, right) => left.hsCode.localeCompare(right.hsCode));

    expect(normalizedCore).toEqual(currentCore);
  });

  it("uses manual overrides for narrow generic-branch rows that are now safely exposed", async () => {
    const { sourcePackage } = await loadMergedEuRawSourcePackage();
    const result = normalizeEuSourcePackage(sourcePackage);

    expect(
      result.normalized.find((candidate) => candidate.record.hsCode === "4419.90"),
    ).toMatchObject({
      reviewMode: "manual-override",
    });
    expect(
      result.normalized.find((candidate) => candidate.record.hsCode === "7615.10"),
    ).toMatchObject({
      reviewMode: "manual-override",
    });
    expect(
      result.normalized.find((candidate) => candidate.record.hsCode === "9401.69"),
    ).toMatchObject({
      reviewMode: "manual-override",
    });
    expect(
      result.normalized.find((candidate) => candidate.record.hsCode === "8306.29"),
    ).toMatchObject({
      reviewMode: "manual-override",
    });
  });
});
