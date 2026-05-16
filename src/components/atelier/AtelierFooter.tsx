import { Link } from "react-router-dom";

export const AtelierFooter = () => (
  <footer className="border-t border-[hsl(36_24%_86%)] bg-[hsl(44_56%_96%)]">
    <div className="container max-w-7xl py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[hsl(30_10%_35%)]">
      <p>
        <span className="font-semibold text-[hsl(30_10%_10%)]">Atelier</span> — a product of OCAS Software LLC
      </p>
      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-[hsl(8_84%_55%)]">OCAS Software</Link>
        <Link to="/pricing" className="hover:text-[hsl(8_84%_55%)]">Pricing</Link>
        <Link to="/contact" className="hover:text-[hsl(8_84%_55%)]">Contact</Link>
      </div>
    </div>
  </footer>
);
