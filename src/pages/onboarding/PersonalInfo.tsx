import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const schema = z.object({
  full_name: z.string().trim().min(1, "Full name is required").max(100),
  phone: z.string().trim().min(5, "Phone is required").max(30),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  location: z.string().trim().min(1, "Location is required").max(120),
  contact_preference: z.enum(["email", "phone", "both"]),
});

const PersonalInfo = () => {
  const { user } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [defaults, setDefaults] = useState({
    full_name: "", phone: "", date_of_birth: "", location: "", contact_preference: "email" as "email"|"phone"|"both",
  });

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, phone, date_of_birth, location, contact_preference")
      .eq("id", user.id).maybeSingle()
      .then(({ data }) => {
        if (data) setDefaults({
          full_name: data.full_name ?? "",
          phone: data.phone ?? "",
          date_of_birth: data.date_of_birth ?? "",
          location: data.location ?? "",
          contact_preference: (data.contact_preference as "email"|"phone"|"both") ?? "email",
        });
      });
  }, [user]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const fd = new FormData(e.currentTarget);
    const data = {
      full_name: String(fd.get("full_name") || ""),
      phone: String(fd.get("phone") || ""),
      date_of_birth: String(fd.get("date_of_birth") || ""),
      location: String(fd.get("location") || ""),
      contact_preference: String(fd.get("contact_preference") || "email") as "email"|"phone"|"both",
    };
    const parsed = schema.safeParse(data);
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }

    setLoading(true);
    const { error } = await supabase.from("profiles").update({
      ...parsed.data, updated_at: new Date().toISOString(),
    }).eq("id", user.id);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    nav("/onboarding/resume-upload");
  };

  return (
    <OnboardingShell step={1} title="Tell us about yourself" subtitle="We'll use this to personalize your job search.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="full_name">Full name *</Label>
          <Input id="full_name" name="full_name" defaultValue={defaults.full_name} key={`name-${defaults.full_name}`} required maxLength={100} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input id="phone" name="phone" type="tel" defaultValue={defaults.phone} key={`p-${defaults.phone}`} required />
          </div>
          <div>
            <Label htmlFor="date_of_birth">Date of birth *</Label>
            <Input id="date_of_birth" name="date_of_birth" type="date" defaultValue={defaults.date_of_birth} key={`d-${defaults.date_of_birth}`} required />
          </div>
        </div>
        <div>
          <Label htmlFor="location">Location *</Label>
          <Input id="location" name="location" placeholder="City, Country" defaultValue={defaults.location} key={`l-${defaults.location}`} required maxLength={120} />
        </div>
        <div>
          <Label className="mb-2 block">Preferred contact *</Label>
          <RadioGroup name="contact_preference" defaultValue={defaults.contact_preference} key={`c-${defaults.contact_preference}`} className="grid grid-cols-3 gap-2">
            {(["email","phone","both"] as const).map(v => (
              <label key={v} className="flex items-center justify-center gap-2 border border-border rounded-lg p-3 cursor-pointer hover:border-primary capitalize text-sm">
                <RadioGroupItem value={v} /> {v}
              </label>
            ))}
          </RadioGroup>
        </div>
        <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground border-0">
          {loading ? "Saving…" : "Continue"}
        </Button>
      </form>
    </OnboardingShell>
  );
};

export default PersonalInfo;
