import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Hero } from "@/components/marketing/Hero";
import { LogoCloud } from "@/components/marketing/LogoCloud";
import { Features } from "@/components/marketing/Features";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { CodeShowcase } from "@/components/marketing/CodeShowcase";
import { Stats } from "@/components/marketing/Stats";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Pricing } from "@/components/marketing/Pricing";
import { Comparison } from "@/components/marketing/Comparison";
import { FAQ } from "@/components/marketing/FAQ";
import { CTA } from "@/components/marketing/CTA";

const Index = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <Hero />
      <LogoCloud />
      <Features />
      <HowItWorks />
      <CodeShowcase />
      <Stats />
      <Testimonials />
      <Pricing />
      <Comparison />
      <FAQ />
      <CTA />
    </main>
    <Footer />
  </div>
);

export default Index;
