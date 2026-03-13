const jurisdictionCards = [
  "United States",
  "European Union",
  "United Kingdom",
  "Japan",
  "South Korea",
  "Australia",
];

export function HomePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
      <section className="rounded-[32px] border border-white/70 bg-white/75 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
        <div className="mb-8 max-w-2xl">
          <p className="mb-3 inline-flex rounded-full border border-amber-300/60 bg-amber-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-900">
            MVP workflow
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Check a tariff in one market without crawling six datasets by hand.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            The initial product flow is intentionally narrow: one HS code, one
            destination country, one tariff answer with agreement context and
            eligibility notes.
          </p>
        </div>

        <div className="grid gap-4 rounded-[28px] bg-slate-950 p-5 text-white sm:grid-cols-[1fr_1fr_auto]">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-white/80">HS code</span>
            <input
              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none ring-0 placeholder:text-white/45"
              placeholder="8208.30"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-white/80">Destination</span>
            <select className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none">
              <option>Japan</option>
              <option>United States</option>
              <option>European Union</option>
              <option>United Kingdom</option>
              <option>South Korea</option>
              <option>Australia</option>
            </select>
          </label>
          <div className="flex items-end">
            <button className="w-full rounded-2xl bg-amber-300 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-200 sm:w-auto">
              Run lookup
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">MFN rate</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">TBD</p>
            <p className="mt-2 text-sm text-slate-600">
              Will be populated by jurisdiction tariff schedules.
            </p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Preferential rate</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">TBD</p>
            <p className="mt-2 text-sm text-slate-600">
              Agreement-aware result once rule logic is wired in.
            </p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Eligibility notes</p>
            <p className="mt-3 text-lg font-semibold text-slate-900">
              Placeholder response
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Will summarize applicable agreement basis and conditions.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="rounded-[32px] border border-white/70 bg-white/75 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Initial coverage
          </p>
          <div className="mt-5 grid gap-3">
            {jurisdictionCards.map((market) => (
              <div
                key={market}
                className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
              >
                {market}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-cyan-200/70 bg-cyan-50/85 p-6 shadow-xl shadow-cyan-100/70">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-900">
            Next integration
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-cyan-950">
            <li>Wire the frontend form to the backend lookup endpoint.</li>
            <li>Replace placeholder output with normalized tariff data.</li>
            <li>Persist lookup history once auth is enabled.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
