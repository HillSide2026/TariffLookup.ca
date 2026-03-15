import { Link, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthProvider";
import { loadUserPreferences } from "../lib/user-preferences";

export function ProfilePage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const preferences = loadUserPreferences();

  function handleSignOut() {
    auth.signOut();
    navigate("/");
  }

  return (
    <section className="rounded-[32px] border border-white/70 bg-white/75 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
        Profile
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        Account details and organization context
      </h2>
      <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
        This profile view summarizes the current signed-in session and the local
        workflow defaults that shape the lookup experience on this browser.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">User</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {auth.user?.email || "Unavailable"}
          </p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Authentication</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {auth.isConfigured ? "Supabase session" : "Supabase not configured"}
          </p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Default destination</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {preferences.defaultDestination}
          </p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Remember last destination</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {preferences.rememberLastDestination ? "Enabled" : "Disabled"}
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link
          className="rounded-full bg-slate-950 px-4 py-2 font-medium text-white"
          to="/dashboard"
        >
          Open saved history
        </Link>
        <Link
          className="rounded-full border border-slate-300 px-4 py-2 font-medium text-slate-900"
          to="/settings"
        >
          Manage workflow defaults
        </Link>
        <button
          className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 font-medium text-rose-900"
          onClick={handleSignOut}
          type="button"
        >
          Sign out
        </button>
      </div>
    </section>
  );
}
