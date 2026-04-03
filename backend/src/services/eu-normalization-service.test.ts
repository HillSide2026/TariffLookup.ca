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
  it("derives the official-snapshot normalized eu slice while allowing the live dataset to be ahead of the raw source package", async () => {
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
    expect(result.manualReview).toHaveLength(22);
    expect(result.manualReview.map((candidate) => candidate.hsCode)).toEqual([
      "4811.21",
      "4811.29",
      "4811.31",
      "4811.39",
      "4814.10",
      "6302.22",
      "6302.32",
      "6302.41",
      "6302.42",
      "6302.49",
      "6302.53",
      "6307.90",
      "7013.21",
      "7013.29",
      "7013.31",
      "7615.19",
      "8302.42",
      "9401.51",
      "9401.91",
      "9401.99",
      "9403.80",
      "9403.90",
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
    const currentCoreByHsCode = new Map(
      currentCore.map((record) => [record.hsCode, record]),
    );

    for (const record of normalizedCore) {
      expect(currentCoreByHsCode.get(record.hsCode)).toEqual(record);
    }

    const liveOnlyHsCodes = currentCore
      .filter((record) => !normalizedCore.some((candidate) => candidate.hsCode === record.hsCode))
      .map((record) => record.hsCode);

    expect(liveOnlyHsCodes).toEqual([
      "090112",
      "090122",
      "090210",
      "090220",
      "090230",
      "090240",
      "481930",
      "482010",
      "610990",
      "611020",
      "611030",
      "611595",
      "630210",
      "630221",
      "630491",
      "940130",
      "940171",
      "940310",
    ]);
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
