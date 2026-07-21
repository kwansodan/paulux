import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { hasPermission } from "./types";
import { paths } from "@/router/paths";

function FullPageSpinner() {
  return (
    <div className="flex h-screen items-center justify-center text-muted-foreground">
      Loading…
    </div>
  );
}

/** Gate a subtree on an authenticated session. */
export function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <FullPageSpinner />;
  if (!user)
    return <Navigate to={paths.login} state={{ from: location }} replace />;
  return <Outlet />;
}

/** Gate a subtree on a specific permission key (admins pass via "*"). */
export function RequirePermission({ permission }: { permission: string }) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (!user) return <Navigate to={paths.login} replace />;
  if (!hasPermission(user, permission))
    return <Navigate to={paths.unauthorized} replace />;
  return <Outlet />;
}
