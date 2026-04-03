import { describe, expect, it } from "vitest";
import {
  buildCoverageDocsContext,
  renderCoverageMatrix,
  renderNormalizationQueue,
} from "./generate-eu-coverage-docs.js";

describe("generateEuCoverageDocs", () => {
  it("renders the current coverage matrix from the catalog", async () => {
    const context = await buildCoverageDocsContext();
    const rendered = renderCoverageMatrix(context);

    expect(rendered).toContain("**Total touched entries** | **118**");
    expect(rendered).toContain("| Normalized (live, verified) | 89 |");
    expect(rendered).toContain("### Active In-Queue Batch: batch-2026-03-22-a");
    expect(rendered).toContain("### Latest Applied Batch: batch-2026-04-03-a");
  });

  it("renders the current normalization queue from the catalog", async () => {
    const context = await buildCoverageDocsContext();
    const rendered = renderNormalizationQueue(context);

    expect(rendered).toContain("## Manual-Review Rows (22)");
    expect(rendered).toContain("`7013.28`");
    expect(rendered).toContain("`7013.37`");
    expect(rendered).toContain("Latest Applied Batch: batch-2026-04-03-a");
  });
});
