import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { basename } from "node:path";
import { fileURLToPath } from "node:url";
import { canonicalizeHsCode } from "../services/classification-service.js";
import { resolveRepoFile } from "../services/eu-raw-source-service.js";

type EntryState =
  | "not_started"
  | "in_queue"
  | "normalized"
  | "blocked_with_guidance"
  | "manual_review";

type CatalogEntry = {
  hs6Code: string;
  description: string;
  chapter: string;
  section: string;
  state: EntryState;
  classifierProfileId: string | null;
  lastUpdatedAt: string;
  mfnRate?: string;
  preferentialRate?: string;
  agreement?: string;
  blockedReason?: string;
};

type ChapterMeta = {
  section: string;
  description: string;
  estimatedSubheadings: number;
  activeCount: number;
};

type Catalog = {
  catalogVersion: string;
  schemaVersion: string;
  basis: string;
  effectiveDate: string;
  authoritativeSource: string;
  totalEstimatedSubheadings: number;
  coverageSummary: {
    normalized: number;
    blockedWithGuidance: number;
    manualReview: number;
    inQueue: number;
    notStarted: number;
  };
  currentBatch?: {
    batchId: string;
    status: string;
    codesCount: number;
    createdAt: string;
    manifestPath: string;
  };
  entries: CatalogEntry[];
  chapters: Record<string, ChapterMeta>;
};

type BatchManifestCode = {
  hs6Code: string;
  chapter: string;
  section: string;
  description: string;
};

type BatchFamily = {
  family: string;
  chapters: Array<{
    chapter: string;
    codes: string[];
  }>;
};

type BatchManifest = {
  batchId: string;
  status: string;
  createdAt: string;
  capturedAt?: string;
  codes?: BatchManifestCode[];
  families?: BatchFamily[];
  completedCodes?: string[];
  manualReviewCodes?: string[];
  blockedCodes?: string[];
  normalizedCount?: number;
  manualReviewCount?: number;
  blockedCount?: number;
  manifestPath?: string;
};

type ChapterSummary = {
  chapter: string;
  section: string;
  description: string;
  estimatedSubheadings: number;
  normalized: number;
  blocked: number;
  manualReview: number;
  inQueue: number;
  touched: number;
  notYetRepresented: number;
};

type SectionSummary = {
  section: string;
  chapterRange: string;
  description: string;
  estimatedSubheadings: number;
  normalized: number;
  blocked: number;
  manualReview: number;
  inQueue: number;
  touched: number;
  notYetRepresented: number;
  touchedPctOfChapterEstimate: number;
};

type CoverageDocsContext = {
  catalog: Catalog;
  chapterSummaries: ChapterSummary[];
  sectionSummaries: SectionSummary[];
  blockedEntries: CatalogEntry[];
  manualReviewEntries: CatalogEntry[];
  normalizedEntries: CatalogEntry[];
  normalizedCountsByDate: Array<{ date: string; count: number }>;
  currentBatch: BatchManifest | null;
  latestAppliedBatch: BatchManifest | null;
  chapterEstimateTotal: number;
};

type GenerateCliOptions = {
  check: boolean;
};

const coverageMatrixPath = resolveRepoFile("docs/data-sources/EU_COVERAGE_MATRIX.md");
const normalizationQueuePath = resolveRepoFile(
  "docs/data-sources/EU_NORMALIZATION_QUEUE.md",
);
const catalogPath = resolveRepoFile("data/catalog/eu-hs6-catalog.json");
const batchesDir = resolveRepoFile("data/catalog/batches");

const sectionOrder = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
  "XIII",
  "XIV",
  "XV",
  "XVI",
  "XVII",
  "XVIII",
  "XIX",
  "XX",
  "XXI",
] as const;

