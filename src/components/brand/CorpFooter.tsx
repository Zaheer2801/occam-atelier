import { Link } from "react-router-dom";
import { useState } from "react";
import { OcasLogo } from "@/components/brand/OcasLogo";
import { Linkedin, Twitter, Instagram, Youtube } from "lucide-react";
import { toast } from "sonner";

const cols = [
  {
    title: "Product",
    links: [
      { label: "Features", to: "/features" },
      { label: "Pricing", to: "/pricing" },
      { label: "Integrations", to: "/features#integrations" },
      { label: "Changelog", to: "/features" },
      { label: "Roadmap", to: "/features" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Blog", to: "/about" },
      { label: "Careers", to: "/about" },
      { label: "Press Kit", to: "/brand" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", to: "/contact" },
      { label: "Career Guides", to: "/about" },
      { label: "Webinars", to: "/about" },
      { label: "API Documentation", to: "/features" },
      { label: "System Status", to: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/contact" },
      { label: "Terms of Service", to: "/contact" },
      { label: "Cookie Policy", to: "/contact" },
      { label: "GDPR Compliance", to: "/contact" },
      { label: "Security", to: "/contact" },
    ],
  },
];

const socials = [
  { Icon: Linkedin, label: "LinkedIn" },
  { Icon: Twitter, label: "Twitter" },
  { Icon: Instagram, label: "Instagram" },
  { Icon: Youtube, label: "YouTube" },
];

export const CorpFooter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("You're on the list — thanks for subscribing!");
    setEmail("");
  };

  return (
    <footer className="relative border-t border-corp-border/60 mt-24">
      <div className="container py-16 grid gap-12 lg:grid-cols-12">
        {/* Brand + newsletter */}
        <div className="lg:col-span-4 space-y-5">
          <OcasLogo variant="connected" mode="color" size={36} />
          <p className="text-sm text-corp-muted max-w-sm">
            Operational Career Automation System.
            <br />
            Empowering careers through intelligent automation.
          </p>
          <div className="flex items-center gap-2">
            {socials.map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="h-9 w-9 grid place-items-center rounded-lg border border-corp-border text-corp-muted hover:text-corp-text hover:border-corp-text/40 transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          {/* Newsletter */}
          <div className="pt-4">
            <h4 className="text-sm font-semibold text-corp-text">Stay updated</h4>
            <p className="mt-1 text-xs text-corp-dim">
              Career tips, job-search strategies, and product updates.
            </p>
            <form onSubmit={handleSubscribe} className="mt-3 flex gap-2 max-w-sm">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 rounded-lg bg-corp-surface-2/60 border border-corp-border px-3 py-2 text-sm text-corp-text placeholder:text-corp-dim focus:outline-none focus:border-corp-purple/60"
              />
              <button
                type="submit"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white corp-gradient hover:-translate-y-0.5 transition-transform"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-2 text-[11px] text-corp-dim">No spam. Unsubscribe anytime.</p>
          </div>
        </div>

        {/* Link columns */}
        <div className="lg:col-span-8 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-xs uppercase tracking-[0.2em] text-corp-dim mb-4">{c.title}</h4>
              <ul className="space-y-2.5 text-sm text-corp-muted">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="hover:text-corp-text transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-corp-border/60">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-corp-dim font-mono">
            © {new Date().getFullYear()} OCAS Software LLC. All rights reserved.
          </p>
          <p className="text-xs text-corp-dim">
            Operational Career Automation System
          </p>
        </div>
      </div>
    </footer>
  );
};
