import { useState, useRef, useEffect } from "react";
import { IntroScreen } from "@/components/IntroScreen";
import { Link } from "react-router-dom";
import {
  ArrowRight, ArrowUpRight, Bot, Workflow, Inbox,
  BarChart3, Layers, ShieldCheck, Send, Mail,
  TrendingUp, Clock, Users,
} from "lucide-react";
import iceberg from "@/assets/ocas-iceberg.jpg";
import chess from "@/assets/pawn.jpg";

const features = [
  {
    icon: Bot,
    title: "AI Application Engine",
    tag: "Core",
    body: "Every application written from scratch — tailored to the role, company, and hiring manager's language.",
  },
  {
    icon: Workflow,
    title: "Pipeline Automation",
    tag: "Scale",
    body: "Hundreds of targeted openings across the USA, Canada, and India — submitted around the clock.",
  },
  {
    icon: Inbox,
    title: "Unified Inbox",
    tag: "Clarity",
    body: "Recruiter replies, rejections, and interview invites filtered into one clean view.",
  },
  {
    icon: BarChart3,
    title: "Outcome Analytics",
    tag: "Intelligence",
    body: "Reply rates, interview conversion, and rejection patterns broken down by role and market.",
  },
  {
    icon: Layers,
    title: "Follow-up Automation",
    tag: "Persistence",
    body: "Seven days with no reply? The system follows up — professionally and automatically.",
  },
  {
    icon: ShieldCheck,
    title: "Built for Affordability",
    tag: "Access",
    body: "Real results without the $5,000 agency markup. Built for candidates the system overlooked.",
  },
];

const stats = [
  { icon: TrendingUp, end: 50, suffix: "+", label: "Applications placed in 2026 alone", sub: "USA · Canada · India" },
  { icon: Users, end: 3, suffix: "×", label: "More recruiter replies vs. solo applicants", sub: "Beta cohort, Jan–Apr 2026 *" },
  { icon: Clock, end: 14, suffix: " days", label: "Average time to first interview", sub: "From onboarding to callback *" },
];

