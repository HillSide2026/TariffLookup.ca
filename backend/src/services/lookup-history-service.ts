import type { LookupHistoryEntry } from "../contracts/account.js";
import type {
  LookupHistoryStatus,
  LookupResponse,
} from "../contracts/lookup.js";
import { env } from "../config/env.js";
import {
  InvalidAuthTokenError,
  MissingAuthorizationError,
  SupabaseUnavailableError,
  getSupabaseServiceHeaders,
  isSupabaseServerConfigured,
  resolveAuthenticatedUser,
  type AuthenticatedUser,
} from "./auth-service.js";

type SupabaseLookupHistoryRow = {
  id: string;
  created_at: string;
  destination_country: string;
  product_description: string | null;
  submitted_hs_code: string | null;
  resolved_hs_code: string;
  input_mode: "hsCode" | "description" | "hsCode+description";
  classification_confidence: string;
  classification_method: string;
  classification_rationale: string;
  mfn_tariff_rate: string;
  preferential_tariff_rate: string;
  agreement_basis: string;
  source: string;
  source_tier: LookupResponse["meta"]["source"];
  coverage_status: LookupResponse["meta"]["coverageStatus"];
  effective_date: string;
};

function getSupabaseRestUrl(path: string) {
  if (!env.SUPABASE_URL) {
    throw new SupabaseUnavailableError();
  }

  return `${env.SUPABASE_URL}/rest/v1/${path}`;
}

async function upsertProfile(user: AuthenticatedUser) {
  const response = await fetch(getSupabaseRestUrl("profiles"), {
    method: "POST",
    headers: {
      ...getSupabaseServiceHeaders(),
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({
      id: user.id,
      email: user.email,
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to upsert the Supabase profile.");
  }
}

export async function saveLookupHistory(input: {
  authorizationHeader?: string | string[];
  lookupResponse: LookupResponse;
}): Promise<LookupHistoryStatus> {
  const hasAuthorizationHeader = Boolean(input.authorizationHeader);

  if (!hasAuthorizationHeader) {
    return "anonymous";
  }

  if (!isSupabaseServerConfigured()) {
    return "persistence-unavailable";
  }

  try {
    const user = await resolveAuthenticatedUser(input.authorizationHeader);

    await upsertProfile(user);

    const response = await fetch(getSupabaseRestUrl("lookup_history"), {
      method: "POST",
      headers: {
        ...getSupabaseServiceHeaders(),
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        user_id: user.id,
        destination_country: input.lookupResponse.query.destinationCountry,
        product_description: input.lookupResponse.query.productDescription,
        submitted_hs_code: input.lookupResponse.query.submittedHsCode,
        resolved_hs_code: input.lookupResponse.query.hsCode,
        input_mode: input.lookupResponse.query.inputMode,
        classification_confidence: input.lookupResponse.classification.confidence,
        classification_method: input.lookupResponse.classification.method,
        classification_rationale: input.lookupResponse.classification.rationale,
        mfn_tariff_rate: input.lookupResponse.result.mfnTariffRate,
        preferential_tariff_rate: input.lookupResponse.result.preferentialTariffRate,
        agreement_basis: input.lookupResponse.result.agreementBasis,
        source: input.lookupResponse.result.source,
        source_tier: input.lookupResponse.meta.source,
        coverage_status: input.lookupResponse.meta.coverageStatus,
        effective_date: input.lookupResponse.result.effectiveDate,
      }),
    });

    if (!response.ok) {
      return "save-failed";
    }

    return "saved";
  } catch (error) {
    if (
      error instanceof MissingAuthorizationError ||
      error instanceof InvalidAuthTokenError ||
      error instanceof SupabaseUnavailableError
    ) {
      return "save-failed";
    }

    return "save-failed";
  }
}

export async function listLookupHistory(
  authorizationHeader?: string | string[],
): Promise<LookupHistoryEntry[]> {
  const user = await resolveAuthenticatedUser(authorizationHeader);
  const url = new URL(getSupabaseRestUrl("lookup_history"));

  url.searchParams.set(
    "select",
    [
      "id",
      "created_at",
      "destination_country",
      "product_description",
      "submitted_hs_code",
      "resolved_hs_code",
      "input_mode",
      "classification_confidence",
      "classification_method",
      "classification_rationale",
      "mfn_tariff_rate",
      "preferential_tariff_rate",
      "agreement_basis",
      "source",
      "source_tier",
      "coverage_status",
      "effective_date",
    ].join(","),
  );
  url.searchParams.set("user_id", `eq.${user.id}`);
  url.searchParams.set("order", "created_at.desc");
  url.searchParams.set("limit", "25");

  const response = await fetch(url, {
    headers: getSupabaseServiceHeaders(),
  });

  if (!response.ok) {
    throw new Error("Unable to load lookup history from Supabase.");
  }

  const rows = (await response.json()) as SupabaseLookupHistoryRow[];

  return rows.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    destinationCountry: row.destination_country,
    productDescription: row.product_description,
    submittedHsCode: row.submitted_hs_code,
    hsCode: row.resolved_hs_code,
    inputMode: row.input_mode,
    classificationConfidence: row.classification_confidence,
    classificationMethod: row.classification_method,
    classificationRationale: row.classification_rationale,
    mfnTariffRate: row.mfn_tariff_rate,
    preferentialTariffRate: row.preferential_tariff_rate,
    agreementBasis: row.agreement_basis,
    source: row.source,
    sourceTier: row.source_tier,
    coverageStatus: row.coverage_status,
    effectiveDate: row.effective_date,
  }));
}
