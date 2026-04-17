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
import NotFound from "./pages/NotFound";

import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AccessCode from "./pages/auth/AccessCode";

import { ProtectedRoute } from "./components/app/ProtectedRoute";
import { AppShell } from "./components/app/AppShell";
import Dashboard from "./pages/app/Dashboard";
import Applications from "./pages/app/Applications";
import Analytics from "./pages/app/Analytics";
import Profile from "./pages/app/Profile";
import Team from "./pages/app/Team";

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

            <Route path="/auth/signin" element={<SignIn />} />
            <Route path="/auth/signup" element={<SignUp />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/access-code" element={<AccessCode />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path="/app/dashboard" element={<Dashboard />} />
                <Route path="/app/applications" element={<Applications />} />
                <Route path="/app/analytics" element={<Analytics />} />
                <Route path="/app/profile" element={<Profile />} />
                <Route path="/app/team" element={<Team />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Routes>
    </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