const sectionMeta: Record<(typeof sectionOrder)[number], { description: string; chapterRange: string }> = {
  I: {
    description: "Live Animals and Animal Products",
    chapterRange: "01-05",
  },
  II: {
    description: "Vegetable Products",
    chapterRange: "06-14",
  },
  III: {
    description: "Animal or Vegetable Fats",
    chapterRange: "15",
  },
  IV: {
    description: "Food Preparations",
    chapterRange: "16-24",
  },
  V: {
    description: "Mineral Products",
    chapterRange: "25-27",
  },
  VI: {
    description: "Chemical Products",
    chapterRange: "28-38",
  },
  VII: {
    description: "Plastics and Rubber",
    chapterRange: "39-40",
  },
  VIII: {
    description: "Leather",
    chapterRange: "41-43",
  },
  IX: {
    description: "Wood and Articles",
    chapterRange: "44-46",
  },
  X: {
    description: "Pulp, Paper",
    chapterRange: "47-49",
  },
  XI: {
    description: "Textiles",
    chapterRange: "50-63",
  },
  XII: {
    description: "Footwear, Headgear",
    chapterRange: "64-67",
  },
  XIII: {
    description: "Stone, Ceramics, Glass",
    chapterRange: "68-70",
  },
  XIV: {
    description: "Precious Metals",
    chapterRange: "71",
  },
  XV: {
    description: "Base Metals",
    chapterRange: "72-83",
  },
  XVI: {
    description: "Machinery",
    chapterRange: "84-85",
  },
  XVII: {
    description: "Transport",
    chapterRange: "86-89",
  },
  XVIII: {
    description: "Instruments",
    chapterRange: "90-92",
  },
  XIX: {
    description: "Arms",
    chapterRange: "93",
  },
  XX: {
    description: "Miscellaneous Manufactures",
    chapterRange: "94-96",
  },
  XXI: {
    description: "Works of Art",
    chapterRange: "97",
  },
};

function parseArgs(argv: string[]): GenerateCliOptions {
  return {
    check: argv.includes("--check"),
  };
}

async function readJsonFile<T>(path: string) {
  return JSON.parse(await readFile(path, "utf8")) as T;
}

function compareHsCodes(left: string, right: string) {
  return canonicalizeHsCode(left).localeCompare(canonicalizeHsCode(right));
}

