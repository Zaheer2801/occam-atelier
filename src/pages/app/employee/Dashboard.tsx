import { useEffect, useState } from "react";
import { Briefcase, Users, TrendingUp, Activity, Upload, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/app/StatCard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [clientCount, setClientCount] = useState(0);
  const [appCount, setAppCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: assigns } = await supabase
        .from("employee_client_assignments")
        .select("client_id")
        .eq("employee_id", user.id)
        .eq("is_active", true);
      setClientCount(assigns?.length ?? 0);
      const { count } = await supabase
        .from("job_applications")
        .select("*", { count: "exact", head: true });
      setAppCount(count ?? 0);
    })();
  }, [user]);

  const name = user?.user_metadata?.full_name?.split(" ")[0] || "there";

  // Mock activity until we wire activity_logs query
  const activity = [
    { id: 1, who: "You", what: "added 12 applications for Marcus L.", when: "2h ago" },
    { id: 2, who: "You", what: "moved Sarah K. to Interview stage at Stripe", when: "yesterday" },
    { id: 3, who: "You", what: "imported 38 applications from spreadsheet", when: "2 days ago" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Hi {name}, you're managing {clientCount} client{clientCount === 1 ? "" : "s"}.</h1>
          <p className="text-muted-foreground mt-1">Here's your assigned workload at a glance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/app/employee/applications"><Upload className="h-4 w-4" /> Import</Link>
          </Button>
          <Button asChild className="gradient-primary text-primary-foreground border-0 shadow-glow">
            <Link to="/app/employee/clients"><UserPlus className="h-4 w-4" /> View clients</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active clients" value={clientCount} icon={Users} trend={5} />
        <StatCard label="Applications visible" value={appCount} icon={Briefcase} trend={14} />
        <StatCard label="Avg response rate" value={32} suffix="%" icon={TrendingUp} trend={6} />
        <StatCard label="Actions this week" value={48} icon={Activity} trend={-3} />
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="font-display font-semibold text-lg mb-4">Recent activity</h2>
        <ul className="divide-y divide-border/40">
          {activity.map((a) => (
            <li key={a.id} className="py-3 flex items-center justify-between text-sm">
              <span><span className="font-medium">{a.who}</span> <span className="text-muted-foreground">{a.what}</span></span>
              <span className="text-xs text-muted-foreground">{a.when}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
