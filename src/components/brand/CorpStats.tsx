import { useCountUp } from "@/hooks/useCountUp";

const Stat = ({
  value,
  suffix = "",
  label,
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  label: string;
  decimals?: number;
}) => {
  const { ref, val } = useCountUp(value);
  const display = decimals
    ? val.toFixed(decimals)
    : val.toLocaleString();
  return (
    <div className="corp-card p-8 text-center">
      <div className="font-sans text-5xl md:text-6xl font-bold tracking-tight corp-text-gradient">
        <span ref={ref}>{display}</span>
        {suffix}
      </div>
      <div className="mt-3 text-sm uppercase tracking-[0.2em] text-corp-dim font-mono">{label}</div>
    </div>
  );
};

export const CorpStats = () => (
  <section className="relative py-24">
    <div className="container">
      <div className="grid md:grid-cols-4 gap-5 corp-reveal">
        <Stat value={3} suffix="x" label="Avg reply lift" />
        <Stat value={14} label="Day free trial" />
        <Stat value={24} suffix="/7" label="Real-time tracking" />
        <Stat value={99} suffix=".9%" label="Uptime" />
      </div>
    </div>
  </section>
);
