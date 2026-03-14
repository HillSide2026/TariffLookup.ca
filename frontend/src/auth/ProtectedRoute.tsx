import { Navigate, useLocation } from "react-router";
import { useAuth } from "./AuthProvider";
import type { PropsWithChildren } from "react";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isLoading) {
    return (
      <div className="rounded-[32px] border border-white/70 bg-white/75 p-6 text-sm text-slate-600 shadow-xl shadow-slate-200/60 backdrop-blur">
        Restoring your account session...
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
