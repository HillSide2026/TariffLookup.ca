import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { activeDestinationMarkets } from "../lib/markets";
import {
  clearUserPreferences,
  defaultUserPreferences,
  loadUserPreferences,
  saveUserPreferences,
} from "../lib/user-preferences";

export function SettingsPage() {
  const auth = useAuth();
  const [preferences, setPreferences] = useState(() => loadUserPreferences());
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  function handleSave() {
    saveUserPreferences(preferences);
    setSavedMessage("Workflow defaults saved in this browser.");
  }

  function handleReset() {
    clearUserPreferences();
    setPreferences(defaultUserPreferences);
    setSavedMessage("Workflow defaults reset to the product defaults.");
  }

  return (
    <section className="rounded-[32px] border border-white/70 bg-white/75 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
        Settings
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        Product controls for signed-in users
      </h2>
      <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
        This surface is now gated behind authentication. The underlying account
        and lookup-history plumbing is in place, while individual settings remain
        lightweight until the next implementation pass.
      </p>

      <div className="mt-6 grid gap-4">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700">
          Current account: {auth.user?.email || "Unavailable"}
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <label className="block text-sm font-medium text-slate-700">
            Default destination
            <select
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none"
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  defaultDestination: event.target.value,
                }))
              }
              value={preferences.defaultDestination}
            >
              {activeDestinationMarkets.map((market) => (
                <option key={market} value={market}>
                  {market}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <label className="flex items-start gap-3 text-sm font-medium text-slate-700">
            <input
              checked={preferences.rememberLastDestination}
              className="mt-1 h-4 w-4 rounded border-slate-300"
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  rememberLastDestination: event.target.checked,
                }))
              }
              type="checkbox"
            />
            <span>
              Remember the last destination used on the lookup form so the home
              page reopens in the same market next time.
            </span>
          </label>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
          Current saved last destination:{" "}
          <span className="font-semibold text-slate-900">
            {preferences.lastDestination || "None yet"}
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white"
          onClick={handleSave}
          type="button"
        >
          Save workflow defaults
        </button>
        <button
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900"
          onClick={handleReset}
          type="button"
        >
          Reset defaults
        </button>
      </div>

      {savedMessage ? (
        <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {savedMessage}
        </p>
      ) : null}
    </section>
  );
}
