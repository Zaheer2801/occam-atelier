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
    <div className="glass rounded-2xl p-6 hover-lift relative overflow-hidden">
      <div className="absolute top-4 right-4 h-9 w-9 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
        <Icon className="h-4 w-4 text-primary-foreground" />
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="font-display font-bold text-3xl mt-2">{v.toLocaleString()}{suffix}</div>
      {typeof trend === "number" && (
        <div className={`mt-2 flex items-center gap-1 text-xs ${trend >= 0 ? "text-success" : "text-destructive"}`}>
          {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(trend)}% from last month
        </div>
      )}
    </div>
  );
};
