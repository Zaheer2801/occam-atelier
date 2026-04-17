import { useEffect, useState } from "react";
import { Briefcase, Users, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import WaitingScreen from "@/components/app/employee/WaitingScreen";

interface AssignedClient {
  id: string;
  name: string;
  company: string | null;
  targetRoles: string[];
  appCount: number;
}

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<AssignedClient[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const { data: assigns } = await supabase
        .from("employee_client_assignments")
        .select("client_id")
        .eq("employee_id", user.id)
        .eq("is_active", true);

      const ids = (assigns ?? []).map((a) => a.client_id);
      if (!ids.length) {
        setClients([]);
        setLoading(false);
        return;
      }

      const [{ data: profiles }, { data: apps }] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, company_name, target_roles")
          .in("id", ids),
        supabase
          .from("job_applications")
          .select("client_id")
          .in("client_id", ids),
      ]);

      const counts = new Map<string, number>();
      (apps ?? []).forEach((a) => counts.set(a.client_id, (counts.get(a.client_id) ?? 0) + 1));

      setClients(
        (profiles ?? []).map((p) => ({
          id: p.id,
          name: p.full_name ?? "Unnamed",
          company: p.company_name,
          targetRoles: p.target_roles ?? [],
          appCount: counts.get(p.id) ?? 0,
        }))
      );
      setLoading(false);
    })();
  }, [user]);

  if (loading) {
    return (
      <div className="py-32 text-center text-muted-foreground">
        <Loader2 className="h-6 w-6 mx-auto animate-spin" />
      </div>
    );
  }

  if (clients.length === 0) {
    return <WaitingScreen />;
  }

  const name = user?.user_metadata?.full_name?.split(" ")[0] || "there";
  const totalApps = clients.reduce((s, c) => s + c.appCount, 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold">
          Hi {name}, you're managing {clients.length} client{clients.length === 1 ? "" : "s"}.
        </h1>
        <p className="text-muted-foreground mt-1">
          {totalApps} application{totalApps === 1 ? "" : "s"} in flight across your roster.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {clients.map((c) => (
          <Link
            key={c.id}
            to={`/app/employee/clients/${c.id}`}
            className="group rounded-2xl bg-card border border-border p-6 hover-lift block"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-primary" />
                  <h3 className="font-display font-semibold text-lg truncate">{c.name}</h3>
                </div>
                {c.company && <p className="text-sm text-muted-foreground truncate">{c.company}</p>}
                <div className="flex flex-wrap gap-1 mt-3">
                  {c.targetRoles.slice(0, 3).map((r) => (
                    <span
                      key={r}
                      className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                    >
                      {r}
                    </span>
                  ))}
                  {c.targetRoles.length === 0 && (
                    <span className="text-xs text-muted-foreground italic">No target roles set</span>
                  )}
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <div className="flex items-center gap-2 mt-5 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              {c.appCount} application{c.appCount === 1 ? "" : "s"}
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center">
        <Button variant="outline" asChild>
          <Link to="/app/employee/applications">View all applications</Link>
        </Button>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
