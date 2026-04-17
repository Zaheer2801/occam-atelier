import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ClientRow { id: string; name: string; company: string | null; }

const EmployeeClients = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<ClientRow[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: assigns } = await supabase
        .from("employee_client_assignments")
        .select("client_id")
        .eq("employee_id", user.id)
        .eq("is_active", true);
      const ids = (assigns ?? []).map((a) => a.client_id);
      if (!ids.length) return;
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, company_name")
        .in("id", ids);
      setRows((data ?? []).map((p) => ({ id: p.id, name: p.full_name ?? "Unnamed", company: p.company_name })));
    })();
  }, [user]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-bold">Your clients</h1>
        <p className="text-muted-foreground mt-1">{rows.length} active assignment{rows.length === 1 ? "" : "s"}</p>
      </div>
      <div className="glass rounded-2xl p-6">
        {rows.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>No clients assigned yet. A manager needs to assign clients to your account.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
            {rows.map((r) => (
              <li key={r.id} className="py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.name}</div>
                  {r.company && <div className="text-xs text-muted-foreground">{r.company}</div>}
                </div>
                <Link to="/app/employee/applications" className="text-sm story-link text-primary">View applications →</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EmployeeClients;
