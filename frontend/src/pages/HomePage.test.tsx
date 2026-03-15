import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "../auth/AuthProvider";
import { userPreferencesStorageKey } from "../lib/user-preferences";
import { HomePage } from "./HomePage";

const marketsResponse = {
  markets: [
    "United States",
    "European Union",
    "United Kingdom",
    "Japan",
    "Brazil",
    "China",
  ],
};

const lookupResponse = {
  lookupId: "lookup-123",
  query: {
    hsCode: "8208.30",
    submittedHsCode: null,
    productDescription: "stainless steel kitchen knife blades",
    destinationCountry: "European Union",
    inputMode: "description",
  },
  classification: {
    probableHsCode: "8208.30",
    confidence: "high",
    method: "keyword-match",
    rationale:
      "Matched industrial blades and knives keywords: knife, blade, blades, stainless, steel.",
  },
  result: {
    mfnTariffRate: "1.70%",
    preferentialTariffRate: "0%",
    agreementBasis: "EU-Canada CETA tariff preference",
    eligibilityNotes: [
      "Normalized from the European Commission Access2Markets tariff endpoint for HS 820830, origin Canada, destination Germany, retrieved 2026-03-13.",
      "Germany is used as the representative EU member-state destination because the official endpoint requires a member-state code even though customs duties are part of the EU common customs tariff.",
    ],
    source: "European Commission Access2Markets tariff endpoint (CA -> DE snapshot)",
    effectiveDate: "2026-03-13",
  },
  meta: {
    source: "local-normalized-data",
    supportedDestinations: marketsResponse.markets,
    coverageStatus: "normalized-record",
    coverageNote:
      "Matched a verified European Union normalized tariff row sourced from the official Access2Markets package.",
    historyStatus: "anonymous",
  },
} as const;

const detailRequestResponse = {
  error: "More product detail required",
  code: "needs-more-detail",
  message:
    "The official EU source returns multiple motor branches and end-use contexts under HS 8501.52, so the prototype needs more product detail before it can return a verified EU tariff row.",
  detailRequest: {
    probableHsCode: "8501.52",
    classificationRationale:
      "Using the supplied HS code directly.",
    reason:
      "The official EU source returns multiple motor branches and end-use contexts under HS 8501.52, so the prototype needs more product detail before it can return a verified EU tariff row.",
    requestedDetails: [
      "motor use or application, such as civil aircraft, conveyor equipment, or general industrial machinery",
      "power rating and current type",
    ],
    suggestedPrompt:
      "Describe the motor's application, power rating, and whether it is for a special end use such as civil aircraft.",
  },
} as const;

const seedFallbackResponse = {
  lookupId: "lookup-456",
  query: {
    hsCode: "8479.89",
    submittedHsCode: null,
    productDescription: "custom factory automation assembly module",
    destinationCountry: "European Union",
    inputMode: "description",
  },
  classification: {
    probableHsCode: "8479.89",
    confidence: "low",
    method: "fallback-seed-classification",
    rationale:
      "No direct keyword match was found, so the app returned a low-confidence seed classification.",
  },
  result: {
    mfnTariffRate: "2.5% (seed demo)",
    preferentialTariffRate: "0.0% (seed demo)",
    agreementBasis:
      "CETA treatment not yet normalized for this prototype fallback record",
    eligibilityNotes: [
      "Seed/demo fallback record for unclassified industrial machines and mechanical appliances.",
      "This row is intentionally retained as an explicit EU prototype fallback for uncovered low-confidence product descriptions.",
    ],
    source: "TariffLookup internal seed/demo dataset",
    effectiveDate: "2026-03-13",
  },
  meta: {
    source: "seed-demo-data",
    supportedDestinations: marketsResponse.markets,
    coverageStatus: "seed-fallback",
    coverageNote:
      "No verified EU normalized row exists for HS code 8479.89 yet, so the prototype returned the internal seed/demo fallback dataset.",
    historyStatus: "anonymous",
  },
} as const;

