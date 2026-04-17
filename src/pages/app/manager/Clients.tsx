import { useEffect, useState } from "react";
import { Key, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { RoleAvatar } from "@/components/app/RoleAvatar";
import jobseekerAvatar from "@/assets/avatar-jobseeker.png";

interface ProfileRow { id: string; full_name: string | null; company_name: string | null; created_at: string; }

const ManagerClients = () => {
  const [rows, setRows] = useState<ProfileRow[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("profiles").select("id, full_name, company_name, created_at").order("created_at", { ascending: false });
      setRows((data ?? []) as ProfileRow[]);
    })();
  }, []);

  const filtered = rows.filter((r) => !q || (r.full_name ?? "").toLowerCase().includes(q.toLowerCase()) || (r.company_name ?? "").toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-secondary p-7 shadow-yellow flex flex-wrap items-center justify-between gap-4">
        <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-primary/20" />
        <div className="relative">
          <h1 className="font-display text-4xl text-foreground">Clients</h1>
          <p className="text-foreground/75 mt-1">{rows.length} total</p>
        </div>
        <div className="flex gap-2 relative">
          <Button variant="outline" className="rounded-full"><Key className="h-4 w-4" /> Generate access code</Button>
          <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow"><UserPlus className="h-4 w-4" /> Onboard client</Button>
        </div>
      </div>

      <Input placeholder="Search by name or company" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-md rounded-full" />

      <div className="rounded-3xl bg-card border border-border p-6">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <img
              src={jobseekerAvatar}
              alt=""
              aria-hidden
              width={140}
              height={140}
              loading="lazy"
              className="mx-auto w-32 h-32 rounded-full object-cover bg-secondary shadow-elevated wobble"
            />
            <h3 className="font-display text-xl text-foreground mt-5">
              {rows.length === 0 ? "No clients onboarded yet" : "No clients match your search"}
            </h3>
            <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
              {rows.length === 0
                ? "Generate an access code and share it with your first jobseeker."
                : "Try a different name or company."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((r) => (
              <li key={r.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RoleAvatar role="jobseeker" size={44} />
                  <div>
                    <div className="font-medium text-foreground">{r.full_name ?? "Unnamed"}</div>
                    <div className="text-xs text-muted-foreground">{r.company_name ?? "—"}</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManagerClients;
