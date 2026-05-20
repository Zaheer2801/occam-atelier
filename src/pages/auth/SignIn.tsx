import { useNavigate } from "react-router-dom";
import { Search, Briefcase, LayoutDashboard, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_HOME, Role } from "@/lib/auth";

const roles: { role: Role; icon: React.ElementType; title: string; desc: string; accent: string }[] = [
  {
    role: "client",
    icon: Search,
    title: "Client",
    desc: "View your pipeline, applications, and analytics.",
    accent: "bg-primary text-primary-foreground",
  },
  {
    role: "employee",
    icon: Briefcase,
    title: "Employee",
    desc: "Manage client applications and track placements.",
    accent: "bg-accent text-accent-foreground",
  },
  {
    role: "manager",
    icon: LayoutDashboard,
    title: "Manager",
    desc: "Operations overview, team management, analytics.",
    accent: "bg-foreground text-background",
  },
];

const SignIn = () => {
  const { enterDevMode } = useAuth();
  const nav = useNavigate();

  const enter = (role: Role) => {
    enterDevMode(role);
    nav(ROLE_HOME[role]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
            <span className="h-px w-8 bg-border" /> Atelier Portal <span className="h-px w-8 bg-border" />
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">Who are you?</h1>
          <p className="mt-2 text-muted-foreground">Choose your role to enter your workspace.</p>
        </div>

        {/* Role cards */}
        <div className="space-y-3">
          {roles.map(({ role, icon: Icon, title, desc, accent }) => (
            <button
              key={role}
              onClick={() => enter(role)}
              className="group w-full flex items-center gap-4 rounded-2xl border border-border bg-card p-5 text-left transition-all hover:border-foreground/30 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accent} shadow-sm`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-base font-semibold text-foreground">{title}</span>
                <span className="block text-sm text-muted-foreground mt-0.5">{desc}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 shrink-0" />
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          OCAS Software LLC · Internal access only
        </p>
      </div>
    </div>
  );
};

export default SignIn;
