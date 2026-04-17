import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))", "hsl(var(--muted-foreground))"];

interface App { status: string; applied_date: string; client_id: string; source: string | null; }

const EmployeeAnalytics = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState<App[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("job_applications").select("status,applied_date,client_id,source");
      setApps((data ?? []) as App[]);
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

  const byClient = useMemo(() => {
    const m: Record<string, number> = {};
    apps.forEach((a) => { const k = a.client_id.slice(0, 8); m[k] = (m[k] ?? 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([client, count]) => ({ client, count }));
  }, [apps]);

  const bySource = useMemo(() => {
    const m: Record<string, number> = {};
    apps.forEach((a) => { const k = a.source ?? "Unknown"; m[k] = (m[k] ?? 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [apps]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-bold">Team analytics</h1>
        <p className="text-muted-foreground mt-1">Performance across your assigned clients.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-display font-semibold mb-4">Applications processed</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={series}>
              <defs>
                <linearGradient id="ge1" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Area type="monotone" dataKey="apps" stroke="hsl(var(--primary))" fill="url(#ge1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-display font-semibold mb-4">By source</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={bySource} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                {bySource.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h3 className="font-display font-semibold mb-4">Top clients by activity</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byClient} layout="vertical">
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
              <YAxis type="category" dataKey="client" stroke="hsl(var(--muted-foreground))" fontSize={11} width={100} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAnalytics;
