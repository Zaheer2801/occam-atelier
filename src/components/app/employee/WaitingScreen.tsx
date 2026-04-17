import { useEffect, useState } from "react";
import { Coffee, Quote, Lightbulb, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MEMES = [
  { emoji: "📬", title: "Inbox zero?", text: "More like inbox heroic effort. The recruiters who reply within 4 hours are the real MVPs." },
  { emoji: "🦄", title: "The mythical perfect candidate", text: "10 YOE in a 2-year-old framework, salary requirement: a coffee gift card." },
  { emoji: "🐛", title: "Hiring bug", text: "Job description says 'must be passionate'. Translation: must work weekends, smile about it." },
  { emoji: "📞", title: "The phone screen", text: "Recruiter: 'Tell me about yourself.' You: rehearses for 30 minutes, says 'I like coding.'" },
  { emoji: "🤖", title: "ATS energy", text: "Resume rejected because you wrote 'JavaScript' instead of 'Java Script'. Yes, really." },
  { emoji: "🎯", title: "The follow-up", text: "Sent 3 polite follow-ups. Got auto-reply #4. We persevere." },
  { emoji: "☕", title: "Coffee chat", text: "It's never just a coffee chat. It's a 5-round interview disguised as caffeine." },
  { emoji: "🪄", title: "Recruiter magic", text: "Pulled three perfect candidates out of a hat last quarter. The hat retired with full benefits." },
];

const FALLBACK_QUOTES = [
  { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
  { q: "Hire character. Train skill.", a: "Peter Schutz" },
  { q: "Great vision without great people is irrelevant.", a: "Jim Collins" },
  { q: "Talent wins games, but teamwork wins championships.", a: "Michael Jordan" },
  { q: "The secret of getting ahead is getting started.", a: "Mark Twain" },
];

const TIPS = [
  "Personalize the first sentence of every outreach. Templates die in the first 30 seconds.",
  "Pre-screen calls work best when you ask one open question and shut up for 3 minutes.",
  "Track candidate response rates by source. The truth is rarely where you expect it.",
  "Reject candidates fast and kindly. Speed is a feature, not a flaw.",
  "Reference checks reveal more in what's left unsaid than what's said.",
  "Set a weekly target and review it Friday. Without measurement, drift is guaranteed.",
  "Match the candidate's energy on calls. Mirroring builds trust faster than any script.",
  "Always close with a clear next step and a date. 'I'll be in touch' is the kiss of death.",
  "Salary first. Don't waste a great fit on a 30% gap you could've spotted in 60 seconds.",
  "Read the job description out loud before posting. If it bores you, it'll bore them.",
  "Top candidates are interviewing you. Bring real questions, not slides.",
  "When in doubt, share the actual day-to-day. Realism beats marketing every time.",
  "Track time-to-first-response. Anything over 24 hours bleeds your funnel.",
  "Document why you rejected each finalist. Future-you will thank present-you.",
  "Best recruiters write like humans. Lose the corporate adjectives.",
];

const tipOfTheDay = () => {
  const day = Math.floor(Date.now() / 86400000);
  return TIPS[day % TIPS.length];
};

const WaitingScreen = () => {
  const [quote, setQuote] = useState<{ q: string; a: string } | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);

  const fetchQuote = async () => {
    setLoadingQuote(true);
    try {
      const res = await fetch("https://zenquotes.io/api/random");
      if (!res.ok) throw new Error("api");
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.q) {
        setQuote({ q: data[0].q, a: data[0].a });
      } else {
        throw new Error("shape");
      }
    } catch {
      const f = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
      setQuote(f);
    } finally {
      setLoadingQuote(false);
    }
  };

  useEffect(() => { fetchQuote(); }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-3 py-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          Hang tight
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold">
          Your manager is matching you<br />with a client.
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          As soon as someone is assigned to you, this page transforms into your daily workspace.
          Until then, here's something to keep you sharp.
        </p>
      </div>

      <Tabs defaultValue="memes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="memes"><Coffee className="h-4 w-4 mr-2" />Memes</TabsTrigger>
          <TabsTrigger value="quotes"><Quote className="h-4 w-4 mr-2" />Quotes</TabsTrigger>
          <TabsTrigger value="tips"><Lightbulb className="h-4 w-4 mr-2" />Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="memes" className="mt-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {MEMES.map((m) => (
              <div
                key={m.title}
                className="rounded-2xl bg-card border border-border p-6 hover-lift"
              >
                <div className="text-4xl mb-3">{m.emoji}</div>
                <h3 className="font-display font-semibold text-lg mb-1">{m.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quotes" className="mt-6">
          <div className="rounded-2xl bg-card border border-border p-10 text-center space-y-6">
            <Quote className="h-10 w-10 mx-auto text-primary" />
            {quote ? (
              <>
                <p className="font-display text-2xl md:text-3xl leading-snug max-w-2xl mx-auto">
                  "{quote.q}"
                </p>
                <p className="text-muted-foreground">— {quote.a}</p>
              </>
            ) : (
              <p className="text-muted-foreground">Loading…</p>
            )}
            <Button onClick={fetchQuote} variant="outline" disabled={loadingQuote}>
              <RefreshCw className={`h-4 w-4 ${loadingQuote ? "animate-spin" : ""}`} />
              New quote
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="tips" className="mt-6 space-y-4">
          <div className="rounded-2xl gradient-primary text-primary-foreground p-8 shadow-glow">
            <div className="flex items-center gap-2 text-sm font-medium opacity-90 mb-2">
              <Lightbulb className="h-4 w-4" />
              Tip of the day
            </div>
            <p className="font-display text-2xl leading-snug">{tipOfTheDay()}</p>
          </div>
          <div className="rounded-2xl bg-card border border-border p-6">
            <h3 className="font-display font-semibold mb-4">More from the playbook</h3>
            <ul className="space-y-3">
              {TIPS.slice(0, 8).map((t) => (
                <li key={t} className="flex gap-3 text-sm">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="text-muted-foreground leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WaitingScreen;
