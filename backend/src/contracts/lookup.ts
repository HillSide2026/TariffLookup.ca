export type LookupInputMode = "hsCode" | "description" | "hsCode+description";

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
    source: "seed-demo-data" | "local-normalized-data";
    supportedDestinations: string[];
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
  message?: string;
  issues?: LookupValidationIssues;
};
