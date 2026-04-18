import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CorpHeader } from "@/components/brand/CorpHeader";
import { CorpFooter } from "@/components/brand/CorpFooter";
import { CorpBackdrop } from "@/components/brand/CorpBackdrop";
import { useCorpReveal } from "@/hooks/useCorpReveal";
import {
  Bot,
  Send,
  Filter,
  Workflow,
  BarChart3,
  PieChart,
  Activity,
  LineChart,
  UserCheck,
  Megaphone,
  PenTool,
  HeartHandshake,
  MessageSquare,
  BookOpen,
  Mic,
  Trophy,
  ArrowUpRight,
  Plug,
} from "lucide-react";

const groups = [
  {
    tag: "Automation",
    title: "Apply at scale, never spam.",
    body: "Long-running agents browse, apply, and follow up — supervised by a real person on every important step.",
    items: [
      { i: Bot, t: "AI agents", b: "Run in the background, 24/7." },
      { i: Send, t: "Targeted submissions", b: "Tuned to each role's keywords." },
      { i: Filter, t: "Smart filters", b: "Skip roles that don't match." },
      { i: Workflow, t: "Custom workflows", b: "Triggers for every milestone." },
    ],
  },
  {
    tag: "Analytics",
    title: "See your funnel in real time.",
    body: "Application volume, response rates, time-to-interview — all of it, live.",
    items: [
      { i: BarChart3, t: "Funnel charts", b: "From submit to offer." },
      { i: PieChart, t: "Source mix", b: "Where replies come from." },
      { i: Activity, t: "Live activity", b: "Every action, every minute." },
      { i: LineChart, t: "Trends", b: "Week-over-week reply lift." },
    ],
  },
  {
    tag: "Human Expertise",
    title: "A team in your corner.",
    body: "Marketing specialists, recruiters, and senior mentors — not just software.",
    items: [
      { i: UserCheck, t: "Dedicated specialist", b: "Your point of contact." },
      { i: Megaphone, t: "Recruiter outreach", b: "Targeted, never blasted." },
      { i: PenTool, t: "Resume rewrites", b: "ATS-tuned, human-edited." },
      { i: HeartHandshake, t: "On-job mentorship", b: "First-90-days bench." },
    ],
  },
  {
    tag: "Interview Prep",
    title: "Walk in ready to win.",
    body: "Mock interviews, role-tailored prep tracks, and salary playbooks.",
    items: [
      { i: MessageSquare, t: "1:1 mocks", b: "Real practice with experts." },
      { i: BookOpen, t: "Prep tracks", b: "Tailored to each role." },
      { i: Mic, t: "Recorded reviews", b: "Watch yourself improve." },
      { i: Trophy, t: "Negotiation", b: "Close at the right number." },
    ],
  },
];

const integrations = ["LinkedIn", "Greenhouse", "Lever", "Notion", "Slack", "Calendly", "Gmail", "GitHub"];

const FeaturesPage = () => {
  const ref = useCorpReveal();

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.className;
    html.classList.remove("dark");
    return () => {
      html.className = prev;
    };
  }, []);

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="corporate min-h-screen flex flex-col">
      <CorpHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative isolate overflow-hidden pt-24 pb-20">
          <CorpBackdrop variant="hero" />
          <div className="container relative text-center max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-[0.22em] text-corp-cyan font-semibold mb-4">
              Features
            </p>
            <h1 className="font-display text-5xl md:text-7xl tracking-tight text-corp-text leading-[1.0]">
              Powerful tools for{" "}
              <span className="corp-italic corp-text-gradient">career success.</span>
            </h1>
            <p className="mt-7 text-corp-muted text-lg">
              Everything you need to automate applications, track progress, and
              land your dream role — all in one platform.
            </p>
            <div className="mt-9 flex justify-center">
              <Link
                to="/auth/signup"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white corp-gradient hover:-translate-y-0.5 transition-transform"
              >
                Start Your Journey <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Groups */}
        {groups.map((g, gi) => (
          <section key={g.tag} className="relative py-20">
            <CorpBackdrop variant="section" />
            <div className="container">
              <div className="grid md:grid-cols-12 gap-10 items-start">
                <div className="md:col-span-5 corp-reveal md:sticky md:top-24">
                  <p className="text-[10px] uppercase tracking-[0.22em] font-mono text-corp-cyan">
                    {String(gi + 1).padStart(2, "0")} · {g.tag}
                  </p>
                  <h2 className="mt-3 font-display text-3xl md:text-4xl font-extrabold tracking-tight text-corp-text">
                    {g.title}
                  </h2>
                  <p className="mt-4 text-corp-muted">{g.body}</p>
                </div>
                <div className="md:col-span-7 grid sm:grid-cols-2 gap-5">
                  {g.items.map((it, i) => (
                    <div
                      key={it.t}
                      className="corp-card p-6 corp-reveal"
                      style={{ transitionDelay: `${i * 60}ms` }}
                    >
                      <div className="h-10 w-10 rounded-xl corp-gradient-soft border border-corp-border grid place-items-center">
                        <it.i className="h-4 w-4 text-corp-text" />
                      </div>
                      <h3 className="mt-4 font-display text-base font-bold text-corp-text">{it.t}</h3>
                      <p className="mt-1.5 text-sm text-corp-muted">{it.b}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Integrations */}
        <section id="integrations" className="relative py-20">
          <CorpBackdrop variant="section" />
          <div className="container">
            <div className="max-w-2xl corp-reveal">
              <p className="text-xs uppercase tracking-[0.22em] text-corp-purple font-semibold mb-4">
                Integrations
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-corp-text">
                Plays well <span className="corp-text-gradient">with everything</span>.
              </h2>
              <p className="mt-5 text-corp-muted text-lg">
                Connect the tools you already use for a unified workflow.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {integrations.map((name, i) => (
                <div
                  key={name}
                  className="corp-card px-5 py-6 text-center corp-reveal"
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  <Plug className="h-4 w-4 text-corp-cyan mx-auto" />
                  <div className="mt-3 font-display text-base text-corp-text">{name}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-corp-text border border-corp-border hover:bg-corp-surface-2 transition-colors"
              >
                Request an integration <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <CorpFooter />
    </div>
  );
};

export default FeaturesPage;
