import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { useAuth } from "../auth/AuthProvider";
import { activeDestinationMarkets } from "../lib/markets";
import { logClientFailure } from "../lib/client-observability";
import {
  loadUserPreferences,
  resolvePreferredDestination,
  saveUserPreferences,
  type UserPreferences,
} from "../lib/user-preferences";

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
).replace(/\/$/, "");

type MarketsResponse = {
  markets: string[];
};

type LookupResponse = {
  lookupId: string;
  query: {
    hsCode: string;
    submittedHsCode: string | null;
    productDescription: string | null;
    destinationCountry: string;
    inputMode: "hsCode" | "description" | "hsCode+description";
  };
  classification: {
    probableHsCode: string;
    confidence: string;
    method: string;
    rationale: string;
  };
  result: {
    mfnTariffRate: string;
    preferentialTariffRate: string;
    agreementBasis: string;
    eligibilityNotes: string[];
    source: string;
    effectiveDate: string;
  };
  meta: {
    source: "seed-demo-data" | "local-normalized-data";
    supportedDestinations: string[];
    coverageStatus: "normalized-record" | "seed-fallback";
    coverageNote: string;
    historyStatus:
      | "anonymous"
      | "saved"
      | "persistence-unavailable"
      | "save-failed";
  };
};

type LookupDetailRequest = {
  probableHsCode: string;
  classificationRationale: string;
  reason: string;
  requestedDetails: string[];
  suggestedPrompt: string;
};

type LookupErrorResponse = {
  error?: string;
  code?: "needs-more-detail" | "lookup-not-found";
  message?: string;
  detailRequest?: LookupDetailRequest;
  issues?: {
    formErrors?: string[];
    fieldErrors?: {
      hsCode?: string[];
      productDescription?: string[];
      destinationCountry?: string[];
    };
  };
};


function getLookupErrorMessage(payload: LookupErrorResponse | null) {
  if (!payload) {
    return "The lookup could not be completed right now.";
  }

  const productDescriptionError =
    payload.issues?.fieldErrors?.productDescription?.[0];

  if (productDescriptionError) {
    return productDescriptionError;
  }

  const hsCodeError = payload.issues?.fieldErrors?.hsCode?.[0];

  if (hsCodeError) {
    return hsCodeError;
  }

  const destinationCountryError =
    payload.issues?.fieldErrors?.destinationCountry?.[0];

  if (destinationCountryError) {
    return destinationCountryError;
  }

  const formError = payload.issues?.formErrors?.[0];

  if (formError) {
    return formError;
  }

  return payload.error || "The lookup could not be completed right now.";
}

function formatMethodLabel(method: string) {
  return method.replace(/-/g, " ");
}


function formatCoverageStatusLabel(
  coverageStatus: LookupResponse["meta"]["coverageStatus"],
) {
  return coverageStatus === "normalized-record"
    ? "Verified normalized row"
    : "Prototype seed fallback";
}

function getCoverageBannerClasses(
  coverageStatus: LookupResponse["meta"]["coverageStatus"],
) {
  return coverageStatus === "normalized-record"
    ? "border-emerald-200 bg-emerald-50 text-emerald-950"
    : "border-amber-200 bg-amber-50 text-amber-950";
}

function formatHistoryStatusMessage(
  historyStatus: LookupResponse["meta"]["historyStatus"],
) {
  if (historyStatus === "saved") {
    return "This lookup was saved to your account history.";
  }

  if (historyStatus === "persistence-unavailable") {
    return "You are signed in, but backend history persistence is not configured yet.";
  }

  if (historyStatus === "save-failed") {
    return "This lookup returned successfully, but it could not be saved to history.";
  }

  return "Get access to save lookups to your account history.";
}


