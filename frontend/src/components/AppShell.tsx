import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthProvider";

export function AppShell() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  function handleSignOut() {
    auth.signOut();
    navigate("/");
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--tl-color-paper)", color: "var(--tl-color-ink)" }}>
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col">
        <header className="sticky top-0 z-30 mb-8" style={{ backgroundColor: "var(--tl-color-paper)", borderBottom: "1px solid var(--tl-color-rule)" }}>
          <div className="px-5 py-4 sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <Link className="min-w-0" to="/">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0 overflow-hidden rounded-sm bg-[#0f2a44] p-3 text-white">
                    <div className="grid h-10 w-10 grid-cols-3 gap-1 opacity-25">
                      {Array.from({ length: 9 }).map((_, index) => (
                        <span
                          key={index}
                          className="border border-white/40"
                        />
                      ))}
                    </div>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold tracking-[0.18em]" style={{ fontFamily: "var(--tl-font-mono)" }}>
                      TL
                    </span>
                    <span className="absolute right-2 top-2 h-2 w-2 bg-[#d72638]" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-[0.32em]" style={{ fontFamily: "var(--tl-font-mono)", color: "var(--tl-color-ink-muted)" }}>
                      TariffLookup.ca
                    </p>
                    <p className="mt-1 text-xl tracking-tight sm:text-2xl" style={{ fontFamily: "var(--tl-font-display)", color: "var(--tl-color-ink)" }}>
                      Canadian export tariff intelligence
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex flex-wrap items-center gap-3">
                <span className="border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]" style={{ fontFamily: "var(--tl-font-mono)", borderColor: "var(--tl-color-rule)", color: "var(--tl-color-ink-muted)" }}>
                  EU-only MVP
                </span>

                {auth.isAuthenticated ? (
                  <span className="border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald-900" style={{ fontFamily: "var(--tl-font-mono)" }}>
                    {auth.user?.email || "Signed in"}
                  </span>
                ) : (
                  <span className="border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-amber-900" style={{ fontFamily: "var(--tl-font-mono)" }}>
                    Public lookup mode
                  </span>
                )}

                {isHome ? (
                  <a
                    className="border px-4 py-2 text-sm font-medium transition hover:bg-[#e8e4da]"
                    style={{ borderColor: "var(--tl-color-rule)", color: "var(--tl-color-ink)" }}
                    href="#lookup-console"
                  >
                    Run lookup
                  </a>
                ) : (
                  <Link
                    className="border px-4 py-2 text-sm font-medium transition hover:bg-[#e8e4da]"
                    style={{ borderColor: "var(--tl-color-rule)", color: "var(--tl-color-ink)" }}
                    to="/"
                  >
                    Back to landing
                  </Link>
                )}

                {auth.isAuthenticated ? (
                  <>
                    <Link
                      className="bg-[#0f2a44] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#16395c]"
                      to="/dashboard"
                    >
                      Account
                    </Link>
                    <button
                      className="border px-4 py-2 text-sm font-medium transition hover:bg-[#e8e4da]"
                      style={{ borderColor: "var(--tl-color-rule)", color: "var(--tl-color-ink)" }}
                      onClick={handleSignOut}
                      type="button"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link
                    className="bg-[#0f2a44] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#16395c]"
                    to="/login"
                  >
                    Get access
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-5 pb-12 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
