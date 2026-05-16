import { useState } from "react";
import { toast } from "sonner";
import { Mail, Send } from "lucide-react";

export const AtelierContact = () => {
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    setTimeout(() => {
      setLoading(false);
      toast.success("Thanks — we'll be in touch within 24 hours.");
      form.reset();
    }, 600);
  };

  return (
    <section id="contact" className="container max-w-7xl py-20 scroll-mt-20">
      <div className="grid md:grid-cols-[1fr_1.2fr] gap-10 items-start">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest px-2 py-1 rounded bg-[hsl(46_96%_58%)] text-[hsl(30_10%_10%)]">
            <Mail className="h-3.5 w-3.5" /> Contact
          </span>
          <h2 className="atelier-display atelier-display-lg mt-4">
            Let's talk.
          </h2>
          <p className="mt-4 max-w-md text-[hsl(30_10%_25%)]">
            Questions about pricing, onboarding, or how Atelier fits your job
            search? Send a note and a human from OCAS Software will reply
            within one business day.
          </p>
          <p className="mt-6 text-sm text-[hsl(30_10%_35%)]">
            Or email us directly at{" "}
            <a
              href="mailto:hello@ocassoftware.com"
              className="font-semibold text-[hsl(8_84%_55%)] underline-offset-4 hover:underline"
            >
              hello@ocassoftware.com
            </a>
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="atelier-card-cream p-6 md:p-8 space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-semibold text-[hsl(30_10%_15%)]">Name</span>
              <input
                required
                name="name"
                type="text"
                className="mt-1.5 w-full rounded-lg border border-[hsl(36_24%_80%)] bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-[hsl(8_84%_55%)]"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-[hsl(30_10%_15%)]">Email</span>
              <input
                required
                name="email"
                type="email"
                className="mt-1.5 w-full rounded-lg border border-[hsl(36_24%_80%)] bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-[hsl(8_84%_55%)]"
              />
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-semibold text-[hsl(30_10%_15%)]">Company (optional)</span>
            <input
              name="company"
              type="text"
              className="mt-1.5 w-full rounded-lg border border-[hsl(36_24%_80%)] bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-[hsl(8_84%_55%)]"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-[hsl(30_10%_15%)]">How can we help?</span>
            <textarea
              required
              name="message"
              rows={5}
              className="mt-1.5 w-full rounded-lg border border-[hsl(36_24%_80%)] bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-[hsl(8_84%_55%)] resize-none"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="atelier-cta-coral w-full justify-center disabled:opacity-60"
          >
            {loading ? "Sending…" : (<>Send message <Send className="h-4 w-4" /></>)}
          </button>
        </form>
      </div>
    </section>
  );
};