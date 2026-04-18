import { useEffect, useState } from "react";
import { CorpHeader } from "@/components/brand/CorpHeader";
import { CorpFooter } from "@/components/brand/CorpFooter";
import { CorpBackdrop } from "@/components/brand/CorpBackdrop";
import { useCorpReveal } from "@/hooks/useCorpReveal";
import { Mail, Headphones, Briefcase, Users, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

const cards = [
  {
    icon: Mail,
    title: "General Inquiries",
    desc: "Questions about OCAS, our services, or anything else",
    contact: "hello@ocas.software",
    response: "24 hours",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    desc: "Existing clients needing help with their account or campaign",
    contact: "support@ocas.software",
    response: "2h (Pro+) / 24h (Starter)",
  },
  {
    icon: Briefcase,
    title: "Sales & Partnerships",
    desc: "Enterprise inquiries, white-label options, or partnerships",
    contact: "sales@ocas.software",
    response: "1 business day",
  },
  {
    icon: Users,
    title: "Careers",
    desc: "Interested in joining our team? We're always looking for talent",
    contact: "careers@ocas.software",
    response: "1 week",
  },
];

const Contact = () => {
  const ref = useCorpReveal();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    interest: "",
    message: "",
  });

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.className;
    html.classList.remove("dark");
    return () => {
      html.className = prev;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.message) {
      toast.error("Please fill in name, email, and a message.");
      return;
    }
    toast.success("Thanks! We'll get back to you within 24 hours.");
    setForm({ firstName: "", lastName: "", email: "", company: "", interest: "", message: "" });
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="corporate min-h-screen flex flex-col">
      <CorpHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative isolate overflow-hidden pt-24 pb-12">
          <CorpBackdrop variant="hero" />
          <div className="container relative text-center max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-[0.22em] text-corp-cyan font-semibold mb-4">
              Contact
            </p>
            <h1 className="font-display text-5xl md:text-7xl tracking-tight text-corp-text leading-[1.0]">
              Let's <span className="corp-italic corp-text-gradient">talk.</span>
            </h1>
            <p className="mt-7 text-corp-muted text-lg">
              Have questions? We're here to help. Reach out and we'll respond
              within 24 hours (often much faster).
            </p>
          </div>
        </section>

        {/* Contact options */}
        <section className="relative py-12">
          <div className="container grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {cards.map((c, i) => (
              <div
                key={c.title}
                className="corp-card p-6 corp-reveal"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="h-11 w-11 rounded-xl corp-gradient-soft border border-corp-border grid place-items-center">
                  <c.icon className="h-5 w-5 text-corp-text" />
                </div>
                <h3 className="mt-5 font-display text-base font-bold text-corp-text">{c.title}</h3>
                <p className="mt-1.5 text-sm text-corp-muted">{c.desc}</p>
                <a
                  href={`mailto:${c.contact}`}
                  className="mt-4 block text-sm text-corp-cyan hover:text-corp-text transition-colors break-all"
                >
                  {c.contact}
                </a>
                <p className="mt-2 text-[11px] font-mono text-corp-dim">↻ {c.response}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Form + Office */}
        <section className="relative py-20">
          <CorpBackdrop variant="section" />
          <div className="container grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 corp-card p-8 md:p-10 corp-reveal">
              <h2 className="font-display text-3xl font-bold text-corp-text">Send us a message</h2>
              <p className="mt-2 text-corp-muted">We'll respond within one business day.</p>
              <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="First name" required value={form.firstName} onChange={set("firstName")} />
                  <Field label="Last name" value={form.lastName} onChange={set("lastName")} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Email" type="email" required value={form.email} onChange={set("email")} placeholder="you@example.com" />
                  <Field label="Company (optional)" value={form.company} onChange={set("company")} />
                </div>
                <div className="grid gap-2">
                  <label className="text-xs uppercase tracking-[0.18em] text-corp-dim font-mono">I'm interested in</label>
                  <select
                    value={form.interest}
                    onChange={set("interest")}
                    className="rounded-lg bg-corp-surface-2/60 border border-corp-border px-3 py-2.5 text-sm text-corp-text focus:outline-none focus:border-corp-purple/60"
                  >
                    <option value="">Select an option</option>
                    <option>IT Staffing</option>
                    <option>Career Coaching</option>
                    <option>Resume Marketing</option>
                    <option>On-the-Job Support</option>
                    <option>Enterprise / Partnerships</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-xs uppercase tracking-[0.18em] text-corp-dim font-mono">Message *</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={set("message")}
                    rows={5}
                    placeholder="Tell us a bit about what you're looking for…"
                    className="rounded-lg bg-corp-surface-2/60 border border-corp-border px-3 py-2.5 text-sm text-corp-text placeholder:text-corp-dim focus:outline-none focus:border-corp-purple/60 resize-none"
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                  <p className="text-xs text-corp-dim">We respect your privacy. Your info will never be shared.</p>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white corp-gradient hover:-translate-y-0.5 transition-transform"
                  >
                    Send message <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-6">
              <div className="corp-card p-6 corp-reveal">
                <div className="flex items-center gap-2 text-corp-cyan">
                  <MapPin className="h-4 w-4" />
                  <p className="text-[10px] uppercase tracking-[0.22em] font-mono">Visit us</p>
                </div>
                <h3 className="mt-3 font-display text-lg font-bold text-corp-text">OCAS Software LLC</h3>
                <address className="mt-2 not-italic text-sm text-corp-muted leading-relaxed">
                  123 Innovation Drive
                  <br />
                  Suite 400
                  <br />
                  San Francisco, CA 94107
                  <br />
                  United States
                </address>
                <p className="mt-4 text-xs text-corp-dim font-mono">Mon–Fri · 9am–6pm PST</p>
              </div>

              <div className="corp-card p-6 corp-reveal">
                <p className="text-[10px] uppercase tracking-[0.22em] font-mono text-corp-purple">
                  Prefer a call?
                </p>
                <h3 className="mt-3 font-display text-lg font-bold text-corp-text">
                  Book a 15-min intro
                </h3>
                <p className="mt-2 text-sm text-corp-muted">
                  Walk through your goals with one of our specialists. No pressure, no pitch.
                </p>
                <a
                  href="mailto:hello@ocas.software?subject=Intro%20call"
                  className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-corp-text border border-corp-border hover:bg-corp-surface-2 transition-colors"
                >
                  Schedule a call
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <CorpFooter />
    </div>
  );
};

const Field = ({
  label,
  required,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) => (
  <div className="grid gap-2">
    <label className="text-xs uppercase tracking-[0.18em] text-corp-dim font-mono">
      {label} {required && "*"}
    </label>
    <input
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="rounded-lg bg-corp-surface-2/60 border border-corp-border px-3 py-2.5 text-sm text-corp-text placeholder:text-corp-dim focus:outline-none focus:border-corp-purple/60"
    />
  </div>
);

export default Contact;
