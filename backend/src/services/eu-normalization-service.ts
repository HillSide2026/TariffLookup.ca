import { z } from "zod";
import type { TariffRecord } from "../contracts/tariff-record.js";

export const euRawMeasureSchema = z.object({
  origin: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  measureType: z.string().nullable().optional(),
  tariffFormula: z.string().nullable().optional(),
});

export const euRawResponseBranchSchema = z.object({
  measures: z.array(euRawMeasureSchema),
  description: z.string().nullable().optional(),
  code: z.string().nullable().optional(),
});

export const euRawResponseSummarySchema = z.object({
  branchDescriptions: z.array(z.string()),
  sharedMeasuresOfInterest: z.array(euRawMeasureSchema),
  notes: z.array(z.string()).optional().default([]),
});

const euRawRecordSchema = z.object({
  query: z.object({
    product: z.string().min(4),
    origin: z.string().min(2),
    destination: z.string().min(2),
    lang: z.string().min(2),
  }),
  endpoint: z.string().url(),
  retrievedAt: z.string().min(1).optional(),
  source: z.string().min(1).optional(),
  rawPayload: z.unknown().optional(),
  response: z.array(euRawResponseBranchSchema).optional(),
  responseSummary: euRawResponseSummarySchema.optional(),
});

export const euRawSourcePackageSchema = z.object({
  retrievedAt: z.string().min(1),
  source: z.string().min(1),
  notes: z.array(z.string()).default([]),
  records: z.array(euRawRecordSchema),
});

type EuRawMeasure = z.infer<typeof euRawMeasureSchema>;
export type EuRawSourcePackage = z.infer<typeof euRawSourcePackageSchema>;

type EuNormalizationOverride = {
  reviewDate: string;
  effectiveDate?: string;
  summaryNoteOverride?: string;
  restrictionNote: string;
};

const euNormalizationOverridesByProduct: Record<string, EuNormalizationOverride> = {
  "441990": {
    reviewDate: "2026-03-15",
    effectiveDate: "2026-03-14",
    summaryNoteOverride:
      "The official EU source returns a single generic 'Other' branch for wooden tableware and kitchenware with a 0% ERGA OMNES third-country duty.",
    restrictionNote:
      "This normalized row is intentionally limited to explicit wooden tableware or kitchenware descriptions and direct HS-code lookups; it should not be used for wooden furniture or decorative-goods descriptions.",
  },
  "761510": {
    reviewDate: "2026-03-15",
    effectiveDate: "2026-03-14",
    restrictionNote:
      "Because the official branch wording mixes aluminium household-article, radiator, and foil-manufacture language, the description-first classifier now exposes this row only for narrow aluminium kitchen or household-article descriptions and excludes radiator or foil language.",
  },
  "940169": {
    reviewDate: "2026-03-15",
    effectiveDate: "2026-03-14",
    restrictionNote:
      "This normalized row is intentionally limited to explicit non-upholstered seat descriptions and direct HS-code lookups; upholstered-seat language remains mapped to HS 9401.61 instead.",
  },
  "830629": {
    reviewDate: "2026-03-15",
    effectiveDate: "2026-03-14",
    summaryNoteOverride:
      "The official EU source returns a single generic 'Other' branch for decorative metal articles with a 0% ERGA OMNES third-country duty.",
    restrictionNote:
      "This normalized row is intentionally limited to explicit decorative metal-article descriptions and direct HS-code lookups so it does not collide with hooks, brackets, or other fixture products.",
  },
};

export type EuNormalizedCandidate = {
  hsCode: string;
  productCode: string;
  sourceMode: "response" | "summary";
  branchDescriptions: string[];
  reviewMode: "automatic" | "manual-override";
  record: TariffRecord;
};

export type EuBlockedCandidate = {
  hsCode: string;
  productCode: string;
  sourceMode: "response" | "summary";
  branchDescriptions: string[];
  reason: string;
  notes: string[];
};

export type EuManualReviewCandidate = {
  hsCode: string;
  productCode: string;
  sourceMode: "response" | "summary";
  branchDescriptions: string[];
  reason: string;
  notes: string[];
};

export type EuNormalizationResult = {
  normalized: EuNormalizedCandidate[];
  blocked: EuBlockedCandidate[];
  manualReview: EuManualReviewCandidate[];
};

type BaseOutcome = {
  branchDescriptions: string[];
  mfnRate: string;
  preferentialRate: string;
  auxiliaryMeasures: EuRawMeasure[];
  notes: string[];
  sourceMode: "response" | "summary";
};

function formatHsCode(productCode: string) {
  const digitsOnly = productCode.replace(/[^\d]/g, "");

  if (digitsOnly.length === 6) {
    return `${digitsOnly.slice(0, 4)}.${digitsOnly.slice(4)}`;
  }

  return productCode;
}

function extractMeasureFormula(
  measures: EuRawMeasure[],
  predicate: (measure: EuRawMeasure) => boolean,
) {
  return (
    measures.find(predicate)?.tariffFormula?.trim() || null
  );
}

