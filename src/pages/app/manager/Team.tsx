import { useEffect, useState } from "react";
import { UserPlus, Copy, Check, Users, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { RoleAvatar } from "@/components/app/RoleAvatar";
import { toast } from "sonner";

interface EmployeeRow {
  id: string; user_id: string; created_at: string;
  full_name: string | null; clientCount: number;
}

interface AssignedClient { client_id: string; full_name: string | null; }
interface AvailableClient { id: string; full_name: string | null; }

const genCode = () => {
  const n = Math.floor(Math.random() * 900) + 100;
  return `OCAS-EMP-${n}`;
};

const ManagerTeam = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<EmployeeRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Add employee dialog
  const [addOpen, setAddOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [maxUses, setMaxUses] = useState("1");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  // Manage dialog
  const [manageOpen, setManageOpen] = useState(false);
  const [managed, setManaged] = useState<EmployeeRow | null>(null);
  const [assignedClients, setAssignedClients] = useState<AssignedClient[]>([]);
  const [availableClients, setAvailableClients] = useState<AvailableClient[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data: empRows } = await supabase.from("employees").select("id,user_id,created_at").order("created_at", { ascending: false });
    if (!empRows?.length) { setRows([]); setLoading(false); return; }

    const userIds = empRows.map((e) => e.user_id);
    const { data: profiles } = await supabase.from("profiles").select("id,full_name").in("id", userIds);
    const { data: assigns } = await supabase.from("employee_client_assignments").select("employee_id").eq("is_active", true).in("employee_id", userIds);

    const countMap: Record<string, number> = {};
    (assigns ?? []).forEach((a) => { countMap[a.employee_id] = (countMap[a.employee_id] ?? 0) + 1; });

    setRows(empRows.map((e) => ({
      ...e,
      full_name: (profiles ?? []).find((p) => p.id === e.user_id)?.full_name ?? null,
      clientCount: countMap[e.user_id] ?? 0,
    })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openManage = async (emp: EmployeeRow) => {
    setManaged(emp);
    setSelectedClientId("");
    setManageOpen(true);
    await loadManageData(emp.user_id);
  };

  const loadManageData = async (employeeId: string) => {
    // Get all client user IDs
    const { data: roleRows } = await supabase.from("user_roles").select("user_id").eq("role", "client");
    const allClientIds = (roleRows ?? []).map((r) => r.user_id);

    // Get currently assigned client IDs for this employee
    const { data: existingAssigns } = await supabase
      .from("employee_client_assignments")
      .select("client_id")
      .eq("employee_id", employeeId)
      .eq("is_active", true);
    const assignedIds = new Set((existingAssigns ?? []).map((a) => a.client_id));

    // Fetch names for assigned clients
    if (assignedIds.size > 0) {
      const { data: assignedProfiles } = await supabase
        .from("profiles")
        .select("id,full_name")
        .in("id", [...assignedIds]);
      setAssignedClients((assignedProfiles ?? []).map((p) => ({ client_id: p.id, full_name: p.full_name })));
    } else {
      setAssignedClients([]);
    }

    // Available = all clients not yet assigned to this employee
    const unassignedIds = allClientIds.filter((id) => !assignedIds.has(id));
    if (unassignedIds.length > 0) {
      const { data: availableProfiles } = await supabase
        .from("profiles")
        .select("id,full_name")
        .in("id", unassignedIds);
      setAvailableClients((availableProfiles ?? []).map((p) => ({ id: p.id, full_name: p.full_name })));
    } else {
      setAvailableClients([]);
    }
  };

  const addAssignment = async () => {
    if (!managed || !selectedClientId) return;
    setAssignLoading(true);
    const { error } = await supabase
      .from("employee_client_assignments")
      .upsert({ employee_id: managed.user_id, client_id: selectedClientId, is_active: true }, { onConflict: "employee_id,client_id" });
    if (error) { toast.error(error.message); setAssignLoading(false); return; }

    // Also update profiles.assigned_employee_id
    await supabase.from("profiles").update({ assigned_employee_id: managed.user_id } as any).eq("id", selectedClientId);

    toast.success("Client assigned to " + (managed.full_name ?? "employee"));
    setSelectedClientId("");
    await loadManageData(managed.user_id);
    setAssignLoading(false);
    load(); // refresh counts
  };

  const removeAssignment = async (clientId: string) => {
    if (!managed) return;
    setRemoveLoading(clientId);
    await supabase
      .from("employee_client_assignments")
      .update({ is_active: false })
      .eq("employee_id", managed.user_id)
      .eq("client_id", clientId);
    toast.success("Assignment removed");
    await loadManageData(managed.user_id);
    setRemoveLoading(null);
    load();
  };

  const openAdd = () => {
    setGeneratedCode(genCode());
    setCopied(false);
    setMaxUses("1");
    setAddOpen(true);
  };

  const saveCode = async () => {
    if (!generatedCode) return;
    setSaving(true);
    const expires = new Date(); expires.setDate(expires.getDate() + 7);
    const { error } = await supabase.from("access_codes").insert({
      code: generatedCode,
      role: "employee" as any,
      max_uses: parseInt(maxUses) || 1,
      expires_at: expires.toISOString(),
      created_by: user?.id ?? null,
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Access code saved — share it with your new employee.");
    setAddOpen(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-secondary p-7 shadow-yellow flex flex-wrap items-center justify-between gap-4">
        <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-primary/20" />
        <div className="relative">
          <h1 className="font-display text-4xl text-foreground">Team</h1>
          <p className="text-foreground/75 mt-1">{rows.length} employee{rows.length === 1 ? "" : "s"}</p>
        </div>
        <Button onClick={openAdd} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow relative">
          <UserPlus className="h-4 w-4" /> Add employee
        </Button>
      </div>

      <div className="rounded-3xl bg-card border border-border p-6">
        {loading ? (
          <div className="py-8 text-center text-muted-foreground text-sm">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl text-foreground">No teammates yet</h3>
            <p className="text-muted-foreground mt-1 max-w-sm mx-auto">Generate an access code and share it with your first recruiter.</p>
            <Button onClick={openAdd} className="mt-5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow">
              <UserPlus className="h-4 w-4" /> Add first employee
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <RoleAvatar role="recruiter" size={44} />
                  <div className="min-w-0">
                    <div className="font-medium text-foreground truncate">{r.full_name ?? "Employee"}</div>
                    <div className="text-xs text-muted-foreground font-mono">{r.user_id.slice(0, 12)}…</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-center hidden sm:block">
                    <div className="font-display text-xl font-bold text-foreground">{r.clientCount}</div>
                    <div className="text-xs text-muted-foreground">clients</div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full" onClick={() => openManage(r)}>Manage</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add employee dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add employee</DialogTitle>
            <DialogDescription>Generate a one-time access code and share it with the new employee. They use it on sign-up.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Access code</Label>
              <div className="flex gap-2 mt-1.5">
                <Input value={generatedCode} readOnly className="font-mono tracking-widest" />
                <Button variant="outline" size="icon" onClick={copyCode}>
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label>Max uses</Label>
              <Select value={maxUses} onValueChange={setMaxUses}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["1","2","5","10"].map((v) => <SelectItem key={v} value={v}>{v} use{v !== "1" ? "s" : ""}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">Code expires in 7 days.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={saveCode} disabled={saving} className="gradient-primary text-primary-foreground border-0">
              {saving ? "Saving…" : "Save & share"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage employee dialog */}
      <Dialog open={manageOpen} onOpenChange={setManageOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage — {managed?.full_name ?? "Employee"}</DialogTitle>
            <DialogDescription>Assign candidates to this recruiter. They'll see only their assigned clients.</DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            {/* Assigned clients list */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Assigned clients ({assignedClients.length})
              </p>
              {assignedClients.length === 0 ? (
                <p className="text-sm text-muted-foreground italic py-2">No clients assigned yet. Add one below.</p>
              ) : (
                <ul className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                  {assignedClients.map((c) => (
                    <li key={c.client_id} className="flex items-center justify-between px-4 py-2.5 bg-card">
                      <span className="text-sm font-medium">{c.full_name ?? "Unnamed client"}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeAssignment(c.client_id)}
                        disabled={removeLoading === c.client_id}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Add new assignment */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Assign a client</p>
              {availableClients.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">All clients are already assigned to this employee.</p>
              ) : (
                <div className="flex gap-2">
                  <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a client…" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableClients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.full_name ?? c.id.slice(0, 8)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={addAssignment}
                    disabled={!selectedClientId || assignLoading}
                    className="rounded-full gradient-primary text-primary-foreground border-0"
                  >
                    <Plus className="h-4 w-4" />
                    {assignLoading ? "Assigning…" : "Assign"}
                  </Button>
                </div>
              )}
            </div>

            <div className="text-xs text-muted-foreground border-t border-border pt-3 flex justify-between">
              <span>Joined {managed ? new Date(managed.created_at).toLocaleDateString() : "—"}</span>
              <span className="font-mono">{managed?.user_id.slice(0, 16)}…</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setManageOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagerTeam;
