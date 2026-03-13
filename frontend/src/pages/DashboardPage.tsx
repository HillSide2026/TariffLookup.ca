const dashboardCards = [
  {
    title: "Recent lookups",
    value: "0",
    detail: "Lookup history will appear here after backend persistence is added.",
  },
  {
    title: "Supported markets",
    value: "6",
    detail: "US, EU, UK, Japan, South Korea, and Australia are in MVP scope.",
  },
  {
    title: "Backend status",
    value: "Mocked",
    detail: "Frontend is scaffolded against a placeholder lookup API response.",
  },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/70 bg-white/75 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          Dashboard
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Lookup activity and operational readiness
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          This page is intentionally light at the start. It exists to hold
          saved lookups, usage metrics, and product health once auth and
          persistence are connected.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {dashboardCards.map((card) => (
          <article
            key={card.title}
            className="rounded-[28px] border border-white/70 bg-white/75 p-5 shadow-xl shadow-slate-200/60 backdrop-blur"
          >
            <p className="text-sm font-medium text-slate-500">{card.title}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-950">
              {card.value}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {card.detail}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
