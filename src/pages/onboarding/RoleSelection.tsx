import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Sparkles, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const RoleSelection = () => {
  const { user } = useAuth();
  const nav = useNavigate();
  const [suggested, setSuggested] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(true);
  const [locking, setLocking] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("suggested_roles, target_roles").eq("id", user.id).maybeSingle()
      .then(({ data }) => {
        setSuggested((data?.suggested_roles as string[]) ?? []);
        setSelected((data?.target_roles as string[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  const toggle = (r: string) => setSelected(s => s.includes(r) ? s.filter(x => x !== r) : s.length >= 5 ? s : [...s, r]);
  const addCustom = () => {
    const v = custom.trim();
    if (!v) return;
    if (selected.includes(v)) { setCustom(""); return; }
    if (selected.length >= 5) { toast.error("Max 5 roles"); return; }
    setSelected(s => [...s, v]); setCustom("");
  };

  const lock = async () => {
    if (!user) return;
    if (selected.length === 0) { toast.error("Pick at least one role"); return; }
    setLocking(true);
    const { error } = await supabase.from("profiles").update({
      target_roles: selected,
      status: "pending_assignment",
      updated_at: new Date().toISOString(),
    }).eq("id", user.id);
    setLocking(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile locked. Welcome aboard!");
    nav("/app/client/dashboard");
  };

  return (
    <OnboardingShell step={4} title="Pick your target roles" subtitle="Choose 1–5 roles. These get locked once submitted.">
      {loading ? <div className="py-10 text-center text-sm text-muted-foreground">Loading…</div> : (
        <div className="space-y-6">
          {suggested.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-primary" /> Suggested for you
              </div>
              <div className="flex flex-wrap gap-2">
                {suggested.map(r => {
                  const on = selected.includes(r);
                  return (
                    <button key={r} type="button" onClick={() => toggle(r)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        on ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"
                      }`}>{r}</button>
                  );
                })}
              </div>
            </section>
          )}

          <section>
            <div className="text-sm font-medium mb-3">Add custom roles</div>
            <div className="flex gap-2">
              <Input value={custom} onChange={e => setCustom(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }} placeholder="e.g. Staff Engineer" />
              <Button type="button" variant="outline" onClick={addCustom}>Add</Button>
            </div>
          </section>

          <section>
            <div className="text-sm font-medium mb-3">Selected ({selected.length}/5)</div>
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {selected.length === 0 && <span className="text-xs text-muted-foreground">None yet</span>}
              {selected.map(r => (
                <span key={r} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
                  {r}
                  <button type="button" onClick={() => toggle(r)} className="hover:text-destructive"><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
          </section>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => nav("/onboarding/resume-review")} disabled={locking}>Back</Button>
            <Button onClick={lock} disabled={locking || selected.length === 0} className="flex-1 gradient-primary text-primary-foreground border-0">
              <Lock className="h-4 w-4" /> {locking ? "Locking…" : "Lock roles & submit"}
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground">Once locked, your profile goes to a manager for assignment. You can't edit roles after this.</p>
        </div>
      )}
    </OnboardingShell>
  );
};

export default RoleSelection;
