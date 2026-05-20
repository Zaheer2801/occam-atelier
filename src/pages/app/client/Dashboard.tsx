import { useEffect, useState } from "react";
import { Briefcase, MessageSquare, Trophy, TrendingUp, Clock, CheckCircle2, ArrowUpRight, Sparkles, ExternalLink, Bell } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/app/StatCard";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { useClientStatus } from "@/hooks/useClientStatus";

interface App { id: string; position: string; company: string; status: string; applied_date: string; }

interface JobMatch {
  id: string; title: string; company_name: string; location: string;
  is_remote: boolean; salary_min: number | null; salary_max: number | null;
  fit_score: number; source_url: string; source: string;
}

interface Notification {
  id: string; type: string; priority: string; title: string; body: string; created_at: string; read_at: string | null;
}

interface Stats {
  total: number; interviews: number; offers: number; rate: number;
  totalTrend: number; interviewsTrend: number; offersTrend: number; rateTrend: number;
}

const PLAN_LIMIT: Record<string, number | null> = { scout: 10, pro: 50, elite: null };
const PLAN_LABEL: Record<string, string> = { scout: "Scout", pro: "Pro", elite: "Elite" };
const PLAN_COLOR: Record<string, string> = {
  scout: "bg-muted text-muted-foreground",
  pro:   "bg-blue-100 text-blue-800",
  elite: "bg-amber-100 text-amber-800",
};

const pct = (curr: number, prev: number) =>
  prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / prev) * 100);

