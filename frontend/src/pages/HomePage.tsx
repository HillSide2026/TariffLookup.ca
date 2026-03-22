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

type StarterScenario = {
  title: string;
  helper: string;
  outcomeLabel: string;
  destinationCountry: string;
  productDescription: string;
  hsCode?: string;
};

const starterScenarios: StarterScenario[] = [
  {
    title: "Verified EU tariff row",
    helper: "Description-first lookup against the normalized EU slice.",
    outcomeLabel: "Verified EU row",
    destinationCountry: "European Union",
    productDescription: "stainless steel kitchen knife blades",
  },
  {
    title: "EU needs more detail",
    helper:
      "Shows the ambiguity workflow when one broad code covers multiple official branches.",
    outcomeLabel: "Follow-up required",
    destinationCountry: "European Union",
    productDescription: "",
    hsCode: "8501.52",
  },
  {
    title: "EU fallback coverage",
    helper:
      "Shows the explicit prototype fallback state for uncovered EU requests.",
    outcomeLabel: "Prototype fallback",
    destinationCountry: "European Union",
    productDescription: "custom factory automation assembly module",
  },
  {
    title: "Non-EU seed path",
    helper: "Shows seeded prototype coverage outside the current verified EU slice.",
    outcomeLabel: "Seed demo data",
    destinationCountry: "Japan",
    productDescription: "stainless steel kitchen knife blades",
  },
];

const exporterStakes = [
  {
    title: "Quoting gets risky fast",
    body:
      "If the tariff picture is unclear, pricing and distributor conversations get delayed or padded with guesswork.",
  },
  {
    title: "Manual tariff research eats time",
    body:
      "Export teams often start with only a rough description, then burn time trying to map it to the right code and duty treatment.",
  },
  {
    title: "Expansion decisions need a first answer",
    body:
      "Before you commit to a market, you need a structured first-pass view of the tariff outcome and agreement path.",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Start with the product",
    body:
      "Enter one rough product description or one known HS code for a specific export question.",
  },
  {
    step: "02",
    title: "Choose the destination",
    body:
      "Run the lookup against one target market so the classification and tariff context stay focused.",
  },
  {
    step: "03",
    title: "Get a structured result",
    body:
      "Review probable HS code, MFN rate, preferential rate, agreement basis, and eligibility notes in one output.",
  },
];

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

