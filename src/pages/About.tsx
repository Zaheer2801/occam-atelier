import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

const team = [
  { n: "Anya Volkov", r: "Founder & CEO" },
  { n: "Marcus Hale", r: "Head of Engineering" },
  { n: "Sofia Lin", r: "Head of Product" },
  { n: "Daniel Okafor", r: "Head of AI" },
];

const About = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 pt-24">
      <section className="container py-16 text-center max-w-3xl mx-auto">
        <h1 className="font-display text-4xl md:text-6xl font-bold">
          Building the future of <span className="text-gradient">career mobility</span>
        </h1>
        <p className="text-muted-foreground mt-5 text-lg">
          OCAS Software LLC was founded on the belief that getting your next job shouldn't take months
          of soul-crushing repetition. We're a small team obsessed with making job seekers' lives better.
        </p>
      </section>

      <section className="container py-12">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">The team</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((p) => (
            <div key={p.n} className="glass rounded-2xl p-6 text-center hover-lift">
              <div className="h-20 w-20 rounded-full gradient-primary mx-auto flex items-center justify-center font-display font-bold text-primary-foreground text-xl">
                {p.n.split(" ").map((s) => s[0]).join("")}
              </div>
              <div className="mt-4 font-semibold">{p.n}</div>
              <div className="text-sm text-muted-foreground">{p.r}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default About;
