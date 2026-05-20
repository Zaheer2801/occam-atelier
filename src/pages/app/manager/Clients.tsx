import { useEffect, useState } from "react";
import { Key, UserPlus, Copy, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { RoleAvatar } from "@/components/app/RoleAvatar";
import { toast } from "sonner";

interface ClientRow {
  id: string; full_name: string | null; company_name: string | null;
  status: string; created_at: string; assignedEmployee: string | null;
}

const STATUS_LABEL: Record<string, string> = {
  pending_code: "Pending code", onboarding: "Onboarding", resume_review: "Resume review",
  roles_locked: "Roles locked", pending_assignment: "Pending assignment",
  assigned: "Assigned", inactive: "Inactive",
};
const STATUS_COLOR: Record<string, string> = {
  assigned: "bg-green-100 text-green-800",
  pending_assignment: "bg-yellow-100 text-yellow-800",
  onboarding: "bg-blue-100 text-blue-800",
  resume_review: "bg-blue-100 text-blue-800",
  inactive: "bg-gray-100 text-gray-600",
  pending_code: "bg-gray-100 text-gray-600",
  roles_locked: "bg-orange-100 text-orange-800",
};

const genCode = () => `OCAS-CAN-${Math.floor(Math.random() * 900) + 100}`;

const ManagerClients = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<ClientRow[]>([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Access code dialog
  const [codeOpen, setCodeOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [codeMaxUses, setCodeMaxUses] = useState("1");
  const [copied, setCopied] = useState(false);
  const [savingCode, setSavingCode] = useState(false);

  // Onboard client dialog
  const [onboardOpen, setOnboardOpen] = useState(false);
  const [onboardName, setOnboardName] = useState("");
  const [onboardEmail, setOnboardEmail] = useState("");
  const [onboarding, setOnboarding] = useState(false);

  const load = async () => {
    // Fetch only users with role = 'client'
    const { data: roleRows } = await supabase.from("user_roles").select("user_id").eq("role", "client");
    const clientIds = (roleRows ?? []).map((r) => r.user_id);
    if (!clientIds.length) { setRows([]); return; }

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, company_name, status, created_at, assigned_employee_id")
      .in("id", clientIds)
      .order("created_at", { ascending: false });

    const empIds = [...new Set((profiles ?? []).map((p) => p.assigned_employee_id).filter(Boolean) as string[])];
    let empNames: Record<string, string> = {};
    if (empIds.length) {
      const { data: empProfiles } = await supabase.from("profiles").select("id,full_name").in("id", empIds);
      (empProfiles ?? []).forEach((p) => { empNames[p.id] = p.full_name ?? "Employee"; });
    }

    setRows((profiles ?? []).map((p) => ({
      id: p.id, full_name: p.full_name, company_name: p.company_name,
      status: p.status ?? "unknown", created_at: p.created_at,
      assignedEmployee: p.assigned_employee_id ? (empNames[p.assigned_employee_id] ?? "Employee") : null,
    })));
  };

  useEffect(() => { load(); }, []);

  const filtered = rows.filter((r) => {
    const matchQ = !q || (r.full_name ?? "").toLowerCase().includes(q.toLowerCase()) || (r.company_name ?? "").toLowerCase().includes(q.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchQ && matchStatus;
  });

  const openCode = () => { setGeneratedCode(genCode()); setCopied(false); setCodeMaxUses("1"); setCodeOpen(true); };
  const copyCode = () => { navigator.clipboard.writeText(generatedCode); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const saveCode = async () => {
    setSavingCode(true);
    const expires = new Date(); expires.setDate(expires.getDate() + 7);
    const { error } = await supabase.from("access_codes").insert({
      code: generatedCode, role: "client" as any,
      max_uses: parseInt(codeMaxUses) || 1,
      expires_at: expires.toISOString(), created_by: user?.id ?? null,
    });
    setSavingCode(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Client access code saved.");
    setCodeOpen(false);
  };

  const onboardClient = async () => {
    if (!onboardName.trim() || !onboardEmail.trim()) { toast.error("Name and email required"); return; }
    setOnboarding(true);
    // Create a unique client access code and log to console (proper invite would email it)
    const code = genCode();
    const expires = new Date(); expires.setDate(expires.getDate() + 30);
    await supabase.from("access_codes").insert({ code, role: "client" as any, max_uses: 1, expires_at: expires.toISOString(), created_by: user?.id ?? null });
    setOnboarding(false);
    toast.success(`Client onboarding code: ${code} — share this with ${onboardName}.`);
    setOnboardOpen(false);
    setOnboardName(""); setOnboardEmail("");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-secondary p-7 shadow-yellow flex flex-wrap items-center justify-between gap-4">
        <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-primary/20" />
        <div className="relative">
          <h1 className="font-display text-4xl text-foreground">Clients</h1>
          <p className="text-foreground/75 mt-1">{rows.length} total</p>
        </div>
        <div className="flex gap-2 relative flex-wrap">
          <Button variant="outline" className="rounded-full" onClick={openCode}><Key className="h-4 w-4" /> Generate access code</Button>
          <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow" onClick={() => setOnboardOpen(true)}><UserPlus className="h-4 w-4" /> Onboard client</Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input placeholder="Search by name or company" value={q} onChange={(e) => setQ(e.target.value)} className="flex-1 rounded-full" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-52 rounded-full"><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {Object.keys(STATUS_LABEL).map((s) => <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-3xl bg-card border border-border p-6">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            {rows.length === 0 ? "No clients onboarded yet. Generate an access code to get started." : "No clients match your search."}
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((r) => (
              <li key={r.id} className="py-4">
                <Link to={`/app/manager/clients/${r.id}`} className="flex items-center justify-between gap-4 group">
                  <div className="flex items-center gap-3 min-w-0">
                    <RoleAvatar role="jobseeker" size={44} />
                    <div className="min-w-0">
                      <div className="font-medium text-foreground truncate">{r.full_name ?? "Unnamed"}</div>
                      <div className="text-xs text-muted-foreground">{r.company_name ?? "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 flex-wrap justify-end">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[r.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {STATUS_LABEL[r.status] ?? r.status}
                    </span>
                    {r.assignedEmployee && (
                      <span className="text-xs text-muted-foreground hidden sm:block">{r.assignedEmployee}</span>
                    )}
                    <span className="text-xs text-muted-foreground hidden md:block">{new Date(r.created_at).toLocaleDateString()}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Generate access code dialog */}
      <Dialog open={codeOpen} onOpenChange={setCodeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate client access code</DialogTitle>
            <DialogDescription>Share this code with the client. They enter it on sign-up.</DialogDescription>
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
              <Select value={codeMaxUses} onValueChange={setCodeMaxUses}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>{["1","2","5","10"].map((v) => <SelectItem key={v} value={v}>{v} use{v !== "1" ? "s" : ""}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">Expires in 7 days.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCodeOpen(false)}>Cancel</Button>
            <Button onClick={saveCode} disabled={savingCode} className="gradient-primary text-primary-foreground border-0">
              {savingCode ? "Saving…" : "Save code"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Onboard client dialog */}
      <Dialog open={onboardOpen} onOpenChange={setOnboardOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Onboard new client</DialogTitle>
            <DialogDescription>A unique access code will be generated. Share it with the client to complete sign-up.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Client full name</Label><Input className="mt-1.5" value={onboardName} onChange={(e) => setOnboardName(e.target.value)} placeholder="Jane Doe" /></div>
            <div><Label>Email (for your records)</Label><Input className="mt-1.5" type="email" value={onboardEmail} onChange={(e) => setOnboardEmail(e.target.value)} placeholder="jane@example.com" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOnboardOpen(false)}>Cancel</Button>
            <Button onClick={onboardClient} disabled={onboarding} className="gradient-primary text-primary-foreground border-0">
              {onboarding ? "Generating…" : "Generate & onboard"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagerClients;