function deriveAgreement(mfnRate: string, preferentialRate: string) {
  if (mfnRate === "0%") {
    return "EU common customs tariff MFN already zero for the normalized base duty outcome";
  }

  if (preferentialRate === "0%") {
    return "EU-Canada CETA tariff preference";
  }

  return "Current EU preferential outcome requires manual review";
}

function getDefaultSourceNote(productCode: string, reviewDate: string) {
  return `Normalized from the European Commission Access2Markets tariff endpoint for HS ${productCode}, origin Canada, destination Germany, reviewed ${reviewDate}.`;
}

function getDefaultMemberStateNote() {
  return "Germany is used as the representative EU member-state destination because the official endpoint requires a member-state code even though customs duties are part of the EU common customs tariff.";
}

function getDefaultBranchNote(branchDescriptions: string[], mfnRate: string) {
  if (branchDescriptions.length === 1) {
    return `The official EU source returns a single branch for this HS code with a ${mfnRate} ERGA OMNES third-country duty.`;
  }

  return `The official EU source returns ${branchDescriptions.length} branches for this HS code, and each returned branch shares the same ${mfnRate} ERGA OMNES third-country duty used in this normalized record.`;
}

function getAuxiliaryMeasuresNote(auxiliaryMeasures: EuRawMeasure[]) {
  if (auxiliaryMeasures.length === 0) {
    return null;
  }

  return "Conditional or auxiliary measures were present in the official EU snapshot and were not treated as the normalized base tariff outcome.";
}

function normalizeFromResponse(record: EuRawSourcePackage["records"][number]): BaseOutcome | null {
  if (!record.response || record.response.length === 0) {
    return null;
  }

  const branchOutcomes = record.response.map((branch) => {
    const mfnRate = extractMeasureFormula(
      branch.measures,
      (measure) =>
        measure.measureType === "103" &&
        measure.origin === "ERGA OMNES" &&
        Boolean(measure.tariffFormula),
    );
    const canadaRate =
      extractMeasureFormula(
        branch.measures,
        (measure) =>
          measure.measureType === "142" &&
          measure.origin === "Canada" &&
          Boolean(measure.tariffFormula),
      ) || (mfnRate === "0%" ? "0%" : null);

    return {
      description: branch.description?.trim() || "Other",
      mfnRate,
      canadaRate,
      auxiliaryMeasures: branch.measures.filter(
        (measure) => !["103", "142", "143"].includes(measure.measureType || ""),
      ),
    };
  });

  if (branchOutcomes.some((branch) => !branch.mfnRate)) {
    return null;
  }

  const mfnRates = [...new Set(branchOutcomes.map((branch) => branch.mfnRate))];
  const preferentialRates = [
    ...new Set(branchOutcomes.map((branch) => branch.canadaRate || "missing")),
  ];

  if (mfnRates.length !== 1 || preferentialRates.length !== 1) {
    return null;
  }

  return {
    branchDescriptions: branchOutcomes.map((branch) => branch.description),
    mfnRate: mfnRates[0] || "0%",
    preferentialRate:
      preferentialRates[0] === "missing" ? "0%" : preferentialRates[0] || "0%",
    auxiliaryMeasures: branchOutcomes.flatMap((branch) => branch.auxiliaryMeasures),
    notes: [],
    sourceMode: "response",
  };
}

function normalizeFromSummary(record: EuRawSourcePackage["records"][number]): BaseOutcome | null {
  if (!record.responseSummary) {
    return null;
  }

  const mfnRate = extractMeasureFormula(
    record.responseSummary.sharedMeasuresOfInterest,
    (measure) =>
      measure.measureType === "103" &&
      measure.origin === "ERGA OMNES" &&
      Boolean(measure.tariffFormula),
  );

  if (!mfnRate) {
    return null;
  }

  const preferentialRate =
    extractMeasureFormula(
      record.responseSummary.sharedMeasuresOfInterest,
      (measure) =>
        measure.measureType === "142" &&
        measure.origin === "Canada" &&
        Boolean(measure.tariffFormula),
    ) || (mfnRate === "0%" ? "0%" : null);

  if (!preferentialRate) {
    return null;
  }

  return {
    branchDescriptions: [...record.responseSummary.branchDescriptions],
    mfnRate,
    preferentialRate,
    auxiliaryMeasures: record.responseSummary.sharedMeasuresOfInterest.filter(
      (measure) => !["103", "142", "143"].includes(measure.measureType || ""),
    ),
    notes: record.responseSummary.notes || [],
    sourceMode: "summary",
  };
}

function isAmbiguityBlocked(notes: string[]) {
  return notes.some((note) =>
    /materially different|requires more specific|not normalized because/i.test(note),
  );
}

function isManualOverrideRequired(notes: string[]) {
  return notes.some((note) =>
    /not normalized in this pass because/i.test(note),
  );
}

