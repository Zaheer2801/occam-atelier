import { AtelierNav } from "@/components/atelier/AtelierNav";
import { AtelierHero } from "@/components/atelier/AtelierHero";
import { AtelierFeatures } from "@/components/atelier/AtelierFeatures";
import { AtelierHowItWorks } from "@/components/atelier/AtelierHowItWorks";
import { AtelierCTA } from "@/components/atelier/AtelierCTA";
import { AtelierContact } from "@/components/atelier/AtelierContact";
import { AtelierFooter } from "@/components/atelier/AtelierFooter";

const Atelier = () => (
  <div className="atelier min-h-screen flex flex-col atelier-grid-bg">
    <AtelierNav />
    <main className="flex-1">
      <AtelierHero />
      <AtelierFeatures />
      <AtelierHowItWorks />
      <AtelierCTA />
      <AtelierContact />
    </main>
    <AtelierFooter />
  </div>
);

export default Atelier;
