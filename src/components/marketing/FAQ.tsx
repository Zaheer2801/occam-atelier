import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const items = [
  { q: "How does auto-apply actually work?", a: "We use AI to read each job description, tailor your resume and cover letter, and submit through the company's ATS. You stay in control via a per-role approval setting." },
  { q: "Will recruiters know I used automation?", a: "No. Applications look identical to ones you'd submit manually — only better tailored." },
  { q: "Can I cancel anytime?", a: "Yes. Plans are month-to-month with no contracts. Yearly plans get a 17% discount." },
  { q: "Is my data safe?", a: "All data is encrypted at rest and in transit. We never sell or share information." },
  { q: "Which job boards do you support?", a: "200+ ATS platforms including Greenhouse, Lever, Workday, BambooHR, plus LinkedIn, Indeed, and AngelList." },
];

export const FAQ = () => (
  <section className="container py-24">
    <div className="text-center max-w-2xl mx-auto mb-12">
      <p className="text-sm font-medium text-primary mb-3">FAQ</p>
      <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">Common questions</h2>
    </div>
    <div className="max-w-2xl mx-auto glass rounded-2xl p-2">
      <Accordion type="single" collapsible className="w-full">
        {items.map((it, i) => (
          <AccordionItem key={i} value={`q${i}`} className="border-border/60 px-5">
            <AccordionTrigger className="text-left font-medium">{it.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{it.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);
