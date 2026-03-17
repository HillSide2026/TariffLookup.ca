import type { FastifyInstance } from "fastify";
import type { LookupErrorResponse } from "../contracts/lookup.js";
import {
  InvalidAuthTokenError,
  MissingAuthorizationError,
  SupabaseUnavailableError,
} from "../services/auth-service.js";
import { listLookupHistory } from "../services/lookup-history-service.js";
import { recordApiResponse } from "../services/monitoring-service.js";

export async function registerAccountRoutes(app: FastifyInstance) {
  app.get("/api/account/lookups", async (request, reply) => {
    try {
      const lookups = await listLookupHistory(request.headers.authorization, {
        logger: request.log,
        requestId: request.id,
        route: "/api/account/lookups",
        method: request.method,
      });
      recordApiResponse({
        route: "/api/account/lookups",
        statusCode: 200,
      });

      return {
        lookups,
      };
    } catch (error) {
      if (error instanceof MissingAuthorizationError) {
        recordApiResponse({
          route: "/api/account/lookups",
          statusCode: 401,
        });
        reply.code(401);
        return {
          error: "Authentication required",
          message: "Sign in before loading saved lookup history.",
        } satisfies LookupErrorResponse;
      }

      if (error instanceof InvalidAuthTokenError) {
        recordApiResponse({
          route: "/api/account/lookups",
          statusCode: 401,
        });
        reply.code(401);
        return {
          error: "Authentication required",
          message: "The saved session is no longer valid. Sign in again.",
        } satisfies LookupErrorResponse;
      }

      if (error instanceof SupabaseUnavailableError) {
        recordApiResponse({
          route: "/api/account/lookups",
          statusCode: 503,
        });
        reply.code(503);
        return {
          error: "Lookup history unavailable",
          message:
            "Supabase auth and persistence are not configured for the backend yet.",
        } satisfies LookupErrorResponse;
      }

      recordApiResponse({
        route: "/api/account/lookups",
        statusCode: 500,
      });
      throw error;
    }
  });
}
