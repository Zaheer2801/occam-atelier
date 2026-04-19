import { useEffect } from "react";
import { AppleNav } from "@/components/apple/AppleNav";
import { AppleHero } from "@/components/apple/AppleHero";
import { AppleShowcase } from "@/components/apple/AppleShowcase";
import { AppleAtelierBanner } from "@/components/apple/AppleAtelierBanner";
import { AppleFeatures } from "@/components/apple/AppleFeatures";
import { AppleStats } from "@/components/apple/AppleStats";
import { AppleFAQ } from "@/components/apple/AppleFAQ";
import { AppleFooter } from "@/components/apple/AppleFooter";

const Index = () => {
  // Scope the Apple theme to the homepage only.
  // The corporate (dark) theme used by /atelier is unaffected because it
  // toggles its own `.corporate` class via CorpShell.
  useEffect(() => {
    document.documentElement.classList.add("apple");
    return () => document.documentElement.classList.remove("apple");
  }, []);

  return (
    <div className="apple min-h-screen flex flex-col bg-white">
      <AppleNav />
      <main className="flex-1">
        <AppleHero />
        <AppleAtelierBanner />
        <AppleShowcase />
        <AppleFeatures />
        <AppleStats />
        <AppleFAQ />
      </main>
      <AppleFooter />
    </div>
  );
};

export default Index;
