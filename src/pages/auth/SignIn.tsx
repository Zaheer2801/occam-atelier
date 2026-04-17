import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getUserRole, ROLE_HOME } from "@/lib/auth";

const SignIn = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

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
    if (role === "client" && userId) {
      const { data: prof } = await supabase.from("profiles").select("status").eq("id", userId).maybeSingle();
      const status = prof?.status as string | undefined;
      if (!status || status === "pending_code") { nav("/auth/access-code"); return; }
      if (status === "onboarding") { nav("/onboarding/personal-info"); return; }
      if (status === "resume_review") { nav("/onboarding/resume-review"); return; }
      if (status === "roles_locked" || status === "pending_assignment") { nav("/app/client/waiting"); return; }
    }
    nav(role ? ROLE_HOME[role] : "/app/client/dashboard");
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your OCAS Atelier account">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/auth/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">Forgot?</Link>
          </div>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground border-0 shadow-glow">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          New here? <Link to="/auth/signup" className="text-foreground story-link">Create account</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
