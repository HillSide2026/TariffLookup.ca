import { useAuth } from "../auth/AuthProvider";

const settingsGroups = [
  "Saved destinations and workflow defaults",
  "Notification and release-note preferences",
  "Subscription and billing status",
];

export function SettingsPage() {
  const auth = useAuth();

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
        {settingsGroups.map((item) => (
          <div
            key={item}
            className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
