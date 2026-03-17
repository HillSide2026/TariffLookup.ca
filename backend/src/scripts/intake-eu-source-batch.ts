import { readFile } from "node:fs/promises";
import { z } from "zod";
import type { EuRawSourcePackage } from "../services/eu-normalization-service.js";
import {
  euRawResponseBranchSchema,
  euRawResponseSummarySchema,
  euRawSourcePackageSchema,
} from "../services/eu-normalization-service.js";
import {
  buildEuRawSnapshotRelativePath,
  canonicalizeEuProductCode,
  getEuRawSourceRecordKey,
  loadEuRawSourcePackagesFromManifest,
  resolveRepoFile,
  upsertEuRawSourceManifestArtifact,
  writeEuRawSourcePackage,
} from "../services/eu-raw-source-service.js";

type IntakeCliOptions = {
  codes: string[];
  origin: string;
  destination: string;
  lang: string;
  label?: string;
  output?: string;
  codesFile?: string;
  refreshExisting: boolean;
  dryRun: boolean;
};

function parseArgs(argv: string[]): IntakeCliOptions {
  let codesValue = "";
  let codesFile: string | undefined;
  let origin = "CA";
  let destination = "DE";
  let lang = "EN";
  let label: string | undefined;
  let output: string | undefined;
  let refreshExisting = false;
  let dryRun = false;

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--codes" && argv[index + 1]) {
      codesValue = argv[index + 1] || "";
      index += 1;
      continue;
    }

    if (token.startsWith("--codes=")) {
      codesValue = token.slice("--codes=".length);
      continue;
    }

    if (token === "--codes-file" && argv[index + 1]) {
      codesFile = argv[index + 1];
      index += 1;
      continue;
    }

    if (token.startsWith("--codes-file=")) {
      codesFile = token.slice("--codes-file=".length);
      continue;
    }

    if (token === "--origin" && argv[index + 1]) {
      origin = argv[index + 1] || origin;
      index += 1;
      continue;
    }

    if (token.startsWith("--origin=")) {
      origin = token.slice("--origin=".length);
      continue;
    }

    if (token === "--destination" && argv[index + 1]) {
      destination = argv[index + 1] || destination;
      index += 1;
      continue;
    }

    if (token.startsWith("--destination=")) {
      destination = token.slice("--destination=".length);
      continue;
    }

    if (token === "--lang" && argv[index + 1]) {
      lang = argv[index + 1] || lang;
      index += 1;
      continue;
    }

    if (token.startsWith("--lang=")) {
      lang = token.slice("--lang=".length);
      continue;
    }

    if (token === "--label" && argv[index + 1]) {
      label = argv[index + 1] || undefined;
      index += 1;
      continue;
    }

    if (token.startsWith("--label=")) {
      label = token.slice("--label=".length);
      continue;
    }

    if (token === "--output" && argv[index + 1]) {
      output = argv[index + 1] || undefined;
      index += 1;
      continue;
    }

    if (token.startsWith("--output=")) {
      output = token.slice("--output=".length);
      continue;
    }

    if (token === "--refresh-existing") {
      refreshExisting = true;
      continue;
    }

    if (token === "--dry-run") {
      dryRun = true;
      continue;
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  return {
    codes: parseHsCodeList(codesValue),
    codesFile,
    origin: origin.trim().toUpperCase(),
    destination: destination.trim().toUpperCase(),
    lang: lang.trim().toUpperCase(),
    label,
    output,
    refreshExisting,
    dryRun,
  };
}

function parseHsCodeList(rawValue: string) {
  if (!rawValue.trim()) {
    return [];
  }

  const parsedCodes = rawValue
    .split(/[\s,]+/g)
    .map((value) => canonicalizeEuProductCode(value))
    .filter((value) => Boolean(value));
  const uniqueCodes = [...new Set(parsedCodes)];

  for (const code of uniqueCodes) {
    if (code.length !== 6) {
      throw new Error(`HS code ${code} must be exactly 6 digits for EU normalization intake.`);
    }
  }

  return uniqueCodes;
}

async function readHsCodeListFromFile(codesFilePath: string) {
  const filePath = resolveRepoFile(codesFilePath);
  const rawFile = await readFile(filePath, "utf8");

  try {
    const parsedJson = JSON.parse(rawFile) as unknown;
    const parsedArray = z.array(z.string()).safeParse(parsedJson);

    if (parsedArray.success) {
      return parseHsCodeList(parsedArray.data.join(","));
    }
  } catch {
    // Fall back to plain-text parsing below.
  }

  return parseHsCodeList(rawFile);
}

function buildEndpoint(input: {
  product: string;
  origin: string;
  destination: string;
  lang: string;
}) {
  return `https://trade.ec.europa.eu/access-to-markets/api/tariffs/get/${input.product}/${input.origin}/${input.destination}?lang=${input.lang}`;
}

function findFirstSchemaMatch<T>(
  schema: z.ZodType<T>,
  input: unknown,
  maxDepth = 5,
) {
  const visited = new Set<unknown>();

  function search(value: unknown, depth: number): T | null {
    const parsed = schema.safeParse(value);

    if (parsed.success) {
      return parsed.data;
    }

    if (
      depth >= maxDepth ||
      value === null ||
      typeof value !== "object" ||
      visited.has(value)
    ) {
      return null;
    }

    visited.add(value);

    const children = Array.isArray(value)
      ? value
      : Object.values(value as Record<string, unknown>);

    for (const child of children) {
      const result = search(child, depth + 1);

      if (result) {
        return result;
      }
    }

    return null;
  }

  return search(input, 0);
}

