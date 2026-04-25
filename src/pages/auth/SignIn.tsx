import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getUserRole, ROLE_HOME } from "@/lib/auth";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

const SignIn = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) toast.error("Could not start Google sign-in. Please try again.");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back!");
    const userId = data.user?.id;
    const role = userId ? await getUserRole(userId) : null;
    if (userId) {
      const { data: prof } = await supabase.from("profiles").select("status").eq("id", userId).maybeSingle();
      const status = prof?.status as string | undefined;
      if (!status || status === "pending_code") { nav("/auth/access-code"); return; }
      if (role === "client") {
        if (status === "onboarding") { nav("/onboarding/personal-info"); return; }
        if (status === "resume_review") { nav("/onboarding/resume-review"); return; }
      }
    }
    nav(role ? ROLE_HOME[role] : "/app/client/dashboard");
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your OCAS Atelier account">
      <button
        type="button"
        onClick={onGoogle}
        className="w-full flex items-center justify-center gap-3 h-11 rounded-full border border-border bg-white text-foreground font-medium hover:bg-muted transition-colors"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px bg-border flex-1" />
        or with email
        <span className="h-px bg-border flex-1" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="you@company.com" className="h-11 rounded-xl mt-1.5" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/auth/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">Forgot password?</Link>
          </div>
          <div className="relative mt-1.5">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="h-11 rounded-xl pr-11"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-full gradient-primary text-primary-foreground border-0 shadow-glow text-[15px] font-semibold group"
        >
          {loading ? "Signing in…" : (
            <span className="inline-flex items-center gap-2">
              Sign in to your portal
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          New here? <Link to="/auth/signup" className="text-foreground story-link">Create account</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
  </svg>
);

export default SignIn;
