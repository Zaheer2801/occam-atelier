import { Link } from "react-router-dom";

const cols = [
  {
    title: "Practices",
    links: [
      { label: "AI Lab", to: "/#ai-lab" },
      { label: "Academy", to: "/#academy" },
      { label: "Marketing", to: "/#marketing" },
      { label: "US Bridge", to: "/#us-bridge" },
    ],
  },
  {
    title: "Portals",
    links: [
      { label: "Atelier", to: "/atelier" },
      { label: "Right Job", to: "/right-job" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", to: "/auth/signin" },
      { label: "Create account", to: "/auth/signup" },
    ],
  },
];

export const OcasFooter = () => (
  <footer className="relative pt-24 pb-10 border-t border-white/5 bg-[hsl(var(--ocas-bg-2))]">
    <div className="absolute inset-0 ocas-grid-bg opacity-30 pointer-events-none" />
    <div className="container max-w-6xl relative">
      <div className="grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="font-semibold text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[hsl(var(--ocas-cyan))]" />
            OCAS Software LLC
          </div>
          <p className="mt-3 text-sm ocas-text-muted leading-relaxed max-w-xs">
            AI innovation and global careers — engineered since 2019,
            incorporated 2022.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div className="ocas-mono text-[10px] uppercase tracking-[0.18em] ocas-text-dim mb-3">
              {c.title}
            </div>
            <ul className="space-y-2.5">
              {c.links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm ocas-text-soft hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-14 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-[12px] ocas-text-muted">
        <span>
          © {new Date().getFullYear()} OCAS Software LLC · All rights reserved.
        </span>
        <div className="flex items-center gap-5">
          <span className="ocas-mono">v2026.1</span>
        </div>
      </div>
    </div>
  </footer>
);