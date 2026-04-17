import { useEffect, useState } from "react";
import { useReveal } from "@/hooks/useReveal";

const stats = [
  { v: 124000, l: "Applications sent", suffix: "+" },
  { v: 18500, l: "Interviews landed", suffix: "+" },
  { v: 2400, l: "Offers received", suffix: "+" },
  { v: 96, l: "Customer satisfaction", suffix: "%" },
];

const Counter = ({ to, suffix, run }: { to: number; suffix: string; run: boolean }) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    const start = performance.now();
    const dur = 1600;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, run]);
  return <>{v.toLocaleString()}{suffix}</>;
};

export const Stats = () => {
  const { ref, shown } = useReveal();
  return (
    <section ref={ref} className="container py-16">
      <div className="glass rounded-3xl p-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="text-center">
            <div className="font-display font-bold text-4xl md:text-5xl text-gradient">
              <Counter to={s.v} suffix={s.suffix} run={shown} />
            </div>
            <div className="text-sm text-muted-foreground mt-2">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
