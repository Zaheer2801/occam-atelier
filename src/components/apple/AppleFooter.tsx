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
  <footer className="bg-[hsl(var(--apple-surface-2))] pt-16 pb-10 text-[13px] text-[hsl(var(--apple-muted))]">
    <div className="container max-w-6xl">
      <div className="grid gap-10 md:grid-cols-4">
        <div>
          <div className="font-semibold text-[hsl(var(--apple-ink))]">OCAS Software LLC</div>
          <p className="mt-2 leading-relaxed">
            The career platform, reimagined.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div className="font-semibold text-[hsl(var(--apple-ink))] mb-3">{c.title}</div>
            <ul className="space-y-2">
              {c.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-[hsl(var(--apple-ink))] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 pt-6 apple-divider flex flex-wrap items-center justify-between gap-3">
        <span>© {new Date().getFullYear()} OCAS Software LLC. All rights reserved.</span>
        <span>Made with care.</span>
      </div>
    </div>
  </footer>
);
