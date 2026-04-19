import { Link } from "react-router-dom";

const cols = [
  {
    title: "Product",
    links: [
      { label: "Features", to: "/features" },
      { label: "Pricing", to: "/pricing" },
      { label: "Atelier", to: "/atelier" },
      { label: "Right Job", to: "/right-job" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Brand", to: "/brand" },
      { label: "Contact", to: "/contact" },
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

export const AppleFooter = () => (
  <footer className="bg-[hsl(var(--apple-surface-2))] border-t border-[hsl(var(--apple-line))] pt-20 pb-10 text-[13px] text-[hsl(var(--apple-muted))]">
    <div className="container max-w-6xl">
      <div className="grid gap-12 md:grid-cols-4">
        <div>
          <div className="font-semibold text-[hsl(var(--apple-ink))] flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[hsl(var(--apple-accent))]" />
            OCAS Software LLC
          </div>
          <p className="mt-3 leading-relaxed max-w-xs">
            The career platform, reimagined. Built by humans, accelerated by
            intelligent automation.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div className="font-semibold text-[hsl(var(--apple-ink))] mb-3 text-[12px] uppercase tracking-[0.14em]">
              {c.title}
            </div>
            <ul className="space-y-2.5">
              {c.links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="hover:text-[hsl(var(--apple-ink))] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-14 pt-6 apple-divider flex flex-wrap items-center justify-between gap-3 text-[12px]">
        <span>© {new Date().getFullYear()} OCAS Software LLC. All rights reserved.</span>
        <div className="flex items-center gap-5">
          <Link to="/contact" className="hover:text-[hsl(var(--apple-ink))] transition-colors">
            Privacy
          </Link>
          <Link to="/contact" className="hover:text-[hsl(var(--apple-ink))] transition-colors">
            Terms
          </Link>
          <span>Made with care.</span>
        </div>
      </div>
    </div>
  </footer>
);
