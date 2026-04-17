import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";

import Index from "./pages/Index";
import Features from "./pages/Features";
import PricingPage from "./pages/PricingPage";
import About from "./pages/About";
import Brand from "./pages/Brand";
import Atelier from "./pages/Atelier";
import RightJob from "./pages/RightJob";
import NotFound from "./pages/NotFound";

import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AccessCode from "./pages/auth/AccessCode";

import { ProtectedRoute } from "./components/app/ProtectedRoute";
import { RoleRedirect } from "./components/app/RoleRedirect";
import { AppShell } from "./components/app/AppShell";
import { ClientStatusGate } from "./components/app/ClientStatusGate";

import ClientDashboard from "./pages/app/client/Dashboard";
import ClientApplications from "./pages/app/client/Applications";
import ClientAnalytics from "./pages/app/client/Analytics";
import ClientProfile from "./pages/app/client/Profile";
import ClientWaiting from "./pages/app/client/Waiting";

import PersonalInfo from "./pages/onboarding/PersonalInfo";
import ResumeUpload from "./pages/onboarding/ResumeUpload";
import ResumeReview from "./pages/onboarding/ResumeReview";
import RoleSelection from "./pages/onboarding/RoleSelection";

import EmployeeDashboard from "./pages/app/employee/Dashboard";
import EmployeeApplications from "./pages/app/employee/Applications";
import EmployeeClients from "./pages/app/employee/Clients";
import EmployeeAnalytics from "./pages/app/employee/Analytics";
import EmployeeProfile from "./pages/app/employee/Profile";

import ManagerOverview from "./pages/app/manager/Overview";
import ManagerTeam from "./pages/app/manager/Team";
import ManagerClients from "./pages/app/manager/Clients";
import ManagerPendingClients from "./pages/app/manager/PendingClients";
import ManagerApplications from "./pages/app/manager/Applications";
import ManagerAnalytics from "./pages/app/manager/Analytics";
import ManagerSettings from "./pages/app/manager/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/brand" element={<Brand />} />
            <Route path="/atelier" element={<Atelier />} />
            <Route path="/right-job" element={<RightJob />} />

            <Route path="/auth/signin" element={<SignIn />} />
            <Route path="/auth/signup" element={<SignUp />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/access-code" element={<AccessCode />} />

            {/* Catch-all redirect for legacy /app entry */}
            <Route element={<ProtectedRoute />}>
              <Route path="/app" element={<RoleRedirect />} />
              <Route path="/app/dashboard" element={<RoleRedirect />} />
              <Route path="/app/applications" element={<RoleRedirect />} />
              <Route path="/app/analytics" element={<RoleRedirect />} />
              <Route path="/app/profile" element={<RoleRedirect />} />
              <Route path="/app/team" element={<RoleRedirect />} />
            </Route>

            {/* Client onboarding (status-gated, no AppShell) */}
            <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
              <Route element={<ClientStatusGate />}>
                <Route path="/onboarding/personal-info" element={<PersonalInfo />} />
                <Route path="/onboarding/resume-upload" element={<ResumeUpload />} />
                <Route path="/onboarding/resume-review" element={<ResumeReview />} />
                <Route path="/onboarding/role-selection" element={<RoleSelection />} />
                <Route path="/app/client/waiting" element={<ClientWaiting />} />
              </Route>
            </Route>

            {/* Client active dashboard (only when status='assigned') */}
            <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
              <Route element={<ClientStatusGate />}>
                <Route element={<AppShell />}>
                  <Route path="/app/client/dashboard" element={<ClientDashboard />} />
                  <Route path="/app/client/applications" element={<ClientApplications />} />
                  <Route path="/app/client/analytics" element={<ClientAnalytics />} />
                  <Route path="/app/client/profile" element={<ClientProfile />} />
                </Route>
              </Route>
            </Route>

            {/* Employee */}
            <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
              <Route element={<AppShell />}>
                <Route path="/app/employee/dashboard" element={<EmployeeDashboard />} />
                <Route path="/app/employee/applications" element={<EmployeeApplications />} />
                <Route path="/app/employee/clients" element={<EmployeeClients />} />
                <Route path="/app/employee/analytics" element={<EmployeeAnalytics />} />
                <Route path="/app/employee/profile" element={<EmployeeProfile />} />
              </Route>
            </Route>

            {/* Manager */}
            <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
              <Route element={<AppShell />}>
                <Route path="/app/manager/overview" element={<ManagerOverview />} />
                <Route path="/app/manager/team" element={<ManagerTeam />} />
                <Route path="/app/manager/clients" element={<ManagerClients />} />
                <Route path="/app/manager/clients/pending" element={<ManagerPendingClients />} />
                <Route path="/app/manager/applications" element={<ManagerApplications />} />
                <Route path="/app/manager/analytics" element={<ManagerAnalytics />} />
                <Route path="/app/manager/settings" element={<ManagerSettings />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
