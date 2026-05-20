import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))", "hsl(var(--muted-foreground))"];
const TOOLTIP_STYLE = { background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 };
const AXIS = { stroke: "hsl(var(--muted-foreground))", fontSize: 11 } as const;

interface App { status: string; applied_date: string; client_id: string; }

const EmptyChart = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center justify-center h-[240px] gap-2 text-muted-foreground">
    <BarChart2 className="h-8 w-8 opacity-30" />
    <p className="text-sm">No {label} data yet.</p>
  </div>
);

const ManagerAnalytics = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [clientNames, setClientNames] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("job_applications").select("status,applied_date,client_id");
      const all = (data ?? []) as App[];
      setApps(all);

      const ids = [...new Set(all.map((a) => a.client_id))];
      if (ids.length) {
        const { data: profiles } = await supabase.from("profiles").select("id,full_name").in("id", ids);
        const map: Record<string, string> = {};
        (profiles ?? []).forEach((p) => { map[p.id] = p.full_name ?? "Client"; });
        setClientNames(map);
      }
    })();
  }, []);

  const series = useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
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

  const byClient = useMemo(() => {
    const m: Record<string, number> = {};
    apps.forEach((a) => { m[a.client_id] = (m[a.client_id] ?? 0) + 1; });
    return Object.entries(m)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([id, count]) => ({ client: clientNames[id] ?? id.slice(0, 8), count }));
  }, [apps, clientNames]);

  const hasApps = apps.length > 0;
  const hasVolume = series.some((d) => d.apps > 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-bold">Business analytics</h1>
        <p className="text-muted-foreground mt-1">Platform-wide performance, last 30 days.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h3 className="font-display font-semibold mb-4">Applications volume</h3>
          {!hasVolume ? <EmptyChart label="volume" /> : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="gm1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" {...AXIS} />
                <YAxis {...AXIS} allowDecimals={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="apps" stroke="hsl(var(--primary))" fill="url(#gm1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-display font-semibold mb-4">Conversion funnel</h3>
          {!hasApps ? <EmptyChart label="conversion" /> : (
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
          <h3 className="font-display font-semibold mb-4">Top clients by volume</h3>
          {byClient.length === 0 ? <EmptyChart label="client" /> : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={byClient} layout="vertical">
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" {...AXIS} allowDecimals={false} />
                <YAxis type="category" dataKey="client" {...AXIS} width={90} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerAnalytics;
