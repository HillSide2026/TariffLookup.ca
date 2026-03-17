type ClientLogLevel = "warn" | "error";

type ClientFailureEvent =
  | "markets-load-failed"
  | "lookup-request-failed"
  | "lookup-needs-more-detail"
  | "sign-in-failed"
  | "dashboard-history-load-failed"
  | "session-restore-failed";

type ClientFailureLog = {
  event: ClientFailureEvent;
  level?: ClientLogLevel;
  route: string;
  message: string;
  requestId?: string | null;
  statusCode?: number;
  details?: Record<string, unknown>;
};

declare global {
  interface Window {
    __tarifflookupClientFailures?: ClientFailureLog[];
  }
}

export function logClientFailure(input: ClientFailureLog) {
  const payload = {
    timestamp: new Date().toISOString(),
    level: input.level || "error",
    ...input,
  };

  if (typeof window !== "undefined") {
    window.__tarifflookupClientFailures = [
      ...(window.__tarifflookupClientFailures || []).slice(-24),
      payload,
    ];
  }

  if (payload.level === "warn") {
    console.warn("[tarifflookup-client]", payload);
    return;
  }

  console.error("[tarifflookup-client]", payload);
}
