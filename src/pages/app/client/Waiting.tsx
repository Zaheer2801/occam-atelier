import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/marketing/Logo";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Waiting = () => {
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute inset-0 gradient-hero pointer-events-none" />
      <div className="relative max-w-xl w-full">
        <div className="flex justify-center mb-6"><Logo /></div>
        <div className="glass rounded-2xl p-8 shadow-elevated text-center animate-fade-in">
          <div className="h-16 w-16 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-9 w-9 text-success" />
          </div>
          <h1 className="font-display text-2xl font-bold">You're all set, {profile?.full_name?.split(" ")[0] || "there"}!</h1>
          <p className="text-sm text-muted-foreground mt-2">A manager will assign a marketing specialist to you shortly. You'll get an email when your dashboard goes live.</p>

          <div className="mt-6 inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-warning/10 text-warning border border-warning/20">
            <Clock className="h-3 w-3" /> Pending assignment
          </div>

          {profile && (
            <Accordion type="single" collapsible className="mt-6 text-left">
              <AccordionItem value="profile">
                <AccordionTrigger className="text-sm">Preview your locked profile</AccordionTrigger>
                <AccordionContent>
                  <dl className="text-sm space-y-2">
                    <div className="flex justify-between"><dt className="text-muted-foreground">Name</dt><dd>{profile.full_name}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted-foreground">Location</dt><dd>{profile.location || "—"}</dd></div>
                    <div>
                      <dt className="text-muted-foreground mb-1">Target roles</dt>
                      <dd className="flex flex-wrap gap-1.5">
                        {(profile.target_roles ?? []).map(r => (
                          <span key={r} className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">{r}</span>
                        ))}
                      </dd>
                    </div>
                  </dl>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          <Button variant="ghost" size="sm" onClick={async () => { await signOut(); nav("/"); }} className="mt-6">
            <LogOut className="h-3 w-3" /> Sign out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Waiting;
