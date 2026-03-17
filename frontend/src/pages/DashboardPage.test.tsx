import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "../auth/AuthProvider";
import { authStorageKey, type StoredAuthSession } from "../auth/auth-client";
import { DashboardPage } from "./DashboardPage";

function renderDashboardPage() {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe("DashboardPage", () => {
  const fetchMock = vi.fn<
    (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
  >();

  beforeEach(() => {
    const session = {
      accessToken: "session-token",
      user: {
        id: "user-123",
        email: "user@example.com",
      },
    } satisfies StoredAuthSession;

    window.localStorage.setItem(authStorageKey, JSON.stringify(session));

    fetchMock.mockImplementation(async (input) => {
      const url = String(input);

      if (url.includes("/auth/v1/user")) {
        return new Response(
          JSON.stringify({
            id: "user-123",
            email: "user@example.com",
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      }

      if (url.endsWith("/api/account/lookups")) {
        return new Response(
          JSON.stringify({
            error: "Lookup history unavailable",
            message: "Supabase returned an upstream error.",
          }),
          {
            status: 503,
            headers: {
              "Content-Type": "application/json",
              "x-request-id": "req-dashboard-failure",
            },
          },
        );
      }

      throw new Error(`Unexpected fetch URL: ${url}`);
    });

    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
    delete window.__tarifflookupClientFailures;
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("logs dashboard history load failures for client-side monitoring", async () => {
    renderDashboardPage();

    expect(
      await screen.findByText("Supabase returned an upstream error."),
    ).toBeInTheDocument();
    expect(window.__tarifflookupClientFailures).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: "dashboard-history-load-failed",
          route: "/dashboard",
          requestId: "req-dashboard-failure",
          statusCode: 503,
        }),
      ]),
    );
  });
});
