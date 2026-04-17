import { ReactNode } from "react";
import { Logo } from "@/components/marketing/Logo";
import { Progress } from "@/components/ui/progress";

const STEPS = [
  { key: "personal-info", label: "Your details" },
  { key: "resume-upload", label: "Resume" },
  { key: "resume-review", label: "Review" },
  { key: "role-selection", label: "Target roles" },
];

export const OnboardingShell = ({
  step,
  title,
  subtitle,
  children,
}: {
  step: 1 | 2 | 3 | 4;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) => {
  const pct = (step / STEPS.length) * 100;
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero pointer-events-none" />
      <div className="relative max-w-2xl mx-auto px-4 py-10 md:py-16">
        <div className="flex justify-center mb-6"><Logo /></div>

        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Step {step} of {STEPS.length}</span>
            <span>{STEPS[step - 1].label}</span>
          </div>
          <Progress value={pct} className="h-1.5" />
          <div className="hidden sm:flex justify-between mt-3 text-[10px] uppercase tracking-wider">
            {STEPS.map((s, i) => (
              <span key={s.key} className={i + 1 <= step ? "text-primary font-semibold" : "text-muted-foreground"}>
                {s.label}
              </span>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 md:p-8 shadow-elevated animate-fade-in">
          <h1 className="font-display text-2xl md:text-3xl font-bold">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
};
