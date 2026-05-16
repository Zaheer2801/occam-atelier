import { AtelierNav } from "@/components/atelier/AtelierNav";
import { AtelierHero } from "@/components/atelier/AtelierHero";
import { AtelierFeatures } from "@/components/atelier/AtelierFeatures";
import { AtelierProof } from "@/components/atelier/AtelierProof";
import { AtelierPrinciples } from "@/components/atelier/AtelierPrinciples";
import { AtelierFounders } from "@/components/atelier/AtelierFounders";
import { AtelierHowItWorks } from "@/components/atelier/AtelierHowItWorks";
import { AtelierIceberg } from "@/components/atelier/AtelierIceberg";
import { AtelierCTA } from "@/components/atelier/AtelierCTA";
import { AtelierContact } from "@/components/atelier/AtelierContact";
import { AtelierFooter } from "@/components/atelier/AtelierFooter";

const Atelier = () => (
  <div className="atelier min-h-screen flex flex-col atelier-grid-bg">
    <AtelierNav />
    <main className="flex-1">
      <AtelierHero />
      <AtelierFeatures />
      <AtelierProof />
      <AtelierPrinciples />
      <AtelierFounders />
      <AtelierHowItWorks />
      <AtelierIceberg />
      <AtelierCTA />
      <AtelierContact />
    </main>
    <AtelierFooter />
  </div>
);

export default Atelier;
