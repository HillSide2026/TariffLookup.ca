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
    <div className="relative min-h-screen overflow-hidden text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute right-[-5rem] top-20 h-80 w-80 rounded-full bg-rose-300/12 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="sticky top-4 z-30 mb-8">
          <div className="rounded-[32px] border border-[rgba(15,42,68,0.1)] bg-white/88 px-5 py-4 shadow-[0_24px_60px_rgba(12,22,38,0.08)] backdrop-blur-xl">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <Link className="min-w-0" to="/">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0 overflow-hidden rounded-[22px] bg-[#0f2a44] p-3 text-white shadow-[0_18px_36px_rgba(15,42,68,0.26)]">
                    <div className="grid h-10 w-10 grid-cols-3 gap-1 opacity-25">
                      {Array.from({ length: 9 }).map((_, index) => (
                        <span
                          key={index}
                          className="rounded-[4px] border border-white/40"
                        />
                      ))}
                    </div>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold tracking-[0.18em]">
                      TL
                    </span>
                    <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#d72638]" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                      TariffLookup.ca
                    </p>
                    <p className="mt-2 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                      Canadian export tariff intelligence
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                  EU-only MVP
                </span>

                {auth.isAuthenticated ? (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-900">
                    {auth.user?.email || "Signed in"}
                  </span>
                ) : (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
                    Public lookup mode
                  </span>
                )}

                {isHome ? (
                  <a
                    className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:border-slate-400"
                    href="#lookup-console"
                  >
                    Run lookup
                  </a>
                ) : (
                  <Link
                    className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:border-slate-400"
                    to="/"
                  >
                    Back to landing
                  </Link>
                )}

                {auth.isAuthenticated ? (
                  <>
                    <Link
                      className="rounded-full bg-[#0f2a44] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#16395c]"
                      to="/dashboard"
                    >
                      Account
                    </Link>
                    <button
                      className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:border-slate-400"
                      onClick={handleSignOut}
                      type="button"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link
                    className="rounded-full bg-[#0a1024] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#16203d]"
                    to="/login"
                  >
                    Get access
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
