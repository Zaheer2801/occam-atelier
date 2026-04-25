import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  Bot,
  GraduationCap,
  Megaphone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { OcasTerminal } from "./OcasTerminal";
import { OcasUSMap } from "./OcasUSMap";

type TiltProps = React.PropsWithChildren<{ className?: string; id?: string }>;

/** Card with subtle 3D tilt on cursor move. */
const TiltCard = ({ children, className = "", id }: TiltProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(
      2
    )}deg) rotateY(${(x * 4).toFixed(2)}deg) translateY(-2px)`;
  };
  const onLeave = () => {
    if (ref.current)
      ref.current.style.transform =
        "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
  };
  return (
    <div
      id={id}
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`ocas-bento ocas-tilt ${className}`}
    >
      {children}
    </div>
  );
};

const Pillar = ({
  Icon,
  tag,
  title,
  body,
  bullets,
}: {
  Icon: typeof Bot;
  tag: string;
  title: string;
  body: string;
  bullets: string[];
}) => (
  <div className="p-7 h-full flex flex-col">
    <div className="flex items-center justify-between">
      <span className="ocas-eyebrow">
        <span className="ocas-eyebrow-dot" />
        {tag}
      </span>
      <Icon className="h-5 w-5 ocas-text-muted" />
    </div>
    <h3 className="mt-5 ocas-display text-2xl font-semibold text-white">
      {title}
    </h3>
    <p className="mt-3 text-sm ocas-text-soft leading-relaxed">{body}</p>
    <ul className="mt-5 space-y-2 mb-2">
      {bullets.map((b) => (
        <li
          key={b}
          className="flex items-center gap-2 text-xs ocas-text-muted"
        >
          <span className="h-1 w-1 rounded-full bg-[hsl(var(--ocas-cyan))]" />
          {b}
        </li>
      ))}
    </ul>
  </div>
);

export const OcasBento = () => (
  <section className="relative py-28">
    <div className="container max-w-6xl">
      <div className="max-w-2xl mx-auto text-center">
        <span className="ocas-eyebrow">
          <span className="ocas-eyebrow-dot" />
          Four pillars · One platform
        </span>
        <h2 className="ocas-display ocas-display-lg mt-5">
          A full stack of <span className="ocas-text-gradient">career and AI services.</span>
        </h2>
        <p className="mt-5 ocas-text-soft text-lg">
          From agentic tools to US placements — every offering, one quiet
          workspace.
        </p>
      </div>

      {/* Bento grid */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 auto-rows-[minmax(220px,auto)] gap-5">
        {/* AI Lab — large, with live terminal */}
        <TiltCard id="ai-lab" className="md:col-span-4 lg:col-span-7 lg:row-span-2">
          <div className="grid lg:grid-cols-2 h-full">
            <Pillar
              Icon={Bot}
              tag="AI Lab"
              title="Agentic AI tools & LLM stacks."
              body="We build and deploy autonomous agents that draft, retrieve, route, and act — production-grade, from spec to scale."
              bullets={[
                "RAG, tool-use, multi-agent orchestration",
                "Eval harnesses & guardrails",
                "OpenAI · Anthropic · Gemini · OSS",
              ]}
            />
            <div className="p-5 lg:pl-0">
              <OcasTerminal />
            </div>
          </div>
        </TiltCard>

        {/* Academy */}
        <TiltCard id="academy" className="md:col-span-2 lg:col-span-5">
          <Pillar
            Icon={GraduationCap}
            tag="Academy"
            title="Upskill for the next-gen workforce."
            body="Hands-on coaching that turns experience into offers — interview drills, role positioning, and live market intel."
            bullets={[
              "1:1 mock interviews",
              "Tailored prep tracks",
              "Negotiation playbooks",
            ]}
          />
        </TiltCard>

        {/* Global Marketing */}
        <TiltCard id="marketing" className="md:col-span-3 lg:col-span-5">
          <Pillar
            Icon={Megaphone}
            tag="Global Marketing"
            title="Digital growth & brand systems."
            body="ATS-optimized resumes, LinkedIn rewrites, and targeted outreach so the right recruiters and partners find you first."
            bullets={[
              "Brand & positioning",
              "Performance + content",
              "Recruiter outreach",
            ]}
          />
        </TiltCard>

        {/* US Career Bridge — wide with map */}
        <TiltCard
          id="us-bridge"
          className="md:col-span-3 lg:col-span-12"
        >
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-0 h-full">
            <Pillar
              Icon={MapPin}
              tag="US Career Bridge"
              title="Exclusive marketing & placement in the US."
              body="A dedicated services team — recruiters, marketers, coaches — guides job seekers into roles at growth-stage US companies."
              bullets={[
                "Full-stack · Cloud · Data · Security",
                "W2 & C2C engagements",
                "Direct hire & contract",
              ]}
            />
            <div className="p-5">
              <OcasUSMap />
            </div>
          </div>
        </TiltCard>
      </div>

      {/* CTA row */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
        <Link to="/auth/signup" className="ocas-cta">
          Start your journey <ArrowUpRight className="h-4 w-4" />
        </Link>
        <Link to="/atelier" className="ocas-cta-ghost">
          Open Atelier portal ›
        </Link>
      </div>
    </div>
  </section>
);