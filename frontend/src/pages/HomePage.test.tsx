import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
  },
} as const;

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
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("updates the visible result cards after a lookup", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

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
  });
});
