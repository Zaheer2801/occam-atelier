import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { RoleAvatar } from "@/components/app/RoleAvatar";
import recruiterAvatar from "@/assets/avatar-recruiter.png";

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
      <div className="relative overflow-hidden rounded-3xl bg-secondary p-7 shadow-yellow flex flex-wrap items-center justify-between gap-4">
        <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-primary/20" />
        <div className="relative">
          <h1 className="font-display text-4xl text-foreground">Team</h1>
          <p className="text-foreground/75 mt-1">{rows.length} employee{rows.length === 1 ? "" : "s"}</p>
        </div>
        <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow relative">
          <UserPlus className="h-4 w-4" /> Add employee
        </Button>
      </div>

      <div className="rounded-3xl bg-card border border-border p-6">
        {rows.length === 0 ? (
          <div className="py-12 text-center">
            <img
              src={recruiterAvatar}
              alt=""
              aria-hidden
              width={140}
              height={140}
              loading="lazy"
              className="mx-auto w-32 h-32 rounded-full object-cover bg-secondary shadow-elevated wobble"
            />
            <h3 className="font-display text-xl text-foreground mt-5">No teammates yet</h3>
            <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
              Invite your first marketer to start placing clients.
            </p>
            <Button className="mt-5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow">
              <UserPlus className="h-4 w-4" /> Invite teammate
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RoleAvatar role="recruiter" size={44} />
                  <div>
                    <div className="font-mono text-xs text-muted-foreground">{r.user_id.slice(0, 8)}…</div>
                    <div className="text-xs text-muted-foreground">{r.manager_id ? "Assigned" : "Unassigned"}</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="rounded-full">Manage</Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManagerTeam;
