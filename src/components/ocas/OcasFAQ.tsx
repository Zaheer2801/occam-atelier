import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = [
  {
    q: "What does OCAS Software actually do?",
    a: "We pair an in-house team of recruiters, marketers, and AI engineers with a modern client workspace. We build agentic AI tools, run career-marketing campaigns, and place job seekers — primarily into US tech roles.",
  },
  {
    q: "How long has OCAS been in business?",
    a: "Our founders have been shipping software and running placements since 2019. OCAS Software LLC was formally established in 2022 to consolidate the AI, training, marketing, and placement practice into one platform.",
  },
  {
    q: "Is the AI Lab a separate product?",
    a: "It is one practice inside the same workspace. We build production agents (RAG, tool-use, multi-agent) on top of OpenAI, Anthropic, Gemini, and open-source stacks — with eval harnesses and guardrails.",
  },
  {
    q: "Do I need to be in the US to work with you?",
    a: "No. The Career Bridge specifically helps global candidates land roles in the US market — through ATS-tuned profiles, recruiter outreach, and interview coaching.",
  },
  {
    q: "Where do I sign in or open my Atelier portal?",
    a: "Use the Sign in link in the top-right, or click Open Atelier to enter the candidate workspace directly.",
  },
];

export const OcasFAQ = () => (
  <section className="relative py-28">
    <div className="container max-w-3xl">
      <div className="text-center mb-12">
        <span className="ocas-eyebrow">
          <span className="ocas-eyebrow-dot" />
          FAQ
        </span>
        <h2 className="ocas-display ocas-display-lg mt-4">
          Questions, <span className="ocas-text-gradient">answered.</span>
        </h2>
      </div>
      <div className="ocas-glass p-2 sm:p-4 rounded-3xl">
        <Accordion type="single" collapsible className="w-full">
          {FAQ.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-white/5"
            >
              <AccordionTrigger className="text-left text-white hover:no-underline px-4">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="ocas-text-soft px-4 pb-4">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </section>
);