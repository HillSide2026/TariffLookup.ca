import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import {
  euRawSourcePackageSchema,
  type EuRawSourcePackage,
} from "./eu-normalization-service.js";

const euRawSourceManifestArtifactSchema = z.object({
  kind: z.string().min(1),
  path: z.string().min(1),
  description: z.string().min(1),
});

const euRawSourceManifestSchema = z.object({
  jurisdiction: z.string().min(1),
  status: z.string().min(1),
  notes: z.array(z.string()).default([]),
  artifacts: z.array(euRawSourceManifestArtifactSchema).default([]),
  sources: z.array(z.object({
    name: z.string().min(1),
    kind: z.string().min(1),
    url: z.string().min(1),
    purpose: z.string().min(1),
  })).default([]),
  lastReviewed: z.string().min(1),
  owner: z.string().min(1),
});

export const defaultEuRawSourceManifestRelativePath = "data/raw/eu/source-manifest.json";

export type EuRawSourceManifest = z.infer<typeof euRawSourceManifestSchema>;
export type EuRawSourceManifestArtifact = z.infer<typeof euRawSourceManifestArtifactSchema>;
export type LoadedEuRawSourceArtifact = {
  artifact: EuRawSourceManifestArtifact;
  sourcePackage: EuRawSourcePackage;
};

function resolveRepoRoot() {
  const candidates = [
    process.cwd(),
    resolve(process.cwd(), ".."),
    fileURLToPath(new URL("../../../", import.meta.url)),
  ];

  for (const candidate of candidates) {
    if (
      existsSync(resolve(candidate, "backend")) &&
      existsSync(resolve(candidate, "frontend")) &&
      existsSync(resolve(candidate, "package.json"))
    ) {
      return candidate;
    }
  }

  return candidates[0];
}

export function resolveRepoFile(relativePathFromRepoRoot: string) {
  return resolve(resolveRepoRoot(), relativePathFromRepoRoot);
}

export function canonicalizeEuProductCode(productCode: string) {
  return productCode.replace(/[^\d]/g, "");
}

export function getEuRawSourceRecordKey(record: EuRawSourcePackage["records"][number]) {
  return [
    canonicalizeEuProductCode(record.query.product),
    record.query.origin.trim().toUpperCase(),
    record.query.destination.trim().toUpperCase(),
    record.query.lang.trim().toUpperCase(),
  ].join(":");
}

function compareEuRawRecords(
  left: EuRawSourcePackage["records"][number],
  right: EuRawSourcePackage["records"][number],
) {
  const productComparison = canonicalizeEuProductCode(left.query.product).localeCompare(
    canonicalizeEuProductCode(right.query.product),
  );

  if (productComparison !== 0) {
    return productComparison;
  }

  return getEuRawSourceRecordKey(left).localeCompare(getEuRawSourceRecordKey(right));
}

export function mergeEuRawSourcePackages(sourcePackages: EuRawSourcePackage[]) {
  if (sourcePackages.length === 0) {
    throw new Error("Expected at least one EU raw source package to merge.");
  }

  const packagesSorted = [...sourcePackages].sort((left, right) =>
    left.retrievedAt.localeCompare(right.retrievedAt),
  );
  const mergedRecordsByKey = new Map<string, EuRawSourcePackage["records"][number]>();

  for (const sourcePackage of packagesSorted) {
    for (const record of sourcePackage.records) {
      mergedRecordsByKey.set(getEuRawSourceRecordKey(record), {
        ...record,
        retrievedAt: record.retrievedAt || sourcePackage.retrievedAt,
        source: record.source || sourcePackage.source,
      });
    }
  }

  const uniqueSources = [...new Set(packagesSorted.map((sourcePackage) => sourcePackage.source))];
  const mergedRecords = [...mergedRecordsByKey.values()].sort(compareEuRawRecords);

  return euRawSourcePackageSchema.parse({
    retrievedAt: packagesSorted[packagesSorted.length - 1]?.retrievedAt || "",
    source: uniqueSources.length === 1 ? uniqueSources[0] : uniqueSources.join(" + "),
    notes: [...new Set(packagesSorted.flatMap((sourcePackage) => sourcePackage.notes))],
    records: mergedRecords,
  });
}

export async function loadEuRawSourceManifest(
  manifestRelativePath = defaultEuRawSourceManifestRelativePath,
) {
  const manifestPath = resolveRepoFile(manifestRelativePath);
  const rawManifest = await readFile(manifestPath, "utf8");

  return euRawSourceManifestSchema.parse(JSON.parse(rawManifest) as unknown);
}

export async function loadEuRawSourcePackagesFromManifest(
  manifestRelativePath = defaultEuRawSourceManifestRelativePath,
) {
  const manifest = await loadEuRawSourceManifest(manifestRelativePath);
  const rawArtifacts = manifest.artifacts.filter((artifact) => artifact.kind === "raw-api-snapshot");

  if (rawArtifacts.length === 0) {
    throw new Error(`No raw-api-snapshot artifacts were found in ${manifestRelativePath}.`);
  }

  const loadedArtifacts = await Promise.all(rawArtifacts.map(async (artifact) => {
    const absolutePath = resolveRepoFile(artifact.path);
    const rawSourcePackage = await readFile(absolutePath, "utf8");

    return {
      artifact,
      sourcePackage: euRawSourcePackageSchema.parse(JSON.parse(rawSourcePackage) as unknown),
    };
  }));

  return {
    manifest,
    loadedArtifacts,
  };
}

export async function loadMergedEuRawSourcePackage(
  manifestRelativePath = defaultEuRawSourceManifestRelativePath,
) {
  const { manifest, loadedArtifacts } = await loadEuRawSourcePackagesFromManifest(
    manifestRelativePath,
  );

  return {
    manifest,
    loadedArtifacts,
    sourcePackage: mergeEuRawSourcePackages(
      loadedArtifacts.map((loadedArtifact) => loadedArtifact.sourcePackage),
    ),
  };
}

function slugifyPathSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-") || "batch";
}

export function buildEuRawSnapshotRelativePath(input: {
  retrievedAt: string;
  label?: string;
}) {
  const suffix = input.label ? `-${slugifyPathSegment(input.label)}` : "";

  return `data/raw/eu/access2markets-tariffs-${input.retrievedAt}${suffix}.json`;
}

export async function writeEuRawSourcePackage(
  relativePath: string,
  sourcePackage: EuRawSourcePackage,
) {
  const absolutePath = resolveRepoFile(relativePath);

  await mkdir(dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, `${JSON.stringify(sourcePackage, null, 2)}\n`, "utf8");

  return absolutePath;
}

export async function upsertEuRawSourceManifestArtifact(
  input: {
    path: string;
    description: string;
    kind?: string;
    lastReviewed?: string;
  },
  manifestRelativePath = defaultEuRawSourceManifestRelativePath,
) {
  const manifestPath = resolveRepoFile(manifestRelativePath);
  const manifest = await loadEuRawSourceManifest(manifestRelativePath);
  const nextArtifacts = manifest.artifacts.filter((artifact) => artifact.path !== input.path);

  nextArtifacts.push({
    kind: input.kind || "raw-api-snapshot",
    path: input.path,
    description: input.description,
  });
  nextArtifacts.sort((left, right) => left.path.localeCompare(right.path));

  const nextManifest = {
    ...manifest,
    artifacts: nextArtifacts,
    lastReviewed: input.lastReviewed || manifest.lastReviewed,
  };

  await mkdir(dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, `${JSON.stringify(nextManifest, null, 2)}\n`, "utf8");

  return nextManifest;
}
