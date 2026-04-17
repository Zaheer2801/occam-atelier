import { useEffect, useState } from "react";
import { UserCheck, Briefcase, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PendingClient {
  id: string;
  full_name: string | null;
  location: string | null;
  target_roles: string[];
  parsed_resume: any;
  created_at: string;
}

interface EmployeeOption {
  user_id: string;
  full_name: string | null;
}

const ManagerPendingClients = () => {
  const [clients, setClients] = useState<PendingClient[]>([]);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<PendingClient | null>(null);
  const [employeeId, setEmployeeId] = useState<string>("");
  const [assigning, setAssigning] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: clientRows }, { data: empRows }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, location, target_roles, parsed_resume, created_at")
        .eq("status", "pending_assignment")
        .order("created_at", { ascending: false }),
      supabase.from("employees").select("user_id"),
    ]);

    const empIds = (empRows ?? []).map((e) => e.user_id);
    let empProfiles: { id: string; full_name: string | null }[] = [];
    if (empIds.length) {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", empIds);
      empProfiles = data ?? [];
    }

    setClients((clientRows ?? []) as PendingClient[]);
    setEmployees(
      (empRows ?? []).map((e) => ({
        user_id: e.user_id,
        full_name: empProfiles.find((p) => p.id === e.user_id)?.full_name ?? null,
      }))
    );
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAssign = (c: PendingClient) => {
    setSelected(c);
    setEmployeeId("");
    setOpen(true);
  };

  const handleAssign = async () => {
    if (!selected || !employeeId) return;
    setAssigning(true);

    const { error: assignErr } = await supabase
      .from("employee_client_assignments")
      .insert({ client_id: selected.id, employee_id: employeeId, is_active: true });

    if (assignErr) {
      toast.error(assignErr.message);
      setAssigning(false);
      return;
    }

    const { error: profErr } = await supabase
      .from("profiles")
      .update({ status: "assigned", assigned_employee_id: employeeId })
      .eq("id", selected.id);

    if (profErr) {
      toast.error(profErr.message);
      setAssigning(false);
      return;
    }

    toast.success("Client assigned successfully");
    setOpen(false);
    setSelected(null);
    setAssigning(false);
    load();
  };

  const skillsOf = (c: PendingClient): string[] => {
    const s = c.parsed_resume?.skills;
    return Array.isArray(s) ? s.slice(0, 6) : [];
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Pending Assignments</h1>
          <p className="text-muted-foreground mt-1">
            {clients.length} client{clients.length === 1 ? "" : "s"} awaiting an employee
          </p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        {loading ? (
          <div className="py-16 text-center text-muted-foreground">
            <Loader2 className="h-6 w-6 mx-auto animate-spin" />
          </div>
        ) : clients.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <UserCheck className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>No clients pending assignment.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Target Roles</TableHead>
                <TableHead>Top Skills</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="font-medium">{c.full_name ?? "Unnamed"}</div>
                    <div className="text-xs text-muted-foreground">{c.location ?? "—"}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(c.target_roles ?? []).slice(0, 3).map((r) => (
                        <Badge key={r} variant="secondary" className="text-xs">{r}</Badge>
                      ))}
                      {(c.target_roles?.length ?? 0) > 3 && (
                        <span className="text-xs text-muted-foreground">+{c.target_roles.length - 3}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {skillsOf(c).map((s) => (
                        <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(c.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => openAssign(c)}
                      className="gradient-primary text-primary-foreground border-0"
                    >
                      <Briefcase className="h-4 w-4" /> Assign
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Employee</DialogTitle>
            <DialogDescription>
              Pick an employee to take ownership of {selected?.full_name ?? "this client"}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-sm font-medium">Employee</label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee…" />
              </SelectTrigger>
              <SelectContent>
                {employees.length === 0 ? (
                  <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                    No employees available
                  </div>
                ) : (
                  employees.map((e) => (
                    <SelectItem key={e.user_id} value={e.user_id}>
                      {e.full_name ?? e.user_id.slice(0, 8) + "…"}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={assigning}>
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!employeeId || assigning}
              className="gradient-primary text-primary-foreground border-0"
            >
              {assigning && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirm assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagerPendingClients;
