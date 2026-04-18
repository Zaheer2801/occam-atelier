import { CorpBackdrop } from "@/components/brand/CorpBackdrop";
import { FileUp, Cpu, Trophy } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: FileUp,
    title: "Upload your resume",
    body: "Drop your resume and tell us the roles you want. We optimize for ATS in minutes.",
  },
  {
    n: "02",
    icon: Cpu,
    title: "We work in the background",
    body: "Our automation applies, our marketing team pitches, and our analytics keep you informed.",
  },
  {
    n: "03",
    icon: Trophy,
    title: "Land the offer",
    body: "Show up to interviews prepared. We coach, you negotiate, the offer arrives.",
  },
];

export const CorpHowItWorks = () => (
  <section id="how-it-works" className="relative py-24">
    <CorpBackdrop variant="section" />
    <div className="container">
      <div className="max-w-2xl mx-auto text-center corp-reveal">
        <p className="text-xs uppercase tracking-[0.22em] text-corp-cyan font-semibold mb-4">
          How it works
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-corp-text">
          Your path to <span className="corp-text-gradient">career success</span>.
        </h2>
        <p className="mt-5 text-corp-muted text-lg">
          From resume to offer in three simple steps.
        </p>
      </div>

      <div className="mt-14 grid md:grid-cols-3 gap-6 relative">
        {/* connecting line on md+ */}
        <div
          aria-hidden
          className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-corp-border to-transparent"
        />
        {steps.map((s, i) => (
          <div
            key={s.n}
            className="corp-card relative p-7 corp-reveal text-center"
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div className="mx-auto h-14 w-14 rounded-2xl corp-gradient grid place-items-center text-white shadow-[0_18px_40px_-12px_hsl(var(--corp-purple)/0.6)]">
              <s.icon className="h-6 w-6" />
            </div>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-corp-cyan">
              Step {s.n}
            </p>
            <h3 className="mt-2 font-display text-xl font-bold text-corp-text">{s.title}</h3>
            <p className="mt-3 text-sm text-corp-muted leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
