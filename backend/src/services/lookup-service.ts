import type { LookupRequest, LookupResponse } from "../contracts/lookup.js";
import { activeSupportedDestinations } from "../contracts/markets.js";
import { resolveLookupClassification } from "./classification-service.js";
import { findTariffRecord } from "./tariff-record-service.js";

export class LookupNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LookupNotFoundError";
  }
}

export async function runLookup(
  request: LookupRequest,
): Promise<LookupResponse> {
  const resolvedClassification = resolveLookupClassification({
    hsCode: request.hsCode?.trim() || null,
    productDescription: request.productDescription?.trim() || null,
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
    },
  };
}
