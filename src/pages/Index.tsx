import { useEffect } from "react";
import { CorpHeader } from "@/components/brand/CorpHeader";
import { CorpFooter } from "@/components/brand/CorpFooter";
import { CorpHero } from "@/components/brand/CorpHero";
import { CorpJourney } from "@/components/brand/CorpJourney";
import { CorpCapabilities } from "@/components/brand/CorpCapabilities";
import { CorpHowItWorks } from "@/components/brand/CorpHowItWorks";
import { CorpProblemSolution } from "@/components/brand/CorpProblemSolution";
import { CorpStats } from "@/components/brand/CorpStats";
import { CorpProducts } from "@/components/brand/CorpProducts";
import { CorpFAQ } from "@/components/brand/CorpFAQ";
import { CorpCTA } from "@/components/brand/CorpCTA";
import { useCorpReveal } from "@/hooks/useCorpReveal";

const Index = () => {
  const ref = useCorpReveal();

  useEffect(() => {
    document.documentElement.classList.add("corporate");
    return () => document.documentElement.classList.remove("corporate");
  }, []);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="corporate min-h-screen flex flex-col bg-corp-bg text-corp-text"
    >
      <CorpHeader />
      <main className="flex-1">
        <CorpHero />
        <CorpJourney />
        <CorpProblemSolution />
        <CorpCapabilities />
        <CorpHowItWorks />
        <CorpStats />
        <CorpProducts />
        <CorpFAQ />
        <CorpCTA />
      </main>
      <CorpFooter />
    </div>
  );
};

export default Index;
