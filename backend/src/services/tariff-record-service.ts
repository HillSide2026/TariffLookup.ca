import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import type { TariffRecord } from "../contracts/tariff-record.js";
import { tariffRecordDatasetSchema } from "../contracts/tariff-record.js";
import { canonicalizeHsCode } from "./classification-service.js";

const seedDatasetPath = fileURLToPath(
  new URL("../../../data/seed/tariff-records.json", import.meta.url),
);
const euNormalizedDatasetPath = fileURLToPath(
  new URL("../../../data/normalized/eu/tariff-records.json", import.meta.url),
);

let cachedTariffRecords: TariffRecord[] | null = null;
let cachedEuNormalizedTariffRecords: TariffRecord[] | null = null;

export async function loadTariffRecords() {
  if (cachedTariffRecords) {
    return cachedTariffRecords;
  }

  const rawDataset = await readFile(seedDatasetPath, "utf8");
  const parsedDataset = JSON.parse(rawDataset) as unknown;

  cachedTariffRecords = tariffRecordDatasetSchema.parse(parsedDataset);

  return cachedTariffRecords;
}

export async function loadEuNormalizedTariffRecords() {
  if (cachedEuNormalizedTariffRecords) {
    return cachedEuNormalizedTariffRecords;
  }

  const rawDataset = await readFile(euNormalizedDatasetPath, "utf8");
  const parsedDataset = JSON.parse(rawDataset) as unknown;

  cachedEuNormalizedTariffRecords = tariffRecordDatasetSchema.parse(parsedDataset);

  return cachedEuNormalizedTariffRecords;
}

export async function findTariffRecord(input: {
  hsCode: string;
  destinationCountry: string;
}) {
  const tariffRecords = await loadTariffRecords();
  const canonicalHsCode = canonicalizeHsCode(input.hsCode);
  const euNormalizedRecords =
    input.destinationCountry === "European Union"
      ? await loadEuNormalizedTariffRecords()
      : [];
  const euNormalizedMatch = euNormalizedRecords.find(
    (record) =>
      record.destinationCountry === input.destinationCountry &&
      canonicalizeHsCode(record.hsCode) === canonicalHsCode,
  );

  if (euNormalizedMatch) {
    return {
      record: euNormalizedMatch,
      dataSource: "local-normalized-data" as const,
    };
  }

  const seedMatch =
    tariffRecords.find(
      (record) =>
        record.destinationCountry === input.destinationCountry &&
        canonicalizeHsCode(record.hsCode) === canonicalHsCode,
    ) || null;

  if (!seedMatch) {
    return null;
  }

  return {
    record: seedMatch,
    dataSource: "seed-demo-data" as const,
  };
}
