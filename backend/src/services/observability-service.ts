import type { FastifyBaseLogger } from "fastify";
import type {
  LookupCoverageStatus,
  LookupHistoryStatus,
  LookupSourceTier,
} from "../contracts/lookup.js";

export type RouteLogContext = {
  logger: FastifyBaseLogger;
  requestId: string;
  route: string;
  method: string;
};

function getBaseFields(context: RouteLogContext) {
  return {
    requestId: context.requestId,
    route: context.route,
    method: context.method,
  };
}

export function logLookupStart(
  context: RouteLogContext,
  input: {
    destinationCountry: string;
    submittedHsCode: string | null;
    hasProductDescription: boolean;
    hasAuthorizationHeader: boolean;
  },
) {
  context.logger.info(
    {
      event: "lookup.start",
      ...getBaseFields(context),
      ...input,
    },
    "Lookup started",
  );
}

export function logLookupCompletion(
  context: RouteLogContext,
  input: {
    destinationCountry: string;
    resolvedHsCode: string;
    sourceTier: LookupSourceTier;
    coverageStatus: LookupCoverageStatus;
    historyStatus: LookupHistoryStatus;
    latencyMs: number;
  },
) {
  context.logger.info(
    {
      event: "lookup.complete",
      ...getBaseFields(context),
      ...input,
    },
    "Lookup completed",
  );
}

export function logLookupFailure(
  context: RouteLogContext,
  input: {
    destinationCountry: string;
    submittedHsCode: string | null;
    probableHsCode?: string | null;
    errorCode: string;
    statusCode: number;
    latencyMs: number;
  },
) {
  const logMethod =
    input.statusCode >= 500 ? context.logger.error.bind(context.logger) : context.logger.warn.bind(context.logger);

  logMethod(
    {
      event: "lookup.failure",
      ...getBaseFields(context),
      ...input,
    },
    "Lookup failed",
  );
}

export function logAuthVerification(
  context: RouteLogContext,
  input: {
    success: boolean;
    reason?: string;
    userId?: string;
    statusCode?: number;
  },
) {
  const logMethod = input.success
    ? context.logger.info.bind(context.logger)
    : context.logger.warn.bind(context.logger);

  logMethod(
    {
      event: "auth.verification",
      ...getBaseFields(context),
      ...input,
    },
    input.success ? "Auth verification succeeded" : "Auth verification failed",
  );
}

export function logLookupHistoryPersistence(
  context: RouteLogContext,
  input: {
    status: LookupHistoryStatus;
    userId?: string;
    lookupId: string;
  },
) {
  const logMethod =
    input.status === "saved" || input.status === "anonymous"
      ? context.logger.info.bind(context.logger)
      : context.logger.warn.bind(context.logger);

  logMethod(
    {
      event: "lookup-history.persistence",
      ...getBaseFields(context),
      ...input,
    },
    "Lookup history persistence recorded",
  );
}

export function logAccountHistoryLoad(
  context: RouteLogContext,
  input: {
    success: boolean;
    statusCode: number;
    lookupCount?: number;
    userId?: string;
    reason?: string;
  },
) {
  const logMethod = input.success
    ? context.logger.info.bind(context.logger)
    : input.statusCode >= 500
      ? context.logger.error.bind(context.logger)
      : context.logger.warn.bind(context.logger);

  logMethod(
    {
      event: "account.lookup-history",
      ...getBaseFields(context),
      ...input,
    },
    input.success ? "Lookup history loaded" : "Lookup history load failed",
  );
}
