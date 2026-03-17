import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import {
  authStorageKey,
  isSupabaseBrowserConfigured,
  resolveSessionUser,
  signInWithPassword,
  type AuthUser,
  type StoredAuthSession,
} from "./auth-client";
import { logClientFailure } from "../lib/client-observability";

type AuthContextValue = {
  accessToken: string | null;
  isAuthenticated: boolean;
  isConfigured: boolean;
  isLoading: boolean;
  signIn: (input: { email: string; password: string }) => Promise<void>;
  signOut: () => void;
  user: AuthUser | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStoredSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(authStorageKey);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as StoredAuthSession;
  } catch {
    window.localStorage.removeItem(authStorageKey);
    return null;
  }
}

function persistStoredSession(session: StoredAuthSession | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(authStorageKey);
    return;
  }

  window.localStorage.setItem(authStorageKey, JSON.stringify(session));
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isConfigured = isSupabaseBrowserConfigured();

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      if (!isConfigured) {
        setUser(null);
        setAccessToken(null);
        setIsLoading(false);
        return;
      }

      const storedSession = loadStoredSession();

      if (!storedSession) {
        setIsLoading(false);
        return;
      }

      try {
        const resolvedUser = await resolveSessionUser(storedSession.accessToken);

        if (!isMounted) {
          return;
        }

        setUser(resolvedUser);
        setAccessToken(storedSession.accessToken);
        persistStoredSession({
          accessToken: storedSession.accessToken,
          user: resolvedUser,
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        logClientFailure({
          event: "session-restore-failed",
          level: "warn",
          route: "auth-provider",
          message:
            error instanceof Error
              ? error.message
              : "The saved session could not be restored.",
        });
        persistStoredSession(null);
        setUser(null);
        setAccessToken(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void restoreSession();

    return () => {
      isMounted = false;
    };
  }, [isConfigured]);

  async function signIn(input: { email: string; password: string }) {
    const session = await signInWithPassword(input);

    setUser(session.user);
    setAccessToken(session.accessToken);
    persistStoredSession(session);
  }

  function signOut() {
    setUser(null);
    setAccessToken(null);
    persistStoredSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isAuthenticated: Boolean(user && accessToken),
        isConfigured,
        isLoading,
        signIn,
        signOut,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
