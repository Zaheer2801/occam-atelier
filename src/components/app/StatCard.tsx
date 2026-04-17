import { useEffect, useState } from "react";
import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

interface Props {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  trend?: number;
}

export const StatCard = ({ label, value, suffix = "", icon: Icon, trend }: Props) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1100;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      setV(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-6 hover-lift">
      <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-secondary/40" />
      <div className="absolute top-4 right-4 h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-glow">
        <Icon className="h-5 w-5 text-primary-foreground" />
      </div>
      <div className="text-sm text-muted-foreground relative">{label}</div>
      <div className="font-display text-4xl mt-2 text-foreground relative">{v.toLocaleString()}{suffix}</div>
      {typeof trend === "number" && (
        <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${trend >= 0 ? "text-success" : "text-destructive"}`}>
          {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(trend)}% from last month
        </div>
      )}
    </div>
  );
};