const allTestimonials = [
  { quote: "I applied for 4 months solo. Atelier submitted 60 applications in 2 weeks. I had 3 interviews before month's end.", name: "Rahul S.", role: "Software Engineer", placed: "Dallas, TX" },
  { quote: "The follow-up automation changed everything. Recruiters remembered me by name. I stopped feeling invisible.", name: "Priya M.", role: "Product Manager", placed: "Toronto, CA" },
  { quote: "Got my first US offer within 3 weeks. I'd been trying for 7 months on my own. The difference was night and day.", name: "Aisha K.", role: "Data Analyst", placed: "New York, NY" },
  { quote: "What sold me was the analytics. I could see exactly which companies were engaging. No more guessing.", name: "James T.", role: "UX Designer", placed: "Austin, TX" },
  { quote: "I was applying 5 hours a day and burning out. Atelier gave me my evenings back — and more callbacks than I'd ever gotten.", name: "Meera R.", role: "Frontend Developer", placed: "Vancouver, CA" },
  { quote: "Moved from India to Canada. The job market felt impossible. OCAS knew the local market and got me interviews in week 2.", name: "Carlos V.", role: "DevOps Engineer", placed: "Chicago, IL" },
  { quote: "Three offers in 6 weeks. I took the one I would never have found on my own. That's the point — they see more than you do.", name: "Sneha P.", role: "Business Analyst", placed: "Seattle, WA" },
  { quote: "The tailoring is genuinely impressive. Every application felt like it was written by someone who understood the role deeply.", name: "Omar F.", role: "ML Engineer", placed: "San Francisco, CA" },
  { quote: "I'm not a great writer. My applications were getting ignored. Atelier wrote better versions of my own story than I could.", name: "Lakshmi N.", role: "Project Manager", placed: "Atlanta, GA" },
  { quote: "The dashboard transparency is everything. Every application, every follow-up, every reply in real time. Nothing hidden.", name: "Tyler W.", role: "Backend Developer", placed: "Boston, MA" },
  { quote: "Signed my offer on day 31. From upload to signed contract in one month. I didn't think that was possible in this market.", name: "Ananya B.", role: "Marketing Manager", placed: "Toronto, CA" },
  { quote: "I'd been told the market was too saturated. OCAS proved it wasn't — I just wasn't reaching the right people at scale.", name: "David C.", role: "Cloud Architect", placed: "Singapore" },
  { quote: "Worth every cent. No more blank submission boxes. Just dashboard updates and interview prep. My mornings changed.", name: "Fatima Z.", role: "QA Engineer", placed: "Dubai, UAE" },
  { quote: "Relocated from Bangalore to Seattle with zero network. OCAS built one for me through applications that got responses.", name: "Rohan K.", role: "Full Stack Developer", placed: "Seattle, WA" },
  { quote: "I'm a career changer. My resume didn't scream hire me. Atelier reframed it for every role and got callbacks.", name: "Sara J.", role: "Scrum Master", placed: "Denver, CO" },
  { quote: "First week solo: 8 applications. First week with Atelier: 47. That math alone tells the whole story.", name: "Vikram S.", role: "iOS Developer", placed: "Austin, TX" },
  { quote: "I actually read one of my applications after they sent it. It was better than anything I would have written myself.", name: "Emily L.", role: "Product Designer", placed: "New York, NY" },
  { quote: "I had two competing offers. That hadn't happened to me in 10 years of job searching. OCAS changed my leverage entirely.", name: "Arjun M.", role: "Data Scientist", placed: "Toronto, CA" },
  { quote: "It felt weird letting someone else apply for me. Then I got 4 callbacks in a week and the feeling passed immediately.", name: "Neha G.", role: "Operations Manager", placed: "Bangalore, India" },
  { quote: "The follow-up cadence is perfect. Not aggressive, not passive. Recruiters engaged because the timing felt human.", name: "Marcus B.", role: "Android Developer", placed: "Los Angeles, CA" },
  { quote: "My LinkedIn was decent. My applications were terrible. OCAS fixed the one thing actually holding me back.", name: "Divya T.", role: "Solutions Architect", placed: "Seattle, WA" },
  { quote: "I was spending 3 hours per application on cover letters. Atelier handled 200 applications while I prepped for interviews.", name: "John P.", role: "Security Engineer", placed: "Washington, DC" },
  { quote: "Got placed at a company I'd never have found myself. The reach into niche markets is real — that's where the best roles hide.", name: "Kavya R.", role: "Growth Manager", placed: "San Jose, CA" },
  { quote: "Two rejections from companies I wanted badly. OCAS followed up. One came back. I start in three weeks.", name: "Leo T.", role: "Site Reliability Engineer", placed: "Berlin, Germany" },
  { quote: "Honestly embarrassed I waited so long. The moment I uploaded my resume I felt the weight of job searching lift.", name: "Zara H.", role: "Program Manager", placed: "Hyderabad, India" },
  { quote: "100 applications in my first month. I had sent maybe 30 total in the six months before. The volume is staggering.", name: "Aditi V.", role: "Product Analyst", placed: "Toronto, CA" },
  { quote: "I kept telling myself the market was bad. OCAS showed me it wasn't — I was just invisible. They made me visible.", name: "Ben T.", role: "Data Engineer", placed: "Chicago, IL" },
  { quote: "My recruiter knew my background, my goals, my constraints. It never felt like automation. It felt like a team.", name: "Pooja R.", role: "UX Researcher", placed: "San Francisco, CA" },
  { quote: "The customisation level blew me away. Each cover letter referenced the specific company's language. Real research.", name: "Sam H.", role: "Software Architect", placed: "New York, NY" },
  { quote: "Interview in week 1. Offer in week 4. I thought that was impossible in this market. Turns out it just requires the right team.", name: "Kiran M.", role: "Platform Engineer", placed: "London, UK" },
];

const howItWorks = [
  {
    step: "01",
    title: "Upload your resume",
    body: "Atelier parses your CV into a structured profile in under 60 seconds.",
  },
  {
    step: "02",
    title: "Tell us what you want",
    body: "Role, level, location. We map your profile to the highest-probability live openings.",
  },
  {
    step: "03",
    title: "We apply — you watch",
    body: "Applications tailored and submitted around the clock, logged in your dashboard in real time.",
  },
  {
    step: "04",
    title: "You prepare. We persist.",
    body: "We handle follow-ups and reply tracking while you focus on interview prep.",
  },
];



const belowLabels = [
  "AI resume tailoring per role",
  "Mass applications across markets",
  "Recruiter follow-ups & nudges",
  "Reply tracking & outcome analytics",
  "Interview scheduling & coordination",
];