function compareBatchIds(left: string, right: string) {
  if (!left) {
    return right ? -1 : 0;
  }

  if (!right) {
    return 1;
  }

  return left.localeCompare(right);
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function sanitizeInline(text: string) {
  return text.replace(/\s+/g, " ").replace(/\|/g, "\\|").trim();
}

function chunkedCodeList(codes: string[], chunkSize = 8) {
  const chunks: string[] = [];
  for (let index = 0; index < codes.length; index += chunkSize) {
    chunks.push(codes.slice(index, index + chunkSize).map((code) => `\`${code}\``).join(", "));
  }
  return chunks.join(", ");
}

function formatManifestStateLabel(batch: BatchManifest | null) {
  if (!batch) {
    return "n/a";
  }

  const mapped: Record<string, string> = {
    defined: "defined",
    in_queue: "in_queue",
    captured: "captured",
    normalized: "normalized",
    written: "written",
    verified: "verified",
  };

  return mapped[batch.status] ?? batch.status;
}

function getRemainingBatchCodes(batch: BatchManifest | null) {
  if (!batch?.codes) {
    return [];
  }

  const completed = new Set(batch.completedCodes ?? []);
  const blocked = new Set(batch.blockedCodes ?? []);
  const manualReview = new Set(batch.manualReviewCodes ?? []);

  return batch.codes
    .filter((code) => !completed.has(code.hs6Code))
    .filter((code) => !blocked.has(code.hs6Code))
    .filter((code) => !manualReview.has(code.hs6Code))
    .sort((left, right) => compareHsCodes(left.hs6Code, right.hs6Code));
}

function getLatestAppliedBatch(
  batches: BatchManifest[],
  currentBatchId: string | undefined,
) {
  return [...batches]
    .filter((batch) => batch.batchId !== currentBatchId)
    .filter(
      (batch) =>
        (batch.completedCodes?.length ?? 0) > 0 ||
        typeof batch.normalizedCount === "number" ||
        typeof batch.manualReviewCount === "number" ||
        typeof batch.blockedCount === "number",
    )
    .sort((left, right) => compareBatchIds(right.batchId, left.batchId))[0] ?? null;
}

function buildChapterSummaries(catalog: Catalog) {
  const byChapter = new Map<string, ChapterSummary>();

  for (const [chapter, meta] of Object.entries(catalog.chapters)) {
    byChapter.set(chapter, {
      chapter,
      section: meta.section,
      description: meta.description,
      estimatedSubheadings: meta.estimatedSubheadings,
      normalized: 0,
      blocked: 0,
      manualReview: 0,
      inQueue: 0,
      touched: 0,
      notYetRepresented: meta.estimatedSubheadings,
    });
  }

  for (const entry of catalog.entries) {
    const summary = byChapter.get(entry.chapter);
    if (!summary) {
      continue;
    }

    if (entry.state === "normalized") {
      summary.normalized += 1;
    } else if (entry.state === "blocked_with_guidance") {
      summary.blocked += 1;
    } else if (entry.state === "manual_review") {
      summary.manualReview += 1;
    } else if (entry.state === "in_queue") {
      summary.inQueue += 1;
    }
  }

  const summaries = [...byChapter.values()].sort((left, right) =>
    left.chapter.localeCompare(right.chapter),
  );

  for (const summary of summaries) {
    summary.touched =
      summary.normalized + summary.blocked + summary.manualReview + summary.inQueue;
    summary.notYetRepresented = Math.max(
      0,
      summary.estimatedSubheadings - summary.touched,
    );
  }

  return summaries;
}

function buildSectionSummaries(chapterSummaries: ChapterSummary[]) {
  return sectionOrder.map((section) => {
    const chapters = chapterSummaries.filter((summary) => summary.section === section);
    const estimatedSubheadings = chapters.reduce(
      (sum, summary) => sum + summary.estimatedSubheadings,
      0,
    );
    const normalized = chapters.reduce((sum, summary) => sum + summary.normalized, 0);
    const blocked = chapters.reduce((sum, summary) => sum + summary.blocked, 0);
    const manualReview = chapters.reduce(
      (sum, summary) => sum + summary.manualReview,
      0,
    );
    const inQueue = chapters.reduce((sum, summary) => sum + summary.inQueue, 0);
    const touched = normalized + blocked + manualReview + inQueue;
    const notYetRepresented = Math.max(0, estimatedSubheadings - touched);
    const touchedPctOfChapterEstimate =
      estimatedSubheadings > 0 ? (touched / estimatedSubheadings) * 100 : 0;

    return {
      section,
      chapterRange: sectionMeta[section].chapterRange,
      description: sectionMeta[section].description,
      estimatedSubheadings,
      normalized,
      blocked,
      manualReview,
      inQueue,
      touched,
      notYetRepresented,
      touchedPctOfChapterEstimate,
    };
  });
}

async function loadBatchManifests() {
  if (!existsSync(batchesDir)) {
    return [];
  }

  const filenames = (await readdir(batchesDir))
    .filter((filename) => filename.endsWith(".json"))
    .filter((filename) => !filename.endsWith(".codes.json"))
    .sort();
  const manifests = await Promise.all(
    filenames.map(async (filename) => {
      const manifestPath = resolveRepoFile(`data/catalog/batches/${filename}`);
      const manifest = await readJsonFile<BatchManifest>(manifestPath);
      return {
        ...manifest,
        manifestPath: `data/catalog/batches/${filename}`,
      };
    }),
  );

  return manifests.sort((left, right) => compareBatchIds(left.batchId, right.batchId));
}

async function buildCoverageDocsContext(): Promise<CoverageDocsContext> {
  const catalog = await readJsonFile<Catalog>(catalogPath);
  const allBatches = await loadBatchManifests();
  const currentBatchManifestPath = catalog.currentBatch?.manifestPath;
  const currentBatch =
    currentBatchManifestPath && existsSync(resolveRepoFile(currentBatchManifestPath))
      ? await readJsonFile<BatchManifest>(resolveRepoFile(currentBatchManifestPath))
      : null;
  const latestAppliedBatch = getLatestAppliedBatch(
    allBatches,
    catalog.currentBatch?.batchId,
  );
  const chapterSummaries = buildChapterSummaries(catalog);
  const sectionSummaries = buildSectionSummaries(chapterSummaries);
  const blockedEntries = [...catalog.entries]
    .filter((entry) => entry.state === "blocked_with_guidance")
    .sort((left, right) => compareHsCodes(left.hs6Code, right.hs6Code));
  const manualReviewEntries = [...catalog.entries]
    .filter((entry) => entry.state === "manual_review")
    .sort((left, right) => compareHsCodes(left.hs6Code, right.hs6Code));
  const normalizedEntries = [...catalog.entries]
    .filter((entry) => entry.state === "normalized")
    .sort((left, right) => compareHsCodes(left.hs6Code, right.hs6Code));
  const normalizedCountsByDate = [...normalizedEntries]
    .reduce((counts, entry) => {
      counts.set(entry.lastUpdatedAt, (counts.get(entry.lastUpdatedAt) ?? 0) + 1);
      return counts;
    }, new Map<string, number>())
    .entries();
  const chapterEstimateTotal = chapterSummaries.reduce(
    (sum, summary) => sum + summary.estimatedSubheadings,
    0,
  );

  return {
    catalog,
    chapterSummaries,
    sectionSummaries,
    blockedEntries,
    manualReviewEntries,
    normalizedEntries,
    normalizedCountsByDate: [...normalizedCountsByDate]
      .map(([date, count]) => ({ date, count }))
      .sort((left, right) => left.date.localeCompare(right.date)),
    currentBatch: currentBatch
      ? {
          ...currentBatch,
          manifestPath: currentBatchManifestPath,
        }
      : null,
    latestAppliedBatch,
    chapterEstimateTotal,
  };
}

function renderCoverageMatrix(context: CoverageDocsContext) {
  const currentBatchRemainingCodes = getRemainingBatchCodes(context.currentBatch);
  const activeChapterRows = context.chapterSummaries
    .filter((summary) => summary.touched > 0)
    .map(
      (summary) =>
        `| ${summary.chapter} | ${sanitizeInline(summary.description)} | ${summary.estimatedSubheadings} | ${summary.normalized} | ${summary.blocked} | ${summary.manualReview} | ${summary.inQueue} | ${summary.notYetRepresented} |`,
    )
    .join("\n");
  const sectionRows = context.sectionSummaries
    .map(
      (summary) =>
        `| ${summary.section} | ${summary.chapterRange} | ${summary.estimatedSubheadings.toLocaleString()} | ${summary.normalized} | ${summary.blocked} | ${summary.manualReview} | ${summary.inQueue} | ${summary.notYetRepresented.toLocaleString()} | ${formatPercent(summary.touchedPctOfChapterEstimate)} |`,
    )
    .join("\n");

  return `# EU HS-6 Coverage Matrix

Generated by \`npm --prefix backend run generate:eu-docs\`. Update the catalog or batch manifests first, then regenerate this file.

**Catalog version:** ${context.catalog.catalogVersion}  
**Schema version:** ${context.catalog.schemaVersion}  
**Basis:** ${context.catalog.basis}  
**Catalog effective date:** ${context.catalog.effectiveDate}  
**Last synced to live dataset:** ${new Date().toISOString().slice(0, 10)}  
**Authoritative source:** \`${context.catalog.authoritativeSource}\`  
**Active in-queue batch:** \`${context.catalog.currentBatch?.batchId ?? "none"}\`${currentBatchRemainingCodes.length > 0 ? ` (${currentBatchRemainingCodes.map((code) => `\`${code.hs6Code}\``).join(", ")})` : ""}  
**Latest applied batch:** \`${context.latestAppliedBatch?.batchId ?? "none"}\`${context.latestAppliedBatch ? ` (\`${context.latestAppliedBatch.normalizedCount ?? context.latestAppliedBatch.completedCodes?.length ?? 0}\` normalized, \`${context.latestAppliedBatch.manualReviewCount ?? context.latestAppliedBatch.manualReviewCodes?.length ?? 0}\` manual_review, \`${context.latestAppliedBatch.blockedCount ?? context.latestAppliedBatch.blockedCodes?.length ?? 0}\` blocked)` : ""}

## Gate Requirement

All four conditions must be true before the EU MVP is considered complete:

- \`active_eu_hs6_catalog_count >= 5000\` -> **current: ${context.catalog.entries.length} touched of ${context.catalog.totalEstimatedSubheadings.toLocaleString()} authoritative floor entries** (\`${formatPercent((context.catalog.entries.length / context.catalog.totalEstimatedSubheadings) * 100)}\`)
  - \`${context.catalog.coverageSummary.normalized}\` normalized, \`${context.catalog.coverageSummary.blockedWithGuidance}\` blocked_with_guidance, \`${context.catalog.coverageSummary.manualReview}\` manual_review, \`${context.catalog.coverageSummary.inQueue}\` in_queue
- Every catalog entry resolves to a terminal state: \`normalized\`, \`blocked_with_guidance\`, or \`manual_review\`
- No active-catalog EU lookup depends on an unsafe seed fallback when it should be categorized explicitly
- Normalized rows, blocked guidance, manual-review tracking, tests, and queue documentation are in sync

## State Legend

| State | Meaning |
|---|---|
| \`normalized\` | Verified EU row, live in \`data/normalized/eu/tariff-records.json\` |
| \`blocked_with_guidance\` | System returns a detail request; cannot normalize safely without more information |
| \`manual_review\` | Not yet safe to normalize automatically; tracked explicitly |
| \`in_queue\` | Selected for the next remaining fetch batch; Access2Markets query not yet run |
| \`not_started\` | Not yet touched; counted against the authoritative floor target |

## Overall Coverage

| Metric | Count | Of Authoritative Floor |
|---|---|---|
| Normalized (live, verified) | ${context.catalog.coverageSummary.normalized} | ${context.catalog.coverageSummary.normalized} / ${context.catalog.totalEstimatedSubheadings.toLocaleString()} = ${formatPercent((context.catalog.coverageSummary.normalized / context.catalog.totalEstimatedSubheadings) * 100)} |
| Blocked-with-guidance | ${context.catalog.coverageSummary.blockedWithGuidance} | ${context.catalog.coverageSummary.blockedWithGuidance} / ${context.catalog.totalEstimatedSubheadings.toLocaleString()} = ${formatPercent((context.catalog.coverageSummary.blockedWithGuidance / context.catalog.totalEstimatedSubheadings) * 100)} |
| Manual review | ${context.catalog.coverageSummary.manualReview} | ${context.catalog.coverageSummary.manualReview} / ${context.catalog.totalEstimatedSubheadings.toLocaleString()} = ${formatPercent((context.catalog.coverageSummary.manualReview / context.catalog.totalEstimatedSubheadings) * 100)} |
| In queue | ${context.catalog.coverageSummary.inQueue} | ${context.catalog.coverageSummary.inQueue} / ${context.catalog.totalEstimatedSubheadings.toLocaleString()} = ${formatPercent((context.catalog.coverageSummary.inQueue / context.catalog.totalEstimatedSubheadings) * 100)} |
| Not yet started | ${context.catalog.coverageSummary.notStarted.toLocaleString()} | ${formatPercent((context.catalog.coverageSummary.notStarted / context.catalog.totalEstimatedSubheadings) * 100)} |
| **Total touched entries** | **${context.catalog.entries.length}** | **${formatPercent((context.catalog.entries.length / context.catalog.totalEstimatedSubheadings) * 100)}** |

## Coverage by HS Section

The table below uses the current chapter-estimate rollups stored in the catalog. Those chapter estimates currently sum to \`~${context.chapterEstimateTotal.toLocaleString()}\`, while the authoritative floor target remains \`${context.catalog.totalEstimatedSubheadings.toLocaleString()}\`.

| Section | Chapters | Chapter-Estimate Subheadings | Normalized | Blocked | Manual Review | In Queue | Not Yet Rep. | Touched % of Chapter Estimate |
|---|---|---|---|---|---|---|---|---|
${sectionRows}
| **Total** | | **~${context.chapterEstimateTotal.toLocaleString()}*** | **${context.catalog.coverageSummary.normalized}** | **${context.catalog.coverageSummary.blockedWithGuidance}** | **${context.catalog.coverageSummary.manualReview}** | **${context.catalog.coverageSummary.inQueue}** | **~${(context.chapterEstimateTotal - context.catalog.entries.length).toLocaleString()}** | **${formatPercent((context.catalog.entries.length / context.chapterEstimateTotal) * 100)}** |

## Active Chapter Detail

Only chapters with at least one non-\`not_started\` entry are shown here.

| Chapter | Description | Est. Subheadings | Normalized | Blocked | Manual Review | In Queue | Not Yet Rep. |
|---|---|---|---|---|---|---|---|
${activeChapterRows}

## Batch Status

### Active In-Queue Batch: ${context.catalog.currentBatch?.batchId ?? "none"}

- Status: \`${formatManifestStateLabel(context.currentBatch)}\`
- Remaining codes: ${currentBatchRemainingCodes.length > 0 ? currentBatchRemainingCodes.map((code) => `\`${code.hs6Code}\``).join(", ") : "none"}
- Manifest: \`${context.catalog.currentBatch?.manifestPath ?? "n/a"}\`
- Remaining queued code count tracked in catalog: \`${context.catalog.currentBatch?.codesCount ?? currentBatchRemainingCodes.length}\`

### Latest Applied Batch: ${context.latestAppliedBatch?.batchId ?? "none"}

- Status: \`${formatManifestStateLabel(context.latestAppliedBatch)}\`
- Manifest: \`${context.latestAppliedBatch?.manifestPath ?? "n/a"}\`
- Outcome: \`${context.latestAppliedBatch?.normalizedCount ?? context.latestAppliedBatch?.completedCodes?.length ?? 0}\` normalized, \`${context.latestAppliedBatch?.manualReviewCount ?? context.latestAppliedBatch?.manualReviewCodes?.length ?? 0}\` manual_review, \`${context.latestAppliedBatch?.blockedCount ?? context.latestAppliedBatch?.blockedCodes?.length ?? 0}\` blocked
- Captured at: \`${context.latestAppliedBatch?.capturedAt ?? context.latestAppliedBatch?.createdAt ?? "n/a"}\`

## Sync Rules

This file should be updated whenever:

- A code is added to \`data/normalized/eu/tariff-records.json\`
- A code is added to or removed from the blocked or manual-review sections of \`docs/data-sources/EU_NORMALIZATION_QUEUE.md\`
- \`data/catalog/eu-hs6-catalog.json\` is updated

*The chapter-level estimated subtotals currently sum to \`~${context.chapterEstimateTotal.toLocaleString()}\`, while the authoritative floor target remains \`${context.catalog.totalEstimatedSubheadings.toLocaleString()}\`. The remaining \`~${(context.catalog.totalEstimatedSubheadings - context.chapterEstimateTotal).toLocaleString()}\` gap is still concentrated in chapters with many fine-grained subheadings and will be refined chapter-by-chapter as coverage expands.*
`;
}

