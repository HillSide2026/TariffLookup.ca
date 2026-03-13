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
      },
    });
  });

  it("falls back to the seed dataset for european union lookups that are not normalized yet", async () => {
    const response = await createApp().inject({
      method: "POST",
      url: "/api/lookups",
      payload: {
        hsCode: "8501.52",
        destinationCountry: "European Union",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      query: {
        hsCode: "8501.52",
        destinationCountry: "European Union",
        inputMode: "hsCode",
      },
      result: {
        mfnTariffRate: "4.0% (seed demo)",
        preferentialTariffRate: "0.0% (seed demo)",
        agreementBasis: "CETA preferential treatment (seed demo)",
      },
      meta: {
        source: "seed-demo-data",
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
