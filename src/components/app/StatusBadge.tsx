import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  applied: "bg-info/15 text-info border-info/30",
  screening: "bg-warning/15 text-warning border-warning/30",
  interview: "bg-primary/15 text-primary border-primary/30",
  offer: "bg-success/15 text-success border-success/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
  withdrawn: "bg-muted text-muted-foreground border-border",
};

export const StatusBadge = ({ status }: { status: string }) => (
  <span className={cn("px-2 py-0.5 rounded-full border text-xs font-medium capitalize", map[status] ?? map.applied)}>
    {status}
  </span>
);
