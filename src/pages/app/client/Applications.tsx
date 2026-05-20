import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Download, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/app/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const statuses = ["applied", "screening", "interview", "offer", "rejected", "withdrawn"] as const;

const PLAN_LIMIT: Record<string, number | null> = { scout: 10, pro: 50, elite: null };
const PLAN_LABEL: Record<string, string> = { scout: "Scout", pro: "Pro", elite: "Elite" };

interface App { id: string; position: string; company: string; status: string; applied_date: string; source?: string | null; notes?: string | null; }

const ClientApplications = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState<App[]>([]);
  const [totalApps, setTotalApps] = useState(0);
  const [tier, setTier] = useState<string>("scout");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!user) return;
    const [{ data: profileData }, { data }] = await Promise.all([
      supabase.from("profiles").select("subscription_tier").eq("id", user.id).maybeSingle(),
      supabase.from("job_applications").select("*").eq("client_id", user.id).order("applied_date", { ascending: false }),
    ]);
    const planTier = (profileData as { subscription_tier?: string } | null)?.subscription_tier ?? "scout";
    setTier(planTier);
    const all = (data ?? []) as App[];
    setTotalApps(all.length);
    const limit = PLAN_LIMIT[planTier] ?? null;
    setApps(limit !== null ? all.slice(0, limit) : all);
  };
  useEffect(() => { load(); }, [user]);

  const filtered = apps.filter((a) => {
    const m = filter === "all" || a.status === filter;
    const s = !q || a.company.toLowerCase().includes(q.toLowerCase()) || a.position.toLowerCase().includes(q.toLowerCase());
    return m && s;
  });

  const remove = async (id: string) => {
    await supabase.from("job_applications").delete().eq("id", id);
    setApps((a) => a.filter((x) => x.id !== id));
    toast.success("Deleted");
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("job_applications").update({ status: status as any }).eq("id", id);
    setApps((a) => a.map((x) => (x.id === id ? { ...x, status } : x)));
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const fd = new FormData(e.currentTarget);
    const payload = {
      client_id: user.id,
      position: String(fd.get("position") || "").trim().slice(0, 200),
      company: String(fd.get("company") || "").trim().slice(0, 200),
      status: String(fd.get("status") || "applied") as any,
      source: String(fd.get("source") || "").slice(0, 100) || null,
      notes: String(fd.get("notes") || "").slice(0, 2000) || null,
      applied_date: String(fd.get("applied_date") || new Date().toISOString().slice(0, 10)),
    };
    if (!payload.position || !payload.company) { toast.error("Position and company required"); return; }
    setLoading(true);
    const { error } = await supabase.from("job_applications").insert(payload);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Application added");
    setOpen(false);
    load();
  };

  const exportCsv = () => {
    const header = "Position,Company,Status,Date,Source\n";
    const rows = filtered.map((a) => `"${a.position}","${a.company}",${a.status},${a.applied_date},"${a.source ?? ""}"`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "applications.csv"; link.click();
    URL.revokeObjectURL(url);
  };

  const limit = PLAN_LIMIT[tier] ?? null;
  const isCapped = limit !== null && totalApps > limit;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {isCapped && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-amber-900">
              {totalApps - limit} more application{totalApps - limit !== 1 ? "s" : ""} are being handled by your recruiter but aren't visible on your plan.
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              <strong>{PLAN_LABEL[tier]}</strong> plan shows {limit} applications. Upgrade to Pro (50) or Elite (unlimited).
            </p>
          </div>
          <Button size="sm" className="rounded-full shrink-0 gradient-primary text-primary-foreground border-0">
            <ArrowUpRight className="h-3.5 w-3.5 mr-1" /> Upgrade
          </Button>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Applications</h1>
          <p className="text-muted-foreground mt-1">
            {apps.length}{isCapped ? ` of ${totalApps}` : ""} total · {filtered.length} shown
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4" /> Export</Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground border-0 shadow-glow"><Plus className="h-4 w-4" /> Add</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New application</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="space-y-4">
                <div><Label htmlFor="position">Position</Label><Input id="position" name="position" required maxLength={200} /></div>
                <div><Label htmlFor="company">Company</Label><Input id="company" name="company" required maxLength={200} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue="applied">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {statuses.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label htmlFor="applied_date">Date</Label><Input id="applied_date" name="applied_date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} /></div>
                </div>
                <div><Label htmlFor="source">Source</Label><Input id="source" name="source" placeholder="LinkedIn, Indeed…" maxLength={100} /></div>
                <div><Label htmlFor="notes">Notes</Label><Textarea id="notes" name="notes" rows={3} maxLength={2000} /></div>
                <DialogFooter><Button type="submit" disabled={loading} className="gradient-primary text-primary-foreground border-0">{loading ? "Saving…" : "Save"}</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search company or position" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statuses.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground">No applications match your filters.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.position}</TableCell>
                  <TableCell>{a.company}</TableCell>
                  <TableCell>
                    <Select value={a.status} onValueChange={(v) => updateStatus(a.id, v)}>
                      <SelectTrigger className="h-8 w-32 border-0 bg-transparent p-0 hover:bg-muted/50">
                        <StatusBadge status={a.status} />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{new Date(a.applied_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => remove(a.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default ClientApplications;
