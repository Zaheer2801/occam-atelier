import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "./Logo";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { to: "/features", label: "Features" },
  { to: "/pricing", label: "Pricing" },
  { to: "/#how", label: "How it works" },
  { to: "/about", label: "About" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/70 backdrop-blur-xl border-b border-border/60" : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16">
        <Logo />
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors story-link"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Button onClick={() => navigate("/app/dashboard")} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow">
              Open dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/auth/signin")}>Sign in</Button>
              <Button onClick={() => navigate("/auth/signup")} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow">
                Apply Now
              </Button>
            </>
          )}
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Menu"><Menu /></Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <div className="flex flex-col gap-6 mt-8">
              {links.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-lg font-medium">
                  {l.label}
                </Link>
              ))}
              <div className="border-t border-border pt-6 flex flex-col gap-3">
                {user ? (
                  <Button onClick={() => { setOpen(false); navigate("/app/dashboard"); }} className="gradient-primary text-primary-foreground border-0">Open dashboard</Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => { setOpen(false); navigate("/auth/signin"); }}>Sign in</Button>
                    <Button onClick={() => { setOpen(false); navigate("/auth/signup"); }} className="gradient-primary text-primary-foreground border-0">Get started</Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
