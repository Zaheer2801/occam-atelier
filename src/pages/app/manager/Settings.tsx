import { useEffect, useState } from "react";
import { LogOut, Copy, Check, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AccessCode { code: string; role: string; max_uses: number; used_count: number; expires_at: string | null; created_at: string; }

const genCode = (role: string) => {
  const prefix = role === "client" ? "CAN" : role === "employee" ? "EMP" : "MGR";
  return `OCAS-${prefix}-${Math.floor(Math.random() * 900) + 100}`;
};

const ManagerSettings = () => {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);

  // Access codes
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [newRole, setNewRole] = useState("client");
  const [newMaxUses, setNewMaxUses] = useState("1");
  const [generatedCode, setGeneratedCode] = useState("");
  const [copiedCode, setCopiedCode] = useState("");
  const [generatingCode, setGeneratingCode] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (data) setFullName(data.full_name ?? "");
    })();
    loadCodes();
  }, [user]);

  const loadCodes = async () => {
    const { data } = await supabase.from("access_codes").select("*").order("created_at", { ascending: false }).limit(20);
    setCodes((data ?? []) as AccessCode[]);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: fullName.slice(0, 100) }).eq("id", user.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Saved");
  };

  const createCode = async () => {
    const code = genCode(newRole);
    setGeneratingCode(true);
    const expires = new Date(); expires.setDate(expires.getDate() + 7);
    const { error } = await supabase.from("access_codes").insert({
      code, role: newRole as any,
      max_uses: parseInt(newMaxUses) || 1,
      expires_at: expires.toISOString(),
      created_by: user?.id ?? null,
    });
    setGeneratingCode(false);
    if (error) { toast.error(error.message); return; }
    setGeneratedCode(code);
    toast.success("Code created");
    loadCodes();
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const deleteCode = async (code: string) => {
    await supabase.from("access_codes").delete().eq("code", code);
    setCodes((prev) => prev.filter((c) => c.code !== code));
    toast.success("Code deleted");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Account and system configuration.</p>
      </div>

      {/* Account */}
      <form onSubmit={save} className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-display font-semibold">Account</h3>
        <div><Label htmlFor="email">Email</Label><Input id="email" value={user?.email ?? ""} disabled className="mt-1.5" /></div>
        <div><Label htmlFor="fn">Full name</Label><Input id="fn" value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={100} className="mt-1.5" /></div>
        <Button type="submit" disabled={saving} className="gradient-primary text-primary-foreground border-0">{saving ? "Saving…" : "Save changes"}</Button>
      </form>

      {/* Access code management */}
      <div className="glass rounded-2xl p-6 space-y-5">
        <h3 className="font-display font-semibold">Access codes</h3>

        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <Label className="text-xs">Role</Label>
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger className="mt-1 w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Max uses</Label>
            <Select value={newMaxUses} onValueChange={setNewMaxUses}>
              <SelectTrigger className="mt-1 w-28"><SelectValue /></SelectTrigger>
              <SelectContent>{["1","2","5","10"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Button onClick={createCode} disabled={generatingCode} className="gradient-primary text-primary-foreground border-0">
            <Plus className="h-4 w-4" /> Generate
          </Button>
        </div>

        {generatedCode && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary border border-border">
            <span className="font-mono text-sm flex-1">{generatedCode}</span>
            <Button variant="ghost" size="icon" onClick={() => copyCode(generatedCode)}>
              {copiedCode === generatedCode ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}

        {codes.length > 0 && (
          <div className="divide-y divide-border/50 text-sm">
            {codes.map((c) => (
              <div key={c.code} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-mono font-medium">{c.code}</span>
                  <span className="ml-2 text-xs text-muted-foreground capitalize">{c.role}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">{c.used_count}/{c.max_uses} used</span>
                  <Button variant="ghost" size="icon" onClick={() => copyCode(c.code)}>
                    {copiedCode === c.code ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteCode(c.code)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sign out */}
      <div className="glass rounded-2xl p-6">
        <Button variant="outline" onClick={async () => { await signOut(); nav("/"); }}>
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>
    </div>
  );
};

export default ManagerSettings;
