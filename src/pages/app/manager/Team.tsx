import { useEffect, useState } from "react";
import { UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface EmployeeRow { id: string; user_id: string; manager_id: string | null; created_at: string; }

const ManagerTeam = () => {
  const [rows, setRows] = useState<EmployeeRow[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("employees").select("*").order("created_at", { ascending: false });
      setRows((data ?? []) as EmployeeRow[]);
    })();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Team</h1>
          <p className="text-muted-foreground mt-1">{rows.length} employee{rows.length === 1 ? "" : "s"}</p>
        </div>
        <Button className="gradient-primary text-primary-foreground border-0 shadow-glow"><UserPlus className="h-4 w-4" /> Add employee</Button>
      </div>

      <div className="glass rounded-2xl p-6">
        {rows.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>No employees yet. Invite your first marketer to get started.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
            {rows.map((r) => (
              <li key={r.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-xs font-semibold text-primary-foreground">EM</div>
                  <div>
                    <div className="font-mono text-xs text-muted-foreground">{r.user_id.slice(0, 8)}…</div>
                    <div className="text-xs text-muted-foreground">{r.manager_id ? "Assigned" : "Unassigned"}</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Manage</Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManagerTeam;
