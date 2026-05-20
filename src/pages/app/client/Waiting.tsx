import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useForceLightTheme } from "@/hooks/useTheme";
import { Logo } from "@/components/marketing/Logo";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import decorSpiral from "@/assets/decor-spiral.png";
import decorStack from "@/assets/decor-stack.png";

const Waiting = () => {
  useForceLightTheme();
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const [profile, setProfile] = useState<{ full_name?: string; target_roles?: string[]; location?: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, target_roles, location, status")
      .eq("id", user.id).maybeSingle()
      .then(({ data }) => {
        if (data?.status === "assigned") nav("/app/client/dashboard");
        else setProfile(data);
      });
  }, [user, nav]);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 bg-background">
      <div className="absolute inset-0 gradient-hero pointer-events-none" />
      <img src={decorSpiral} alt="" aria-hidden className="hidden sm:block absolute top-10 left-10 w-24 float-slow pointer-events-none select-none" />
      <img src={decorStack} alt="" aria-hidden className="hidden sm:block absolute bottom-10 right-10 w-20 float-fast pointer-events-none select-none" />
      <div className="relative max-w-xl w-full">
        <div className="flex justify-center mb-6"><Logo /></div>
        <div className="relative overflow-hidden rounded-[2rem] bg-secondary p-10 shadow-yellow text-center animate-fade-in">
          <div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-primary/20" />
          <div className="h-16 w-16 mx-auto rounded-2xl bg-card flex items-center justify-center mb-4 shadow-elevated relative">
            <CheckCircle2 className="h-9 w-9 text-primary" />
          </div>
          <h1 className="font-display text-3xl text-foreground relative">You're all set, {profile?.full_name?.split(" ")[0] || "there"}!</h1>
          <p className="text-sm text-foreground/75 mt-2 relative">A manager will assign a marketing specialist to you shortly. You'll get an email when your dashboard goes live.</p>

          <div className="mt-6 inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-card text-foreground border border-foreground/10 relative">
            <Clock className="h-3 w-3" /> Pending assignment
          </div>

          {profile && (
            <Accordion type="single" collapsible className="mt-6 text-left relative">
              <AccordionItem value="profile" className="border-foreground/10">
                <AccordionTrigger className="text-sm">Preview your locked profile</AccordionTrigger>
                <AccordionContent>
                  <dl className="text-sm space-y-2">
                    <div className="flex justify-between"><dt className="text-foreground/70">Name</dt><dd>{profile.full_name}</dd></div>
                    <div className="flex justify-between"><dt className="text-foreground/70">Location</dt><dd>{profile.location || "—"}</dd></div>
                    <div>
                      <dt className="text-foreground/70 mb-1">Target roles</dt>
                      <dd className="flex flex-wrap gap-1.5">
                        {(profile.target_roles ?? []).map(r => (
                          <span key={r} className="px-2 py-0.5 rounded-full text-xs bg-card text-foreground border border-foreground/10">{r}</span>
                        ))}
                      </dd>
                    </div>
                  </dl>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          <Button variant="ghost" size="sm" onClick={async () => { await signOut(); nav("/"); }} className="mt-6 rounded-full relative">
            <LogOut className="h-3 w-3" /> Sign out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Waiting;