function getMarketSurfaceClasses(market: string) {
  if (market === "European Union") {
    return "border-[#4a6fa5]/25 bg-[#eef4ff] text-[#16395c]";
  }

  return "border-slate-200 bg-white text-slate-700";
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
  const heroProofPoints = [
    "One product, one destination, one structured answer.",
    "Built for Canadian exporters who need a fast first tariff view.",
    "Explicit about verified coverage, follow-up needs, and fallback states.",
  ];
  const accessPrimaryLabel = auth.isAuthenticated
    ? "Open saved history"
    : "Get access now";
  const accessSecondaryLabel = auth.isAuthenticated
    ? "Manage account settings"
    : "Get early access";

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

  function loadStarterScenario(scenario: StarterScenario) {
    setProductDescription(scenario.productDescription);
    setHsCode(scenario.hsCode || "");
    setDestinationCountry(scenario.destinationCountry);
    setLookupResponse(null);
    setDetailRequest(null);
    setFollowUpDetail("");
    setSubmissionError(null);
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
    <div className="space-y-6 lg:space-y-8">
      <section className="overflow-hidden rounded-[36px] border border-[rgba(15,42,68,0.1)] bg-white/88 p-6 shadow-[0_24px_60px_rgba(12,22,38,0.08)] backdrop-blur-xl sm:p-8">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex rounded-full border border-[#4a6fa5]/20 bg-[#eef4ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#16395c]">
                Instant clarity on tariffs
              </span>
              <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-900">
                Early rollout
              </span>
            </div>

            <h1 className="mt-5 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Get a clear first tariff answer before you commit to the market.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              TariffLookup.ca helps Canadian exporters start with a rough product
              description, resolve a probable HS code, and see a structured tariff
              answer without a messy manual research loop.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {heroProofPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700"
                >
                  {point}
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-[#0f2a44] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16395c]"
                to={auth.isAuthenticated ? "/dashboard" : "/login"}
              >
                {accessPrimaryLabel}
              </Link>
              <a
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-400"
                href="#lookup-console"
              >
                See the lookup flow
              </a>
            </div>
          </div>

          <div
            className="rounded-[36px] bg-[#0f2a44] p-5 text-white shadow-[0_30px_70px_rgba(15,42,68,0.22)] sm:p-6"
            id="lookup-console"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                  Task-first hero
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  Run the lookup from the landing page
                </h2>
              </div>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                {auth.isAuthenticated ? "Account-linked" : "Public mode"}
              </span>
            </div>

            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium text-white/80">
                  Product description
                </span>
                <textarea
                  className="min-h-32 rounded-[24px] border border-white/10 bg-white/8 px-4 py-4 text-white outline-none placeholder:text-white/45 focus:border-white/25 focus:bg-white/10"
                  onChange={(event) => setProductDescription(event.target.value)}
                  placeholder="stainless steel kitchen knife blades"
                  value={productDescription}
                />
              </label>

              <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
                <label className="flex flex-col gap-2 text-sm">
                  <span className="font-medium text-white/80">HS code</span>
                  <input
                    autoComplete="off"
                    className="rounded-[20px] border border-white/10 bg-white/8 px-4 py-3 text-white outline-none placeholder:text-white/45 focus:border-white/25 focus:bg-white/10"
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
                    className="rounded-[20px] border border-white/10 bg-white/8 px-4 py-3 text-white outline-none focus:border-white/25 focus:bg-white/10"
                    onChange={(event) => handleDestinationChange(event.target.value)}
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
                    className="w-full rounded-[20px] bg-[#d72638] px-5 py-3 font-semibold text-white transition hover:bg-[#bf2232] disabled:cursor-not-allowed disabled:opacity-70 lg:w-auto"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? "Resolving..." : "Resolve and look up"}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5 space-y-3">
              {isLoadingMarkets ? (
                <p className="text-sm text-slate-300">
                  Loading supported markets...
                </p>
              ) : null}
              {marketError ? (
                <p className="rounded-[18px] border border-amber-200/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
                  {marketError}
                </p>
              ) : null}
              {submissionError ? (
                <p className="rounded-[18px] border border-rose-200/30 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
                  {submissionError}
                </p>
              ) : null}
              <p className="text-sm leading-6 text-slate-300">
                Default destination:{" "}
                <span className="font-semibold text-white">
                  {userPreferences.defaultDestination}
                </span>
                .{" "}
                {userPreferences.rememberLastDestination
                  ? "This browser will reopen on your most recent destination."
                  : "This browser will keep using your saved default destination."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[36px] border border-[rgba(15,42,68,0.1)] bg-white/88 p-6 shadow-[0_24px_60px_rgba(12,22,38,0.08)] backdrop-blur-xl sm:p-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            02. Exporter stakes
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Before you quote, expand, or commit, you need a clear tariff picture.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            This is not a broad trade-compliance promise. It is a focused answer
            to a specific exporter problem: tariff uncertainty slows good market
            decisions.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {exporterStakes.map((stake) => (
            <article
              key={stake.title}
              className="rounded-[28px] border border-slate-200 bg-slate-50 p-5"
            >
              <p className="text-lg font-semibold text-slate-950">
                {stake.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {stake.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[36px] border border-[rgba(15,42,68,0.1)] bg-white/88 p-6 shadow-[0_24px_60px_rgba(12,22,38,0.08)] backdrop-blur-xl sm:p-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            03. How it works
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            One product. One destination. One structured answer.
          </h2>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {workflowSteps.map((step) => (
            <article
              key={step.step}
              className="rounded-[30px] border border-slate-200 bg-slate-50 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Step {step.step}
              </p>
              <p className="mt-3 text-xl font-semibold text-slate-950">
                {step.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {step.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[36px] border border-[rgba(15,42,68,0.1)] bg-white/88 p-6 shadow-[0_24px_60px_rgba(12,22,38,0.08)] backdrop-blur-xl sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              04. Real product proof
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Show the real states, not generic marketing claims.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              These scenarios are intentionally honest: verified EU coverage,
              ambiguity that needs more detail, and explicit fallback behavior.
            </p>

            <div className="mt-6 grid gap-3">
              {starterScenarios.map((scenario) => (
                <button
                  key={scenario.title}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"
                  onClick={() => loadStarterScenario(scenario)}
                  type="button"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {scenario.outcomeLabel}
                    </p>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                      {scenario.destinationCountry}
                    </span>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-slate-950">
                    {scenario.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {scenario.helper}
                  </p>
                  <p className="mt-3 text-sm font-medium text-[#0f2a44]">
                    {scenario.hsCode
                      ? `Load HS ${scenario.hsCode}`
                      : scenario.productDescription}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">
                  Probable HS code
                </p>
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

              <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
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

              <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">
                  Preferential rate
                </p>
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

              <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">
                  Agreement basis
                </p>
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
            </div>

            <div className="rounded-[30px] border border-slate-200 bg-white p-5">
              <p className="text-sm font-medium text-slate-500">
                Eligibility notes
              </p>
              {lookupResult?.eligibilityNotes.length ? (
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                  {lookupResult.eligibilityNotes.map((note) => (
                    <li key={note} className="rounded-[18px] bg-slate-50 px-3 py-2">
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
                      <li key={note} className="rounded-[18px] bg-slate-50 px-3 py-2">
                        {note}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm text-slate-600">
                    Try: {detailRequest.suggestedPrompt}
                  </p>
                  <label className="mt-3 block text-sm font-medium text-slate-700">
                    Build a safer description for the next attempt
                    <textarea
                      className="mt-2 min-h-28 w-full rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                      onChange={(event) => setFollowUpDetail(event.target.value)}
                      value={followUpDetail}
                    />
                  </label>
                  <button
                    className="mt-3 rounded-full bg-[#0f2a44] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#16395c]"
                    onClick={handleApplyFollowUpDetail}
                    type="button"
                  >
                    Use these details in the lookup form
                  </button>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    If you started with an HS code, the app will switch back to a
                    description-first retry so you can narrow the branch more safely.
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

            {lookupResponse ? (
              <div
                className={`rounded-[24px] border px-4 py-4 text-sm leading-7 ${getCoverageBannerClasses(
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
              <div className="rounded-[24px] border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-7 text-amber-950">
                EU lookup paused at probable HS code {detailRequest.probableHsCode}.{" "}
                {detailRequest.reason} Classification basis:{" "}
                {detailRequest.classificationRationale} Try:{" "}
                {detailRequest.suggestedPrompt}
              </div>
            ) : null}

            {auth.isAuthenticated &&
            lookupResponse?.meta.historyStatus === "saved" ? (
              <div className="flex flex-wrap items-center gap-3 rounded-[24px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
                <span>Saved to your dashboard history.</span>
                <Link className="font-medium underline" to="/dashboard">
                  Open dashboard
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-[36px] border border-[rgba(15,42,68,0.1)] bg-white/88 p-6 shadow-[0_24px_60px_rgba(12,22,38,0.08)] backdrop-blur-xl sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_360px]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              05. Trust and scope boundaries
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Useful because it is careful, not because it pretends to cover everything perfectly.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              TariffLookup should earn trust by being explicit about where coverage
              is verified, where more product detail is required, and where the
              current product is still operating in prototype mode.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <article className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-900">
                  Verified today
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-950">
                  31 normalized EU rows
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  Official EU source packages are being normalized locally and used
                  directly in the verified slice.
                </p>
              </article>

              <article className="rounded-[28px] border border-amber-200 bg-amber-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-900">
                  Honest boundaries
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-950">
                  Follow-up when needed
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  If one broad code covers multiple official branches, the product
                  asks for more detail instead of guessing.
                </p>
              </article>

              <article className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Why get access
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-950">
                  Save the work
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  Access turns one-off public lookups into saved account history and
                  repeat-use workflow continuity.
                </p>
              </article>
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Current market list
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Coverage surfaces visible in the current app
            </h3>
            <div className="mt-5 grid gap-3">
              {visibleMarkets.map((market) => (
                <div
                  key={market}
                  className={`rounded-[22px] border px-4 py-3 text-sm font-medium ${getMarketSurfaceClasses(
                    market,
                  )}`}
                >
                  {market}
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-[22px] border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-600">
              Preferred destination:{" "}
              <span className="font-semibold text-slate-900">
                {userPreferences.defaultDestination}
              </span>
              <br />
              Remember last destination:{" "}
              <span className="font-semibold text-slate-900">
                {userPreferences.rememberLastDestination ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="overflow-hidden rounded-[36px] bg-[#0f2a44] p-6 text-white shadow-[0_30px_70px_rgba(15,42,68,0.22)] sm:p-8"
        id="final-cta"
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
              06. Final call to action
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Get access to the product and keep your next tariff decision moving.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-200">
              Start with one exporter question, keep the answer grounded in the
              product’s real coverage, and save the work as the EU coverage base
              expands.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0f2a44] transition hover:bg-slate-100"
                to={auth.isAuthenticated ? "/dashboard" : "/login"}
              >
                {accessSecondaryLabel}
              </Link>
              <a
                className="rounded-full border border-white/20 bg-white/8 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/12"
                href="#lookup-console"
              >
                Run a lookup first
              </a>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/12 bg-white/8 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
              What access adds
            </p>
            <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-100">
              <div className="rounded-[20px] border border-white/10 bg-white/6 px-4 py-3">
                Saved lookup history for repeat review
              </div>
              <div className="rounded-[20px] border border-white/10 bg-white/6 px-4 py-3">
                Browser and account continuity across tariff checks
              </div>
              <div className="rounded-[20px] border border-white/10 bg-white/6 px-4 py-3">
                A calmer path from first lookup to ongoing usage
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
