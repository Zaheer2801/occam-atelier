import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin } from "lucide-react";

export const Footer = () => (
  <footer className="border-t border-border/60 mt-24">
    <div className="container py-16 grid gap-12 md:grid-cols-5">
      <div className="md:col-span-2 space-y-4">
        <Logo />
        <p className="text-sm text-muted-foreground max-w-xs">
          Recruitment marketing automation for serious career changers. Built by OCAS Software LLC.
        </p>
        <div className="flex gap-3">
          {[Twitter, Linkedin, Github].map((I, i) => (
            <a key={i} href="#" className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
              <I className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Product</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/features" className="hover:text-foreground">Features</Link></li>
          <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
          <li><Link to="/#how" className="hover:text-foreground">How it works</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Company</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/about" className="hover:text-foreground">About</Link></li>
          <li><a href="#" className="hover:text-foreground">Contact</a></li>
          <li><a href="#" className="hover:text-foreground">Privacy</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Newsletter</h4>
        <p className="text-sm text-muted-foreground mb-3">Career tips, monthly.</p>
        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
          <Input type="email" placeholder="you@email.com" className="bg-background" />
          <Button type="submit" size="sm" className="gradient-primary text-primary-foreground border-0">Join</Button>
        </form>
      </div>
    </div>
    <div className="border-t border-border/60">
      <div className="container py-6 text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
        <span>© {new Date().getFullYear()} OCAS Software LLC. All rights reserved.</span>
        <span>Built with care.</span>
      </div>
    </div>
  </footer>
);
