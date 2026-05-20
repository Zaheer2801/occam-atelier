import { useEffect, useMemo, useState } from "react";
import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/app/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const statuses = ["applied", "screening", "interview", "offer", "rejected", "withdrawn"] as const;
const PAGE_SIZE = 25;

interface App { id: string; position: string; company: string; status: string; applied_date: string; client_id: string; source?: string | null; }
interface ClientOpt { id: string; name: string; }

const EmployeeApplications = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState<App[]>([]);
  const [clients, setClients] = useState<ClientOpt[]>([]);
  const [client, setClient] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!user) return;
    (async () => {
      // Only fetch apps for assigned clients
      const { data: assigns } = await supabase
        .from("employee_client_assignments")
        .select("client_id")
        .eq("employee_id", user.id)
        .eq("is_active", true);
      const ids = (assigns ?? []).map((a) => a.client_id);

      if (!ids.length) { setApps([]); setClients([]); return; }

      const [{ data: profs }, { data: appData }] = await Promise.all([
        supabase.from("profiles").select("id,full_name").in("id", ids),
        supabase.from("job_applications").select("*").in("client_id", ids).order("applied_date", { ascending: false }),
      ]);

      setClients((profs ?? []).map((p) => ({ id: p.id, name: p.full_name ?? p.id.slice(0, 8) })));
      setApps((appData ?? []) as App[]);
    })();
  }, [user]);

  const filtered = useMemo(() => apps.filter((a) => {
    const c = client === "all" || a.client_id === client;
    const s = status === "all" || a.status === status;
    const q2 = !q || a.company.toLowerCase().includes(q.toLowerCase()) || a.position.toLowerCase().includes(q.toLowerCase());
    return c && s && q2;
  }), [apps, client, status, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from("job_applications").update({ status: newStatus as any }).eq("id", id);
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
    toast.success("Status updated");
  };

  const exportCsv = () => {
    const header = "Position,Company,Client,Status,Date,Source\n";
    const clientName = (id: string) => clients.find((c) => c.id === id)?.name ?? id.slice(0, 8);
    const rows = filtered.map((a) => `"${a.position}","${a.company}","${clientName(a.client_id)}",${a.status},${a.applied_date},"${a.source ?? ""}"`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = "applications.csv"; link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Applications</h1>
          <p className="text-muted-foreground mt-1">Across {clients.length} assigned client{clients.length === 1 ? "" : "s"} · {filtered.length} shown</p>
        </div>
        <Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4" /> Export CSV</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search company or position" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        </div>
        <Select value={client} onValueChange={(v) => { setClient(v); setPage(1); }}>
          <SelectTrigger><SelectValue placeholder="Client" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All clients</SelectItem>
            {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statuses.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground">
            {clients.length === 0 ? "No clients assigned yet. A manager will assign clients to your account." : "No applications match your filters."}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.position}</TableCell>
                    <TableCell>{a.company}</TableCell>
                    <TableCell className="text-muted-foreground">{clients.find((c) => c.id === a.client_id)?.name ?? a.client_id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <Select value={a.status} onValueChange={(v) => updateStatus(a.id, v)}>
                        <SelectTrigger className="h-8 w-36 border-0 bg-transparent p-0 hover:bg-muted/50">
                          <StatusBadge status={a.status} />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{new Date(a.applied_date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border text-sm text-muted-foreground">
                <span>Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeApplications;
