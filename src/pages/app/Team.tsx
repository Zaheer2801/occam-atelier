import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Row { id: string; user_id: string; manager_id: string | null; }

const Team = () => {
  const { roles, loading } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("employees").select("*");
      setRows((data ?? []) as Row[]);
    })();
  }, []);

  if (loading) return null;
  if (!roles.includes("manager")) return <Navigate to="/app/dashboard" replace />;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Team</h1>
        <p className="text-muted-foreground mt-1">{rows.length} employees</p>
      </div>
      <div className="glass rounded-2xl p-6">
        {rows.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>No team members yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
            {rows.map((r) => (
              <li key={r.id} className="py-3 flex items-center justify-between text-sm">
                <span className="font-mono text-xs text-muted-foreground">{r.user_id}</span>
                <span className="text-muted-foreground">{r.manager_id ? "Assigned" : "Unassigned"}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Team;
