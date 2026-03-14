import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { LookupErrorResponse } from "../contracts/lookup.js";
import { activeSupportedDestinations } from "../contracts/markets.js";
import { saveLookupHistory } from "../services/lookup-history-service.js";
import {
  LookupNeedsMoreDetailError,
  LookupNotFoundError,
  runLookup,
} from "../services/lookup-service.js";

const lookupRequestSchema = z
  .object({
    hsCode: z.string().trim().max(32, "HS code is too long").optional(),
    productDescription: z
      .string()
      .trim()
      .max(240, "Product description is too long")
      .optional(),
    destinationCountry: z.enum(activeSupportedDestinations),
  })
  .superRefine((value, ctx) => {
    const submittedHsCode = value.hsCode?.trim() || "";
    const productDescription = value.productDescription?.trim() || "";

    if (!submittedHsCode && !productDescription) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a product description or HS code.",
        path: ["productDescription"],
      });
    }

    if (submittedHsCode && submittedHsCode.length < 4) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "HS code must be at least 4 characters.",
        path: ["hsCode"],
      });
    }

    if (productDescription && productDescription.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Product description must be at least 3 characters.",
        path: ["productDescription"],
      });
    }
  });

export async function registerLookupRoutes(app: FastifyInstance) {
  app.get("/api/meta/markets", async () => {
    return {
      markets: activeSupportedDestinations,
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

    try {
      const lookupResponse = await runLookup(parsed.data);
      const historyStatus = await saveLookupHistory({
        authorizationHeader: request.headers.authorization,
        lookupResponse,
      });

      return {
        ...lookupResponse,
        meta: {
          ...lookupResponse.meta,
          historyStatus,
        },
      };
    } catch (error) {
      if (error instanceof LookupNeedsMoreDetailError) {
        reply.code(409);

        return {
          error: "More product detail required",
          code: "needs-more-detail",
          message: error.message,
          detailRequest: error.detailRequest,
        } satisfies LookupErrorResponse;
      }

      if (error instanceof LookupNotFoundError) {
        reply.code(404);

        return {
          error: "Tariff record not found",
          code: "lookup-not-found",
          message: error.message,
        } satisfies LookupErrorResponse;
      }

      throw error;
    }
  });
}