function renderNormalizationQueue(context: CoverageDocsContext) {
  const currentBatchRemainingCodes = getRemainingBatchCodes(context.currentBatch);
  const blockedRows = context.blockedEntries
    .map((entry) => {
      return [
        `- \`${entry.hs6Code}\``,
        `  Description: ${sanitizeInline(entry.description)}`,
        `  Why blocked: ${sanitizeInline(entry.blockedReason ?? "Reason not recorded")}`,
      ].join("\n");
    })
    .join("\n\n");
  const manualReviewRows = context.manualReviewEntries
    .map((entry) => `- \`${entry.hs6Code}\` - ${sanitizeInline(entry.description)}`)
    .join("\n");
  const normalizedByDateRows = context.normalizedCountsByDate
    .map(({ date, count }) => `| \`${date}\` | ${count} |`)
    .join("\n");

  return `# EU Normalization Queue

Generated by \`npm --prefix backend run generate:eu-docs\`. Update the catalog or batch manifests first, then regenerate this file.

This file tracks the European Union Step 3 queue against the current official-source normalization workflow.

Source of truth for live count: \`data/normalized/eu/tariff-records.json\` (\`${context.catalog.coverageSummary.normalized}\` entries as of ${new Date().toISOString().slice(0, 10)}).  
Catalog reference: \`data/catalog/eu-hs6-catalog.json\`.

## Current Catalog State

- \`${context.catalog.coverageSummary.normalized}\` normalized
- \`${context.catalog.coverageSummary.blockedWithGuidance}\` blocked_with_guidance
- \`${context.catalog.coverageSummary.manualReview}\` manual_review
- \`${context.catalog.coverageSummary.inQueue}\` in_queue

## Normalized Row Update Cadence

| Last Updated At | Normalized Rows |
|---|---|
${normalizedByDateRows}

## Ambiguity-Blocked Rows

${blockedRows}

## Manual-Review Rows (${context.manualReviewEntries.length})

${manualReviewRows}

## Explicit Prototype Fallback

- \`8479.89\`
  Current state: explicit seed fallback
  Why retained: low-confidence catch-all for uncovered EU prototype requests that do not map to a normalized row

## Active In-Queue Batch: ${context.catalog.currentBatch?.batchId ?? "none"}

**Status:** \`${formatManifestStateLabel(context.currentBatch)}\`  
**Manifest:** \`${context.catalog.currentBatch?.manifestPath ?? "n/a"}\`  
**State model:** \`data/catalog/eu-hs6-catalog.json\` (catalog version ${context.catalog.catalogVersion}, schema ${context.catalog.schemaVersion})  
**Current coverage state:** \`${context.catalog.entries.length}\` entries touched (\`${context.catalog.coverageSummary.normalized}\` normalized, \`${context.catalog.coverageSummary.blockedWithGuidance}\` blocked_with_guidance, \`${context.catalog.coverageSummary.manualReview}\` manual_review, \`${context.catalog.coverageSummary.inQueue}\` in_queue)

### Queued Codes (${currentBatchRemainingCodes.length})

| HS Code | Chapter | Description |
|---|---|---|
${currentBatchRemainingCodes
  .map(
    (code) =>
      `| \`${code.hs6Code}\` | ${code.chapter} | ${sanitizeInline(code.description)} |`,
  )
  .join("\n")}

