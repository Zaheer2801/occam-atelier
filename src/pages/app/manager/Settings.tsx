import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ManagerSettings = () => {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (data) setFullName(data.full_name ?? "");
    })();
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: fullName.slice(0, 100) }).eq("id", user.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Saved");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Account and system configuration.</p>
      </div>

      <form onSubmit={save} className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-display font-semibold">Account</h3>
        <div><Label htmlFor="email">Email</Label><Input id="email" value={user?.email ?? ""} disabled /></div>
        <div><Label htmlFor="fn">Full name</Label><Input id="fn" value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={100} /></div>
        <Button type="submit" disabled={saving} className="gradient-primary text-primary-foreground border-0">{saving ? "Saving…" : "Save changes"}</Button>
      </form>

      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-display font-semibold">System</h3>
        <p className="text-sm text-muted-foreground">Email templates, audit logs, billing and feature flags will live here in a future release.</p>
      </div>

      <div className="glass rounded-2xl p-6">
        <Button variant="outline" onClick={async () => { await signOut(); nav("/"); }}>
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>
    </div>
  );
};

export default ManagerSettings;
