import { readFile, writeFile } from "node:fs/promises";
import type { TariffRecord } from "../contracts/tariff-record.js";
import { canonicalizeHsCode } from "../services/classification-service.js";
import {
  loadMergedEuRawSourcePackage,
  resolveRepoFile,
} from "../services/eu-raw-source-service.js";
import { normalizeEuSourcePackage } from "../services/eu-normalization-service.js";

const normalizedDatasetPath = resolveRepoFile(
  "data/normalized/eu/tariff-records.json",
);

type NormalizeCliOptions = {
  write: boolean;
};

function parseArgs(argv: string[]): NormalizeCliOptions {
  return {
    write: argv.includes("--write"),
  };
}

function getCoreRecord(record: {
  hsCode: string;
  mfnRate: string;
  preferentialRate: string;
  agreement: string;
}) {
  return {
    hsCode: canonicalizeHsCode(record.hsCode),
    mfnRate: record.mfnRate,
    preferentialRate: record.preferentialRate,
    agreement: record.agreement,
  };
}

function sortTariffRecords(records: TariffRecord[]) {
  return [...records].sort((left, right) =>
    canonicalizeHsCode(left.hsCode).localeCompare(canonicalizeHsCode(right.hsCode)),
  );
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const { loadedArtifacts, sourcePackage } = await loadMergedEuRawSourcePackage();
  const currentNormalizedDataset = JSON.parse(
    await readFile(normalizedDatasetPath, "utf8"),
  ) as TariffRecord[];
  const result = normalizeEuSourcePackage(sourcePackage);
  const generatedRecords = result.normalized.map((candidate) => candidate.record);
  const generatedCore = generatedRecords.map((record) => getCoreRecord(record));
  const currentCore = currentNormalizedDataset.map((record) => getCoreRecord(record));
  const generatedCoreByHsCode = new Map(generatedCore.map((record) => [record.hsCode, record]));
  const currentCoreByHsCode = new Map(currentCore.map((record) => [record.hsCode, record]));
  const generatedHsCodes = generatedCore.map((record) => record.hsCode);
  const currentHsCodes = currentCore.map((record) => record.hsCode);
  const missingFromCurrent = generatedHsCodes.filter((hsCode) => !currentHsCodes.includes(hsCode));
  const extraInCurrent = currentHsCodes.filter((hsCode) => !generatedHsCodes.includes(hsCode));
  const coreMismatches = generatedHsCodes.filter((hsCode) => {
    const generatedRecord = generatedCoreByHsCode.get(hsCode);
    const currentRecord = currentCoreByHsCode.get(hsCode);

    return Boolean(
      generatedRecord &&
        currentRecord &&
        JSON.stringify(generatedRecord) !== JSON.stringify(currentRecord),
    );
  });

  generatedCore.sort((left, right) => left.hsCode.localeCompare(right.hsCode));
  currentCore.sort((left, right) => left.hsCode.localeCompare(right.hsCode));

  console.log("EU normalization snapshot");
  console.log(`- raw source files: ${loadedArtifacts.length}`);
  console.log(`- raw source queries: ${sourcePackage.records.length}`);
  console.log(`- normalized candidates: ${result.normalized.length}`);
  console.log(`- blocked codes: ${result.blocked.length}`);
  console.log(`- manual review codes: ${result.manualReview.length}`);

  if (result.blocked.length > 0) {
    console.log("- blocked HS codes:", result.blocked.map((candidate) => candidate.hsCode).join(", "));
  }

  if (result.manualReview.length > 0) {
    console.log(
      "- manual review HS codes:",
      result.manualReview.map((candidate) => candidate.hsCode).join(", "),
    );
  }

  if (missingFromCurrent.length > 0) {
    console.log(
      "- normalized HS codes not yet in the live EU dataset:",
      missingFromCurrent.join(", "),
    );
  }

  if (extraInCurrent.length > 0) {
    console.log(
      "- live EU dataset includes HS codes missing from the raw manifest:",
      extraInCurrent.join(", "),
    );
  }

  if (coreMismatches.length > 0) {
    console.log("- core mismatches on shared HS codes:", coreMismatches.join(", "));
  }

  if (options.write) {
    if (extraInCurrent.length > 0 || coreMismatches.length > 0) {
      console.log(
        "- refusing to write because the current EU dataset has drift that needs manual review first",
      );
      process.exitCode = 1;
      return;
    }

    if (missingFromCurrent.length === 0) {
      console.log("- no new normalized rows to write");
      return;
    }

    const currentRecordsByHsCode = new Map(
      currentNormalizedDataset.map((record) => [canonicalizeHsCode(record.hsCode), record]),
    );

    for (const record of generatedRecords) {
      const hsCode = canonicalizeHsCode(record.hsCode);

      if (!currentRecordsByHsCode.has(hsCode)) {
        currentRecordsByHsCode.set(hsCode, record);
      }
    }

    const nextDataset = sortTariffRecords([...currentRecordsByHsCode.values()]);

    await writeFile(normalizedDatasetPath, `${JSON.stringify(nextDataset, null, 2)}\n`, "utf8");
    console.log(`- wrote ${missingFromCurrent.length} new normalized row(s) into the live EU dataset`);
    return;
  }

  const coreMismatch =
    JSON.stringify(generatedCore) !== JSON.stringify(currentCore);

  if (missingFromCurrent.length > 0 || extraInCurrent.length > 0 || coreMismatch) {
    console.log("- live EU dataset is out of sync with the official-source normalization result");
    process.exitCode = 1;
    return;
  }

  console.log("- live EU dataset already includes every normalized HS code in the raw manifest");
}

void main();
