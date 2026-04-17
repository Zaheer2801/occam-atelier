import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Features } from "@/components/marketing/Features";
import { CodeShowcase } from "@/components/marketing/CodeShowcase";
import { CTA } from "@/components/marketing/CTA";

const FeaturesPage = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 pt-24">
      <section className="container py-16 text-center">
        <h1 className="font-display text-4xl md:text-6xl font-bold">
          Built for the <span className="text-gradient">modern job hunt</span>
        </h1>
        <p className="text-muted-foreground mt-5 max-w-2xl mx-auto">
          Every feature designed to compress months of searching into weeks.
        </p>
      </section>
      <Features />
      <CodeShowcase />
      <CTA />
    </main>
    <Footer />
  </div>
);

export default FeaturesPage;
