import { useEffect, useState } from "react";
import { UserPlus, Copy, Check, X, Users } from "lucide-react";
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
  full_name: string | null; email?: string; clientCount: number;
}

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
                  <Button variant="outline" size="sm" className="rounded-full" onClick={() => { setManaged(r); setManageOpen(true); }}>Manage</Button>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage — {managed?.full_name ?? "Employee"}</DialogTitle>
            <DialogDescription>Employee details and capacity.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">User ID</span><span className="font-mono">{managed?.user_id.slice(0, 16)}…</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Joined</span><span>{managed ? new Date(managed.created_at).toLocaleDateString() : "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Active clients</span><span className="font-semibold">{managed?.clientCount ?? 0}</span></div>
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
