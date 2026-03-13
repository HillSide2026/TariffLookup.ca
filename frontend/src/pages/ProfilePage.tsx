export function ProfilePage() {
  return (
    <section className="rounded-[32px] border border-white/70 bg-white/75 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
        Profile
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        Account details and organization context
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">User</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">Not connected</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Organization</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            Canadian exporter account
          </p>
        </div>
      </div>
    </section>
  );
}
