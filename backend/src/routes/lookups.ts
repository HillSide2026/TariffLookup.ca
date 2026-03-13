import type { FastifyInstance } from "fastify";
import { z } from "zod";

const supportedDestinations = [
  "United States",
  "European Union",
  "United Kingdom",
  "Japan",
  "South Korea",
  "Australia",
] as const;

const lookupRequestSchema = z.object({
  hsCode: z
    .string()
    .trim()
    .min(4, "HS code is required")
    .max(32, "HS code is too long"),
  destinationCountry: z.enum(supportedDestinations),
});

function normalizeHsCode(value: string) {
  return value.replace(/\s+/g, "").replace(/[^\d.]/g, "");
}

export async function registerLookupRoutes(app: FastifyInstance) {
  app.get("/api/meta/markets", async () => {
    return {
      markets: supportedDestinations,
    };
  });

  app.post("/api/lookups", async (request, reply) => {
    const parsed = lookupRequestSchema.safeParse(request.body);

    if (!parsed.success) {
      reply.code(400);
      return {
        error: "Invalid lookup request",
        issues: parsed.error.flatten(),
      };
    }

    const normalizedHsCode = normalizeHsCode(parsed.data.hsCode);

    return {
      lookupId: `mock-${Date.now()}`,
      query: {
        hsCode: normalizedHsCode,
        destinationCountry: parsed.data.destinationCountry,
      },
      result: {
        mfnTariffRate: "TBD",
        preferentialTariffRate: "TBD",
        agreementBasis: "Pending tariff and agreement data integration",
        eligibilityNotes: [
          "This is a mocked response shape for the MVP lookup API.",
          "Real tariff schedules and agreement rules will replace this placeholder.",
        ],
      },
      meta: {
        source: "mock",
        supportedDestinations,
      },
    };
  });
}
