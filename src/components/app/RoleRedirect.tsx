import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_HOME } from "@/lib/auth";

/** Sends the logged-in user to their role-specific home. Use as the index inside protected routes. */
export const RoleRedirect = () => {
  const { role, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={role ? ROLE_HOME[role] : "/auth/signin"} replace />;
};
