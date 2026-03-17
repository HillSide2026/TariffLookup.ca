import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { LookupErrorResponse } from "../contracts/lookup.js";
import { activeSupportedDestinations } from "../contracts/markets.js";
import { saveLookupHistory } from "../services/lookup-history-service.js";
import {
  recordApiResponse,
  recordLookupOutcome,
} from "../services/monitoring-service.js";
import {
  logLookupCompletion,
  logLookupFailure,
  logLookupStart,
} from "../services/observability-service.js";
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
    const startedAt = Date.now();
    const routeLogContext = {
      logger: request.log,
      requestId: request.id,
      route: "/api/lookups",
      method: request.method,
    } as const;
    const parsed = lookupRequestSchema.safeParse(request.body);

    logLookupStart(routeLogContext, {
      destinationCountry:
        parsed.success && parsed.data.destinationCountry
          ? parsed.data.destinationCountry
          : "unknown",
      submittedHsCode:
        parsed.success && parsed.data.hsCode ? parsed.data.hsCode.trim() : null,
      hasProductDescription: Boolean(
        parsed.success && parsed.data.productDescription?.trim(),
      ),
      hasAuthorizationHeader: Boolean(request.headers.authorization),
    });

    if (!parsed.success) {
      const latencyMs = Date.now() - startedAt;
      recordLookupOutcome({
        durationMs: latencyMs,
        outcome: "validation-error",
      });
      recordApiResponse({
        route: "/api/lookups",
        statusCode: 400,
      });
      logLookupFailure(routeLogContext, {
        destinationCountry: "unknown",
        submittedHsCode: null,
        errorCode: "invalid-request",
        statusCode: 400,
        latencyMs,
      });
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
        observabilityContext: routeLogContext,
      });
      const latencyMs = Date.now() - startedAt;
      recordLookupOutcome({
        durationMs: latencyMs,
        outcome: "success",
        sourceTier: lookupResponse.meta.source,
        coverageStatus: lookupResponse.meta.coverageStatus,
      });
      recordApiResponse({
        route: "/api/lookups",
        statusCode: 200,
      });
      logLookupCompletion(routeLogContext, {
        destinationCountry: lookupResponse.query.destinationCountry,
        resolvedHsCode: lookupResponse.query.hsCode,
        sourceTier: lookupResponse.meta.source,
        coverageStatus: lookupResponse.meta.coverageStatus,
        historyStatus,
        latencyMs,
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
        const latencyMs = Date.now() - startedAt;
        recordLookupOutcome({
          durationMs: latencyMs,
          outcome: "needs-more-detail",
        });
        recordApiResponse({
          route: "/api/lookups",
          statusCode: 409,
        });
        logLookupFailure(routeLogContext, {
          destinationCountry: parsed.data.destinationCountry,
          submittedHsCode: parsed.data.hsCode?.trim() || null,
          probableHsCode: error.detailRequest.probableHsCode,
          errorCode: "needs-more-detail",
          statusCode: 409,
          latencyMs,
        });
        reply.code(409);

        return {
          error: "More product detail required",
          code: "needs-more-detail",
          message: error.message,
          detailRequest: error.detailRequest,
        } satisfies LookupErrorResponse;
      }

      if (error instanceof LookupNotFoundError) {
        const latencyMs = Date.now() - startedAt;
        recordLookupOutcome({
          durationMs: latencyMs,
          outcome: "lookup-not-found",
        });
        recordApiResponse({
          route: "/api/lookups",
          statusCode: 404,
        });
        logLookupFailure(routeLogContext, {
          destinationCountry: parsed.data.destinationCountry,
          submittedHsCode: parsed.data.hsCode?.trim() || null,
          probableHsCode: parsed.data.hsCode?.trim() || null,
          errorCode: "lookup-not-found",
          statusCode: 404,
          latencyMs,
        });
        reply.code(404);

        return {
          error: "Tariff record not found",
          code: "lookup-not-found",
          message: error.message,
        } satisfies LookupErrorResponse;
      }

      const latencyMs = Date.now() - startedAt;
      recordLookupOutcome({
        durationMs: latencyMs,
        outcome: "server-error",
      });
      recordApiResponse({
        route: "/api/lookups",
        statusCode: 500,
      });
      logLookupFailure(routeLogContext, {
        destinationCountry: parsed.data.destinationCountry,
        submittedHsCode: parsed.data.hsCode?.trim() || null,
        probableHsCode: parsed.data.hsCode?.trim() || null,
        errorCode: "server-error",
        statusCode: 500,
        latencyMs,
      });
      throw error;
    }
  });
}
