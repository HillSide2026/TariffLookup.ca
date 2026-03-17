import { env } from "../config/env.js";
import { logAuthVerification, type RouteLogContext } from "./observability-service.js";
import { recordAuthVerification } from "./monitoring-service.js";

export type AuthenticatedUser = {
  id: string;
  email: string | null;
};

export class MissingAuthorizationError extends Error {
  constructor(message = "Authentication is required.") {
    super(message);
    this.name = "MissingAuthorizationError";
  }
}

export class InvalidAuthTokenError extends Error {
  constructor(message = "The supplied auth token is invalid or expired.") {
    super(message);
    this.name = "InvalidAuthTokenError";
  }
}

export class SupabaseUnavailableError extends Error {
  constructor(message = "Supabase auth and persistence are not configured.") {
    super(message);
    this.name = "SupabaseUnavailableError";
  }
}

function getSupabaseHeaders(accessToken?: string) {
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!env.SUPABASE_URL || !serviceRoleKey) {
    throw new SupabaseUnavailableError();
  }

  return {
    apikey: serviceRoleKey,
    Authorization: accessToken ? `Bearer ${accessToken}` : `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };
}

export function isSupabaseServerConfigured() {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getBearerToken(authorizationHeader?: string | string[]) {
  const rawHeader = Array.isArray(authorizationHeader)
    ? authorizationHeader[0]
    : authorizationHeader;

  if (!rawHeader) {
    return null;
  }

  const [scheme, token] = rawHeader.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

export async function resolveAuthenticatedUser(
  authorizationHeader?: string | string[],
  observabilityContext?: RouteLogContext,
): Promise<AuthenticatedUser> {
  const accessToken = getBearerToken(authorizationHeader);

  if (!accessToken) {
    recordAuthVerification({
      success: false,
      reason: "missing-authorization",
    });
    if (observabilityContext) {
      logAuthVerification(observabilityContext, {
        success: false,
        reason: "missing-authorization",
        statusCode: 401,
      });
    }
    throw new MissingAuthorizationError();
  }

  if (!isSupabaseServerConfigured()) {
    recordAuthVerification({
      success: false,
      reason: "supabase-unavailable",
    });
    if (observabilityContext) {
      logAuthVerification(observabilityContext, {
        success: false,
        reason: "supabase-unavailable",
        statusCode: 503,
      });
    }
    throw new SupabaseUnavailableError();
  }

  const response = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: getSupabaseHeaders(accessToken),
  });

  if (response.status === 401 || response.status === 403) {
    recordAuthVerification({
      success: false,
      reason: "invalid-token",
    });
    if (observabilityContext) {
      logAuthVerification(observabilityContext, {
        success: false,
        reason: "invalid-token",
        statusCode: response.status,
      });
    }
    throw new InvalidAuthTokenError();
  }

  if (!response.ok) {
    recordAuthVerification({
      success: false,
      reason: "supabase-auth-upstream-error",
    });
    if (observabilityContext) {
      logAuthVerification(observabilityContext, {
        success: false,
        reason: "supabase-auth-upstream-error",
        statusCode: response.status,
      });
    }
    throw new Error("Unable to resolve the authenticated Supabase user.");
  }

  const payload = (await response.json()) as {
    id: string;
    email?: string | null;
  };

  const user = {
    id: payload.id,
    email: payload.email ?? null,
  };

  recordAuthVerification({
    success: true,
    reason: null,
  });
  if (observabilityContext) {
    logAuthVerification(observabilityContext, {
      success: true,
      userId: user.id,
      statusCode: response.status,
    });
  }

  return user;
}

export function getSupabaseServiceHeaders() {
  return getSupabaseHeaders();
}
