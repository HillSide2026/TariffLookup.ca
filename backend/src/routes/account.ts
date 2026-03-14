import type { FastifyInstance } from "fastify";
import type { LookupErrorResponse } from "../contracts/lookup.js";
import {
  InvalidAuthTokenError,
  MissingAuthorizationError,
  SupabaseUnavailableError,
} from "../services/auth-service.js";
import { listLookupHistory } from "../services/lookup-history-service.js";

export async function registerAccountRoutes(app: FastifyInstance) {
  app.get("/api/account/lookups", async (request, reply) => {
    try {
      return {
        lookups: await listLookupHistory(request.headers.authorization),
      };
    } catch (error) {
      if (error instanceof MissingAuthorizationError) {
        reply.code(401);
        return {
          error: "Authentication required",
          message: "Sign in before loading saved lookup history.",
        } satisfies LookupErrorResponse;
      }

      if (error instanceof InvalidAuthTokenError) {
        reply.code(401);
        return {
          error: "Authentication required",
          message: "The saved session is no longer valid. Sign in again.",
        } satisfies LookupErrorResponse;
      }

      if (error instanceof SupabaseUnavailableError) {
        reply.code(503);
        return {
          error: "Lookup history unavailable",
          message:
            "Supabase auth and persistence are not configured for the backend yet.",
        } satisfies LookupErrorResponse;
      }

      throw error;
    }
  });
}
