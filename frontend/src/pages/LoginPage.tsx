export function LoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-6 py-10">
      <section className="w-full rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          Login
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Sign in to save lookups and manage your account
        </h2>

        <form className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </span>
            <input
              type="email"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
              placeholder="you@company.com"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </span>
            <input
              type="password"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
              placeholder="••••••••"
            />
          </label>
          <button className="w-full rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800">
            Continue
          </button>
        </form>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          Authentication is not connected yet. This screen is a scaffold for the
          planned Supabase login flow.
        </p>
      </section>
    </div>
  );
}
