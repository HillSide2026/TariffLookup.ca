import { NavLink, Outlet } from "react-router";

const navigationItems = [
  { to: "/", label: "Lookup" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/profile", label: "Profile" },
  { to: "/settings", label: "Settings" },
];

function navLinkClass(isActive: boolean) {
  return [
    "rounded-full px-4 py-2 text-sm font-medium transition",
    isActive
      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
      : "text-slate-700 hover:bg-white/80 hover:text-slate-950",
  ].join(" ");
}

export function AppShell() {
  return (
    <div className="relative min-h-screen overflow-hidden text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-10 h-80 w-80 rounded-full bg-amber-300/35 blur-3xl" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-cyan-300/25 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-8">
        <header className="mb-8 flex flex-col gap-4 rounded-[28px] border border-white/70 bg-white/60 px-5 py-4 shadow-lg shadow-slate-200/70 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              TariffLookup.ca
            </p>
            <h1 className="text-xl font-semibold text-slate-950">
              Canadian export tariff intelligence
            </h1>
          </div>

          <nav className="flex flex-wrap gap-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => navLinkClass(isActive)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
