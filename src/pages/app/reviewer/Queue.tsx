import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Edit3, Clock, Briefcase, AlertTriangle, Loader2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface QueueItem {
  id: string;
  queue_type: string;
  candidate_name: string;
  job_title: string;
  company: string;
  fit_score: number | null;
  confidence: number | null;
  auth_score: number | null;
  cover_text: string;
  job_url: string;
  ats_type: string;
  minutes_waiting: number;
  payload: Record<string, unknown>;
}

interface Stats {
  pending_review: number;
  manual_required: number;
  failed: number;
  total: number;
}

const ScoreBadge = ({ value, label }: { value: number | null; label: string }) => {
  if (value === null) return null;
  const pct = Math.round(value * 100);
  const color = pct >= 90 ? "bg-green-100 text-green-800" : pct >= 70 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800";
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>{label}: {pct}%</span>;
};

const QueueItem = ({
  item, reviewerId, onResolved,
}: {
  item: QueueItem; reviewerId: string; onResolved: (id: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [editingCover, setEditingCover] = useState(false);
  const [coverText, setCoverText] = useState(item.cover_text || "");
  const [loading, setLoading] = useState(false);

  const act = async (endpoint: string, body: object) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/reviewer/${endpoint}/${item.id}`, {
        method: endpoint === "cover" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewer_id: reviewerId, ...body }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(endpoint === "approve" ? "Approved — applying now" : endpoint === "complete" ? "Marked complete" : "Skipped");
      onResolved(item.id);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Action failed");
    } finally {
      setLoading(false);
    }
  };

  const saveCover = async () => {
    await act("cover", { cover_text: coverText });
    setEditingCover(false);
    toast.success("Cover text updated");
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-5 flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-foreground">{item.candidate_name}</span>
            <span className="text-muted-foreground text-sm">→</span>
            <span className="font-medium text-foreground truncate">{item.job_title}</span>
            <span className="text-muted-foreground text-sm">at {item.company}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <ScoreBadge value={item.fit_score} label="Fit" />
            <ScoreBadge value={(item.confidence ?? 0) / 100} label="Conf" />
            <ScoreBadge value={item.auth_score} label="Auth" />
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> {item.minutes_waiting}m waiting
            </span>
            {item.ats_type && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{item.ats_type}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {item.job_url && (
            <a href={item.job_url} target="_blank" rel="noreferrer"
               className="text-muted-foreground hover:text-primary">
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <Button variant="ghost" size="sm" onClick={() => setExpanded((v) => !v)}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border p-5 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Generated cover paragraph</p>
              <Button variant="ghost" size="sm" onClick={() => setEditingCover((v) => !v)}>
                <Edit3 className="h-3.5 w-3.5 mr-1" /> {editingCover ? "Cancel" : "Edit"}
              </Button>
            </div>
            {editingCover ? (
              <div className="space-y-2">
                <Textarea value={coverText} onChange={(e) => setCoverText(e.target.value)} rows={5} className="text-sm" />
                <Button size="sm" onClick={saveCover} disabled={loading}>Save cover text</Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 rounded-xl p-4">
                {coverText || <em>No cover text generated</em>}
              </p>
            )}
          </div>

          {item.payload?.flags && (Array.isArray(item.payload.flags) && item.payload.flags.length > 0) && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
              <p className="text-xs font-semibold text-amber-800 mb-1 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> Authenticity flags
              </p>
              <ul className="text-xs text-amber-700 list-disc list-inside space-y-0.5">
                {(item.payload.flags as string[]).map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            {item.queue_type === "pending_review" && (
              <Button
                onClick={() => act("approve", {})}
                disabled={loading}
                className="rounded-full gradient-primary text-primary-foreground border-0"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                Approve & apply
              </Button>
            )}
            {item.queue_type === "manual_required" && (
              <Button
                onClick={() => act("complete", {})}
                disabled={loading}
                className="rounded-full gradient-primary text-primary-foreground border-0"
              >
                <CheckCircle className="h-4 w-4" /> Mark manually applied
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => act("skip", { reason: "reviewer_rejected" })}
              disabled={loading}
              className="rounded-full"
            >
              <XCircle className="h-4 w-4" /> Skip
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const ReviewerQueue = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<"pending_review" | "manual_required" | "failed">("pending_review");
  const [items, setItems] = useState<QueueItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async (qtype: string) => {
    setLoading(true);
    try {
      const [qRes, sRes] = await Promise.all([
        fetch(`${API}/api/reviewer/queue?queue_type=${qtype}&limit=50`),
        fetch(`${API}/api/reviewer/stats`),
      ]);
      const qd = await qRes.json();
      const sd = await sRes.json();
      setItems(qd.items || []);
      setStats(sd.counts ? { ...sd.counts, total: sd.total } : null);
    } catch {
      toast.error("Failed to load queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(tab); }, [tab]);

  const onResolved = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const TABS: { key: "pending_review" | "manual_required" | "failed"; label: string }[] = [
    { key: "pending_review",  label: "Pending review" },
    { key: "manual_required", label: "Manual required" },
    { key: "failed",          label: "Failed" },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-secondary p-7 shadow-yellow">
        <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-primary/20" />
        <h1 className="font-display text-4xl text-foreground relative">Review Queue</h1>
        <p className="text-foreground/75 mt-1 relative">
          {stats ? `${stats.pending_review} pending · ${stats.manual_required} manual · ${stats.failed} failed` : "Loading stats…"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl bg-muted/50 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t.key ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
            {stats && (
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                tab === t.key ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}>
                {stats[t.key] ?? 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-card border border-border">
          <Briefcase className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="font-display text-xl text-foreground">All clear</p>
          <p className="text-sm text-muted-foreground mt-1">No items in this queue.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <QueueItem
              key={item.id}
              item={item}
              reviewerId={user?.id || ""}
              onResolved={onResolved}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewerQueue;
