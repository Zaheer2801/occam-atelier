import { ReactNode } from "react";
import { Logo } from "@/components/marketing/Logo";

export const AuthLayout = ({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) => (
  <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
    <div className="absolute inset-0 gradient-hero pointer-events-none" />
    <div className="relative w-full max-w-md">
      <div className="flex justify-center mb-8"><Logo /></div>
      <div className="glass rounded-2xl p-8 shadow-elevated">
        <h1 className="font-display text-2xl font-bold text-center">{title}</h1>
        {subtitle && <p className="text-center text-sm text-muted-foreground mt-2">{subtitle}</p>}
        <div className="mt-7">{children}</div>
      </div>
    </div>
  </div>
);
