import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../auth/AuthProvider";
import { logClientFailure } from "../lib/client-observability";

const defaultJurisdictions = [
  "United States",
  "European Union",
  "United Kingdom",
  "Japan",
  "Brazil",
  "China",
];

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

function formatSourceTierLabel(sourceTier: LookupResponse["meta"]["source"]) {
  return sourceTier === "local-normalized-data"
    ? "Local normalized data"
    : "Seed demo data";
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

function formatHistoryStatusMessage(historyStatus: LookupResponse["meta"]["historyStatus"]) {
  if (historyStatus === "saved") {
    return "This lookup was saved to your account history.";
  }

  if (historyStatus === "persistence-unavailable") {
    return "You are signed in, but backend history persistence is not configured yet.";
  }

  if (historyStatus === "save-failed") {
    return "This lookup returned successfully, but it could not be saved to history.";
  }

  return "Sign in to save lookups to your account history.";
}

export function HomePage() {
  const auth = useAuth();
  const [markets, setMarkets] = useState<string[]>(defaultJurisdictions);
  const [productDescription, setProductDescription] = useState(
    "stainless steel kitchen knife blades",
  );
  const [hsCode, setHsCode] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("Japan");
  const [lookupResponse, setLookupResponse] = useState<LookupResponse | null>(
    null,
  );
  const [detailRequest, setDetailRequest] = useState<LookupDetailRequest | null>(
    null,
  );
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
        setDestinationCountry((currentValue) =>
          data.markets.includes(currentValue) ? currentValue : data.markets[0],
        );
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
            error instanceof Error
              ? error.message
              : "Unable to load markets.",
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

  const visibleMarkets = markets.length > 0 ? markets : defaultJurisdictions;
  const lookupResult = lookupResponse?.result;
  const classification = lookupResponse?.classification;
  const probableHsCode =
    classification?.probableHsCode || detailRequest?.probableHsCode || "Pending lookup";

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

        if (errorPayload.code === "needs-more-detail" && errorPayload.detailRequest) {
          logClientFailure({
            event: "lookup-needs-more-detail",
            level: "warn",
            route: "/",
            message: errorPayload.message || "More product detail is required.",
            requestId,
            statusCode: response.status,
            details: {
              probableHsCode: errorPayload.detailRequest.probableHsCode,
            },
          });
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
    <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
      <section className="rounded-[32px] border border-white/70 bg-white/75 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
        <div className="mb-8 max-w-2xl">
          <p className="mb-3 inline-flex rounded-full border border-amber-300/60 bg-amber-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-900">
            MVP workflow
          </p>
          <p className="mb-3 inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700">
            {auth.isAuthenticated ? "Signed in: save lookups automatically" : "Public lookup mode"}
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Start with a rough product description and turn it into a probable
            HS code before the tariff lookup runs.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            The MVP flow is intentionally narrow: one crude description or one
            known HS code, one destination country, one probable classification,
            and one tariff answer with agreement context and eligibility notes.
          </p>
        </div>

        <form
          className="grid gap-4 rounded-[28px] bg-slate-950 p-5 text-white lg:grid-cols-[1.5fr_0.9fr_0.9fr_auto]"
          onSubmit={handleSubmit}
        >
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-white/80">Product description</span>
            <textarea
              className="min-h-24 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none ring-0 placeholder:text-white/45"
              onChange={(event) => setProductDescription(event.target.value)}
              placeholder="stainless steel kitchen knife blades"
              value={productDescription}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-white/80">HS code</span>
            <input
              autoComplete="off"
              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none ring-0 placeholder:text-white/45"
              inputMode="decimal"
              onChange={(event) => setHsCode(event.target.value)}
              placeholder="Optional if you know it"
              value={hsCode}
            />
            <span className="text-xs text-white/50">
              Optional override when you already know the code.
            </span>
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-white/80">Destination</span>
            <select
              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
              onChange={(event) => setDestinationCountry(event.target.value)}
              value={destinationCountry}
            >
              {visibleMarkets.map((market) => (
                <option key={market} value={market}>
                  {market}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <button
              className="w-full rounded-2xl bg-amber-300 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70 lg:w-auto"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Resolving..." : "Resolve and look up"}
            </button>
          </div>
        </form>

        <div className="mt-4 space-y-3">
          {isLoadingMarkets ? (
            <p className="text-sm text-slate-500">Loading supported markets...</p>
          ) : null}
          {marketError ? (
            <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {marketError}
            </p>
          ) : null}
          {submissionError ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
              {submissionError}
            </p>
          ) : null}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Probable HS code</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">
              {probableHsCode}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {classification
                ? `${classification.confidence} confidence via ${formatMethodLabel(
                    classification.method,
                  )}.`
                : detailRequest
                  ? detailRequest.classificationRationale
                : "Resolved from the product description when the user does not know the code."}
            </p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">MFN rate</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">
              {lookupResult?.mfnTariffRate ||
                (detailRequest ? "Need more detail" : "Pending lookup")}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {lookupResponse
                ? `Returned for ${lookupResponse.query.destinationCountry}.`
                : detailRequest
                  ? "Add more product detail before the EU tariff rate can be resolved."
                : "Will be populated from the tariff lookup response."}
            </p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Preferential rate</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">
              {lookupResult?.preferentialTariffRate ||
                (detailRequest ? "Need more detail" : "Pending lookup")}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {lookupResponse
                ? "Loaded from the current lookup response."
                : detailRequest
                  ? "The agreement path cannot be evaluated until the product branch is clearer."
                : "Will reflect the applicable agreement path when available."}
            </p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Agreement basis</p>
            <p className="mt-3 text-lg font-semibold text-slate-900">
              {lookupResult?.agreementBasis ||
                (detailRequest ? "Need more detail" : "Pending lookup")}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {detailRequest
                ? "More product detail is required before the EU agreement path can be stated safely."
                : "Agreement context returned alongside the tariff rates."}
            </p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Eligibility notes</p>
            {lookupResult?.eligibilityNotes.length ? (
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {lookupResult.eligibilityNotes.map((note) => (
                  <li key={note} className="rounded-2xl bg-white px-3 py-2">
                    {note}
                  </li>
                ))}
              </ul>
            ) : detailRequest ? (
              <>
                <p className="mt-3 text-lg font-semibold text-slate-900">
                  More detail needed
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                  {detailRequest.requestedDetails.map((note) => (
                    <li key={note} className="rounded-2xl bg-white px-3 py-2">
                      {note}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-slate-600">
                  Try: {detailRequest.suggestedPrompt}
                </p>
              </>
            ) : (
              <>
                <p className="mt-3 text-lg font-semibold text-slate-900">
                  Awaiting lookup
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Notes will explain the classification basis and tariff context.
                </p>
              </>
            )}
          </div>
        </div>

        {lookupResponse ? (
          <div
            className={`mt-4 rounded-[24px] border px-4 py-3 text-sm ${getCoverageBannerClasses(
              lookupResponse.meta.coverageStatus,
            )}`}
          >
            Using probable HS code {lookupResponse.classification.probableHsCode}{" "}
            for {lookupResponse.query.destinationCountry}. Classification basis:{" "}
            {lookupResponse.classification.rationale} Data source:{" "}
            {lookupResponse.result.source}. Source tier:{" "}
            {formatSourceTierLabel(lookupResponse.meta.source)}. Coverage state:{" "}
            {formatCoverageStatusLabel(lookupResponse.meta.coverageStatus)}.{" "}
            {lookupResponse.meta.coverageNote} {formatHistoryStatusMessage(
              lookupResponse.meta.historyStatus,
            )} Effective date: {lookupResponse.result.effectiveDate}.
          </div>
        ) : detailRequest ? (
          <div className="mt-4 rounded-[24px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            EU lookup paused at probable HS code {detailRequest.probableHsCode}.{" "}
            {detailRequest.reason} Classification basis:{" "}
            {detailRequest.classificationRationale} Try:{" "}
            {detailRequest.suggestedPrompt}
          </div>
        ) : null}
      </section>

      <section className="space-y-6">
        <div className="rounded-[32px] border border-white/70 bg-white/75 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Initial coverage
          </p>
          <div className="mt-5 grid gap-3">
            {visibleMarkets.map((market) => (
              <div
                key={market}
                className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
              >
                {market}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-cyan-200/70 bg-cyan-50/85 p-6 shadow-xl shadow-cyan-100/70">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-900">
            Next integration
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-cyan-950">
            <li>Expand the verified EU normalized tariff set beyond the first production-priority rows.</li>
            <li>Replace ambiguous EU branch fallbacks with clearer product-detail requests.</li>
            <li>Persist lookup history once auth is enabled.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