## Latest Applied Batch: ${context.latestAppliedBatch?.batchId ?? "none"}

**Status:** \`${formatManifestStateLabel(context.latestAppliedBatch)}\`  
**Manifest:** \`${context.latestAppliedBatch?.manifestPath ?? "n/a"}\`

- Normalized: \`${context.latestAppliedBatch?.normalizedCount ?? context.latestAppliedBatch?.completedCodes?.length ?? 0}\`
- Manual review: \`${context.latestAppliedBatch?.manualReviewCount ?? context.latestAppliedBatch?.manualReviewCodes?.length ?? 0}\`
- Blocked: \`${context.latestAppliedBatch?.blockedCount ?? context.latestAppliedBatch?.blockedCodes?.length ?? 0}\`
- Captured at: \`${context.latestAppliedBatch?.capturedAt ?? context.latestAppliedBatch?.createdAt ?? "n/a"}\`
${context.latestAppliedBatch?.completedCodes?.length
  ? `- Normalized codes: ${chunkedCodeList(
      [...context.latestAppliedBatch.completedCodes].sort(compareHsCodes),
    )}`
  : "- Normalized codes: none recorded"}
${context.latestAppliedBatch?.manualReviewCodes?.length
  ? `- Manual-review codes: ${chunkedCodeList(
      [...context.latestAppliedBatch.manualReviewCodes].sort(compareHsCodes),
    )}`
  : "- Manual-review codes: none recorded"}
${context.latestAppliedBatch?.blockedCodes?.length
  ? `- Blocked codes: ${chunkedCodeList(
      [...context.latestAppliedBatch.blockedCodes].sort(compareHsCodes),
    )}`
  : "- Blocked codes: none recorded"}
`;
}