const ClientDashboard = () => {
  const { user } = useAuth();
  const { status } = useClientStatus();
  const [apps, setApps] = useState<App[]>([]);
  const [totalApps, setTotalApps] = useState(0);
  const [tier, setTier] = useState<string>("scout");
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0, interviews: 0, offers: 0, rate: 0,
    totalTrend: 0, interviewsTrend: 0, offersTrend: 0, rateTrend: 0,
  });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: profileData }, { data: allData }] = await Promise.all([
        supabase.from("profiles").select("subscription_tier").eq("id", user.id).maybeSingle(),
        supabase.from("job_applications").select("*").eq("client_id", user.id).order("applied_date", { ascending: false }),
      ]);

      const planTier = (profileData as { subscription_tier?: string } | null)?.subscription_tier ?? "scout";
      setTier(planTier);

      const all = (allData ?? []) as App[];
      setTotalApps(all.length);

      const limit = PLAN_LIMIT[planTier] ?? null;
      const visible = limit !== null ? all.slice(0, limit) : all;

      setApps(visible.slice(0, 5));

      const now = new Date();
      const d30 = new Date(now); d30.setDate(d30.getDate() - 30);
      const d60 = new Date(now); d60.setDate(d60.getDate() - 60);
      const d30str = d30.toISOString().slice(0, 10);
      const d60str = d60.toISOString().slice(0, 10);

      const curr = visible.filter((a) => a.applied_date >= d30str);
      const prev = visible.filter((a) => a.applied_date >= d60str && a.applied_date < d30str);

      const isSuccess = (a: App) => ["interview", "offer"].includes(a.status);
      const isOffer   = (a: App) => a.status === "offer";

      const total      = visible.length;
      const interviews = visible.filter(isSuccess).length;
      const offers     = visible.filter(isOffer).length;
      const rate       = total ? Math.round((interviews / total) * 100) : 0;

      const currRate = curr.length ? Math.round((curr.filter(isSuccess).length / curr.length) * 100) : 0;
      const prevRate = prev.length ? Math.round((prev.filter(isSuccess).length / prev.length) * 100) : 0;

      setStats({
        total, interviews, offers, rate,
        totalTrend:      pct(curr.length,                   prev.length),
        interviewsTrend: pct(curr.filter(isSuccess).length, prev.filter(isSuccess).length),
        offersTrend:     pct(curr.filter(isOffer).length,   prev.filter(isOffer).length),
        rateTrend:       prevRate === 0 ? 0 : currRate - prevRate,
      });

      // Fetch job matches + notifications in parallel
      try {
        const [jobRes, notifRes] = await Promise.all([
          fetch(`${API}/api/jobs/feed?candidate_id=${user.id}&limit=5&min_score=0.6`),
          fetch(`${API}/api/jobs/notifications?candidate_id=${user.id}&limit=5&unread_only=true`),
        ]);
        if (jobRes.ok) {
          const jd = await jobRes.json();
          setJobMatches(jd.jobs || []);
        }
        if (notifRes.ok) {
          const nd = await notifRes.json();
          setNotifications(nd.notifications || []);
        }
      } catch { /* backend may be offline in dev */ }
    })();
  }, [user]);

  const name = user?.user_metadata?.full_name?.split(" ")[0] || "there";
  const isPending = status === "pending_assignment" || status === "roles_locked";
  const limit = PLAN_LIMIT[tier] ?? null;
  const isCapped = limit !== null && totalApps > limit;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {isPending && (
        <div className="relative overflow-hidden rounded-3xl bg-secondary p-7 shadow-yellow animate-fade-in">
          <div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-primary/20" />
          <div className="flex items-start gap-4 relative">
            <div className="h-12 w-12 rounded-2xl bg-card flex items-center justify-center shrink-0 shadow-elevated">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-xl text-foreground">We've received your profile 🎉</h2>
              <p className="text-sm text-foreground/75 mt-1 max-w-xl">
                A manager is reviewing your details and will assign a recruiter to you shortly. You'll get an email as soon as your specialist is ready.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-card text-foreground border border-foreground/10">
                <Clock className="h-3 w-3" /> Pending recruiter assignment
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display text-4xl text-foreground">Welcome back, {name} 👋</h1>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PLAN_COLOR[tier] ?? PLAN_COLOR.scout}`}>
              {PLAN_LABEL[tier] ?? tier} plan
            </span>
          </div>
          <p className="text-muted-foreground mt-1">Here's what's happening with your search.</p>
        </div>
        {!isPending && (
          <Button asChild variant="outline" className="rounded-full h-11 px-6">
            <Link to="/app/client/applications">View pipeline</Link>
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total applications" value={stats.total}       icon={Briefcase}     trend={stats.totalTrend} />
        <StatCard label="Interviews"         value={stats.interviews}   icon={MessageSquare} trend={stats.interviewsTrend} />
        <StatCard label="Offers"             value={stats.offers}       icon={Trophy}        trend={stats.offersTrend} />
        <StatCard label="Response rate"      value={stats.rate} suffix="%" icon={TrendingUp} trend={stats.rateTrend} />
      </div>

      {isCapped && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-amber-900">
              {totalApps - limit!} more application{totalApps - limit! !== 1 ? "s" : ""} are being managed by your recruiter.
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              You're on the <strong>{PLAN_LABEL[tier]}</strong> plan (shows {limit} applications). Upgrade to see your full pipeline.
            </p>
          </div>
          <Button size="sm" className="rounded-full shrink-0 gradient-primary text-primary-foreground border-0">
            <ArrowUpRight className="h-3.5 w-3.5 mr-1" /> Upgrade
          </Button>
        </div>
      )}

      <div className="rounded-3xl bg-card border border-border overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display text-xl text-foreground">Recent applications</h2>
          <Button variant="ghost" size="sm" asChild className="rounded-full"><Link to="/app/client/applications">View all</Link></Button>
        </div>
        {apps.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            Your applications will appear here once your recruiter starts submitting on your behalf.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apps.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.position}</TableCell>
                  <TableCell>{a.company}</TableCell>
                  <TableCell><StatusBadge status={a.status} /></TableCell>
                  <TableCell className="text-muted-foreground">{new Date(a.applied_date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Unread high-priority notifications */}
      {notifications.length > 0 && (
        <div className="rounded-3xl bg-card border border-border overflow-hidden">
          <div className="flex items-center gap-3 p-6 border-b border-border">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl text-foreground">Alerts</h2>
            <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
              {notifications.length}
            </span>
          </div>
          <ul className="divide-y divide-border">
            {notifications.map((n) => (
              <li key={n.id} className="px-6 py-4 flex items-start gap-3">
                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${n.priority === "high" ? "bg-green-500" : "bg-amber-400"}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  {n.body && <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>}
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(n.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Top job matches */}
      {jobMatches.length > 0 && (
        <div className="rounded-3xl bg-card border border-border overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl text-foreground">Top job matches</h2>
            </div>
            <span className="text-xs text-muted-foreground">Updated every 6 hours</span>
          </div>
          <ul className="divide-y divide-border">
            {jobMatches.map((j) => (
              <li key={j.id} className="px-6 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground truncate">{j.title}</p>
                    {j.is_remote && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium shrink-0">Remote</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {j.company_name} · {j.location || "Flexible"}
                    {j.salary_min ? ` · $${(j.salary_min / 1000).toFixed(0)}k+` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    j.fit_score >= 0.92 ? "bg-green-100 text-green-800" :
                    j.fit_score >= 0.75 ? "bg-amber-100 text-amber-800" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {Math.round(j.fit_score * 100)}% fit
                  </div>
                  {j.source_url && (
                    <a href={j.source_url} target="_blank" rel="noreferrer"
                       className="text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
