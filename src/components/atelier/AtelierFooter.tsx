import { Link } from "react-router-dom";

export const AtelierFooter = () => (
  <footer className="border-t border-[hsl(36_24%_86%)] bg-[hsl(44_56%_96%)]">
    <div className="container max-w-7xl py-10 grid gap-6 sm:grid-cols-[1.4fr_1fr] items-start text-sm text-[hsl(30_10%_35%)]">
      <div>
        <p>
          <span className="font-semibold text-[hsl(30_10%_10%)]">Atelier</span> — a product of OCAS Software LLC
        </p>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[hsl(30_10%_45%)]">
          Outsource · Connect · Apply · Succeed
        </p>
        <p className="mt-3 text-xs text-[hsl(30_10%_45%)]">India · USA · Canada</p>
        <p className="mt-3 text-xs text-[hsl(30_10%_45%)]">© 2022–2025 OCAS Software LLC · All rights reserved.</p>
      </div>
      <div className="flex sm:justify-end items-start gap-6">
        <Link to="/" className="hover:text-[hsl(8_84%_55%)]">OCAS Software</Link>
        <a href="#contact" className="hover:text-[hsl(8_84%_55%)]">Contact us</a>
      </div>
    </div>
  </footer>
);
