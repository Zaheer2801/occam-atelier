import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const AccessCode = () => {
  const { user } = useAuth();
  const nav = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (code.length !== 6) { toast.error("Enter 6-digit code"); return; }
    if (!user) { toast.error("Please sign in first"); nav("/auth/signin"); return; }
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ setup_completed: true })
      .eq("id", user.id);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Setup complete");
    nav("/app/dashboard");
  };

  return (
    <AuthLayout title="Enter access code" subtitle="Use the code your account manager provided">
      <div className="space-y-6">
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              {Array.from({ length: 6 }).map((_, i) => (<InputOTPSlot key={i} index={i} />))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button onClick={submit} disabled={loading} className="w-full gradient-primary text-primary-foreground border-0">
          {loading ? "Verifying…" : "Verify"}
        </Button>
        <Label className="block text-center text-xs text-muted-foreground">
          Demo: any 6-digit code works
        </Label>
      </div>
    </AuthLayout>
  );
};

export default AccessCode;
