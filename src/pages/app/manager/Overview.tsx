import { Users, UserCheck, Briefcase, TrendingUp, UserPlus, Key, FileBarChart, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/app/StatCard";

interface KPIStat { label: string; value: number; suffix?: string; icon: any; trend: number; }
interface ActivityItem { id: number; who: string; what: string; tag?: string; when: string; }
interface AlertItem { id: number; severity: "warn" | "info"; message: string; }

const kpis: KPIStat[] = [
  { label: "Total clients", value: 142, icon: Users, trend: 8 },
  { label: "Active employees", value: 12, icon: UserCheck, trend: 0 },
  { label: "Apps this week", value: 387, icon: Briefcase, trend: 14 },
  { label: "Avg response rate", value: 28, suffix: "%", icon: TrendingUp, trend: 4 },
];

const activity: ActivityItem[] = [
  { id: 1, who: "Sofia M.", what: "imported 42 applications", tag: "Marcus L.", when: "10m ago" },
  { id: 2, who: "System", what: "onboarded new client", tag: "Priya R.", when: "1h ago" },
  { id: 3, who: "Daniel K.", what: "moved 3 apps to Interview", tag: "James T.", when: "2h ago" },
  { id: 4, who: "Sofia M.", what: "generated 5 access codes", when: "yesterday" },
  { id: 5, who: "System", what: "weekly report exported", when: "yesterday" },
];

const alerts: AlertItem[] = [
  { id: 1, severity: "warn", message: "3 clients haven't logged in for 7 days" },
  { id: 2, severity: "info", message: "2 employees over capacity (>20 clients)" },
  { id: 3, severity: "warn", message: "5 access codes expire this week" },
];

const ManagerOverview = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-bold">Operations overview</h1>
        <p className="text-muted-foreground mt-1">Health of the OCAS Atelier platform at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => <StatCard key={k.label} {...k} />)}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h2 className="font-display font-semibold text-lg mb-4">Recent activity</h2>
          <ul className="divide-y divide-border/40">
            {activity.map((a) => (
              <li key={a.id} className="py-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-full gradient-primary shrink-0 flex items-center justify-center text-xs font-semibold text-primary-foreground">
                    {a.who.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0">
                    <span className="font-medium">{a.who}</span> <span className="text-muted-foreground">{a.what}</span>
                    {a.tag && <span className="ml-2 inline-flex text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">{a.tag}</span>}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-3">{a.when}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-5">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display font-semibold mb-4">Quick actions</h3>
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/app/manager/team"><UserPlus className="h-4 w-4" /> Add employee</Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/app/manager/clients"><Key className="h-4 w-4" /> Generate access codes</Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/app/manager/analytics"><FileBarChart className="h-4 w-4" /> Export report</Link>
              </Button>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-display font-semibold mb-4">Alerts</h3>
            <ul className="space-y-3">
              {alerts.map((a) => (
                <li key={a.id} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${a.severity === "warn" ? "text-warning" : "text-muted-foreground"}`} />
                  <span className="text-muted-foreground">{a.message}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerOverview;
