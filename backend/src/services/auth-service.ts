import { env } from "../config/env.js";

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
): Promise<AuthenticatedUser> {
  const accessToken = getBearerToken(authorizationHeader);

  if (!accessToken) {
    throw new MissingAuthorizationError();
  }

  if (!isSupabaseServerConfigured()) {
    throw new SupabaseUnavailableError();
  }

  const response = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: getSupabaseHeaders(accessToken),
  });

  if (response.status === 401 || response.status === 403) {
    throw new InvalidAuthTokenError();
  }

  if (!response.ok) {
    throw new Error("Unable to resolve the authenticated Supabase user.");
  }

  const payload = (await response.json()) as {
    id: string;
    email?: string | null;
  };

  return {
    id: payload.id,
    email: payload.email ?? null,
  };
}

export function getSupabaseServiceHeaders() {
  return getSupabaseHeaders();
}
