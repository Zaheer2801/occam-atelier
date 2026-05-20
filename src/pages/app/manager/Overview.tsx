import { useEffect, useState } from "react";
import { Users, UserCheck, Briefcase, TrendingUp, UserPlus, Key, FileBarChart, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/app/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface ActivityLog {
  id: string;
  action: string;
  created_at: string;
  user_id: string;
  metadata: Record<string, unknown> | null;
  actor_name?: string;
}

interface AlertItem { id: number; severity: "warn" | "info"; message: string; }

const timeAgo = (iso: string) => {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const readableAction = (action: string) =>
  action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const ManagerOverview = () => {
  const [stats, setStats] = useState({
    clients: 0, employees: 0, weeklyApps: 0, responseRate: 0,
    clientTrend: 0, empTrend: 0, appsTrend: 0, rateTrend: 0,
  });
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const now = new Date();
      const d7  = new Date(now); d7.setDate(now.getDate() - 7);
      const d14 = new Date(now); d14.setDate(now.getDate() - 14);
      const d30 = new Date(now); d30.setDate(now.getDate() - 30);
      const d60 = new Date(now); d60.setDate(now.getDate() - 60);

      const [
        clientsRes, newClients30dRes, prevClients30dRes,
        employeesRes, newEmp30dRes,
        weeklyRes, prevWeekRes,
        allAppsRes, currAppsRes, prevAppsRes,
        activityRes, pendingRes,
      ] = await Promise.all([
        supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "client"),
        supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "client").gte("created_at", d30.toISOString()),
        supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "client").gte("created_at", d60.toISOString()).lt("created_at", d30.toISOString()),
        supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "employee"),
        supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "employee").gte("created_at", d30.toISOString()),
        supabase.from("job_applications").select("id", { count: "exact", head: true }).gte("applied_date", d7.toISOString().slice(0, 10)),
        supabase.from("job_applications").select("id", { count: "exact", head: true }).gte("applied_date", d14.toISOString().slice(0, 10)).lt("applied_date", d7.toISOString().slice(0, 10)),
        supabase.from("job_applications").select("status"),
        supabase.from("job_applications").select("status").gte("applied_date", d30.toISOString().slice(0, 10)),
        supabase.from("job_applications").select("status").gte("applied_date", d60.toISOString().slice(0, 10)).lt("applied_date", d30.toISOString().slice(0, 10)),
        supabase.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(6),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("status", "pending_assignment"),
      ]);

      const pct = (curr: number, prev: number) =>
        prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / prev) * 100);

      const allApps  = (allAppsRes.data  ?? []) as { status: string }[];
      const currApps = (currAppsRes.data ?? []) as { status: string }[];
      const prevApps = (prevAppsRes.data ?? []) as { status: string }[];
      const successRate = (arr: { status: string }[]) =>
        arr.length ? Math.round((arr.filter((a) => ["interview", "offer"].includes(a.status)).length / arr.length) * 100) : 0;

      const responseRate = successRate(allApps);
      const currRate = successRate(currApps);
      const prevRate = successRate(prevApps);

      setStats({
        clients: clientsRes.count ?? 0,
        employees: employeesRes.count ?? 0,
        weeklyApps: weeklyRes.count ?? 0,
        responseRate,
        clientTrend: pct(newClients30dRes.count ?? 0, prevClients30dRes.count ?? 0),
        empTrend:    pct(newEmp30dRes.count ?? 0, (employeesRes.count ?? 0) - (newEmp30dRes.count ?? 0)),
        appsTrend:   pct(weeklyRes.count ?? 0, prevWeekRes.count ?? 0),
        rateTrend:   prevRate === 0 ? 0 : currRate - prevRate,
      });

      const rawActivity = (activityRes.data ?? []) as ActivityLog[];
      const actorIds = [...new Set(rawActivity.map((a) => a.user_id))];
      let actorMap: Record<string, string> = {};
      if (actorIds.length) {
        const { data: actorProfiles } = await supabase.from("profiles").select("id,full_name").in("id", actorIds);
        (actorProfiles ?? []).forEach((p) => { actorMap[p.id] = p.full_name ?? "User"; });
      }
      setActivity(rawActivity.map((a) => ({ ...a, actor_name: actorMap[a.user_id] ?? "System" })));

      const computed: AlertItem[] = [];
      const pending = pendingRes.count ?? 0;
      if (pending > 0) {
        computed.push({
          id: 1,
          severity: "warn",
          message: `${pending} client${pending !== 1 ? "s" : ""} awaiting recruiter assignment`,
        });
      }
      if (computed.length === 0) {
        computed.push({ id: 2, severity: "info", message: "No active alerts — platform is healthy." });
      }
      setAlerts(computed);
      setLoading(false);
    })();
  }, []);

  const kpis = [
    { label: "Total clients",    value: stats.clients,      icon: Users,      trend: stats.clientTrend },
    { label: "Active employees", value: stats.employees,    icon: UserCheck,  trend: stats.empTrend },
    { label: "Apps this week",   value: stats.weeklyApps,   icon: Briefcase,  trend: stats.appsTrend },
    { label: "Avg response rate",value: stats.responseRate, icon: TrendingUp, trend: stats.rateTrend, suffix: "%" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-secondary p-7 shadow-yellow">
        <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-primary/20" />
        <div className="absolute top-6 right-8 grid grid-cols-2 gap-1.5">
          {[0, 1, 2, 3].map((i) => <span key={i} className="block h-2 w-2 rounded-[2px] bg-primary" />)}
        </div>
        <h1 className="font-display text-4xl text-foreground relative">Operations overview</h1>
        <p className="text-foreground/75 mt-1 relative">Health of your placement platform at a glance.</p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-3xl" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => <StatCard key={k.label} {...k} />)}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl bg-card border border-border p-6 lg:col-span-2">
          <h2 className="font-display text-xl mb-4 text-foreground">Recent activity</h2>
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
            </div>
          ) : activity.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No activity logged yet.
            </div>
          ) : (
            <ul className="divide-y divide-border/40">
              {activity.map((a) => (
                <li key={a.id} className="py-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-2xl bg-primary shrink-0 flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {(a.actor_name ?? "?").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="font-medium text-foreground">{a.actor_name ?? "System"}</span>
                      {" "}<span className="text-muted-foreground">{readableAction(a.action)}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 ml-3">{timeAgo(a.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl bg-card border border-border p-6">
            <h3 className="font-display text-lg mb-4 text-foreground">Quick actions</h3>
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="justify-start rounded-full" asChild>
                <Link to="/app/manager/team"><UserPlus className="h-4 w-4 mr-1" /> Add employee</Link>
              </Button>
              <Button variant="outline" className="justify-start rounded-full" asChild>
                <Link to="/app/manager/clients"><Key className="h-4 w-4 mr-1" /> Generate access codes</Link>
              </Button>
              <Button variant="outline" className="justify-start rounded-full" asChild>
                <Link to="/app/manager/analytics"><FileBarChart className="h-4 w-4 mr-1" /> View analytics</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-3xl bg-card border border-border p-6">
            <h3 className="font-display text-lg mb-4 text-foreground">Alerts</h3>
            {loading ? (
              <div className="space-y-2">
                {[0, 1].map((i) => <Skeleton key={i} className="h-8 rounded-lg" />)}
              </div>
            ) : (
              <ul className="space-y-3">
                {alerts.map((a) => (
                  <li key={a.id} className="flex items-start gap-2 text-sm">
                    {a.severity === "warn"
                      ? <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-warning" />
                      : <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />}
                    <span className="text-muted-foreground">{a.message}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerOverview;
