const settingsGroups = [
  "Saved destinations and workflow defaults",
  "Notification and release-note preferences",
  "Subscription and billing status",
];

export function SettingsPage() {
  return (
    <section className="rounded-[32px] border border-white/70 bg-white/75 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
        Settings
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        Product controls that matter after the core lookup flow is stable
      </h2>

      <div className="mt-6 grid gap-4">
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
