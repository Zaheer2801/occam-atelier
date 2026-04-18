import { useState } from "react";
import { CorpBackdrop } from "@/components/brand/CorpBackdrop";
import { Plus, Minus, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  {
    q: "How is this different from auto-apply tools?",
    a: "Most auto-apply tools spam roles indiscriminately. We pair targeted automation with a human marketing specialist who curates roles, writes pitches, and handles recruiter conversations on your behalf.",
  },
  {
    q: "Will my applications look generic?",
    a: "No. Every submission is tuned to the role's keywords and the company's stack. Important steps route back to a human before going out.",
  },
  {
    q: "What kinds of roles do you support?",
    a: "Full-stack, Cloud, DevOps, Data, Cyber Security, and product roles at growth-stage companies in the US.",
  },
  {
    q: "Do I need to give up my current job hunt?",
    a: "No. Use us alongside your own search. Most clients see their reply rate jump within the first two weeks.",
  },
  {
    q: "How long until I see results?",
    a: "Most clients book their first interview within 2–3 weeks. Time-to-offer depends on your target roles and seniority.",
  },
  {
    q: "Is my data secure?",
    a: "Your resume and search are encrypted at rest and scoped by role. We never sell your data.",
  },
];

const Item = ({ q, a, i }: { q: string; a: string; i: number }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="corp-card overflow-hidden corp-reveal"
      style={{ transitionDelay: `${i * 50}ms` }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-6 p-6 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-base md:text-lg font-semibold text-corp-text">
          {q}
        </span>
        <span className="shrink-0 h-8 w-8 rounded-full border border-corp-border grid place-items-center text-corp-muted">
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-6 text-sm text-corp-muted leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
};

export const CorpFAQ = () => (
  <section className="relative py-24">
    <CorpBackdrop variant="section" />
    <div className="container max-w-4xl">
      <div className="text-center corp-reveal">
        <p className="text-xs uppercase tracking-[0.22em] text-corp-purple font-semibold mb-4">
          FAQ
        </p>
        <h2 className="font-display text-4xl md:text-6xl tracking-tight text-corp-text">
          Frequently asked <span className="corp-italic corp-text-gradient">questions.</span>
        </h2>
      </div>

      <div className="mt-12 grid gap-4">
        {faqs.map((f, i) => (
          <Item key={f.q} {...f} i={i} />
        ))}
      </div>

      <div className="mt-12 text-center corp-reveal">
        <p className="text-corp-muted">Still have questions?</p>
        <Link
          to="/contact"
          className="mt-3 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-corp-text border border-corp-border hover:bg-corp-surface-2 transition-colors"
        >
          <MessageSquare className="h-4 w-4" /> Chat with our team
        </Link>
      </div>
    </div>
  </section>
);
