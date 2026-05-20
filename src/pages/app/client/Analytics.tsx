import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))", "hsl(var(--muted-foreground))"];

const TOOLTIP_STYLE = { background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 };
const AXIS_PROPS = { stroke: "hsl(var(--muted-foreground))", fontSize: 11 } as const;

interface App { status: string; applied_date: string; company: string; }

const EmptyChart = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center justify-center h-[240px] gap-2 text-muted-foreground">
    <BarChart2 className="h-8 w-8 opacity-30" />
    <p className="text-sm">No {label} data yet.</p>
  </div>
);

const ClientAnalytics = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("job_applications")
        .select("status,applied_date,company")
        .eq("client_id", user.id);
      setApps((data ?? []) as App[]);
      setLoading(false);
    })();
  }, [user]);

  const series = useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      days[d.toISOString().slice(0, 10)] = 0;
    }
    apps.forEach((a) => { if (a.applied_date in days) days[a.applied_date]++; });
    return Object.entries(days).map(([d, n]) => ({ date: d.slice(5), apps: n }));
  }, [apps]);

  const byStatus = useMemo(() => {
    const m: Record<string, number> = {};
    apps.forEach((a) => { m[a.status] = (m[a.status] ?? 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [apps]);

  const topCompanies = useMemo(() => {
    const m: Record<string, number> = {};
    apps.forEach((a) => { m[a.company] = (m[a.company] ?? 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([company, count]) => ({ company, count }));
  }, [apps]);

  // Cumulative success rate per day — no random data
  const successOverTime = useMemo(() => {
    const days: { date: string; full: string }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const full = d.toISOString().slice(0, 10);
      days.push({ date: full.slice(5), full });
    }
    return days.map(({ date, full }) => {
      const upToDate = apps.filter((a) => a.applied_date <= full);
      const successful = upToDate.filter((a) => ["interview", "offer"].includes(a.status)).length;
      const total = upToDate.length;
      return { date, rate: total ? Math.round((successful / total) * 100) : 0 };
    });
  }, [apps]);

  const hasApps = apps.length > 0;
  const hasVolume = series.some((d) => d.apps > 0);

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <Skeleton className="h-9 w-40 mb-2" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-[300px] rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Insights from your last 14 days.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-display font-semibold mb-4">Applications over time</h3>
          {!hasVolume ? <EmptyChart label="application volume" /> : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" {...AXIS_PROPS} />
                <YAxis {...AXIS_PROPS} allowDecimals={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="apps" stroke="hsl(var(--primary))" fill="url(#g1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-display font-semibold mb-4">Status breakdown</h3>
          {!hasApps ? <EmptyChart label="status" /> : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-display font-semibold mb-4">Top companies</h3>
          {topCompanies.length === 0 ? <EmptyChart label="company" /> : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topCompanies} layout="vertical">
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" {...AXIS_PROPS} allowDecimals={false} />
                <YAxis type="category" dataKey="company" {...AXIS_PROPS} width={80} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-display font-semibold mb-4">
            Success rate
            <span className="ml-2 text-xs font-normal text-muted-foreground">(interviews + offers / total)</span>
          </h3>
          {!hasApps ? <EmptyChart label="success rate" /> : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={successOverTime}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" {...AXIS_PROPS} />
                <YAxis {...AXIS_PROPS} unit="%" domain={[0, 100]} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}%`, "Success rate"]} />
                <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientAnalytics;