const FadeUp = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const CountUp = ({ end, suffix = '', duration = 1600 }: { end: number; suffix?: string; duration?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    let startTime = 0;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(ease * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, end, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
};

const TestimonialCard = ({ t }: { t: typeof allTestimonials[0] }) => (
  <div className="shrink-0 w-[300px] rounded-2xl border border-[hsl(220_15%_88%)] bg-white p-5 mx-3 select-none">
    <p className="text-[13px] italic text-[hsl(220_25%_25%)] leading-relaxed line-clamp-4">"{t.quote}"</p>
    <div className="mt-4 flex items-center gap-2.5">
      <div className="h-8 w-8 rounded-full bg-[hsl(214_88%_52%)] grid place-items-center font-display font-bold text-white text-xs shrink-0">
        {t.name[0]}
      </div>
      <div>
        <p className="text-xs font-bold text-[hsl(220_45%_8%)]">{t.name} <span className="font-normal text-[hsl(220_25%_45%)]">· {t.role}</span></p>
        <p className="text-[10px] font-mono text-[hsl(214_88%_45%)]">{t.placed}</p>
      </div>
    </div>
  </div>
);

const TestimonialMarquee = () => {
  const row1 = allTestimonials.slice(0, 15);
  const row2 = allTestimonials.slice(15);
  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <style>{`
        @keyframes marqueeLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
      <div style={{ display: 'flex', width: 'max-content', animation: 'marqueeLeft 60s linear infinite' }} className="py-2">
        {[...row1, ...row1].map((t, i) => <TestimonialCard key={i} t={t} />)}
      </div>
      <div style={{ display: 'flex', width: 'max-content', animation: 'marqueeRight 52s linear infinite' }} className="py-2 mt-3">
        {[...row2, ...row2].map((t, i) => <TestimonialCard key={i} t={t} />)}
      </div>
    </div>
  );
};

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setSent(false), 4000);
    }, 700);
  };

  const inputCls = "mt-1.5 w-full rounded-xl border border-[hsl(220_15%_85%)] bg-white px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(214_88%_52%)] focus:border-transparent transition";
  const labelCls = "block text-sm font-semibold text-[hsl(220_45%_12%)]";

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-[hsl(40_30%_93%)] ring-1 ring-[hsl(220_15%_85%)] p-6 md:p-8 space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className={labelCls}>Full name</span>
          <input required name="name" type="text" placeholder="Your name" className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>Email address</span>
          <input required name="email" type="email" placeholder="you@email.com" className={inputCls} />
        </label>
      </div>
      <label className="block">
        <span className={labelCls}>Target role <span className="font-normal text-[hsl(220_25%_50%)]">(optional)</span></span>
        <input name="role" type="text" placeholder="e.g. Senior Product Manager, Toronto" className={inputCls} />
      </label>
      <label className="block">
        <span className={labelCls}>Tell us about your search</span>
        <textarea
          required
          name="message"
          rows={5}
          placeholder="Role, location, how long you've been looking, what's not working — be as specific as you like."
          className={`${inputCls} resize-none`}
        />
      </label>
      <button
        type="submit"
        disabled={loading || sent}
        className="inline-flex items-center gap-2 w-full justify-center rounded-full bg-[hsl(220_45%_8%)] text-[hsl(40_30%_96%)] px-6 py-3.5 text-sm font-semibold hover:bg-[hsl(214_88%_52%)] transition-colors disabled:opacity-70"
      >
        {sent ? "Message sent — we'll be in touch." : loading ? "Sending…" : <><Send className="h-4 w-4" /> Send message</>}
      </button>
      <p className="text-center text-xs text-[hsl(220_25%_45%)]">A real person replies within one business day. No bots.</p>
    </form>
  );
};

const Ocas = () => {
  const [introPlayed, setIntroPlayed] = useState(false);

  return (
    <>
      {!introPlayed && <IntroScreen onDone={() => setIntroPlayed(true)} />}
    <div className="min-h-screen bg-[hsl(40_30%_96%)] text-[hsl(220_45%_8%)] font-sans antialiased">

      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[hsl(40_30%_96%_/_0.88)] border-b border-[hsl(220_15%_88%)]">
        <nav className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="inline-block h-6 w-6 rotate-45 bg-gradient-to-br from-[hsl(214_88%_52%)] to-[hsl(220_45%_8%)] rounded-sm" />
            <span className="font-display text-[22px] tracking-tight">OCAS<span className="text-[hsl(214_88%_52%)]">.</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[hsl(220_25%_30%)]">
            <a href="#philosophy" className="hover:text-[hsl(214_88%_52%)] transition-colors">Philosophy</a>
            <a href="#features" className="hover:text-[hsl(214_88%_52%)] transition-colors">Product</a>
            <a href="#how" className="hover:text-[hsl(214_88%_52%)] transition-colors">How it works</a>
            <a href="#company" className="hover:text-[hsl(214_88%_52%)] transition-colors">Company</a>
            <a href="#contact" className="hover:text-[hsl(214_88%_52%)] transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/atelier" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold hover:text-[hsl(214_88%_52%)] transition-colors">
              Open Atelier <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link to="/auth/signup" className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(220_45%_8%)] text-[hsl(40_30%_96%)] px-4 py-2 text-sm font-semibold hover:bg-[hsl(214_88%_52%)] transition-colors">
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(40,30%,98%) 0%, hsl(210,25%,94%) 55%, hsl(210,30%,90%) 100%)' }}>
        {/* Ambient orbs */}
        <div className="absolute top-[-15%] left-[-8%] w-[700px] h-[700px] rounded-full bg-[hsl(214_88%_65%_/_0.07)] blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-0 left-[15%] w-[400px] h-[400px] rounded-full bg-[hsl(200_70%_65%_/_0.06)] blur-[90px] pointer-events-none" />
        <div className="absolute top-[30%] left-[35%] w-[300px] h-[300px] rounded-full bg-[hsl(214_88%_60%_/_0.04)] blur-[70px] pointer-events-none" />
        <div className="grid md:grid-cols-2 min-h-[88vh] items-center">
          {/* Left — padded to align with rest of page content */}
          <div className="px-8 md:pl-[max(3rem,calc((100vw-1600px)/2+2rem))] md:pr-12 py-20 md:py-28">
              <div className="animate-fade-in" style={{ animationDelay: '0ms' }}>
                <div className="inline-flex items-center gap-2 rounded-full bg-[hsl(214_88%_95%)] border border-[hsl(214_88%_80%)] px-3.5 py-1.5 text-xs font-semibold text-[hsl(214_88%_40%)] mb-6 shadow-[0_0_20px_-4px_hsl(214_88%_52%_/_0.2)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[hsl(214_88%_52%)] animate-pulse" />
                  50+ placements in 2026 · India · USA · Canada
                </div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '80ms' }}>
                <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[hsl(220_25%_40%)]">
                  <span className="h-px w-8 bg-[hsl(220_25%_40%)]" /> OCAS Software LLC
                </span>
              </div>
              <div className="animate-fade-up" style={{ animationDelay: '160ms' }}>
                <h1 className="font-display text-[52px] md:text-[76px] leading-[0.95] tracking-tight mt-4">
                  Stop applying.<br />
                  <em className="italic">Start landing.</em>
                </h1>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
                <p className="mt-5 max-w-md text-[17px] leading-relaxed text-[hsl(220_25%_35%)]">
                  Your dedicated team applies, follows up, and tracks results — while you prepare for the interview.
                </p>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '450ms' }}>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <Link to="/atelier" className="group inline-flex items-center gap-2 rounded-full bg-[hsl(220_45%_8%)] text-[hsl(40_30%_96%)] px-6 py-3.5 text-sm font-semibold hover:bg-[hsl(214_88%_52%)] transition-colors shadow-lg hover:shadow-[0_8px_30px_-4px_hsl(214_88%_52%_/_0.4)]">
                    Get my team <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link to="/atelier" className="text-sm font-semibold text-[hsl(220_25%_30%)] underline-offset-4 hover:underline hover:text-[hsl(220_45%_8%)]">
                    Sign in to portal
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative select-none">
              <style>{`
                @keyframes icebergFloat {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-16px); }
                }
              `}</style>

              {/* Floating iceberg */}
              <div style={{ animation: 'icebergFloat 7s ease-in-out infinite' }}>
                <img src={iceberg} alt="Iceberg — 10% visible, 90% engineered" width={1024} height={1280} className="w-full h-auto block" />

                {/* Edge blends — wide left fade, top fade, no right (bleeds to edge) */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 inset-x-0 h-56 bg-gradient-to-b from-[hsl(210,25%,94%)] to-transparent" />
                  <div className="absolute left-0 inset-y-0 w-[45%] bg-gradient-to-r from-[hsl(210,25%,94%)] via-[hsl(210,25%,94%)]/60 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-[hsl(210,25%,94%)] to-transparent" />
                </div>

                <div className="absolute top-16 left-6 text-[11px] font-mono uppercase tracking-widest text-[hsl(220_45%_8%)] bg-[hsl(40_30%_96%_/_0.85)] backdrop-blur px-3 py-1.5 rounded-full pointer-events-none">
                  10% visible
                </div>
                <div className="absolute bottom-28 left-6 text-[11px] font-mono uppercase tracking-widest text-white bg-[hsl(220_45%_8%_/_0.65)] backdrop-blur px-3 py-1.5 rounded-full pointer-events-none">
                  90% engineered
                </div>
              </div>

              {/* Water surface — animated waves that stay still while iceberg bobs */}
              <div className="absolute bottom-0 inset-x-0 pointer-events-none" style={{ height: '130px' }}>
                <svg
                  viewBox="0 0 1200 130"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-0 w-full h-full"
                >
                  <defs>
                    <linearGradient id="wg1" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="hsl(205,50%,58%)" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="hsl(210,30%,90%)" stopOpacity="1" />
                    </linearGradient>
                    <linearGradient id="wg2" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="hsl(200,45%,55%)" stopOpacity="0.16" />
                      <stop offset="100%" stopColor="hsl(210,30%,90%)" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>
                  {/* Wave 1 — slow, deeper */}
                  <path fill="url(#wg1)">
                    <animate
                      attributeName="d"
                      dur="8s"
                      repeatCount="indefinite"
                      values="
                        M0,45 C150,25 300,65 450,45 C600,25 750,65 900,45 C1050,25 1150,55 1200,45 L1200,130 L0,130 Z;
                        M0,55 C150,75 300,35 450,55 C600,75 750,35 900,55 C1050,75 1150,45 1200,55 L1200,130 L0,130 Z;
                        M0,45 C150,25 300,65 450,45 C600,25 750,65 900,45 C1050,25 1150,55 1200,45 L1200,130 L0,130 Z
                      "
                    />
                  </path>
                  {/* Wave 2 — faster, lighter, offset */}
                  <path fill="url(#wg2)" opacity="0.7">
                    <animate
                      attributeName="d"
                      dur="5.5s"
                      repeatCount="indefinite"
                      values="
                        M0,68 C200,48 400,88 600,68 C800,48 1000,88 1200,68 L1200,130 L0,130 Z;
                        M0,78 C200,98 400,58 600,78 C800,98 1000,58 1200,78 L1200,130 L0,130 Z;
                        M0,68 C200,48 400,88 600,68 C800,48 1000,88 1200,68 L1200,130 L0,130 Z
                      "
                    />
                  </path>
                  {/* Wave 3 — slowest, very subtle */}
                  <path fill="url(#wg1)" opacity="0.4">
                    <animate
                      attributeName="d"
                      dur="11s"
                      repeatCount="indefinite"
                      values="
                        M0,85 C300,65 600,105 900,85 C1050,75 1150,95 1200,85 L1200,130 L0,130 Z;
                        M0,90 C300,110 600,70 900,90 C1050,100 1150,80 1200,90 L1200,130 L0,130 Z;
                        M0,85 C300,65 600,105 900,85 C1050,75 1150,95 1200,85 L1200,130 L0,130 Z
                      "
                    />
                  </path>
                </svg>
                {/* Hard fade at very bottom into page bg */}
                <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[hsl(210,30%,90%)] to-transparent" />
              </div>
            </div>
          </div>

      </section>

      {/* PHILOSOPHY */}
      <section id="philosophy" className="container py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <FadeUp delay={0} className="order-2 md:order-1">
            <div className="relative rounded-3xl overflow-hidden bg-[hsl(220_15%_10%)]" style={{ maxHeight: '520px' }}>
              <img src={chess} alt="A pawn casting the shadow of every chess piece — the potential within" width={1024} height={1536} loading="lazy" className="w-full h-full object-cover mix-blend-luminosity opacity-90" style={{ objectPosition: 'center 25%' }} />
            </div>
          </FadeUp>
          <FadeUp delay={150} className="order-1 md:order-2">
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[hsl(220_25%_40%)]">
              <span className="h-px w-8 bg-[hsl(220_25%_40%)]" /> Our philosophy
            </span>
            <h2 className="font-display text-[44px] md:text-[60px] leading-[1.02] tracking-tight mt-5">
              Every pawn casts<br /><em className="italic">a shadow.</em>
            </h2>
            <p className="mt-6 text-[17px] leading-relaxed text-[hsl(220_25%_32%)] max-w-lg">
              On a job board every candidate looks the same — a name, a file, a number. Every pawn carries a shadow: the full force of what it could become, given the right position and the right light. OCAS is that light source.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Volume, timing, and precision at scale.",
                "Your shadow projected clearly — no filtering you out.",
                "You show up for the endgame. We handle every move before it.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15px]">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[hsl(214_88%_52%)] shrink-0" />
                  <span className="text-[hsl(220_25%_28%)]">{t}</span>
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>

      {/* THE OCAS DIFFERENCE */}
      <section className="bg-[hsl(220_55%_8%)] text-[hsl(40_30%_96%)]">
        <div className="container py-24 md:py-32">
          <div className="max-w-2xl mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[hsl(214_88%_70%)]">
              <span className="h-px w-8 bg-[hsl(214_88%_70%)]" /> The OCAS difference
            </span>
            <h2 className="font-display text-[44px] md:text-[60px] leading-[1] tracking-tight mt-4">
              Not a job board.<br /><em className="italic">A team.</em>
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Real humans backed by AI",
                body: "Actual recruiters handle the judgment. AI handles the volume. You get both.",
              },
              {
                n: "02",
                title: "Volume you couldn't do alone",
                body: "Hundreds of tailored applications across markets you'd never reach manually — running 24/7.",
              },
              {
                n: "03",
                title: "Total transparency",
                body: "Every application, reply, and follow-up logged in your dashboard in real time.",
              },
            ].map((c, i) => (
              <FadeUp key={c.n} delay={i * 120}>
                <div className="group rounded-2xl bg-[hsl(220_45%_12%)] border border-white/8 p-8 hover:border-white/20 hover:bg-[hsl(220_45%_15%)] hover:shadow-[0_0_40px_-8px_hsl(214_88%_52%_/_0.3)] transition-all duration-300 cursor-default">
                  <p className="font-mono text-[11px] tracking-[0.2em] text-[hsl(214_88%_55%)] font-semibold">{c.n}</p>
                  <div className="mt-2 h-[2px] w-8 bg-[hsl(214_88%_52%)] group-hover:w-16 transition-all duration-500" />
                  <h3 className="mt-5 font-display text-xl font-bold leading-snug">{c.title}</h3>
                  <p className="mt-3 text-sm text-[hsl(40_30%_65%)] leading-relaxed">{c.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="container py-24 md:py-32">
        <div className="grid md:grid-cols-[1fr_1.6fr] gap-12 md:gap-20 items-start mb-16">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[hsl(220_25%_40%)]">
              <span className="h-px w-8 bg-[hsl(220_25%_40%)]" /> What's included
            </span>
            <h2 className="font-display text-[44px] md:text-[56px] leading-[1] tracking-tight mt-4">
              Your career department.<br /><em className="italic">Fully staffed.</em>
            </h2>
          </div>
          <p className="text-[16px] leading-relaxed text-[hsl(220_25%_38%)] md:pt-16">
            We staff every function — writing, applying, tracking, following up — so you can focus on the one thing that requires you: the interview.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FadeUp key={f.title} delay={i * 80}>
              <div className="group relative h-full rounded-2xl border border-[hsl(220_15%_88%)] bg-white p-7 hover:border-[hsl(214_88%_52%_/_0.6)] hover:shadow-[0_0_0_1px_hsl(214_88%_52%_/_0.15),0_8px_40px_-4px_hsl(214_88%_52%_/_0.18)] hover:scale-[1.025] hover:-translate-y-1.5 transition-all duration-300 ease-out overflow-hidden cursor-default">
                {/* Radial lighting on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(ellipse_80%_55%_at_20%_0%,hsl(214_88%_52%_/_0.09),transparent_65%)]" />
                <div className="flex items-start justify-between mb-5 relative z-10">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(214_88%_95%)] text-[hsl(214_88%_45%)] group-hover:bg-[hsl(214_88%_52%)] group-hover:text-white group-hover:shadow-[0_0_18px_-2px_hsl(214_88%_52%_/_0.5)] transition-all duration-300">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[hsl(220_25%_50%)] bg-[hsl(220_15%_94%)] group-hover:bg-[hsl(214_88%_95%)] group-hover:text-[hsl(214_88%_40%)] px-2 py-1 rounded-full transition-colors duration-300">{f.tag}</span>
                </div>
                <h3 className="font-display text-lg font-bold relative z-10 group-hover:text-[hsl(220_45%_5%)] transition-colors duration-200">{f.title}</h3>
                <p className="mt-2 text-sm text-[hsl(220_25%_38%)] leading-relaxed relative z-10">{f.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-[hsl(220_55%_8%)] text-[hsl(40_30%_96%)]">
        <div className="container py-24 md:py-32">
          <div className="max-w-2xl mb-14">
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[hsl(214_88%_70%)]">
              <span className="h-px w-8 bg-[hsl(214_88%_70%)]" /> How it flows
            </span>
            <h2 className="font-display text-[44px] md:text-[56px] leading-[1] tracking-tight mt-4">
              From upload to offer.<br /><em className="italic">You barely lift a finger.</em>
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((s, i) => (
              <FadeUp key={s.step} delay={i * 100}>
                <div className="group rounded-2xl bg-[hsl(220_45%_12%)] border border-white/8 p-7 relative overflow-hidden hover:border-white/20 hover:bg-[hsl(220_45%_15%)] hover:shadow-[0_0_40px_-8px_hsl(214_88%_52%_/_0.25)] transition-all duration-300 cursor-default h-full">
                  <p className="font-mono text-[11px] tracking-[0.18em] text-[hsl(214_88%_60%)] font-semibold">{s.step}</p>
                  <h3 className="mt-3 font-display text-xl font-bold leading-snug">{s.title}</h3>
                  <p className="mt-3 text-sm text-[hsl(40_30%_65%)] leading-relaxed">{s.body}</p>
                  <div className="absolute bottom-0 right-0 font-display text-[80px] font-extrabold text-white/[0.03] leading-none select-none">{s.step}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* STATS + TESTIMONIALS */}
      <section className="container py-24 md:py-32">
        <FadeUp className="mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[hsl(220_25%_40%)]">
            <span className="h-px w-8 bg-[hsl(220_25%_40%)]" /> Proof
          </span>
          <h2 className="font-display text-[44px] md:text-[56px] leading-[1] tracking-tight mt-4">
            The numbers don't <em className="italic">lie.</em>
          </h2>
        </FadeUp>
        <div className="grid gap-5 md:grid-cols-3 mb-3">
          {stats.map((s, i) => (
            <FadeUp key={s.label} delay={i * 120}>
              <div className="rounded-2xl border border-[hsl(220_15%_88%)] bg-white p-8 hover:border-[hsl(214_88%_52%_/_0.3)] hover:shadow-[0_4px_30px_-8px_hsl(214_88%_52%_/_0.15)] transition-all duration-300 h-full">
                <s.icon className="h-5 w-5 text-[hsl(214_88%_52%)] mb-4" />
                <p className="font-display text-5xl md:text-6xl font-extrabold text-[hsl(220_45%_8%)]">
                  <CountUp end={s.end} suffix={s.suffix} />
                </p>
                <p className="mt-3 text-[15px] font-semibold text-[hsl(220_25%_20%)]">{s.label}</p>
                <p className="mt-1 text-xs font-mono text-[hsl(220_25%_50%)]">{s.sub}</p>
              </div>
            </FadeUp>
          ))}
        </div>
        <p className="text-xs text-[hsl(220_25%_50%)] mb-14">* Based on beta cohort, Jan–Apr 2026</p>

        <TestimonialMarquee />
      </section>


      {/* DIVISION OF LABOUR */}
      <section className="bg-[hsl(220_55%_8%)] text-[hsl(40_30%_96%)]">
        <div className="container py-24 md:py-32">
          <FadeUp className="max-w-4xl mx-auto">

            {/* Header */}
            <div className="flex items-center gap-4 mb-16">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[hsl(214_88%_60%)]">The division of labour</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            {/* YOU row */}
            <div className="flex items-baseline gap-6 mb-3">
              <span className="font-mono text-[11px] tracking-[0.2em] text-white/30 w-8 shrink-0">YOU</span>
              <span className="font-display text-[42px] md:text-[56px] leading-none tracking-tight text-white">
                Prepare. Show up. Sign.
              </span>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-10">
              <span className="h-px flex-1 bg-white/8" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/25">Atelier handles the rest</span>
              <span className="h-px flex-1 bg-white/8" />
            </div>

            {/* WE rows — period format */}
            <div className="space-y-0">
              {belowLabels.map((label, i) => (
                <FadeUp key={label} delay={i * 60}>
                  <div className="group flex items-baseline gap-6 py-5 border-b border-white/[0.07] hover:border-white/20 transition-colors duration-200 cursor-default">
                    <span className="font-mono text-[11px] tracking-[0.2em] text-[hsl(214_88%_55%)] w-8 shrink-0">
                      {String(i + 1).padStart(2, "0")}.
                    </span>
                    <span className="font-display text-[28px] md:text-[38px] leading-tight tracking-tight text-white/80 group-hover:text-white transition-colors duration-200">
                      {label}
                    </span>
                  </div>
                </FadeUp>
              ))}
            </div>

          </FadeUp>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-[hsl(220_55%_8%)] text-[hsl(40_30%_96%)]">
        <div className="container py-24 md:py-32">
          <div className="grid md:grid-cols-[1fr_1.3fr] gap-12 items-start">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[hsl(214_88%_70%)]">
                <span className="h-px w-8 bg-[hsl(214_88%_70%)]" /><Mail className="h-3.5 w-3.5" /> Get in touch
              </span>
              <h2 className="font-display text-[44px] md:text-[56px] leading-[1] tracking-tight mt-4">
                Let's talk<em className="italic">.</em>
              </h2>
              <p className="mt-5 text-[16px] text-[hsl(40_30%_65%)] leading-relaxed max-w-sm">
                A real person replies within one business day. No scripts, no pressure.
              </p>
              <a href="mailto:hello@ocassoftwarellc.com" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(214_88%_65%)] hover:text-white transition-colors group">
                <Mail className="h-4 w-4" />
                hello@ocassoftwarellc.com
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <div className="mt-10 grid grid-cols-2 gap-4 max-w-xs">
                {[
                  { label: "Response time", value: "< 24 hrs" },
                  { label: "Humans on team", value: "Real ones" },
                  { label: "Sales pressure", value: "Zero" },
                  { label: "Follow-up bots", value: "None" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-white/6 border border-white/8 px-4 py-3">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[hsl(40_30%_55%)]">{item.label}</p>
                    <p className="mt-1 font-display text-base font-bold text-[hsl(214_88%_65%)]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* COMPANY / CTA */}
      <section id="company" className="container py-24 md:py-32">
        <div className="rounded-3xl bg-[hsl(220_45%_8%)] text-[hsl(40_30%_96%)] p-10 md:p-16 grid md:grid-cols-[1.2fr_1fr] gap-10 items-end">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[hsl(214_88%_65%)]">
              <span className="h-px w-8 bg-[hsl(214_88%_65%)]" /> OCAS Software LLC
            </span>
            <h2 className="font-display text-[44px] md:text-[60px] leading-[1] tracking-tight mt-4">
              Automation for<br /><em className="italic">human</em> potential.
            </h2>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-[hsl(40_30%_65%)]">
              Intelligent automation for the parts of the job search that drain great people.
            </p>
            <p className="mt-3 text-xs font-mono uppercase tracking-widest text-[hsl(214_88%_55%)]">
              Outsource · Connect · Apply · Succeed
            </p>
          </div>
          <div className="flex md:justify-end gap-3 flex-wrap items-center">
            <Link to="/auth/signup" className="inline-flex items-center gap-2 rounded-full bg-[hsl(214_88%_52%)] text-white px-6 py-3.5 text-sm font-semibold hover:bg-[hsl(214_88%_60%)] transition-colors">
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-white/25 text-[hsl(40_30%_90%)] px-6 py-3.5 text-sm font-semibold hover:border-white/50 hover:text-white transition-colors">
              Contact us
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[hsl(220_15%_88%)]">
        <div className="container py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-sm text-[hsl(220_25%_40%)]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="inline-block h-5 w-5 rotate-45 bg-gradient-to-br from-[hsl(214_88%_52%)] to-[hsl(220_45%_8%)] rounded-sm" />
              <span className="font-display text-lg text-[hsl(220_45%_8%)]">OCAS Software LLC</span>
            </div>
            <p className="mt-1 text-xs font-mono uppercase tracking-widest text-[hsl(220_25%_50%)]">Outsource · Connect · Apply · Succeed</p>
            <p className="mt-1 text-xs text-[hsl(220_25%_50%)]">India · USA · Canada</p>
            <p className="mt-1 text-xs text-[hsl(220_25%_55%)]">© 2022–2026 OCAS Software LLC · All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="#philosophy" className="hover:text-[hsl(214_88%_52%)] transition-colors">Philosophy</a>
            <a href="#features" className="hover:text-[hsl(214_88%_52%)] transition-colors">Product</a>
            <a href="#contact" className="hover:text-[hsl(214_88%_52%)] transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default Ocas;
