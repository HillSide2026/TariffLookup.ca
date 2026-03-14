export type AuthUser = {
  id: string;
  email: string | null;
};

export type StoredAuthSession = {
  accessToken: string;
  user: AuthUser;
};

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const authStorageKey = "tarifflookup.auth.session";

export function isSupabaseBrowserConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

function getSupabaseHeaders(accessToken?: string) {
  if (!isSupabaseBrowserConfigured()) {
    throw new Error("Supabase auth is not configured in the frontend environment.");
  }

  return {
    apikey: supabaseAnonKey,
    "Content-Type": "application/json",
    ...(accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : {}),
  };
}

export async function signInWithPassword(input: {
  email: string;
  password: string;
}): Promise<StoredAuthSession> {
  const response = await fetch(
    `${supabaseUrl}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: getSupabaseHeaders(),
      body: JSON.stringify({
        email: input.email,
        password: input.password,
      }),
    },
  );

  const payload = (await response.json()) as {
    access_token?: string;
    user?: {
      id: string;
      email?: string | null;
    };
    msg?: string;
    error_description?: string;
    error?: string;
  };

  if (!response.ok || !payload.access_token || !payload.user?.id) {
    throw new Error(
      payload.error_description || payload.msg || payload.error || "Sign-in failed.",
    );
  }

  return {
    accessToken: payload.access_token,
    user: {
      id: payload.user.id,
      email: payload.user.email ?? input.email,
    },
  };
}

export async function resolveSessionUser(accessToken: string): Promise<AuthUser> {
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: getSupabaseHeaders(accessToken),
  });

  if (!response.ok) {
    throw new Error("The saved session is no longer valid.");
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