export function HomePage() {
  const auth = useAuth();
  const [markets, setMarkets] = useState<string[]>([...activeDestinationMarkets]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() =>
    loadUserPreferences(),
  );
  const [productDescription, setProductDescription] = useState(
    "stainless steel kitchen knife blades",
  );
  const [hsCode, setHsCode] = useState("");
  const [destinationCountry, setDestinationCountry] = useState(() =>
    resolvePreferredDestination(loadUserPreferences()),
  );
  const [lookupResponse, setLookupResponse] = useState<LookupResponse | null>(
    null,
  );
  const [detailRequest, setDetailRequest] = useState<LookupDetailRequest | null>(
    null,
  );
  const [followUpDetail, setFollowUpDetail] = useState("");
  const [marketError, setMarketError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isLoadingMarkets, setIsLoadingMarkets] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMarkets() {
      setIsLoadingMarkets(true);

      try {
        const response = await fetch(`${apiBaseUrl}/api/meta/markets`, {
          signal: controller.signal,
        });
        const requestId = response.headers.get("x-request-id");

        if (!response.ok) {
          logClientFailure({
            event: "markets-load-failed",
            route: "/",
            message: "Unable to load markets.",
            requestId,
            statusCode: response.status,
          });
          throw new Error("Unable to load markets.");
        }

        const data = (await response.json()) as MarketsResponse;

        if (!Array.isArray(data.markets) || data.markets.length === 0) {
          throw new Error("No markets returned.");
        }

        setMarkets(data.markets);
        setDestinationCountry((currentValue) => {
          if (data.markets.includes(currentValue)) {
            return currentValue;
          }

          const preferredDestination =
            resolvePreferredDestination(userPreferences);

          return data.markets.includes(preferredDestination)
            ? preferredDestination
            : data.markets[0];
        });
        setMarketError(null);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        logClientFailure({
          event: "markets-load-failed",
          level: "warn",
          route: "/",
          message:
            error instanceof Error ? error.message : "Unable to load markets.",
        });
        setMarketError(
          "Using the fallback market list while the API markets endpoint is unavailable.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingMarkets(false);
        }
      }
    }

    void loadMarkets();

    return () => controller.abort();
  }, []);

  const visibleMarkets =
    markets.length > 0 ? markets : [...activeDestinationMarkets];
  const lookupResult = lookupResponse?.result;
  const classification = lookupResponse?.classification;
  const probableHsCode =
    classification?.probableHsCode ||
    detailRequest?.probableHsCode ||
    "Pending lookup";
  function handleDestinationChange(nextDestination: string) {
    setDestinationCountry(nextDestination);

    if (!userPreferences.rememberLastDestination) {
      return;
    }

    const nextPreferences = {
      ...userPreferences,
      lastDestination: nextDestination,
    };

    setUserPreferences(nextPreferences);
    saveUserPreferences(nextPreferences);
  }

  function handleApplyFollowUpDetail() {
    if (!detailRequest) {
      return;
    }

    const detailText = followUpDetail.trim() || detailRequest.suggestedPrompt;
    const currentDescription = productDescription.trim();
    const nextDescription = currentDescription
      ? `${currentDescription}; ${detailText}`
      : detailText;

    setProductDescription(nextDescription);
    setHsCode("");
    setDetailRequest(null);
    setSubmissionError(
      "Follow-up details were added to the description field. Review the text and rerun the lookup.",
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!productDescription.trim() && !hsCode.trim()) {
      setSubmissionError(
        "Enter a product description or HS code before running a lookup.",
      );
      setLookupResponse(null);
      setDetailRequest(null);
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);
    setLookupResponse(null);
    setDetailRequest(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/lookups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(auth.accessToken
            ? {
                Authorization: `Bearer ${auth.accessToken}`,
              }
            : {}),
        },
        body: JSON.stringify({
          hsCode: hsCode.trim() || undefined,
          productDescription: productDescription.trim() || undefined,
          destinationCountry,
        }),
      });
      const requestId = response.headers.get("x-request-id");

      const payload = (await response.json()) as
        | LookupResponse
        | LookupErrorResponse;

      if (!response.ok) {
        const errorPayload = payload as LookupErrorResponse;

        if (
          errorPayload.code === "needs-more-detail" &&
          errorPayload.detailRequest
        ) {
          logClientFailure({
            event: "lookup-needs-more-detail",
            level: "warn",
            route: "/",
            message:
              errorPayload.message || "More product detail is required.",
            requestId,
            statusCode: response.status,
            details: {
              probableHsCode: errorPayload.detailRequest.probableHsCode,
            },
          });
          setFollowUpDetail(errorPayload.detailRequest.suggestedPrompt);
          setDetailRequest(errorPayload.detailRequest);
          setSubmissionError(null);
          return;
        }

        logClientFailure({
          event: "lookup-request-failed",
          route: "/",
          message: getLookupErrorMessage(errorPayload),
          requestId,
          statusCode: response.status,
        });
        setSubmissionError(getLookupErrorMessage(errorPayload));
        return;
      }

      const lookup = payload as LookupResponse;

      setLookupResponse(lookup);
      setMarketError(null);

      if (lookup.meta.supportedDestinations.length > 0) {
        setMarkets(lookup.meta.supportedDestinations);
      }
    } catch (error) {
      logClientFailure({
        event: "lookup-request-failed",
        route: "/",
        message:
          error instanceof Error
            ? error.message
            : "The lookup service is unavailable right now. Please try again.",
      });
      setSubmissionError(
        "The lookup service is unavailable right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-0">

      {/* Hero */}
      <section className="pb-10 pt-6">
        <p className="text-xs font-medium uppercase tracking-[0.12em]" style={{ color: "var(--tl-text-muted)" }}>
          Built for Canadian exporters and trade advisors
        </p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight" style={{ color: "var(--tl-text)" }}>
          Know the tariff before you choose the market.
        </h1>
        <p className="mt-3 text-base leading-7" style={{ color: "var(--tl-text-muted)" }}>
          Enter a product description and destination to get the MFN tariff rate,
          preferential path, agreement basis, and eligibility notes in one view.
        </p>
      </section>

      {/* Lookup form */}
      <section className="py-8" style={{ borderTop: "1px solid var(--tl-border)" }}>
        <form className="space-y-4" onSubmit={handleSubmit}>

          <div>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] mb-2" style={{ color: "var(--tl-text-muted)" }}>
              Product description
            </label>
            <textarea
              className="w-full border px-4 py-3 text-base outline-none transition"
              style={{
                borderColor: "var(--tl-border)",
                backgroundColor: "var(--tl-surface)",
                color: "var(--tl-text)",
                minHeight: "56px",
                resize: "vertical",
                fontFamily: "var(--tl-font-ui)",
              }}
              onChange={(event) => setProductDescription(event.target.value)}
              placeholder="Ceramic coffee mugs"
              value={productDescription}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-[0.12em] mb-2" style={{ color: "var(--tl-text-muted)" }}>
                HS code
              </label>
              <input
                autoComplete="off"
                className="w-full border px-4 py-3 text-base outline-none transition"
                style={{
                  borderColor: "var(--tl-border)",
                  backgroundColor: "var(--tl-surface)",
                  color: "var(--tl-text)",
                  minHeight: "56px",
                  fontFamily: "var(--tl-font-mono)",
                }}
                inputMode="decimal"
                onChange={(event) => setHsCode(event.target.value)}
                placeholder="Optional"
                value={hsCode}
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-[0.12em] mb-2" style={{ color: "var(--tl-text-muted)" }}>
                Destination
              </label>
              <select
                className="w-full border px-4 py-3 text-base outline-none transition"
                style={{
                  borderColor: "var(--tl-border)",
                  backgroundColor: "var(--tl-surface)",
                  color: "var(--tl-text)",
                  minHeight: "56px",
                  fontFamily: "var(--tl-font-ui)",
                }}
                onChange={(event) => handleDestinationChange(event.target.value)}
                value={destinationCountry}
              >
                {visibleMarkets.map((market) => (
                  <option key={market} value={market}>{market}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="w-full text-sm font-medium text-white transition"
            style={{
              backgroundColor: isSubmitting ? "var(--tl-primary-hover)" : "var(--tl-primary)",
              height: "50px",
              borderRadius: "4px",
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              border: "none",
              fontFamily: "var(--tl-font-ui)",
            }}
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Calculating..." : "Calculate duties"}
          </button>

          {/* Inline errors */}
          {marketError && (
            <p className="text-sm" style={{ color: "var(--tl-accent)" }}>{marketError}</p>
          )}
          {submissionError && (
            <p className="text-sm" style={{ color: "var(--tl-accent)" }}>{submissionError}</p>
          )}
        </form>
      </section>

      {/* Results */}
      {(lookupResponse || detailRequest) && (
        <section className="py-8" style={{ borderTop: "1px solid var(--tl-border)" }}>

          {/* HS Code */}
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-[0.12em] mb-3" style={{ color: "var(--tl-text-muted)" }}>
              HS code match
            </p>
            <div className="border px-4 py-3" style={{ borderColor: "var(--tl-border)", backgroundColor: "var(--tl-surface)" }}>
              <p className="text-2xl font-medium" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-text)" }}>
                {probableHsCode}
              </p>
              {classification && (
                <p className="mt-1 text-sm" style={{ color: "var(--tl-text-muted)" }}>
                  {classification.confidence} confidence · {formatMethodLabel(classification.method)}
                </p>
              )}
              {detailRequest && !classification && (
                <p className="mt-1 text-sm" style={{ color: "var(--tl-text-muted)" }}>
                  {detailRequest.classificationRationale}
                </p>
              )}
            </div>
          </div>

          {/* Cost summary */}
          {lookupResponse?.result && (
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] mb-3" style={{ color: "var(--tl-text-muted)" }}>
                Cost summary
              </p>
              <div className="border" style={{ borderColor: "var(--tl-border)", backgroundColor: "var(--tl-surface)" }}>
                <div className="flex justify-between items-baseline px-4 py-3" style={{ borderBottom: "1px solid var(--tl-border)" }}>
                  <span className="text-sm" style={{ color: "var(--tl-text-muted)" }}>MFN tariff</span>
                  <span className="text-xl font-medium" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-text)" }}>
                    {lookupResponse.result.mfnTariffRate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline px-4 py-3" style={{ borderBottom: "1px solid var(--tl-border)" }}>
                  <span className="text-sm" style={{ color: "var(--tl-text-muted)" }}>Preferential rate</span>
                  <span className="text-xl font-medium" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-text)" }}>
                    {lookupResponse.result.preferentialTariffRate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline px-4 py-3" style={{ borderBottom: "1px solid var(--tl-border)" }}>
                  <span className="text-sm" style={{ color: "var(--tl-text-muted)" }}>Agreement basis</span>
                  <span className="text-base font-medium text-right" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-text)", maxWidth: "60%" }}>
                    {lookupResponse.result.agreementBasis}
                  </span>
                </div>
                {lookupResponse.result.eligibilityNotes.length > 0 && (
                  <div className="px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] mb-2" style={{ color: "var(--tl-text-muted)" }}>Eligibility notes</p>
                    <ul className="space-y-1">
                      {lookupResponse.result.eligibilityNotes.map((note) => (
                        <li key={note} className="text-sm" style={{ color: "var(--tl-text-muted)" }}>
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Needs more detail */}
          {detailRequest && !lookupResponse && (
            <div className="mt-4 border px-4 py-4" style={{ borderColor: "var(--tl-border)", borderLeft: "3px solid var(--tl-accent)" }}>
              <p className="text-sm font-medium mb-2" style={{ color: "var(--tl-text)" }}>More detail needed</p>
              <ul className="space-y-1 mb-3">
                {detailRequest.requestedDetails.map((note) => (
                  <li key={note} className="text-sm" style={{ color: "var(--tl-text-muted)" }}>{note}</li>
                ))}
              </ul>
              <label className="block text-xs font-medium uppercase tracking-[0.12em] mb-2" style={{ color: "var(--tl-text-muted)" }}>
                Refine description
              </label>
              <textarea
                className="w-full border px-3 py-2 text-sm outline-none"
                style={{
                  borderColor: "var(--tl-border)",
                  backgroundColor: "var(--tl-surface)",
                  color: "var(--tl-text)",
                  minHeight: "80px",
                  fontFamily: "var(--tl-font-ui)",
                }}
                onChange={(event) => setFollowUpDetail(event.target.value)}
                value={followUpDetail}
              />
              <button
                className="mt-2 text-sm font-medium text-white"
                style={{
                  backgroundColor: "var(--tl-primary)",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--tl-font-ui)",
                }}
                onClick={handleApplyFollowUpDetail}
                type="button"
              >
                Apply and retry
              </button>
            </div>
          )}

          {/* Coverage status */}
          {lookupResponse?.meta && (
            <p className="mt-4 text-xs" style={{ color: "var(--tl-text-muted)" }}>
              {formatCoverageStatusLabel(lookupResponse.meta.coverageStatus)} ·{" "}
              {formatHistoryStatusMessage(lookupResponse.meta.historyStatus)}
            </p>
          )}
        </section>
      )}

      {/* Save CTA — unauthenticated only */}
      {!auth.isAuthenticated && (
        <section className="py-8" style={{ borderTop: "1px solid var(--tl-border)" }}>
          <p className="text-sm" style={{ color: "var(--tl-text-muted)" }}>
            Save products to track import costs.{" "}
            <Link to="/login" style={{ color: "var(--tl-primary)", textDecoration: "none", fontWeight: 500 }}>
              Get access
            </Link>
          </p>
        </section>
      )}

    </div>
  );
}
