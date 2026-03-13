import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import type {
  LookupCoverageStatus,
  LookupDetailRequest,
  LookupSourceTier,
} from "../contracts/lookup.js";
import type { TariffRecord } from "../contracts/tariff-record.js";
import { tariffRecordDatasetSchema } from "../contracts/tariff-record.js";
import { canonicalizeHsCode } from "./classification-service.js";
import { getEuAmbiguityGuidance } from "./eu-coverage-service.js";

const seedDatasetPath = fileURLToPath(
  new URL("../../../data/seed/tariff-records.json", import.meta.url),
);
const euNormalizedDatasetPath = fileURLToPath(
  new URL("../../../data/normalized/eu/tariff-records.json", import.meta.url),
);

let cachedTariffRecords: TariffRecord[] | null = null;
let cachedEuNormalizedTariffRecords: TariffRecord[] | null = null;

export type TariffRecordLookupResult =
  | {
      kind: "resolved";
      record: TariffRecord;
      dataSource: LookupSourceTier;
      coverageStatus: LookupCoverageStatus;
      coverageNote: string;
    }
  | {
      kind: "needs-more-detail";
      detailRequest: Omit<LookupDetailRequest, "probableHsCode" | "classificationRationale">;
    };

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
}): Promise<TariffRecordLookupResult | null> {
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
      kind: "resolved",
      record: euNormalizedMatch,
      dataSource: "local-normalized-data" as const,
      coverageStatus: "normalized-record" as const,
      coverageNote:
        "Matched a verified European Union normalized tariff row sourced from the official Access2Markets package.",
    };
  }

  if (input.destinationCountry === "European Union") {
    const detailRequest = getEuAmbiguityGuidance(input.hsCode);

    if (detailRequest) {
      return {
        kind: "needs-more-detail",
        detailRequest,
      };
    }
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
    kind: "resolved",
    record: seedMatch,
    dataSource: "seed-demo-data" as const,
    coverageStatus: "seed-fallback" as const,
    coverageNote:
      input.destinationCountry === "European Union"
        ? `No verified EU normalized row exists for HS code ${input.hsCode} yet, so the prototype returned the internal seed/demo fallback dataset.`
        : "This destination is still served from the internal seed/demo dataset while real-data integration stays focused on the European Union.",
  };
}
