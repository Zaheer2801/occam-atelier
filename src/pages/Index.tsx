import { useEffect } from "react";
import { CorpHeader } from "@/components/brand/CorpHeader";
import { CorpFooter } from "@/components/brand/CorpFooter";
import { CorpHero } from "@/components/brand/CorpHero";
import { CorpJourney } from "@/components/brand/CorpJourney";
import { CorpCTA } from "@/components/brand/CorpCTA";
import { useCorpReveal } from "@/hooks/useCorpReveal";

const Index = () => {
  const ref = useCorpReveal();

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.className;
    html.classList.remove("dark");
    return () => {
      html.className = prev;
    };
  }, []);

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="corporate min-h-screen flex flex-col">
      <CorpHeader />
      <main className="flex-1">
        <CorpHero />
        <CorpJourney />
        <CorpCTA />
      </main>
      <CorpFooter />
    </div>
  );
};

export default Index;
