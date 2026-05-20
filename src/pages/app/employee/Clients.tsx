import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { RoleAvatar } from "@/components/app/RoleAvatar";
import jobseekerAvatar from "@/assets/avatar-jobseeker.png";

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
      <div className="relative overflow-hidden rounded-3xl bg-secondary p-7 shadow-yellow">
        <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-primary/20" />
        <h1 className="font-display text-4xl text-foreground relative">Your clients</h1>
        <p className="text-foreground/75 mt-1 relative">{rows.length} active assignment{rows.length === 1 ? "" : "s"}</p>
      </div>
      <div className="rounded-3xl bg-card border border-border p-6">
        {rows.length === 0 ? (
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
            <h3 className="font-display text-xl text-foreground mt-5">No clients assigned yet</h3>
            <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
              A manager needs to assign clients to your account before you can start working.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RoleAvatar role="jobseeker" size={44} />
                  <div>
                    <div className="font-medium text-foreground">{r.name}</div>
                    {r.company && <div className="text-xs text-muted-foreground">{r.company}</div>}
                  </div>
                </div>
                <Link to={`/app/employee/clients/${r.id}`} className="text-sm story-link text-primary">View applications →</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EmployeeClients;
