import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import iceberg from "@/assets/ocas-iceberg.jpg";
import potential from "@/assets/ocas-potential.jpg";

const Ocas = () => {
  return (
    <div className="min-h-screen bg-[hsl(40_30%_96%)] text-[hsl(220_45%_8%)] font-sans antialiased">
      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[hsl(40_30%_96%_/_0.85)] border-b border-[hsl(220_15%_88%)]">
        <nav className="container max-w-7xl flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="inline-block h-6 w-6 rotate-45 bg-gradient-to-br from-[hsl(214_88%_52%)] to-[hsl(220_45%_8%)] rounded-sm" />
            <span className="font-display text-[22px] tracking-tight">OCAS<span className="text-[hsl(214_88%_52%)]">.</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[hsl(220_25%_30%)]">
            <a href="#philosophy" className="hover:text-[hsl(214_88%_52%)] transition-colors">Philosophy</a>
            <a href="#products" className="hover:text-[hsl(214_88%_52%)] transition-colors">Products</a>
            <a href="#company" className="hover:text-[hsl(214_88%_52%)] transition-colors">Company</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/atelier" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold hover:text-[hsl(214_88%_52%)] transition-colors">
              Open Atelier <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/auth/signup"
              className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(220_45%_8%)] text-[hsl(40_30%_96%)] px-4 py-2 text-sm font-semibold hover:bg-[hsl(214_88%_52%)] transition-colors"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO — iceberg metaphor */}
      <section className="relative overflow-hidden">
        <div className="container max-w-7xl pt-16 pb-8 md:pt-24">
          <div className="grid md:grid-cols-[1.05fr_1fr] gap-10 md:gap-16 items-center">
            <div className="relative">
              <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[hsl(220_25%_40%)]">
                <span className="h-px w-8 bg-[hsl(220_25%_40%)]" /> OCAS Software LLC
              </span>
              <h1 className="font-display text-[56px] md:text-[88px] leading-[0.95] tracking-tight mt-5">
                The tip <em className="italic">you see.</em>
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 bg-[hsl(214_88%_52%)] text-[hsl(40_30%_96%)] px-4 py-1 rounded-md">The base</span>
                </span>{" "}
                we build.
              </h1>
              <p className="mt-7 max-w-lg text-[17px] leading-relaxed text-[hsl(220_25%_28%)]">
                Every product has a surface. We engineer the depth beneath it — the
                automation, intelligence and infrastructure that makes the visible
                feel effortless.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  to="/atelier"
                  className="group inline-flex items-center gap-2 rounded-full bg-[hsl(220_45%_8%)] text-[hsl(40_30%_96%)] px-6 py-3.5 text-sm font-semibold hover:bg-[hsl(214_88%_52%)] transition-colors"
                >
                  Explore Atelier
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a href="#philosophy" className="text-sm font-semibold underline-offset-4 hover:underline">
                  Read our philosophy
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(15,30,60,0.35)] ring-1 ring-[hsl(220_15%_85%)]">
                <img src={iceberg} alt="Iceberg above and below water" width={1024} height={1280} className="w-full h-auto block" />
                <div className="absolute top-5 left-5 text-[11px] font-mono uppercase tracking-widest text-[hsl(220_45%_8%)] bg-[hsl(40_30%_96%_/_0.9)] backdrop-blur px-2.5 py-1 rounded">
                  10% visible
                </div>
                <div className="absolute bottom-5 left-5 text-[11px] font-mono uppercase tracking-widest text-[hsl(40_30%_96%)] bg-[hsl(220_45%_8%_/_0.6)] backdrop-blur px-2.5 py-1 rounded">
                  90% engineered
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* deep band */}
        <div className="relative bg-[hsl(220_55%_8%)] text-[hsl(40_30%_96%)] mt-16">
          <div className="container max-w-7xl py-20 md:py-28">
            <div className="grid md:grid-cols-4 gap-10">
              {[
                { k: "What you see", v: "A product that just works." },
                { k: "What you don't", v: "Automation pipelines, models, and recovery logic." },
                { k: "What we believe", v: "Depth is a craft, not a feature." },
                { k: "What we build", v: "Quiet infrastructure for loud outcomes." },
              ].map((c) => (
                <div key={c.k}>
                  <p className="text-xs font-mono uppercase tracking-widest text-[hsl(214_88%_70%)]">{c.k}</p>
                  <p className="mt-3 font-display text-2xl leading-snug">{c.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY — potential / lion shadow */}
      <section id="philosophy" className="container max-w-7xl py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="relative rounded-3xl overflow-hidden ring-1 ring-[hsl(220_15%_85%)] order-2 md:order-1">
            <img src={potential} alt="A cat casting a lion-shaped shadow" width={1024} height={1024} loading="lazy" className="w-full h-auto block" />
          </div>
          <div className="order-1 md:order-2">
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[hsl(220_25%_40%)]">
              <span className="h-px w-8 bg-[hsl(220_25%_40%)]" /> Philosophy
            </span>
            <h2 className="font-display text-[44px] md:text-[64px] leading-[1] tracking-tight mt-5">
              See the potential? <em className="italic">We do too.</em>
            </h2>
            <p className="mt-6 text-[17px] leading-relaxed text-[hsl(220_25%_28%)] max-w-lg">
              Most software shows you a cat and asks you to imagine a lion.
              We build the lighting, the angle and the wall — the systems that
              turn ordinary input into outsized outcome.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Automation that compounds instead of breaking.",
                "Interfaces calm enough to trust with real work.",
                "Models tuned for outcomes, not demos.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15px]">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[hsl(214_88%_52%)] shrink-0" />
                  <span className="text-[hsl(220_25%_20%)]">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="bg-[hsl(220_55%_8%)] text-[hsl(40_30%_96%)]">
        <div className="container max-w-7xl py-24 md:py-32">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[hsl(214_88%_70%)]">
                <span className="h-px w-8 bg-[hsl(214_88%_70%)]" /> Products
              </span>
              <h2 className="font-display text-[44px] md:text-[64px] leading-[1] tracking-tight mt-4">
                What we ship<em className="italic">.</em>
              </h2>
            </div>
            <p className="max-w-md text-[15px] text-[hsl(40_30%_80%)]">
              One product live today. More beneath the surface — quietly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/atelier"
              className="group md:col-span-2 relative rounded-3xl bg-gradient-to-br from-[hsl(214_88%_52%)] to-[hsl(220_88%_30%)] p-10 overflow-hidden ring-1 ring-white/10 hover:ring-white/30 transition-all"
            >
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-mono uppercase tracking-widest text-white/70">Live · 2025</span>
                <ArrowUpRight className="h-6 w-6 text-white/90 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              <h3 className="font-display text-[56px] leading-none mt-16">Atelier</h3>
              <p className="mt-4 max-w-md text-[15px] text-white/80">
                The AI-driven workspace for modern job search. A pod of
                recruiters, marketers and coaches — quietly applying on your
                behalf.
              </p>
              <div className="mt-10 inline-flex items-center gap-2 text-sm font-semibold border-b border-white/40 pb-0.5">
                Visit Atelier
              </div>
            </Link>

            <div className="relative rounded-3xl border border-white/15 p-10 flex flex-col justify-between min-h-[320px]">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[hsl(40_30%_70%)]">In the lab</span>
                <h3 className="font-display text-3xl mt-4">More beneath<br/>the surface.</h3>
              </div>
              <p className="text-sm text-[hsl(40_30%_70%)]">
                Tools for the workflows nobody else thinks about.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPANY / CTA */}
      <section id="company" className="container max-w-7xl py-24 md:py-32">
        <div className="rounded-3xl bg-[hsl(40_30%_92%)] ring-1 ring-[hsl(220_15%_85%)] p-10 md:p-16 grid md:grid-cols-[1.2fr_1fr] gap-10 items-end">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[hsl(220_25%_40%)]">
              <span className="h-px w-8 bg-[hsl(220_25%_40%)]" /> Company
            </span>
            <h2 className="font-display text-[44px] md:text-[64px] leading-[1] tracking-tight mt-4">
              Automation for <em className="italic">human</em> potential.
            </h2>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-[hsl(220_25%_28%)]">
              OCAS Software LLC builds intelligent automation for the parts of
              work that drain people. We do the diving so you can stay on the surface.
            </p>
          </div>
          <div className="flex md:justify-end gap-3 flex-wrap">
            <Link
              to="/atelier"
              className="inline-flex items-center gap-2 rounded-full bg-[hsl(220_45%_8%)] text-[hsl(40_30%_96%)] px-6 py-3.5 text-sm font-semibold hover:bg-[hsl(214_88%_52%)] transition-colors"
            >
              Try Atelier <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="mailto:hello@ocas.software"
              className="inline-flex items-center gap-2 rounded-full border border-[hsl(220_45%_8%)] px-6 py-3.5 text-sm font-semibold hover:bg-[hsl(220_45%_8%)] hover:text-[hsl(40_30%_96%)] transition-colors"
            >
              Contact us
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[hsl(220_15%_88%)]">
        <div className="container max-w-7xl py-10 flex items-center justify-between flex-wrap gap-4 text-sm text-[hsl(220_25%_40%)]">
          <div className="flex items-center gap-2.5">
            <span className="inline-block h-5 w-5 rotate-45 bg-gradient-to-br from-[hsl(214_88%_52%)] to-[hsl(220_45%_8%)] rounded-sm" />
            <span className="font-display text-lg text-[hsl(220_45%_8%)]">OCAS Software LLC</span>
          </div>
          <p>© {new Date().getFullYear()} — Built quietly, beneath the surface.</p>
        </div>
      </footer>
    </div>
  );
};

export default Ocas;