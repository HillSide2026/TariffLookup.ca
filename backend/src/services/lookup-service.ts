import type {
  LookupDetailRequest,
  LookupRequest,
  LookupResponse,
} from "../contracts/lookup.js";
import { activeSupportedDestinations } from "../contracts/markets.js";
import { resolveLookupClassification } from "./classification-service.js";
import { findTariffRecord } from "./tariff-record-service.js";

export class LookupNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LookupNotFoundError";
  }
}

export class LookupNeedsMoreDetailError extends Error {
  detailRequest: LookupDetailRequest;

  constructor(message: string, detailRequest: LookupDetailRequest) {
    super(message);
    this.name = "LookupNeedsMoreDetailError";
    this.detailRequest = detailRequest;
  }
}

export async function runLookup(
  request: LookupRequest,
): Promise<LookupResponse> {
  const resolvedClassification = resolveLookupClassification({
    hsCode: request.hsCode?.trim() || null,
    productDescription: request.productDescription?.trim() || null,
    destinationCountry: request.destinationCountry,
  });
  const lookupMatch = await findTariffRecord({
    hsCode: resolvedClassification.normalizedHsCode,
    destinationCountry: request.destinationCountry,
  });

  if (!lookupMatch) {
    throw new LookupNotFoundError(
      `No local tariff record exists for HS code ${resolvedClassification.normalizedHsCode} in ${request.destinationCountry}.`,
    );
  }

  if (lookupMatch.kind === "needs-more-detail") {
    throw new LookupNeedsMoreDetailError(lookupMatch.detailRequest.reason, {
      probableHsCode: resolvedClassification.normalizedHsCode,
      classificationRationale: resolvedClassification.classification.rationale,
      reason: lookupMatch.detailRequest.reason,
      requestedDetails: lookupMatch.detailRequest.requestedDetails,
      suggestedPrompt: lookupMatch.detailRequest.suggestedPrompt,
    });
  }

  return {
    lookupId: `lookup-${Date.now()}`,
    query: {
      hsCode: resolvedClassification.normalizedHsCode,
      submittedHsCode: resolvedClassification.submittedHsCode,
      productDescription: resolvedClassification.normalizedProductDescription,
      destinationCountry: request.destinationCountry,
      inputMode: resolvedClassification.inputMode,
    },
    classification: resolvedClassification.classification,
    result: {
      mfnTariffRate: lookupMatch.record.mfnRate,
      preferentialTariffRate: lookupMatch.record.preferentialRate,
      agreementBasis: lookupMatch.record.agreement,
      eligibilityNotes: lookupMatch.record.eligibilityNotes,
      source: lookupMatch.record.source,
      effectiveDate: lookupMatch.record.effectiveDate,
    },
    meta: {
      source: lookupMatch.dataSource,
      supportedDestinations: [...activeSupportedDestinations],
      coverageStatus: lookupMatch.coverageStatus,
      coverageNote: lookupMatch.coverageNote,
    },
  };
}
