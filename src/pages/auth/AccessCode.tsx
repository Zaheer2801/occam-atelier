import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_HOME } from "@/lib/auth";

const AccessCode = () => {
  const { user, role } = useAuth();
  const nav = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    // If already past the gate, route them away
    supabase.from("profiles").select("status").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data?.status && data.status !== "pending_code") {
        if (role === "manager") nav(ROLE_HOME.manager, { replace: true });
        else if (role === "employee") nav(ROLE_HOME.employee, { replace: true });
        else nav("/onboarding/personal-info", { replace: true });
      }
    });
  }, [user, role, nav]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) { toast.error("Please sign in first"); nav("/auth/signin"); return; }
    const trimmed = code.trim();
    if (trimmed.length < 4) { toast.error("Enter your access code"); return; }

    setLoading(true);
    const { data, error } = await supabase.rpc("validate_access_code", { _code: trimmed });
    setLoading(false);

    if (error) { toast.error(error.message); return; }
    if (data !== true) { toast.error("Invalid or expired code"); return; }

    toast.success("Code accepted");
    if (role === "employee") nav(ROLE_HOME.employee, { replace: true });
    else nav("/onboarding/personal-info", { replace: true });
  };

  return (
    <AuthLayout title="Enter your access code" subtitle="Use the code your account manager provided">
      <form onSubmit={submit} className="space-y-5">
        <div>
          <Label htmlFor="code">Access code</Label>
          <Input
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="OCAS-XXX-000"
            autoFocus
            autoComplete="off"
            className="font-mono tracking-wider text-center"
            maxLength={20}
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground border-0">
          {loading ? "Verifying…" : "Validate & continue"}
        </Button>
        <p className="text-center text-[11px] text-muted-foreground">
          Dev test code: <span className="font-mono text-foreground">OCAS-CAN-123</span>
        </p>
      </form>
    </AuthLayout>
  );
};

export default AccessCode;
