import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Pricing } from "@/components/marketing/Pricing";
import { Comparison } from "@/components/marketing/Comparison";
import { FAQ } from "@/components/marketing/FAQ";

const PricingPage = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 pt-24">
      <section className="container py-12 text-center">
        <h1 className="font-display text-4xl md:text-6xl font-bold">
          Pricing that <span className="text-gradient">scales with you</span>
        </h1>
        <p className="text-muted-foreground mt-5 max-w-2xl mx-auto">Start free. Upgrade when you're ready.</p>
      </section>
      <Pricing />
      <Comparison />
      <FAQ />
    </main>
    <Footer />
  </div>
);

export default PricingPage;
