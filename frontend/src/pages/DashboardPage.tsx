import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { logClientFailure } from "../lib/client-observability";

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
).replace(/\/$/, "");

type LookupHistoryEntry = {
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
  sourceTier: "seed-demo-data" | "local-normalized-data";
  coverageStatus: "normalized-record" | "seed-fallback";
  effectiveDate: string;
};

type LookupHistoryResponse = {
  lookups: LookupHistoryEntry[];
};

export function DashboardPage() {
  const auth = useAuth();
  const [lookups, setLookups] = useState<LookupHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadLookupHistory() {
      if (!auth.accessToken) {
        setLookups([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiBaseUrl}/api/account/lookups`, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
          signal: controller.signal,
        });
        const requestId = response.headers.get("x-request-id");

        const payload = (await response.json()) as
          | LookupHistoryResponse
          | { error?: string; message?: string };

        if (!response.ok) {
          const errorPayload = payload as { error?: string; message?: string };
          const message =
            errorPayload.message ||
            errorPayload.error ||
            "Unable to load lookup history.";

          logClientFailure({
            event: "dashboard-history-load-failed",
            route: "/dashboard",
            message,
            requestId,
            statusCode: response.status,
          });

          throw new Error(message);
        }

        setLookups((payload as LookupHistoryResponse).lookups);
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === "AbortError") {
          return;
        }

        logClientFailure({
          event: "dashboard-history-load-failed",
          route: "/dashboard",
          message:
            loadError instanceof Error
              ? loadError.message
              : "Unable to load lookup history.",
        });
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load lookup history.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadLookupHistory();

    return () => controller.abort();
  }, [auth.accessToken]);

  const dashboardCards = [
    {
      title: "Saved lookups",
      value: String(lookups.length),
      detail: "Successful lookups are stored here once you are signed in and backend persistence is configured.",
    },
    {
      title: "Signed-in account",
      value: auth.user?.email || "Unavailable",
      detail: "Supabase auth now gates the account and history surfaces while the public lookup remains open.",
    },
    {
      title: "Backend status",
      value: lookups.some((lookup) => lookup.sourceTier === "local-normalized-data")
        ? "EU live slice"
        : "History only",
      detail:
        "The dashboard reflects saved lookups, while the core lookup engine still stays application-controlled in the backend.",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/70 bg-white/75 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          Dashboard
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Saved lookup history and operational readiness
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          This page is now connected to the first account layer. Once Supabase is
          configured, successful signed-in lookups from the home page appear here
          automatically.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {dashboardCards.map((card) => (
          <article
            key={card.title}
            className="rounded-[28px] border border-white/70 bg-white/75 p-5 shadow-xl shadow-slate-200/60 backdrop-blur"
          >
            <p className="text-sm font-medium text-slate-500">{card.title}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-950">
              {card.value}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {card.detail}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-[32px] border border-white/70 bg-white/75 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Lookup history
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              Recent saved lookups
            </h3>
          </div>
        </div>

        {isLoading ? (
          <p className="mt-6 text-sm text-slate-500">Loading saved lookups...</p>
        ) : null}

        {error ? (
          <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {error}
          </p>
        ) : null}

        {!isLoading && !error && lookups.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            No saved lookups yet. Run a lookup from the home page while signed in
            to populate this history.
          </p>
        ) : null}

        {!isLoading && !error && lookups.length > 0 ? (
          <div className="mt-6 space-y-4">
            {lookups.map((lookup) => (
              <article
                key={lookup.id}
                className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {lookup.destinationCountry}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-950">
                      {lookup.productDescription || `HS ${lookup.hsCode}`}
                    </p>
                  </div>
                  <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                    {lookup.hsCode}
                  </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  <div className="rounded-2xl bg-white px-3 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      MFN
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {lookup.mfnTariffRate}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white px-3 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Preferential
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {lookup.preferentialTariffRate}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white px-3 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Coverage
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {lookup.coverageStatus === "normalized-record"
                        ? "Verified EU row"
                        : "Seed fallback"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white px-3 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Saved
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {new Date(lookup.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {lookup.agreementBasis}
                </p>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
