import { useEffect, useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/app/StatusBadge";
import { supabase } from "@/integrations/supabase/client";

const statuses = ["applied", "screening", "interview", "offer", "rejected", "withdrawn"] as const;

interface App { id: string; position: string; company: string; status: string; applied_date: string; client_id: string; }

const ManagerApplications = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [status, setStatus] = useState<string>("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("job_applications").select("*").order("applied_date", { ascending: false });
      setApps((data ?? []) as App[]);
    })();
  }, []);

  const filtered = useMemo(() => apps.filter((a) => {
    const s = status === "all" || a.status === status;
    const q2 = !q || a.company.toLowerCase().includes(q.toLowerCase()) || a.position.toLowerCase().includes(q.toLowerCase());
    return s && q2;
  }), [apps, status, q]);

  const exportCsv = () => {
    const header = "Position,Company,ClientID,Status,Date\n";
    const rows = filtered.map((a) => `"${a.position}","${a.company}",${a.client_id},${a.status},${a.applied_date}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "all-applications.csv"; link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">All applications</h1>
          <p className="text-muted-foreground mt-1">{apps.length} total · {filtered.length} shown</p>
        </div>
        <Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4" /> Export</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search company or position" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statuses.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground">No applications.</div>
        ) : (
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
              {filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.position}</TableCell>
                  <TableCell>{a.company}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{a.client_id.slice(0, 8)}…</TableCell>
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

export default ManagerApplications;
