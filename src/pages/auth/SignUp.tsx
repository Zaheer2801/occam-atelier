import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const schema = z.object({
  fullName: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "Min 8 characters").max(72),
  role: z.enum(["client", "employee", "manager"]),
  terms: z.literal(true, { errorMap: () => ({ message: "You must agree" }) }),
});

const SignUp = () => {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const managerInvite = params.get("invite") === "manager";
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      fullName: String(fd.get("fullName") || ""),
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
      role: String(fd.get("role") || "client") as "client" | "employee" | "manager",
      terms: fd.get("terms") === "on",
    };
    if (data.role === "manager" && !managerInvite) {
      toast.error("Manager signup requires an invite link");
      return;
    }
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: parsed.data.fullName, role: parsed.data.role },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created! Welcome to OCAS Atelier.");
    nav("/auth/signin");
  };

  return (
    <AuthLayout title="Create your account" subtitle={managerInvite ? "Manager invite — full admin access" : "Start automating your job search in minutes"}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" name="fullName" required maxLength={100} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required minLength={8} />
        </div>
        <div>
          <Label className="mb-2 block">I am a…</Label>
          <RadioGroup name="role" defaultValue={managerInvite ? "manager" : "client"} className={`grid gap-3 ${managerInvite ? "grid-cols-3" : "grid-cols-2"}`}>
            <label className="flex items-center gap-2 border border-border rounded-lg p-3 cursor-pointer hover:border-primary">
              <RadioGroupItem value="client" /> <span className="text-sm">Client</span>
            </label>
            <label className="flex items-center gap-2 border border-border rounded-lg p-3 cursor-pointer hover:border-primary">
              <RadioGroupItem value="employee" /> <span className="text-sm">Employee</span>
            </label>
            {managerInvite && (
              <label className="flex items-center gap-2 border border-primary/50 rounded-lg p-3 cursor-pointer hover:border-primary bg-primary/5">
                <RadioGroupItem value="manager" /> <span className="text-sm">Manager</span>
              </label>
            )}
          </RadioGroup>
        </div>
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <Checkbox name="terms" className="mt-0.5" />
          <span>I agree to the <a className="story-link text-foreground" href="#">Terms</a> and <a className="story-link text-foreground" href="#">Privacy Policy</a></span>
        </label>
        <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground border-0 shadow-glow">
          {loading ? "Creating…" : "Create account"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/auth/signin" className="text-foreground story-link">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
