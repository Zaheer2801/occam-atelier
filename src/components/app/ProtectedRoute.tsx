import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Role, ROLE_HOME } from "@/lib/auth";

interface Props {
  allowedRoles?: Role[];
}

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { user, role, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth/signin" replace />;
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to={ROLE_HOME[role]} replace />;
  }
  return <Outlet />;
};
