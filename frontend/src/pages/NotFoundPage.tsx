import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl items-center px-6 py-10 text-center">
      <section className="w-full rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-xl shadow-slate-200/60 backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          404
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          This route has not been mapped yet.
        </h2>
        <p className="mt-4 text-base leading-7 text-slate-600">
          The frontend router is active, but the page you asked for is outside
          the initial scaffold.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
        >
          Back to lookup
        </Link>
      </section>
    </div>
  );
}
