import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useClientStatus } from "@/hooks/useClientStatus";
import { clientStatusRoute } from "@/lib/onboarding";

/**
 * Wraps client-only routes. Redirects clients to the right place based on their onboarding status.
 * Non-clients pass through (parent ProtectedRoute already handles role checking).
 */
export const ClientStatusGate = () => {
  const { role } = useAuth();
  const { status, loading } = useClientStatus();
  const location = useLocation();

  if (role !== "client") return <Outlet />;
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // Allow free navigation within the onboarding flow once status === 'onboarding'
  const onboardingPaths = [
    "/onboarding/personal-info",
    "/onboarding/resume-upload",
    "/onboarding/resume-review",
    "/onboarding/role-selection",
  ];
  if (status === "onboarding" && onboardingPaths.includes(location.pathname)) {
    return <Outlet />;
  }

  const target = clientStatusRoute(status);
  if (target && target !== location.pathname) {
    return <Navigate to={target} replace />;
  }
  return <Outlet />;
};
