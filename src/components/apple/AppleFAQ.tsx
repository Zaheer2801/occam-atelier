import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "What does OCAS Software actually do?", a: "We pair AI automation with a dedicated team — marketers, recruiters and coaches — to manage your entire job search: applications, follow-ups, interview prep and negotiation." },
  { q: "How is this different from a job board?", a: "Job boards show you postings. We do the work — tailoring every application, tracking every reply, and routing interviews to your calendar." },
  { q: "Who is the Atelier portal for?", a: "Atelier is the workspace for active OCAS Software clients. You'll see live application status, recruiter conversations and analytics in real time." },
  { q: "Is my resume safe?", a: "Yes. Your data is encrypted at rest and in transit, and is never used to train public AI models." },
  { q: "How fast do clients see results?", a: "Most clients see their first interview within two weeks of onboarding and an offer in under 30 days on average." },
];

export const AppleFAQ = () => (
  <section className="py-28">
    <div className="container max-w-3xl">
      <div className="text-center mb-14">
        <p className="apple-eyebrow uppercase">FAQ</p>
        <h2 className="apple-display apple-display-lg mt-3 text-[hsl(var(--apple-ink))]">
          Questions,
          <span className="text-[hsl(var(--apple-muted))]"> answered.</span>
        </h2>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`i-${i}`} className="border-b border-[hsl(var(--apple-line))]">
            <AccordionTrigger className="text-left text-base font-medium text-[hsl(var(--apple-ink))] py-5 hover:no-underline">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-[hsl(var(--apple-ink-soft))] leading-relaxed pb-5">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);
