import type { FastifyInstance } from "fastify";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

let buildServer: typeof import("../app.js").buildServer;
let app: FastifyInstance | null = null;

beforeAll(async () => {
  process.env.APP_ENV = "test";
  ({ buildServer } = await import("../app.js"));
});

afterEach(async () => {
  if (app) {
    await app.close();
    app = null;
  }
});

function createApp() {
  app = buildServer();
  return app;
}

describe("lookup routes", () => {
  it("returns active supported destinations", async () => {
    const response = await createApp().inject({
      method: "GET",
      url: "/api/meta/markets",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      markets: [
        "United States",
        "European Union",
        "United Kingdom",
        "Japan",
        "Brazil",
        "China",
      ],
    });
  });

  it("looks up a tariff record from product description only", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      payload: {
        productDescription: "stainless steel kitchen knife blades",
        destinationCountry: "Japan",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      query: {
        hsCode: "8208.30",
        submittedHsCode: null,
        productDescription: "stainless steel kitchen knife blades",
        destinationCountry: "Japan",
        inputMode: "description",
      },
      classification: {
        probableHsCode: "8208.30",
        method: "keyword-match",
      },
      result: {
        mfnTariffRate: "3.1% (seed demo)",
        preferentialTariffRate: "0.0% (seed demo)",
        agreementBasis: "CPTPP preferential treatment (seed demo)",
        source: "TariffLookup internal seed/demo dataset",
        effectiveDate: "2026-03-13",
      },
      meta: {
        source: "seed-demo-data",
        coverageStatus: "seed-fallback",
        historyStatus: "anonymous",
      },
    });
  });

  it("prefers a supplied hs code when both hs code and description are provided", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      payload: {
        hsCode: "8501.52",
        productDescription: "stainless steel kitchen knife blades",
        destinationCountry: "Brazil",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      query: {
        hsCode: "8501.52",
        submittedHsCode: "8501.52",
        inputMode: "hsCode+description",
      },
      classification: {
        probableHsCode: "8501.52",
        method: "user-supplied-hs-code-with-description",
        confidence: "provided",
      },
      result: {
        mfnTariffRate: "14.0% (seed demo)",
        agreementBasis:
          "No Canada-Brazil preferential agreement identified (seed demo)",
      },
      meta: {
        source: "seed-demo-data",
        coverageStatus: "seed-fallback",
        historyStatus: "anonymous",
      },
    });
  });

  it("prefers normalized european union data when a verified local record exists", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      payload: {
        hsCode: "8208.30",
        destinationCountry: "European Union",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      query: {
        hsCode: "8208.30",
        destinationCountry: "European Union",
        inputMode: "hsCode",
      },
      result: {
        mfnTariffRate: "1.70%",
        preferentialTariffRate: "0%",
        agreementBasis: "EU-Canada CETA tariff preference",
        source: "European Commission Access2Markets tariff endpoint (CA -> DE snapshot)",
      },
      meta: {
        source: "local-normalized-data",
        coverageStatus: "normalized-record",
        historyStatus: "anonymous",
      },
    });
  });

  it("uses a normalized eu row for cotton t-shirts resolved from product description", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      payload: {
        productDescription: "cotton t-shirt",
        destinationCountry: "European Union",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      query: {
        hsCode: "6109.10",
        submittedHsCode: null,
        destinationCountry: "European Union",
        inputMode: "description",
      },
      result: {
        mfnTariffRate: "12.00%",
        preferentialTariffRate: "0%",
        agreementBasis: "EU-Canada CETA tariff preference",
      },
      meta: {
        source: "local-normalized-data",
        coverageStatus: "normalized-record",
        historyStatus: "anonymous",
      },
    });
  });

  it("uses a normalized eu row for wooden furniture resolved from product description", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      payload: {
        productDescription: "oak dining room table",
        destinationCountry: "European Union",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      query: {
        hsCode: "9403.60",
        destinationCountry: "European Union",
        inputMode: "description",
      },
      result: {
        mfnTariffRate: "0%",
        preferentialTariffRate: "0%",
        agreementBasis:
          "EU common customs tariff MFN already zero for the normalized base duty outcome",
      },
      meta: {
        source: "local-normalized-data",
        coverageStatus: "normalized-record",
        historyStatus: "anonymous",
      },
    });
  });

  it("uses a normalized eu row for plastic bags resolved from product description", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      payload: {
        productDescription: "polyethylene shipping bags",
        destinationCountry: "European Union",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      query: {
        hsCode: "3923.21",
        destinationCountry: "European Union",
        inputMode: "description",
      },
      result: {
        mfnTariffRate: "6.50%",
        preferentialTariffRate: "0%",
        agreementBasis: "EU-Canada CETA tariff preference",
      },
      meta: {
        source: "local-normalized-data",
        coverageStatus: "normalized-record",
        historyStatus: "anonymous",
      },
    });
  });

  it("uses a normalized eu row for plastic kitchenware resolved from product description", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      payload: {
        productDescription: "plastic kitchenware bowl set",
        destinationCountry: "European Union",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      query: {
        hsCode: "3924.10",
        destinationCountry: "European Union",
        inputMode: "description",
      },
      result: {
        mfnTariffRate: "6.50%",
        preferentialTariffRate: "0%",
        agreementBasis: "EU-Canada CETA tariff preference",
      },
      meta: {
        source: "local-normalized-data",
        coverageStatus: "normalized-record",
        historyStatus: "anonymous",
      },
    });
  });

  it("uses a normalized eu row for glassware resolved from product description", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      payload: {
        productDescription: "glass tumbler set",
        destinationCountry: "European Union",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      query: {
        hsCode: "7013.49",
        destinationCountry: "European Union",
        inputMode: "description",
      },
      result: {
        mfnTariffRate: "11.00%",
        preferentialTariffRate: "0%",
        agreementBasis: "EU-Canada CETA tariff preference",
      },
      meta: {
        source: "local-normalized-data",
        coverageStatus: "normalized-record",
        historyStatus: "anonymous",
      },
    });
  });

  it("uses a normalized eu row for plastic household articles resolved from product description", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      payload: {
        productDescription: "plastic laundry basket organizer",
        destinationCountry: "European Union",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      query: {
        hsCode: "3924.90",
        destinationCountry: "European Union",
        inputMode: "description",
      },
      result: {
        mfnTariffRate: "6.50%",
        preferentialTariffRate: "0%",
        agreementBasis: "EU-Canada CETA tariff preference",
      },
      meta: {
        source: "local-normalized-data",
        coverageStatus: "normalized-record",
        historyStatus: "anonymous",
      },
    });
  });

  it("uses a normalized eu row for porcelain tableware resolved from product description", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      payload: {
        productDescription: "porcelain dinner plate set",
        destinationCountry: "European Union",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      query: {
        hsCode: "6911.10",
        destinationCountry: "European Union",
        inputMode: "description",
      },
      result: {
        mfnTariffRate: "12.00%",
        preferentialTariffRate: "0%",
        agreementBasis: "EU-Canada CETA tariff preference",
      },
      meta: {
        source: "local-normalized-data",
        coverageStatus: "normalized-record",
        historyStatus: "anonymous",
      },
    });
  });

  it("uses a normalized eu row for corrugated cartons resolved from product description", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      payload: {
        productDescription: "corrugated paperboard shipping cartons",
        destinationCountry: "European Union",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      query: {
        hsCode: "4819.10",
        destinationCountry: "European Union",
        inputMode: "description",
      },
      result: {
        mfnTariffRate: "0%",
        preferentialTariffRate: "0%",
        agreementBasis:
          "EU common customs tariff MFN already zero for the normalized base duty outcome",
      },
      meta: {
        source: "local-normalized-data",
        coverageStatus: "normalized-record",
        historyStatus: "anonymous",
      },
    });
  });

  it("uses a normalized eu row for aluminium sanitary ware resolved from product description", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      payload: {
        productDescription: "aluminium shower caddy",
        destinationCountry: "European Union",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      query: {
        hsCode: "7615.20",
        destinationCountry: "European Union",
        inputMode: "description",
      },
      result: {
        mfnTariffRate: "6.00%",
        preferentialTariffRate: "0%",
        agreementBasis: "EU-Canada CETA tariff preference",
      },
      meta: {
        source: "local-normalized-data",
        coverageStatus: "normalized-record",
        historyStatus: "anonymous",
      },
    });
  });

  it("uses a normalized eu row for metal fixtures resolved from product description", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      payload: {
        productDescription: "metal wall hook bracket",
        destinationCountry: "European Union",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      query: {
        hsCode: "8302.50",
        destinationCountry: "European Union",
        inputMode: "description",
      },
      result: {
        mfnTariffRate: "2.70%",
        preferentialTariffRate: "0%",
        agreementBasis: "EU-Canada CETA tariff preference",
      },
      meta: {
        source: "local-normalized-data",
        coverageStatus: "normalized-record",
        historyStatus: "anonymous",
      },
    });
  });

  it("uses a normalized eu row for terry towels resolved from product description", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      payload: {
        productDescription: "cotton bath towel set",
        destinationCountry: "European Union",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      query: {
        hsCode: "6302.60",
        destinationCountry: "European Union",
        inputMode: "description",
      },
      result: {
        mfnTariffRate: "12.00%",
        preferentialTariffRate: "0%",
        agreementBasis: "EU-Canada CETA tariff preference",
      },
      meta: {
        source: "local-normalized-data",
        coverageStatus: "normalized-record",
        historyStatus: "anonymous",
      },
    });
  });

  it("uses a normalized eu row for cotton table linen resolved from product description", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      payload: {
        productDescription: "cotton tablecloth set",
        destinationCountry: "European Union",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      query: {
        hsCode: "6302.91",
        destinationCountry: "European Union",
        inputMode: "description",
      },
      result: {
        mfnTariffRate: "12.00%",
        preferentialTariffRate: "0%",
        agreementBasis: "EU-Canada CETA tariff preference",
      },
      meta: {
        source: "local-normalized-data",
        coverageStatus: "normalized-record",
        historyStatus: "anonymous",
      },
    });
  });

  it("uses a normalized eu row for upholstered seats resolved from product description", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      payload: {
        productDescription: "upholstered lounge chair",
        destinationCountry: "European Union",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      query: {
        hsCode: "9401.61",
        destinationCountry: "European Union",
        inputMode: "description",
      },
      result: {
        mfnTariffRate: "0%",
        preferentialTariffRate: "0%",
        agreementBasis:
          "EU common customs tariff MFN already zero for the normalized base duty outcome",
      },
      meta: {
        source: "local-normalized-data",
        coverageStatus: "normalized-record",
        historyStatus: "anonymous",
      },
    });
  });

  it("uses a normalized eu row for wooden office furniture resolved from product description", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      payload: {
        productDescription: "wooden office filing cabinet",
        destinationCountry: "European Union",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      query: {
        hsCode: "9403.30",
        destinationCountry: "European Union",
        inputMode: "description",
      },
      result: {
        mfnTariffRate: "0%",
        preferentialTariffRate: "0%",
        agreementBasis:
          "EU common customs tariff MFN already zero for the normalized base duty outcome",
      },
      meta: {
        source: "local-normalized-data",
        coverageStatus: "normalized-record",
      },
    });
  });

  it("uses a normalized eu row for metal furniture resolved from product description", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      payload: {
        productDescription: "steel shelving unit",
        destinationCountry: "European Union",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      query: {
        hsCode: "9403.20",
        destinationCountry: "European Union",
        inputMode: "description",
      },
      result: {
        mfnTariffRate: "0%",
        preferentialTariffRate: "0%",
        agreementBasis:
          "EU common customs tariff MFN already zero for the normalized base duty outcome",
      },
      meta: {
        source: "local-normalized-data",
        coverageStatus: "normalized-record",
        historyStatus: "anonymous",
      },
    });
  });

  it("uses a normalized eu row for wooden kitchen furniture resolved from product description", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      payload: {
        productDescription: "wooden kitchen cabinet",
        destinationCountry: "European Union",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      query: {
        hsCode: "9403.40",
        destinationCountry: "European Union",
        inputMode: "description",
      },
      result: {
        mfnTariffRate: "2.70%",
        preferentialTariffRate: "0%",
        agreementBasis: "EU-Canada CETA tariff preference",
      },
      meta: {
        source: "local-normalized-data",
        coverageStatus: "normalized-record",
        historyStatus: "anonymous",
      },
    });
  });

  it("uses a normalized eu row for stainless steel household articles resolved from product description", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      payload: {
        productDescription: "stainless steel cookware pot",
        destinationCountry: "European Union",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      query: {
        hsCode: "7323.93",
        destinationCountry: "European Union",
        inputMode: "description",
      },
      result: {
        mfnTariffRate: "3.20%",
        preferentialTariffRate: "0%",
        agreementBasis: "EU-Canada CETA tariff preference",
      },
      meta: {
        source: "local-normalized-data",
        coverageStatus: "normalized-record",
        historyStatus: "anonymous",
      },
    });
  });

  it("uses a normalized eu row for wooden bedroom furniture resolved from product description", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      payload: {
        productDescription: "wooden bedroom dresser",
        destinationCountry: "European Union",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      query: {
        hsCode: "9403.50",
        destinationCountry: "European Union",
        inputMode: "description",
      },
      result: {
        mfnTariffRate: "0%",
        preferentialTariffRate: "0%",
        agreementBasis:
          "EU common customs tariff MFN already zero for the normalized base duty outcome",
      },
      meta: {
        source: "local-normalized-data",
        coverageStatus: "normalized-record",
        historyStatus: "anonymous",
      },
    });
  });

  it("returns an explicit eu seed fallback for unmatched low-confidence descriptions", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      payload: {
        productDescription: "custom factory automation assembly module",
        destinationCountry: "European Union",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      query: {
        hsCode: "8479.89",
        destinationCountry: "European Union",
        inputMode: "description",
      },
      classification: {
        probableHsCode: "8479.89",
        method: "fallback-seed-classification",
      },
      meta: {
        source: "seed-demo-data",
        coverageStatus: "seed-fallback",
        historyStatus: "anonymous",
      },
    });
  });

  it("returns a persistence-unavailable history state when an auth header is supplied before supabase is configured", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      headers: {
        authorization: "Bearer test-token",
      },
      payload: {
        productDescription: "stainless steel kitchen knife blades",
        destinationCountry: "Japan",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      meta: {
        historyStatus: "persistence-unavailable",
      },
    });
  });

  it("requires authentication before loading saved lookup history", async () => {
    const response = await createApp().inject({
      method: "GET",
      url: "/api/account/lookups",
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toMatchObject({
      error: "Authentication required",
    });
  });

  it("returns an availability error when saved history is requested before backend supabase config is present", async () => {
    const response = await createApp().inject({
      method: "GET",
      url: "/api/account/lookups",
      headers: {
        authorization: "Bearer test-token",
      },
    });

    expect(response.statusCode).toBe(503);
    expect(response.json()).toMatchObject({
      error: "Lookup history unavailable",
    });
  });

  it("returns a needs-more-detail response for ambiguous eu motor lookups", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      payload: {
        hsCode: "8501.52",
        destinationCountry: "European Union",
      },
    });

    expect(response.statusCode).toBe(409);
    expect(response.json()).toMatchObject({
      error: "More product detail required",
      code: "needs-more-detail",
      detailRequest: {
        probableHsCode: "8501.52",
        requestedDetails: expect.arrayContaining([
          "motor use or application, such as civil aircraft, conveyor equipment, or general industrial machinery",
        ]),
      },
    });
  });

  it("returns a validation error when neither hs code nor product description is supplied", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      payload: {
        destinationCountry: "Japan",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      error: "Invalid lookup request",
    });
  });
});
