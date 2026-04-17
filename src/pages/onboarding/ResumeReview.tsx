import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { ParsedResume } from "@/lib/onboarding";

const empty: ParsedResume = {
  personal: { name: "", email: "", phone: "", summary: "" },
  skills: [],
  work_experience: [],
  education: [],
};

const ResumeReview = () => {
  const { user } = useAuth();
  const nav = useNavigate();
  const [data, setData] = useState<ParsedResume>(empty);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("parsed_resume").eq("id", user.id).maybeSingle()
      .then(({ data: row }) => {
        if (row?.parsed_resume) setData({ ...empty, ...(row.parsed_resume as unknown as ParsedResume) });
        setLoading(false);
      });
  }, [user]);

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s) return;
    if (data.skills.includes(s)) { setSkillInput(""); return; }
    setData(d => ({ ...d, skills: [...d.skills, s] }));
    setSkillInput("");
  };
  const removeSkill = (i: number) => setData(d => ({ ...d, skills: d.skills.filter((_, j) => j !== i) }));

  const addWork = () => setData(d => ({
    ...d,
    work_experience: [...d.work_experience, { company: "", title: "", start_date: "", end_date: "", description: "" }],
  }));
  const updWork = (i: number, key: keyof ParsedResume["work_experience"][number], v: string) =>
    setData(d => ({ ...d, work_experience: d.work_experience.map((w, j) => j === i ? { ...w, [key]: v } : w) }));
  const rmWork = (i: number) => setData(d => ({ ...d, work_experience: d.work_experience.filter((_, j) => j !== i) }));

  const addEdu = () => setData(d => ({
    ...d,
    education: [...d.education, { institution: "", degree: "", start_date: "", end_date: "" }],
  }));
  const updEdu = (i: number, key: keyof ParsedResume["education"][number], v: string) =>
    setData(d => ({ ...d, education: d.education.map((e, j) => j === i ? { ...e, [key]: v } : e) }));
  const rmEdu = (i: number) => setData(d => ({ ...d, education: d.education.filter((_, j) => j !== i) }));

  const save = async (advance: boolean) => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      parsed_resume: data as unknown as Record<string, unknown>,
      updated_at: new Date().toISOString(),
    }).eq("id", user.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    if (advance) nav("/onboarding/role-selection");
    else toast.success("Saved");
  };

  if (loading) return <OnboardingShell step={3} title="Review parsed resume"><div className="py-10 text-center text-sm text-muted-foreground">Loading…</div></OnboardingShell>;

  return (
    <OnboardingShell step={3} title="Review your details" subtitle="Double-check what we extracted. You can edit anything.">
      <div className="space-y-6">
        <section className="space-y-3">
          <h3 className="font-semibold">Personal</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Name</Label><Input value={data.personal.name} onChange={e => setData(d => ({ ...d, personal: { ...d.personal, name: e.target.value } }))} /></div>
            <div><Label>Email</Label><Input value={data.personal.email} onChange={e => setData(d => ({ ...d, personal: { ...d.personal, email: e.target.value } }))} /></div>
            <div><Label>Phone</Label><Input value={data.personal.phone} onChange={e => setData(d => ({ ...d, personal: { ...d.personal, phone: e.target.value } }))} /></div>
          </div>
          <div><Label>Summary</Label><Textarea rows={3} value={data.personal.summary ?? ""} onChange={e => setData(d => ({ ...d, personal: { ...d.personal, summary: e.target.value } }))} /></div>
        </section>

        <section className="space-y-3">
          <h3 className="font-semibold">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs border border-primary/20">
                {s}
                <button type="button" onClick={() => removeSkill(i)} className="hover:text-destructive"><X className="h-3 w-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} placeholder="Add a skill" />
            <Button type="button" variant="outline" onClick={addSkill}>Add</Button>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Work experience</h3>
            <Button type="button" size="sm" variant="outline" onClick={addWork}><Plus className="h-3 w-3" /> Add</Button>
          </div>
          {data.work_experience.map((w, i) => (
            <div key={i} className="border border-border rounded-lg p-3 space-y-2 relative">
              <button type="button" onClick={() => rmWork(i)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              <div className="grid sm:grid-cols-2 gap-2">
                <Input placeholder="Company" value={w.company} onChange={e => updWork(i, "company", e.target.value)} />
                <Input placeholder="Title" value={w.title} onChange={e => updWork(i, "title", e.target.value)} />
                <Input type="month" value={w.start_date} onChange={e => updWork(i, "start_date", e.target.value)} />
                <Input type="month" value={w.end_date ?? ""} onChange={e => updWork(i, "end_date", e.target.value)} placeholder="End (or blank if current)" />
              </div>
              <Textarea rows={2} placeholder="Description" value={w.description ?? ""} onChange={e => updWork(i, "description", e.target.value)} />
            </div>
          ))}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Education</h3>
            <Button type="button" size="sm" variant="outline" onClick={addEdu}><Plus className="h-3 w-3" /> Add</Button>
          </div>
          {data.education.map((ed, i) => (
            <div key={i} className="border border-border rounded-lg p-3 space-y-2 relative">
              <button type="button" onClick={() => rmEdu(i)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              <div className="grid sm:grid-cols-2 gap-2">
                <Input placeholder="Institution" value={ed.institution} onChange={e => updEdu(i, "institution", e.target.value)} />
                <Input placeholder="Degree" value={ed.degree} onChange={e => updEdu(i, "degree", e.target.value)} />
                <Input type="month" value={ed.start_date} onChange={e => updEdu(i, "start_date", e.target.value)} />
                <Input type="month" value={ed.end_date ?? ""} onChange={e => updEdu(i, "end_date", e.target.value)} />
              </div>
            </div>
          ))}
        </section>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => nav("/onboarding/resume-upload")} disabled={saving}>Back</Button>
          <Button variant="outline" onClick={() => save(false)} disabled={saving}>Save draft</Button>
          <Button onClick={() => save(true)} disabled={saving} className="flex-1 gradient-primary text-primary-foreground border-0">
            {saving ? "Saving…" : "Continue"}
          </Button>
        </div>
      </div>
    </OnboardingShell>
  );
};

export default ResumeReview;
