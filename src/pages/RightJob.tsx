import { useEffect } from "react";
import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { Stats } from "@/components/marketing/Stats";
import { LogoCloud } from "@/components/marketing/LogoCloud";
import { Features } from "@/components/marketing/Features";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { CodeShowcase } from "@/components/marketing/CodeShowcase";
import { Comparison } from "@/components/marketing/Comparison";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Pricing } from "@/components/marketing/Pricing";
import { FAQ } from "@/components/marketing/FAQ";
import { CTA } from "@/components/marketing/CTA";
import { Footer } from "@/components/marketing/Footer";

/**
 * Right Job — original cream/yellow/coral landing page.
 * Preserved at /right-job after the homepage was rebranded to OCAS Software.
 */
const RightJob = () => {
  useEffect(() => {
    // Ensure the corporate dark scope from /, /brand, /atelier doesn't bleed in.
    const html = document.documentElement;
    html.classList.remove("corporate", "dark");
    document.title = "Right Job — Find work you love";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <LogoCloud />
        <Features />
        <HowItWorks />
        <CodeShowcase />
        <Comparison />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default RightJob;
