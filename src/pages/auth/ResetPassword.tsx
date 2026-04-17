import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ResetPassword = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") || "");
    if (password.length < 8) { toast.error("Min 8 characters"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated");
    nav("/app/dashboard");
  };

  return (
    <AuthLayout title="Set a new password">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="password">New password</Label>
          <Input id="password" name="password" type="password" required minLength={8} />
        </div>
        <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground border-0">
          {loading ? "Updating…" : "Update password"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