function renderHomePage() {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe("HomePage", () => {
  const fetchMock = vi.fn<
    (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
  >();

  beforeEach(() => {
    fetchMock.mockImplementation(async (input) => {
      const url = String(input);

      if (url.endsWith("/api/meta/markets")) {
        return new Response(JSON.stringify(marketsResponse), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      if (url.endsWith("/api/lookups")) {
        return new Response(JSON.stringify(lookupResponse), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      throw new Error(`Unexpected fetch URL: ${url}`);
    });

    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
    delete window.__tarifflookupClientFailures;
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("updates the visible result cards after a lookup", async () => {
    const user = userEvent.setup();

    renderHomePage();

    const descriptionInput = screen.getByLabelText("Product description");

    await user.clear(descriptionInput);
    await user.type(descriptionInput, "stainless steel kitchen knife blades");
    await user.selectOptions(
      screen.getByLabelText("Destination"),
      "European Union",
    );
    await user.click(
      screen.getByRole("button", { name: "Resolve and look up" }),
    );

    expect(await screen.findByText("1.70%")).toBeInTheDocument();
    expect(await screen.findByText("0%")).toBeInTheDocument();
    expect(
      await screen.findByText("EU-Canada CETA tariff preference"),
    ).toBeInTheDocument();
    expect(await screen.findByText("8208.30")).toBeInTheDocument();
    expect(
      await screen.findByText(
        /Data source: European Commission Access2Markets tariff endpoint \(CA -> DE snapshot\)\./i,
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Source tier: Local normalized data\./i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Coverage state: Verified normalized row\./i),
    ).toBeInTheDocument();
  });

  it("uses the saved default destination from browser preferences", async () => {
    window.localStorage.setItem(
      userPreferencesStorageKey,
      JSON.stringify({
        defaultDestination: "European Union",
        rememberLastDestination: false,
        lastDestination: "Japan",
      }),
    );

    renderHomePage();

    expect(screen.getByLabelText("Destination")).toHaveValue("European Union");
  });

  it("shows a needs-more-detail state for ambiguous eu lookups", async () => {
    const user = userEvent.setup();

    fetchMock.mockImplementation(async (input) => {
      const url = String(input);

      if (url.endsWith("/api/meta/markets")) {
        return new Response(JSON.stringify(marketsResponse), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      if (url.endsWith("/api/lookups")) {
        return new Response(JSON.stringify(detailRequestResponse), {
          status: 409,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      throw new Error(`Unexpected fetch URL: ${url}`);
    });

    renderHomePage();

    await user.clear(screen.getByLabelText("Product description"));
    await user.type(
      screen.getByPlaceholderText("Optional if you know it"),
      "8501.52",
    );
    await user.selectOptions(
      screen.getByLabelText("Destination"),
      "European Union",
    );
    await user.click(
      screen.getByRole("button", { name: "Resolve and look up" }),
    );

    expect(await screen.findByText("8501.52")).toBeInTheDocument();
    expect(await screen.findAllByText("Need more detail")).toHaveLength(3);
    expect(
      await screen.findByText(/EU lookup paused at probable HS code 8501.52\./i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        /motor use or application, such as civil aircraft, conveyor equipment, or general industrial machinery/i,
      ),
    ).toBeInTheDocument();
  });

  it("shows an explicit seed-fallback state for uncovered eu prototype lookups", async () => {
    const user = userEvent.setup();

    fetchMock.mockImplementation(async (input) => {
      const url = String(input);

      if (url.endsWith("/api/meta/markets")) {
        return new Response(JSON.stringify(marketsResponse), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      if (url.endsWith("/api/lookups")) {
        return new Response(JSON.stringify(seedFallbackResponse), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      throw new Error(`Unexpected fetch URL: ${url}`);
    });

    renderHomePage();

    await user.clear(screen.getByLabelText("Product description"));
    await user.type(
      screen.getByLabelText("Product description"),
      "custom factory automation assembly module",
    );
    await user.selectOptions(
      screen.getByLabelText("Destination"),
      "European Union",
    );
    await user.click(
      screen.getByRole("button", { name: "Resolve and look up" }),
    );

    expect(await screen.findByText("2.5% (seed demo)")).toBeInTheDocument();
    expect(
      await screen.findByText(/Source tier: Seed demo data\./i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Coverage state: Prototype seed fallback\./i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        /No verified EU normalized row exists for HS code 8479.89 yet/i,
      ),
    ).toBeInTheDocument();
  });

  it("logs lookup failures for client-side monitoring", async () => {
    const user = userEvent.setup();

    fetchMock.mockImplementation(async (input) => {
      const url = String(input);

      if (url.endsWith("/api/meta/markets")) {
        return new Response(JSON.stringify(marketsResponse), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      if (url.endsWith("/api/lookups")) {
        return new Response(
          JSON.stringify({
            error: "Tariff record not found",
            message: "No tariff record exists for the supplied code.",
          }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
              "x-request-id": "req-home-failure",
            },
          },
        );
      }

      throw new Error(`Unexpected fetch URL: ${url}`);
    });

    renderHomePage();

    await user.clear(screen.getByLabelText("Product description"));
    await user.type(screen.getByLabelText("Product description"), "unknown part");
    await user.click(
      screen.getByRole("button", { name: "Resolve and look up" }),
    );

    expect(
      await screen.findByText("Tariff record not found"),
    ).toBeInTheDocument();
    expect(window.__tarifflookupClientFailures).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: "lookup-request-failed",
          route: "/",
          requestId: "req-home-failure",
          statusCode: 404,
        }),
      ]),
    );
  });
});
