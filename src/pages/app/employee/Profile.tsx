import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const EmployeeProfile = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (data) {
        setFullName(data.full_name ?? "");
        setPhone(data.phone ?? "");
        setLocation(data.location ?? "");
      }
    })();
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: fullName.slice(0, 100),
      phone: phone.slice(0, 30),
      location: location.slice(0, 100),
    }).eq("id", user.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile updated");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">Your employee account.</p>
      </div>
      <form onSubmit={save} className="glass rounded-2xl p-6 space-y-4">
        <div><Label htmlFor="email">Email</Label><Input id="email" value={user?.email ?? ""} disabled /></div>
        <div><Label htmlFor="fn">Full name</Label><Input id="fn" value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={100} /></div>
        <div><Label htmlFor="ph">Phone (optional)</Label><Input id="ph" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} /></div>
        <div><Label htmlFor="loc">Location (optional)</Label><Input id="loc" value={location} onChange={(e) => setLocation(e.target.value)} maxLength={100} placeholder="City, Country" /></div>
        <Button type="submit" disabled={saving} className="gradient-primary text-primary-foreground border-0">{saving ? "Saving…" : "Save changes"}</Button>
      </form>
    </div>
  );
};

export default EmployeeProfile;