async function writeIfChanged(path: string, contents: string, checkOnly: boolean) {
  const nextContents = contents.endsWith("\n") ? contents : `${contents}\n`;
  const currentContents = existsSync(path) ? await readFile(path, "utf8") : "";

  if (currentContents === nextContents) {
    console.log(`- already up to date: ${basename(path)}`);
    return { changed: false };
  }

  if (checkOnly) {
    console.log(`- out of date: ${basename(path)}`);
    return { changed: true };
  }

  await writeFile(path, nextContents, "utf8");
  console.log(`- wrote: ${basename(path)}`);
  return { changed: true };
}

export {
  buildCoverageDocsContext,
  renderCoverageMatrix,
  renderNormalizationQueue,
};

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const context = await buildCoverageDocsContext();
  const coverageMatrix = renderCoverageMatrix(context);
  const normalizationQueue = renderNormalizationQueue(context);

  console.log("EU coverage docs");
  console.log(`- catalog entries: ${context.catalog.entries.length}`);
  console.log(`- normalized rows: ${context.catalog.coverageSummary.normalized}`);
  console.log(`- blocked rows: ${context.catalog.coverageSummary.blockedWithGuidance}`);
  console.log(`- manual-review rows: ${context.catalog.coverageSummary.manualReview}`);
  console.log(`- in-queue rows: ${context.catalog.coverageSummary.inQueue}`);

  const coverageResult = await writeIfChanged(
    coverageMatrixPath,
    coverageMatrix,
    options.check,
  );
  const queueResult = await writeIfChanged(
    normalizationQueuePath,
    normalizationQueue,
    options.check,
  );

  if (options.check && (coverageResult.changed || queueResult.changed)) {
    process.exitCode = 1;
    return;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  void main();
}
