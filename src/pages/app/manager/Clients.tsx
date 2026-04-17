import { useEffect, useState } from "react";
import { Key, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground mt-1">{rows.length} total</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Key className="h-4 w-4" /> Generate access code</Button>
          <Button className="gradient-primary text-primary-foreground border-0 shadow-glow"><UserPlus className="h-4 w-4" /> Onboard client</Button>
        </div>
      </div>

      <Input placeholder="Search by name or company" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-md" />

      <div className="glass rounded-2xl p-6">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">No clients match.</div>
        ) : (
          <ul className="divide-y divide-border/40">
            {filtered.map((r) => (
              <li key={r.id} className="py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.full_name ?? "Unnamed"}</div>
                  <div className="text-xs text-muted-foreground">{r.company_name ?? "—"}</div>
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
