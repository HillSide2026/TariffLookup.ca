import { Link, Outlet, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthProvider";

export function AppShell() {
  const auth = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    auth.signOut();
    navigate("/");
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--tl-bg)", color: "var(--tl-text)", fontFamily: "var(--tl-font-ui)" }}>
      <div className="mx-auto flex min-h-screen max-w-[720px] flex-col px-6">

        <header className="flex items-center justify-between py-5" style={{ borderBottom: "1px solid var(--tl-border)" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="text-base font-semibold" style={{ color: "var(--tl-text)" }}>
              TariffLookup.ca
            </span>
          </Link>

          <nav className="flex items-center gap-5">
            {auth.isAuthenticated ? (
              <>
                <Link
                  className="text-sm"
                  style={{ color: "var(--tl-text-muted)", textDecoration: "none" }}
                  to="/dashboard"
                >
                  My Products
                </Link>
                <Link
                  className="text-sm"
                  style={{ color: "var(--tl-text-muted)", textDecoration: "none" }}
                  to="/dashboard"
                >
                  Account
                </Link>
                <button
                  className="text-sm"
                  style={{ color: "var(--tl-text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "var(--tl-font-ui)" }}
                  onClick={handleSignOut}
                  type="button"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                className="text-sm font-medium"
                style={{
                  backgroundColor: "var(--tl-primary)",
                  color: "#ffffff",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  textDecoration: "none",
                }}
                to="/login"
              >
                Get access
              </Link>
            )}
          </nav>
        </header>

        <main className="flex-1 py-10">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
