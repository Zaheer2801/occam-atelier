import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { CorpShell } from "@/components/brand/CorpShell";
import { OcasLogo } from "@/components/brand/OcasLogo";
import { useCorpReveal } from "@/hooks/useCorpReveal";
import { toast } from "sonner";

interface Swatch {
  name: string;
  token: string;
  hsl: string;
  hex: string;
  description?: string;
}

const swatches: Swatch[] = [
  { name: "Corp Blue", token: "--corp-blue", hsl: "199 89% 48%", hex: "#0EA5E9", description: "Trust, technology" },
  { name: "Corp Purple", token: "--corp-purple", hsl: "258 90% 66%", hex: "#8B5CF6", description: "Innovation" },
  { name: "Corp Cyan", token: "--corp-cyan", hsl: "187 85% 53%", hex: "#22D3EE", description: "Accent / data" },
  { name: "Corp Pink", token: "--corp-pink", hsl: "330 81% 60%", hex: "#EC4899", description: "Highlight" },
];

const neutrals: Swatch[] = [
  { name: "Background", token: "--corp-bg", hsl: "240 10% 4%", hex: "#0A0A0F" },
  { name: "Surface", token: "--corp-surface", hsl: "240 8% 8%", hex: "#131318" },
  { name: "Surface 2", token: "--corp-surface-2", hsl: "240 8% 12%", hex: "#1C1C22" },
  { name: "Border", token: "--corp-border", hsl: "240 6% 18%", hex: "#2C2C33" },
  { name: "Text", token: "--corp-text", hsl: "0 0% 98%", hex: "#FAFAFA" },
  { name: "Text Muted", token: "--corp-text-muted", hsl: "240 5% 65%", hex: "#A3A3AD" },
];

const typeScale = [
  { label: "Display 7xl", className: "text-7xl font-display font-extrabold leading-[1.05]", note: "Hero headlines" },
  { label: "Display 5xl", className: "text-5xl font-display font-extrabold", note: "Section titles" },
  { label: "Heading 3xl", className: "text-3xl font-display font-bold", note: "Card titles" },
  { label: "Body lg", className: "text-lg", note: "Lead paragraphs" },
  { label: "Body base", className: "text-base", note: "Default text" },
  { label: "Mono sm", className: "text-sm font-mono", note: "Code, technical labels" },
];

const CopyButton = ({ value, label }: { value: string; label?: string }) => {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`${label ?? "Value"} copied`);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <button
      type="button"
      onClick={handle}
      className="inline-flex items-center gap-1.5 rounded-md border border-corp-border/70 bg-corp-surface/60 px-2 py-1 text-[11px] font-mono text-corp-muted hover:text-corp-text hover:border-corp-text/40 transition-colors"
      aria-label={`Copy ${label ?? value}`}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      <span>{copied ? "Copied" : value}</span>
    </button>
  );
};

