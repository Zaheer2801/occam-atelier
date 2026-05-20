import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Briefcase, MapPin, Phone, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/app/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const appStatuses = ["applied", "screening", "interview", "offer", "rejected", "withdrawn"] as const;
const clientStatuses = ["pending_code", "onboarding", "resume_review", "roles_locked", "pending_assignment", "assigned", "inactive"] as const;
const CLIENT_STATUS_LABEL: Record<string, string> = {
  pending_code: "Pending code", onboarding: "Onboarding", resume_review: "Resume review",
  roles_locked: "Roles locked", pending_assignment: "Pending assignment", assigned: "Assigned", inactive: "Inactive",
};
const PAGE_SIZE = 20;

interface Profile {
  id: string; full_name: string | null; phone: string | null;
  location: string | null; company_name: string | null; status: string | null;
  target_roles: string[]; assigned_employee_id: string | null;
}
interface App { id: string; position: string; company: string; status: string; applied_date: string; }
interface Employee { id: string; name: string; }

const ManagerClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [apps, setApps] = useState<App[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [assignedEmployeeName, setAssignedEmployeeName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingAssign, setSavingAssign] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const [{ data: prof }, { data: appData }, { data: empRoles }] = await Promise.all([
        supabase.from("profiles").select("id,full_name,phone,location,company_name,status,target_roles,assigned_employee_id").eq("id", id).maybeSingle(),
        supabase.from("job_applications").select("id,position,company,status,applied_date").eq("client_id", id).order("applied_date", { ascending: false }),
        supabase.from("user_roles").select("user_id").eq("role", "employee"),
      ]);

      setProfile(prof as Profile | null);
      setApps((appData ?? []) as App[]);

      const empIds = (empRoles ?? []).map((r) => r.user_id);
      if (empIds.length) {
        const { data: empProfiles } = await supabase.from("profiles").select("id,full_name").in("id", empIds);
        setEmployees((empProfiles ?? []).map((p) => ({ id: p.id, name: p.full_name ?? p.id.slice(0, 8) })));
        if (prof?.assigned_employee_id) {
          const found = (empProfiles ?? []).find((p) => p.id === prof.assigned_employee_id);
          setAssignedEmployeeName(found?.full_name ?? null);
        }
      }

      setLoading(false);
    })();
  }, [id]);

  const updateClientStatus = async (newStatus: string) => {
    if (!profile) return;
    setSavingStatus(true);
    const { error } = await supabase.from("profiles").update({ status: newStatus as any }).eq("id", profile.id);
    setSavingStatus(false);
    if (error) { toast.error(error.message); return; }
    setProfile((p) => p ? { ...p, status: newStatus } : p);
    toast.success("Client status updated");
  };

  const assignEmployee = async (empId: string) => {
    if (!profile) return;
    setSavingAssign(true);
    // Update profiles.assigned_employee_id and upsert employee_client_assignments
    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase.from("profiles").update({ assigned_employee_id: empId } as any).eq("id", profile.id),
      supabase.from("employee_client_assignments").upsert({ employee_id: empId, client_id: profile.id, is_active: true }, { onConflict: "employee_id,client_id" }),
    ]);
    setSavingAssign(false);
    if (e1 || e2) { toast.error((e1 ?? e2)?.message ?? "Error assigning employee"); return; }
    const emp = employees.find((e) => e.id === empId);
    setAssignedEmployeeName(emp?.name ?? null);
    setProfile((p) => p ? { ...p, assigned_employee_id: empId } : p);
    toast.success("Employee assigned");
  };

  const updateAppStatus = async (appId: string, status: string) => {
    await supabase.from("job_applications").update({ status: status as any }).eq("id", appId);
    setApps((prev) => prev.map((a) => (a.id === appId ? { ...a, status } : a)));
    toast.success("Status updated");
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-5xl mx-auto py-16 text-center text-muted-foreground">
        Client not found.
        <Link to="/app/manager/clients" className="block mt-3 text-primary story-link">← Back to clients</Link>
      </div>
    );
  }

  const total = apps.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const paginated = apps.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link to="/app/manager/clients" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to clients
      </Link>

      {/* Profile card */}
      <div className="rounded-3xl bg-card border border-border p-6 flex flex-col sm:flex-row gap-6">
        <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-2xl font-display font-bold text-primary-foreground shrink-0 shadow-glow">
          {(profile.full_name ?? "?")[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-bold text-foreground">{profile.full_name ?? "Unnamed"}</h1>
          {profile.company_name && <p className="text-muted-foreground text-sm mt-0.5">{profile.company_name}</p>}
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            {profile.location && <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{profile.location}</span>}
            {profile.phone && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{profile.phone}</span>}
          </div>
          {profile.target_roles?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {profile.target_roles.map((r) => (
                <span key={r} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">{r}</span>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 shrink-0 min-w-[160px]">
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Client status</p>
            <Select value={profile.status ?? "unknown"} onValueChange={updateClientStatus} disabled={savingStatus}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {clientStatuses.map((s) => <SelectItem key={s} value={s} className="text-xs">{CLIENT_STATUS_LABEL[s]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1"><UserCheck className="h-3 w-3" /> Assigned recruiter</p>
            <Select value={profile.assigned_employee_id ?? "none"} onValueChange={(v) => v !== "none" && assignEmployee(v)} disabled={savingAssign}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Unassigned">{assignedEmployeeName ?? "Unassigned"}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" className="text-xs text-muted-foreground">Unassigned</SelectItem>
                {employees.map((e) => <SelectItem key={e.id} value={e.id} className="text-xs">{e.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-foreground">{total}</div>
            <div className="text-xs text-muted-foreground">Applications</div>
          </div>
        </div>
      </div>

      {/* Applications */}
      <div className="rounded-3xl bg-card border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <Briefcase className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl font-semibold">Applications</h2>
          <span className="text-sm text-muted-foreground ml-auto">{total} total</span>
        </div>
        {apps.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">No applications yet for this client.</div>
        ) : (
          <>
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
                {paginated.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.position}</TableCell>
                    <TableCell>{a.company}</TableCell>
                    <TableCell>
                      <Select value={a.status} onValueChange={(v) => updateAppStatus(a.id, v)}>
                        <SelectTrigger className="h-8 w-36 border-0 bg-transparent p-0 hover:bg-muted/50">
                          <StatusBadge status={a.status} />
                        </SelectTrigger>
                        <SelectContent>
                          {appStatuses.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
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

export default ManagerClientDetail;
