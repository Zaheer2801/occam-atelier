import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (data) {
        setFullName(data.full_name ?? "");
        setCompanyName(data.company_name ?? "");
      }
      const { data: files } = await supabase.storage.from("resumes").list(user.id);
      if (files?.[0]) setResumeName(files[0].name);
    })();
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: fullName.slice(0, 100),
      company_name: companyName.slice(0, 100),
    }).eq("id", user.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile updated");
  };

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5_000_000) { toast.error("Max 5MB"); return; }
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("resumes").upload(path, file, { upsert: true });
    if (error) { toast.error(error.message); return; }
    setResumeName(path.split("/").pop() ?? null);
    toast.success("Resume uploaded");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account information.</p>
      </div>

      <form onSubmit={save} className="glass rounded-2xl p-6 space-y-4">
        <div><Label htmlFor="email">Email</Label><Input id="email" value={user?.email ?? ""} disabled /></div>
        <div><Label htmlFor="fn">Full name</Label><Input id="fn" value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={100} /></div>
        <div><Label htmlFor="cn">Company (optional)</Label><Input id="cn" value={companyName} onChange={(e) => setCompanyName(e.target.value)} maxLength={100} /></div>
        <Button type="submit" disabled={saving} className="gradient-primary text-primary-foreground border-0">{saving ? "Saving…" : "Save changes"}</Button>
      </form>

      <div className="glass rounded-2xl p-6">
        <h3 className="font-display font-semibold mb-2">Resume</h3>
        <p className="text-sm text-muted-foreground mb-4">PDF or DOCX, max 5MB. Used for AI tailoring.</p>
        {resumeName && <p className="text-sm mb-3">Current: <span className="font-medium">{resumeName}</span></p>}
        <label className="inline-flex items-center gap-2 px-4 h-10 rounded-md border border-border cursor-pointer hover:bg-muted text-sm">
          <Upload className="h-4 w-4" /> Upload resume
          <input type="file" accept=".pdf,.docx,.doc" className="hidden" onChange={upload} />
        </label>
      </div>
    </div>
  );
};

export default Profile;