function buildNormalizedCandidate(
  sourcePackage: EuRawSourcePackage,
  record: EuRawSourcePackage["records"][number],
  outcome: BaseOutcome,
): EuNormalizedCandidate {
  const productCode = record.query.product.replace(/[^\d]/g, "");
  const hsCode = formatHsCode(productCode);
  const override = euNormalizationOverridesByProduct[productCode];
  const retrievedAt = record.retrievedAt || sourcePackage.retrievedAt;
  const sourceLabel = record.source || sourcePackage.source;
  const reviewDate = override?.reviewDate || retrievedAt;
  const branchNote =
    override?.summaryNoteOverride ||
    outcome.notes.find((note) => !/not normalized/i.test(note)) ||
    getDefaultBranchNote(outcome.branchDescriptions, outcome.mfnRate);
  const auxiliaryNote = getAuxiliaryMeasuresNote(outcome.auxiliaryMeasures);
  const eligibilityNotes = [
    getDefaultSourceNote(productCode, reviewDate),
    getDefaultMemberStateNote(),
    branchNote,
    override?.restrictionNote || auxiliaryNote,
  ].filter((note): note is string => Boolean(note));

  return {
    hsCode,
    productCode,
    sourceMode: outcome.sourceMode,
    branchDescriptions: outcome.branchDescriptions,
    reviewMode: override ? "manual-override" : "automatic",
    record: {
      hsCode,
      destinationCountry: "European Union",
      mfnRate: outcome.mfnRate,
      preferentialRate: outcome.preferentialRate,
      agreement: deriveAgreement(outcome.mfnRate, outcome.preferentialRate),
      eligibilityNotes,
      source: `${sourceLabel} (CA -> DE snapshot)`,
      effectiveDate: override?.effectiveDate || retrievedAt,
    },
  };
}

function buildBlockedCandidate(
  record: EuRawSourcePackage["records"][number],
  outcome: BaseOutcome | null,
): EuBlockedCandidate {
  const productCode = record.query.product.replace(/[^\d]/g, "");

  return {
    hsCode: formatHsCode(productCode),
    productCode,
    sourceMode: outcome?.sourceMode || "summary",
    branchDescriptions:
      outcome?.branchDescriptions ||
      record.responseSummary?.branchDescriptions ||
      [],
    reason:
      record.responseSummary?.notes?.[0] ||
      "The official EU source returns materially different branch outcomes for this HS code.",
    notes: record.responseSummary?.notes || [],
  };
}

function buildManualReviewCandidate(
  record: EuRawSourcePackage["records"][number],
  outcome: BaseOutcome,
): EuManualReviewCandidate {
  const productCode = record.query.product.replace(/[^\d]/g, "");

  return {
    hsCode: formatHsCode(productCode),
    productCode,
    sourceMode: outcome.sourceMode,
    branchDescriptions: outcome.branchDescriptions,
    reason:
      outcome.notes.find((note) => /not normalized/i.test(note)) ||
      "This HS code still requires manual review before it can be normalized.",
    notes: outcome.notes,
  };
}

export function normalizeEuSourcePackage(input: unknown): EuNormalizationResult {
  const sourcePackage = euRawSourcePackageSchema.parse(input);
  const normalized: EuNormalizedCandidate[] = [];
  const blocked: EuBlockedCandidate[] = [];
  const manualReview: EuManualReviewCandidate[] = [];

  for (const record of sourcePackage.records) {
    const summaryOutcome = normalizeFromSummary(record);
    const responseOutcome = normalizeFromResponse(record);
    const outcome = responseOutcome || summaryOutcome;
    const rawNotes = record.responseSummary?.notes || [];
    const productCode = record.query.product.replace(/[^\d]/g, "");
    const hasManualOverride = Boolean(euNormalizationOverridesByProduct[productCode]);

    if (isAmbiguityBlocked(rawNotes)) {
      blocked.push(buildBlockedCandidate(record, outcome));
      continue;
    }

    if (!outcome) {
      manualReview.push({
        hsCode: formatHsCode(productCode),
        productCode,
        sourceMode: record.response ? "response" : "summary",
        branchDescriptions: record.responseSummary?.branchDescriptions || [],
        reason:
          "The official EU source snapshot does not expose a stable shared base outcome for this HS code yet.",
        notes: rawNotes,
      });
      continue;
    }

    if (isManualOverrideRequired(rawNotes) && !hasManualOverride) {
      manualReview.push(buildManualReviewCandidate(record, outcome));
      continue;
    }

    normalized.push(buildNormalizedCandidate(sourcePackage, record, outcome));
  }

  normalized.sort((left, right) => left.record.hsCode.localeCompare(right.record.hsCode));
  blocked.sort((left, right) => left.hsCode.localeCompare(right.hsCode));
  manualReview.sort((left, right) => left.hsCode.localeCompare(right.hsCode));

  return {
    normalized,
    blocked,
    manualReview,
  };
}
