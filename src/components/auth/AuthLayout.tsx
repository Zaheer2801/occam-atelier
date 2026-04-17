import { ReactNode } from "react";
import { Logo } from "@/components/marketing/Logo";
import { useForceLightTheme } from "@/hooks/useTheme";
import decorSpiral from "@/assets/decor-spiral.png";
import decorStack from "@/assets/decor-stack.png";

export const AuthLayout = ({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) => {
  useForceLightTheme();
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-background">
      <div className="absolute inset-0 gradient-hero pointer-events-none" />
      <img
        src={decorSpiral}
        alt=""
        aria-hidden="true"
        width={140}
        height={140}
        className="hidden sm:block absolute top-10 left-10 w-24 float-slow opacity-90 pointer-events-none select-none"
      />
      <img
        src={decorStack}
        alt=""
        aria-hidden="true"
        width={120}
        height={120}
        className="hidden sm:block absolute bottom-10 right-10 w-20 float-fast opacity-90 pointer-events-none select-none"
      />
      <div className="relative w-full max-w-md">
        <div className="flex justify-center mb-8"><Logo /></div>
        <div className="bg-card border border-border rounded-3xl p-8 shadow-elevated">
          <h1 className="font-display text-2xl text-center text-foreground">{title}</h1>
          {subtitle && <p className="text-center text-sm text-muted-foreground mt-2">{subtitle}</p>}
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </div>
  );
};
