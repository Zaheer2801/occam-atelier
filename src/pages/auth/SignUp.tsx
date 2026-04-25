import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight, Briefcase, Search, ShieldCheck } from "lucide-react";

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

  const onGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Could not start Google sign-in. Please try again.");
    }
  };

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
    toast.success("Account created! Enter your access code to continue.");
    nav("/auth/access-code");
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start automating your job search in minutes">
      {/* Social sign-on */}
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
        or sign up with email
        <span className="h-px bg-border flex-1" />
      </div>

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

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
  </svg>
);

export default SignUp;
