import { useEffect, useState } from "react";
import { Briefcase, MessageSquare, Trophy, TrendingUp, Plus, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/app/StatCard";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { useClientStatus } from "@/hooks/useClientStatus";

interface App { id: string; position: string; company: string; status: string; applied_date: string; }

const ClientDashboard = () => {
  const { user } = useAuth();
  const { status } = useClientStatus();
  const [apps, setApps] = useState<App[]>([]);
  const [stats, setStats] = useState({ total: 0, interviews: 0, offers: 0, rate: 0 });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("job_applications")
        .select("*")
        .eq("client_id", user.id)
        .order("applied_date", { ascending: false });
      const all = (data ?? []) as App[];
      setApps(all.slice(0, 5));
      const total = all.length;
      const interviews = all.filter((a) => ["interview", "offer"].includes(a.status)).length;
      const offers = all.filter((a) => a.status === "offer").length;
      const rate = total ? Math.round((interviews / total) * 100) : 0;
      setStats({ total, interviews, offers, rate });
    })();
  }, [user]);

  const name = user?.user_metadata?.full_name?.split(" ")[0] || "there";
  const isPending = status === "pending_assignment" || status === "roles_locked";

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
          <h1 className="font-display text-4xl text-foreground">Welcome back, {name} 👋</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your search.</p>
        </div>
        {!isPending && (
          <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 shadow-glow">
            <Link to="/app/client/applications"><Plus className="h-4 w-4" /> New application</Link>
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total applications" value={stats.total} icon={Briefcase} trend={12} />
        <StatCard label="Interviews" value={stats.interviews} icon={MessageSquare} trend={8} />
        <StatCard label="Offers" value={stats.offers} icon={Trophy} trend={25} />
        <StatCard label="Response rate" value={stats.rate} suffix="%" icon={TrendingUp} trend={3} />
      </div>

      <div className="rounded-3xl bg-card border border-border overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display text-xl text-foreground">Recent applications</h2>
          <Button variant="ghost" size="sm" asChild className="rounded-full"><Link to="/app/client/applications">View all</Link></Button>
        </div>
        {apps.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No applications yet. <Link to="/app/client/applications" className="text-primary story-link">Add your first one</Link>
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
    </div>
  );
};

export default ClientDashboard;
