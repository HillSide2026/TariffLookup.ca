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
    <div className="divide-y" style={{ borderColor: "var(--tl-color-rule)" }}>
      <section className="py-10 sm:py-14">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-3">
              <span className="border px-3 py-1 text-xs font-medium uppercase tracking-[0.22em]" style={{ fontFamily: "var(--tl-font-mono)", borderColor: "var(--tl-color-rule)", color: "var(--tl-color-ink-muted)" }}>
                Instant clarity on tariffs
              </span>
              <span className="border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-amber-900" style={{ fontFamily: "var(--tl-font-mono)" }}>
                Early rollout
              </span>
            </div>

            <h1 className="mt-5 text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl" style={{ fontFamily: "var(--tl-font-display)", color: "var(--tl-color-ink)" }}>
              Get a clear first tariff answer before you commit to the market.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8" style={{ color: "var(--tl-color-ink-mid)" }}>
              TariffLookup.ca helps Canadian exporters start with a rough product
              description, resolve a probable HS code, and see a structured tariff
              answer without a messy manual research loop.
            </p>

            <div className="mt-6 grid gap-0 border-t sm:grid-cols-3" style={{ borderColor: "var(--tl-color-rule)" }}>
              {heroProofPoints.map((point) => (
                <div
                  key={point}
                  className="border-b py-4 pr-6 text-sm leading-6 sm:border-b-0 sm:border-r last:border-r-0"
                  style={{ borderColor: "var(--tl-color-rule)", color: "var(--tl-color-ink-mid)" }}
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
            className="bg-[#0d1117] p-6 text-white sm:p-8"
            id="lookup-console"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/40" style={{ fontFamily: "var(--tl-font-mono)" }}>
                  Lookup console
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white" style={{ fontFamily: "var(--tl-font-display)" }}>
                  Run the lookup from the landing page
                </h2>
              </div>
              <span className="border border-white/15 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/50" style={{ fontFamily: "var(--tl-font-mono)" }}>
                {auth.isAuthenticated ? "Account-linked" : "Public mode"}
              </span>
            </div>

            <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/50" style={{ fontFamily: "var(--tl-font-mono)" }}>
                  Product description
                </span>
                <textarea
                  className="min-h-32 border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-white/30 focus:border-white/20 focus:bg-white/8"
                  style={{ fontFamily: "var(--tl-font-mono)", fontSize: "0.875rem" }}
                  onChange={(event) => setProductDescription(event.target.value)}
                  placeholder="stainless steel kitchen knife blades"
                  value={productDescription}
                />
              </label>

              <div className="grid gap-5 lg:grid-cols-[1fr_1fr_auto]">
                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/50" style={{ fontFamily: "var(--tl-font-mono)" }}>HS code</span>
                  <input
                    autoComplete="off"
                    className="border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/20 focus:bg-white/8"
                    style={{ fontFamily: "var(--tl-font-mono)" }}
                    inputMode="decimal"
                    onChange={(event) => setHsCode(event.target.value)}
                    placeholder="Optional"
                    value={hsCode}
                  />
                  <span className="text-xs text-white/35" style={{ fontFamily: "var(--tl-font-mono)" }}>
                    Override when you already know the code.
                  </span>
                </label>

                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/50" style={{ fontFamily: "var(--tl-font-mono)" }}>Destination</span>
                  <select
                    className="border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/20 focus:bg-white/8"
                    style={{ fontFamily: "var(--tl-font-mono)" }}
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
                    className="w-full bg-[#d72638] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#bf2232] disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? "Resolving..." : "Resolve and look up"}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
              {isLoadingMarkets ? (
                <p className="text-xs text-white/40" style={{ fontFamily: "var(--tl-font-mono)" }}>
                  Loading supported markets...
                </p>
              ) : null}
              {marketError ? (
                <p className="border border-amber-400/20 bg-amber-400/8 px-4 py-3 text-sm text-amber-200">
                  {marketError}
                </p>
              ) : null}
              {submissionError ? (
                <p className="border border-rose-400/20 bg-rose-400/8 px-4 py-3 text-sm text-rose-200">
                  {submissionError}
                </p>
              ) : null}
              <p className="text-xs leading-6 text-white/40" style={{ fontFamily: "var(--tl-font-mono)" }}>
                Default destination:{" "}
                <span className="text-white/70">
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

      <section className="py-10 sm:py-14">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em]" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-color-ink-muted)" }}>
            02. Exporter stakes
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl" style={{ fontFamily: "var(--tl-font-display)", color: "var(--tl-color-ink)" }}>
            Before you quote, expand, or commit, you need a clear tariff picture.
          </h2>
          <p className="mt-4 text-base leading-7" style={{ color: "var(--tl-color-ink-mid)" }}>
            This is not a broad trade-compliance promise. It is a focused answer
            to a specific exporter problem: tariff uncertainty slows good market
            decisions.
          </p>
        </div>

        <div className="mt-8 grid gap-0 border-t md:grid-cols-3" style={{ borderColor: "var(--tl-color-rule)" }}>
          {exporterStakes.map((stake) => (
            <article
              key={stake.title}
              className="border-b py-6 pr-8 md:border-b-0 md:border-r last:border-r-0"
              style={{ borderColor: "var(--tl-color-rule)" }}
            >
              <p className="text-lg font-semibold" style={{ fontFamily: "var(--tl-font-display)", color: "var(--tl-color-ink)" }}>
                {stake.title}
              </p>
              <p className="mt-3 text-sm leading-7" style={{ color: "var(--tl-color-ink-mid)" }}>
                {stake.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.24em]" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-color-ink-muted)" }}>
            03. How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl" style={{ fontFamily: "var(--tl-font-display)", color: "var(--tl-color-ink)" }}>
            One product. One destination. One structured answer.
          </h2>
        </div>

        <div className="mt-8 grid gap-0 border-t lg:grid-cols-3" style={{ borderColor: "var(--tl-color-rule)" }}>
          {workflowSteps.map((step) => (
            <article
              key={step.step}
              className="border-b py-6 pr-8 lg:border-b-0 lg:border-r last:border-r-0"
              style={{ borderColor: "var(--tl-color-rule)" }}
            >
              <p className="text-xs font-medium uppercase tracking-[0.24em]" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-color-maple-red)" }}>
                {step.step}
              </p>
              <p className="mt-3 text-xl font-semibold" style={{ fontFamily: "var(--tl-font-display)", color: "var(--tl-color-ink)" }}>
                {step.title}
              </p>
              <p className="mt-3 text-sm leading-7" style={{ color: "var(--tl-color-ink-mid)" }}>
                {step.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="grid gap-10 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em]" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-color-ink-muted)" }}>
              04. Real product proof
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--tl-font-display)", color: "var(--tl-color-ink)" }}>
              Show the real states, not generic marketing claims.
            </h2>
            <p className="mt-4 text-base leading-7" style={{ color: "var(--tl-color-ink-mid)" }}>
              These scenarios are intentionally honest: verified EU coverage,
              ambiguity that needs more detail, and explicit fallback behavior.
            </p>

            <div className="mt-6 divide-y" style={{ borderColor: "var(--tl-color-rule)" }}>
              {starterScenarios.map((scenario) => (
                <button
                  key={scenario.title}
                  className="w-full py-4 text-left transition hover:pl-1"
                  onClick={() => loadStarterScenario(scenario)}
                  type="button"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-color-ink-muted)" }}>
                      {scenario.outcomeLabel}
                    </p>
                    <span className="border px-2 py-0.5 text-xs font-medium" style={{ fontFamily: "var(--tl-font-mono)", borderColor: "var(--tl-color-rule)", color: "var(--tl-color-ink-muted)" }}>
                      {scenario.destinationCountry}
                    </span>
                  </div>
                  <p className="mt-2 text-lg font-semibold" style={{ fontFamily: "var(--tl-font-display)", color: "var(--tl-color-ink)" }}>
                    {scenario.title}
                  </p>
                  <p className="mt-1 text-sm leading-6" style={{ color: "var(--tl-color-ink-mid)" }}>
                    {scenario.helper}
                  </p>
                  <p className="mt-2 text-sm font-medium" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-color-deep-navy)" }}>
                    {scenario.hsCode
                      ? `Load HS ${scenario.hsCode}`
                      : scenario.productDescription}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-0 border-t md:grid-cols-2 xl:grid-cols-4" style={{ borderColor: "var(--tl-color-rule)" }}>
              <div className="border-b py-5 pr-6 xl:border-b-0 xl:border-r" style={{ borderColor: "var(--tl-color-rule)" }}>
                <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-color-ink-muted)" }}>
                  Probable HS code
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-color-ink)" }}>
                  {probableHsCode}
                </p>
                <p className="mt-2 text-sm leading-6" style={{ color: "var(--tl-color-ink-mid)" }}>
                  {classification
                    ? `${classification.confidence} confidence via ${formatMethodLabel(
                        classification.method,
                      )}.`
                    : detailRequest
                      ? detailRequest.classificationRationale
                      : "Resolved from the product description when the user does not know the code."}
                </p>
              </div>

              <div className="border-b py-5 pr-6 xl:border-b-0 xl:border-r" style={{ borderColor: "var(--tl-color-rule)" }}>
                <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-color-ink-muted)" }}>MFN rate</p>
                <p className="mt-3 text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-color-ink)" }}>
                  {lookupResult?.mfnTariffRate ||
                    (detailRequest ? "—" : "—")}
                </p>
                <p className="mt-2 text-sm leading-6" style={{ color: "var(--tl-color-ink-mid)" }}>
                  {lookupResponse
                    ? `Returned for ${lookupResponse.query.destinationCountry}.`
                    : detailRequest
                      ? "Add more product detail before the EU tariff rate can be resolved."
                      : "Will be populated from the tariff lookup response."}
                </p>
              </div>

              <div className="border-b py-5 pr-6 xl:border-b-0 xl:border-r" style={{ borderColor: "var(--tl-color-rule)" }}>
                <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-color-ink-muted)" }}>
                  Preferential rate
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-color-ink)" }}>
                  {lookupResult?.preferentialTariffRate ||
                    (detailRequest ? "—" : "—")}
                </p>
                <p className="mt-2 text-sm leading-6" style={{ color: "var(--tl-color-ink-mid)" }}>
                  {lookupResponse
                    ? "Loaded from the current lookup response."
                    : detailRequest
                      ? "The agreement path cannot be evaluated until the product branch is clearer."
                      : "Will reflect the applicable agreement path when available."}
                </p>
              </div>

              <div className="py-5 pr-6" style={{ borderColor: "var(--tl-color-rule)" }}>
                <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-color-ink-muted)" }}>
                  Agreement basis
                </p>
                <p className="mt-3 text-xl font-semibold" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-color-ink)" }}>
                  {lookupResult?.agreementBasis ||
                    (detailRequest ? "—" : "—")}
                </p>
                <p className="mt-2 text-sm leading-6" style={{ color: "var(--tl-color-ink-mid)" }}>
                  {detailRequest
                    ? "More product detail is required before the EU agreement path can be stated safely."
                    : "Agreement context returned alongside the tariff rates."}
                </p>
              </div>
            </div>

            <div className="border-t pt-5" style={{ borderColor: "var(--tl-color-rule)" }}>
              <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-color-ink-muted)" }}>
                Eligibility notes
              </p>
              {lookupResult?.eligibilityNotes.length ? (
                <ul className="mt-3 space-y-2 text-sm leading-6" style={{ color: "var(--tl-color-ink-mid)" }}>
                  {lookupResult.eligibilityNotes.map((note) => (
                    <li key={note} className="border-l-2 border-[#d72638] pl-3">
                      {note}
                    </li>
                  ))}
                </ul>
              ) : detailRequest ? (
                <>
                  <p className="mt-3 text-lg font-semibold" style={{ fontFamily: "var(--tl-font-display)", color: "var(--tl-color-ink)" }}>
                    More detail needed
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-6" style={{ color: "var(--tl-color-ink-mid)" }}>
                    {detailRequest.requestedDetails.map((note) => (
                      <li key={note} className="border-l-2 border-[#d72638] pl-3">
                        {note}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm" style={{ color: "var(--tl-color-ink-mid)" }}>
                    Try: {detailRequest.suggestedPrompt}
                  </p>
                  <label className="mt-4 block text-sm font-medium" style={{ color: "var(--tl-color-ink)" }}>
                    Build a safer description for the next attempt
                    <textarea
                      className="mt-2 min-h-28 w-full border px-4 py-3 text-sm outline-none transition"
                      style={{ borderColor: "var(--tl-color-rule)", backgroundColor: "var(--tl-color-paper-mid)", color: "var(--tl-color-ink)", fontFamily: "var(--tl-font-mono)" }}
                      onChange={(event) => setFollowUpDetail(event.target.value)}
                      value={followUpDetail}
                    />
                  </label>
                  <button
                    className="mt-3 bg-[#0f2a44] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#16395c]"
                    onClick={handleApplyFollowUpDetail}
                    type="button"
                  >
                    Use these details in the lookup form
                  </button>
                  <p className="mt-2 text-xs leading-5" style={{ color: "var(--tl-color-ink-muted)" }}>
                    If you started with an HS code, the app will switch back to a
                    description-first retry so you can narrow the branch more safely.
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-3 text-lg font-semibold" style={{ fontFamily: "var(--tl-font-display)", color: "var(--tl-color-ink)" }}>
                    Awaiting lookup
                  </p>
                  <p className="mt-2 text-sm" style={{ color: "var(--tl-color-ink-mid)" }}>
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

      <section className="py-10 sm:py-14">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1.1fr)_360px]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em]" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-color-ink-muted)" }}>
              05. Trust and scope boundaries
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl" style={{ fontFamily: "var(--tl-font-display)", color: "var(--tl-color-ink)" }}>
              Useful because it is careful, not because it pretends to cover everything perfectly.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7" style={{ color: "var(--tl-color-ink-mid)" }}>
              TariffLookup should earn trust by being explicit about where coverage
              is verified, where more product detail is required, and where the
              current product is still operating in prototype mode.
            </p>

            <div className="mt-8 grid gap-0 border-t md:grid-cols-3" style={{ borderColor: "var(--tl-color-rule)" }}>
              <article className="border-b py-6 pr-6 md:border-b-0 md:border-r" style={{ borderColor: "var(--tl-color-rule)" }}>
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-emerald-700" style={{ fontFamily: "var(--tl-font-mono)" }}>
                  Verified today
                </p>
                <p className="mt-3 text-2xl font-bold" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-color-ink)" }}>
                  31 normalized EU rows
                </p>
                <p className="mt-3 text-sm leading-7" style={{ color: "var(--tl-color-ink-mid)" }}>
                  Official EU source packages are being normalized locally and used
                  directly in the verified slice.
                </p>
              </article>

              <article className="border-b py-6 pr-6 md:border-b-0 md:border-r" style={{ borderColor: "var(--tl-color-rule)" }}>
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-amber-700" style={{ fontFamily: "var(--tl-font-mono)" }}>
                  Honest boundaries
                </p>
                <p className="mt-3 text-2xl font-bold" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-color-ink)" }}>
                  Follow-up when needed
                </p>
                <p className="mt-3 text-sm leading-7" style={{ color: "var(--tl-color-ink-mid)" }}>
                  If one broad code covers multiple official branches, the product
                  asks for more detail instead of guessing.
                </p>
              </article>

              <article className="py-6 pr-6">
                <p className="text-xs font-medium uppercase tracking-[0.22em]" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-color-ink-muted)" }}>
                  Why get access
                </p>
                <p className="mt-3 text-2xl font-bold" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-color-ink)" }}>
                  Save the work
                </p>
                <p className="mt-3 text-sm leading-7" style={{ color: "var(--tl-color-ink-mid)" }}>
                  Access turns one-off public lookups into saved account history and
                  repeat-use workflow continuity.
                </p>
              </article>
            </div>
          </div>

          <div className="border-t pt-8 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0" style={{ borderColor: "var(--tl-color-rule)" }}>
            <p className="text-xs font-medium uppercase tracking-[0.22em]" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-color-ink-muted)" }}>
              Current market list
            </p>
            <h3 className="mt-2 text-xl font-bold tracking-tight" style={{ fontFamily: "var(--tl-font-display)", color: "var(--tl-color-ink)" }}>
              Coverage surfaces visible in the current app
            </h3>
            <div className="mt-5 divide-y" style={{ borderColor: "var(--tl-color-rule)" }}>
              {visibleMarkets.map((market) => (
                <div
                  key={market}
                  className="py-3 text-sm font-medium"
                  style={{ fontFamily: "var(--tl-font-mono)", color: market === "European Union" ? "var(--tl-color-deep-navy)" : "var(--tl-color-ink-mid)" }}
                >
                  {market}
                </div>
              ))}
            </div>
            <div className="mt-5 border-t pt-4 text-sm leading-6" style={{ borderColor: "var(--tl-color-rule)", color: "var(--tl-color-ink-mid)", fontFamily: "var(--tl-font-mono)", fontSize: "0.75rem" }}>
              Default: <span style={{ color: "var(--tl-color-ink)" }}>{userPreferences.defaultDestination}</span>
              <br />
              Remember last: <span style={{ color: "var(--tl-color-ink)" }}>{userPreferences.rememberLastDestination ? "On" : "Off"}</span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-[#0d1117] py-12 text-white sm:py-16"
        id="final-cta"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/40" style={{ fontFamily: "var(--tl-font-mono)" }}>
              06. Final call to action
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl" style={{ fontFamily: "var(--tl-font-display)" }}>
              Get access to the product and keep your next tariff decision moving.
            </h2>
            <p className="mt-4 text-base leading-8 text-white/60">
              Start with one exporter question, keep the answer grounded in the
              product’s real coverage, and save the work as the EU coverage base
              expands.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="bg-white px-5 py-3 text-sm font-semibold text-[#0d1117] transition hover:bg-[#f2efe8]"
                to={auth.isAuthenticated ? "/dashboard" : "/login"}
              >
                {accessSecondaryLabel}
              </Link>
              <a
                className="border border-white/20 px-5 py-3 text-sm font-medium text-white/70 transition hover:border-white/35 hover:text-white"
                href="#lookup-console"
              >
                Run a lookup first
              </a>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/40" style={{ fontFamily: "var(--tl-font-mono)" }}>
              What access adds
            </p>
            <div className="mt-5 divide-y divide-white/8 text-sm leading-7 text-white/60">
              <div className="py-3">Saved lookup history for repeat review</div>
              <div className="py-3">Browser and account continuity across tariff checks</div>
              <div className="py-3">A calmer path from first lookup to ongoing usage</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
