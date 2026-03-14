export type LookupInputMode = "hsCode" | "description" | "hsCode+description";

export type LookupSourceTier = "seed-demo-data" | "local-normalized-data";

export type LookupCoverageStatus = "normalized-record" | "seed-fallback";

export type LookupHistoryStatus =
  | "anonymous"
  | "saved"
  | "persistence-unavailable"
  | "save-failed";

export type LookupRequest = {
  hsCode?: string;
  productDescription?: string;
  destinationCountry: string;
};

export type LookupClassification = {
  probableHsCode: string;
  confidence: "high" | "medium" | "low" | "provided";
  method:
    | "keyword-match"
    | "fallback-seed-classification"
    | "user-supplied-hs-code"
    | "user-supplied-hs-code-with-description";
  rationale: string;
};

export type LookupDetailRequest = {
  probableHsCode: string;
  classificationRationale: string;
  reason: string;
  requestedDetails: string[];
  suggestedPrompt: string;
};

export type LookupResult = {
  mfnTariffRate: string;
  preferentialTariffRate: string;
  agreementBasis: string;
  eligibilityNotes: string[];
  source: string;
  effectiveDate: string;
};

export type LookupResponse = {
  lookupId: string;
  query: {
    hsCode: string;
    submittedHsCode: string | null;
    productDescription: string | null;
    destinationCountry: string;
    inputMode: LookupInputMode;
  };
  classification: LookupClassification;
  result: LookupResult;
  meta: {
    source: LookupSourceTier;
    supportedDestinations: string[];
    coverageStatus: LookupCoverageStatus;
    coverageNote: string;
    historyStatus: LookupHistoryStatus;
  };
};

export type LookupValidationIssues = {
  formErrors?: string[];
  fieldErrors?: {
    hsCode?: string[];
    productDescription?: string[];
    destinationCountry?: string[];
  };
};

export type LookupErrorResponse = {
  error: string;
  code?: "needs-more-detail" | "lookup-not-found";
  message?: string;
  issues?: LookupValidationIssues;
  detailRequest?: LookupDetailRequest;
};
