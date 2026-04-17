import { useCountUp } from "@/hooks/useCountUp";

const Stat = ({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) => {
  const { ref, val } = useCountUp(value);
  return (
    <div className="corp-card p-8 text-center">
      <div className="font-display text-5xl md:text-6xl font-extrabold corp-text-gradient">
        <span ref={ref}>{val.toLocaleString()}</span>{suffix}
      </div>
      <div className="mt-3 text-sm uppercase tracking-[0.2em] text-corp-dim font-mono">{label}</div>
    </div>
  );
};

export const CorpStats = () => (
  <section className="relative py-24">
    <div className="container">
      <div className="grid md:grid-cols-4 gap-5 corp-reveal">
        <Stat value={2400000} suffix="+" label="Applications sent" />
        <Stat value={148} suffix="k" label="Active careers" />
        <Stat value={38} suffix="%" label="Avg reply lift" />
        <Stat value={99} suffix=".9%" label="Uptime" />
      </div>
    </div>
  </section>
);