const Section = ({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="container py-20 corp-reveal">
    <div className="mb-10">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-corp-cyan">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl md:text-5xl font-extrabold tracking-tight">{title}</h2>
    </div>
    {children}
  </section>
);

const Brand = () => {
  const ref = useCorpReveal();
  return (
    <CorpShell variant="section">
      <div ref={ref as React.RefObject<HTMLDivElement>}>
        {/* Hero */}
        <section className="container pt-16 pb-10 corp-reveal">
          <div className="corp-glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-corp-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-corp-cyan" />
            Brand System v1.0
          </div>
          <h1 className="mt-6 font-display text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
            <span className="block">The OCAS Software</span>
            <span className="block corp-text-sweep">design language.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-corp-muted">
            Tokens, typography, and component primitives that power every surface — from the corporate site to the OCAS Atelier dashboard.
          </p>
        </section>

        {/* Logo */}
        <Section id="logo" eyebrow="01 — Identity" title="Logo system">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { variant: "connected", label: "Connected nodes", desc: "Primary mark. Best for app icon and favicon." },
              { variant: "wordmark", label: "Ascending arrow", desc: "Use for marketing materials and headers." },
              { variant: "monogram", label: "Monogram badge", desc: "Avatars, social media, enterprise contexts." },
            ].map((v) => (
              <div key={v.variant} className="corp-card p-8 flex flex-col items-center text-center gap-5">
                <div className="h-32 flex items-center justify-center">
                  {/* @ts-expect-error variant string */}
                  <OcasLogo variant={v.variant} mode="color" size={88} animate showWordmark={false} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold">{v.label}</h3>
                  <p className="mt-1 text-sm text-corp-muted">{v.desc}</p>
                </div>
                <CopyButton value={`<OcasLogo variant="${v.variant}" />`} label="Snippet" />
              </div>
            ))}
          </div>

          {/* Mode previews */}
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl p-8 bg-corp-bg border border-corp-border flex items-center justify-center">
              <OcasLogo variant="connected" mode="color" size={42} />
            </div>
            <div className="rounded-2xl p-8 corp-gradient flex items-center justify-center">
              <OcasLogo variant="connected" mode="reversed" size={42} />
            </div>
            <div className="rounded-2xl p-8 bg-corp-surface border border-corp-border flex items-center justify-center text-corp-text">
              <OcasLogo variant="connected" mode="mono" size={42} />
            </div>
          </div>
        </Section>

        {/* Color */}
        <Section id="color" eyebrow="02 — Color" title="Palette & gradients">
          <div className="mb-8 corp-card p-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-corp-dim mb-4">Signature gradient</p>
            <div className="h-32 rounded-xl corp-gradient shadow-[0_24px_60px_-24px_hsl(var(--corp-purple)/0.6)]" />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <CopyButton value="linear-gradient(135deg, hsl(199 89% 48%) 0%, hsl(258 90% 66%) 100%)" label="CSS" />
              <CopyButton value="var(--corp-gradient)" label="Token" />
            </div>
          </div>

          <h3 className="font-display text-xl font-bold mb-4">Brand colors</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-12">
            {swatches.map((s) => (
              <div key={s.token} className="corp-card overflow-hidden">
                <div className="h-24" style={{ background: `hsl(${s.hsl})` }} />
                <div className="p-4 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <p className="font-display font-bold">{s.name}</p>
                    <p className="text-xs font-mono text-corp-dim">{s.hex}</p>
                  </div>
                  {s.description && <p className="text-xs text-corp-muted">{s.description}</p>}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    <CopyButton value={s.token} label="Token" />
                    <CopyButton value={s.hex} label="Hex" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h3 className="font-display text-xl font-bold mb-4">Neutrals</h3>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {neutrals.map((s) => (
              <div key={s.token} className="corp-card overflow-hidden">
                <div className="h-16" style={{ background: `hsl(${s.hsl})`, borderBottom: "1px solid hsl(var(--corp-border))" }} />
                <div className="p-3 space-y-1">
                  <p className="font-display text-sm font-bold">{s.name}</p>
                  <p className="text-[10px] font-mono text-corp-dim">{s.hex}</p>
                  <CopyButton value={s.token} label="Token" />
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Typography */}
        <Section id="typography" eyebrow="03 — Typography" title="Type scale">
          <div className="corp-card p-8 space-y-8">
            {typeScale.map((t) => (
              <div key={t.label} className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-corp-border/60 last:border-0 pb-6 last:pb-0">
                <div className={t.className + " text-corp-text"}>
                  OCAS Software
                </div>
                <div className="md:text-right">
                  <p className="text-xs font-mono text-corp-cyan">{t.label}</p>
                  <p className="text-xs text-corp-muted mt-1">{t.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="corp-card p-6">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-corp-dim mb-2">Display</p>
              <p className="font-display text-2xl font-extrabold">Space Grotesk</p>
              <p className="mt-1 text-xs text-corp-muted">Headlines, logo wordmark.</p>
            </div>
            <div className="corp-card p-6">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-corp-dim mb-2">Body</p>
              <p className="text-2xl font-semibold">Inter</p>
              <p className="mt-1 text-xs text-corp-muted">UI text, paragraphs, forms.</p>
            </div>
            <div className="corp-card p-6">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-corp-dim mb-2">Mono</p>
              <p className="font-mono text-2xl">JetBrains Mono</p>
              <p className="mt-1 text-xs text-corp-muted">Code, technical labels.</p>
            </div>
          </div>
        </Section>

        {/* Components */}
        <Section id="components" eyebrow="04 — Components" title="Primitives">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="corp-card p-8">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-corp-dim mb-5">Buttons</p>
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white corp-gradient shadow-[0_12px_36px_-10px_hsl(var(--corp-purple)/0.6)]">
                  Primary action
                </button>
                <button className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-corp-text border border-corp-border hover:border-corp-text/40 hover:bg-corp-surface/40 transition-colors">
                  Secondary
                </button>
                <button className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-corp-muted hover:text-corp-text transition-colors">
                  Ghost
                </button>
              </div>
            </div>

            <div className="corp-card p-8">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-corp-dim mb-5">Badges</p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-corp-border bg-corp-surface px-3 py-1 text-xs text-corp-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-corp-cyan" /> Beta
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white corp-gradient">
                  New
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-corp-border bg-corp-surface px-3 py-1 text-xs text-corp-text">
                  <span className="h-1.5 w-1.5 rounded-full bg-corp-purple" /> Premium
                </span>
              </div>
            </div>

            <div className="corp-card p-8">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-corp-dim mb-5">Glass card</p>
              <div className="corp-glass rounded-xl p-6">
                <p className="font-display text-lg font-bold">Frosted surface</p>
                <p className="mt-1 text-sm text-corp-muted">Use over the gradient mesh for floating UI.</p>
              </div>
            </div>

            <div className="corp-card p-8">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-corp-dim mb-5">Stat tile</p>
              <div className="rounded-xl border border-corp-border bg-corp-bg p-6">
                <p className="font-display text-4xl font-extrabold corp-text-gradient">98.4%</p>
                <p className="mt-1 text-sm text-corp-muted">Automation accuracy</p>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </CorpShell>
  );
};

export default Brand;
