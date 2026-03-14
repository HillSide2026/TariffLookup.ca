import type { LookupCoverageStatus, LookupSourceTier } from "./lookup.js";

export type LookupHistoryEntry = {
  id: string;
  createdAt: string;
  destinationCountry: string;
  productDescription: string | null;
  submittedHsCode: string | null;
  hsCode: string;
  inputMode: "hsCode" | "description" | "hsCode+description";
  classificationConfidence: string;
  classificationMethod: string;
  classificationRationale: string;
  mfnTariffRate: string;
  preferentialTariffRate: string;
  agreementBasis: string;
  source: string;
  sourceTier: LookupSourceTier;
  coverageStatus: LookupCoverageStatus;
  effectiveDate: string;
};

export type LookupHistoryResponse = {
  lookups: LookupHistoryEntry[];
};
