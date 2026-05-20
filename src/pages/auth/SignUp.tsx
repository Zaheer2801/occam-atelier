import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight, Briefcase, Search, ShieldCheck } from "lucide-react";
import { ROLE_HOME } from "@/lib/auth";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const EU_EEA_UK = new Set([
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE",
  "IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE",
  "IS","LI","NO","CH","GB",
]);

const schema = z.object({
  fullName: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "Min 8 characters").max(72),
  role: z.enum(["client", "employee", "manager"]),
  terms: z.literal(true, { errorMap: () => ({ message: "You must agree" }) }),
});

const SignUp = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"client" | "employee" | "manager">("client");
  const [geoBlocked, setGeoBlocked] = useState(false);

  useEffect(() => {
    if (role !== "client") return;
    (async () => {
      try {
        const res = await fetch(`${API}/api/onboarding/geo-check`, { method: "POST" });
        const data = await res.json();
        if (!data.allowed) setGeoBlocked(true);
      } catch { /* fail open */ }
    })();
  }, [role]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      fullName: String(fd.get("fullName") || ""),
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
      role,
      terms: fd.get("terms") === "on",
    };
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/signin`,
        data: { full_name: parsed.data.fullName, role: parsed.data.role },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!signUpData.session) {
      // Supabase email confirmation is on — user must click the link first
      toast.success("Account created! Check your email to confirm, then sign in.");
      nav("/auth/signin");
      return;
    }
    // Email confirmation is off — already signed in, go straight to dashboard
    toast.success("Account created! Welcome.");
    const roleKey = parsed.data.role as keyof typeof ROLE_HOME;
    nav(ROLE_HOME[roleKey] ?? "/app/client/dashboard");
  };

  if (geoBlocked && role === "client") {
    return (
      <AuthLayout title="US-only at launch" subtitle="OCAS Atelier is currently available to US candidates only">
        <div className="text-center py-4 space-y-3">
          <p className="text-sm text-muted-foreground">We detected a non-US IP address.</p>
          <p className="text-sm text-muted-foreground">Join our EU/UK waitlist — launching internationally in 2026.</p>
          <a href="mailto:hello@ocassoftwarellc.com" className="text-sm font-semibold text-primary hover:underline">
            Join waitlist →
          </a>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start automating your job search in minutes">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" name="fullName" required maxLength={100} placeholder="Jane Doe" className="h-11 rounded-xl mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input id="email" name="email" type="email" required placeholder="you@company.com" className="h-11 rounded-xl mt-1.5" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1.5">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              placeholder="At least 8 characters"
              className="h-11 rounded-xl pr-11"
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

        <div>
          <Label className="mb-2 block">What brings you here?</Label>
          <div className="grid gap-2.5">
            <RoleOption
              selected={role === "client"}
              onClick={() => setRole("client")}
              icon={<Search className="h-4 w-4" />}
              title="I'm looking for a job"
              desc="Let our team apply and follow up for you."
            />
            <RoleOption
              selected={role === "employee"}
              onClick={() => setRole("employee")}
              icon={<Briefcase className="h-4 w-4" />}
              title="I work at OCAS Atelier"
              desc="Recruiter, marketer or coach access."
            />
            <RoleOption
              selected={role === "manager"}
              onClick={() => setRole("manager")}
              icon={<ShieldCheck className="h-4 w-4" />}
              title="I'm a team manager"
              desc="Oversee clients and employee performance."
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Employees and managers will need an access code on the next step.
          </p>
        </div>

        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <Checkbox name="terms" className="mt-0.5" />
          <span>I agree to the <a className="story-link text-foreground" href="#">Terms</a> and <a className="story-link text-foreground" href="#">Privacy Policy</a></span>
        </label>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-full gradient-primary text-primary-foreground border-0 shadow-glow text-[15px] font-semibold group"
        >
          {loading ? "Creating your account…" : (
            <span className="inline-flex items-center gap-2">
              Get started — it's free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/auth/signin" className="text-foreground story-link">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

const RoleOption = ({
  selected,
  onClick,
  icon,
  title,
  desc,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-left flex items-start gap-3 rounded-2xl border px-4 py-3 transition-all ${
      selected
        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
        : "border-border bg-white hover:border-foreground/30"
    }`}
  >
    <span className={`mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg ${selected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
      {icon}
    </span>
    <span className="flex-1">
      <span className="block text-sm font-semibold text-foreground">{title}</span>
      <span className="block text-xs text-muted-foreground">{desc}</span>
    </span>
    <span className={`mt-1.5 h-4 w-4 rounded-full border-2 ${selected ? "border-primary bg-primary" : "border-border"}`} />
  </button>
);

export default SignUp;
