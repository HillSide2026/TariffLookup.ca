/**
 * select-eu-batch.ts
 *
 * Implements the EU HS-6 batch selection algorithm.
 *
 * Selection priority (v1):
 *   1. Coverage gaps by chapter — lowest coverage % first
 *   2. Adjacency preference — prefer codes near already-normalized entries (same 4-digit heading)
 *   3. Diversity constraint — max 3 codes per chapter per batch (configurable)
 *
 * Usage:
 *   npx ts-node src/scripts/select-eu-batch.ts [--batch-size N] [--dry-run]
 *
 * Output:
 *   Prints coverage stats table and selected batch to stdout.
 *   Writes batch manifest to data/catalog/batches/batch-{date}-{seq}.json unless --dry-run.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, resolve } from "path";

// ---- Types ----------------------------------------------------------------

type EntryState =
  | "not_started"
  | "in_queue"
  | "normalized"
  | "blocked_with_guidance"
  | "manual_review";

interface CatalogEntry {
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
}

interface ChapterMeta {
  section: string;
  description: string;
  estimatedSubheadings: number;
  activeCount: number;
}

interface Catalog {
  catalogVersion: string;
  batchConfig: {
    defaultBatchSize: number;
    maxCodesPerChapterPerBatch: number;
  };
  coverageSummary: {
    normalized: number;
    blockedWithGuidance: number;
    manualReview: number;
    inQueue: number;
    notStarted: number;
  };
  entries: CatalogEntry[];
  chapters: Record<string, ChapterMeta>;
}

interface BatchManifest {
  batchId: string;
  status: "defined";
  createdAt: string;
  selectionCriteria: {
    method: "algorithmic-v1";
    coverageGapPriority: boolean;
    adjacencyPreference: boolean;
    maxCodesPerChapterPerBatch: number;
    batchSize: number;
  };
  chapterDistribution: Record<string, number>;
  recommendedChapters: ChapterPriority[];
  fetchInstructions: {
    apiPattern: string;
    origin: string;
    destination: string;
    normalizationRules: string[];
  };
  note: string;
}

interface ChapterPriority {
  chapter: string;
  section: string;
  description: string;
  estimatedSubheadings: number;
  touchedCount: number;
  coveragePct: number;
  notStartedCount: number;
  activeHeadings: string[];
  suggestedFetchCount: number;
}

// ---- Helpers ---------------------------------------------------------------

function computeChapterStats(catalog: Catalog): ChapterPriority[] {
  // Count touched entries per chapter
  const touchedPerChapter: Record<string, number> = {};
  const headingsPerChapter: Record<string, Set<string>> = {};

  for (const entry of catalog.entries) {
    if (entry.state === "not_started") continue;
    touchedPerChapter[entry.chapter] = (touchedPerChapter[entry.chapter] ?? 0) + 1;

    if (!headingsPerChapter[entry.chapter]) {
      headingsPerChapter[entry.chapter] = new Set();
    }
    // 4-digit heading = first 4 chars of hs6Code without dot (e.g. "0901.21" → "0901")
    const heading = entry.hs6Code.replace(".", "").slice(0, 4);
    headingsPerChapter[entry.chapter].add(heading);
  }

  const priorities: ChapterPriority[] = [];

  for (const [chapter, meta] of Object.entries(catalog.chapters)) {
    if (meta.estimatedSubheadings === 0) continue; // skip Ch77 (reserved)

    const touched = touchedPerChapter[chapter] ?? 0;
    const coveragePct =
      meta.estimatedSubheadings > 0 ? (touched / meta.estimatedSubheadings) * 100 : 0;
    const notStarted = Math.max(0, meta.estimatedSubheadings - touched);
    const activeHeadings = headingsPerChapter[chapter]
      ? Array.from(headingsPerChapter[chapter]).sort()
      : [];

    priorities.push({
      chapter,
      section: meta.section,
      description: meta.description,
      estimatedSubheadings: meta.estimatedSubheadings,
      touchedCount: touched,
      coveragePct,
      notStartedCount: notStarted,
      activeHeadings,
      suggestedFetchCount: 0, // filled in during batch selection
    });
  }

  // Sort by coverage % ascending (lowest first), then by estimatedSubheadings ascending
  // (prefer smaller chapters where coverage gains are faster)
  priorities.sort((a, b) => {
    if (a.coveragePct !== b.coveragePct) return a.coveragePct - b.coveragePct;
    return a.estimatedSubheadings - b.estimatedSubheadings;
  });

  return priorities;
}

function selectNextBatch(
  chapterPriorities: ChapterPriority[],
  batchSize: number,
  maxPerChapter: number,
): { selected: ChapterPriority[]; chapterDistribution: Record<string, number> } {
  const selected: ChapterPriority[] = [];
  const distribution: Record<string, number> = {};
  let remaining = batchSize;

  // Adjacency bonus: chapters with active entries get higher allocation
  const withEntries = chapterPriorities.filter((c) => c.activeHeadings.length > 0);
  const withoutEntries = chapterPriorities.filter((c) => c.activeHeadings.length === 0);

  // First pass: allocate to chapters that already have entries (adjacency preference)
  for (const chapter of withEntries) {
    if (remaining <= 0) break;
    if (chapter.notStartedCount === 0) continue;

    const allocate = Math.min(maxPerChapter, chapter.notStartedCount, remaining);
    if (allocate > 0) {
      distribution[chapter.chapter] = allocate;
      chapter.suggestedFetchCount = allocate;
      selected.push(chapter);
      remaining -= allocate;
    }
  }

  // Second pass: fill remaining slots from chapters without entries (coverage gaps)
  for (const chapter of withoutEntries) {
    if (remaining <= 0) break;
    if (chapter.notStartedCount === 0) continue;

    const allocate = Math.min(maxPerChapter, chapter.notStartedCount, remaining);
    if (allocate > 0) {
      distribution[chapter.chapter] = allocate;
      chapter.suggestedFetchCount = allocate;
      selected.push(chapter);
      remaining -= allocate;
    }
  }

  return { selected, chapterDistribution: distribution };
}

function formatTable(priorities: ChapterPriority[]): string {
  const header =
    "Ch  | Section | Coverage% | Touched | Est.Sub | NotYet | Active Headings";
  const divider = "-".repeat(header.length);
  const rows = priorities
    .slice(0, 30) // top 30 priority chapters
    .map((c) => {
      const headings =
        c.activeHeadings.length > 0 ? c.activeHeadings.slice(0, 4).join(",") : "(none)";
      return (
        `${c.chapter.padStart(2)}  | ${c.section.padEnd(7)} | ` +
        `${c.coveragePct.toFixed(1).padStart(9)}% | ` +
        `${String(c.touchedCount).padStart(7)} | ` +
        `${String(c.estimatedSubheadings).padStart(7)} | ` +
        `${String(c.notStartedCount).padStart(6)} | ` +
        headings
      );
    });

  return [header, divider, ...rows].join("\n");
}

function generateBatchId(batchesDir: string): string {
  const dateStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const seqLetters = "abcdefghijklmnopqrstuvwxyz";
  for (const letter of seqLetters) {
    const candidate = `batch-${dateStr}-${letter}`;
    const candidatePath = join(batchesDir, `${candidate}.json`);
    if (!existsSync(candidatePath)) return candidate;
  }
  return `batch-${dateStr}-${Date.now()}`;
}

// ---- Main ------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const batchSizeArg = args.indexOf("--batch-size");
  const batchSize =
    batchSizeArg >= 0 ? parseInt(args[batchSizeArg + 1] ?? "20", 10) : 20;

  const repoRoot = resolve(__dirname, "../../..");
  const catalogPath = join(repoRoot, "data/catalog/eu-hs6-catalog.json");
  const batchesDir = join(repoRoot, "data/catalog/batches");

  if (!existsSync(catalogPath)) {
    console.error(`Catalog not found: ${catalogPath}`);
    process.exit(1);
  }

  const catalog: Catalog = JSON.parse(readFileSync(catalogPath, "utf-8"));
  const maxPerChapter = catalog.batchConfig.maxCodesPerChapterPerBatch;

  console.log(`\n=== EU HS-6 Batch Selector ===`);
  console.log(`Catalog version: ${catalog.catalogVersion}`);
  console.log(
    `Current coverage: ${catalog.coverageSummary.normalized} normalized, ` +
      `${catalog.coverageSummary.blockedWithGuidance} blocked, ` +
      `${catalog.coverageSummary.inQueue} in_queue`,
  );
  console.log(`Batch size: ${batchSize} | Max per chapter: ${maxPerChapter}`);

  const priorities = computeChapterStats(catalog);

  console.log(`\n--- Chapter Coverage (top 30 by priority) ---`);
  console.log(formatTable(priorities));

  const { selected, chapterDistribution } = selectNextBatch(
    priorities,
    batchSize,
    maxPerChapter,
  );

  const totalAllocated = Object.values(chapterDistribution).reduce((a, b) => a + b, 0);

  console.log(`\n--- Recommended Next Batch (${totalAllocated} codes across ${selected.length} chapters) ---`);
  for (const chapter of selected) {
    const headingContext =
      chapter.activeHeadings.length > 0
        ? ` [adjacent to: ${chapter.activeHeadings.join(", ")}]`
        : " [new chapter — no adjacency context]";
    console.log(
      `  Ch${chapter.chapter} (${chapter.section}): fetch ${chapter.suggestedFetchCount} codes${headingContext}`,
    );
    console.log(`    ${chapter.description}`);
    console.log(
      `    Coverage: ${chapter.coveragePct.toFixed(1)}% — ` +
        `${chapter.touchedCount} touched of ${chapter.estimatedSubheadings} estimated`,
    );
  }

  if (!dryRun) {
    if (!existsSync(batchesDir)) mkdirSync(batchesDir, { recursive: true });

    const batchId = generateBatchId(batchesDir);
    const today = new Date().toISOString().slice(0, 10);

    const manifest: BatchManifest = {
      batchId,
      status: "defined",
      createdAt: today,
      selectionCriteria: {
        method: "algorithmic-v1",
        coverageGapPriority: true,
        adjacencyPreference: true,
        maxCodesPerChapterPerBatch: maxPerChapter,
        batchSize,
      },
      chapterDistribution,
      recommendedChapters: selected,
      fetchInstructions: {
        apiPattern:
          "https://trade.ec.europa.eu/access-to-markets/api/tariffs/get/{hs6CodeNoDot}/{origin}/{destination}?lang=EN",
        origin: "CA",
        destination: "DE",
        normalizationRules: [
          "Only normalize when every returned branch shares the same base customs-duty outcome",
          "Do not treat conditional end-use, airworthiness, quota, or control measures as base MFN duty",
          "If branches diverge materially → route to blocked_with_guidance",
          "Record raw API response in data/raw/eu/ before normalizing",
        ],
      },
      note:
        "Codes within each chapter should be identified by consulting Access2Markets or HS 2022 nomenclature. " +
        "This manifest provides the chapter allocation; the operator selects specific HS-6 codes within each allocation.",
    };

    const manifestPath = join(batchesDir, `${batchId}.json`);
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`\nBatch manifest written: ${manifestPath}`);
  } else {
    console.log("\n[dry-run] No files written.");
  }
}

main();
