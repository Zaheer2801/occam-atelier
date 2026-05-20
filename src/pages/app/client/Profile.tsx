import { useEffect, useState } from "react";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const ClientProfile = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (data) {
        setFullName(data.full_name ?? "");
        setCompanyName(data.company_name ?? "");
        setPhone(data.phone ?? "");
        setLocation(data.location ?? "");
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
      phone: phone.slice(0, 30),
      location: location.slice(0, 100),
    }).eq("id", user.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile updated");
  };

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 10_000_000) { toast.error("Max 10MB"); return; }

    const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
    const path = `${user.id}/resume-${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage.from("resumes").upload(path, file, { upsert: true });
    if (upErr) { toast.error(upErr.message); return; }

    setResumeName(file.name);
    toast.success("Resume uploaded — extracting your info…");

    // Parse and auto-fill profile fields
    setParsing(true);
    setParsed(false);
    const { data, error: fnErr } = await supabase.functions.invoke("parse-resume", {
      body: { resumePath: path },
    });

    setParsing(false);

    if (fnErr || (data as { error?: string })?.error) {
      toast.error((data as { error?: string })?.error ?? fnErr?.message ?? "Extraction failed");
      return;
    }

    const p = (data as { parsed: { personal: { name: string; email: string; phone: string; location: string } } }).parsed;
    if (p?.personal) {
      if (p.personal.name) setFullName(p.personal.name);
      if (p.personal.phone) setPhone(p.personal.phone);
      if (p.personal.location) setLocation(p.personal.location);
    }
    setParsed(true);
    toast.success("Profile fields auto-filled from your resume. Review and save.");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account information.</p>
      </div>

      <form onSubmit={save} className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold">Personal details</h3>
          {parsed && (
            <span className="flex items-center gap-1.5 text-xs text-green-600">
              <CheckCircle2 className="h-3.5 w-3.5" /> Auto-filled from resume
            </span>
          )}
        </div>
        <div><Label htmlFor="email">Email</Label><Input id="email" value={user?.email ?? ""} disabled className="mt-1.5" /></div>
        <div><Label htmlFor="fn">Full name</Label><Input id="fn" value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={100} className="mt-1.5" /></div>
        <div><Label htmlFor="ph">Phone (optional)</Label><Input id="ph" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} className="mt-1.5" /></div>
        <div><Label htmlFor="loc">Location (optional)</Label><Input id="loc" value={location} onChange={(e) => setLocation(e.target.value)} maxLength={100} placeholder="City, Country" className="mt-1.5" /></div>
        <div><Label htmlFor="cn">Current company (optional)</Label><Input id="cn" value={companyName} onChange={(e) => setCompanyName(e.target.value)} maxLength={100} className="mt-1.5" /></div>
        <Button type="submit" disabled={saving} className="gradient-primary text-primary-foreground border-0">{saving ? "Saving…" : "Save changes"}</Button>
      </form>

      <div className="glass rounded-2xl p-6">
        <h3 className="font-display font-semibold mb-1">Resume</h3>
        <p className="text-sm text-muted-foreground mb-4">PDF or DOCX, max 10MB. Uploading will automatically extract and fill your profile fields.</p>
        {resumeName && !parsing && (
          <p className="text-sm mb-3">Current: <span className="font-medium">{resumeName}</span></p>
        )}
        {parsing ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Extracting information from resume…
          </div>
        ) : (
          <label className="inline-flex items-center gap-2 px-4 h-10 rounded-md border border-border cursor-pointer hover:bg-muted text-sm">
            <Upload className="h-4 w-4" /> {resumeName ? "Replace resume" : "Upload resume"}
            <input type="file" accept=".pdf,.docx,.doc" className="hidden" onChange={upload} />
          </label>
        )}
      </div>
    </div>
  );
};

export default ClientProfile;