function extractRawRecord(input: {
  payload: unknown;
  endpoint: string;
  product: string;
  origin: string;
  destination: string;
  lang: string;
  retrievedAt: string;
  source: string;
}): EuRawSourcePackage["records"][number] {
  const response = findFirstSchemaMatch(
    z.array(euRawResponseBranchSchema),
    input.payload,
  ) || undefined;
  const responseSummary = findFirstSchemaMatch(
    euRawResponseSummarySchema,
    input.payload,
  ) || undefined;

  if (!response && !responseSummary) {
    throw new Error(
      `The official EU response for HS ${input.product} could not be mapped into response or responseSummary form.`,
    );
  }

  return euRawSourcePackageSchema.shape.records.element.parse({
    query: {
      product: input.product,
      origin: input.origin,
      destination: input.destination,
      lang: input.lang,
    },
    endpoint: input.endpoint,
    retrievedAt: input.retrievedAt,
    source: input.source,
    response,
    responseSummary,
    rawPayload: input.payload,
  });
}

async function fetchEuRawRecord(input: {
  product: string;
  origin: string;
  destination: string;
  lang: string;
  retrievedAt: string;
  source: string;
}) {
  const endpoint = buildEndpoint(input);
  const response = await fetch(endpoint, {
    headers: {
      accept: "application/json",
    },
  });
  const rawBody = await response.text();

  if (!response.ok) {
    throw new Error(
      `Access2Markets request failed for HS ${input.product} with HTTP ${response.status}: ${rawBody.slice(0, 240)}`,
    );
  }

  let payload: unknown;

  try {
    payload = JSON.parse(rawBody) as unknown;
  } catch {
    throw new Error(
      `Access2Markets returned non-JSON content for HS ${input.product}: ${rawBody.slice(0, 240)}`,
    );
  }

  return extractRawRecord({
    payload,
    endpoint,
    product: input.product,
    origin: input.origin,
    destination: input.destination,
    lang: input.lang,
    retrievedAt: input.retrievedAt,
    source: input.source,
  });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const fileCodes = options.codesFile
    ? await readHsCodeListFromFile(options.codesFile)
    : [];
  const requestedCodes = [...new Set([...options.codes, ...fileCodes])];

  if (requestedCodes.length === 0) {
    throw new Error("Provide at least one 6-digit HS code via --codes or --codes-file.");
  }

  const retrievedAt = new Date().toISOString().slice(0, 10);
  const source = "European Commission Access2Markets tariff endpoint";
  const { loadedArtifacts } = await loadEuRawSourcePackagesFromManifest();
  const existingQueryKeys = new Set(
    loadedArtifacts.flatMap((loadedArtifact) =>
      loadedArtifact.sourcePackage.records.map((record) => getEuRawSourceRecordKey(record)),
    ),
  );
  const records: EuRawSourcePackage["records"] = [];
  const skippedCodes: string[] = [];

  for (const product of requestedCodes) {
    const queryKey = [product, options.origin, options.destination, options.lang].join(":");

    if (existingQueryKeys.has(queryKey) && !options.refreshExisting) {
      skippedCodes.push(product);
      continue;
    }

    const record = await fetchEuRawRecord({
      product,
      origin: options.origin,
      destination: options.destination,
      lang: options.lang,
      retrievedAt,
      source,
    });

    records.push(record);
  }

  console.log("EU raw intake batch");
  console.log(`- requested HS codes: ${requestedCodes.length}`);
  console.log(`- skipped existing HS codes: ${skippedCodes.length}`);
  console.log(`- captured raw snapshots: ${records.length}`);

  if (skippedCodes.length > 0) {
    console.log(`- skipped codes: ${skippedCodes.join(", ")}`);
  }

  if (records.length === 0) {
    console.log("- no new raw snapshots were captured");
    return;
  }

  const relativeOutputPath =
    options.output ||
    buildEuRawSnapshotRelativePath({
      retrievedAt,
      label: options.label,
    });
  const sourcePackage = euRawSourcePackageSchema.parse({
    retrievedAt,
    source,
    notes: [
      "Destination Germany is used because the official endpoint requires an EU member-state destination code.",
      `This raw Access2Markets batch was captured automatically for ${records.length} HS code(s) from ${options.origin} to ${options.destination}.`,
    ],
    records,
  });

  console.log(`- output file: ${relativeOutputPath}`);

  if (options.dryRun) {
    console.log("- dry run only, so no files were written");
    return;
  }

  await writeEuRawSourcePackage(relativeOutputPath, sourcePackage);
  await upsertEuRawSourceManifestArtifact({
    path: relativeOutputPath,
    description:
      "Raw official Access2Markets tariff payloads captured for a follow-on EU intake batch.",
    lastReviewed: retrievedAt,
  });

  console.log("- wrote raw EU source package and updated the manifest");
  console.log("- next step: run `npm run normalize:eu` to see newly safe rows, or `npm run normalize:eu -- --write` to append them");
}

void main();
