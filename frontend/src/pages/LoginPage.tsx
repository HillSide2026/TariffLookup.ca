import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthProvider";
import { logClientFailure } from "../lib/client-observability";

type LoginLocationState = {
  from?: string;
};

export function LoginPage() {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("you@company.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const from = (location.state as LoginLocationState | null)?.from || "/dashboard";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!auth.isConfigured) {
      setError("Add the Supabase browser env vars before signing in.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await auth.signIn({
        email: email.trim(),
        password,
      });
      navigate(from, { replace: true });
    } catch (submitError) {
      logClientFailure({
        event: "sign-in-failed",
        route: "/login",
        message:
          submitError instanceof Error
            ? submitError.message
            : "Sign-in failed. Please try again.",
      });
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Sign-in failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-6 py-10">
      <section className="w-full rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          Login
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Sign in to save lookups and manage your account
        </h2>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </span>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              type="email"
              value={email}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </span>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              type="password"
              value={password}
            />
          </label>
          <button
            className="w-full rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting || !auth.isConfigured}
          >
            {isSubmitting ? "Signing in..." : "Continue"}
          </button>
        </form>

        {error ? (
          <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-900">
            {error}
          </p>
        ) : null}

        <p className="mt-4 text-sm leading-6 text-slate-600">
          {auth.isConfigured
            ? "Supabase auth is configured. Successful sign-in will enable saved lookup history in the dashboard."
            : "Authentication is not configured locally yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the frontend environment, plus the matching backend Supabase env vars."}
        </p>
      </section>
    </div>
  );
}
